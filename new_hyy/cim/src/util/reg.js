/* eslint-disable */
let emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/;
let passwordReg = /^([a-z0-9\.\?\,\@\!\#\$\%\^\&\*\(\)]){6,20}$/i;
let letterAndNumReg = /^[A-Za-z0-9 ]+$/;
export {
  emailReg, // 邮箱验证
  passwordReg, // 密码验证
  letterAndNumReg // 匹配字母和数字
};

/* eslint-disable */
