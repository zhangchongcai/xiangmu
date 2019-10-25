import { axios } from 'base';

// 影片数据
export const getFilmData = (pageNum, pageSize, filmName, filmCode) => {
  return axios({
    url: '/report/condition/getFilmCode',
    method: 'get',
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
      filmName: filmName,
      code: filmCode
    }
  });
};

// 控件-影片类型获取数据
export const movieType = () => {
  return axios({
    url: 'report/condition/getDictInfo',
    method: 'get',
    params: {
      code: 'movie_film_film_type'
    }
  });
};

// 交易类型
export const getMoudelData = (page, pageSize, name) => {
  return axios({
    url: `/ticket//dictionary/page?page=${page}&pageSize=${pageSize}&name=${name}`,
    method: 'post'
  });
};

/**
 * @function  - 审批记录
 *
 * @param {Object} data
 * @param {Number} data.atId - id
 *
 */

export const getApprovalrecord = data => {
  return axios({
    url: '/workflow/AuthorizationSearching/approvalTaskFind',
    method: 'post',
    data
  });
};

/**
 * @function  - 检索业务审批
 *
 * @param {Object} data
 * @param {Number} data.pageNo - 数据页数
 * @param {Number} data.pageSize - 数据条数
 * @param {String} data.bizNo - 业务单据号
 * @param {String} data.applyUserName - 申请人名称
 * @param {String} data.bizTypeName - 单据类型名称
 * @param {Array} data.status - 审批状态
 *
 */

export const searchApproval = data => {
  return axios({
    url: '/workflow/AuthorizationSearching/findspAuditBill',
    method: 'post',
    data
  });
};

/**
 * @function  - 检索业务审批
 *
 * @param {Object} data
 * @param {Number} data.pageNo - 数据页数
 * @param {Number} data.pageSize - 数据条数
 * @param {String} data.bizNo - 业务单据号
 * @param {String} data.applyUserName - 申请人名称
 * @param {String} data.bizTypeName - 单据类型名称
 * @param {Array} data.status - 审批状态
 *
 */

export const findspAuditBill = data => {
  return axios({
    url: '/workflow/AuthorizationSearching/findspAuditBillNotJurisdiction',
    method: 'post',
    data
  });
};

/**
 * 票务销售申请单管理 - 票券申请单查询
 *
 * @function findSaleList
 *
 * @param {String} data.applyCode	- 销售申请单号
 * @param {String} data.auditState - 审核状态0-通过，1-不通过;2:未审批
 * @param {String} data.batchCode - 批次号
 * @param {String} data.contractCode	- 合同协议号
 * @param {String} data.couponName - 票券名称
 * @param {String} data.couponTypeCode - 票券类型id
 * @param {String} data.createTimeEnd - 创建时间结束
 * @param {String} data.createTimeStart - 创建时间开始
 * @param {String} data.createUserName - 创建人
 * @param {String} data.custId - 客户id
 * @param {String} data.incomeCinemaId - 入账影院id
 * @param {Number} data.pageNo - 页数
 * @param {Number} data.pageSize - 每页多少条
 * @param {String} data.state - 状态0-未提交,1- 新建,2-已激活,3-已停用,4-已作废,5-已过期,6-已删除,7-验证中
 * @param {String} data.validDateEnd - 验证时间结束
 * @param {String} data.validDateStart - 验证时间开始
 */
export const findSaleList = data => {
  return axios({
    url: '/coupon/apply/query',
    method: 'post',
    data
  });
};

// 获取分类树
export const getCategoryTrees = data => {
  return axios({
    url: '/cim/category/trees',
    method: 'post',
    data
  });
};

// 品牌管理--查询
export const findBrandList = data => {
  return axios({
    url: '/cim/class/brand/query',
    method: 'post',
    data
  });
};

// export const goodsDataQueryGoodsList = data => {
//   return axios({
//     url: 'cim/goodsData/queryGoodsList',
//     // url: 'cim/goodsData/queryMerBySkuInfo',
//     method: 'post',
//     data
//   });
// };

// 首页查询
export const goodsDataQueryCinemaGoodsList = data => {
  return axios({
    // baseURL: config.baseURL,
    url: '/cim/goodsData/queryCinemaGoodsList',
    method: 'post',
    data
  });
};

export const getCardTypeList = params => {
  // 会员卡类型列表
  return axios({
    url: '/member/cardproduct/list',
    method: 'get',
    params
  });
};

export const getCardType = params => {
  // 卡类型下拉列表
  return axios({
    url: '/member/cardproduct/type/list',
    method: 'get',
    params
  });
};

/* --------- 会员等级成长值 start --------- */
export const getLevelDetail = params => {
  // 会员等级查看
  return axios({
    url: '/member/level/detail',
    method: 'get',
    params
  });
};

// ==================================================================================================
/**
 * 将所有接口统一起来便于维护
 * 如果项目很大可以将 URL 独立成文件，接口分成不同的模块
 */

// 影票活动管理接口
/**
    @function marketingList -查询营销活动列表

    @param {object} searchVo
    @param {String} searchVo.autoShow
    @param {String} searchVo.businessCode -交易商户编码
    @param {String} searchVo.ruleTemplateId	规则模板id	number	多个用，间隔； 列值为：1-商品特价促销 2-加价换购 3-买赠/买购促销 4-商品组合促销 6-会员充值促销 7-会员消费返积分促销 8-会员消费返券促销 9-会员消费返现促销 10-套餐 11-会员营销活动 12-高级消费活动 13-会员开卡活动
    @param {String} searchVo.searchActivityCode - 活动编码
    @param {String} searchVo.searchActivityName - 活动名称
    @param {String} searchVo.searchApprovalmanId	 - 审核人
    @param {String} searchVo.searchCreaterId	 - 创建人
    @param {String} searchVo.searchState	 - 活动状态
    @param {String} searchVo.searchValidDateEnd	- 活动结束时间
    @param {String} searchVo.searchValidDateStart - 活动开始时间
    @param {String} searchVo.tenantId - 租户id
    @param {Number} searchVo.pageNo
    @param {Number} searchVo.pageSize
*/
export const marketingList = data => {
  return axios({
    url: '/marketing/listMarketingActivity',
    method: 'post',
    data
  });
};

/**
 * @function marketingDel -删除营销活动
 *
 * @param {Object } params
 * @param {Number } params.id - 营销活动id
 * @param {String } params.tenantId - 租户id
 */
export const marketingDel = params => {
  return axios({
    url: '/marketing/delete',
    method: 'post',
    params
  });
};

/**
 * @function marketingEnableOrDisabl -启用/停用营销活动
 *
 * @param {Object } params
 * @param {Number } params.accountId - 账户id
 * @param {Number } params.id - 营销活动id
 * @param {String } params.tenantId - 租户id
 * @param {String } params.remark - 备注
 *
 */
export const marketingEnableOrDisabl = params => {
  return axios({
    url: '/marketing/enableOrDisable',
    method: 'post',
    params
  });
};

/**
 * @function marketingAdd -保存或更新营销活动
 *
 * @param {Object } params
 *
 * @param {String } params.deleteIds - 要删除的ids('1,2,3,4')
 * @param {Object } params.marketingActivityVO
 * @param {String } params.marketingActivityVO.activityCode - 活动编码(新建时为空)
 * @param {String } params.marketingActivityVO.activityDesc - 活动描述
 * @param {String } params.marketingActivityVO.activityName - 活动名称
 * @param {Number } params.marketingActivityVO.activityState - 活动状态 1:新建(审批不通过),2：锁定,3：(审批通过)执行中,4：暂停,5：作废
 * @param {String } params.marketingActivityVO.executeMode - 执行模式 值为:AUTO_MATCH，AUTO_MATCH_RECOMMEND，OTHER
 * @param {String } params.marketingActivityVO.flag - 提交审批标识 是否同时提交审批，2是
 * @param {Number } params.marketingActivityVO.id - 活动ID
 * @param {String } params.marketingActivityVO.ruleGroup
 * @param {Number } params.marketingActivityVO.ruleTemplateId - 规则模板id
 * @param {String } params.marketingActivityVO.tenantId - 租户id
 * @param {String } params.marketingActivityVO.validDateEnd - 有效时间
 * @param {String } params.marketingActivityVO.validDateEnd - 有效时间
 *
 *
 */
export const marketingAdd = data => {
  // console.log(data)
  let datas = JSON.stringify(data);
  // console.log(datas)
  return axios({
    url: '/marketing/saveActivitySimple',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    dataType: 'json',
    data: datas
  });
};

/**
 * @function marketingValActivityName - 验证营销活动名称
 * @param {Object} data
 * @param {String} data.flag - 校验码 是否要校验其他情况，如修订的时候需要校验其他新建情况。1为需要校验
 * @param {Number} data.id - 营销活动id
 * @param {String} data.name - 营销活动名称
 * @param {String} data.tenantId - 租户id
 *
 */
export const marketingValActivityName = data => {
  return axios({
    url: '/marketing/valActivityName',
    method: 'post',
    data
  });
};

/**
 * @function marketingViewActivity - 查看营销活动
 *
 * @param {Object} data
 * @param {Number} data.activityId - 营销活动id
 * @param {String} data.tenantId - 租户id
 *
 */
export const marketingViewActivity = data => {
  return axios({
    url: '/marketing/viewActivitySimple',
    method: 'post',
    data
  });
};

/**
 * @function marketingSubmitAudit - 提交审核营销活动
 *
 * @param {Object} data
 * @param {Number} data.id - 营销活动id
 * @param {String} data.tenantId - 租户id
 *
 */
export const marketingSubmitAudit = params => {
  return axios({
    url: '/marketing/submitAudit',
    method: 'post',
    params
  });
};

/**
 * @function payType - 提交审核营销活动
 *
 * @param {Object} data
 * @param {Number} data.tenantId - 租户id
 * @param {Number} data.current - 当前页码
 * @param {Number} data.pageSize - 页面大小
 *
 */

export const payType = params => {
  return axios({
    url: '/ticket/payType/listPayType',
    method: 'get',
    params
  });
};
export const querySalePlace = data => {
  return axios({
    url: '/cim/singleProduct/querySalePlace ',
    method: 'post',
    data
  });
};

/**
 * @function createApproval - 创建审批单
 *
 *
 *
 *
 *
 *
 */
// export const createApproval = data => {
//     return axios({
//         url: '/workflow/AuthorizationSearching/findspAuditBill ',
//         method: 'post',
//         data
//     })
// }

/**
 * @function payType - 获取影院行政区域
 *
 * @param {Object} data
 * @param {Number} data.placeName -  可空，模糊匹配，销售地点名称
 * @param {Number} data.code - 可空，精确匹配，销售地点编码
 * @param {Number} data.pageNum - 可空，默认1，当前页数
 * @param {Number} data.pageSize - 可空，默认10000，每页记录数
 * @param {Number} data.cinemaUid - 可空，精确匹配，影院UID
 * @param {Number} data.status - 可空，精确匹配，状态，0：停用，1：启用
 *
 */

export const getCinemaAdminRegionList = data => {
  return axios({
    url: '/ticket/salePlace/page',
    method: 'post',
    data
  });
};

/**
 * @function getCinemaList - 获取影院列表
 *
 * @param {Object} data
 * @param {Number} data.userUid -  用户uid
 * @param {Number} data.code 影院编码
 * @param {Number} data.pageNum - 页数
 * @param {Number} data.pageSize - 每页记录数
 * @param {Number} data.fullName -影院名
 *
 */

export const getCinemaList = data => {
  return axios({
    url: '/common/cinema/getAuthCinemasByUserUid',
    method: 'post',
    data
  });
};

/**
 * @function getCinemaProjectionEffectList - 获取放映效果
 * @param {Object} data
 * @param {Number} data.userUid -  用户uid
 * @param {Number} data.code 影院编码
 * @param {Number} data.pageNum - 页数
 * @param {Number} data.pageSize - 每页记录数
 * @param {Number} data.fullName -影院名
 *
 */

export const getCinemaProjectionEffectList = data => {
  return axios({
    url: 'common/dict/getDictInfo',
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

/**
 * @function getChannelList - 获取交易渠道、交易客商
 * @param {Object} data
 * @param {Number} data.name -  渠道名字
 * @param {Number} data.code -渠道编码
 * @param {Number} data.pageNum - 页数
 * @param {Number} data.pageSize - 每页记录数
 * @param {Number} data.channelNature -类型 1：是交易渠道（自营渠道） 2：是交易客商 （第三方渠道）
 * @param {Number} data.tenantId -租户id
 *
 */

export const getChannelList = params => {
  return axios({
    url: 'ticket/base/channel/findByTenantId',
    method: 'get',
    params
  });
};

// 用户
export const getUser = data => {
  return axios({
    url: '/common/user/listUserByCondition',
    method: 'post',
    data
  });
};

// 组织结构模块
export const organizationList = params => {
  return axios({
    url: '/common/consumer/listOrganizationMessage',
    method: 'post',
    params
  });
};

// 角色管理
export const roleList = data => {
  return axios({
    url: '/common/role/listCustomerRoleByRequirements',
    method: 'post',
    data
  });
};

export default {
  // 影票活动管理接口
  marketingList,
  marketingDel,
  marketingEnableOrDisabl,
  marketingAdd,
  marketingValActivityName,
  marketingViewActivity,
  marketingSubmitAudit,
  // 支付接口
  payType,
  querySalePlace,
  // 影院接口
  getCinemaAdminRegionList,
  getCinemaList,
  getCinemaProjectionEffectList,
  // 卖品接口
  goodsDataQueryGoodsList,
  getChannelList,
  // 公共接口
  getUser,
  organizationList,
  roleList,

  // 其它模块迁移接口
  getFilmData,
  movieType,
  getMoudelData,
  getApprovalrecord,
  searchApproval,
  findspAuditBill,
  findSaleList,
  getCategoryTrees,
  findBrandList,
  goodsDataQueryCinemaGoodsList,
  getCardTypeList,
  getCardType,
  getLevelDetail
};
