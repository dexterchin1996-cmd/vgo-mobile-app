class MerchantSyncEngine {
  constructor() {
    this.STORAGE_KEY = 'vgo_custom_merchants';
  }

  // 商家提交并同步入驻
  registerAndSyncStore(storeData) {
    if (!storeData.name || !storeData.address || !storeData.services) {
      throw new Error('请完整填写门店名称、实体地址与核心服务！');
    }

    const newMerchant = {
      id: 'm_store_' + Date.now(),
      name: storeData.name.trim(),
      category: storeData.category || '综合生活服务',
      rating: '5.00',
      reviewsCount: 1,
      address: storeData.address.trim(),
      openTime: storeData.openTime || '09:00 - 22:00',
      amenities: storeData.amenities || ['支持预约', '正规认证', '环保消毒'],
      verifiedCode: 'SSM-' + Math.floor(10000000 + Math.random() * 90000000) + 'V',
      services: Array.isArray(storeData.services) ? storeData.services : storeData.services.split(/[,，]/).map(s => s.trim()).filter(Boolean),
      syncedAt: new Date().toISOString().split('T')[0]
    };

    // 1. 同步内存大厅数据
    if (window.vgoCatalog && Array.isArray(window.vgoCatalog.merchants)) {
      window.vgoCatalog.merchants.unshift(newMerchant);
    }

    // 2. 本地持久化储存
    try {
      const existing = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      existing.unshift(newMerchant);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing));
    } catch (e) {
      console.error('存储商户持久化失败:', e);
    }

    return newMerchant;
  }

  getAllSyncedMerchants() {
    return (window.vgoCatalog && window.vgoCatalog.merchants) ? window.vgoCatalog.merchants : [];
  }
}
window.vgoMerchantSync = new MerchantSyncEngine();
