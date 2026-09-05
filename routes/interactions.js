const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/massage_db'
});

router.post('/upload-audio', (req, res) => {
  const { audioData } = req.body;
  if (!audioData) return res.status(400).json({ success: false, error: '缺少音频数据' });

  try {
    const base64Data = audioData.replace(/^data:audio\/\w+;base64,/, "");
    const fileName = `voice_${Date.now()}.webm`;
    const filePath = path.join(__dirname, '../uploads/audio', fileName);

    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    res.json({ success: true, url: `/uploads/audio/${fileName}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/messages', async (req, res) => {
  const { orderId, senderRole, content } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO order_messages (order_id, sender_role, content) VALUES ($1, $2, $3) RETURNING *`,
      [orderId || 1, senderRole || 'customer', content]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/orders/:id/review', async (req, res) => {
  const { id } = req.params;
  const { rating, tags, comment } = req.body;
  try {
    await pool.query(
      `UPDATE orders SET rating = $1, review_tags = $2, review_comment = $3, status = 'COMPLETED' WHERE id = $4`,
      [rating || 5, tags || [], comment || '', id]
    );
    res.json({ success: true, message: '评价提交成功，订单已闭环！' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
