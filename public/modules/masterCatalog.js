/**
 * Vgo 企业级全品类服务规范与双市场定价矩阵
 * 覆盖：标准工时、质保周期、必备施工工具包及验收标准
 */
window.vgoMasterCatalog = {
  // 1. 理疗推拿专区
  massage: [
    {
      id: 'msg_thai_deep',
      name: '泰式古法全身经络拉伸调理',
      durationMins: 90,
      warranty: '服务即时验收 · 不满意当场免单',
      basePriceMY: 138.00,
      basePriceSG: 98.00,
      badge: '深度放松',
      toolkit: ['便携折叠理疗床', '高克重医用无纺布床单', '泰国纯草本透骨活络膏', '一次性消毒脚套'],
      sopStandards: '针对足太阳膀胱经与胆经进行深度揉拔，严禁粗暴按压脊椎骨缝，配手法拉伸。',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'msg_lymph_drain',
      name: '植物单方精油全身芳香淋巴引流',
      durationMins: 60,
      warranty: '欧盟进口精油低敏保障',
      basePriceMY: 128.00,
      basePriceSG: 88.00,
      badge: '女士挚爱',
      toolkit: ['进口冷压甜杏仁基础油', '法国薰衣草单方精油', '热敷天然玄武岩能量石'],
      sopStandards: '手法柔和均匀，沿淋巴回流方向顺向推抚，配热石温润督脉排湿。',
      image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&auto=format&fit=crop&q=80'
    }
  ],

  // 2. 美容美睫专区
  beauty: [
    {
      id: 'bty_lash_air',
      name: '日式空气感扁毛单根美睫嫁接',
      durationMins: 75,
      warranty: '7 天非人为脱落免费补睫',
      basePriceMY: 118.00,
      basePriceSG: 78.00,
      badge: '自然卷翘',
      toolkit: ['日本进口低敏黑胶 (持黏45天)', '抗菌0.15mm扁毛', '紫外线消杀医用弯镊'],
      sopStandards: '单根对单根精准嫁接，距真睫毛根部预留 0.5mm，严禁胶水触碰毛囊。',
      image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&auto=format&fit=crop&q=80'
    }
  ],

  // 3. 宠物洗美专区
  pet: [
    {
      id: 'pet_low_stress',
      name: '猫咪低应激上门深度去浮毛洗护',
      durationMins: 60,
      warranty: '全程柔性安抚 · 绝不使用暴力保定',
      basePriceMY: 98.00,
      basePriceSG: 68.00,
      badge: '专业猫咪C级认证',
      toolkit: ['便携静音无级调速水吹机', '天然燕麦抗敏香波', '医用级止血粉+安全圆头电推剪'],
      sopStandards: '作业前 10 分钟低频声波安抚，分步排梳去结，洗护水温恒定 38.5℃。',
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop&q=80'
    }
  ],

  // 4. 水电急修与 Airbnb 民宿救援
  handyman: [
    {
      id: 'hm_ac_chemical',
      name: '家用分体空调高压深度化学拆洗',
      durationMins: 60,
      warranty: '清洗后 30 天制冷与防漏水保修',
      basePriceMY: 120.00,
      basePriceSG: 85.00,
      badge: '深度除霉',
      toolkit: ['专用接水罩', '食品级中性铝翅片清洗剂', '140℃ 高温饱和蒸汽发生器'],
      sopStandards: '拆下外壳与贯流风轮深度冲刷，清洗蒸发器，测定出风口温度与压缩机电流。',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'hm_lock_rescue',
      name: '【Airbnb 30分急救】智能门锁断电故障救援',
      durationMins: 45,
      warranty: '现场恢复供电与机械离合检修',
      basePriceMY: 120.00,
      basePriceSG: 85.00,
      badge: '房东急救专线',
      toolkit: ['外接高功率 9V 应急供电模组', '锁芯防破坏微动挑针', '万用表及备用机械钥匙'],
      sopStandards: '30 分钟内极速到达，核验房客入住信息后合规复位离合，杜绝强行暴力拆锁。',
      image: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=600&auto=format&fit=crop&q=80'
    }
  ]
};
