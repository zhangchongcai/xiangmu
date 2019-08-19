import Axios from './http'
//url传数组数组[1] 可改变 URL拼接  默认 ''，
let apiHost = location.host;
const managementBackgroundApi = process.env.NODE_ENV === 'production' ? `http://api${apiHost.replace('pos','')}/trade/` : 'http://apidev.oristarcloud.com/trade/'
export const journalismApi  =  (data) => Axios.get(['posticket/journalismApi', ''],data).then( res => res.data )

//获取全部座位
export const queryAllSeat = (data) => Axios.post(['mockjsdata/38/posticket/queryAllSeat'], data).then(res => res.data)

//获取mock的电影数据 前端测试用 webwebweb
// export const queryAllFilm = (data) => Axios.get(['films', '/'], data).then(res => res.data)

//POS登录
export const loginPos = (data) => Axios.post(['user/login'], data).then(res => res.data)

//权限列表
export const userGetMenuTree = data => Axios.get(['user/getMenuTree'],data).then( res => res.data )

//获取当前场次的座位
export const queryCurrentPlanSeat = (data) => Axios.post(['timeSeat/queryTimeSeat'], data).then(res => res.data)

//查询当前场次分区zt
export const queryCurrentPlanRegion = (data) => Axios.post(['timeSeat/queryRegion'], data).then(res => res.data)

//获取可售电影排期  首页左侧
export const queryFilmDate = (data) => Axios.post(['possale/saleQuerySessionSalable'], data).then(res => res.data)

//获得全部电影排期
export const queryAllFilm = (data) => Axios.post(['possale/saleQuerySessionAll'], data).then(res => res.data)

//锁座
export const lockSeat = (data) => Axios.post(['timeSeat/lockTimeSeat'], data).then(res => res.data)

//释放
export const releaseSeat = (data) => Axios.post(['timeSeat/releaseSeat'], data).then(res => res.data)

//查询当前的状态
export const findTimeSeatStatus = (data) => Axios.post(['timeSeat/findTimeSeatStatus'], data).then(res => res.data)

//动态获取票价
export const getTicketPrice = (data) => Axios.post(['saleBill/getDynamicPrice'], data).then(res => res.data)

//获取购物车
    //初始化订单

export const initCart = (data) => Axios.post(['saleBill/initCart'], data).then(res => res.data)
export const addCart = (data) => Axios.post(['saleBill/addCart'], data).then(res => res.data)
export const findCart = (data) => Axios.get(['saleBill/findCart'], data).then(res => res.data)
export const saveSaleBill = (data) => Axios.get(['saleBill/saveSaleBill'], data).then(res => res.data)
export const delTicket = (data) => Axios.post(['saleBill/delGoods'], data).then(res => res.data)
export const clearAllTicket = (data) => Axios.dele(['saleBill/empty'], data).then(res => res.data)
export const clearAllCart = (data) => Axios.dele(['saleBill/emptyCart'], data).then(res => res.data)
export const onlyClearSeats = (data) => Axios.dele(['saleBill/emptySeat'], data).then(res => res.data)
export const changeTicketCategory = (data) => Axios.post(['saleBill/updateTicketType'],data).then(res => res.data)
export const replaceGood = (data) => Axios.post(['productExhibition/getComboReplace'], data).then(res => res.data)
export const addFixMer = data => Axios.post(['saleBill/addFixMer'],data).then( res => res.data ) // 购物车卖品跟换数量
export const productExhibitionRecommend = data => Axios.get(['productExhibition/recommend'],data).then( res => res.data ) //首页推荐商品
//购物车更换套餐
export const saleBillSetmealChange = data => Axios.post(['saleBill/setmealChange'],data).then( res => res.data )
//支付宝，微信支付结果查询中
export const queryAliWeiPayResult = (data) => Axios.post(['csm/alipay/pay/query '], data).then(res => res.data)
//获取支付方式
export const payType = (data) => Axios.get(['payType/findAll'], data).then(res=> res.data)
//单独的会员支付方式
export const payVip = (data) => Axios.post(['csm/pay'], data).then(res => res.data)
//会员退款
export const refundVip = (data) => Axios.post(['csm/refund'], data).then(res => res.data)
//会员卡查询
export const checkoutVip = (data) => Axios.post(['csm/getMemberData'], data).then(res => res.data)
//获取活动
export const checkActivety = (data) => Axios.post(['saleBill/getPromotions'], data).then(res => res.data)
//确认活动
export const checkoutActivety = (data) => Axios.post(['saleBill/confirmMarketing'], data).then(res => res.data)
//取消活动
export const cancelActivity = (data) => Axios.post(['saleBill/cancelCoupon'], data).then(res => res.data)
//改变活动是否可以选择的状态
export const changeActivityStatus = (data) => Axios.post(['saleBill/updateMarketingStatus'], data).then(res => res.data)
//团购券
export const getGroupCoupon = (data) => Axios.get(['saleBill/coupon/grouponQuery'], data).then(res => res.data)
//消费团购券
export const consumeGroupon = (data) => Axios.post(['saleBill/coupon/consumerGroupon'], data).then(res => res.data)
//删除一个团购券
export const delGroupon = (data) => Axios.post(['saleBill/coupon/cancelGroupons'], data).then(res => res.data)
//团购券支付
export const grouponPay = (data) => Axios.get(['csm/grouponTicketPay'], data).then(res => res.data)
//会员获取优惠券
export const getCouponsData = (data) => Axios.post(['csm/getMemberCoupon'], data).then(res => res.data)
//优惠券验证
export const proveCoupon = (data) => Axios.post(['saleBill/coupon/checkOfOne'], data).then(res => res.data)
//第二张优惠券验证
export const proveSecCoupon = (data) => Axios.post(['saleBill/coupon/couponCheckOfMany'], data).then(res => res.data)
//检查代金券是否需要输入密码
export const proveIsNeedPwd = (data) => Axios.post(['saleBill/coupon/checkOnly'], data).then(res => res.data)
//抵扣券密码验证
export const proveCouponPwd = (data) => Axios.post(['saleBill/coupon/checkPwd'], data).then(res => res.data)
//取消票券
export const cancelTicket = (data) => Axios.post(['saleBill/coupon/cancelTicket'], data).then(res => res.data)
//核销优惠券
// export const consumeCoupon = (data) => Axios.post(['saleBill/coupon/consumeCoupon'], data).then(res => res.data)
export const consumeCoupon = (data) => Axios.post(['/saleBillGoods/orderflow'], data).then(res => res.data)
//核销活动
export const consumeActivity = (data) => Axios.post(['saleBill/addExeTime'], data).then(res => res.data)
//取消支付时触发优惠活动还原
export const cancelAllActivityCoupons = (data) => Axios.post(['saleBill/cancelAllCoupon'], data).then(res => res.data)
//票券支付，在总支付接口支付前调用
export const couponPay = (data) => Axios.get(['csm/ticketPay'], data).then(res => res.data)
//支付接口
export const payIt= (data) => Axios.post(['csm/pay'], data).then(res => res.data)
//撤销支付
export const refundIt = (data) => Axios.dele(['saleBill/delPay'], data).then(res => res.data)
//结算接口
export const settleIt = (data) => Axios.post(['saleBillGoods/settlement'], data).then(res => res.data)
//同步流水
export const syncFlow = (data) => Axios.get(['saleBillGoods/orderflow'], data).then(res => res.data)
//影票打印成功的接口
export const movieTicketSuccess = (data) => Axios.post(['movieTicket/movieTicketPrintSuccessCallBack'], data).then(res => res.data)


//获取退货信息
export const refundFindSaleBillForRefund = (data) => Axios.get([`refund/findSaleBillForRefund/${data.code}`],{}).then( res => res.data )
//获取退款原因
export const csmReason = (data) => Axios.get(['refund/Reason'],data).then( res => res.data )
//退货
export const refundRefundSaleBill = (data) => Axios.post(['refund/refundSaleBill'],data).then( res => res.data )



//验票查询接口
export const movieTicketCheck = (data) => Axios.get(['movieTicket/check'],data).then( res => res.data )

//补登票条件筛选接口
export const saleBillAppendSaleQuerySessionUnSalable = (data) => Axios.post(['saleBillAppend/saleQuerySessionUnSalable'],data).then(res=>res.data)
//补登票查询表格接口
export const saleBillAppendGetAppendedInfo = data => Axios.get(['saleBillAppend/getAppendedInfo'],data).then(res=>res.data);
//上传补登票接口
export const saleBillAppendSave = data => Axios.post(['saleBillAppend/save'],data).then( res => res.data )
//取货查询接口
export const posticketGetTicket = data => Axios.post(['posticket/getTicket'],data).then( res => res.data )
//获取打印信息接口
export const posticketPrintTicket = data => Axios.post(['posticket/printTicket'],data).then( res => res.data )
//通知后台打印状态
export const posticketTicketPrintNotify = data => Axios.post(['posticket/ticketPrintNotify'],data).then( res => res.data )
//重打印影票列表
export const posticketGetRep = data => Axios.get(['posticket/getRep'],data).then( res => res.data )
//取货卖品接口
export const posticketGetGoods = data => Axios.post(['posticket/getGoods'],data).then( res => res.data )

// export const posticketPrintTicket = data => Axios.post(['posticket/printTicket'],data).then( res => res.data )

//抽钞记录接口
export const extractFund = data => Axios.post(['extractFund'],data).then( res => res.data )

//卖品菜单
export const productExhibitionClassIfy = data => Axios.formDataPost(['productExhibition/classIfy'],data).then( res => res.data )

//卖品商品列表
export const productExhibitionHomeDefault =  data => Axios.post(['productExhibition/homeDefault'],data).then( res => res.data )

export const productExhibitionGetProductByCode = data => Axios.post(['productExhibition/getProductByCode'],data).then( res => res.data )

//修改密码
export const changePassword = data => Axios.post(['/changePassword'],data).then( res => res.data )
//注销
export const userLogout = data => Axios.get(['/user/logout'],data).then( res => res.data )
//授权接口
export const userAuthorize = data => Axios.post(['user/authorize'],data).then( res => res.data )
//广电通知
export const noticeList = data => Axios.get(['/notice/list'],data).then( res => res.data )
//首页菜单
export const getMenuTree = data => Axios.post(['user/getMenuTree'],data).then( res => res.data )
//抽钞工作人员授权
export const userCheckUserInfo = data => Axios.formDataPost(['user/checkUserInfo'],data).then(res => res.data)
export const userGetConfig = data => Axios.get(['/user/getConfig'],data).then( res => res.data )
//班次领用信息
export const getUseInfo = data => Axios.get(['/workTime/selectIssueItems'],data).then( res => res.data )
// 获取聚合支付信息
export const getJhPayParam = data => Axios.post(['csm/getJhPayParam'],data).then( res => res.data )
// 支付方式排序
export const faPayTypeCinemaSeqencing = data  => Axios.post(['faPayTypeCinema/seqencing',managementBackgroundApi],data).then( res => res.data )

