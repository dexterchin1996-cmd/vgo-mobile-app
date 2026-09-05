const express = require('express');
const router = express.Router();
const dispatchEngine = require('../services/dispatchEngine');
const escrowService = require('../services/escrowService');
const webhookGateway = require('../services/webhookGateway');
const lifecycleEngine = require('../services/orderLifecycleEngine');
const { query } = require('../config/db');

// 1. 服务健康度探针
router.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Vgo Enterprise Core API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 2. 创建订单接口
router.post('/orders/create', async (req, res) => {
  try {
    const result = await lifecycleEngine.createOrder(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. 高并发原子抢单接口 (基于 PostgreSQL 行级排他锁)
router.post('/dispatch/claim', async (req, res) => {
  const { orderId, artisanId } = req.body;
  try {
    const result = await dispatchEngine.atomicClaimOrder(orderId, artisanId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(409).json({ success: false, error: err.message });
  }
});

// 4. 现场二次加价锁申请
router.post('/orders/secondary-quote', async (req, res) => {
  const { orderId, partName, extraAmount, evidenceUrl } = req.body;
  try {
    const result = await lifecycleEngine.submitSecondaryQuote(orderId, partName, extraAmount, evidenceUrl);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. 客户授权同意二次加价
router.post('/orders/secondary-quote/approve', async (req, res) => {
  const { quoteId } = req.body;
  try {
    const result = await lifecycleEngine.approveSecondaryQuote(quoteId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. 6位核销码完工验收与资金双记账解冻
router.post('/orders/verify-complete', async (req, res) => {
  const { orderId, verificationCode } = req.body;
  try {
    const result = await lifecycleEngine.verifyAndCompleteOrder(orderId, verificationCode);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 7. 总控后台财务审计专用接口 (查询双记账账簿)
router.get('/admin/financial-ledger', async (req, res) => {
  try {
    const r = await query(`
      SELECT transaction_ref, order_id, account_type, debit_amount, credit_amount, currency, narrative, posted_at
      FROM financial_ledger
      ORDER BY posted_at DESC
      LIMIT 50;
    `);
    res.json({ success: true, records: r.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
