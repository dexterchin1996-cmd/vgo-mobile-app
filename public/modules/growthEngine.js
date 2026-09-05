/**
 * Vgo 本地化增长引擎：线下立牌引流海报生成、手艺人以老带新推荐阶梯、Airbnb 托管年卡
 */
class VgoGrowthEngine {
  constructor() {}

  // 1. 手艺人星级阶梯晋升与费率核算 (接满 100 单抽成从 15% 自动直降到 8%)
  calculateArtisanTier(completedOrdersCount) {
    if (completedOrdersCount >= 100) {
      return { tierName: '金牌王者合伙人', feeRate: 0.08, badge: '8% 顶级费率', socsoBonus: '享每月 RM150 社保补贴' };
    } else if (completedOrdersCount >= 30) {
      return { tierName: '资深手艺人', feeRate: 0.12, badge: '12% 优选费率', socsoBonus: '装备耗材 9折' };
    }
    return { tierName: '标准合伙人', feeRate: 0.15, badge: '15% 标准费率', socsoBonus: '新人进阶中' };
  }

  // 2. 以老带新推荐赏金逻辑
  generateReferralProfile(artisanPhone) {
    const code = 'VGO' + (artisanPhone ? artisanPhone.slice(-4) : '8888');
    return {
      referralCode: code,
      shareLink: `https://vgo.life/join?ref=${code}`,
      bountyReward: '新师傅完成首 10 单，推荐人立得 RM 50 现金奖励',
      invitedCount: 3,
      totalEarnedBonus: 'RM 150.00'
    };
  }

  // 3. 生成商户专属亚克力前台立牌引流海报 (HTML5 Canvas 动态渲染)
  generateMerchantStandee(canvasEl, storeName, storeId) {
    const ctx = canvasEl.getContext('2d');
    canvasEl.width = 400;
    canvasEl.height = 560;

    // 优雅商务渐变背景
    const grad = ctx.createLinearGradient(0, 0, 0, 560);
    grad.addColorStop(0, '#0D9488');
    grad.addColorStop(0.35, '#115E59');
    grad.addColorStop(1, '#0F172A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 400, 560);

    // 顶部品牌文字
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 26px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Vgo 官方合作商户', 200, 50);

    ctx.fillStyle = '#CCFBF1';
    ctx.font = '14px sans-serif';
    ctx.fillText('线上预约免排队 · 享新客首单立减优惠', 200, 78);

    // 绘制白色二维码底板
    ctx.fillStyle = '#FFFFFF';
    ctx.roundRect ? ctx.roundRect(50, 110, 300, 340, 20) : ctx.fillRect(50, 110, 300, 340);
    ctx.fill();

    // 绘制二维码模拟图
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 90, 130, 220, 220);

      // 二维码下方商户名称
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 18px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(storeName || '认证实体门店', 200, 385);

      ctx.fillStyle = '#64748B';
      ctx.font = '12px sans-serif';
      ctx.fillText(`门店专属认证码: ${storeId}`, 200, 415);

      // 底部标语
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '13px sans-serif';
      ctx.fillText('扫码领 RM15 优惠券 · 进店享尊荣服务', 200, 490);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px sans-serif';
      ctx.fillText('Powered by Vgo Super App', 200, 525);
    };
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://vgo.life/store/${encodeURIComponent(storeId)}`;
  }
}
window.vgoGrowth = new VgoGrowthEngine();
