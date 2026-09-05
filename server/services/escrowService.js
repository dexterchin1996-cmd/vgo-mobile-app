/**
 * Vgo 企业级双记账财务结算中枢 (Double-Entry Financial Ledger)
 * 严格遵循国际会计准则：每一笔交易 Debit (借方) = Credit (贷方)，账目不可篡改
 */
const { withTransaction } = require('../config/db');
const crypto = require('crypto');

class VgoEscrowService {
  /**
   * 资金托管锁定：顾客付款成功后，资金进入平台托管专户
   */
  async lockEscrowDeposit(orderId, totalPaid, baseAmount, taxAmount, insuranceFee, currency = 'MYR') {
    return withTransaction(async (client) => {
      const txRef = 'TX-DEP-' + crypto.randomBytes(8).toString('hex').toUpperCase();

      // 1. 借方：平台资金托管专户 (Asset Increase)
      await client.query(`
        INSERT INTO financial_ledger (transaction_ref, order_id, account_type, debit_amount, credit_amount, currency, narrative)
        VALUES ($1, $2, 'PLATFORM_ESCROW_VAULT', $3, 0.00, $4, '顾客支付工单托管金入账')
      `, [txRef, orderId, totalPaid, currency]);

      // 2. 贷方：税款准备专户 (Liability)
      if (taxAmount > 0) {
        const taxAccount = currency === 'MYR' ? 'TAX_RESERVE_LHDN_SST' : 'TAX_RESERVE_IRAS_GST';
        await client.query(`
          INSERT INTO financial_ledger (transaction_ref, order_id, account_type, debit_amount, credit_amount, currency, narrative)
          VALUES ($1, $2, $3, 0.00, $4, $5, '代收法定服务税金储备')
        `, [txRef, orderId, taxAccount, taxAmount, currency]);
      }

      // 3. 贷方：Allianz 微保准备金专户 (Liability)
      if (insuranceFee > 0) {
        await client.query(`
          INSERT INTO financial_ledger (transaction_ref, order_id, account_type, debit_amount, credit_amount, currency, narrative)
          VALUES ($1, $2, 'INSURANCE_RESERVE', 0.00, $3, $4, '代收履约人身财产安全保费')
        `, [txRef, orderId, insuranceFee, currency]);
      }

      // 4. 贷方：手艺人/商户待清算待分配金额
      const pendingRelease = +(totalPaid - taxAmount - insuranceFee).toFixed(2);
      await client.query(`
        INSERT INTO financial_ledger (transaction_ref, order_id, account_type, debit_amount, credit_amount, currency, narrative)
        VALUES ($1, $2, 'ARTISAN_WALLET', 0.00, $3, $4, '待履约释放服务佣金 (托管中)')
      `, [txRef, orderId, pendingRelease, currency]);

      return { success: true, transactionRef: txRef, status: 'ESCROW_LOCKED' };
    });
  }

  /**
   * 核销分账结算：现场作业完成并核销后，释放托管金，划扣平台佣金
   */
  async settleAndReleaseEscrow(orderId, finalAmount, takeRate = 0.15, currency = 'MYR') {
    return withTransaction(async (client) => {
      const txRef = 'TX-STL-' + crypto.randomBytes(8).toString('hex').toUpperCase();
      const platformFee = +(finalAmount * takeRate).toFixed(2);
      const artisanNet = +(finalAmount - platformFee).toFixed(2);

      // 借方：从托管专户冲减释放
      await client.query(`
        INSERT INTO financial_ledger (transaction_ref, order_id, account_type, debit_amount, credit_amount, currency, narrative)
        VALUES ($1, $2, 'PLATFORM_ESCROW_VAULT', $3, 0.00, $4, '工单核销完成，解除资金托管')
      `, [txRef, orderId, finalAmount, currency]);

      // 贷方 1：平台净收益专户
      await client.query(`
        INSERT INTO financial_ledger (transaction_ref, order_id, account_type, debit_amount, credit_amount, currency, narrative)
        VALUES ($1, $2, 'PLATFORM_REVENUE', 0.00, $3, $4, '平台服务抽成净收益确认')
      `, [txRef, orderId, platformFee, currency]);

      // 贷方 2：手艺人可用提现钱包
      await client.query(`
        INSERT INTO financial_ledger (transaction_ref, order_id, account_type, debit_amount, credit_amount, currency, narrative)
        VALUES ($1, $2, 'ARTISAN_WALLET', 0.00, $3, $4, '手艺人履约净劳务报酬入账')
      `, [txRef, orderId, artisanNet, currency]);

      return { success: true, transactionRef: txRef, artisanNet, platformFee };
    });
  }
}

module.exports = new VgoEscrowService();
