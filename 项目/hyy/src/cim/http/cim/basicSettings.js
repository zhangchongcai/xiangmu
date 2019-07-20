import axios from 'frame_cpm/http/api';
import config from '../config';
// 销售终端-查询
export const terminalQueryPage = data => {
    return axios({
        baseURL: config.basePosURL,
        url: '/terminal/queryPage',
        method: 'post',
        data
    })
}
// 销售终端-修改
export const terminalUpdate = data => {
    return axios({
        baseURL: config.basePosURL,
        url: '/terminal/update',
        method: 'post',
        data
    })
}
// 销售终端-查询销售地址
export const salePlaceAll = data => {
    return axios({
        baseURL: config.basePosURL,
        url: '/salePlace/all',
        method: 'post',
        data
    })
}
// 销售终端-查询货架和仓库
export const terminalRackAll = data => {
    return axios({
        baseURL: config.basePosURL,
        url: '/terminal/rackAll',
        method: 'post',
        data
    })
}
// 单位管理--查询
export const queryUnit = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/class/unit/query',
        method: 'post',
        data
    })
}
// 单位管理--新建
export const saveUnit = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/goods/saveUnit',
        method: 'post',
        data
    })
}
// 单位管理--新建接口生成单位编码
export const generateUnitCode = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/goods/generateUnitCode',
        method: 'post',
        data
    })
}
// 单位管理--修改
export const updateUnit = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/goods/updateUnit',
        method: 'post',
        data
    })
}
// 单位管理--删除
export const deleteUnit = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/goods/deleteUnit',
        method: 'post',
        data
    })
}
// 单位管理--回选
export const seletUnitByuid = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/goods/seletUnitByuid',
        method: 'post',
        data
    })
}

// 品牌管理--查询
export const findBrandList = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/class/brand/query',
        method: 'post',
        data
    })
}
// 品牌管理--新增
export const saveBrand = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/brand/saveBrand',
        method: 'post',
        data
    })
}
// 品牌管理--回选
export const getBrand = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/brand/getBrand',
        method: 'post',
        data
    })
}
// 品牌管理--修改
export const updateBrand = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/brand/updateBrand',
        method: 'post',
        data
    })
}
// 品牌管理--删除
export const delBrand = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/brand/delBrand',
        method: 'post',
        data
    })
}
// 销售大类管理--查询
export const queryBigClass = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/bigclass/queryBigClass',
        method: 'post',
        data
    })
}
// 销售大类管理--回选
export const getBigClass = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/bigclass/getBigClass',
        method: 'post',
        data
    })
}
// 销售大类管理--新建
export const insertBigClass = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/bigclass/insertBigClass',
        method: 'post',
        data
    })
}
// 销售大类管理--修改
export const updateBigClass = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/bigclass/updateBigClass',
        method: 'post',
        data
    })
}
// 销售大类管理--停止
export const stopBigClass = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/bigclass/stopBigClass',
        method: 'post',
        data
    })
}
// 销售大类管理--删除
export const deleteBigClass = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/bigclass/deleteBigClass',
        method: 'post',
        data
    })
}
// 类别管理--获取大类
export const getBigClassList = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/class/bigClass/list',
        method: 'post',
        data
    })
}
// 类别管理--类别树查询
export const getClassTree = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/class/classTrees/query',
        method: 'post',
        data
    })
}

// 类别管理--列表查询
export const classList = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/class/queryClass',
        method: 'post',
        data
    })
}
// 类别管理--新增
export const classAdd = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/class/add',
        method: 'post',
        data
    })
}
// 类别管理--更改
export const classUpdate = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/class/update',
        method: 'post',
        data
    })
}
// 类别管理--删除
export const classDelete = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/class/delete',
        method: 'post',
        data
    })
}
// 类别管理--上移
export const classUp = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/class/up',
        method: 'post',
        data
    })
}
// 类别管理--下移
export const classDown = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/class/down',
        method: 'post',
        data
    })
}
// 类别管理--回选 新建时匹配code
export const classDetail = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/class/detail',
        method: 'post',
        data
    })
}
// 销售属性--查询
export const selectSalesAttribute = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/class/attribute/query',
        method: 'post',
        data
    })
}
// 销售属性--新增
export const saveSlesAttribute = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/salesAttribute/saveAttribute',
        method: 'post',
        data
    })
}
// 销售属性--修改
export const updateSalesAttribute = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/salesAttribute/updateAttribute',
        method: 'post',
        data
    })
}
// 销售属性--删除
export const deleteSalesAttribute = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/salesAttribute/deleteAttribute',
        method: 'post',
        data
    })
}
// 仓库管理--查询
export const queryStorehouse = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/storehouse/queryStorehouse',
        method: 'post',
        data
    })
}
// 仓库管理--新建
export const saveStorehouse = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/storehouse/saveStorehouse',
        method: 'post',
        data
    })
}
// 仓库管理--删除
export const delStorehouse = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/storehouse/delStorehouse',
        method: 'post',
        data
    })
}
// 仓库管理--修改
export const updateStorehouse = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/storehouse/updateStorehouse',
        method: 'put',
        data
    })
}

// 货架管理--查询
export const findStorageRackList = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/storage/rack/findStorageRackList',
        method: 'post',
        data
    })
}
// 货架管理--删除
export const delStorageRack = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/storage/rack/delStorageRack/',
        method: 'post',
        data
    })
}
// 货架管理--修改
export const updateStorageRack = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/storage/rack/updateStorageRack',
        method: 'post',
        data
    })
}
// 货架管理--新增
export const saveStorageRack = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/storage/rack/saveStorageRack',
        method: 'post',
        data
    })
}
// 销售地址--查询
export const queryPage = data => {
    return axios({
        baseURL: config.basePosURL,
        url: '/salePlace/queryPage',
        method: 'post',
        data
    })
}
// 销售地址--新增
export const salePlaceSave = data => {
    return axios({
        baseURL: config.basePosURL,
        url: '/salePlace/save',
        method: 'post',
        data
    })
}
// 销售地址--修改
export const salePlaceUpdate = data => {
    return axios({
        baseURL: config.basePosURL,
        url: '/salePlace/update',
        method: 'post',
        data
    })
}
// 销售地址--删除
export const salePlaceDelete = data => {
    return axios({
        baseURL: config.basePosURL,
        url: '/salePlace/delete/' + data,
        method: 'delete'
    })
}
// 销售地址--查看
export const salePlaceCheck = data => {
    return axios({
        baseURL: config.basePosURL,
        url: '/salePlace/get/' + data,
        method: 'get'
    })
}
// 销售地址--启用停用
export const salePlaceStatus = (params, data) => {
    return axios({
        baseURL: config.basePosURL,
        url: '/salePlace/status?status=' + params + '&uid=' + data,
        method: 'post'
    })
}
// 测试
export const goodsDataQueryGoodsList = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/cim/goodsData/queryGoodsList',
        method: 'get',
        data
    })
}
// 商品分类管理
//获取分类树
export const getCategoryTrees = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/category/trees',
        method: 'post',
        data
    })
}
// 商品分类新增与修改保存
export const categorySave = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/category/save',
        method: 'post',
        data
    })
}
//查询列表
export const categoryList = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/category/list',
        method: 'post',
        data
    })
}
// 类别管理--生成编码
export const categoryBuildCode = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/category/buildCode',
        method: 'post',
        data
    })
}
//分类新建或者修改回选数据
export const categoryToPage = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/category/toPage',
        method: 'post',
        data
    })
}
// 商品分类删除
export const categoryDelete = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/category/delete',
        method: 'post',
        data
    })
}
// 货架编码
export const storageRackGetStorageRackCode = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/storage/rack/getStorageRackCode',
        method: 'post',
        data
    })
}
// 仓库编码回显示
export const storehouseGetStorehouse = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/storehouse/getStorehouse',
        method: 'post',
        data
    })
}
// 门店列表
export const merCinemaList = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/mer/cinema/list',
        method: 'post',
        data
    })
}
// 仓库编码
export const storehouseBuildCode = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/storehouse/buildCode',
        method: 'post',
        data
    })
}
// 仓库编码
export const uploadGoodsImg = data => {
    return axios({
        baseURL: config.baseURL,
        url: '/upload/goodsImg',
        method: 'post',
        data
    })
}

export default {
    // 销售终端接口
    terminalQueryPage,
    terminalUpdate,
    salePlaceAll,
    terminalRackAll,
    // 单位管理接口
    queryUnit,
    saveUnit,
    generateUnitCode,
    updateUnit,
    deleteUnit,
    seletUnitByuid,
    // 品牌管理接口
    findBrandList,
    saveBrand,
    getBrand,
    updateBrand,
    delBrand,
    // 销售大类管理接口
    getBigClassList,
    queryBigClass,
    updateBigClass,
    getBigClass,
    insertBigClass,
    stopBigClass,
    deleteBigClass,
    // 类别管理接口
    getClassTree,
    classList,
    classAdd,
    classUpdate,
    classDelete,
    classUp,
    classDown,
    classDetail,
    // 销售属性接口
    selectSalesAttribute,
    saveSlesAttribute,
    updateSalesAttribute,
    deleteSalesAttribute,

    // 仓库管理接口
    queryStorehouse,
    saveStorehouse,
    delStorehouse,
    updateStorehouse,
    storehouseGetStorehouse,
    storehouseBuildCode,
    // 货架管理接口
    findStorageRackList,
    delStorageRack,
    saveStorageRack,
    updateStorageRack,
    storageRackGetStorageRackCode,
    // 销售地址接口
    queryPage,
    salePlaceSave,
    salePlaceDelete,
    salePlaceStatus,
    salePlaceUpdate,
    salePlaceCheck,

    goodsDataQueryGoodsList,
    // 商品分类管理
    getCategoryTrees,
    categorySave,
    categoryDelete,
    categoryToPage,
    categoryList,
    categoryBuildCode,
    // 门店列表
    merCinemaList,
    uploadGoodsImg,
}
