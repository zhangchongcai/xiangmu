import * as TYPES from '../types'
import {checkActivety, cancelActivity, getGroupCoupon} from 'src/http/apis.js'

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
       channelName: '', //渠道名称
       cinemaCode: "", //影院编码
       cinemaName: '', //影院名称
       terminalId: "", //终端编码
       tenantId: "", //租户ID
       terminalCode: '',
       userAccount : '', //用户账户
       userUid: '',
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
        couponAmount: 0,
        voucherAmount: 0
       },
       returnPay: 0, //找零
       payResult: false,
       userName:'', // 用户名
       menuList:[], //菜单用的
       otherFlag: false,//菜单用的
       otherList: [],//菜单用的
       payedList: [], //支付后列表 用于退款
       selActivityList: [],
       activityList: [], //支付时查询的活动
       activitytempId: '',
       vipInputStatus: false,  //vip打开关闭按钮
       vipListStatus: false, //viplist 显示隐藏
       vipInfo: {}, //会员信息
       couponList: [], //优惠券集合
       availableCouponList: [], //可用优惠券列表
       preAmount : '', //备用金
       userConfig:{},//用户一些配置信息
       activityTip: "活动查询中...",
       isNeedPwd: 1, //会员支付时是否开启密码，由后台返回，默认是开启的
       groupCoupons: [], //团购券集合
       checkGCResult: false, //团购券显示状态
       consumeGroupCoupons: [], //消费后的团购券集合
       checkoutGCResult: false, //消费团购券窗口状态
       jhPayBody:'', //聚合支付报文
       jhPayBanks:{
        delFlag:'', //支付方式 聚合支付类
        bankCardCode:'', //离线的银行卡号 聚合支付类
        returnCode:'',//支付凭证  聚合支付类 
       },
       cardPayBanks: {
        delFlag:'', //支付方式
        bankCardCode:'', //离线的银行卡号 
        returnCode:'',//支付凭证 
       },
       paySort:false, //支付方式排序
       hasConsumeActivity: false, //活动是否核销
       checkMany: false //是否启用多张优惠券的check
    },


    mutations: {
        //登录后获取影院信息
        [TYPES.SAVE_CINEMA_INFO] : (state) => {
            state.cinemaCode = localStorage.getItem('cinemaCode') || '75847291'
            state.cinemaUid = localStorage.getItem('cinemaUid') 
            state.cinemaName = localStorage.getItem('cinemaName') || '人类研究所影院'
            state.terminalId = localStorage.getItem('terminalId')
            state.userName = localStorage.getItem('userName');
            state.tenantId = localStorage.getItem('tenantId');
            state.terminalCode = localStorage.getItem('terminalCode')
            state.userAccount = localStorage.getItem('userAccount')
            state.channelCode = localStorage.getItem('channelNo')
            state.channelName = localStorage.getItem('channelName')
            state.userUid = localStorage.getItem('userUid')
            state.preAmount = JSON.parse(localStorage.getItem('preAmount')) ? localStorage.getItem('preAmount') : '无'
        },

        //是否打开团购券对话框
        [TYPES.CHECK_OUT_GCOUPON_RESULT] : (state) => {
           state.checkGCResult = !state.checkGCResult
        },

        //是否打开消费团购券对话框
        [TYPES.CHECKOUT_CONSUMEGCOUPON_RESULT] : (state) => {
            state.checkoutGCResult = !state.checkoutGCResult
         },

        //是否开启会员支付密码
        [TYPES.SAVE_VIP_ISPWD] : (state, booleanStatus) => {
           state.isNeedPwd = booleanStatus
        },

        //保存消费后的团购券
        [TYPES.SAVE_CONSUME_GROUPON] : (state, arr) => {
           state.consumeGroupCoupons = arr
        },
        
        //删除一个团购券
        [TYPES.DEL_GROUPON_TICKET] : (state, ticketCode) => {
            // console.log(coupon)
            // console.log(state.availableCouponList)
            state.consumeGroupCoupons.forEach((item, index) => {
                if(ticketCode == item.ticketCode) {
                    state.consumeGroupCoupons.splice(index, 1)
                }
            })
        },

        //删除全部团购券
        [TYPES.CLEAR_ALL_GROUPONS] : (state) => {
            state.consumeGroupCoupons = []
        },



        //验证后可用的优惠券存入数组
        [TYPES.SAVE_AVAILABEL_COUPON] : (state, coupon) => {
            // console.log(coupon)
           if(coupon instanceof Array) {
             state.availableCouponList = coupon
           }
        },

        //从可用的优惠券中删除一个优惠券
        [TYPES.DEL_SELECTED_COUPON] : (state, coupon) => {
            // console.log(coupon)
            // console.log(state.availableCouponList)
            state.availableCouponList.forEach((item, index) => {
                if(coupon.ticketCode == item.ticketCode) {
                    state.availableCouponList.splice(index, 1)
                }
            })
        },

        //结算后清空当前选中的优惠券
        [TYPES.CLEAR_ALL_SELECTED_COUPON] : (state) => {
            state.availableCouponList = []
        },
        
        //查找所有优惠券信息有数据则存进数组
        [TYPES.SAVE_COUPON_LIST] : (state, arr) => {
          state.couponList = arr
        },

        //打开关闭vip输入框
        [TYPES.SET_VIP_CHECKOUT_BOX] : (state, booleanStauts) => {
           state.vipInputStatus = booleanStauts
        },
        //打开关闭viplist 
        [TYPES.SET_VIP_LIST_BOX] : (state, booleanStatus) => {
            state.vipListStatus = booleanStatus
        },
        
        //是否开启checkMany
        [TYPES.SET_CHECK_MANY] : (state, booleanStatus) => {
            state.checkMany = booleanStatus
        },
        
        //获取会员信息
        [TYPES.SET_VIP_INFO] : (state, obj) => {
            state.vipInfo = obj
        },

        //优惠活动列表
        [TYPES.SET_ACTIVITY_LIST] : (state, arr) => {
           state.selActivityList = []
           state.activityList = []
           if(arr instanceof Array && arr.length) {
                state.activityTip = ''
                state.activityList = arr.map(item => {
                    let obj = {
                        id: item.couponKey,
                        ruleGroupName: item.couponName,
                        releGroupRemark: item.couponSpec,
                        enable: item.enable
                    }
    
                    if(obj.enable == 0) {
                    state.selActivityList.push(obj.id)
                    }
    
                    return obj
                })
           }else {
            state.activityTip = '暂无优惠活动，敬请期待！'
           }
        },

        //选择优惠活动
        [TYPES.SELECTE_ACTIVITY_ID] : (state, id) => {
           if(state.selActivityList.indexOf(id) < 0) {
            state.selActivityList.push(id)
           }else {
            state.selActivityList.splice( state.selActivityList.indexOf(id), 1 );
           }
        },

        //临时活动ID
        [TYPES.SET_ACTIVITY_ID_TEMP] : (state, id) => {
            state.activitytempId = id
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
            state.payNum = { 
                realPayNum: 0,
                authCode: '',
                realChange: 0
              }
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
            state.payData.voucherAmount = data.voucherAmount
        },
        
        //返回找零数额
        [TYPES.SET_RETURN_PAY] : (state, val) => {
            state.returnPay = val
        },

        //根据findCart返回结果存在数据中
        [TYPES.SET_PAYED_LIST] : (state, list) => {
            state.payedList = []
            state.payedList = list
        },

        //支付结果显示或者隐藏
        [TYPES.SET_PAY_RESULT] : (state, val) => {
            state.payResult = !state.payResult
        },

        [TYPES.GLOBAL_SET_NAV_DATAS] :(state,data) => {
            state.menuList = data.menuList;
            state.otherList = data.otherList;
            state.otherFlag = data.otherFlag;
        },
        [TYPES.GLOBAL_USER_CONFIG] : ( state,data ) => {
            state.userConfig = data;
        },
        [TYPES.GLOBAL_JHPAY_BODY_INFO] : ( state,data ) => {
            state.jhPayBody = data;
        },
        [TYPES.GLOBAL_JHPAY_SET_BANk_INFO] : (state,{delFlag,bankCardCode,returnCode}) => {
            state.jhPayBanks.delFlag = delFlag;
            state.jhPayBanks.bankCardCode = bankCardCode;
            state.jhPayBanks.returnCode = returnCode
        },
        [TYPES.GLOBAL_CARD_PAY_SET_BANk_INFO] : (state,{delFlag,bankCardCode,returnCode}) => {
            state.cardPayBanks.delFlag = delFlag;
            state.cardPayBanks.bankCardCode = bankCardCode;
            state.cardPayBanks.returnCode = returnCode
        },
        [TYPES.GLOBAL_PAY_SORT] : (state,data) => {
            state.paySort = data;
        },
        [TYPES.SET_HAS_CONSUME_ACTIVITY] : (state, booleanStatus) => {
            state.hasConsumeActivity = booleanStatus
        }
       
    },

    actions: {
        //获取活动
        async [TYPES.GET_ACTIVITY_DATA]({commit, state}){
            if(state.userConfig.use_marketing_activities == '1' && !state.hasConsumeActivity) {
                let data = await checkActivety({
                        billCode: state.billCode, 
                        payTypeCode: state.payMethod.currentPayMethodId,
                        chooseKeys: state.selActivityList,
                        cardNum: state.vipInfo.cardNo || ""
                    })
                
                if(data.code == 200) {
                    // console.log(data)
                    commit(TYPES.SET_ACTIVITY_LIST, data.data.marketingResultList)
                    commit(TYPES.GET_KIND_PRICE,data.data)
                    commit(TYPES.GET_CART_DATA,data.data)
                    commit(TYPES.CART_SET_GOODS_DATA,data.data.merGoodsList)
                    commit(TYPES.SET_PAYED_LIST, data.data.payedList)
                }
            }else {
                state.activityTip = "暂无优惠活动，敬请期待！"
            }  
       },
       //取消活动
       async [TYPES.CANCEL_ACTIVITY_DATA]({commit, state}, currentId) {
           let index = state.selActivityList.indexOf(currentId)
           state.selActivityList.splice(index, 1)
           let data = await cancelActivity({
            billCode: state.billCode,
            payTypeCode: state.payMethod.currentPayMethodId,
            couponKey: currentId,
            chooseKeys: state.selActivityList
           })

           if(data.code == 200) {
                // console.log("活动取消")
                commit(TYPES.SET_ACTIVITY_LIST, data.data.marketingResultList)
                commit(TYPES.GET_KIND_PRICE,data.data)
                commit(TYPES.GET_CART_DATA,data.data)
                commit(TYPES.CART_SET_GOODS_DATA,data.data.merGoodsList)
                commit(TYPES.SET_PAYED_LIST, data.data.payedList)
        }
       },

       //获取团购券
       async [TYPES.GET_GC_DATA]({commit, state}) {
           state.groupCoupons = []
           let couponsDatas = await getGroupCoupon({
               billCode: state.billCode
           })
           if(couponsDatas.code == 200 && couponsDatas.data.length) {
              state.groupCoupons = couponsDatas.data
           }
       }
    },

    getters: {
        //开启checkMany
        checkMany(state) {
          return state.checkMany
        },
        //活动是否核销
        hasConsumeActivity(state) {
          return state.hasConsumeActivity
        },
        //是否开启会员密码支付
        isNeedPwd(state) {
          return state.isNeedPwd
        },
        //获取可用优惠券信息
        availableCouponList(state) {
          return state.availableCouponList
        },
        //获取优惠券信息
        couponList(state) {
          return state.couponList
        },
        //获取团购票券
        groupCoupons(state) {
            return state.groupCoupons
        },
        //用户uid
        userUid(state) {
           return state.userUid
        }, 
        //获,得租户id
        tenantId(state) {
            return state.tenantId
        },
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

        //团购券查询显示
        checkGCResult(state) {
            return state.checkGCResult
        },

        //获得支付数据实际支付以及找零
        payNum(state) {
            return state.payNum
        },

        //获取消费后团购券
        consumeGroupCoupons(state) {
            return state.consumeGroupCoupons
        },

        //团购券消费弹出显示
        checkoutGCResult(state) {
            return state.checkoutGCResult
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

        //渠道名称
        channelName(state) {
           return state.channelName
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
        //getUserNmae
        userName(state){
            return state.userName;
        },
        terminalCode(state){
            return state.terminalCode
        },
        //支付后列表
        payedList(state) {
            return state.payedList
        },
        //获取优惠活动
        activityList(state) {
            return state.activityList
        },
        //已选择的优惠活动
        selActivityList(state) {
            return state.selActivityList
        },
        //当前临时活动id
        activitytempId(state) {
            return state.activitytempId
        },
        //是否显示vip输入框
        vipInputStatus(state) {
            return state.vipInputStatus
        },
        //是否显示会员列表
        vipListStatus(state) {
            return state.vipListStatus
        },
        //支付页面会员信息的展示
        vipInfo(state) {
            return state.vipInfo
        },
        preAmount(state) {
            return state.preAmount
        },
        getUserConfig(state) {
            return state.userConfig
        },
        //优惠活动提示
        activityTip(state) {
            return state.activityTip
        },
        jhPayBody(state) {
            return state.jhPayBody
        },
        jhPayBanks(state){
            return state.jhPayBanks
        },
        //银行卡支付结果
        cardPayBanks(state) {
            return state.cardPayBanks
        },
        // 支付方式排序
        paySort(state) {
            return state.paySort
        }
    }
}