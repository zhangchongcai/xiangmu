import axios from './api';

// import baseFactory from 'base';
const baseFactory = requireModule('base');
// console.log(baseFactory);
const baseAxios = baseFactory.axios;

// 获取分类树
export const getCategoryTrees = data => {
  return baseAxios({
    url: '/cim/category/trees',
    method: 'post',
    data
  });
};

export const goodsDataQueryGoodsList = data => {
  return baseAxios({
    // baseURL: config.baseURL,
    url: '/cim/goodsData/queryGoodsList',
    method: 'post',
    data
  });
};

// 首页查询
export const goodsDataQueryCinemaGoodsList = data => {
  return baseAxios({
    // baseURL: config.baseURL,
    url: '/cim/goodsData/queryCinemaGoodsList',
    method: 'post',
    data
  });
};

// 通过影院ids获取支付方式
export const selectForTenant = data => {
  return baseAxios({
    url: '/trade/payType/selectForTenant',
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
  return baseAxios({
    url: '/common/buyer/listBuyerCondition',
    method: 'post',
    data
  });
};

/**
 *  组织结构树   用途  -入账影院
 *
 * @function getOrgTreeAndCinema
 * @param uid  -localStore use的uid
 */

export const getOrgTreeAndCinema = data => {
  return baseAxios({
    url: '/common/consumer/getOrgAndCinemaTree',
    method: 'post',
    data
  });
};

/**
 * 票卷批次记录弹窗
 *
 * @function alertSaleList
 */

export const alertSaleList = data => {
  return baseAxios({
    url: 'coupon/apply/query',
    method: 'post',
    data
  });
};

// ========================================================

/**
 * 将所有接口统一起来便于维护
 * 如果项目很大可以将 URL 独立成文件，接口分成不同的模块
 */
/** 接口处理示例 */
var modelUrl = '/member';
export const membercardList = params => {
  // 会员卡列表
  return axios({
    url: modelUrl + '/membercard/list',
    method: 'get',
    params
  });
};
export const cardproductList = params => {
  // 会员卡类型列表
  return axios({
    url: modelUrl + '/cardproduct/list',
    method: 'get',
    params
  });
};
export const rcardStatus = params => {
  // 改变会员卡状态
  return axios({
    url: modelUrl + '/membercard/frozen',
    method: 'get',
    params
  });
};
export const memberCardDetail = params => {
  // 会员卡详情
  return axios({
    url: modelUrl + '/membercard/getMemberCard',
    method: 'get',
    params
  });
};
export const cardflowList = params => {
  // 会员卡交易记录
  return axios({
    url: modelUrl + '/cardflow/list',
    method: 'get',
    params
  });
};
export const cardbatchList = params => {
  // 实体卡列表
  return axios({
    url: modelUrl + '/cardbatch/list',
    method: 'get',
    params
  });
};
export const cardbatchExport = params => {
  // 卡批次导出Excel
  return axios({
    url: modelUrl + '/cardbatch/export',
    method: 'get',
    params
  });
};

export const memberListPage = params => {
  // 会员列表
  return axios({
    url: modelUrl + '/member/listPage',
    method: 'get',
    params
  });
};
export const memberBasicDetail = params => {
  // 会员详情接口 --基础信息
  return axios({
    url: modelUrl + '/member/detail',
    method: 'get',
    params
  });
};
// export const memberDetailStored = params => {
//   //会员详情接口 --储值
//   return axios({
//     url: modelUrl +"/api/member/listPageMemberAccountFlow",
//     method: "get",
//     params
//   });
// };
export const memberDetailConsumption = params => {
  // 会员详情接口 --消费
  return axios({
    url: modelUrl + '/cardflow/list',
    method: 'get',
    params
  });
};

export const cardbatchAdd = data => {
  // 添加会员卡
  return axios({
    url: modelUrl + '/cardbatch/add',
    method: 'post',
    data
  });
};
export const memberLogListPage = params => {
  // 会员变更历史/操作日志
  return axios({
    url: modelUrl + '/log/listPage',
    method: 'get',
    params
  });
};
export const getLevelEquityByLevelCode = data => {
  // 根据等级编号获取等级权益
  return axios({
    url: modelUrl + '/levelEquity/getLevelEquityByLevelCode',
    method: 'post',
    data
  });
};
/* --------- 卡政策管理 start ---------- */
export const setDefaultCard = params => {
  // 设置储值卡默认卡政策
  return axios({
    url: modelUrl + '/cardproduct/setDefaultCard',
    method: 'get',
    params
  });
};

export const getCardTypeList = params => {
  // 会员卡类型列表
  return axios({
    url: modelUrl + '/cardproduct/list',
    method: 'get',
    params
  });
};

export const changeCardTypeStatus = data => {
  // 会员卡类型列表
  return axios({
    url: modelUrl + '/cardproduct/status',
    method: 'post',
    data
  });
};

export const getCardTypeDetail = params => {
  // 会员卡类型列表
  return axios({
    url: modelUrl + '/cardproduct/detail',
    method: 'get',
    params
  });
};

export const getCardType = params => {
  // 卡类型下拉列表
  return axios({
    url: modelUrl + '/cardproduct/type/list',
    method: 'get',
    params
  });
};

export const getCardStatus = params => {
  // 卡状态下拉列表
  return axios({
    url: modelUrl + '/cardproduct/status/list',
    method: 'get',
    params
  });
};

export const cardTypeNameIsExist = params => {
  // 卡政策名称唯一性
  return axios({
    url: modelUrl + '/cardproduct/check/name',
    method: 'get',
    params
  });
};

export const addCardType = data => {
  // 会员卡类型添加
  return axios({
    url: modelUrl + '/cardproduct/add',
    method: 'post',
    data
  });
};

/* --------- 卡政策管理 end ---------- */

export const channelList = params => {
  // 会员全部来源
  return axios({
    url: modelUrl + '/member/channelList',
    method: 'get',
    params
  });
};
export const cardTypeList = params => {
  // 获取卡类型下拉菜单
  return axios({
    url: modelUrl + '/cardproduct/type/list',
    method: 'get',
    params
  });
};
export const checkStatus = params => {
  // 卡批次状态检查
  return axios({
    url: modelUrl + '/cardbatch/check/status',
    method: 'get',
    params
  });
};
export const screenList = params => {
  // 获取适用制式
  return axios({
    url: modelUrl + '/cardproduct/screen/list',
    method: 'get',
    params
  });
};
export const screenList1 = params => {
  // 获取适用制式
  return axios({
    url: modelUrl + '/cardproduct/screen/list1',
    method: 'get',
    params
  });
};
export const hallList = params => {
  // 获取适用影厅
  return axios({
    url: modelUrl + '/cardproduct/hall/list',
    method: 'get',
    params
  });
};
export const getcardTypeInfo = params => {
  // 获取卡详情
  return axios({
    url: modelUrl + '/cardproduct/detail',
    method: 'get',
    params
  });
};
export const editcardTypeInfo = data => {
  // 修改卡政策
  return axios({
    url: modelUrl + '/cardproduct/edit',
    method: 'post',
    data
  });
};
/* --------- 自有卡权益 ---------- */
export const addOwnRights = data => {
  // 添加自有权益卡
  return axios({
    url: modelUrl + '/equity/add',
    method: 'post',
    data
  });
};
export const editOwnRights = data => {
  // 修改自有权益卡
  return axios({
    url: modelUrl + '/equity/edit',
    method: 'post',
    data
  });
};
export const getOwnrightsInfo = params => {
  // 修改自有权益卡
  return axios({
    url: modelUrl + '/equity/detail',
    method: 'get',
    params
  });
};
export const chekckEquitynameIsexist = params => {
  // 查看权益卡名称唯一性
  return axios({
    url: modelUrl + '/equity/name/isexist',
    method: 'get',
    params
  });
};
export const getEquityList = params => {
  // 查看权益卡列表
  return axios({
    url: modelUrl + '/equity/list',
    method: 'get',
    params
  });
};
export const changeEquityCardStatus = data => {
  // 启动停用卡权益
  return axios({
    url: modelUrl + '/equity/status',
    method: 'post',
    data
  });
};

/* --------- 自有卡权益 ---------- */

/* --------- 联名卡商户管理 start --------- */
export const getjointNameCardList = params => {
  // 获取联名商户管理列表
  return axios({
    url: modelUrl + '/merchant/listPage',
    method: 'get',
    params
  });
};

export const editjointNameCardInfo = data => {
  // 修改联名卡商户（包括开停售）
  return axios({
    url: modelUrl + '/merchant/edit',
    method: 'post',
    data
  });
};

export const getMerchantInfo = params => {
  // 获取联名商户详情
  return axios({
    url: modelUrl + '/merchant/getMerchantInfo',
    method: 'get',
    params
  });
};

export const addjointNameCardMerchant = data => {
  // 添加联名卡商户
  return axios({
    url: modelUrl + '/merchant/add',
    method: 'post',
    data
  });
};

export const checkIfNameRepeat = params => {
  // 联名卡商户名称重复校验
  return axios({
    url: modelUrl + '/merchant/checkIfNameRepeat',
    method: 'get',
    params
  });
};
/* --------- 联名卡商户管理 end --------- */
/* --------- 异业商品类型 start --------- */

export const diffCommodityTypeAdd = data => {
  // 添加异业商品类型
  return axios({
    url: modelUrl + '/diff/commodityType/add',
    method: 'post',
    data
  });
};
export const diffCommodityTypeedit = data => {
  // 添加异业商品类型
  return axios({
    url: modelUrl + '/diff/commodityType/edit',
    method: 'post',
    data
  });
};
export const diffCommodityTypeNameIsexist = params => {
  // 异业商品类型NAME是否存在
  return axios({
    url: modelUrl + '/diff/commodityType/name/isexist',
    method: 'get',
    params
  });
};
export const diffCommodityTypeList = params => {
  // 异业商品类型列表
  return axios({
    url: modelUrl + '/diff/commodityType/list',
    method: 'get',
    params
  });
};
export const diffCommodityDetail = params => {
  // 异业商品类型详情
  return axios({
    url: modelUrl + '/diff/commodityType/detail',
    method: 'get',
    params
  });
};
/* --------- 异业商品类型  end --------- */

/* --------- 异业权益类型  strat --------- */
export const getdiffEquityList = params => {
  // 异业权益列表
  return axios({
    url: modelUrl + '/diff/equity/list',
    method: 'get',
    params
  });
};
export const getdiffEquityDetail = params => {
  // 异业权益详情
  return axios({
    url: modelUrl + '/diff/equity/detail',
    method: 'get',
    params
  });
};
export const diffEquityStatus = data => {
  // 启动停用卡权益
  return axios({
    url: modelUrl + '/diff/equity/status',
    method: 'post',
    data
  });
};
/* --------- 异业权益类型  end --------- */

/* --------- 会员等级成长值 start --------- */
export const getLevelDetail = params => {
  // 会员等级查看
  return axios({
    url: modelUrl + '/level/detail',
    method: 'get',
    params
  });
};

export const editMemberLevel = data => {
  // 会员等级编辑
  return axios({
    url: modelUrl + '/level/edit',
    method: 'post',
    data
  });
};

export const isExistMemberByLevelNo = params => {
  // 判断该等级下是否有会员
  return axios({
    url: modelUrl + '/level/isExistMemberByLevelNo',
    method: 'get',
    params
  });
};

/* --------- 会员等级成长值 end --------- */
/* --------- 异业商品 start --------- */
export const goodsNameIsExist = params => {
  // 异业商品名称唯一性
  return axios({
    url: modelUrl + '/diff/goods/name/isexist',
    method: 'get',
    params
  });
};
export const addDiffGoods = data => {
  // 添加异业商品
  return axios({
    url: modelUrl + '/diff/goods/add',
    method: 'post',
    data
  });
};
export const diffGoodsDetailList = params => {
  // 异业商品明细列表
  return axios({
    url: modelUrl + '/diff/goods/detail/list',
    method: 'get',
    params
  });
};

/* --------- 异业商品 end --------- */
/* --------- 异业商品 start --------- */
// 异业商品名称唯一性
export const editDiffGoods = data => {
  // 修改异业商品
  return axios({
    url: modelUrl + '/diff/goods/edit',
    method: 'post',
    data
  });
};
export const diffGoodsUpdateStatus = data => {
  // 修改商品状态
  return axios({
    url: modelUrl + '/diff/goods/update/status',
    method: 'post',
    data
  });
};
export const diffGoodsList = params => {
  // 异业商品列表
  return axios({
    url: modelUrl + '/diff/goods/list',
    method: 'get',
    params
  });
};
export const diffGoodsDetail = params => {
  // 异业商品详情
  return axios({
    url: modelUrl + '/diff/goods/detail',
    method: 'get',
    params
  });
};
export const diffGoodsRefill = data => {
  // 修改商品状态
  return axios({
    url: modelUrl + '/diff/goods/refill',
    method: 'post',
    data
  });
};
/* --------- 异业商品 end --------- */
/* --------- 异业权益 start --------- */
export const diffEquityNameIsexist = params => {
  // 异业权益名称唯一性
  return axios({
    url: modelUrl + '/diff/equity/name/isexist',
    method: 'get',
    params
  });
};
export const diffEquityDetail = params => {
  // 异业权益详情
  return axios({
    url: modelUrl + '/diff/equity/detail',
    method: 'get',
    params
  });
};
export const diffEquityAdd = data => {
  // 添加异业权益
  return axios({
    url: modelUrl + '/diff/equity/add',
    method: 'post',
    data
  });
};
export const diffEquityEdit = data => {
  // 修改异业权益
  return axios({
    url: modelUrl + '/diff/equity/edit',
    method: 'post',
    data
  });
};
/* --------- 异业权益 end --------- */
/* --------- 会员标签 start --------- */
export const editMessageTimeSpan = params => {
  // 编辑发送短信时间间隔
  return axios({
    url: modelUrl + '/label/editMessageTimeSpan',
    method: 'get',
    params
  });
};
export const getMessageTimeSpan = params => {
  // 查看发送短信时间间隔
  return axios({
    url: modelUrl + '/label/getMessageTimeSpan',
    method: 'get',
    params
  });
};
export const sendLabelMessage = params => {
  // 发送短信
  return axios({
    url: modelUrl + '/label/sendLabelMessage',
    method: 'get',
    params
  });
};
export const labelMessageListPage = params => {
  // 营销短信列表查询
  return axios({
    url: modelUrl + '/label/messageListPage',
    method: 'get',
    params
  });
};
export const resendLabelMessageList = data => {
  // 再次发送短信（重发短信）
  return axios({
    url: modelUrl + '/label/resendLabelMessageList',
    method: 'post',
    data
  });
};
export const labelCheckIfNameRepeat = params => {
  // 会员标签名称重复校验
  return axios({
    url: modelUrl + '/label/checkIfNameRepeat',
    method: 'get',
    params
  });
};
export const labelAdd = data => {
  // 会员标签新增
  return axios({
    url: modelUrl + '/label/add',
    method: 'post',
    data
  });
};
export const labelGetDetail = params => {
  // 会员标签查看
  return axios({
    url: modelUrl + '/label/get',
    method: 'get',
    params
  });
};
export const labelEdit = data => {
  // 会员标签编辑/删除/是否在pos端显示
  return axios({
    url: modelUrl + '/label/edit',
    method: 'post',
    data
  });
};
export const labelListPage = params => {
  // 会员标签列表查询
  return axios({
    url: modelUrl + '/label/labelListPage',
    method: 'get',
    params
  });
};
export const couponList = params => {
  // 可用券名称列表
  return axios({
    url: modelUrl + '/coupon/list',
    method: 'get',
    params
  });
};

/* --------- 会员标签 end --------- */

/* --------- 会员等级权益管理 start --------- */
export const levelEquityList = params => {
  // 获取会员等级权益列表
  return axios({
    url: modelUrl + '/levelEquity/getLevelEquity',
    method: 'post',
    params
  });
};
export const addLevelEquity = data => {
  // 编辑会员等级权益
  return axios({
    url: modelUrl + '/levelEquity/add',
    method: 'post',
    data
  });
};
/* --------- 会员等级权益管理 end --------- */

/* --------- 积分查询 start --------- */
export const getIntegralQueryList = data => {
  // 获取积分查询列表
  return axios({
    url: modelUrl + '/integral/account/getPageList',
    method: 'post',
    data
  });
};
export const adjustIntegral = data => {
  // 积分调整接口
  return axios({
    url: modelUrl + '/integral/account/adjustIntegral',
    method: 'post',
    data
  });
};
/* --------- 积分查询 end --------- */

/* --------- 积分交易记录 start --------- */
export const getIntegralTradeRecordList = data => {
  // 获取积分查询列表
  return axios({
    url: modelUrl + '/integral/accountFlow/getPageList',
    method: 'post',
    data
  });
};
export const getIntegralTradeRecordDetail = params => {
  // 获取积分交易详情
  return axios({
    url: modelUrl + '/integral/accountFlow/detail',
    method: 'post',
    params
  });
};
/* --------- 积分交易记录 end --------- */
/* --------- 创建积分获取规则 start --------- */
export const getIntegralRulesList = params => {
  // 获取创建积分获取规则列表
  return axios({
    url: modelUrl + '/integral/rule/getDetail',
    method: 'post',
    params
  });
};
export const commitIntegralRulesList = data => {
  // 保存创建积分获取规则列表
  return axios({
    url: modelUrl + '/integral/rule/save',
    method: 'post',
    data
  });
};

/* --------- 创建积分获取规则 end --------- */
/* --------- 领用会员卡 start ------------ */

export const receiveList = params => {
  // 领用会员卡批次列表
  return axios({
    url: modelUrl + '/cardbatch/receiveList',
    method: 'get',
    params
  });
};
export const receiveCardPoolList = params => {
  // 领用会员卡池列表
  return axios({
    url: modelUrl + '/cardbatch/receiveCardPoolList',
    method: 'get',
    params
  });
};
export const receiveBtach = data => {
  // 领用退还会员卡
  return axios({
    url: modelUrl + '/cardbatch/receiveBtach',
    method: 'post',
    data
  });
};
/* --------- 领用会员卡 end -------------- */

export default {
  isExistMemberByLevelNo,
  setDefaultCard,
  couponList,
  labelListPage,
  labelEdit,
  labelGetDetail,
  labelAdd,
  labelCheckIfNameRepeat,
  resendLabelMessageList,
  labelMessageListPage,
  sendLabelMessage,
  getMessageTimeSpan,
  editMessageTimeSpan,
  diffGoodsRefill,
  diffGoodsDetailList,
  memberLogListPage,
  diffGoodsUpdateStatus,
  editDiffGoods,
  diffGoodsDetail,
  diffEquityStatus,
  diffEquityEdit,
  diffEquityAdd,
  diffEquityDetail,
  diffGoodsList,
  diffEquityNameIsexist,
  addDiffGoods,
  goodsNameIsExist,
  getLevelDetail,
  editMemberLevel,
  diffCommodityTypeedit,
  diffCommodityDetail,
  diffCommodityTypeNameIsexist,
  diffCommodityTypeList,
  diffCommodityTypeAdd,
  checkIfNameRepeat,
  addjointNameCardMerchant,
  getMerchantInfo,
  editjointNameCardInfo,
  getjointNameCardList,
  getOwnrightsInfo,
  addOwnRights,
  editOwnRights,
  changeEquityCardStatus,
  getEquityList,
  chekckEquitynameIsexist,
  editcardTypeInfo,
  getcardTypeInfo,
  hallList,
  screenList,
  screenList1,
  memberListPage,
  memberBasicDetail,
  // memberDetailStored,
  memberDetailConsumption,
  cardproductList,
  cardbatchAdd,
  membercardList,
  rcardStatus,
  memberCardDetail,
  cardflowList,
  cardbatchList,
  cardbatchExport,
  getCardTypeList,
  changeCardTypeStatus,
  getCardTypeDetail,
  channelList,
  getCardType,
  getCardStatus,
  cardTypeList,
  checkStatus,
  cardTypeNameIsExist,
  addCardType,
  getdiffEquityList,
  getdiffEquityDetail,
  // 会员等级权益管理
  levelEquityList,
  addLevelEquity,
  // 积分查询
  getIntegralQueryList,
  adjustIntegral,
  // 积分交易记录
  getIntegralTradeRecordList,
  getIntegralTradeRecordDetail,
  // 创建积分获取规则
  getIntegralRulesList,
  commitIntegralRulesList,
  receiveList,
  receiveCardPoolList,
  receiveBtach,
  getLevelEquityByLevelCode,

  // 其它模块迁移
  getCategoryTrees,
  goodsDataQueryGoodsList,
  goodsDataQueryCinemaGoodsList,
  selectForTenant,
  alertSaleList,
  listBuyerCondition,
  getOrgTreeAndCinema
};
