// import axios from './api';
 import axios from "frame_cpm/http/api"
//首页/票房
export const BoxOfficeData = data => {
    return axios({
        // url: '/home/initBoxOffice',
        url: '/analysis/home/initBoxOffice',
        method: 'post',
        data
    })
}
// 首页/卖品分析
export const GoodsData = data => {
    return axios({
        // url: '/home/initSellGoods',
        url: '/analysis/home/initSellGoods',
        method: 'post',
        data
    })
}
// 首页/会员
export const MemberData = data => {
    return axios({
        // url: '/home/initMember',    
        url: '/analysis/home/initMember',
        method: 'post',
        data
    })
}
// 首页/票房分页
export const BoxPager = data => {
    return axios({
        // url: '/home/boxOfficeByPage',
        url: '/analysis/home/boxOfficeByPage',       
        method: 'post',
        data
    })
}
// 首页/卖品分页
export const GoodsPager = data => {
    return axios({
        // url: '/home/sellGoodsByPage',
        url: '/analysis/home/sellGoodsByPage',
        method: 'post',
        data
    })
}
// 首页/会员分页
export const MemberPager = data => {
    return axios({
        // url: '/home/memberByPage',
        url: '/analysis/home/memberByPage',
        method: 'post',
        data
    })
}
//票房/指标切换
export const SwitchBoxOfficeTab = data => {
    return axios({
        // url: '/home/switchBoxOffice',
        url: '/analysis/home/switchBoxOffice',
        method: 'post',
        data
    })
}
//卖品/指标切换
export const SwitchSellGoodsTab = data => {
    return axios({
        // url: '/home/switchSellGoods',
        url: '/analysis/home/switchSellGoods',
        method: 'post',
        data
    })
}
//会员/指标切换
export const SwitchMemberTab = data => {
    return axios({
        // url: '/home/switchMember',
        url: '/analysis/home/switchMember',
        method: 'post',
        data
    })
}

// 卖品分析/指标
export const SaleData = data => {
    return axios({
        url: '/analysis/sellGoods/init',
        method: 'post',
        data
    })
}
// 卖品分析/切换指标
export const switchTarget = data =>{
    return axios({
        url: '/analysis/sellGoods/sellsGoodSaleTend',
        method: 'post',
        data
    })
}
// 卖品分析/渠道/品类
export const SaleChannelData = data => {
    return axios({
        url: '/analysis/sellGoods/initChannelAndCategory',
        method: 'post',
        data
    })
}
// 卖品分析/渠道/品类/切换
export const  switchChannel = data =>{
    return axios({
        url: '/analysis/sellGoods/channelDistributionTrend',
        method: 'post',
        data
    })
}
// 卖品分析/销售表现
export const SaleGoodsData = data => {
    return axios({
        url: '/analysis/sellGoods/list',
        method: 'post',
        data
    })
}
// 卖品分析/城市体明细分页
export const cityTabelData = data =>{
    return axios({
        url:'/analysis/sellGoods/selectByPage',
        method:'post',
        data
    })
}
// 卖品分析/ 影院明细分页
export const cinemaTableData = data =>{
    return axios({
        url:'/analysis/sellGoods/selectByPage',
        method:'post',
        data
    })
}
// 卖品分析/ 指标概览
export const saleTargetView = data =>{
    return axios({
        url:'/analysis/sellGoods/querySellGoodsIndicator',
        method:'post',
        data
    })
}
// 卖品分析 /指标概览弹窗
export const saleTargetBinding = data => {
      return axios({
        url:'/analysis/sellGoods/queryIndicatorBindings',
        method:'post',
        data
    })
}
// 卖品分析 /指标设置保存
export const saleTargetSave = data =>{
    return axios({
        url:'/analysis/sellGoods/saveIndicatorBindings',
        method:'post',
        data
    })
}
// 进销存页面 /商品分类的api
export const categoryList = data =>{
    return axios({
        url:'/analysis/sellGoods/psi/selectCategoryList',
        method:'post',
        data
    })
}
// 进销存页面/ 供应商
export const suppliersList = data =>{
    return axios({
        url:'/analysis/sellGoods/psi/selectSupplyList',
        method:'post',
        data
    })
}
// 进销存页面/ 整体数据
export const inoutData = data =>{
    return axios({
        url:'/analysis/sellGoods/psi/init',
        method:'post',
        data
    })
}
// 进销存页面 / 表格数据
export const inoutTable = data =>{
    return axios({
        url:'/analysis/sellGoods/psi/selectDetailByPage',
        method:'post',
        data
    })
}
// 集团kpi/列表
export const getCinemaKpi = data =>{
    return axios({
        url:'/analysis/cinemaManage/queryCinemaKpi',
        method:'post',
        data
    })
}
// 集团kpi /未绑定kip的影院列表
export const getUnbindKpiCinema = data =>{
    return axios({
        url:'/analysis/cinemaManage/queryNewCinemaInfo',
        method:'post',
        data
    })
}
// 集团kpi/创建
export const createKpi = data =>{
    return axios({
        url:'/analysis/cinemaManage/insertCinemaKpi',
        method:'post',
        data
    })
}

// 集团kpi/更新
export const updateKpi = data =>{
    return axios({
        url:'/analysis/cinemaManage/modifyCinemaKpi',
        method:'post',
        data
    })
}
// 集团kpi/删除
export const deleteKpi = data =>{
    return axios({
        url:'/analysis/cinemaManage/deleteCinemaKpi',
        method:'post',
        data
    })
}

// 影院管理/ 查询已绑定竞对影院
export const getBindingCinemaList = data =>{
    return axios({
        url:'/analysis/cinemaManage/queryCompetesBinding',
        method:'post',
        data
    })
}
// 影院管理/ 删除已绑定的竞对影院
export const deleteCompeteBind = data =>{
    return axios({
        url:'/analysis/cinemaManage/deleteCompetesBinding',
        method:'post',
        data
    })
}
// 影院管理/ 查询我的影院
export const getCinemaList = data =>{
    return axios({
        url:'/analysis/cinemaManage/queryCinemaList',
        method:'post',
        data
    })
}
// 影院管理/ 查询竞对影院列表（未绑定弹窗）
export const getCompeteCinema = data =>{
    return axios({
        url:'/analysis/cinemaManage/queryCompeteList',
        method:'post',
        data
    })
}
// 影院管理/ 添加竞对影院（未绑定弹窗）
export const addCompeteCinema = data =>{
    return axios({
        url:'/analysis/cinemaManage/addCompeteBinding',
        method:'post',
        data
    })
}
// 影院管理/ 竞对影院上/下移动
export const sortCompeteCinema = data =>{
    return axios({
        url:'/analysis/cinemaManage/sortCompeteBinding',
        method:'post',
        data
    })
}
// 首页home
export const goHome = data =>{
    return axios({
        url:'/analysis/home/home',
        method:'post',
        data
    })
}
// 卖品概览home
export const goSaleHome = data =>{
    return axios({
        url:'/analysis/sellGoods/sell_goods',
        method:'post',
        data
    })
}

export default {
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
};