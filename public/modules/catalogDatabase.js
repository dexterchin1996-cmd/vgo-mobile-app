/**
 * Vgo 平台核心服务数据字典与口碑数据库
 * 规范：4级结构（领域 -> 工种 -> 标准服务SKU -> 属性参数/定制耗材）
 */
window.vgoCatalog = {
  // 一、健康理疗与芳香养生
  massage: [
    {
      id: 'm_cervical',
      category: 'massage',
      name: '办公室肩颈定向深层筋膜解结',
      artisanTitle: '资深经络调理师',
      badge: '久坐必选',
      basePriceMY: 78,
      basePriceSG: 48,
      duration: '45分钟',
      desc: '精准辨证斜方肌、肩胛提肌劳损硬结，点按风池、肩井穴，深层松解肌筋膜粘连。',
      sop: ['75%酒精与草本免洗液双手消毒', '热毛巾敷肩软化僵硬肌群', '循经深层点穴推揉', '无纺布温润拭净'],
      options: {
        pressure: ['柔和舒缓', '适中渗透', '重压深解'],
        oil: [
          { name: '草本通络植物基础油', extraMY: 0, extraSG: 0 },
          { name: '高纯度老姜生姜温阳精油', extraMY: 20, extraSG: 15 },
          { name: '法国薰衣草助眠单方精油', extraMY: 25, extraSG: 18 }
        ]
      },
      portfolio: ['颈椎活动度改善', '斜方肌高耸软化对比'],
      mode: '手艺人上门 / 到店'
    },
    {
      id: 'm_fullbody',
      category: 'massage',
      name: '全息督脉十二经络全身穴位推拿',
      artisanTitle: '高级理疗推拿师',
      badge: '深度排湿',
      basePriceMY: 118,
      basePriceSG: 75,
      duration: '90分钟',
      desc: '背部督脉循行滚法、揉法，下肢膀胱经疏通，全面调节气血运行，改善长期乏力困重。',
      sop: ['自带一次性无纺布隔脏床单', '全身关节被动牵引拉伸', '背部/四肢穴位系统推按', '头部穴位安神放松'],
      options: {
        pressure: ['标准适中', '传统重手法'],
        oil: [
          { name: '天然甜杏仁基底油', extraMY: 0, extraSG: 0 },
          { name: '大马士革玫瑰滋养精油', extraMY: 30, extraSG: 20 }
        ]
      },
      portfolio: ['背部经络通畅泛红', '脊柱侧旁肌紧张缓解'],
      mode: '手艺人上门 / 到店'
    }
  ],

  // 二、生活美容与精细手艺
  beauty: [
    {
      id: 'b_eyelash',
      category: 'beauty',
      name: '日韩系轻奢单根无感睫毛嫁接',
      artisanTitle: '认证高级美睫造型师',
      badge: '精细手工',
      basePriceMY: 110,
      basePriceSG: 75,
      duration: '80分钟',
      desc: '一根真睫嫁接一根人造睫毛，距离根部0.5mm安全距离，零负重感，眼型量身定制。',
      sop: ['眼部深层去蛋白清洁', '医用无刺激水凝胶眼膜隔离', '单根精密无感嫁接', '纳米冷雾喷雾固化防熏眼'],
      options: {
        material: [
          { name: '进口抗菌蚕丝蛋白软毛 (120根)', extraMY: 0, extraSG: 0 },
          { name: '哑光极细扁毛高密款 (160根)', extraMY: 25, extraSG: 18 },
          { name: '婴儿弯自然山茶花款 (开花200根)', extraMY: 40, extraSG: 28 }
        ],
        curl: ['J自然微翘', 'B轻柔空气感', 'C芭比卷翘']
      },
      portfolio: ['单眼皮灵动放大实拍', '前后无负重感闭眼图'],
      mode: '手艺人上门 / 到店'
    },
    {
      id: 'b_hydro',
      category: 'beauty',
      name: '深层小气泡毛孔净化与高阶水光护理',
      artisanTitle: '皮肤健康管理师',
      badge: '净肤透亮',
      basePriceMY: 138,
      basePriceSG: 88,
      duration: '60分钟',
      desc: '真空微负压双向循环技术导出黑头与粉刺油脂，配合医用玻尿酸原液超声波深层导入。',
      sop: ['氨基酸温和洁面', '果酸导出液T区黑头软化', '负压小气泡深层吸附毛孔', '医用冷敷贴镇定收缩毛孔'],
      options: {
        material: [
          { name: '标准玻尿酸注水导入', extraMY: 0, extraSG: 0 },
          { name: '胶原蛋白紧致导入 + 红蓝光修复', extraMY: 35, extraSG: 25 }
        ]
      },
      portfolio: ['草莓鼻净化前后微距对比', '水光护理透亮光泽度'],
      mode: '到店体验 / 上门护理'
    }
  ],

  // 三、宠物洗护与美容造型
  pet: [
    {
      id: 'p_styling',
      category: 'pet',
      name: '全犬种/猫咪专业精修剪毛与洗护造型',
      artisanTitle: 'CKU认证高级宠物美容师',
      badge: '低应激洗护',
      basePriceMY: 90,
      basePriceSG: 60,
      duration: '90分钟',
      desc: '依据骨骼线条手工圆头修剪、贵宾/比熊泰迪熊造型修圆，含拔耳毛、剪趾甲、挤肛门腺。',
      sop: ['体表健康检查(耳道/跳蚤/皮炎)', '恒温低噪吹风机吹干拉毛', '面部与四肢手工精修圆润', '爪垫脚底毛剔净与耳道清洁'],
      options: {
        petWeight: [
          { name: '小型犬/猫 (0 - 5 kg)', extraMY: 0, extraSG: 0 },
          { name: '中型犬 (5 - 12 kg)', extraMY: 30, extraSG: 20 },
          { name: '大型犬 (12 - 25 kg)', extraMY: 60, extraSG: 40 }
        ],
        shampoo: [
          { name: '低敏无泪植物配方香波', extraMY: 0, extraSG: 0 },
          { name: '澳洲燕麦止痒除菌药浴香波', extraMY: 20, extraSG: 15 }
        ]
      },
      portfolio: ['比熊圆头萌系修剪对比', '贵宾泰迪熊造型修剪'],
      mode: '手艺人上门 / 到店'
    },
    {
      id: 'p_spa',
      category: 'pet',
      name: '微气泡纳米草本药浴深层除螨SPA',
      artisanTitle: '宠物皮毛护理专家',
      badge: '除菌去屑',
      basePriceMY: 80,
      basePriceSG: 55,
      duration: '60分钟',
      desc: '利用超细微纳米气泡渗透毛囊洗除皮屑与油脂红肿，搭配纯植物草本精粹修复皮肤屏障。',
      sop: ['全身死毛去浮毛梳理', '草本药浴温水浸泡15分钟', '负离子轻柔吹风机烘干', '皮毛滋养精华喷雾防静电'],
      options: {
        petWeight: [
          { name: '小型宠 (0 - 5 kg)', extraMY: 0, extraSG: 0 },
          { name: '中大型宠 (5 - 15 kg)', extraMY: 25, extraSG: 18 }
        ]
      },
      portfolio: ['红肿皮屑改善实拍', '毛发蓬松柔顺光泽'],
      mode: '手艺人上门 / 到店'
    }
  ],

  // 四、水电急修与工程维保
  handyman: [
    {
      id: 'h_pipe',
      category: 'handyman',
      name: '墙体暗管爆裂 / 水管漏水急性抢修',
      artisanTitle: '资深持证水电工程师',
      badge: '30分急达',
      basePriceMY: 80,
      basePriceSG: 60,
      duration: '紧急出发',
      desc: '高阻抗精密测漏仪精确定位漏水点，快速切除破损段管路，热熔 PPR 管道加固与打压测试。',
      sop: ['进水主阀截断与现场保全', '仪器无损测漏精确定位', '原厂PPR加厚热熔焊接', '管网打压 0.8MPa 维持半小时验漏'],
      options: {
        parts: [
          { name: '标准 PPR 管材与弯头配件 (含工料)', extraMY: 0, extraSG: 0 },
          { name: '加装全铜加厚主控球阀配件', extraMY: 35, extraSG: 25 },
          { name: '管网高水压减压阀总成更换', extraMY: 60, extraSG: 45 }
        ]
      },
      portfolio: ['测漏热成像漏水点定位', 'PPR管焊接规范接头'],
      mode: '工程师上门急修'
    },
    {
      id: 'h_aircon',
      category: 'handyman',
      name: '分体冷气空调化学深度拆洗 (Chemical Wash)',
      artisanTitle: '暖通制冷高级技工',
      badge: '效能恢复',
      basePriceMY: 120,
      basePriceSG: 85,
      duration: '预约工时',
      desc: '外壳风轮蒸发器完整拆卸，环保化学药水剥离霉菌与厚重积尘，消除异味并回升制冷能效。',
      sop: ['周围墙面与家具防水保护布铺设', '蒸发器高压喷洒专用药水分解污垢', '高压水枪冲洗室外机散热器', '出风口风速与制冷温差检测复验'],
      options: {
        parts: [
          { name: '单台挂机深度化学拆洗', extraMY: 0, extraSG: 0 },
          { name: '环保冷媒 R32/R410A 充注检测', extraMY: 40, extraSG: 30 }
        ]
      },
      portfolio: ['风轮清洗前后惊人黑垢对比', '出风温差从21度恢复到14度'],
      mode: '工程师上门'
    }
  ],

  // 实体入驻商户数据库 (支持商家端动态新增并保存至 localStorage)
  merchants: [
    {
      id: 'm_store_01',
      name: '绿意美学·经络芳疗生活馆',
      category: '理疗养生',
      rating: '4.98',
      reviewsCount: 890,
      address: '沙巴·亚庇滨海大道 88 号 (靠近大茄来)',
      openTime: '10:00 - 23:00',
      amenities: ['独立单双人包厢', '独立卫浴', '免费花茶点心', '专属车位'],
      verifiedCode: 'SSM-202401889K',
      services: ['肩颈解结推拿', '督脉全身推拿', '芳香精油舒缓'],
      syncedAt: '2026-09-05'
    },
    {
      id: 'm_store_02',
      name: '萌宠物语·名猫名犬养护沙龙',
      category: '宠物美容',
      rating: '4.95',
      reviewsCount: 620,
      address: '加雅街商业区 12 号铺 (Gaya Street)',
      openTime: '09:30 - 20:30',
      amenities: ['低噪恒温烘干房', '医用紫外灭菌', '全景透明美容间'],
      verifiedCode: 'SSM-202309812M',
      services: ['全犬猫造型精修', '纳米草本药浴', '猫咪低应激洗护'],
      syncedAt: '2026-09-05'
    }
  ],

  // 真实履约客户真实反馈评价库 (四维打分与实拍心得)
  reviews: [
    {
      customer: '陈雅文 (亚庇滨海区)',
      artisan: '林师姐 (高级经络调理师)',
      service: '办公室肩颈深层筋膜解结',
      scores: { skill: 5, time: 5, hygiene: 5, attitude: 5 },
      content: '手劲非常透！常年用电脑右肩胛骨缝酸痛到头痛，林师姐带着一次性垫单和热毛巾上门，找穴位极其精准，按完右转脖子完全没有弹响声了。',
      tags: ['手法透穴', '自带无菌垫单', '无推销'],
      date: '昨天 15:40'
    },
    {
      customer: '黄先生 (达迈住宅区)',
      artisan: '陈工 (高级水电急修工程师)',
      service: '墙体暗管爆裂急性抢修',
      scores: { skill: 5, time: 5, hygiene: 5, attitude: 5 },
      content: '半夜厨房地板突然涌水出来，慌得不行。在 Vgo 提交工单 3 分钟陈工就来电，22分钟带齐测漏仪器敲门，切管热熔行云流水，收费清单明明白白。',
      tags: ['20分钟速达', '专业仪器测漏', '明码实价'],
      date: '前天 23:15'
    },
    {
      customer: 'Sarah Tan (市中心公寓)',
      artisan: '阿明 (宠物高级造型师)',
      service: '全犬猫专业精修剪毛',
      scores: { skill: 5, time: 5, hygiene: 5, attitude: 5 },
      content: '家里 4 岁比熊胆子很小，阿明师傅安抚手法很专业，剪指甲全程没叫一声。剪出来的熊头圆滚滚超级可爱，毛修得很细腻，满分好评！',
      tags: ['手法温柔', '造型圆润', '猫狗不应激'],
      date: '3天前'
    }
  ]
};

// 从本地持久化存储动态同步商户
try {
  const localStores = JSON.parse(localStorage.getItem('vgo_custom_merchants') || '[]');
  if (Array.isArray(localStores) && localStores.length > 0) {
    localStores.forEach(st => {
      if (!window.vgoCatalog.merchants.some(m => m.id === st.id)) {
        window.vgoCatalog.merchants.unshift(st);
      }
    });
  }
} catch (e) {
  console.warn('读取本地商户同步缓存异常:', e);
}
