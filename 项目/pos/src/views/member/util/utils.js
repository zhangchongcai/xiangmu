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
 * 
 * @param {*} callback 发送验证码回调函数
 */
//18888888888
export function getValidation(callback){
    callback().then(res =>{
            let n = 60;
            this.disable = true;
            window.validateTimer = setInterval(()=>{
                n --;
                if(n<=0){
                    clearInterval(window.validateTimer);
                    this.validataText = '获取验证码';
                    this.disable = false;
                    return;
                }
                this.validataText = `${n}s后重新获取`
            },1000)
    });
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
 * 
 * @param {*} data 流水号
 */
export function payPolling(data){
    MemberAjax.getPayResult({flowNo:data,tenantId:this.tenantId}).then(res=>{
      if(res.code === 200){
        clearInterval(this.payTimer);
        this.payLoading = false;
        this.payLoadingText = '支付';
        this.centerDialogVisible = false;
        this.$message({
          message:'支付成功',
          type:'success',
          onClose: () => {
            this.$router.push({
              path: "/member"
            });
          }
        })
      }
    }).catch(err=>{
      
    })
  }
  
/**
 *  支付完成或失败 
 */
  export function stopPay(){
    clearInterval(this.payTimer);
    this.payLoading = false;
    this.payLoadingText = '支付';
    this.centerDialogVisible = false;
  }

/**
 * 有支付支付提交
 */
export function submit(){
    this.$store.dispatch("handleHttp", this.handleSubmit()).then(res=>{
      if(res.code === '601'){
        this.payLoadingText = '支付中...';
        this.payTimer = setInterval(()=>{
          payPolling.call(this,res.data)
        },2000)
      }else{
        this.$message.error(res.msg);
        stopPay.bind(this)();
      }
    }).catch(err=>{
      stopPay.bind(this)();
      this.$refs['ruleForm'].resetFields();
    })
}

/**
 * 查询卡政策
 */
export function cardPolicy(cardNo){
  MemberAjax.applyCardNoInfo({ cardNo: cardNo, tenantId: this.tenantId }).then(res => {
    console.log(res)
  })
}