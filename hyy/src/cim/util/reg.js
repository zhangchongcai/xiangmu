
export default {
    emailReg: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/, //邮箱验证 
    passwordReg: /^([a-z0-9\.\?\,\@\!\#\$\%\^\&\*\(\)]){6,20}$/i, //密码验证
    letterAndNumReg: /^[A-Za-z0-9 ]+$/, //匹配字母和数字
}