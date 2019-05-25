import * as TYPES from '../types'

export default {
    state: {
       morePayDialog: false,  //更多支付对话框状态
       ticketsDialog: false,  //更多票类对话框状态
       changingTicket: false, //更换票类对话框状态
       currentTicketItem:'',  //获取当前点击的票类项
       payDialog: false,  //支付弹窗状态
       billCode: '',  //初始化获取code 
       billCodeUid: '', //billUid用于支付
       cinemaUid: '', //影院uid用于支付
       channelCode: '1', //渠道编码
       cinemaCode: "75847291", //影院编码
       cinemaName: '人类研究所影院', //影院名称
       terminalId: "86242807", //终端编码
       payMethod: {
        currentPayMethod: '',  //当前选择的支付方式
        currentPayMethodId: '' //当前选择的支付方式id
       },
       payNum: {  //前台支付以及找零
         realPayNum: 0,
         authCode: '',
         realChange: 0
       },
       payData: {  //后台获得的支付数据
        originalAmount: 0,
        payAmount: 0,
        payedAmount: 0,
        notPayAmount: 0,
        couponAmount: 0
       },
       returnPay: 0, //找零
       payResult: false,
    },


    mutations: {
        //登录后获取影院信息
        [TYPES.SAVE_CINEMA_INFO] : (state) => {
            state.cinemaCode = localStorage.getItem('cinemaCode') || '75847291'
            state.cinemaUid = localStorage.getItem('cinemaUid') 
            state.cinemaName = localStorage.getItem('cinemaName') || '人类研究所影院'
            state.terminalId = localStorage.getItem('terminalId')
        },

        //支付结果显示或者隐藏
        [TYPES.SET_PAY_RESULT] : (state) => {
            state.payResult = !state.payResult
        },

        //前台计算得到的支付以及找零
        [TYPES.SAVE_CHANGE_CASH] : (state, obj) => {
           state.payNum.realPayNum = obj.cash
           state.payNum.realChange = obj.change
        },
        //扫码是直接赋值到这里
        [TYPES.SAVE_CHANGE_CODE] : (state, code) => {
            state.payNum.authCode = code
        },
        //获取购车缓存订单编号
        [TYPES.GET_CART_BILLCODE] : (state,val) => {
            state.billCode = val
        },
        //获取购车缓存订单编号
        [TYPES.GET_CART_BILLCODEUID] : (state,uid) => {
            state.billCodeUid = uid
        },
        //获取购车影院编号
        [TYPES.GET_CART_CINEMAUID] : (state,uid) => {
            state.cinemaUid = uid
        },
        //更多支付显示隐藏
        [TYPES.MORE_PAY_TRIGER] : (state) => {
            state.morePayDialog = !state.morePayDialog
        },
        //更多票类显示隐藏
        [TYPES.MORE_TICKETS_TRIGER] : (state) => {
            state.ticketsDialog = !state.ticketsDialog
        },
        //改变票类
        [TYPES.CHANGE_TICKETS_TRIGER] : (state, item) => {
            state.changingTicket = !state.changingTicket
            state.currentTicketItem = item
        },
        //支付弹窗显示隐藏
        [TYPES.PAY_DIALOG_TRIGER] : (state) => {
            state.payDialog = !state.payDialog
        },
        //设置当前支付方式
        [TYPES.PAY_METHOD_TRIGER] : (state, item) => {
            state.payMethod.currentPayMethod = item.payTypeName
            state.payMethod.currentPayMethodId = item.payTypeCode
        },

        //获取原价 应付款  待付款  已支付  优惠
        [TYPES.GET_KIND_PRICE] : (state, data) => {
            state.payData.originalAmount= data.originalAmount
            state.payData.payAmount = data.payAmount
            state.payData.payedAmount = data.payedAmount
            state.payData.notPayAmount = data.notPayAmount
            state.payData.couponAmount = data.couponAmount
        },
        
        //返回找零数额
        [TYPES.SET_RETURN_PAY] : (state, val) => {
            state.returnPay = val
        },

        //支付结果显示或者隐藏
        [TYPES.SET_PAY_RESULT] : (state, val) => {
            state.payResult = !state.payResult
        }
    },

    getters: {
        //改变电影票类
        changingTicket(state) {
            return state.changingTicket
        },

        //支付后结果的显示
        payResult(state) {
            return state.payResult
        },
        //支付后的找零
        returnPay(state) {
            return state.returnPay
        },

        //终端编码
        terminalId(state) {
            return state.terminalId
        },

        //获得支付数据实际支付以及找零
        payNum(state) {
            return state.payNum
        },
        
        //支付方式
        payMethod(state) {
            return state.payMethod
        },

        //获取支付数据
        payData(state) {
            return state.payData
        },

        //渠道编码
        channelCode(state) {
            return state.channelCode
        },

        //影院名称
        cinemaName(state) {
            return state.cinemaName
        },

        //影院编码
        cinemaCode(state) {
            return state.cinemaCode
        },
        
        //获取影院uid
        cinemaUid(state) {
            return state.cinemaUid
        },

        //缓存订单编号
        billCode(state) {
            return state.billCode
        },
        
        //缓存订单uid
        billCodeUid(state) {
            return state.billCodeUid
        },
        
        //更多支付弹窗状态
        morePayDialog(state) {
            return state.morePayDialog
        },
        
        //更多票类弹窗状态
        ticketsDialog(state) {
            return state.ticketsDialog
        },
        
        //更多支付弹窗
        payDialog(state) {
            return state.payDialog
        },
        //获取当前票类项
        currentTicketItem(state) {
            return state.currentTicketItem     
        },
    }
}