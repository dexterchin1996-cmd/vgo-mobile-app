class PricingEngine {
  constructor() {
    this.rates = {
      MY: { currency: 'RM', taxRate: 0.08, taxName: '8% SST', city: '沙巴·亚庇 (Kota Kinabalu)' },
      SG: { currency: 'S$', taxRate: 0.09, taxName: '9% GST', city: '新加坡市中心 (Central Region)' }
    };
    this.currentRegion = 'MY';
  }

  setRegion(code) {
    if (this.rates[code]) this.currentRegion = code;
    return this.rates[this.currentRegion];
  }

  getRegionInfo() {
    return this.rates[this.currentRegion];
  }

  // 计算明细账单：底价 + 定制耗材 + 时段急修附加费 + SST/GST
  calculateDetailedQuote(basePrice, selectedOptions = [], isUrgent = false) {
    const info = this.rates[this.currentRegion];
    let subtotal = Number(basePrice) || 0;
    const optionDetails = [];

    // 计算选定属性与耗材加价
    selectedOptions.forEach(opt => {
      const extra = this.currentRegion === 'MY' ? (opt.extraMY || 0) : (opt.extraSG || 0);
      if (extra > 0) {
        subtotal += extra;
        optionDetails.push({ name: opt.name, cost: extra });
      }
    });

    // 突发急修或夜间时段保障费
    let urgentFee = 0;
    if (isUrgent) {
      urgentFee = this.currentRegion === 'MY' ? 25 : 18;
      subtotal += urgentFee;
    }

    const taxAmount = +(subtotal * info.taxRate).toFixed(2);
    const finalTotal = +(subtotal + taxAmount).toFixed(2);

    return {
      currency: info.currency,
      base: basePrice,
      optionDetails: optionDetails,
      urgentFee: urgentFee,
      subtotal: subtotal.toFixed(2),
      taxRate: info.taxRate,
      taxName: info.taxName,
      taxAmount: taxAmount.toFixed(2),
      finalTotal: Math.round(finalTotal),
      finalExact: finalTotal.toFixed(2)
    };
  }
}
window.vgoPricing = new PricingEngine();
