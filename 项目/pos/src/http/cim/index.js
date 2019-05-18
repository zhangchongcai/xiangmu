import axios from '../api';
// 销售终端-查询
export const terminalQueryPage = data => {
    return axios({
        url: '/terminal/queryPage',
        method: 'post',
        data
    })
}
// 销售终端-修改
export const terminalUpdate = data => {
    return axios({
        url: '/terminal/update',
        method: 'post',
        data
    })
}
// 单位管理--查询
export const queryUnit = data => {
    return axios({
        url: '/goods/queryUnit',
        method: 'post',
        data
    })
}
// 单位管理--新建
export const saveUnit = data => {
    return axios({
        url: '/goods/saveUnit',
        method: 'post',
        data
    })
}
// 单位管理--新建接口生成单位编码
export const generateUnitCode = data => {
    return axios({
        url: '/goods/generateUnitCode',
        method: 'post',
        data
    })
}
// 单位管理--修改
export const updateUnit = data => {
    return axios({
        url: '/goods/updateUnit',
        method: 'post',
        data
    })
}
// 单位管理--删除
export const deleteUnit = data => {
    return axios({
        url: '/goods/deleteUnit',
        method: 'post',
        data
    })
}
// 单位管理--回选
export const seletUnitByuid = data => {
    return axios({
        url: '/goods/seletUnitByuid',
        method: 'post',
        data
    })
}

// 品牌管理--查询
export const findBrandList = data => {
    return axios({
        url: '/brand/findBrandList',
        method: 'post',
        data
    })
}
// 品牌管理--新增
export const saveBrand = data => {
    return axios({
        url: '/brand/saveBrand',
        method: 'post',
        data
    })
}
// 品牌管理--回选
export const getBrand = data => {
    return axios({
        url: '/brand/getBrand',
        method: 'post',
        data
    })
}
// 品牌管理--修改
export const updateBrand = data => {
    return axios({
        url: '/brand/updateBrand',
        method: 'post',
        data
    })
}
// 品牌管理--删除
export const delBrand = data => {
    return axios({
        url: '/brand/delBrand',
        method: 'post',
        data
    })
}
// 销售大类管理--查询
export const queryBigClass = data => {
    return axios({
        url: '/bigclass/queryBigClass',
        method: 'post',
        data
    })
}
// 销售大类管理--回选
export const getBigClass = data => {
    return axios({
        url: '/bigclass/getBigClass',
        method: 'post',
        data
    })
}
// 销售大类管理--新建
export const insertBigClass = data => {
    return axios({
        url: '/bigclass/insertBigClass',
        method: 'post',
        data
    })
}
// 销售大类管理--修改
export const updateBigClass = data => {
    return axios({
        url: '/bigclass/updateBigClass',
        method: 'post',
        data
    })
}
// 销售大类管理--停止
export const stopBigClass = data => {
    return axios({
        url: '/bigclass/stopBigClass',
        method: 'post',
        data
    })
}
// 销售大类管理--删除
export const deleteBigClass = data => {
    return axios({
        url: '/bigclass/deleteBigClass',
        method: 'post',
        data
    })
}
// 类别管理--获取大类
export const getBigClassList = data => {
    return axios({
        url: '/class/bigClass/list',
        method: 'post',
        data
    })
}
// 类别管理--类别树查询
export const getClassTree = data => {
    return axios({
        url: '/class/get/classTree',
        method: 'post',
        data
    })
}
// 类别管理--列表查询
export const classList = data => {
    return axios({
        url: '/class/list',
        method: 'post',
        data
    })
}
// 类别管理--新增
export const classAdd = data => {
    return axios({
        url: '/class/add',
        method: 'post',
        data
    })
}
// 类别管理--更改
export const classUpdate = data => {
    return axios({
        url: '/class/update',
        method: 'post',
        data
    })
}
// 类别管理--删除
export const classDelete = data => {
    return axios({
        url: '/class/delete',
        method: 'post',
        data
    })
}
// 类别管理--上移
export const classUp = data => {
    return axios({
        url: '/class/up',
        method: 'post',
        data
    })
}
// 类别管理--下移
export const classDown = data => {
    return axios({
        url: '/class/down',
        method: 'post',
        data
    })
}
// 类别管理--回选 新建时匹配code
export const classDetail = data => {
    return axios({
        url: '/class/detail',
        method: 'post',
        data
    })
}
// 销售属性--查询
export const selectSalesAttribute = data => {
    return axios({
        url: '/salesAttribute/selectAttribute',
        method: 'post',
        data
    })
}
// 销售属性--新增
export const saveSlesAttribute = data => {
    return axios({
        url: '/salesAttribute/saveAttribute',
        method: 'post',
        data
    })
}
// 销售属性--修改
export const updateSalesAttribute = data => {
    return axios({
        url: '/salesAttribute/updateAttribute',
        method: 'post',
        data
    })
}
// 销售属性--删除
export const deleteSalesAttribute = data => {
    return axios({
        url: '/salesAttribute/deleteAttribute',
        method: 'post',
        data
    })
}
// 仓库管理--查询
export const queryStorehouse = data => {
    return axios({
        url: '/storehouse/queryStorehouse',
        method: 'post',
        data
    })
}
// 仓库管理--新建
export const saveStorehouse = data => {
    return axios({
        url: '/storehouse/saveStorehouse',
        method: 'post',
        data
    })
}
// 仓库管理--删除
export const delStorehouse = data => {
    return axios({
        url: '/storehouse/delStorehouse/?id='+data,
        method: 'get'
    })
}
// 仓库管理--修改
export const updateStorehouse = data => {
    return axios({
        url: '/storehouse/updateStorehouse',
        method: 'put',
        data
    })
}

// 货架管理--查询
export const findStorageRackList = data => {
    return axios({
        url: '/storage/rack/findStorageRackList',
        method: 'post',
        data
    })
}
// 货架管理--删除
export const delStorageRack = data => {
    return axios({
        url: '/storage/rack/delStorageRack/'+data,
        method: 'post'
    })
}
// 货架管理--修改
export const updateStorageRack = data => {
    return axios({
        url: '/storage/rack/updateStorageRack',
        method: 'post',
        data
    })
}
// 货架管理--新增
export const saveStorageRack = data => {
    return axios({
        url: '/storage/rack/saveStorageRack',
        method: 'post',
        data
    })
}
// 销售地址--查询
export const queryPage = data => {
    return axios({
        url: '/salePlace/queryPage',
        method: 'post',
        data
    })
}
// 销售地址--新增
export const salePlaceSave = data => {
    return axios({
        url: '/salePlace/save',
        method: 'get',
        data
    })
}
// 销售地址--删除
export const salePlaceDelete = data => {
    return axios({
        url: '/salePlace/delete/'+data,
        method: 'delete'
    })
}
// 销售地址--启用停用
export const salePlaceStatus = (params,data) => {
    return axios({
        url: '/salePlace/status?status='+params+'&uid='+data,
        method: 'post'
    })
}

export default {
    // 销售终端接口
    terminalQueryPage,
    terminalUpdate,
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

    queryStorehouse,
    saveStorehouse,
    delStorehouse,
    updateStorehouse,
    findStorageRackList,
    delStorageRack,
    saveStorageRack,
    updateStorageRack,
    queryPage,
    salePlaceSave,
    salePlaceDelete,
    salePlaceStatus
}
