window.vgoCatalog = {
  // 一、理疗与芳香推拿 (正规持证手艺)
  massage: [
    {
      id: 'm_cervical',
      category: 'massage',
      name: '办公室肩颈定向深层筋膜解结',
      artisanTitle: '高级理疗推拿师',
      badge: '久坐必选',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&auto=format&fit=crop&q=80',
      artisanAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      artisanName: 'Lisa 师姐',
      experience: '7年资深经验 · 累计完成 1,420+ 单',
      basePriceMY: 78,
      basePriceSG: 48,
      duration: '45分钟',
      desc: '专克久坐低头族肩胛骨缝酸痛、富贵包高耸与落枕僵硬。纯手工循经疏理风池、天宗与肩井穴。',
      targetAudience: '白领IT办公族、长期驾车者、肩颈酸麻僵硬人群',
      sop: ['75%医用酒精与草本净手', '热敷肩胛解肌粘连', '深层解结揉捏推拿', '颈椎被动拉伸放松'],
      options: {
        pressure: ['柔和舒缓', '适中渗透', '重压深解'],
        oil: [
          { name: '草本通络基础植物油', extraMY: 0, extraSG: 0 },
          { name: '高纯度老姜生姜温阳精油', extraMY: 20, extraSG: 15 },
          { name: '法国薰衣草安神助眠精油', extraMY: 25, extraSG: 18 }
        ]
      },
      mode: '手艺人上门 / 认证门店'
    },
    {
      id: 'm_fullbody',
      category: 'massage',
      name: '全息督脉十二经络全身穴位推拿',
      artisanTitle: '资深经络调理师',
      badge: '深度排湿',
      image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&auto=format&fit=crop&q=80',
      artisanAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      artisanName: '陈师傅',
      experience: '10年古法手艺 · 5.0分金牌技师',
      basePriceMY: 118,
      basePriceSG: 75,
      duration: '90分钟',
      desc: '依循脊柱督脉与足太阳膀胱经深层通脉，配以腰骶强肾点按与全身四肢关节牵引，排解全身疲乏。',
      targetAudience: '身体湿寒沉重、易失眠多梦、经常感到体虚疲惫者',
      sop: ['自带一次性隔离防尘单', '督脉行气滚法松肌', '全身重点穴位指压', '头部醒神点穴收尾'],
      options: {
        pressure: ['标准渗透', '传统重手法'],
        oil: [
          { name: '天然甜杏仁基底油', extraMY: 0, extraSG: 0 },
          { name: '大马士革玫瑰滋养精油', extraMY: 30, extraSG: 20 }
        ]
      },
      mode: '手艺人上门 / 认证门店'
    }
  ],

  // 二、生活美容与眼部面部手艺
  beauty: [
    {
      id: 'b_eyelash',
      category: 'beauty',
      name: '日韩系轻奢单根无感睫毛嫁接',
      artisanTitle: '认证高级美睫造型师',
      badge: '精细手工',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
      artisanAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      artisanName: 'Queenie 造型师',
      experience: '日本JLA美睫认证 · 890+ 客服实评',
      basePriceMY: 110,
      basePriceSG: 75,
      duration: '80分钟',
      desc: '距睫毛根部精准保持0.5mm安全距离，一根一接，宛如原生。零下坠负重感，眼型定制修饰。',
      targetAudience: '睫毛稀疏短浅、懒于日常画眼妆、追求自然放大双眼的女士',
      sop: ['眼周油脂蛋白清洁', '水凝胶眼贴深层隔离', '医用防过敏黑胶嫁接', '微风定型防熏眼'],
      options: {
        material: [
          { name: '进口蚕丝蛋白软毛 (120根自然款)', extraMY: 0, extraSG: 0 },
          { name: '超轻极细哑光扁毛 (160根浓密款)', extraMY: 25, extraSG: 18 },
          { name: '婴儿弯山茶花开花 (200根立体款)', extraMY: 40, extraSG: 28 }
        ],
        curl: ['J自然微翘', 'B轻柔空气感', 'C芭比卷翘']
      },
      mode: '手艺人上门 / 到店体验'
    },
    {
      id: 'b_hydro',
      category: 'beauty',
      name: '超微小气泡毛孔深层净化与水光注入',
      artisanTitle: '专业皮肤健康管理师',
      badge: '净透亮白',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80',
      artisanAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      artisanName: 'Elena 老师',
      experience: '韩国皮肤协会认证 · 专研敏感肌',
      basePriceMY: 138,
      basePriceSG: 88,
      duration: '60分钟',
      desc: '真空微负压双向涡流技术温和吸走黑头油脂角质，导入高浓度玻尿酸原液，使毛孔细腻净透。',
      targetAudience: 'T区油脂旺盛、草莓鼻黑头严重、缺水干燥卡粉肌',
      sop: ['氨基酸温和洗颜', '果酸温和导出软化角质', '负压超微气泡深度吸污', '医用冷敷贴镇定收缩'],
      options: {
        material: [
          { name: '基础玻尿酸超声波导入', extraMY: 0, extraSG: 0 },
          { name: '胶原蛋白紧致导入 + 红蓝光修复', extraMY: 35, extraSG: 25 }
        ]
      },
      mode: '手艺人上门 / 到店体验'
    }
  ],

  // 三、宠物美容与专业洗护
  pet: [
    {
      id: 'p_styling',
      category: 'pet',
      name: '全犬种/猫咪专业精修剪毛与低应激洗护',
      artisanTitle: 'CKU认证高级宠物美容师',
      badge: '低应激洗护',
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop&q=80',
      artisanAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      artisanName: '阿明师傅',
      experience: '6年特级宠物美容经验 · 熟悉猫犬行为学',
      basePriceMY: 90,
      basePriceSG: 60,
      duration: '90分钟',
      desc: '根据宠物体型骨骼手工剪毛修圆造型，含洁耳道、拔耳毛、剪趾甲、脚底毛剔净、挤肛门腺。',
      targetAudience: '需定期修型的贵宾、比熊、雪纳瑞，及胆小敏感猫咪',
      sop: ['基础皮毛健康检查', '恒温静音低风吹干拉毛', '面部四肢精细纯手工修型', '消毒耳道与脚趾护理'],
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
      mode: '手艺人上门 / 认证沙龙'
    },
    {
      id: 'p_spa',
      category: 'pet',
      name: '微气泡草本药浴深层除菌除螨SPA',
      artisanTitle: '宠物皮毛健康护理师',
      badge: '除屑去痒',
      image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=600&auto=format&fit=crop&q=80',
      artisanAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      artisanName: 'Sam 工长',
      experience: '专注宠物皮肤病护理 · 兽医护理助理背景',
      basePriceMY: 80,
      basePriceSG: 55,
      duration: '60分钟',
      desc: '超细微纳米微气泡渗入毛孔深处剥离皮脂积垢，配合天然草本中草药浸泡，舒缓皮炎发红。',
      targetAudience: '有体味、频繁抓挠、真菌螨虫皮屑困扰的爱宠',
      sop: ['去浮毛死毛细梳开结', '微气泡温水药浴浸泡15分钟', '负离子烘干防感冒', '天然毛发滋养喷雾'],
      options: {
        petWeight: [
          { name: '小型宠 (0 - 5 kg)', extraMY: 0, extraSG: 0 },
          { name: '中大型宠 (5 - 15 kg)', extraMY: 25, extraSG: 18 }
        ]
      },
      mode: '手艺人上门 / 认证沙龙'
    }
  ],

  // 四、水电与技术工程
  handyman: [
    {
      id: 'h_pipe',
      category: 'handyman',
      name: '墙体暗管爆裂 / 水管漏水急性抢修',
      artisanTitle: '资深持证水电工程师',
      badge: '30分急达',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      artisanAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      artisanName: '陈工',
      experience: '持马/新两国电工水工双证 · 15年经验',
      basePriceMY: 80,
      basePriceSG: 60,
      duration: '快速出警',
      desc: '工业声波精密测漏仪精确定位漏水点，避免大面积破坏墙体，加厚 PPR 热熔焊接打压保固。',
      targetAudience: '突发爆管漏水、水压骤降、墙壁天花板急性渗水家庭',
      sop: ['进水截断与安全排险', '仪器精准定位漏水点', '原厂PPR加厚热熔熔接', '打压机维持0.8MPa密闭测试'],
      options: {
        parts: [
          { name: '标准 PPR 管件与接头材料 (含工料)', extraMY: 0, extraSG: 0 },
          { name: '加装全铜加厚主控阀门总成', extraMY: 35, extraSG: 25 },
          { name: '入户高水压专用调压防爆阀', extraMY: 60, extraSG: 45 }
        ]
      },
      mode: '工程师即刻上门'
    },
    {
      id: 'h_aircon',
      category: 'handyman',
      name: '分体冷气空调化学深度拆洗 (Chemical Wash)',
      artisanTitle: '暖通冷气高级技师',
      badge: '强劲制冷',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
      artisanAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      artisanName: '黄师傅',
      experience: '大金/松下暖通原厂培训技师',
      basePriceMY: 120,
      basePriceSG: 85,
      duration: '预约工时',
      desc: '整机外壳风轮拆卸，环保无毒化学药水深度剥离霉菌与厚重积尘，消除酸臭味并大幅节电。',
      targetAudience: '空调吹风异味、出风不冷、室内机严重滴水、超过半年未洗者',
      sop: ['全屋防水保护罩铺垫', '专用药水高压喷洒铝片蒸发器', '风轮轴承清理润滑', '出风口风速与温差测定'],
      options: {
        parts: [
          { name: '单台室内机化学拆洗 (含高温灭菌)', extraMY: 0, extraSG: 0 },
          { name: 'R32/R410A 环保冷媒精准补注检测', extraMY: 40, extraSG: 30 }
        ]
      },
      mode: '工程师预约上门'
    }
  ],

  // 认证入驻实体门店
  merchants: [
    {
      id: 'm_store_01',
      name: '绿意美学·经络芳疗生活馆',
      category: '理疗养生',
      rating: '4.98',
      reviewsCount: 890,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
      address: '沙巴·亚庇滨海大道 88 号 (靠近大茄来)',
      openTime: '10:00 - 23:00',
      amenities: ['独立单双人静音包厢', '五星级卫浴设施', '免费有机花茶点心', '专属地下车位'],
      verifiedCode: 'SSM-202401889K',
      services: ['肩颈解结推拿', '督脉全身推拿', '芳香精油舒缓'],
      syncedAt: '2026-09-05'
    },
    {
      id: 'm_store_02',
      name: '萌宠物语·名猫名犬健康美学沙龙',
      category: '宠物美容',
      rating: '4.95',
      reviewsCount: 620,
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=80',
      address: '加雅街商业区 12 号铺 (Gaya Street)',
      openTime: '09:30 - 20:30',
      amenities: ['低噪恒温烘干房', '医用紫外灭菌消毒', '全景透明无应激美容室'],
      verifiedCode: 'SSM-202309812M',
      services: ['全犬猫造型精修', '纳米草本药浴', '猫咪低应激洗护'],
      syncedAt: '2026-09-05'
    }
  ],

  // 真实客户评价反馈库 (带顾客头像与实名订单验证)
  reviews: [
    {
      customer: '陈雅文 (亚庇滨海区)',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      artisan: 'Lisa 师姐 (高级推拿师)',
      service: '办公室肩颈深层筋膜解结',
      scores: { skill: 5, time: 5, hygiene: 5, attitude: 5 },
      content: '手劲真的很透！在电脑前坐久了右边肩胛骨缝酸痛得头晕，Lisa 师姐带着一次性垫单和热毛巾上门，找穴位极其精准，按完全身温热轻快，右转头没有任何弹响了！',
      tags: ['手法透穴', '自带无菌单', '绝无推销'],
      date: '昨天 15:40'
    },
    {
      customer: 'Mr. Kevin (加雅街居民)',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
      artisan: '陈工 (高级水电工程师)',
      service: '暗管爆裂水管急修',
      scores: { skill: 5, time: 5, hygiene: 5, attitude: 5 },
      content: '半夜厨房地板突发涌水，慌得不行。在 Vgo 发单不到3分钟陈工就来电，22分钟带齐测漏仪器敲门，切管热熔行云流水，收费清单明明白白，救了大急！',
      tags: ['20分急达', '测漏仪器专业', '明码实价'],
      date: '前天 23:15'
    },
    {
      customer: 'Sarah Tan (市中心公寓)',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      artisan: '阿明师傅 (特级宠物造型师)',
      service: '全犬猫专业精修剪毛',
      scores: { skill: 5, time: 5, hygiene: 5, attitude: 5 },
      content: '家里4岁比熊极其胆小，阿明师傅安抚手法很轻柔，剪指甲全程安安静静。剪出来的熊头圆滚滚特别可爱，毛发吹得很蓬松，五星推荐！',
      tags: ['安抚手法好', '造型圆润', '猫狗不应激'],
      date: '3天前'
    }
  ]
};
