/**
 * Vgo 平台工业级原子抢单与状态流转引擎
 * 采用 PostgreSQL 行级互斥锁 (Row-Level Locking) 保证强一致性，杜绝超卖与并发并发撞单
 */

const { Pool } = require('pg');

class VgoDispatchEngine {
  constructor(pgPool) {
    this.pool = pgPool || new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/vgo_production'
    });
  }

  /**
   * 核心原子接单方法
   * @param {string} orderId 工单 UUID
   * @param {string} artisanProfileId 手艺人档案 UUID
   */
  async atomicClaimOrder(orderId, artisanProfileId) {
    const client = await this.pool.connect();

    try {
      // 开启显式数据库事务
      await client.query('BEGIN');

      // 1. 使用 FOR UPDATE 强行锁定该行工单数据，防止其他并发事务读取或修改
      const selectSql = `
        SELECT id, order_sn, status, is_ladies_only, final_customer_paid, artisan_net_payout
        FROM orders
        WHERE id = $1
        FOR UPDATE;
      `;
      const orderRes = await client.query(selectSql, [orderId]);

      if (orderRes.rowCount === 0) {
        throw new Error('ORDER_NOT_FOUND: 该工单不存在');
      }

      const order = orderRes.rows[0];

      // 2. 状态校验：只有处于 PENDING_DISPATCH (广播中) 的工单允许被接
      if (order.status !== 'PENDING_DISPATCH') {
        throw new Error(`ORDER_ALREADY_CLAIMED: 该工单已被其他师傅接走，当前状态为 [${order.status}]`);
      }

      // 3. 手艺人准入校验：锁定手艺人档案并核查合法性与工签状态
      const artisanSql = `
        SELECT id, compliance_status, is_active_listening, cash_deposit_balance, commission_tier
        FROM artisan_profiles
        WHERE id = $1
        FOR UPDATE;
      `;
      const artisanRes = await client.query(artisanSql, [artisanProfileId]);
      if (artisanRes.rowCount === 0) {
        throw new Error('ARTISAN_NOT_FOUND: 手艺人档案不存在');
      }

      const artisan = artisanRes.rows[0];
      if (artisan.compliance_status !== 'APPROVED') {
        throw new Error(`COMPLIANCE_BLOCKED: 手艺人准入受限，状态为 [${artisan.compliance_status}]`);
      }

      // 4. 原子状态机跃迁：将工单指派给该手艺人，状态跃迁至 ASSIGNED
      const updateSql = `
        UPDATE orders
        SET artisan_id = $1,
            status = 'ASSIGNED',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, order_sn, status, artisan_id;
      `;
      const updateRes = await client.query(updateSql, [artisanProfileId, orderId]);

      // 5. 提交事务，释放行级锁
      await client.query('COMMIT');

      return {
        success: true,
        orderSn: order.order_sn,
        claimedAt: new Date().toISOString(),
        status: 'ASSIGNED'
      };

    } catch (error) {
      // 遇到任何并发抢单失败或校验错误，立即安全回滚事务
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = VgoDispatchEngine;
