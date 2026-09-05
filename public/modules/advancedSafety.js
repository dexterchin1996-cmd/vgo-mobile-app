/**
 * Vgo 平台安全护盾与防跳单、防坐地起价核心引擎
 */
class VgoAdvancedSafetyEngine {
  constructor() {
    this.ladiesOnlyActive = false;
    this.secondaryQuoteState = null;
  }

  // 女性安全专属约选切换
  toggleLadiesOnly(enable) {
    this.ladiesOnlyActive = enable;
    if (window.vgoDialog) {
      window.vgoDialog.toast(enable ? '已开启【全女安全专属约选】：仅为您匹配认证女手艺人' : '已恢复全量手艺人筛选', 'info');
    }
    return this.ladiesOnlyActive;
  }

  // 生成实时行程与安全监督链接 (可一键发往 WhatsApp / 亲友)
  generateLiveTripShareData(orderId, artisanName, eta) {
    const url = `https://vgo.life/track?order=${encodeURIComponent(orderId)}`;
    const text = `【Vgo 安全出行守护】我的上门服务工单 [${orderId}] 正在履约。\n手艺人：${artisanName}\n预计抵达：${eta}\n实时行程与安全轨迹：${url}`;
    return {
      url,
      shareText: text,
      whatsappUrl: `https://wa.me/?text=${encodeURIComponent(text)}`
    };
  }

  // 二次加价锁：现场增项申请 (手艺人端发起，顾客端必须线上确认扣款后才允许动工)
  createSecondaryQuote(orderId, partName, extraCost, damagePhotoUrl) {
    this.secondaryQuoteState = {
      orderId,
      partName,
      extraCost: Number(extraCost),
      damagePhotoUrl,
      status: 'AWAITING_CUSTOMER_APPROVAL',
      timestamp: new Date().toLocaleTimeString()
    };
    return this.secondaryQuoteState;
  }

  // 顾客确认或拒绝增项
  customerResolveSecondaryQuote(approved) {
    if (!this.secondaryQuoteState) return null;
    this.secondaryQuoteState.status = approved ? 'APPROVED_BY_CUSTOMER' : 'REJECTED';
    return this.secondaryQuoteState;
  }
}
window.vgoSafety = new VgoAdvancedSafetyEngine();
