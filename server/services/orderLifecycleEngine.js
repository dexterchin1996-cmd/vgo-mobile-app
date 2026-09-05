/**
 * Vgo 订单全生命周期状态机与二次加价锁核心
 */
const { withTransaction, query } = require('../config/db');
const escrowService = require('./escrowService');
const crypto = require('crypto');

class VgoOrderLifecycleEngine {
  // 1. 创建新工单并入库
  async createOrder(data) {
    const { customerId, serviceType, baseAmount, taxType = 'SST', currency = 'MYR', isLadiesOnly = false, isAirbnb = false } = data;
    const taxRate = currency === 'MYR' ? 0.08 : 0.09;
    const taxAmount = +(baseAmount * taxRate).toFixed(2);
    const insuranceFee = currency === 'MYR' ? 1.00 : 0.80;
    const finalCustomerPaid = +(baseAmount + taxAmount + insuranceFee).toFixed(2);

    const orderSn = 'VG' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.floor(100000 + Math.random() * 900000);
    // 生成 6 位明文核销码与 SHA256 哈希
    const rawVerifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyHash = crypto.createHash('sha256').update(rawVerifyCode).digest('hex');

    const sql = `
      INSERT INTO orders (
        order_sn, customer_id, service_type, currency, base_service_amount,
        tax_type, tax_rate, tax_amount, insurance_fee, final_customer_paid,
        verification_code_hash, is_ladies_only, is_airbnb_emergency, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'AWAITING_PAYMENT')
      RETURNING id, order_sn, final_customer_paid, currency, status;
    `;

    const res = await query(sql, [
      orderSn, customerId, serviceType, currency, baseAmount,
      taxType, taxRate, taxAmount, insuranceFee, finalCustomerPaid,
      verifyHash, isLadiesOnly, isAirbnb
    ]);

    return { ...res.rows[0], rawVerifyCode };
  }

  // 2. 发起现场二次加价锁 (如施工时发现老化漏水或压缩机烧毁)
  async submitSecondaryQuote(orderId, partName, extraAmount, evidenceUrl) {
    const sql = `
      INSERT INTO secondary_quotes (order_id, part_name, extra_amount, damage_evidence_url)
      VALUES ($1, $2, $3, $4)
      RETURNING id, order_id, part_name, extra_amount, customer_approval_status;
    `;
    const res = await query(sql, [orderId, partName, extraAmount, evidenceUrl]);
    return res.rows[0];
  }

  // 3. 客户授权同意二次加价
  async approveSecondaryQuote(quoteId) {
    return withTransaction(async (client) => {
      const qRes = await client.query(`
        UPDATE secondary_quotes
        SET customer_approval_status = 'APPROVED', approved_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING order_id, extra_amount;
      `, [quoteId]);

      if (qRes.rowCount === 0) throw new Error('加价单不存在');
      const { order_id, extra_amount } = qRes.rows[0];

      // 将加价金额合并入主订单金额
      await client.query(`
        UPDATE orders
        SET final_customer_paid = final_customer_paid + $1,
            base_service_amount = base_service_amount + $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2;
      `, [extra_amount, order_id]);

      return { success: true, orderId: order_id, extraAdded: extra_amount };
    });
  }

  // 4. 履约验收：核销 6 位验证码并触发双记账资金结算
  async verifyAndCompleteOrder(orderId, inputCode) {
    return withTransaction(async (client) => {
      const orderRes = await client.query(`
        SELECT id, order_sn, verification_code_hash, final_customer_paid, currency, status
        FROM orders
        WHERE id = $1
        FOR UPDATE;
      `, [orderId]);

      if (orderRes.rowCount === 0) throw new Error('工单不存在');
      const order = orderRes.rows[0];

      // 核对哈希
      const inputHash = crypto.createHash('sha256').update(inputCode.trim()).digest('hex');
      if (inputHash !== order.verification_code_hash) {
        throw new Error('核销码错误！请向客户索取正确的 6 位数字验证码');
      }

      // 跃迁状态至 COMPLETED 并立即触发双记账解冻
      await client.query(`
        UPDATE orders
        SET status = 'SETTLED', updated_at = CURRENT_TIMESTAMP
        WHERE id = $1;
      `, [orderId]);

      // 调用双记账解冻释放资金
      const settlement = await escrowService.settleAndReleaseEscrow(order.id, order.final_customer_paid, 0.15, order.currency);
      return { success: true, orderSn: order.order_sn, settlement };
    });
  }
}

module.exports = new VgoOrderLifecycleEngine();
