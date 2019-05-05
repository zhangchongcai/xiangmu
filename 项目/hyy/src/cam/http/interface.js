import axios from './api';

/**
 * 将所有接口统一起来便于维护
 * 如果项目很大可以将 URL 独立成文件，接口分成不同的模块
 */
/**接口处理示例 */
// export const testGet = (params) => {
//     //接口备注
//     return axios({
//         url: '/getApi',
//         method: 'get',
//         params
//     });
// };

// export const testPost = data => {
//     return axios({
//         url: '/postApi',
//         method: 'post',
//         data
//     })
// }

//首页/票房
export const BoxOfficeData = data => {
    return axios({
        url: '/home/initBoxOffice',
        method: 'post',
        data
    })
}
// 首页/卖品分析
export const GoodsData = data => {
    return axios({
        url: '/home/initSellGoods',
        method: 'post',
        data
    })
}
// 首页/会员
export const MemberData = data => {
    return axios({
        url: '/home/initMember',
        method: 'post',
        data
    })
}
// 首页/票房分页
export const BoxPager = data => {
    return axios({
        url: '/home/boxOfficeByPage',
        method: 'post',
        data
    })
}
// 首页/卖品分页
export const GoodsPager = data => {
    return axios({
        url: '/home/sellGoodsByPage',
        method: 'post',
        data
    })
}
// 首页/会员分页
export const MemberPager = data => {
    return axios({
        url: '/home/memberByPage',
        method: 'post',
        data
    })
}
//票房/指标切换
export const SwitchBoxOfficeTab = data => {
    return axios({
        url: '/home/switchBoxOffice',
        method: 'post',
        data
    })
}
//卖品/指标切换
export const SwitchSellGoodsTab = data => {
    return axios({
        url: '/home/switchSellGoods',
        method: 'post',
        data
    })
}
//会员/指标切换
export const SwitchMemberTab = data => {
    return axios({
        url: '/home/switchMember',
        method: 'post',
        data
    })
}

// 卖品分析/指标
export const SaleData = data => {
    return axios({
        url: '/sellGoods/init',
        method: 'post',
        data
    })
}
// 卖品分析/切换指标
export const switchTarget = data =>{
    return axios({
        url: '/sellGoods/sellsGoodSaleTend',
        method: 'post',
        data
    })
}
// 卖品分析/渠道/品类
export const SaleChannelData = data => {
    return axios({
        url: '/sellGoods/initChannelAndCategory',
        method: 'post',
        data
    })
}
// 卖品分析/ 切换渠道/品类
// export const 
// 卖品分析/销售表现
export const SaleGoodsData = data => {
    return axios({
        url: '/sellGoods/list',
        method: 'post',
        data
    })
}
// 卖品分析/城市体明细分页
export const cityTabelData = data =>{
    return axios({
        url:'/sellGoods/selectByPage',
        method:'post',
        data
    })
}
// 卖品分析/ 影院明细分页
export const cinemaTableData = data =>{
    return axios({
        url:'/sellGoods/selectByPage',
        method:'post',
        data
    })
}
// 进销存页面 /商品分类的api
export const categoryList = data =>{
    return axios({
        url:'/sellGoods/psi/selectCategoryList',
        method:'post',
        data
    })
}
// 进销存页面/ 供应商
export const suppliersList = data =>{
    return axios({
        url:'/sellGoods/psi/selectSupplyList',
        method:'post',
        data
    })
}
// 进销存页面/ 整体数据
export const inoutData = data =>{
    return axios({
        url:'/sellGoods/psi/init',
        method:'post',
        data
    })
}
// 进销存页面 / 表格数据
export const inoutTable = data =>{
    return axios({
        url:'/sellGoods/psi/selectDetailByPage',
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
    switchTarget
};