window.vgoCatalog = {
  // 1. 经络理疗与芳香推拿手艺
  massage: [
    {
      id: 'm1',
      category: 'massage',
      name: '中式经络穴位推拿调理',
      artisanTitle: '资深经络调理师',
      badge: '金牌手艺',
      basePriceMY: 98,
      basePriceSG: 65,
      duration: '60分钟',
      desc: '精准辨证循经点穴，针对颈肩腰背僵硬深层松解，排湿活络。',
      mode: '技师上门 / 到店'
    },
    {
      id: 'm2',
      category: 'massage',
      name: '天然植物精油全身芳香调理',
      artisanTitle: '高级芳疗手艺人',
      badge: '纯正植萃',
      basePriceMY: 138,
      basePriceSG: 88,
      duration: '90分钟',
      desc: '植物芳香精油抚触渗透，安抚中枢神经，深度舒压促进睡眠。',
      mode: '技师上门 / 到店'
    }
  ],

  // 2. 美容美妆与皮肤手艺
  beauty: [
    {
      id: 'b1',
      category: 'beauty',
      name: '日韩系轻奢美睫与眼部精修',
      artisanTitle: '认证美睫造型师',
      badge: '精细手工',
      basePriceMY: 110,
      basePriceSG: 75,
      duration: '80分钟',
      desc: '一根一接无感嫁接，轻盈浓密，定制契合眼型的自然灵动弧度。',
      mode: '手艺人上门 / 到店'
    },
    {
      id: 'b2',
      category: 'beauty',
      name: '小气泡水光深层毛孔清洁护理',
      artisanTitle: '专业皮肤管理师',
      badge: '嫩肤焕亮',
      basePriceMY: 128,
      basePriceSG: 85,
      duration: '60分钟',
      desc: '真空负压超微气泡导出黑头油脂，配合玻尿酸原液深层注水。',
      mode: '到店体验 / 上门护理'
    }
  ],

  // 3. 宠物美容与洗护手艺
  pet: [
    {
      id: 'p1',
      category: 'pet',
      name: '全犬种/猫咪专业精修毛与造型',
      artisanTitle: 'CKU认证高级宠物美容师',
      badge: '持证手艺',
      basePriceMY: 90,
      basePriceSG: 60,
      duration: '90分钟',
      desc: '根据骨骼体型手工剪毛修圆、清耳道、剪指甲、脚底毛剔除。',
      mode: '上门洗护车 / 到店'
    },
    {
      id: 'p2',
      category: 'pet',
      name: '宠物草本药浴微气泡去油舒敏SPA',
      artisanTitle: '宠物健康养护师',
      badge: '除菌去味',
      basePriceMY: 80,
      basePriceSG: 55,
      duration: '60分钟',
      desc: '天然草本药浴改善皮屑发红，超细微纳米气泡深层清洁毛囊。',
      mode: '上门服务 / 到店'
    }
  ],

  // 4. 水电与家装技术师傅
  handyman: [
    {
      id: 'h1',
      category: 'handyman',
      name: '暗管爆裂 / 水管漏水急性抢修',
      artisanTitle: '资深持证水电工程师',
      badge: '30分急达',
      basePriceMY: 80,
      basePriceSG: 60,
      duration: '即刻抢险',
      desc: '精密声波仪器精准定位漏点，快速截水与热熔管路加固。',
      mode: '师傅快速上门'
    },
    {
      id: 'h2',
      category: 'handyman',
      name: '空调化学药水拆洗 (Chemical Wash)',
      artisanTitle: '暖通空调高级技工',
      badge: '深度除垢',
      basePriceMY: 120,
      basePriceSG: 85,
      duration: '预约工时',
      desc: '高压化学除藻药水彻底清洗风轮与蒸发器，测漏并回升制冷效能。',
      mode: '师傅上门作业'
    }
  ],

  // 5. 认证入驻实体商家 (商家端审核通过后自动同步至此)
  merchants: [
    {
      id: 'shop_01',
      name: '绿意自然·养生美学生活馆',
      category: '实体SPA会馆',
      rating: '4.98',
      reviewsCount: '890+',
      address: '亚庇市中心滨海大道 88 号',
      services: ['中式穴位推拿', '芳香精油调理', '草本足浴'],
      verified: true
    },
    {
      id: 'shop_02',
      name: '萌宠物语·专业宠物沙龙',
      category: '专业宠物沙龙',
      rating: '4.95',
      reviewsCount: '620+',
      address: '加雅街商业区 12 号铺',
      services: ['赛级剪毛修型', '草本微气泡药浴', '猫咪深层洗护'],
      verified: true
    }
  ],

  // 6. 来自真实客户的真实反馈与推荐库
  reviews: [
    {
      customerName: '陈女士 (亚庇居民)',
      artisanName: 'Lisa (高级美容美睫师)',
      serviceName: '日韩系轻奢美睫',
      rating: 5,
      comment: '手艺真的很轻柔！之前在别的店接睫毛容易扎眼睛，Lisa 师傅手法很专业，嫁接得特别自然，维持了一个多月都没掉，真心推荐！',
      date: '昨天 15:30'
    },
    {
      customerName: 'Mr. Kevin (家庭用户)',
      artisanName: '黄师傅 (持证水电工)',
      serviceName: '水管急性漏水抢修',
      rating: 5,
      comment: '晚上10点厨房水管爆开，在平台提交不到5分钟黄师傅就接单联系我了，20分钟带齐工具上门截断修好，明码实价没有任何乱收费，救了大急！',
      date: '前天 22:45'
    },
    {
      customerName: 'Sarah (猫咪家长)',
      artisanName: '阿明师傅 (宠物美容师)',
      serviceName: '猫咪上门洗护精修',
      rating: 5,
      comment: '我家布偶猫非常胆小怕出门，阿明师傅自带全套消毒装备上门洗护，安抚手法特别温柔，毛发吹得非常蓬松，猫咪完全没有应激反应，太省心了。',
      date: '3天前'
    }
  ]
};
