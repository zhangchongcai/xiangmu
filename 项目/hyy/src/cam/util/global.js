

const install =  {
    pageSizes:[15,30,45,60],
    // icon-colors
    iconColors: [
        "#fe825e", // 橙色
        "#8e7eff", // 紫色
        "#3b74ff", //蓝色
        "#FE6081", //红色
        "#fec107", // 黄色 
        "#17cd31" // 绿色
    ],
    //品类 --组织类型识别
    judgeOrgType: ['group','area','cinema'].find(item => location.pathname.includes(item)),
    //品类 --趋势指标
    categoryTrend: [
      {
        id: 'xse',
        name: "销售额"
      },
      {
        id: 'xsdl',
        name: "销售单量"
      },
      {
        id: 'xssl',
        name: "销售数量"
      },
      {
        id: 'xsml',
        name: "销售毛利"
      },
      {
        id: 'xscb',
        name: "销售成本"
      },
      {
        id: 'rjmpje',
        name: "人均卖品金额"
      }
    ],
    //品类 --趋势指标其他
    categoryTrendOther: [
      {
        id: 'kdj',
        name: "客单价",
        isHistogram: true
      },
      {
        id: 'jdj',
        name: "件单价",
        isHistogram: true
      },
      {
        id: 'kdl',
        name: "客单量",
        isHistogram: true
      },
      {
        id: 'cbj',
        name: "成本价",
        isHistogram: true
      },
      {
        id: 'xsmll',
        name: "销售毛利率",
        isHistogram: true
      },
      {
        id: 'gml',
        name: "购买率",
        isHistogram: true
      },
      {
        id: 'tcxfzb',
        name: "套餐消费占比",
        isHistogram: true
      },
      {
        id: 'hyxfzb',
        name: "会员消费占比",
        isHistogram: true
      }
    ],
    // 卖品指标icons
    salesIcon:{
        "kdl":{
            icon:'icon-neiye-kedanjia', 
            name:'客单量'
        },
        "jdj":{
            icon:'icon-jingyingjuece-feiyong',
            name:'件单价'
        },
        "kdj":{
            icon:'icon-jingyingjuece-feiyong',
            name:'客单价'
        },
        "xssl":{
            icon:'icon-neiye-kedanjia', 
            name:'销售数量'
        },
        "xsdl":{
            icon:'icon-neiye-kedanjia',
            name:'销售单量'
        },
        "xse":{
            icon:'icon-neiye-zongxiaoshoue', 
            name:'销售额'
        },
        // 
        "xscb":{
            icon:'icon-jingyingjuece-chengben',
            name:'销售成本'
        },
        "xsml":{
            icon:'icon-neiye-jine', 
            name:'销售毛利' 
        },
        "xsmlr":{
            icon:'icon-neiye-jine',
            name:'销售毛利率' 
        },
        // 
        "hyxfzb":{
            icon:'icon-jingyingjuece-fene', 
            name:'会员消费占比'
        },
        "tcxfzb":{
            icon:'icon-jingyingjuece-fene', 
            name:'套餐消费占比' 
        },
        "rjmpje":{
            icon:'icon-jingyingjuece-feiyong',
            name:'人均卖品金额'  
        },
        "gml":{ 
            icon:'icon-neiye-zongxiaoshoue',
            name:'购买率'
        },
    },
    // 会员指标icon
    memberIcon:{
        "xzhy":{
            icon:'icon-neiyegoumaishuai',
            name:'新增会员数'
        },
        "yxhy":{
            icon:'icon-neiyegoumaishuai',
            name:'有效会员数'
        },
        "ljhy":{
            icon:'icon-neiyegoumaishuai',
            name:'累计会员数'
        },
        "xinkhy":{
            icon:'icon-neiyegoumaishuai',
            name:'新卡会员数'
        },
        "xukhy":{
            icon:'icon-neiyegoumaishuai', 
            name:'续卡会员数'
        },
        "bkhy":{
            icon:'icon-neiyegoumaishuai',
            name:'补卡会员数'
        },
        "czhy":{
            icon:'icon-neiyegoumaishuai',
            name:'储值会员数'
        },
        "ydqhy30":{
            icon:'icon-neiyegoumaishuai',
            name:'已到期30天内会员'
        },
        "ydqhy7":{
            icon:'icon-neiyegoumaishuai',
            name:'已到期7天内会员'
        },
        "kzhyh":{
            icon:'icon-neiyegoumaishuai',
            name:'可转化用户数'
        },
        // 
        "hykfsy":{
            icon:'icon-neiye-jine',
            name:'会员卡费收益'
        },
        "hyczje":{
            icon:'icon-neiye-zongxiaoshoue',
            name:'会员储值金额'
        },
        "hyxfje":{
            icon:'icon-neiye-zongxiaoshoue', 
            name:'会员消费金额'
        },
        "ljczye":{
            icon:'icon-neiye-jine',
            name:'累计储值余额'
        },
        "hyxksy":{
            icon:'icon-neiye-jine', 
            name:'会员新开卡收益'
        },
        "hyxuksy":{
            icon:'icon-neiye-jine', 
            name:'会员续卡收益'
        },
        "hybksy":{
            icon:'icon-neiye-jine', 
            name:'会员补卡收益'
        },
        "hykdj":{
            icon:'icon-jingyingjuece-feiyong', 
            name:'会员客单价'
        },
        "hyrjgx":{
            icon:'icon-jingyingjuece-feiyong', 
            name:'会员人均贡献'
        },
        // 
        "hyxfzb":{
            icon:'icon-jingyingjuece-fene', 
            name:'会员消费占比'
        },
        "myxhyzb":{
            icon:'icon-jingyingjuece-fene', 
            name:'有效会员占比'
        },
    },
    // 票劵icon
    ticketIcon:{
        // 
        "ddxfe":{
            icon:'icon-jingyingjuece-feiyong', 
            name:'带动消费额'
        },
        "ddxfdl":{
            icon:'icon-neiye-kedanjia', 
            name:'带动消费单量'
        },
        "kdj":{
            icon:'icon-jingyingjuece-feiyong', 
            name:'客单价'
        },
        //
        "ffsl":{
            icon:'icon-neiye-kedanjia', 
            name:'发放数量'
        },
        "sysl":{
            icon:'icon-neiye-kedanjia', 
            name:'使用数量'
        },
        "syl":{
            icon:'icon-jingyingjuece-fene',
            name:'使用率' 
        },
        //
        "yspqcb":{
            icon:'icon-jingyingjuece-chengben',
            name:'发放票券成本' 
        },
        "sypqcb":{
            icon:'icon-jingyingjuece-chengben', 
            name:'使用票券成本'
        },
        // 
        "cyhysl":{
            icon:'icon-neiyegoumaishuai', 
            name:'参与会员数量'
        },
        "hyxfzb":{
            icon:'icon-jingyingjuece-fene',
            name:'会员消费占比' 
        },
    },
    // 票房icon
    officeIcon:{

    },
    boxOfficeMemberMap: {
      boxOffice: 'memberBoxOffice',
      audienceCount: 'memberAudienceCount',
      avgTicketPrice: 'memberAvgTicketPrice',
      memberBoxOfficePer: 'memberBoxOfficePer',
      hallServicePrice: 'memberHallServicePrice',
      payBoxOffice: 'memberPayBoxOffice',
      servicePrice: 'memberServicePrice',
      splitBoxOffice: 'memberSplitBoxOffice',
    },
    formatBoxOfficeTargetUnit(type,money) {
      function formatUnit(num){
        if(!isNaN(num)){
          if(num <10000){
            let number = num.toFixed(2)
            return number < 10000 ? '' : '万';
          }else if(num <100000000){
            let number = (num/10000).toFixed(2)
            return number < 10000 ? '万' : '亿';
          }else {
            return  '亿'
          }
        }else{
          return ''
        } 
      }
      let unitMap = {
        'pf': `${formatUnit(money)}元`,
        'gyrc': `${formatUnit(money)}人`,
        'pjpj': '元',
        'szl': '%',
        'hyxfzb': '%',
        'scfe': '%',
        'sffwf': `${formatUnit(money)}元`,
        'ytfwf': `${formatUnit(money)}元`,
        'yjzzpf': `${formatUnit(money)}元`,
        'fzpf': `${formatUnit(money)}元`,
        'cc': `${formatUnit(money)}场`,
        'rjcc': `${formatUnit(money)}场`, 
        'cjrc': `${formatUnit(money)}人`, 
        'dzsy': `${formatUnit(money)}元`, 
        'kcl': '%'
      }
      return unitMap[type]
    },
    //票房指标 --趋势
    boxOfficeTrend: [
      {
        id: 'boxOffice',
        name: "票房"
      },
      {
        id: 'audienceCount',
        name: "观影人次"
      },
      {
        id: 'avgTicketPrice',
        name: "平均票价"
      },
      {
        id: 'servicePrice',
        name: "三方服务费"
      },
      {
        id: 'splitBoxOffice',
        name: "分账票房"
      },
      {
        id: 'payBoxOffice',
        name: "应缴专资票房"
      }
    ],
    //票房指标 --趋势其他
    boxOfficeTrendOther: [
      {
        id: 'avgPlanShowCount',
        name: "场均人次"
      },
      {
        id: 'attendanceRate',
        name: "上座率"
      },
      {
        id:'avgSeatPrice',
        name: "单座产出"
      },
      {
        id: 'planShowCount',
        name: "场次"
      },
      {
        id: 'hallServicePrice',
        name: "影厅服务费",
        onlyMember: true
      },
      {
        id: 'memberBoxOfficePer',
        name: "会员消费占比",
        onlyMember: true
      },
      {
        id:'marketShare',
        name: "市场份额"
      },
      {
        id: 'unShowCountRate',
        name: '空场率'
      }
    ],
    //票房指标 --影片  --渠道
    boxOfficeMovie: [
      {
        id: 'boxOffice',
        name: "票房"
      },
      {
        id: 'audienceCount',
        name: "观影人次"
      },
      {
        id: 'servicePrice',
        name: "三方服务费"
      }
    ],
    //票房指标 --影片其他
    boxOfficeMovieOther: [
      {
        id: 'avgTicketPrice',
        name: "平均票价",
        onlyMember: true
      },
      {
        id: 'planShowCount',
        name: "场次"
      },
      {
        id:'hallServicePrice',
        name: "影厅服务费",
        onlyMember: true
      },
      {
        id: 'payBoxOffice',
        name: "应缴专资票房",
        onlyMember: true
      },
      {
        id: 'splitBoxOffice',
        name: "分账票房",
        onlyMember: true
      },
      {
        id: 'attendanceRate',
        name: "上座率"
      },
      {
        id: 'avgPlanShowCount',
        name: "场均人次"
      },
      // {
      //   id: 'avgSeatPrice',
      //   name: "单座产出"
      // },
      {
        id: 'unShowCountRate',
        name: "空场率"
      },
      {
        id: 'memberBoxOfficePer',
        name: "会员消费占比",
        onlyMember: true
      },
      // {
      //   id: 'marketShare',
      //   name: "市场份额"
      // }
    ],
    //票房指标 --渠道其他
    boxOfficeChannelOther: [
      {
        id: 'avgTicketPrice',
        name: "平均票价",
        onlyMember: true
      },
      // {
      //   id: 'planShowCount',
      //   name: "场次"
      // },
      {
        id: 'memberBoxOfficePer',
        name: "会员消费占比",
        onlyMember: true
      }
    ],
     // 卖品指标
    targetLabel: [
        {
          id: 'xse',
          name: "销售额",
        },
        {
          id: 'xsdl',
          name: "销售单量",
        },
        {
          id: 'xssl',
          name: "销售数量"
        },
        {
          id: 'kdj',
          name: "客单价"
        },
        {
          id: 'jdj',
          name: "件单价"
        },
        {
          id:'kdl',
          name: "客单量"
        }
      ],
    // 卖品其他指标
    otherLabel1:[
        {
          id: 'xsml',
          name: "销售毛利"
        },
        {
          id: 'xsmlr',
          name: "销售毛利率"
        },
        {
          id: 'xscb',
          name: "销售成本"
        },
        {
          id: 'gml',
          name: "购买率"
        },
        {
          id: 'rjmpje',
          name: "人均卖品金额"
        },
        {
          id: 'hyxfzb',
          name: "会员消费占比"
        }],
    // 卖品其他指标
    otherLabel:[{
        id: 'xsml',
        name: "销售毛利"
        },{
        id: 'xsmlr',
        name: "销售毛利率"
        },{
        id: 'xscb',
        name: "销售成本"
        },{
        id: 'gml',
        name: "购买率"
        },{
        id: 'rjmpje',
        name: "人均卖品金额"
        },{
        id: 'hyxfzb',
        name: "会员消费占比"
        },{
        id: 'tcxfzb',
        name: "套餐消费占比"
    }],
    // 会员指标
    memberTargetLabel:[{
        id:'xzhy',
        name:'新增会员数'
    },{
        id:'yxhy',
        name:'有效会员数'
    },{
        id:'ljhy',
        name:'累计会员数'
    },{
        id:'kzhyh',
        name:'可转化用户数'
    },{
        id:'xinkhy',
        name:'新卡会员数'
    },{
        id:'xukhy',
        name:'续卡会员数'
    }],
    // 会员其他指标
    memberOtherLabel:[{
        id:'bkhy',
        name:'补卡会员数'
    },{
        id:'czhy',
        name:'储值会员数'
    },{
        id:'ydqhy30',
        name:'到期30天内会员数'
    },{
        id:'ydqhy7',
        name:'到期7天内会员数'
    },{
        id:'hykfsy',
        name:'会员卡费收益'
    },{
        id:'hyczje',
        name:'会员储值金额'
    },{
        id:'hyxfje',
        name:'会员消费金额'
    },{
        id:'ljczje',
        name:'累计储值金额'
    },{
        id:'hyxksy',
        name:'会员新开卡收益'
    },{
        id:'hyxuksy',
        name:'会员续卡收益'
    },{
        id:'hybksy',
        name:'会员补卡收益'
    },{
        id:'hykdj',
        name:'会员客单价'
    },{
        id:'hyrjgx',
        name:'会员人均贡献'
    },{
        id:'hyzhl',
        name:'会员转化率'
    },{
        id:'hyxfzb',
        name:'会员消费占比'
    },{
        id:'yxhyxfzb',
        name:'有效会员占比'
    }],
    // 票劵使用指标
    ticketTargetLabel:[
        {id:1,name:'发放数量'}, 
        {id:2,name:'使用数量'},
        {id:3,name:'使用率'},
        {id:4,name:'带动消费额'},
        {id:5,name:'带动消费单量'},
        {id:6,name:'客单价'},
    ],
    // 票劵使用其他指标
    ticketOtherLabel:[
        {id:7,name:'销售增长率'},
        {id:8,name:'发放票券成本'},
        {id:9,name:'使用票券成本'},
        {id:10,name:'参与会员数量'},
        {id:11,name:'会员消费占比'},
    ],
    // 格式化数字（1万/亿）
    formatNum:(money,count,unit) =>{
        let num = money*1;
        let point = 2;
        if(!unit){
          unit = '';
        }
        if(count == 0){
            point = 0;
        }else{
            point = 2;
        }
      
        if(!isNaN(num)){
          if(num < 10000){
              let number = num.toFixed(point)
              return number < 10000 ? (number + unit) : ('1.00万' +unit);
          }else if(num < 100000000){
              let number = (num/10000).toFixed(2)
              return number < 10000 ? (number + '万' + unit) : ('1.00亿' +unit);
          }else {
              return (num/100000000).toFixed(2) + '亿' + unit;
          }
        }else{
            // return moeny
              return '--' + unit
        }
    },
    // 格式化数字（不带单位）
    formatMoney(money,count){
        let num = money*1;
        let point = 2;
        if(typeof count === 'undefined'){
            point = 2
        }else{
            point = count;
        }
        if(!isNaN(num)){
            if(num < 10000){
                let number = num.toFixed(point)
                return number < 10000 ? number : '1.00';
                // return num.toFixed(point);
            }else if(num < 100000000){
                let number = (num/10000).toFixed(2)
                return number < 10000 ? number : '1.00';
                // return (num/10000).toFixed(2);
            }else {
                return (num/100000000).toFixed(2);
            }
          }else{
            return '--'
        }
      },
    // 格式化卖品指标单位
    formatTargetUnit:(type,money)=>{
        function formatUnit(num){
            if(!isNaN(num)){
                if(num <10000){
                  let number = num.toFixed(2)
                  return number < 10000 ? '' : '万';
                  // return ''
                }else if(num <100000000){
                  let number = (num/10000).toFixed(2)
                  return number < 10000 ? '万' : '亿';
                  // return  '万'
                }else {
                  return  '亿'
                }
            }else{
              return ''
            }
        }
        let unit = formatUnit(money*1);
        switch(type){
          case 'xse': // 销售额
            return unit + '元';
          break;
          case 'xscb': // 销售成本
            return unit + '元';
          break;
          case 'xsdl': // 销售单量
            return unit+ '单';
          break;
          case 'xssl': // 销售数量
            return unit + '件';
          break;
          case 'xsml': // 销售毛利
            return unit + '元';
          break;
          case 'xsmlr': // 销售毛利率
            return '%';
          break;
          case 'kdj': // 客单价
            return unit + '元';
          break;
          case 'kdl': // 客单量
            return unit + '件/单';
          break;
          case 'jdj': // 件单价
            return unit + '元';
          break;
          case 'gml': // 购买率
            return '%';
          break;
          case 'rjmpje': // 人均卖品金额
            return unit + '元';
          break;
          case 'hyxfzb': // 会员消费占比
            return '%';
          break;
          case 'tcxfzb': // 套餐消费占比
            return '%';
          break;
          case 'cbj': // 成本价
            return unit + '元';
          break;
        }
    },
    // 进销存指标耽误
    formatInventoryUnit(type,money){
        function formatUnit(num){
            if(!isNaN(num)){
                if(num <10000){
                  return ''
                }else if(num <100000000){
                  return  '万'
                }else {
                  return  '亿'
                }
            }else{
              return ''
            }
        }
        let unit = formatUnit(money*1);
        return unit + type;
    },
    // 会员指标单位
    formatMemberTargetUnit(type,money){
        function formatUnit(num){
            if(!isNaN(num)){
                if(num <10000){
                  return ''
                }else if(num <100000000){
                  return  '万'
                }else {
                  return  '亿'
                }
            }else{
              return ''
            }
        }
        let unit = formatUnit(money*1);
        switch(type){
          case 'xzhy': // 新增会员
            return unit + '人';
          break;
          case 'yxhy': // 有效会员
            return unit + '人';
          break;
          case 'ljhy': // 累计会员
            return unit+ '人';
          break;
          case 'kzhyh': // 可转化用户
            return unit + '人';
          break;
          case 'xinkhy': // 新卡会员
            return unit + '人';
          break;
          case 'xukhy': // 续卡会员
            return unit + '人';   
          break;
          case 'bkhy': // 补卡会员
            return unit + '人';
          break;
          case 'czhy': // 储值会员
            return unit + '人';
          break;
          case 'ydqhy30': // 已到期30天会员
            return unit + '人';
          break;
          case 'ydqhy7': // 已到期7天会员
          return unit + '人';
          break;
          case 'hykfsy': // 会员卡费收益
            return unit + '元';
          break;
          case 'hyczje': // 会员储值金额
            return unit + '元';
          break;
          case 'ljczye': // 累计储值余额
            return unit + '元';
          break;
          case 'hyxfje': // 会员消费金额
            return unit + '元';
          break;
          case 'hyxksy': // 会员开新卡收益
            return unit + '元';
            break;  
          case 'hyxuksy': // 会员续卡收益
            return unit + '元';
          break;
          case 'hybksy': // 会员补卡收益
          return unit + '元';
            break;
          case 'hykdj': // 会员客单价
            return unit + '元';
          break;
          case 'hyrjgx': // 会员人均贡献
            return unit + '元';
          case 'hyxfzb': // 会员消费占比
            return '%';
          case 'myxhyzb': // 有效会员占比
            return '%';
          break;
        }
    },
    // 票劵指标单位
    formatTicketUnit(type,money){
        function formatUnit(num){
            if(!isNaN(num)){
                if(num <10000){
                  return ''
                }else if(num <100000000){
                  return  '万'
                }else {
                  return  '亿'
                }
            }else{
              return ''
            }
        }
        let unit = formatUnit(money*1);
        switch(type){
          case 'ddxfe': // 带动消费额
            return unit + '元';
          break;
          case 'ddxfdl': // 带动消费单量
            return unit + '单';
          break;
          case 'kdj': // 客单价
            return unit+ '元';
          break;
          case 'ffsl': // 发放数量
            return unit + '张';
          break;
          case 'sysl': // 使用数量
            return unit + '张';
          break;
          case 'syl': // 使用率
            return '%';   
          break;
          case 'yspqcb': // 预算票劵成本
            return unit + '元';
          break;
          case 'sypqcb': // 使用票券成本
            return unit + '元';
          break;
          case 'cyhysl': // 参与会员数量
            return unit + '人';
          break;
          case 'hyxfzb': // 会员消费占比
          return '%';
          break;
        }
    }

}
export default install