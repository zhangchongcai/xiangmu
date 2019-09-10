//身份证验证
export const creditNum = (rule, value, callback)=>{
    var validate = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
      if (!validate.test(value.toString().replace(/\s/g, ""))) {
        callback(new Error("请输入正确身份证号"));
      }else {
        callback();
      }
}
export const num10_999float2 = (rule, value, callback)=>{
    var validate = /^[1-9][0-9]{1,2}|[1-9][0-9]{1,2}[.][0-9]{0,2}|[1-9]{1}|[1-9]{1}[.][0-9]{0,2}$/
    var chargeMin = sessionStorage['chargeMin'] ? Number(sessionStorage['chargeMin']).toFixed(2):'10.00';
    var chargeMax = sessionStorage['chargeMax'] ? Number(sessionStorage['chargeMax']).toFixed(2):'999.00';
    let val = value.toString().replace(/\s/g, "");
    if (!validate.test(val) || val*1 < chargeMin*1 || val*1 > chargeMax*1) {
      callback(new Error(`单次充值限额:${chargeMin}元—${chargeMax}元`));
    }else {
      callback();
    }
}

// 6位密码验证 ！123456  111222 
export const customPasswordReg = (rule,value,callback) => {
  var PwdCount = /([\d])\1{2,}/,//连续三位
      addOrReduce = /(?:(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)){5}|(?:9(?=8)|8(?=7)|7(?=6)|6(?=5)|5(?=4)|4(?=3)|3(?=2)|2(?=1)|1(?=0)){5})\d/,//递增顺号或递减顺号
      numberType=/^\d{6}$/g,//6位
      beforeAndAfterEmpty = /^\s+|\s+$/g,//前后空格
      midEmpty = /\s/g;//中间空格
      var value = value.toString();
      if(!numberType.test(value)){
        callback(new Error('密码格式不正确，请输入6位数字密码'))
      }
      if(rule.passwordkType == 1){
        callback();
        return;
      }
      if(!PwdCount.test(value) && !addOrReduce.test(value) && !beforeAndAfterEmpty.test(value) && !midEmpty.test(value)){
        callback();
      }else{
        callback(new Error('密码过于简单，请重新输入'))
      }
}
//手机号正则
export const validateMobile = (rule,value,callback)=>{
  var validate = /^1[3456789]\d{9}$/;
    if (!validate.test(value.toString().replace(/\s/g, ""))) {
      callback(new Error("请输入正确手机号"));
    }else {
      callback();
    }
}

//邮箱正则  
export const validateEmail = (rule,value,callback)=>{
  var validate = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
  if (!validate.test(value.toString().replace(/\s/g, ""))) {
    callback(new Error("请输入正确邮箱地址"));
  }else {
    callback();
  }
}

//名字正则  /^[\u4e00-\u9fa5]+$/   /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]|\d/gim
export const validateName = (rule,value,callback)=>{
  var validate = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
  if (validate.test(value.toString().replace(/\s/g, ""))|| /\d/g.test(value.toString().replace(/\s/g, ""))) {
    callback(new Error("请输入正确字符"));
  }else {
    callback();
  }
}

/**
 * 
 * @param {*} rule 6位密码正则
 * @param {*} value 
 * @param {*} callback 
 */
export const passwdReg = function(rule, value, callback){
  if (value === '') {
      callback(new Error('请输入密码'));
    } else {
      if (!/^\d{6}$/.test(value.toString())) {
        callback(new Error('请输入6位数字密码'));
      }
      callback();
    }
}



