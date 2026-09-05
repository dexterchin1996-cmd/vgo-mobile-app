const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/massage_db'
});

// 获取技师或用户钱包余额及流水
router.get('/wallet', async (req, res) => {
  try {
    res.json({ success: true, balance: 280.00, currency: 'MYR', message: '钱包账目正常' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 充值网关回调与模拟接口
router.post('/topup', async (req, res) => {
  const { amount, method } = req.body;
  try {
    res.json({ success: true, message: `成功通过 ${method || 'Touch \'n Go'} 充值 RM ${amount || 50.00}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
