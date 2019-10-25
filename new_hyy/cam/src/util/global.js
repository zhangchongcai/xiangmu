const install = {
  pageSize: 15,
  pageSizes: [15, 30, 45, 60],
  iconColors: [
    '#fe825e', // 橙色
    '#8e7eff', // 紫色
    '#3b74ff', // 蓝色
    '#FE6081', // 红色
    '#fec107', // 黄色
    '#17cd31' // 绿色
  ],
  // 商品详情 --趋势指标
  commodityDetailTrend: [
    { id: 'xse', name: '销售额' },
    {
      id: 'xsdl',
      name: '销售单量'
    },
    {
      id: 'xssl',
      name: '销售数量 '
    },
    {
      id: 'kdj',
      name: '客单价'
    },
    {
      id: 'jdj',
      name: '件单价'
    },
    {
      id: 'kdl',
      name: '客单量'
    }
  ],
  // 商品详情 --其他趋势指标
  commodityDetailTrendOther: [
    {
      id: 'xsml',
      name: '销售毛利'
    },
    {
      id: 'xsmll',
      name: '销售毛利率'
    },
    {
      id: 'xscb',
      name: '销售成本 '
    },
    {
      id: 'cbj',
      name: '成本价'
    },
    {
      id: 'gml',
      name: '购买率'
    },
    {
      id: 'rjmpje',
      name: '人均卖品金额'
    },
    {
      id: 'hyxfzb',
      name: '会员消费占比'
    },
    // {
    //   id: 'tcxfzb',
    //   name: "套餐消费占比"
    // },
    {
      id: 'cgsl',
      name: '采购数量'
    },
    {
      id: 'cgcb',
      name: '采购成本'
    },
    {
      id: 'pjcgj',
      name: '平均采购价'
    },
    {
      id: 'qckcsl',
      name: '期初库存数量'
    },
    {
      id: 'qckccbe',
      name: '期初库存成本额'
    },
    {
      id: 'qmkcsl',
      name: '期末库存数量'
    },
    {
      id: 'qmkccbe',
      name: '期末库存成本额'
    },
    {
      id: 'kcslzzt',
      name: '库存数量周转天'
    },
    {
      id: 'kcjezzt',
      name: '库存金额周转天'
    }
  ],
  // 商品分析 --趋势指标
  commodityTrend: [
    {
      id: 'sqos',
      name: '在售SKU数量'
    },
    {
      id: 'qoms',
      name: '动销SKU数量'
    },
    {
      id: 'msr',
      name: '动销率 '
    },
    // {
    //   id: 'nop',
    //   name: "套餐数量"
    // },
    {
      id: 'ps',
      name: '套餐销售额'
    },
    {
      id: 'popc',
      name: '套餐消费占比'
    }
  ],
  // 品类 --组织类型识别
  judgeOrgType: ['group', 'area', 'cinema'].find(item =>
    location.pathname.includes(item)
  ),
  // 品类 --趋势指标
  categoryTrend: [
    {
      id: 'xse',
      name: '销售额'
    },
    {
      id: 'xsdl',
      name: '销售单量'
    },
    {
      id: 'xssl',
      name: '销售数量'
    },
    {
      id: 'xsml',
      name: '销售毛利'
    },
    {
      id: 'xscb',
      name: '销售成本'
    },
    {
      id: 'rjmpje',
      name: '人均卖品金额'
    }
  ],
  // 品类 --趋势指标其他
  categoryTrendOther: [
    {
      id: 'kdj',
      name: '客单价',
      isHistogram: true
    },
    {
      id: 'jdj',
      name: '件单价',
      isHistogram: true
    },
    {
      id: 'kdl',
      name: '客单量',
      isHistogram: true
    },
    {
      id: 'cbj',
      name: '成本价',
      isHistogram: true
    },
    {
      id: 'xsmlr',
      name: '销售毛利率',
      isHistogram: true
    },
    {
      id: 'gml',
      name: '购买率',
      isHistogram: true
    },
    // {
    //   id: 'tcxfzb',
    //   name: "套餐消费占比",
    //   isHistogram: true
    // },
    {
      id: 'hyxfzb',
      name: '会员消费占比',
      isHistogram: true
    }
  ],
  // 卖品指标icons
  salesIcon: {
    kdl: {
      icon: 'icon-neiye-kedanjia',
      name: '客单量'
    },
    jdj: {
      icon: 'icon-jingyingjuece-feiyong',
      name: '件单价'
    },
    kdj: {
      icon: 'icon-jingyingjuece-feiyong',
      name: '客单价'
    },
    xssl: {
      icon: 'icon-neiye-kedanjia',
      name: '销售数量'
    },
    xsdl: {
      icon: 'icon-neiye-kedanjia',
      name: '销售单量'
    },
    xse: {
      icon: 'icon-neiye-zongxiaoshoue',
      name: '销售额'
    },
    //
    xscb: {
      icon: 'icon-jingyingjuece-chengben',
      name: '销售成本'
    },
    xsml: {
      icon: 'icon-neiye-jine',
      name: '销售毛利'
    },
    xsmlr: {
      icon: 'icon-neiye-jine',
      name: '销售毛利率'
    },
    //
    hyxfzb: {
      icon: 'icon-jingyingjuece-fene',
      name: '会员消费占比'
    },
    tcxfzb: {
      icon: 'icon-jingyingjuece-fene',
      name: '套餐消费占比'
    },
    rjmpje: {
      icon: 'icon-jingyingjuece-feiyong',
      name: '人均卖品金额'
    },
    gml: {
      icon: 'icon-neiye-zongxiaoshoue',
      name: '购买率'
    }
  },
  // 会员指标icon
  memberIcon: {
    xzhy: {
      icon: 'icon-neiyegoumaishuai',
      name: '新增会员数'
    },
    yxhy: {
      icon: 'icon-neiyegoumaishuai',
      name: '有效会员数'
    },
    ljhy: {
      icon: 'icon-neiyegoumaishuai',
      name: '累计会员数'
    },
    xinkhy: {
      icon: 'icon-neiyegoumaishuai',
      name: '新卡会员数'
    },
    xukhy: {
      icon: 'icon-neiyegoumaishuai',
      name: '续卡会员数'
    },
    bkhy: {
      icon: 'icon-neiyegoumaishuai',
      name: '补卡会员数'
    },
    czhy: {
      icon: 'icon-neiyegoumaishuai',
      name: '储值会员数'
    },
    ydqhy30: {
      icon: 'icon-neiyegoumaishuai',
      name: '已到期30天内会员'
    },
    ydqhy7: {
      icon: 'icon-neiyegoumaishuai',
      name: '已到期7天内会员'
    },
    kzhyh: {
      icon: 'icon-neiyegoumaishuai',
      name: '可转化用户数'
    },
    //
    hykfsy: {
      icon: 'icon-neiye-jine',
      name: '会员卡费收益'
    },
    hyczje: {
      icon: 'icon-neiye-zongxiaoshoue',
      name: '会员储值金额'
    },
    hyxfje: {
      icon: 'icon-neiye-zongxiaoshoue',
      name: '会员消费金额'
    },
    ljczye: {
      icon: 'icon-neiye-jine',
      name: '累计储值余额'
    },
    hyxksy: {
      icon: 'icon-neiye-jine',
      name: '会员新开卡收益'
    },
    hyxuksy: {
      icon: 'icon-neiye-jine',
      name: '会员续卡收益'
    },
    hybksy: {
      icon: 'icon-neiye-jine',
      name: '会员补卡收益'
    },
    hykdj: {
      icon: 'icon-jingyingjuece-feiyong',
      name: '会员客单价'
    },
    hyrjgx: {
      icon: 'icon-jingyingjuece-feiyong',
      name: '会员人均贡献'
    },
    //
    hyxfzb: {
      icon: 'icon-jingyingjuece-fene',
      name: '会员消费占比'
    },
    myxhyzb: {
      icon: 'icon-jingyingjuece-fene',
      name: '有效会员占比'
    }
  },
  // 票劵icon
  ticketIcon: {
    //
    ddxfe: {
      icon: 'icon-jingyingjuece-feiyong',
      name: '带动消费额'
    },
    ddxfdl: {
      icon: 'icon-neiye-kedanjia',
      name: '带动消费单量'
    },
    kdj: {
      icon: 'icon-jingyingjuece-feiyong',
      name: '客单价'
    },
    //
    ffsl: {
      icon: 'icon-neiye-kedanjia',
      name: '发放数量'
    },
    sysl: {
      icon: 'icon-neiye-kedanjia',
      name: '使用数量'
    },
    syl: {
      icon: 'icon-jingyingjuece-fene',
      name: '使用率'
    },
    //
    yspqcb: {
      icon: 'icon-jingyingjuece-chengben',
      name: '发放票券成本'
    },
    sypqcb: {
      icon: 'icon-jingyingjuece-chengben',
      name: '使用票券成本'
    },
    //
    cyhysl: {
      icon: 'icon-neiyegoumaishuai',
      name: '参与会员数量'
    },
    hyxfzb: {
      icon: 'icon-jingyingjuece-fene',
      name: '会员消费占比'
    }
  },
  // 票房icon
  officeIcon: {},
  boxOfficeMemberMap: {
    boxOffice: 'memberBoxOffice',
    audienceCount: 'memberAudienceCount',
    avgTicketPrice: 'memberAvgTicketPrice',
    memberBoxOfficePer: 'memberBoxOfficePer',
    hallServicePrice: 'memberHallServicePrice',
    payBoxOffice: 'memberPayBoxOffice',
    servicePrice: 'memberServicePrice',
    splitBoxOffice: 'memberSplitBoxOffice'
  },
  // 票房指标单位
  formatBoxOfficeTargetUnit (type, money) {
    function formatUnit (num) {
      if ([-99999.99, 99999.99].includes(num)) return '';
      if (!isNaN(num)) {
        if (num >= 0) {
          if (num < 10000) {
            let number = num.toFixed(2);
            return number < 10000 ? '' : '万';
          } else if (num < 100000000) {
            let number = (num / 10000).toFixed(2);
            return number < 10000 ? '万' : '亿';
          } else {
            return '亿';
          }
        } else {
          let n = num * -1;
          if (n < 10000) {
            let number = n.toFixed(2);
            return number < 10000 ? '' : '万';
          } else if (n < 100000000) {
            let number = (n / 10000).toFixed(2);
            return number < 10000 ? '万' : '亿';
          } else {
            return '亿';
          }
        }
      } else {
        return '';
      }
    }
    let num = money * 1;
    let unitMap = {
      pf: `${formatUnit(num)}元`,
      gyrc: `${formatUnit(num)}人`,
      pjpj: '元',
      szl: '%',
      hyxfzb: '%',
      scfe: '%',
      sffwf: `${formatUnit(num)}元`,
      ytfwf: `${formatUnit(num)}元`,
      yjzzpf: `${formatUnit(num)}元`,
      fzpf: `${formatUnit(num)}元`,
      cc: `${formatUnit(num)}场`,
      rjcc: `${formatUnit(num)}人`,
      cjrc: `${formatUnit(num)}人`,
      dzsy: `${formatUnit(num)}元`,
      kcl: '%',
      // 另外一套key
      boxOffice: `${formatUnit(num)}元`,
      audienceCount: `${formatUnit(num)}人`,
      avgTicketPrice: '元',
      attendanceRate: '%',
      memberBoxOfficePer: '%',
      servicePrice: `${formatUnit(num)}元`,
      hallServicePrice: `${formatUnit(num)}元`,
      payBoxOffice: `${formatUnit(num)}元`,
      splitBoxOffice: `${formatUnit(num)}元`,
      planShowCount: `${formatUnit(num)}场`,
      avgPlanShowCount: `${formatUnit(num)}人`,
      unShowCountRate: '%',
      avgSeatPrice: `${formatUnit(num)}元`,
      marketShare: '%',
      // 商品详情的一套key
      销售额: `${formatUnit(num)}元`,
      销售单量: `${formatUnit(num)}单`,
      销售数量: `${formatUnit(num)}件`,
      客单价: `${formatUnit(num)}元`,
      件单价: `${formatUnit(num)}元`,
      客单量: `${formatUnit(num)}件/单`,
      销售成本: `${formatUnit(num)}元`,
      销售毛利: `${formatUnit(num)}元`,
      成本价: `${formatUnit(num)}元`,
      销售毛利率: `${formatUnit(num)}%`,
      人均卖品金额: `${formatUnit(num)}元`,
      购买率: `${formatUnit(num)}%`,
      会员消费占比: `${formatUnit(num)}%`,
      套餐消费占比: `${formatUnit(num)}%`,
      采购数量: `${formatUnit(num)}件`,
      采购成本: `${formatUnit(num)}元`,
      平均采购价: `${formatUnit(num)}元`,
      期初库存数量: `${formatUnit(num)}件`,
      期初库存金额: `${formatUnit(num)}元`,
      期初库存成本额: `${formatUnit(num)}元`,
      期末库存数量: `${formatUnit(num)}件`,
      期末库存金额: `${formatUnit(num)}元`,
      期末库存成本额: `${formatUnit(num)}元`,
      库存数量周转天: `${formatUnit(num)}天`,
      库存金额周转天: `${formatUnit(num)}天`,
      // 商品详情的另外一套key
      xse: `${formatUnit(num)}元`,
      xsdl: `${formatUnit(num)}单`,
      xssl: `${formatUnit(num)}件`,
      cgsl: `${formatUnit(num)}件`,
      kdj: `${formatUnit(num)}元`,
      jdj: `${formatUnit(num)}元`,
      kdl: `${formatUnit(num)}件/单`,
      xscb: `${formatUnit(num)}元`,
      xsml: `${formatUnit(num)}元`,
      cbj: `${formatUnit(num)}元`,
      xsmll: `${formatUnit(num)}%`,
      rjmpje: `${formatUnit(num)}元`,
      gml: `${formatUnit(num)}%`,
      hyxfzb: `${formatUnit(num)}%`,
      tcxfzb: `${formatUnit(num)}%`,
      cgcb: `${formatUnit(num)}元`,
      pjcgj: `${formatUnit(num)}元`,
      qckcsl: `${formatUnit(num)}件`,
      qckccbe: `${formatUnit(num)}元`,
      qmkcsl: `${formatUnit(num)}件`,
      qmkccbe: `${formatUnit(num)}元`,
      kcslzzt: `${formatUnit(num)}天`,
      kcjezzt: `${formatUnit(num)}天`,
      // 商品分析的一套key
      sqos: `${formatUnit(num)}件`,
      qoms: `${formatUnit(num)}件`,
      msr: `${formatUnit(num)}%`,
      nop: `${formatUnit(num)}件`,
      ps: `${formatUnit(num)}元`,
      popc: `${formatUnit(num)}%`
    };
    return unitMap[type];
  },
  // 票房指标 --趋势
  boxOfficeTrend: [
    {
      id: 'boxOffice',
      name: '票房'
    },
    {
      id: 'audienceCount',
      name: '观影人次'
    },
    {
      id: 'avgTicketPrice',
      name: '平均票价'
    },
    {
      id: 'servicePrice',
      name: '三方服务费'
    },
    {
      id: 'splitBoxOffice',
      name: '分账票房'
    },
    {
      id: 'payBoxOffice',
      name: '应缴专资票房'
    }
  ],
  // 票房指标 --趋势其他
  boxOfficeTrendOther: [
    {
      id: 'avgPlanShowCount',
      name: '场均人次'
    },
    {
      id: 'attendanceRate',
      name: '上座率'
    },
    {
      id: 'avgSeatPrice',
      name: '单座产出'
    },
    {
      id: 'planShowCount',
      name: '场次'
    },
    {
      id: 'hallServicePrice',
      name: '影厅服务费',
      onlyMember: true
    },
    {
      id: 'memberBoxOfficePer',
      name: '会员消费占比',
      onlyMember: true
    },
    {
      id: 'marketShare',
      name: '市场份额'
    },
    {
      id: 'unShowCountRate',
      name: '空场率'
    }
  ],
  // 票房指标 --影片  --渠道
  boxOfficeMovie: [
    {
      id: 'boxOffice',
      name: '票房'
    },
    {
      id: 'audienceCount',
      name: '观影人次'
    },
    {
      id: 'servicePrice',
      name: '三方服务费'
    }
  ],
  // 票房指标 --影片其他
  boxOfficeMovieOther: [
    {
      id: 'avgTicketPrice',
      name: '平均票价',
      onlyMember: true
    },
    {
      id: 'planShowCount',
      name: '场次'
    },
    {
      id: 'hallServicePrice',
      name: '影厅服务费',
      onlyMember: true
    },
    {
      id: 'payBoxOffice',
      name: '应缴专资票房',
      onlyMember: true
    },
    {
      id: 'splitBoxOffice',
      name: '分账票房',
      onlyMember: true
    },
    {
      id: 'attendanceRate',
      name: '上座率'
    },
    {
      id: 'avgPlanShowCount',
      name: '场均人次'
    },
    // {
    //   id: 'avgSeatPrice',
    //   name: "单座产出"
    // },
    {
      id: 'unShowCountRate',
      name: '空场率'
    },
    {
      id: 'memberBoxOfficePer',
      name: '会员消费占比',
      onlyMember: true
    }
    // {
    //   id: 'marketShare',
    //   name: "市场份额"
    // }
  ],
  // 票房指标 --渠道其他
  boxOfficeChannelOther: [
    {
      id: 'avgTicketPrice',
      name: '平均票价',
      onlyMember: true
    },
    // {
    //   id: 'planShowCount',
    //   name: "场次"
    // },
    {
      id: 'memberBoxOfficePer',
      name: '会员消费占比',
      onlyMember: true
    }
  ],
  // 卖品指标
  targetLabel: [
    {
      id: 'xse',
      name: '销售额'
    },
    {
      id: 'xsdl',
      name: '销售单量'
    },
    {
      id: 'xssl',
      name: '销售数量'
    },
    {
      id: 'kdj',
      name: '客单价'
    },
    {
      id: 'jdj',
      name: '件单价'
    },
    {
      id: 'kdl',
      name: '客单量'
    }
  ],
  // 卖品其他指标
  otherLabel1: [
    {
      id: 'xsml',
      name: '销售毛利'
    },
    {
      id: 'xsmlr',
      name: '销售毛利率'
    },
    {
      id: 'xscb',
      name: '销售成本'
    },
    {
      id: 'gml',
      name: '购买率'
    },
    {
      id: 'rjmpje',
      name: '人均卖品金额'
    },
    {
      id: 'hyxfzb',
      name: '会员消费占比'
    }
  ],
  // 卖品其他指标
  otherLabel: [
    {
      id: 'xsml',
      name: '销售毛利'
    },
    {
      id: 'xsmlr',
      name: '销售毛利率'
    },
    {
      id: 'xscb',
      name: '销售成本'
    },
    {
      id: 'gml',
      name: '购买率'
    },
    {
      id: 'rjmpje',
      name: '人均卖品金额'
    },
    {
      id: 'hyxfzb',
      name: '会员消费占比'
    },
    {
      id: 'tcxfzb',
      name: '套餐消费占比'
    }
  ],
  // 卖品指标单位Map
  saleTargetUnitMap: {
    xse: '元', // 销售额
    xscb: '元', // 销售成本
    xsdl: '单', // 销售单量
    xssl: '件', // 销售数量
    xsml: '元', // 销售毛利
    xsmlr: '%', // 销售毛利润
    kdj: '元', // 客单价
    kdl: '件/单', // 客单量
    jdj: '元', // 件单价
    gml: '%', // 购买率
    rjmpje: '元', // 人均卖品金额
    hyxfzb: '%', // 会员消费占比
    tcxfzb: '%', // 套餐消费占比
    cbj: '元' // 成本价
  },
  // 会员指标单位Map
  memberTargetUnitMap: {
    xzhy: '人', // 新增会员
    yxhy: '人', // 有效会员
    ljhy: '人', // 累计会员
    kzhyh: '人', // 可转化用户
    xinkhy: '人', // 新卡会员
    xukhy: '人', // 续卡会员
    bkhy: '人', // 补卡会员
    czhy: '人', // 储值会员
    ydqhy30: '人', // 已到期30天会员
    ydqhy7: '人', // 已到期七天会员
    hykfsy: '元', // 会员卡费收益
    hyczje: '元', // 会员储值金额
    ljczye: '元', // 累计储值余额
    hyxfje: '元', // 会员消费金额
    hyxksy: '元', // 会员新开卡收益
    hyxuksy: '元', // 会员续卡收益
    hybksy: '元', // 会员补卡收益
    hykdj: '元', // 会员客单价
    hyrjgx: '元', // 会员人均贡献
    hyxfzb: '%', // 会员消费占比
    myxhyzb: '%' // 有效会员占比
  },
  // 会员指标
  memberTargetLabel: [
    { id: 'xzhy', name: '新增会员数' },
    { id: 'yxhy', name: '有效会员数' },
    { id: 'ljhy', name: '累计会员数' },
    { id: 'kzhyh', name: '可转化用户数' },
    { id: 'xinkhy', name: '新卡会员数' },
    { id: 'xukhy', name: '续卡会员数' }
  ],
  // 会员其他指标
  memberOtherLabel: [
    { id: 'bkhy', name: '补卡会员数' },
    { id: 'czhy', name: '储值会员数' },
    { id: 'ydqhy30', name: '到期30天内会员数' },
    { id: 'ydqhy7', name: '到期7天内会员数' },
    { id: 'hykfsy', name: '会员卡费收益' },
    { id: 'hyczje', name: '会员储值金额' },
    { id: 'hyxfje', name: '会员消费金额' },
    { id: 'ljczje', name: '累计储值金额' },
    { id: 'hyxksy', name: '会员新开卡收益' },
    { id: 'hyxuksy', name: '会员续卡收益' },
    { id: 'hybksy', name: '会员补卡收益' },
    { id: 'hykdj', name: '会员客单价' },
    { id: 'hyrjgx', name: '会员人均贡献' },
    { id: 'hyzhl', name: '会员转化率' },
    { id: 'hyxfzb', name: '会员消费占比' },
    { id: 'yxhyxfzb', name: '有效会员占比' }
  ],
  // 票券单位Map
  ticketTargetUnitMap: {
    ddxfe: '元', // 带动消费额
    ddxfdl: '单', // 带动消费单量
    kdj: '元', // 客单价
    ffsl: '张', // 发放数量
    sysl: '张', // 使用数量
    syl: '%', // 使用率
    yspqcb: '元', // 发放票券成本
    sypqcb: '元', // 使用票券成本
    cyhysl: '人', // 参与会员数量
    hyxfzb: '%' // 会员消费占比
  },
  // 单位是整数的指标
  targetNum: [
    'xzhy',
    'yxhy',
    'ljhy',
    'kzhyh',
    'xinkhy',
    'xukhy',
    'bkhy',
    'czhy',
    'ydqhy30',
    'ydqhy7',
    'ddxfdl',
    'ffsl',
    'sysl',
    'cyhysl'
  ],
  // 格式化数字（1万/亿）
  formatNum: (money, count, unit) => {
    let num = money * 1;
    let point = 2;
    if (!unit) {
      unit = '';
    }
    if (count == 0) {
      point = 0;
    } else {
      point = 2;
    }
    if (!isNaN(num)) {
      if (num >= 0) {
        if (num < 10000) {
          let number = num.toFixed(point);
          return number < 10000 ? number + unit : '1.00万' + unit;
        } else if (num < 100000000) {
          let number = (num / 10000).toFixed(2);
          return number < 10000 ? number + '万' + unit : '1.00亿' + unit;
        } else {
          return (num / 100000000).toFixed(2) + '亿' + unit;
        }
      } else {
        let n = num * -1;
        if (n < 10000) {
          let number = n.toFixed(point);
          return number < 10000
            ? (number * -1).toFixed(point) + unit
            : '-1.00万' + unit;
        } else if (n < 100000000) {
          let number = (n / 10000).toFixed(2);
          return number < 10000
            ? (number * -1).toFixed(2) + '万' + unit
            : '-1.00亿' + unit;
        } else {
          return ((n / 100000000) * -1).toFixed(2) + '亿' + unit;
        }
      }
    } else if (money == '∞') {
      return '∞' + unit;
    } else {
      return '--' + unit;
    }
  },
  // 格式化数字（不带单位,指标）
  formatMoney (money, count) {
    let num = money * 1;
    let point = 2;
    if (typeof count === 'undefined') {
      point = 2;
    } else {
      point = count;
    }
    if (!isNaN(num)) {
      if (num >= 0) {
        if (num < 10000) {
          let number = num.toFixed(point);
          return number < 10000 ? number : '1.00';
        } else if (num < 100000000) {
          let number = (num / 10000).toFixed(2);
          return number < 10000 ? number : '1.00';
        } else {
          return (num / 100000000).toFixed(2);
        }
      } else {
        let n = num * -1;
        if (n < 10000) {
          let number = n.toFixed(point);
          return number < 10000 ? (number * -1).toFixed(point) : '-1.00';
        } else if (n < 100000000) {
          let number = (n / 10000).toFixed(2);
          return number < 10000 ? (number * -1).toFixed(2) : '-1.00';
        } else {
          return ((n / 100000000) * -1).toFixed(2);
        }
      }
    } else if (money == '∞') {
      return '∞';
    } else {
      return '--';
    }
  },
  // 卖品指标单位
  formatTargetUnit: (type, money) => {
    function formatUnit (num) {
      if (!isNaN(num)) {
        if (num >= 0) {
          if (num < 10000) {
            let number = num.toFixed(2);
            return number < 10000 ? '' : '万';
          } else if (num < 100000000) {
            let number = (num / 10000).toFixed(2);
            return number < 10000 ? '万' : '亿';
          } else {
            return '亿';
          }
        } else {
          let n = num * -1;
          if (n < 10000) {
            let number = n.toFixed(2);
            return number < 10000 ? '' : '万';
          } else if (n < 100000000) {
            let number = (n / 10000).toFixed(2);
            return number < 10000 ? '万' : '亿';
          } else {
            return '亿';
          }
        }
      } else {
        return '';
      }
    }
    let num = money * 1;
    let unitMap = {
      xse: `${formatUnit(num)}元`, // 销售额
      xscb: `${formatUnit(num)}元`, // 销售成本
      xsdl: `${formatUnit(num)}元`, // 销售单量
      xssl: `${formatUnit(num)}件`, // 销售数量
      xsml: `${formatUnit(num)}元`, // 销售毛利
      kdj: `${formatUnit(num)}元`, // 客单价
      kdl: `${formatUnit(num)}件/单`, // 客单量
      jdj: `${formatUnit(num)}元`, // 件单价
      rjmpje: `${formatUnit(num)}元`, // 人均卖品金额
      cbj: `${formatUnit(num)}元`, // 成本价
      gml: `${formatUnit(num)}%`, // 购买率
      xsmlr: `${formatUnit(num)}%`, // 销售毛利率
      hyxfzb: `${formatUnit(num)}%`, // 会员消费占比
      tcxfzb: `${formatUnit(num)}%` // 套餐消费占比
    };
    return unitMap[type];
  },
  // 进销存指标单位
  formatInventoryUnit (type, money) {
    function formatUnit (num) {
      if (!isNaN(num)) {
        if (num >= 0) {
          if (num < 10000) {
            let number = num.toFixed(2);
            return number < 10000 ? '' : '万';
          } else if (num < 100000000) {
            let number = (num / 10000).toFixed(2);
            return number < 10000 ? '万' : '亿';
          } else {
            return '亿';
          }
        } else {
          let n = num * -1;
          if (n < 10000) {
            let number = n.toFixed(2);
            return number < 10000 ? '' : '万';
          } else if (n < 100000000) {
            let number = (n / 10000).toFixed(2);
            return number < 10000 ? '万' : '亿';
          } else {
            return '亿';
          }
        }
      } else {
        return '';
      }
    }
    let unit = formatUnit(money * 1);
    return unit + type;
  },
  // 会员指标单位
  formatMemberTargetUnit (type, money) {
    function formatUnit (num) {
      if (!isNaN(num)) {
        if (num >= 0) {
          if (num < 10000) {
            let number = num.toFixed(2);
            return number < 10000 ? '' : '万';
          } else if (num < 100000000) {
            let number = (num / 10000).toFixed(2);
            return number < 10000 ? '万' : '亿';
          } else {
            return '亿';
          }
        } else {
          let n = num * -1;
          if (n < 10000) {
            let number = n.toFixed(2);
            return number < 10000 ? '' : '万';
          } else if (n < 100000000) {
            let number = (n / 10000).toFixed(2);
            return number < 10000 ? '万' : '亿';
          } else {
            return '亿';
          }
        }
      } else {
        return '';
      }
    }
    let num = money * 1;
    let unitMap = {
      xzhy: `${formatUnit(num)}人`, // 新增会员
      yxhy: `${formatUnit(num)}人`, // 有效会员
      ljhy: `${formatUnit(num)}人`, // 累计会员
      kzhyh: `${formatUnit(num)}人`, // 可转化用户
      xinkhy: `${formatUnit(num)}人`, // 新卡会员
      xukhy: `${formatUnit(num)}人`, // 续卡会员
      bkhy: `${formatUnit(num)}人`, // 补卡会员
      czhy: `${formatUnit(num)}人`, // 储值会员
      ydqhy30: `${formatUnit(num)}人`, // 已到期30天会员
      ydqhy7: `${formatUnit(num)}人`, // 已到期7天会员
      hykfsy: `${formatUnit(num)}元`, // 会员卡费收益
      hyczje: `${formatUnit(num)}元`, // 会员储值金额
      ljczye: `${formatUnit(num)}元`, // 累计储值余额
      hyxfje: `${formatUnit(num)}元`, // 会员消费金额
      hyxksy: `${formatUnit(num)}元`, // 会员开新卡收益
      hyxuksy: `${formatUnit(num)}元`, // 会员续卡收益
      hybksy: `${formatUnit(num)}元`, // 会员补卡收益
      hykdj: `${formatUnit(num)}元`, // 会员客单价
      hyrjgx: `${formatUnit(num)}元`, // 会员人均贡献
      hyxfzb: `${formatUnit(num)}%`, // 会员消费占比
      myxhyzb: `${formatUnit(num)}%` // 有效会员占比
    };
    return unitMap[type];
  },
  // 票劵指标单位
  formatTicketUnit (type, money) {
    function formatUnit (num) {
      if (!isNaN(num)) {
        if (num >= 0) {
          if (num < 10000) {
            let number = num.toFixed(2);
            return number < 10000 ? '' : '万';
          } else if (num < 100000000) {
            let number = (num / 10000).toFixed(2);
            return number < 10000 ? '万' : '亿';
          } else {
            return '亿';
          }
        } else {
          let n = num * -1;
          if (n < 10000) {
            let number = n.toFixed(2);
            return number < 10000 ? '' : '万';
          } else if (n < 100000000) {
            let number = (n / 10000).toFixed(2);
            return number < 10000 ? '万' : '亿';
          } else {
            return '亿';
          }
        }
      } else {
        return '';
      }
    }
    let num = money * 1;
    let unitMap = {
      ddxfe: `${formatUnit(num)}元`, // 带动消费额
      ddxfdl: `${formatUnit(num)}单`, // 带动消费单量
      kdj: `${formatUnit(num)}元`, // 客单价
      ffsl: `${formatUnit(num)}张`, // 发放数量
      sysl: `${formatUnit(num)}张`, // 使用数量
      syl: `%`, // 使用率
      yspqcb: `${formatUnit(num)}元`, // 预算票劵成本
      sypqcb: `${formatUnit(num)}元`, // 使用票券成本
      cyhysl: `${formatUnit(num)}人`, // 参与会员数量
      hyxfzb: `%` // 会员消费占比
    };
    return unitMap[type];
  }
};
export default install;
