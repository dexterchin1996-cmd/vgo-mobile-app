const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/vgo_db'
});

// 初始化 Vgo MVP 核心表结构
async function initVgoDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        role VARCHAR(20) NOT NULL, -- 'customer', 'merchant', 'therapist'
        name VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS merchants (
        id SERIAL PRIMARY KEY,
        shop_name VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        is_open BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        merchant_id INT REFERENCES merchants(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        duration_minutes INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS vgo_orders (
        id SERIAL PRIMARY KEY,
        customer_id INT,
        merchant_id INT,
        service_id INT,
        verification_code VARCHAR(6) NOT NULL,
        status VARCHAR(30) DEFAULT 'LOCKED', -- 'LOCKED', 'COMPLETED', 'CANCELLED'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ [Vgo 数据库] MVP 核心表结构初始化成功！");
  } catch (err) {
    console.error("❌ 数据库初始化失败:", err.message);
  }
}
initVgoDatabase();

// ---------------------------------------------------------
// 1. 顾客端接口：创建预约订单并生成 6 位核销码
// ---------------------------------------------------------
app.post('/api/v1/orders/create', async (req, res) => {
  const { customer_id, merchant_id, service_id } = req.body;
  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const result = await pool.query(
      `INSERT INTO vgo_orders (customer_id, merchant_id, service_id, verification_code, status)
       VALUES ($1, $2, $3, $4, 'LOCKED') RETURNING *;`,
      [customer_id || 1, merchant_id || 1, service_id || 1, verificationCode]
    );
    res.status(201).json({
      success: true,
      message: '预约成功，资金已托管',
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------
// 2. 商家端接口：6位核销码验证与履约完成
// ---------------------------------------------------------
app.post('/api/v1/merchant/verify', async (req, res) => {
  const { verification_code, merchant_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE vgo_orders 
       SET status = 'COMPLETED' 
       WHERE verification_code = $1 AND merchant_id = $2 AND status = 'LOCKED' 
       RETURNING *;`,
      [verification_code, merchant_id || 1]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, error: '核销码无效或订单已处理' });
    }
    res.json({
      success: true,
      message: '核销成功，服务已完成',
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 [Vgo MVP Backend] 引擎已在端口 ${PORT} 稳定运行`);
});
