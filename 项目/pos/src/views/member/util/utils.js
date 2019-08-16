import App from 'http/app';
import { MemberAjax } from "http/memberApi";
export function toFormModel(vo) {
  var o = {};
  vo.forEach(function (v, i) {
    o[v.prop] = '';
  })
  return o;
}

export function formateSearch(columnData) {
  let seachItem = [];
  columnData.forEach(function (v, i) {
    if (v['search']) {
      seachItem.push(v)
    }
  })
  return seachItem;
}


export function selectOption(json) {
  let _option = [];
  Object.keys(json).forEach(function (i, v) {
    _option.push({
      label: i,
      value: json[i]
    })
  })
  return _option;
}

export function back(that) {
  if (that.$route.query.phoneOrCard) {
    that.$router.push({
      name: "queryDetails",
      query: that.$route.query
    })
  } else {
    that.$router.go(-1);
  }
}

export function cardStatusCN(str) {
  /**
   * 所有类型卡都可查询
   * 挂失卡 loss   可以解挂、补卡操作
   * 注销卡 cancel 可查询操作
   * 冻结卡 frozen 可解冻操作
   * 过期卡 expire 
   */
  switch (str) {
    case 'loss':
      return '挂失';
      break;
    case 'cancel':
      return '注销';
      break;
    case 'frozen':
      return '冻结';
      break;
    case 'expire':
      return '过期';
      break;
    case 'normal':
      return '正常';
      break;
    case 'stored_card':
      return '储值卡';
      break;
    case 'equity_card':
      return '权益卡';
      break;
    case 'cobranded_card':
      return '联名卡';
      break;
    case 'gift_card':
      return '礼品卡';
    case 'times_card':
      return '次卡';
    case 'month_card':
      return '月卡';
  }
}

// 读卡
export function readCard(config) {
  return new Promise((reslove, reject) => {
    App.readCard(config, (e) => {
      let ev = e.toString()
      if (ev.indexOf('-1') >= 0 || ev === '浏览器不支持此功能') {
        Vue.prototype.error(ev.replace('-1,', ''));
        reject(ev)
      } else {
        reslove(ev)
      }
    })
  })
}

//密码输入
/*
 * @param {*} config 终端配置
 * @param {*} callback 成功回调
 * @param {*} callback1 错误回调
 */
export function secKeyBoard(config) {
  return new Promise((reslove, reject) => {
    App.secKeyBoard('open', config, (e) => {
      let ev = e.toString()
      if (ev.indexOf('-1') >= 0 || ev === '浏览器不支持此功能' || ev === '密码键盘开启中') {
        Vue.prototype.error(ev.replace('-1,', ''));
        reject(e)
        console.warn(e)
      } else {
        reslove(ev)
      }
    })
  })
}

/**
 * 钱箱
 */
export function openCashBox(config) {
  App.openCashBox(config, e => {
    let ev = e.toString()
    if (ev.indexOf('-1') >= 0 || ev === '浏览器不支持此功能') {
      Vue.prototype.error(ev.replace('-1,', ''));
    }
  });
}

/**
 * 
 * @param {*} printData 支付完成数据
 * @param {*} config 终端配置
 */
export function printTicket(config, printData) {
  App.printTicket('bill_print', {
    "width": 200,
    "height": 300,
    "ticket_element": [
      {
        "elementValue": "欢迎光临",
        "x": 60,
        "y": 0,
        "font_size": 12,
        "font_black": 0,
        "show_modle": 0
      },
      {
        "elementValue": `${printData.cinemaName}`,
        "x": 20,
        "y": 13,
        "font_size": 12,
        "font_black": 0,
        "show_modle": 0
      },
      {
        "elementValue": "销售交易凭证",
        "x": 40,
        "y": 26,
        "font_size": 12,
        "font_black": 0,
        "show_modle": 0
      },
      {
        "elementValue": "------------------------------------",
        "x": 5,
        "y": 34,
        "font_size": 11,
        "font_black": 0,
        "show_modle": 0
      },
      {
        "elementValue": `${printData.businessName}`,
        "x": 5,
        "y": 42,
        "font_size": 11,
        "font_black": 0,
        "show_modle": 0
      },
      {
        "elementValue": `${printData.amount}元`,
        "x": 115,
        "y": 42,
        "font_size": 11,
        "font_black": 0,
        "show_modle": 0
      },
      {
        "elementValue": "------------------------------------",
        "x": 5,
        "y": 62,
        "font_size": 11,
        "font_black": 0,
        "show_modle": 0
      },
      {
        "elementValue": "总件数：1",
        "x": 5,
        "y": 70,
        "font_size": 11,
        "font_black": 0,
        "show_modle": 0
      },
      {
        "elementValue": `应收：${printData.amount}元`,
        "x": 90,
        "y": 70,
        "font_size": 11,
        "font_black": 0,
        "show_modle": 0
      },
      {
        "elementValue": `实收：${printData.payAmount}元`,
        "x": 90,
        "y": 82,
        "font_size": 11,
        "font_black": 0,
        "show_modle": 0
      },
      {
        "elementValue": "------------------------------------",
        "x": 5,
        "y": 90,
        "font_size": 11,
        "font_black": 0,
        "show_modle": 0
      },
      {
        "elementValue": "支付明细：",
        "x": 5,
        "y": 98,
        "font_size": 11,
        "font_black": 0,
        "show_modle": 0
      },
      {
        "elementValue": `金额：${printData.payAmount}元`,
        "x": 25,
        "y": 110,
        "font_size": 11,
        "font_black": 0,
        "show_modle": 0
      },
      {
        "elementValue": "------------------------------------",
        "x": 5,
        "y": 118,
        "font_size": 11,
        "font_black": 0,
        "show_modle": 0
      },
      {
        "elementValue": "交易流水号：",
        "x": 5,
        "y": 126,
        "font_size": 11,
        "font_black": 0,
        "show_modle": 0
      },
      {
        "elementValue": `${printData.flowNo}`,
        "x": 15,
        "y": 138,
        "font_size": 11,
        "font_black": 0,
        "show_modle": 0
      },
      {
        "elementValue": `交易时间：${printData.transactionTime}`,
        "x": 5,
        "y": 150,
        "font_size": 11,
        "font_black": 0,
        "show_modle": 0
      },
      {
        "elementValue": `终端：${localStorage['terminalId']}`,
        "x": 5,
        "y": 162,
        "font_size": 11,
        "font_black": 0,
        "show_modle": 0
      },
      {
        "elementValue": `收银员：${localStorage['userName']}`,
        "x": 5,
        "y": 174,
        "font_size": 11,
        "font_black": 0,
        "show_modle": 0
      }
    ]
  }, config, (e) => {
    let ev = e.toString()
    if (ev.indexOf('-1') >= 0 || ev === '浏览器不支持此功能') {
      Vue.prototype.error(ev.replace('-1,', ''));
    }
  })
}

/**
 * 所有类型卡都可查询
 * 挂失卡 loss   可以解挂、补卡操作
 * 注销卡 cancel 可查询操作
 * 冻结卡 frozen 可解冻操作
 * 过期卡 expire 
 */
export function statusDeter(data, ...agrs) {
  if (data) {
    let stateArr = [];
    for (let i = 0; i < agrs.length - 1; i++) {
      stateArr.push(agrs[i])
    }
    if (this.member.cardState && stateArr.indexOf(this.member.cardState) < 0 && this.member.numberType === 'card') {
      Vue.prototype.error(agrs[agrs.length - 1]);
      return false;
    } else {
      return data
    }
  } else {
    return data
  }

}

/**
 * 
 * @param {*} value 过滤入参
 */
export function formatMemberInfo(value) {
  var result = [];
  for (var key in value) {
    var lable = "";
    switch (key) {
      case "sex":
        lable = "性别:";
        break;
      case "name":
        lable = "姓名:";
        break;
      case "birthday":
        lable = "生日:";
        break;
      case "email":
        lable = "邮箱:";
        break;
      case "mobileNum":
        lable = "手机号:";
        break;
      case "creditNum":
        lable = "身份证号:";
        break;
      case "levelName":
        lable = "会员等级:";
        break;
      case "scoreBalance":
        value[key] = null;
        break;
      case "totalScore":
        value[key] = null;
        break;
    }
    if (value[key] != null) {
      result.push(lable + value[key]);
    }
  }
  return result.join(" , ");
}

/**
 * 
 * @param {*} randomLength 生成流水号
 */
export function GenNonDuplicateID(randomLength) {
  return Number(Math.random().toString().substr(3, randomLength) + Date.now()).toString(16)
}
/**
 * 
 * @param {*} cardNo 卡号
 * @param {*} phone 手机号
 */
export function routerJump(cardNo = this.member.cardNo, phone = this.member.phoneNum) {
  if (!phone) {
    this.$message.warning('该会员卡未绑定手机号，即将跳转至会员服务-修改资料进行信息完善')
    setTimeout(() => {
      this.$router.push({ path: '/member/ModifyData', query: { phoneOrCard: cardNo, type: 'card' } })
    }, 3000)
    return false;
  } else {
    return true
  }
}
/**
 * 
 * @param {*} value 支付方式转换
 */
export function getPayMethodName(value){
  const payMethodName = {
    XRMB:'现金',
    ALIPAY:'支付宝支付码付款',
    WXPAY:'微信支付码付款'
  }
  if(value in payMethodName){
    return payMethodName[value]
  }
}