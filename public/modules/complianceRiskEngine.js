/**
 * Vgo 平台深度风控与长效盈利引擎
 * 覆盖：阶梯取消费用、入室贵重物品防盗免责、现金单信用额度池、外籍工签合规、订阅包体系
 */
class VgoComplianceRiskEngine {
  constructor() {
    // 1. 阶梯取消费率标准 (保护手艺人车马误工)
    this.cancellationRules = {
      freeWindowMins: 5,
      enRouteFeeMY: 15.00,
      enRouteFeeSG: 10.00,
      arrivedFeeMY: 30.00,
      arrivedFeeSG: 20.00
    };

    // 2. 现金单接单额度池 (预存保证金扣佣，防止跳单截留)
    this.artisanCreditPool = {
      depositBalance: 120.00, // 预存保证金余额
      maxCashOrderQuota: 800.00, // 允许抢现金单上限
      commissionRate: 0.15 // 15% 自动扣除
    };

    // 3. 外籍工签 (PLKS / Work Permit) 合规准入状态
    this.permitProfile = {
      holderType: 'LEGAL_PLKS', // CITIZEN | PR | LEGAL_PLKS
      permitNumber: 'PLKS-SBH-2026-9912A',
      validUntil: '2027-03-31',
      daysRemaining: 207,
      isAutoFreezeTriggered: false
    };

    // 4. 高频维保与订阅套餐字典 (解决低频痛点)
    this.subscriptionPlans = [
      {
        id: 'sub_elder_care',
        name: 'Vgo 关爱长辈与白领尊享月卡',
        priceMY: 188.00,
        priceSG: 128.00,
        cycle: '月度订阅',
        badge: '高频首选',
        benefits: [
          '每月 2 次上门经络推拿深度调理 (60分钟)',
          '每月 1 次足底全息脏腑反射调理 (45分钟)',
          '优先指派 4.98 星金牌女手艺人',
          '免除高峰与夜间紧急出行附加费'
        ]
      },
      {
        id: 'sub_home_care',
        name: 'Vgo 房屋健康年保 (Home Care VIP)',
        priceMY: 480.00,
        priceSG: 320.00,
        cycle: '年度订阅',
        badge: '家庭/民宿必选',
        benefits: [
          '全年 4 台分体空调深度化学拆洗 (除霉消臭)',
          '全年 2 次全屋暗管水压与电路排查',
          '24H 突发爆管/断电急修免基础出勤费',
          'Airbnb 民宿房客紧急求救 15 分钟优先派单'
        ]
      }
    ];

    // 5. 每日开工工具箱自检打卡状态
    this.dailyToolkitChecked = false;
  }

  // 计算取消费用：接单5分钟内免责，出发后扣除车马补贴补偿手艺人
  evaluateCancellationPenalty(orderState, minutesElapsed) {
    const region = (window.vgoPricing && window.vgoPricing.currentRegion) || 'MY';
    const isMY = region === 'MY';

    if (minutesElapsed <= this.cancellationRules.freeWindowMins) {
      return { fee: 0, reason: '下单 5 分钟内无责极速取消', compensateArtisan: 0 };
    }

    if (orderState === 'EN_ROUTE') {
      const stipend = isMY ? this.cancellationRules.enRouteFeeMY : this.cancellationRules.enRouteFeeSG;
      return {
        fee: stipend,
        reason: `手艺人已在赶往途中，扣除 ${isMY ? 'RM' : 'S$'} ${stipend.toFixed(2)} 作为车马误工补偿款`,
        compensateArtisan: stipend
      };
    }

    if (orderState === 'ARRIVED') {
      const arrivedFee = isMY ? this.cancellationRules.arrivedFeeMY : this.cancellationRules.arrivedFeeSG;
      return {
        fee: arrivedFee,
        reason: `手艺人已抵达现场，扣除出勤排查费 ${isMY ? 'RM' : 'S$'} ${arrivedFee.toFixed(2)}`,
        compensateArtisan: arrivedFee
      };
    }

    return { fee: 0, reason: '无责取消', compensateArtisan: 0 };
  }

  // 现金单佣金划扣逻辑 (从保证金池实时扣除 15%)
  deductCashOrderCommission(cashAmount) {
    const commission = +(cashAmount * this.artisanCreditPool.commissionRate).toFixed(2);
    if (this.artisanCreditPool.depositBalance < commission) {
      throw new Error(`保证金余额不足！需扣除抽成 RM ${commission}，请先充值保证金池后再抢现金单。`);
    }
    this.artisanCreditPool.depositBalance = +(this.artisanCreditPool.depositBalance - commission).toFixed(2);
    return {
      commissionDeducted: commission,
      newDepositBalance: this.artisanCreditPool.depositBalance
    };
  }

  // 外籍工签自动到期熔断校验 (30天预警，到期秒级熔断停单)
  checkPermitCompliance() {
    if (this.permitProfile.daysRemaining <= 0) {
      this.permitProfile.isAutoFreezeTriggered = true;
      return { allowed: false, msg: '您的外籍合法劳工准证已到期，系统已启动合规熔断保护，暂停派单权限！' };
    }
    if (this.permitProfile.daysRemaining <= 30) {
      return { allowed: true, msg: `【合规预警】您的工签准证仅剩 ${this.permitProfile.daysRemaining} 天到期，请尽快上传移民局续签批文！` };
    }
    return { allowed: true, msg: '工签合规有效，合规执业' };
  }

  // 每日工具箱开工自检
  completeDailyToolkitCheck() {
    this.dailyToolkitChecked = true;
    localStorage.setItem('vgo_toolkit_check_date', new Date().toDateString());
    return true;
  }
}
window.vgoRisk = new VgoComplianceRiskEngine();
