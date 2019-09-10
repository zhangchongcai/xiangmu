import axios from "./http";
const baseUrl = '/member/pos';
const memeberApi = {
    // /static/mock/getInfoByPhone.json  /getInfoByPhone
    getInfoByPhone: { url: baseUrl + '/getInfoByPhone', method: 'get' },// 获取会员信息以及会员卡列表   
    // /static/mock/getCardInfoByNo.json   /getCardInfoByNo
    getCardInfoByNo: { url: baseUrl + '/getCardInfoByNo', method: 'get' },// 获取会员信息以及会员卡列表 
    applyCardNoInfo: { url: baseUrl+ '/getProductDetailByCardNo', method: 'get' },//  开卡查卡 查卡政策
    getActivityList: { url: baseUrl+ '/getMarketingActivityList', method: 'get' },//  营销活动列表获取getActivityList
    bindCardAndCharge: { url: baseUrl+ '/cardOpenAndPay' },//  会员开卡
    cardCharge: { url: baseUrl+ '/cardChargeAndPay' },//   充值
    changePsd: { url: baseUrl+ '/modifyPassword' },//   修改密码
    changeLoss: { url: baseUrl+ '/changeLoss' },//   挂失/解挂失
    resetPassword: { url: baseUrl+ '/resetPassword' },//   重置密码 
    reissueCard: { url: baseUrl+ '/reissueCard' },//   补卡
    cancelCard: { url: baseUrl+ '/cancelCard' },//   注销
    modifyMemberInfo: { url: baseUrl+ '/modifyMemberInfo' },// 资料修改
    carryOverTrial: { url: baseUrl+ '/carryOverTrial', method: 'get' },// 余额转结前查询
    carryOver: { url: baseUrl+ '/carryOver' },// 余额转结
    activeCard: { url: baseUrl+ '/activeCard' },// 会员卡解冻
    queryTradeRecord: { url: baseUrl+ '/queryTradeRecord', method: 'get' },// 交易记录查询
    offset: { url: baseUrl+ '/offset' },// 冲销
    queryBindingTicket: { url: baseUrl+ '/queryBindingTicket', method: 'get' },// 绑定票券
    getChangeRecord: { url: baseUrl+ '/getChangeRecord', method: 'get' },// 变更记录
    getFitCinema: { url: baseUrl+ '/getFitCinema', method: 'get' },// 查询适用影院
    getTradeDetail: { url: baseUrl+ '/getTradeDetail', method: 'get' },// 交易详情查询
    sendMsg: { url: baseUrl+ '/sendMsg' , method: 'get' },// 发送验证码
    checkMsg: { url: baseUrl+ '/checkMsg' , method:'get'},// 校验验证码
    getPayResult: { url: baseUrl+ '/queryOrder' , method:'get'},// 轮询查询支付结果
    payAndAct: { url: baseUrl+ '/payAndAct' , method:'get'},// 支付并注销、补卡或激活
    list: { url: baseUrl+ '/type/list' , method:'get'},// 卡类型查询
    writeCard: { url: baseUrl+ '/writeCard'},// 写卡
    checkWriteStatus: { url: baseUrl+ '/checkWriteStatus',method:'get'},// 判断写卡状态
    getCardPoolList: { url: baseUrl+ '/getCardPoolList',method:'get'},// 根据卡政策或卡号查询卡池
    getProductListByType: { url: baseUrl+ '/getProductListByType',method:'get'},// 根据卡政策或卡号查询卡池
    getPageList: { url: baseUrl+ '/accountFlow/getPageList'},// 积分交易列表
}

const httpType = {};
for (let [key, value] of Object.entries(memeberApi)) {
    httpType[key] = function (value) {
        if (!!value['method']) {
            return (params) => {
               return axios.get(value['url'],Vue.prototype.$sign(params)).then(data => data.data)
            }
        } else {
            return (data) => {
                return axios.post(value['url'],Vue.prototype.$sign(data)).then(data => data.data)
            }
        }
    }(memeberApi[key])
}

export { httpType as MemberAjax, memeberApi };


