import { axios } from 'base';
// 首页/票房
const BoxOfficeData = data => {
  return axios({
    url: '/analysis/home/initBoxOffice',
    method: 'post',
    data
  });
};
// 首页/卖品分析
const GoodsData = data => {
  return axios({
    url: '/analysis/home/initSellGoods',
    method: 'post',
    data
  });
};
// 首页更新时间
const getCurrentTime = data => {
  return axios({
    url: '/analysis/home/getCurrentTime',
    method: 'post',
    data
  });
};
// 首页/会员
const MemberData = data => {
  return axios({
    url: '/analysis/home/initMember',
    method: 'post',
    data
  });
};
// 首页/票房分页
const BoxPager = data => {
  return axios({
    url: '/analysis/home/boxOfficeByPage',
    method: 'post',
    data
  });
};
// 首页/卖品分页
const GoodsPager = data => {
  return axios({
    url: '/analysis/home/sellGoodsByPage',
    method: 'post',
    data
  });
};
// 首页/会员分页
const MemberPager = data => {
  return axios({
    url: '/analysis/home/memberByPage',
    method: 'post',
    data
  });
};
// 票房/指标切换
const SwitchBoxOfficeTab = data => {
  return axios({
    url: '/analysis/home/switchBoxOffice',
    method: 'post',
    data
  });
};
// 卖品/指标切换
const SwitchSellGoodsTab = data => {
  return axios({
    url: '/analysis/home/switchSellGoods',
    method: 'post',
    data
  });
};
// 会员/指标切换
const SwitchMemberTab = data => {
  return axios({
    url: '/analysis/home/switchMember',
    method: 'post',
    data
  });
};

// 卖品分析/指标
const SaleData = data => {
  return axios({
    url: '/analysis/sellGoods/init',
    method: 'post',
    data
  });
};
// 卖品分析/切换指标
const switchTarget = data => {
  return axios({
    url: '/analysis/sellGoods/sellsGoodSaleTend',
    method: 'post',
    data
  });
};
// 卖品分析/渠道/品类
const SaleChannelData = data => {
  return axios({
    url: '/analysis/sellGoods/initChannelAndCategory',
    method: 'post',
    data
  });
};
// 卖品分析/渠道/品类/切换
const switchChannel = data => {
  return axios({
    url: '/analysis/sellGoods/channelDistributionTrend',
    method: 'post',
    data
  });
};
// 卖品分析/销售表现
const SaleGoodsData = data => {
  return axios({
    url: '/analysis/sellGoods/list',
    method: 'post',
    data
  });
};
// 卖品分析/城市体明细分页
const cityTabelData = data => {
  return axios({
    url: '/analysis/sellGoods/selectByPage',
    method: 'post',
    data
  });
};
// 卖品分析/ 影院明细分页
const cinemaTableData = data => {
  return axios({
    url: '/analysis/sellGoods/selectByPage',
    method: 'post',
    data
  });
};
// 卖品分析/ 指标概览
const saleTargetView = data => {
  return axios({
    url: '/analysis/sellGoods/querySellGoodsIndicator',
    method: 'post',
    data
  });
};
// 卖品分析 /指标概览弹窗
const saleTargetBinding = data => {
  return axios({
    url: '/analysis/sellGoods/queryIndicatorBindings',
    method: 'post',
    data
  });
};
// 卖品分析 /指标设置保存
const saleTargetSave = data => {
  return axios({
    url: '/analysis/sellGoods/saveIndicatorBindings',
    method: 'post',
    data
  });
};
// 进销存页面 /商品分类的api
const categoryList = data => {
  return axios({
    url: '/analysis/sellGoods/psi/selectCategoryList',
    method: 'post',
    data
  });
};
// 进销存页面/ 供应商
const suppliersList = data => {
  return axios({
    url: '/analysis/sellGoods/psi/selectSupplyList',
    method: 'post',
    data
  });
};
// 进销存页面/ 整体数据
const inoutData = data => {
  return axios({
    url: '/analysis/sellGoods/psi/init',
    method: 'post',
    data
  });
};

// 进销存页面/列表明细
const inoutTable = data => {
  return axios({
    url: '/analysis/sellGoods/psi/selectDetailByPage',
    method: 'post',
    data
  });
};
// 集团kpi/列表
const getCinemaKpi = data => {
  return axios({
    url: '/analysis/cinemaManage/queryCinemaKpi',
    method: 'post',
    data
  });
};
// 集团kpi /未绑定kip的影院列表
const getUnbindKpiCinema = data => {
  return axios({
    url: '/analysis/cinemaManage/queryNewCinemaInfo',
    method: 'post',
    data
  });
};
// 集团kpi/创建
const createKpi = data => {
  return axios({
    url: '/analysis/cinemaManage/insertCinemaKpi',
    method: 'post',
    data
  });
};

// 集团kpi/更新
const updateKpi = data => {
  return axios({
    url: '/analysis/cinemaManage/modifyCinemaKpi',
    method: 'post',
    data
  });
};
// 集团kpi/删除
const deleteKpi = data => {
  return axios({
    url: '/analysis/cinemaManage/deleteCinemaKpi',
    method: 'post',
    data
  });
};

// 影院管理/ 查询已绑定竞对影院
const getBindingCinemaList = data => {
  return axios({
    url: '/analysis/cinemaManage/queryCompetesBinding',
    method: 'post',
    data
  });
};
// 影院管理/ 删除已绑定的竞对影院
const deleteCompeteBind = data => {
  return axios({
    url: '/analysis/cinemaManage/deleteCompetesBinding',
    method: 'post',
    data
  });
};
// 影院管理/ 查询我的影院
const getCinemaList = data => {
  return axios({
    url: '/analysis/cinemaManage/queryCinemaList',
    method: 'post',
    data
  });
};
// 影院管理/ 查询竞对影院列表（未绑定弹窗）
const getCompeteCinema = data => {
  return axios({
    url: '/analysis/cinemaManage/queryCompeteList',
    method: 'post',
    data
  });
};
// 影院管理/ 添加竞对影院（未绑定弹窗）
const addCompeteCinema = data => {
  return axios({
    url: '/analysis/cinemaManage/addCompeteBinding',
    method: 'post',
    data
  });
};
// 影院管理/ 竞对影院上/下移动
const sortCompeteCinema = data => {
  return axios({
    url: '/analysis/cinemaManage/sortCompeteBinding',
    method: 'post',
    data
  });
};
// 卖品规则管理 / 品类选择
const cagegoryList = data => {
  return axios({
    url: '/analysis/cinemaManage/getCategoryList',
    method: 'post',
    data
  });
};
// 卖品规则 / 卖品规则列表
const getRuleList = data => {
  return axios({
    url: '/analysis/cinemaManage/getCategoryRuleInfoList',
    method: 'post',
    data
  });
};
// 卖品规则 / 规则停用/启用
const switchRuleStatus = data => {
  return axios({
    url: '/analysis/cinemaManage/updateCategoryRuleInfo',
    method: 'post',
    data
  });
};
// 卖品规则 / 修改卖品规则
const updateRuleInfo = data => {
  return axios({
    url: '/analysis/cinemaManage/saveCategoryRuleInfo',
    method: 'post',
    data
  });
};

// 会员概况 /查询指标
const memberTarget = data => {
  return axios({
    url: '/analysis/member/queryIndicatorView',
    method: 'post',
    data
  });
};
// 会员概况 /指标弹窗
const memberTargetAll = data => {
  return axios({
    url: '/analysis/member/queryIndicatorCodes',
    method: 'post',
    data
  });
};
// 会员概况 / 保存指标
const memberSaveTarget = data => {
  return axios({
    url: '/analysis/member/saveIndicatorBindings',
    method: 'post',
    data
  });
};
// 会员概况 / 查询趋势图
const memberTrend = data => {
  return axios({
    url: '/analysis/member/queryMemberTrend',
    method: 'post',
    data
  });
};
// 会员概况 / 查询渠道
const memberChannelType = data => {
  return axios({
    url: '/analysis/member/queryMemberChannel',
    method: 'post',
    data
  });
};
// 会员概况 / 查询区域
const memberDetailTable = data => {
  return axios({
    url: '/analysis/member/queryRegionData',
    method: 'post',
    data
  });
};
// 会员概况 / 趋势下载
const memberTrendExport = data => {
  return axios({
    url: '/analysis/member/downloadMemberTend',
    method: 'post',
    data
  });
};
// 会员概况 / 明细下载
const memberDetailExport = data => {
  return axios({
    url: '/analysis/member/downloadRegionData',
    method: 'post',
    data
  });
};
// 首页home
export const goHome = data => {
  return axios({
    url: '/analysis/home/home',
    method: 'post',
    data
  });
};
// 卖品概览home
export const goSaleHome = data => {
  return axios({
    url: '/analysis/sellGoods/sell_goods',
    method: 'post',
    data
  });
};
// home 查询组织结构
export const getOrgInfo = data => {
  return axios({
    url: '/analysis/common/getOrgInfo',
    method: 'post',
    data
  });
};
// 票房概览 / 查询区域(影院)列表
const boxOfficeAreaList = data => {
  return axios({
    url: '/analysis/boxOffice/selectByPage',
    method: 'post',
    data
  });
};
// 票房概览 / 查询指标信息
const boxOfficeQuota = data => {
  return axios({
    url: '/analysis/boxOffice/init',
    method: 'post',
    data
  });
};
// 票房概览 / 查询影片信息
export const boxOfficeMovie = data => {
  return axios({
    url: '/analysis/boxOffice/switchMovie',
    method: 'post',
    data
  });
};
// 票房概览 / 查询渠道信息
export const boxOfficeChannel = data => {
  return axios({
    url: '/analysis/boxOffice/switchChannel',
    method: 'post',
    data
  });
};

// 票房概览 / 查询趋势图信息
const boxOfficeTrend = data => {
  return axios({
    url: '/analysis/boxOffice/switchTrend',
    method: 'post',
    data
  });
};
// 票房概览 / 保存指标编码
export const saveIndicator = data => {
  return axios({
    url: '/analysis/indicator/bindingIndicator',
    method: 'post',
    data
  });
};
// 票房概览 / 查询指标编码
export const queryIndicatorCodes = data => {
  return axios({
    url: '/analysis/indicator/queryIndicatorCodes',
    method: 'post',
    data
  });
};

// 票房概览 / 品牌列表
export const selectBrand = data => {
  return axios({
    url: '/analysis/boxOffice/selectBrand',
    method: 'post',
    data
  });
};
// 票劵使用效果分析 / 全部指标（0 卖品 1 会员 3 票劵）
const ticketUseAllTarget = data => {
  return axios({
    url: '/analysis/indicator/queryIndicatorCodes',
    method: 'post',
    data
  });
};
// 票劵使用效果分析 / 已设置指标
const ticketUseTarget = data => {
  return axios({
    url: '/analysis/market/queryMainData',
    method: 'post',
    data
  });
};

// 票劵使用效果分析 / 保存指标
const ticketUseSaveTarget = data => {
  return axios({
    url: '/analysis/indicator/bindingIndicator',
    method: 'post',
    data
  });
};
// 票劵使用效果分析 / 指标趋势
const ticketUseTrend = data => {
  return axios({
    url: '/analysis/market/queryMainData',
    method: 'post',
    data
  });
};
// 票劵使用效果分析 / 城市体明细分页
const ticketUseDetail = data => {
  return axios({
    url: '/analysis/market/queryRegionData',
    method: 'post',
    data
  });
};
// 票劵使用效果分析 / 区域比较
const ticketUseDetailCompare = data => {
  return axios({
    url: '/analysis/market/compareIndicator',
    method: 'post',
    data
  });
};

// 票劵概览 /列表
const getTickets = data => {
  return axios({
    url: '/analysis/market/list',
    method: 'post',
    data
  });
};

// 渠道分析 / 查询渠道趋势
export const queryChannelTrend = data => {
  return axios({
    url: '/analysis/channel/querySellGoodsTrend',
    method: 'post',
    data
  });
};
// 渠道分析 / 查询渠道明细
export const queryChannelDetails = data => {
  return axios({
    url: '/analysis/channel/querySellGoodsDetails',
    method: 'post',
    data
  });
};

// 品类分析 / 查询品类趋势
export const queryCategoryTrend = data => {
  return axios({
    url: '/analysis/category/querySellGoodsTrend',
    method: 'post',
    data
  });
};
// 品类分析 / 查询品类明细
export const queryCategoryDetails = data => {
  return axios({
    url: '/analysis/category/querySellGoodsDetail',
    method: 'post',
    data
  });
};

// 商品分析 / 查询商品趋势
export const querySkuTrend = data => {
  return axios({
    url: '/analysis/sellGoods/wares/sellsGoodWaresTend',
    method: 'post',
    data
  });
};
// 商品分析 / 查询商品指标概览
export const querySkuIndicator = data => {
  return axios({
    url: '/analysis/sellGoods/wares/querySellGoodsWaresIndicator',
    method: 'post',
    data
  });
};
// 商品分析 / 查询商品明细
export const querySkuDetails = data => {
  return axios({
    url: '/analysis/sellGoods/wares/selectByPage',
    method: 'post',
    data
  });
};
// 商品详情 / 查询商品详情信息
export const querySkuDetailsInfo = data => {
  return axios({
    url: '/analysis/skuAnalysis/queryMainSku',
    method: 'post',
    data
  });
};
// 商品详情 / 查询商品详情趋势
export const querySkuDetailsTrend = data => {
  return axios({
    url: '/analysis/skuAnalysis/querySkuTrend',
    method: 'post',
    data
  });
};
// 商品详情 / 查询卖品名称列表
export const querySkuByName = data => {
  return axios({
    url: '/analysis/skuAnalysis/querySkuByName',
    method: 'post',
    data
  });
};
export default {
  querySkuByName,
  querySkuDetailsInfo,
  querySkuDetailsTrend,
  querySkuTrend,
  querySkuIndicator,
  querySkuDetails,
  queryCategoryTrend,
  queryCategoryDetails,
  queryChannelTrend,
  queryChannelDetails,
  getTickets,
  getOrgInfo,
  selectBrand,
  saveIndicator,
  queryIndicatorCodes,
  ticketUseTarget,
  ticketUseAllTarget,
  ticketUseSaveTarget,
  ticketUseTrend,
  ticketUseDetail,
  ticketUseDetailCompare,
  boxOfficeAreaList,
  boxOfficeQuota,
  boxOfficeMovie,
  boxOfficeChannel,
  boxOfficeTrend,
  BoxOfficeData,
  GoodsData,
  MemberData,
  SaleData,
  SaleChannelData,
  SaleGoodsData,
  BoxPager,
  GoodsPager,
  MemberPager,
  SwitchBoxOfficeTab,
  SwitchSellGoodsTab,
  SwitchMemberTab,
  cityTabelData,
  inoutTable,
  inoutData,
  categoryList,
  suppliersList,
  switchTarget,
  switchChannel,
  saleTargetView,
  saleTargetBinding,
  saleTargetSave,
  getCinemaKpi,
  createKpi,
  getUnbindKpiCinema,
  updateKpi,
  deleteKpi,
  getBindingCinemaList,
  deleteCompeteBind,
  getCinemaList,
  getCompeteCinema,
  addCompeteCinema,
  sortCompeteCinema,
  goHome,
  goSaleHome,
  cagegoryList,
  getRuleList,
  switchRuleStatus,
  updateRuleInfo,
  getCurrentTime,
  memberTarget,
  memberTargetAll,
  memberSaveTarget,
  memberTrend,
  memberChannelType,
  memberDetailTable,
  memberTrendExport,
  memberDetailExport
};
