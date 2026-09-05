const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/massage_db'
});

async function initTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS demand_posts (
          id SERIAL PRIMARY KEY,
          customer_id INT NOT NULL,
          category VARCHAR(50) NOT NULL,
          title VARCHAR(150) NOT NULL,
          description TEXT,
          media_urls TEXT[],
          budget_estimate DECIMAL(10, 2),
          address TEXT NOT NULL,
          status VARCHAR(30) DEFAULT 'open',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS bids (
          id SERIAL PRIMARY KEY,
          post_id INT REFERENCES demand_posts(id) ON DELETE CASCADE,
          technician_id INT NOT NULL,
          quoted_price DECIMAL(10, 2) NOT NULL,
          estimated_arrival_minutes INT NOT NULL,
          notes TEXT,
          status VARCHAR(30) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch(e) {
    console.error("Table init error:", e.message);
  }
}
initTables();

router.post('/demands', async (req, res) => {
  const { customer_id, category, title, description, budget_estimate, address } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO demand_posts (customer_id, category, title, description, budget_estimate, address) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [customer_id || 1, category || 'plumbing', title, description || '', budget_estimate || 100, address || 'Asia City, Kota Kinabalu']
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/demands', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM demand_posts WHERE status = \'open\' ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/bids', async (req, res) => {
  const { post_id, technician_id, quoted_price, estimated_arrival_minutes, notes } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO bids (post_id, technician_id, quoted_price, estimated_arrival_minutes, notes) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [post_id, technician_id || 88, quoted_price, estimated_arrival_minutes || 15, notes || '专业快修，随叫随到']
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/demands/:id/bids', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM bids WHERE post_id = $1 ORDER BY quoted_price ASC', [id]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/bids/accept', async (req, res) => {
  const { bid_id, post_id } = req.body;
  try {
    await pool.query('UPDATE demand_posts SET status = \'locked\' WHERE id = $1', [post_id]);
    await pool.query('UPDATE bids SET status = \'accepted\' WHERE id = $1', [bid_id]);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    res.json({ success: true, message: '锁单成功，Escrow资金已托管', data: { verification_code: verificationCode } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
