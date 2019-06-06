import App from 'http/app';
import {MemberAjax} from "http/memberApi";
export function toFormModel(vo){
    var o = {};
    vo.forEach(function(v,i){
        o[v.prop] = '';
    })
    return o;
}

export function formateSearch(columnData){
    let seachItem = [];
    columnData.forEach(function(v,i) {
        if(v['search']){
            seachItem.push(v)
        }
    })
    return seachItem;
}


export function selectOption(json){
    let _option = [];
    Object.keys(json).forEach(function(i,v){
        _option.push({
            label:i,
            value:json[i]
        })
    })
    return _option;
}

export function back(that) {
    if(that.$route.query.phoneOrCard){
        that.$router.push({
          name: "queryDetails",
          query:that.$route.query
        })
      }else{
        that.$router.go(-1);
      }
}

export function cardStatusCN(str){
    /**
     * 所有类型卡都可查询
     * 挂失卡 loss   可以解挂、补卡操作
     * 注销卡 cancel 可查询操作
     * 冻结卡 frozen 可解冻操作
     * 过期卡 expire 
     */
    switch(str){
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
    }
}

// 读卡
export function readCard(config){
    return new Promise((reslove,reject)=>{
        App.readCard(config,(e)=>{
            let ev = e.toString()
            if(ev.indexOf('-1') >= 0 || ev === '浏览器不支持此功能'){
              Vue.prototype.error(ev);
              reject(ev)
            }else{
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
export function secKeyBoard(config){
    return new Promise((reslove,reject)=>{
        App.secKeyBoard('open',config,(e)=>{
            let ev = e.toString()
            if(ev.indexOf('-1') >= 0 || ev === '浏览器不支持此功能' || ev === '密码键盘开启中'){
              Vue.prototype.error(ev);
              reject(e)
              console.warn(e)
            }else{
              reslove(ev)
            }
        })
    })
}


/**
 * 所有类型卡都可查询
 * 挂失卡 loss   可以解挂、补卡操作
 * 注销卡 cancel 可查询操作
 * 冻结卡 frozen 可解冻操作
 * 过期卡 expire 
 */
export function statusDeter(data,...agrs){
    if(data){
        let stateArr = [];
        for(let i = 0 ; i < agrs.length - 1 ;i++){
            stateArr.push(agrs[i])
        }
        if(this.member.cardState && stateArr.indexOf(this.member.cardState) < 0 && this.member.numberType === 'card'){
            Vue.prototype.error(agrs[agrs.length - 1]);
            return false;
        }else{
            return data
        }
    }else{
        return data
    }
    
}
  

/**
 * 查询卡政策
 */
export function cardPolicy(cardNo){
  MemberAjax.applyCardNoInfo({ cardNo: cardNo, tenantId: this.tenantId }).then(res => {
    console.log(res)
  })
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