const { Pool } = require('pg');

class VgoDispatchEngine {
  constructor(pgPool) {
    this.pool = pgPool || new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/vgo_production'
    });
  }

  async atomicClaimOrder(orderId, artisanProfileId) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const selectSql = `
        SELECT id, order_sn, status, is_ladies_only, final_customer_paid, artisan_net_payout
        FROM orders
        WHERE id = $1
        FOR UPDATE;
      `;
      const orderRes = await client.query(selectSql, [orderId]);

      if (orderRes.rowCount === 0) {
        throw new Error('ORDER_NOT_FOUND: 工单不存在');
      }

      const order = orderRes.rows[0];
      if (order.status !== 'PENDING_DISPATCH') {
        throw new Error(`ORDER_ALREADY_CLAIMED: 该单已被接走，当前状态 [${order.status}]`);
      }

      const artisanSql = `
        SELECT id, compliance_status, is_active_listening, cash_deposit_balance
        FROM artisan_profiles
        WHERE id = $1
        FOR UPDATE;
      `;
      const artisanRes = await client.query(artisanSql, [artisanProfileId]);
      if (artisanRes.rowCount === 0) {
        throw new Error('ARTISAN_NOT_FOUND: 手艺人不存在');
      }

      const artisan = artisanRes.rows[0];
      if (artisan.compliance_status !== 'APPROVED') {
        throw new Error(`COMPLIANCE_BLOCKED: 手艺人合规准入受限 [${artisan.compliance_status}]`);
      }

      const updateSql = `
        UPDATE orders
        SET artisan_id = $1, status = 'ASSIGNED', updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, order_sn, status, artisan_id;
      `;
      const updateRes = await client.query(updateSql, [artisanProfileId, orderId]);

      await client.query('COMMIT');
      return { success: true, orderSn: order.order_sn, status: 'ASSIGNED', claimedAt: new Date().toISOString() };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = VgoDispatchEngine;
