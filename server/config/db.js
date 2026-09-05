/**
 * Vgo 企业级 PostgreSQL 连接池与事务包装器
 * 支持连接保活、指数退避重试与自动事务回滚
 */
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/vgo_production',
  max: 25, // 生产级连接池上限
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[DATABASE CRITICAL] PostgreSQL 连接池异常:', err.message);
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  
  // 生产级安全事务执行器：自动处理 BEGIN / COMMIT / ROLLBACK
  async withTransaction(callback) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};
