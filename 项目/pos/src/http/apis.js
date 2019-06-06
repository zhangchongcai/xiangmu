import Axios from './http'
//url传数组数组[1] 可改变 URL拼接  默认 ''，
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
//购物车更换套餐
export const saleBillSetmealChange = data => Axios.post(['saleBill/setmealChange'],data).then( res => res.data )
//获取支付方式
export const payType = (data) => Axios.get(['payType/findAll'], data).then(res=> res.data)
//支付接口
export const payIt= (data) => Axios.post(['csm/pay'], data).then(res => res.data)
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
export const posticketGetTicket = data => Axios.post(['posticket/getTicket','http://192.168.101.139:2302/'],data).then( res => res.data )
//获取打印信息接口
export const posticketPrintTicket = data => Axios.post(['posticket/printTicket','http://192.168.101.139:2302/'],data).then( res => res.data )
//通知后台打印状态
export const posticketTicketPrintNotify = data => Axios.post(['posticket/ticketPrintNotify','http://192.168.101.139:2302/'],data).then( res => res.data )
//取货卖品接口
export const posticketGetGoods = data => Axios.post(['posticket/getGoods','http://192.168.101.139:2302/'],data).then( res => res.data )

// export const posticketPrintTicket = data => Axios.post(['posticket/printTicket'],data).then( res => res.data )

//抽钞记录接口
export const extractFund = data => Axios.post(['extractFund'],data).then( res => res.data )

//卖品菜单
export const productExhibitionClassIfy = data => Axios.post(['productExhibition/classIfy'],data).then( res => res.data )

//卖品商品列表
export const productExhibitionHomeDefault =  data => Axios.post(['productExhibition/homeDefault'],data).then( res => res.data )

export const productExhibitionGetProductByCode = data => Axios.post(['productExhibition/getProductByCode'],data).then( res => res.data )

//修改密码
export const changePassword = data => Axios.post(['/changePassword'],data).then( res => res.data )
//注销
export const userLogout = data => Axios.get(['/user/logout'],data).then( res => res.data )
//授权接口
export const userAuthorize = data => Axios.formDataPost(['user/authorize'],data).then( res => res.data )
//广电通知
export const noticeList = data => Axios.get(['/notice/list'],data).then( res => res.data )
//首页菜单
export const getMenuTree = data => Axios.post(['user/getMenuTree'],data).then( res => res.data )
