const express = require('express');
const router = express.Router();
const dispatchEngine = require('../services/dispatchEngine');
const escrowService = require('../services/escrowService');
const webhookGateway = require('../services/webhookGateway');

// 1. 服务健康检查接口
router.get('/health', async (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Vgo Enterprise Core API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 2. 高并发原子抢单接口 (基于 PostgreSQL 行级锁)
router.post('/dispatch/claim', async (req, res) => {
  const { orderId, artisanId } = req.body;
  if (!orderId || !artisanId) {
    return res.status(400).json({ error: 'MISSING_PARAMS', message: '必须提供 orderId 和 artisanId' });
  }

  try {
    const result = await dispatchEngine.atomicClaimOrder(orderId, artisanId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(409).json({ success: false, error: err.message });
  }
});

// 3. 支付网关 Webhook 回调接收端 (自动触发双记账托管)
router.post('/webhooks/payment', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['x-vgo-signature'] || req.headers['stripe-signature'];
  const webhookSecret = process.env.WEBHOOK_SECRET || 'vgo_prod_secret_mock_2026';
  
  const rawBody = req.body.toString();
  const isValid = webhookGateway.verifyCurlecSignature(rawBody, signature, webhookSecret);

  if (!isValid && process.env.NODE_ENV === 'production') {
    return res.status(401).json({ error: 'INVALID_SIGNATURE', message: '签名验真失败' });
  }

  try {
    const event = JSON.parse(rawBody);
    if (event.type === 'PAYMENT_SUCCESS') {
      const { orderId, totalPaid, baseAmount, taxAmount, insuranceFee, currency } = event.data;
      await escrowService.lockEscrowDeposit(orderId, totalPaid, baseAmount, taxAmount, insuranceFee, currency);
    }
    res.json({ received: true });
  } catch (e) {
    res.status(500).json({ error: 'PROCESS_ERROR', message: e.message });
  }
});

module.exports = router;
