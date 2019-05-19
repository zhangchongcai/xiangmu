import Axios from './http'
//url传数组数组[1] 可改变 URL拼接  默认 ''，
export const journalismApi  =  (data) => Axios.get(['posticket/journalismApi', ''],data).then( res => res.data )

//获取全部座位
export const queryAllSeat = (data) => Axios.post(['mockjsdata/38/posticket/queryAllSeat'], data).then(res => res.data)

//获取mock的电影数据 前端测试用 webwebweb
// export const queryAllFilm = (data) => Axios.get(['films', '/'], data).then(res => res.data)

//POS登录
export const loginPos = (data) => Axios.post(['user/login'], data).then(res => res.data)

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
export const changeTicketCategory = (data) => Axios.post(['saleBill/updateTicketType'],data).then(res => res.data)
//获取支付方式
export const payType = (data) => Axios.get(['payType/findAll'], data).then(res=> res.data)
//支付接口
export const payIt= (data) => Axios.post(['csm/pay'], data).then(res => res.data)
//结算接口
export const settleIt = (data) => Axios.post(['saleBillGoods/settlement'], data).then(res => res.data)



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
export const posticketGetTicket = data => Axios.post(['posticket/getTicket'],data).then( res => res.data )

//抽钞记录接口
export const extractFund = data => Axios.post(['extractFund'],data).then( res => res.data )

//卖品菜单
export const productExhibitionClassIfy = data => Axios.post(['productExhibition/classIfy/'+data.cinemaUid,'http://192.168.101.89:2302/']).then( res => res.data )

//卖品商品列表
export const productExhibitionHomeDefault =  data => Axios.post(['productExhibition/homeDefault/'+data.cinemaUid,'http://192.168.101.89:2302/']).then( res => res.data )
