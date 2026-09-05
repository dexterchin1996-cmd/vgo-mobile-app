/**
 * Vgo 国际化多语言与马来西亚 LHDN 电子发票企业报销引擎
 */
class VgoB2BAndLangEngine {
  constructor() {
    this.currentLang = 'zh'; // zh | en | ko
    this.dict = {
      zh: {
        appName: 'Vgo 平台',
        airbnbTag: 'Airbnb 民宿房东急救专线',
        airbnbDesc: '30分钟急速到位 · 房客突发爆管/断电/冷气罢工 · 线上全流程托管',
        ladiesOnlyLabel: '全女专属约选',
        ladiesOnlyTip: '为独居女性提供专属安全保障，仅指派通过背调的女性手艺人',
        invoiceTitle: '开具 LHDN 电子发票 (e-Invoice 企业报销)',
        tinNumber: '企业税号 (TIN)',
        brnNumber: '商业注册号 (BRN / SSM)',
        companyName: '公司/抬头全称',
        shareTrip: '分享实时行程给家人',
        sosAlert: '紧急静默 SOS 求助',
        storeSupplies: 'Vgo 官方耗材集采商城'
      },
      en: {
        appName: 'Vgo Platform',
        airbnbTag: 'Airbnb & Host Rescue Pass',
        airbnbDesc: '30-min Rapid Response for Hosts: AC, Plumbing & Smart Lock Emergencies.',
        ladiesOnlyLabel: 'Ladies-Only Safe Match',
        ladiesOnlyTip: 'Verified female professionals only for women safety & privacy peace of mind.',
        invoiceTitle: 'Request LHDN e-Invoice (Tax Deductible)',
        tinNumber: 'Tax Identification No. (TIN)',
        brnNumber: 'Business Reg No. (BRN / SSM)',
        companyName: 'Company Full Legal Name',
        shareTrip: 'Share Live Trip with Family',
        sosAlert: 'Emergency Silent SOS',
        storeSupplies: 'Official Supplies Wholesale'
      },
      ko: {
        appName: 'Vgo 플랫폼',
        airbnbTag: '에어비앤비 & 호스트 긴급 구조',
        airbnbDesc: '30분 내 긴급 출동: 에어컨 고장, 배관 누수, 도어락 긴급 수리.',
        ladiesOnlyLabel: '여성 전용 안심 매칭',
        ladiesOnlyTip: '신원 검증된 여성 전문가 매칭으로 혼자 거주하는 여성도 안심.',
        invoiceTitle: '말레이시아 LHDN 전자 세금계산서 발급',
        tinNumber: '기업 세금 번호 (TIN)',
        brnNumber: '사업자 등록 번호 (BRN)',
        companyName: '회사 영문 법인명',
        shareTrip: '가족에게 실시간 위치 공유',
        sosAlert: '긴급 비상 SOS 알림',
        storeSupplies: '전문가 전용 정품 원자재 몰'
      }
    };
  }

  setLanguage(langCode) {
    if (this.dict[langCode]) {
      this.currentLang = langCode;
      return true;
    }
    return false;
  }

  t(key) {
    return (this.dict[this.currentLang] && this.dict[this.currentLang][key]) || key;
  }

  // 验证与生成 LHDN e-Invoice 数据载荷
  generateEInvoicePayload(orderId, totalAmount, companyInfo) {
    if (!companyInfo.tin || !companyInfo.name) {
      throw new Error('请完整提供公司法定名称与 LHDN 税务编号 (TIN)！');
    }
    return {
      invoiceNo: 'INV-' + Date.now(),
      orderId: orderId,
      buyerName: companyInfo.name,
      tin: companyInfo.tin,
      brn: companyInfo.brn || 'NA',
      totalPayable: totalAmount,
      currency: 'MYR',
      complianceType: 'MALAYSIA_LHDN_MYINVOIS_V1.0',
      qrVerificationUrl: `https://myinvois.hasil.gov.my/verify?uuid=${encodeURIComponent(orderId)}`
    };
  }
}
window.vgoLangB2B = new VgoB2BAndLangEngine();
