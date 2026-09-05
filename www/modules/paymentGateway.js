/**
 * Vgo 支付网关：DuitNow/PayNow 动态聚合收款、资金托管与自动分账、微额履约险
 */
class VgoPaymentGateway {
  constructor() {
    this.insuranceProvider = 'Allianz / Tune Protect 联合承保';
  }

  // 生成聚合支付订单与动态二维码数据
  createPaymentIntent(orderId, amount, options = {}) {
    const region = window.vgoPricing ? window.vgoPricing.currentRegion : 'MY';
    const currency = region === 'MY' ? 'RM' : 'S$';
    
    // 微额安全险（RM 1.00 / S$ 0.80，保额最高 RM 50,000 / S$ 25,000）
    const includeInsurance = options.insurance !== false;
    const insuranceFee = includeInsurance ? (region === 'MY' ? 1.00 : 0.80) : 0;
    const grandTotal = +(Number(amount) + insuranceFee).toFixed(2);

    // 平台 15% 抽成与手艺人/商户 85% 资金自动分账拆解
    const platformFee = +(grandTotal * 0.15).toFixed(2);
    const payoutAmount = +(grandTotal - platformFee).toFixed(2);

    // 模拟国家聚合收款码
    const qrCodeMock = region === 'MY'
      ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=DuitNow-Vgo-Escrow-${orderId}-${grandTotal}`
      : `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=PayNow-Vgo-Escrow-${orderId}-${grandTotal}`;

    return {
      orderId,
      region,
      currency,
      baseAmount: amount,
      includeInsurance,
      insuranceFee,
      insuranceCoverage: region === 'MY' ? 'RM 50,000' : 'S$ 25,000',
      grandTotal,
      split: {
        platformFee,
        payoutAmount,
        payoutStatus: 'ESCROW_LOCKED' // 资金进入平台托管账户，核销后释放
      },
      qrCodeUrl: qrCodeMock
    };
  }
}
window.vgoPayment = new VgoPaymentGateway();
