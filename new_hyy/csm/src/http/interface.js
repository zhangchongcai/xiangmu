import { axios } from 'base';

// 获取分类树
export const getCategoryTrees = data => {
  return axios({
    url: '/cim/category/trees',
    method: 'post',
    data
  });
};

export const goodsDataQueryGoodsList = data => {
  return axios({
    url: 'cim/goodsData/queryGoodsList',
    // url: 'cim/goodsData/queryMerBySkuInfo',
    method: 'post',
    data
  });
};

// 首页查询
export const goodsDataQueryCinemaGoodsList = data => {
  return axios({
    // baseURL: config.baseURL,
    url: '/cim/goodsData/queryCinemaGoodsList',
    method: 'post',
    data
  });
};

/**
 *  组织结构树   用途  -交易客商
 *
 * @function listBuyerCondition
 * @param uid  -localStore use的uid
 */

export const listBuyerCondition = data => {
  return axios({
    url: '/common/buyer/listBuyerCondition',
    method: 'post',
    data
  });
};

// 获取当前用户信息
export const getCtmUserInfo = params => {
  return axios({
    url: '/ticket/common/user',
    method: 'get',
    params
  });
};

// 获取数据字典枚举值统一接口
export const getByName = params => {
  return axios({
    url: '/ticket/dictionary/getByName',
    method: 'get',
    params
  });
};

// 查询影院树
export const getCtmCinemaTree = params => {
  return axios({
    url: '/ticket/cinema/tree',
    method: 'get',
    params
  });
};

// ======================================================

/**
 * 将所有接口统一起来便于维护
 * 如果项目很大可以将 URL 独立成文件，接口分成不同的模块
 */
/**
 * 清机结算
 */
// 班次收银管理列表
export const clearaccountList = (data, current, size) => {
  return axios({
    url: `/trade/workTime/findByPage?current=${current}&size=${size}`,
    method: 'post',
    data
  });
};
// 获取收银员（管理列表）
export const getWorker = params => {
  return axios({
    url: '/trade/workTime/findWorkTimeUsersByPage/workers',
    method: 'get',
    params
  });
};
// 获取制单人（管理列表）
export const getCreater = params => {
  return axios({
    url: '/trade/workTime/findWorkTimeUsersByPage/creators',
    method: 'get',
    params
  });
};
// 获取收银员（上班登记）
export const getCashier = params => {
  return axios({
    url: '/trade/workTime/findCashierByPage',
    method: 'get',
    params
  });
};
// 获取会员等级 （上班登记）
export const getVip = params => {
  return axios({
    url: '/trade/workTime/findVipLevelByPage',
    method: 'get',
    params
  });
};
// 获取可领用的其他物品 （上班登记）
export const getOtherthing = params => {
  return axios({
    url: '/trade/workTime/findCinemaOtherthingByPage',
    method: 'get',
    params
  });
};
// 新增数据 （上班登记）
export const increaseWorker = data => {
  return axios({
    url: '/trade/workTime/save',
    method: 'post',
    data
  });
};
// 追加领用接口
export const addIssue = data => {
  return axios({
    url: '/trade/workTime/addIssue',
    method: 'post',
    data
  });
};
// 清机结算（第一步）
export const clearOne = params => {
  return axios({
    url: '/trade/workTime/readWorkTimeForClearing',
    method: 'get',
    params
  });
};
// 清机结算（第二步）
export const clearTwo = data => {
  return axios({
    url: '/trade/workTime/workTimeClearing',
    method: 'post',
    data
  });
};
// 清机结算（总的详情）
export const clearDetail = params => {
  return axios({
    url: '/trade/workTime/readWorkTime',
    method: 'get',
    params
  });
};
// 清机结算（领取详情）
export const thingDetail = params => {
  return axios({
    url: '/trade/workTime/selectIssueItems',
    method: 'get',
    params
  });
};
// 清机结算（实收金额）
export const actualCash = params => {
  return axios({
    url: '/trade/workTime/selectWorkTimeCashList',
    method: 'get',
    params
  });
};
// 清机结算（支付信息明细）
export const payTotal = (data, current, size) => {
  return axios({
    url: `/trade/workTime/selectSaleBillPayFlowList?current=${current}&size=${size}`,
    method: 'post',
    data
  });
};
// 清机结算（电影票销售）
export const filmSell = (data, current, size) => {
  return axios({
    url: `/trade/workTime/selectMovieTicketList?current=${current}&size=${size}`,
    method: 'post',
    data
  });
};
// 清机结算（卖品销售）
export const goodsSell = (data, current, size) => {
  return axios({
    url: `/trade/workTime/selectSaleMerFlowList?current=${current}&size=${size}`,
    method: 'post',
    data
  });
};
// 清机结算（会员卡销售）
export const vipSell = (data, current, size) => {
  return axios({
    url: `/trade/workTime/selectSaleMemberFlowList?current=${current}&size=${size}`,
    method: 'post',
    data
  });
};
// 清机结算（票券销售）
export const ticketSell = (data, current, size) => {
  return axios({
    url: `/trade/workTime/selectSaleTicketFlowList?current=${current}&size=${size}`,
    method: 'post',
    data
  });
};
// 清机结算（票券销售）
export const otherSell = (data, current, size) => {
  return axios({
    url: `/trade/workTime/selectSaleOtherFlowList?current=${current}&size=${size}`,
    method: 'post',
    data
  });
};
// 清机结算（资金调整单列表）
export const adjustList = (data, current, size) => {
  return axios({
    url: `/trade/fundChange/findByPage?current=${current}&size=${size}`,
    method: 'post',
    data
  });
};
// 清机结算（资金调整单 新增）
export const adjustAdd = data => {
  return axios({
    url: '/trade/fundChange/save',
    method: 'post',
    data
  });
};
// 清机结算（资金调整单 获取资金科目）
export const getAdjustSubject = data => {
  return axios({
    url: '/trade/fundChangeSubject/findByPage?current=1&size=100',
    method: 'post',
    data
  });
};
// 清机结算（清机结算完成）
export const exportExcel = data => {
  return axios({
    url: '/trade/workTime/exportExcel',
    method: 'post',
    data,
    responseType: 'blob'
    // async: true
  });
};
// 清机结算（导出）
export const clearFinish = data => {
  return axios({
    url: '/trade/workTime/workTimeCleared',
    method: 'post',
    data
  });
};

/**
 * 订单查询
 */
// 订单列表页查询
export const orderList = (data, current, size) => {
  return axios({
    // baseURL:'http://192.168.100.118:2302',
    url: `/trade/saleBillSearch/selectSaleBillByPage?current=${current}&size=${size}`,
    // url: `/saleBillSearch/selectSaleBillByPageTest?current=${current}&size=${size}`,
    method: 'post',
    data
  });
};
// 支付方式
export const payType = params => {
  return axios({
    // baseURL:'http://192.168.100.118:2302',
    url: '/trade/payType/findAllForBillQuery',
    method: 'get',
    params
  });
};
// 获取收银员
export const orderWorker = params => {
  return axios({
    // baseURL:'http://192.168.100.118:2302',
    url: `/trade/saleBillSearch/selectTransactionUsersByPage`,
    method: 'get',
    params
  });
};
// 订单详情
export const payDetail = params => {
  return axios({
    url: '/trade/saleBillSearch/readSaleBillInfo',
    // url: '/saleBillSearch/readSaleBillInfoTest',
    method: 'get',
    params
  });
};
// 取货码
export const getGoodCode = params => {
  return axios({
    url: '/trade/saleBillSearch/getGetCode',
    method: 'get',
    params
  });
};
/**
 * 领用物品管理
 */
// 物品列表页查询
export const otherthingsList = (params, current, size) => {
  return axios({
    url: `/trade/otherthing/findByPage?current=${current}&size=${size}`,
    method: 'get',
    params
  });
};
// 新增领用物品
export const addOtherthing = data => {
  return axios({
    url: '/trade/otherthing/save',
    method: 'post',
    data
  });
};
// 删除物品
export const deleteOtherthing = uid => {
  return axios({
    url: `/trade/otherthing/delete/${uid}`,
    method: 'delete'
  });
};
// 获取电影影院
export const getCinemaByParam = params => {
  // console.log(document.domain)
  // let domain = document.domain;
  // let baseURL = "";
  // switch (domain) {
  //   case '192.168.100.124':   // 黎康本地IP
  //     // baseURL = 'http://apitest.oristarcloud.com'
  //     baseURL = 'http://apidev.oristarcloud.com'
  //     break;
  //   case '127.0.0.1':
  //     // baseURL = 'http://apitest.oristarcloud.com'
  //     baseURL = 'https://api.oristarcloud.com'
  //     // baseURL = 'http://apidev.oristarcloud.com'
  //     break;
  //   case "dev.oristarcloud.com":
  //     baseURL = 'http://apidev.oristarcloud.com'

  //     break;
  //   case "test.oristarcloud.com":
  //     baseURL = 'http://apitest.oristarcloud.com'
  //     break;
  //   case "www.oristarcloud.com":
  //     baseURL = 'https://api.oristarcloud.com'
  //     break;
  //   default:
  //     baseURL = 'https://api.oristarcloud.com';
  //     break;
  // }
  return axios({
    // 🌲状结构
    // baseURL:'http://apidev.oristarcloud.com/report',
    // url: '/condition/getCinemaByParam',
    // 表格结构 （正确数据）
    // baseURL:'http://apidev.oristarcloud.com',
    // baseURL:baseURL,
    url: '/cpm/user/auth/queryUserCinemas',
    method: 'get',
    params
  });
};
/*
 * 抽钞记录管理
 */
// 物品列表页查询
export const getMoneyList = (data, current, size) => {
  return axios({
    url: `/trade/extractFund/findTimeExtractFundByPage?current=${current}&size=${size}`,
    method: 'post',
    data
  });
};
// 抽钞记录查询-抽钞人列表
export const getMoneyPerson = params => {
  return axios({
    url: '/trade/extractFund/findExtractUsersByPage/extracters',
    method: 'get',
    params
  });
};
// 抽钞记录查询-收银员列表
export const getMoneyCashier = params => {
  return axios({
    url: `/trade/extractFund/findExtractUsersByPage/workers`,
    method: 'get',
    params
  });
};
/** * 销售地点管理 start ***/
// 销售地址--查询
export const queryPage = (page, pageSize, data) => {
  return axios({
    // baseURL: 'http://apidevpos.oristarcloud.com',
    url: `/trade/salePlace/queryPage?page=${page}&pageSize=${pageSize}`,
    method: 'post',
    data
  });
};
// 销售地址--修改
export const addressChange = data => {
  return axios({
    url: `/trade/salePlace/update`,
    method: 'post',
    data
  });
};
// 销售地址--删除
export const addressDelete = uid => {
  return axios({
    url: `/trade/salePlace/delete/${uid}`,
    method: 'delete'
  });
};
// 销售地址--添加
export const addressAdd = data => {
  return axios({
    // baseURL: 'http://apidevpos.oristarcloud.com',
    url: `/trade/salePlace/save`,
    method: 'post',
    data
  });
};
// 销售地址--添加
export const changeStatus = (uid, status) => {
  return axios({
    // baseURL: 'http://apidevpos.oristarcloud.com',
    url: `/trade/salePlace/status?uid=${uid}&status=${status}`,
    method: 'post'
  });
};
// 销售地址--详情
export const addressDetail = uid => {
  return axios({
    // baseURL: 'http://apidevpos.oristarcloud.com',
    url: `/trade/salePlace/get/${uid}`,
    method: 'get'
  });
};
/** * 销售终端管理 start ***/
// 销售终端-查询
export const terminalList = (current, pageSize, data) => {
  return axios({
    // baseURL: 'http://192.168.100.118:2302',
    url: `/trade/terminal/queryPage?current=${current}&pageSize=${pageSize}`,
    method: 'post',
    data
  });
};
// 未销售终端-查询
export const terminalList2 = (code, status, cinemaUid) => {
  let url = '';
  console.log(code);
  if (code && !status) {
    url = `/trade/terminal/listUnboundTerminal?code=${code}&cinemaUid=${cinemaUid}`;
  } else if (status && !code) {
    url = `/trade/terminal/listUnboundTerminal?status=${status}&cinemaUid=${cinemaUid}`;
  } else if (code && status) {
    url = `/terminal/listUnboundTerminal?code=${code}&status=${status}&cinemaUid=${cinemaUid}`;
  } else if (!code && !status) {
    url = `/trade/terminal/listUnboundTerminal?cinemaUid=${cinemaUid}`;
  }
  return axios({
    url: url,
    method: 'get'
  });
};
// 销售终端 获取编码
export const getAddressCode = params => {
  return axios({
    url: `/trade/salePlace/getSalePlaceCode`,
    method: 'get',
    params
  });
};
export const rackAll = (uid, params) => {
  return axios({
    // baseURL: 'http://apidevpos.oristarcloud.com',
    url: `/trade/terminal/rackAll?cinemaUid=${uid}`,
    method: 'get',
    params
  });
};
export const addressUpdata = data => {
  return axios({
    url: `/trade/terminal/update`,
    method: 'post',
    data
  });
};

/** * 资金科目管理 start ***/
// 新建资金调整科目
export const addSubject = data => {
  return axios({
    url: `/trade/fundChangeSubject/save`,
    method: 'post',
    data
  });
};
// 删除资金调整科目
export const delateSubject = subjectCode => {
  return axios({
    url: `/trade/fundChangeSubject/delete/${subjectCode}`,
    method: 'delete'
  });
};
// 修改资金调整科目
export const changeSubject = data => {
  return axios({
    url: `/trade/fundChangeSubject/update`,
    method: 'post',
    data
  });
};
// 查找资金调整科目
export const searchSubject = (current = 1, size = 15, data) => {
  return axios({
    url: `/trade/fundChangeSubject/findByPage?current=${current}&size=${size}`,
    method: 'post',
    data
  });
};
/** * 资金科目管理 end ***/

/** * 资金调整单管理 start ***/
// 新建资金调整科目
export const addAdjst = data => {
  return axios({
    url: `/trade/fundChange/save`,
    method: 'post',
    data
  });
};
// 根据资金调整单号查找
export const searchByCode = fundCode => {
  return axios({
    url: `/trade/fundChange/findByCode/${fundCode}`,
    method: 'get'
  });
};
// 分页条件检索资金调整单
export const searchAdjust = (current = 1, size = 15, data) => {
  return axios({
    url: `/trade/fundChange/findByPage?current=${current}&size=${size}`,
    method: 'post',
    data
  });
};
/** * 资金科目管理 end ***/

/** * 公共组件接口 start ***/
// 交易渠道/代理商
export const getDitch = data => {
  return axios({
    // baseURL:'http://192.168.100.23:2301',
    baseURL: 'http://apidev.oristarcloud.com',
    url: `/ticket/base/channel/agent`,
    method: 'post',
    data
  });
};
// 页面控件类型
export const getMoudelData = (page, pageSize, name) => {
  return axios({
    // baseURL:'http://192.168.100.23:2301',
    baseURL: 'http://apidev.oristarcloud.com',
    url: `/ticket//dictionary/page?page=${page}&pageSize=${pageSize}&name=${name}`,
    method: 'post'
  });
};
/** * 公共组件接口 end ***/

/** * 支付方式 start ***/
// 检索总部支付方式
export const getHeadquartersPayType = params => {
  return axios({
    url: `/trade/faPayType/findByPage`,
    method: 'get',
    params
  });
};

// 检索影院支付方式
export const findPayTypeCinema = params => {
  return axios({
    url: `/trade/faPayTypeCinema/findPayTypeCinema`,
    method: 'get',
    params
  });
};

// 同步支付方式到影院
export const pullPayTypeToCinema = data => {
  return axios({
    url: `/trade/faPayTypeCinema/pullPayType/${data.cinemaUid}`,
    method: 'post'
  });
};

// 新建支付方式
export const savePayType = data => {
  return axios({
    url: `/trade/faPayType/save`,
    method: 'post',
    data
  });
};

// 修改支付方式
export const updatePayType = data => {
  return axios({
    url: `/trade/faPayType/update`,
    method: 'post',
    data
  });
};

// 删除自定义支付方式
export const deletePayType = data => {
  return axios({
    url: `/trade/faPayType/delete/${data.code}`,
    method: 'delete'
  });
};

// 修改支付是否显示状态
export const updatePayTypeShowFlag = data => {
  return axios({
    url: `/trade/faPayTypeCinema/set/showFlag`,
    method: 'post',
    data
  });
};

// 启用/停用支付状态
export const updatePayTypeStatus = params => {
  return axios({
    url: `/trade/faPayTypeCinema/set/status`,
    method: 'post',
    params
  });
};

// 根据支付编码查询支付方式
export const findPayTypeByCode = data => {
  return axios({
    url: `/trade/faPayType/view/${data.code}`,
    method: 'get'
  });
};

// 影院支付方式详情
export const getCinemaPayType = params => {
  return axios({
    url: `/trade/faPayTypeCinema/view`,
    method: 'get',
    params
  });
};

// 获取有效的支付方式编码
export const getPayTypeCode = data => {
  return axios({
    url: `/trade/faPayType/getPayTypeCode`,
    method: 'get',
    data
  });
};

// 通过影院ids获取支付方式
export const selectForTenant = data => {
  return axios({
    url: '/trade/payType/selectForTenant',
    method: 'post',
    data
  });
};
/** * 支付方式 end ***/

/** * 渠道管理 start ***/
// 获取总部渠道列表
export const getChannelList = data => {
  return axios({
    url: `/trade/base/channel/list?page=${data.page}&pageSize=${data.pageSize}`,
    method: 'post',
    data
  });
};
// 获取影院渠道列表
export const getCinemaChannelList = params => {
  return axios({
    url: `/trade/cinema/base/channel/list`,
    method: 'get',
    params
  });
};

export const getChannelOtherList = params => {
  return axios({
    url: `/trade/base/channel/other/list`,
    method: 'get',
    params
  });
};

export const addHeaderChannel = data => {
  return axios({
    url: `/trade/base/channel/add`,
    method: 'post',
    data
  });
};

export const setChannelStatus = params => {
  return axios({
    url: `/trade/base/channel/set/status`,
    method: 'post',
    params
  });
};

export const setChannelCinema = data => {
  return axios({
    url: `/trade/base/channel/set/cinema`,
    method: 'post',
    data
  });
};

export const getChannelDetail = params => {
  return axios({
    url: `/trade/cinema/channel/view`,
    method: 'get',
    params
  });
};

export const addChannelCinema = data => {
  return axios({
    url: `/trade/cinema/channel/add`,
    method: 'post',
    data
  });
};

export const updateChannelCinema = data => {
  return axios({
    url: `/trade/cinema/channel/update`,
    method: 'post',
    data
  });
};
// 获取当前用户信息
export const getUserInfo = params => {
  return axios({
    url: `/trade/common/user`,
    method: 'get',
    params
  });
};
// 查询影院树
export const getCinemaTree = params => {
  return axios({
    url: ' /trade/cinema/tree',
    method: 'get',
    params
  });
};
// 字典数据查询
export const getDictionaryData = params => {
  return axios({
    url: '/trade/dictionary/getByName',
    method: 'get',
    params
  });
};
export const grouponTicketSave = data => {
  return axios({
    url: '/trade/grouponTicket/save',
    method: 'post',
    data
  }).then(res => res);
};
export const grouponTicketQuery = data => {
  return axios({
    url: '/trade/grouponTicket/query',
    method: 'post',
    data
  }).then(res => res);
};
export const grouponTicketView = params => {
  return axios({
    url: '/trade/grouponTicket/view',
    method: 'get',
    params
  }).then(res => res);
};
export const grouponTicketUpdate = data => {
  return axios({
    url: '/trade/grouponTicket/update',
    method: 'post',
    data
  }).then(res => res);
};
export const grouponTicketDelete = params => {
  return axios({
    url: `/trade/grouponTicket/delete/${params}`,
    method: 'delete'
  }).then(res => res);
};
/** * 渠道管理 end ***/

export default {
  // 班次收银管理**start*/
  clearaccountList,
  getCashier,
  getVip,
  getOtherthing,
  getWorker,
  getCreater,
  increaseWorker,
  addIssue,
  clearOne,
  clearTwo,
  clearFinish,
  clearDetail,
  thingDetail,
  actualCash,
  payTotal,
  filmSell,
  goodsSell,
  vipSell,
  ticketSell,
  otherSell,
  adjustList,
  adjustAdd,
  getAdjustSubject,
  exportExcel,
  //* ***end */
  // 订单查询**start*/
  orderList,
  orderWorker,
  payType,
  payDetail,
  getGoodCode,
  //* **end */
  // 领用物品管理查询**start*/
  otherthingsList,
  addOtherthing,
  deleteOtherthing,
  getCinemaByParam,
  //* **end */
  // 抽钞记录**start*/
  getMoneyList,
  getMoneyPerson,
  getMoneyCashier,
  //* **end */
  // 销售地点管理**start*/
  queryPage,
  addressAdd,
  addressChange,
  addressDelete,
  addressDetail,
  changeStatus,
  /** * 销售终端管理 start ***/

  terminalList,
  terminalList2,
  getAddressCode,
  rackAll,
  addressUpdata,
  //* **end */

  /** * 资金科目管理 start ***/
  addSubject,
  delateSubject,
  changeSubject,
  searchSubject,
  //* **end */

  /** * 资金调整单管理 start ***/
  addAdjst,
  searchByCode,
  searchAdjust,
  //* **end */

  // 公共组件方法**start*/
  getDitch,
  getMoudelData,
  //* **end */
  /** * 支付方式 start ***/
  getHeadquartersPayType,
  findPayTypeCinema,
  pullPayTypeToCinema,
  savePayType,
  updatePayType,
  deletePayType,
  updatePayTypeShowFlag,
  updatePayTypeStatus,
  findPayTypeByCode,
  getCinemaPayType,
  getPayTypeCode,
  selectForTenant,
  /** * 支付方式 end ***/

  /** * 渠道管理 start ***/
  getChannelList,
  getCinemaChannelList,
  getChannelOtherList,
  addHeaderChannel,
  setChannelStatus,
  setChannelCinema,
  getChannelDetail,
  addChannelCinema,
  updateChannelCinema,
  getUserInfo,
  getCinemaTree,
  getDictionaryData,
  /** * 渠道管理 end ***/

  /** * 迁移接口 start ***/
  getCategoryTrees,
  goodsDataQueryGoodsList,
  goodsDataQueryCinemaGoodsList,
  listBuyerCondition,
  getCtmUserInfo,
  getByName,
  getCtmCinemaTree
};
