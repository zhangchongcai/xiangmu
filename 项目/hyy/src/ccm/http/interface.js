import axios from "frame_cpm/http/api.js"

import exportEXLAxios from './api'
/**
 * 将所有接口统一起来便于维护
 * 如果项目很大可以将 URL 独立成文件，接口分成不同的模块
 */
/**接口处理示例 */
export const testGet = (params) => {
    //接口备注
    return axios({
        url: '/getApi',
        method: 'get',
        params
    });
};

export const testPost = data => {
    return axios({
        url: '/postApi',
        method: 'post',
        data
    })
}

export const login = data => {
    return axios({
        url: '/login',
        method: 'post',
        data
    })
}

/**
 * 票券分类设置 - 查询票券分类信息
 * 
 * @function findCouponList 
 * 
 * @param {Object} data - 传递参数
 * @param {String} data.couponName - 分类名称
 * @param {String} data.couponType - 票券类型
 * @param {String} data.couponTypeStatus - 票券状态
 * @param {Number} data.pageNo - 页数
 * @param {Number} data.pageSize - 每页显示的行数
 */
export const findCouponList = data => {
    return axios({
        url: '/coupon/type/query',
        method: 'post',
        data
    })
}

/**
 * 票券分类设置 - 新建票券分类信息
 * 
 * @function insertCouponType 
 * 
 * @param {Object} data - 传递参数
 * @param {String} data.couponName - 分类名称
 * @param {String} data.couponType - 票券类型
 */
export const insertCouponType = data => {
    return axios({
        url: '/coupon/type/create',
        method: 'post',
        data
    })
}

/**
 * 票券分类设置 - 查询票券分类名称唯一
 * 
 * @function insertCouponType 
 * 
 * @param {Object} data - 传递参数
 * @param {String} data.couponName - 分类名称
 */
export const findCouponTypeName = data => {
    return axios({
        url: '/coupon/type/validName',
        method: 'post',
        data
    })
}

/**
 * 票券分类设置 - 删除票券分类
 * 
 * @function deleteCouponType
 * 
 * @param {Array} ids - 需要删除的id的数组
 * 
 * @example {ids:['1','2']}
 */
export const deleteCouponType = data => {
    return axios({
        url: '/coupon/type/delete',
        method: 'post',
        data
    })
}

/**
 * 票券分类设置 - 修改票券
 * 
 * @function updateCouponType - 修改票券
 * 
 * @param {Object} data - 参数
 * @param {String} data.couponName - 票券名称
 * @param {Number} data.id - 主键id
 * @param {Number} data.couponTypeStatus - 票券状态
 */

export const updateCouponType = data => {
    return axios({
        url: '/coupon/type/update',
        method: 'post',
        data
    })
}

/**
 * 票券原票库存管理 - 查询票券原票库存
 * 
 * @function findCouponCodeList
 * 
 * @param {Object} data - 参数
 * @param {String} data.batchCode - 批次号
 * @param {String} data.couponColor - 票券颜色
 * @param {String} data.startId - 流水号起始范围
 * @param {String} data.endId - 流水号结束范围
 * @param {String} data.couponCode - 票券编号
 * @param {Number} data.stockStatus - 库存状态
 * @param {String} data.createUserName - 创建人名称
 * @param {Number} data.pageNo - 第几页
 * @param {Number} data.pageSize - 每页多少条
 * 
 */
export const findCouponCodeList = data => {
    return axios({
        url: '/coupon/code/query',
        method: 'post',
        data
    })
}

/**
 * 票券原票库存管理 - 校验原票库存配发/报损
 * 
 * @function validateCoupon
 * 
 * @param {Object} data - 参数
 * @param {String} data.batchCode - 批次号
 * @param {String} data.startId - 流水号起始范围
 * @param {String} data.endId - 流水号结束范围
 * @param {String} data.ids - 票券编号数组
 * @param {Number} data.stockStatus - 库存状态  1 - 配发 2 - 报损
 * 
 */
export const validateCoupon = data => {
    return axios({
        url: '/coupon/code/validate',
        method: 'post',
        data
    })
}

/**
 * 票券原票库存管理 - 原票库存配发
 * 
 * @function issueCoupon 
 * 
 * @param {Object} data - 参数
 * @param {String} data.allocate_business_id - 流水号结束范围
 * @param {String} data.ids - 票券编号数组
 * @param {Number} data.stockStatus - 库存状态  1 - 配发 2 - 报损
 * 
 */
export const issueCoupon = data => {
    return axios({
        url: '/coupon/code/issue',
        method: 'post',
        data
    })
}

/**
 * 票券原票库存管理 - 原票库存报损
 * 
 * @function reimburseCoupon 
 * 
 * @param {Object} data - 参数
 * @param {String} data.allocate_business_id - 流水号结束范围
 * @param {String} data.ids - 票券编号数组
 * @param {Number} data.stockStatus - 库存状态  1 - 配发 2 - 报损
 * 
 */
export const reimburseCoupon = data => {
    return axios({
        url: 'coupon/code/reimburse',
        method: 'post',
        data
    })
}

/**
 *  票券编号预生成 - 查询预生成编号
 * 
 * @function getTicketNumerList - 查询预生成编号
 * 
 * @param {Object} data - 参数
 * @param {String} data.batchCode - 批次号
 * @param {Date} data.createTime  - 创建日期
 * @param {String} data.createUserName - 创建人
 */
export const getTicketNumerList = data => {
    return axios({
        url: '/coupon/prebuild/query',
        method: 'post',
        data
    })
}



/**
 * 票券编号预生成 - 导出excel
 * 
 * @function exportExcel
 * 
 * @param {Object} params  {batchCode:1}    - 参数
 * 
 */
export const exportExcel = (params) => {
    return axios({
        url: '/coupon/prebuild/exportExcel',
        method: 'get',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        params
    })
}

/**
 * 票券编号预生成 - 下载模板
 * 
 * @function exportTemplate
 */
export const exportTemplate = () => {
    return axios({
        url: '/coupon/prebuild/exportTemplate',
        method: 'get',
        responseType:'blob'
    })
}

/**
 * 票券编号预生成 - 新建预生成批次-系统生成
 * 
 * @function createCouponBatch
 * 
 * @param {Object} params 
 * @param {String} couponColor  票券颜色
 * @param {Number} couponCount  票券数量
 * 
 */
export const createCouponBatch = data => {
    return axios({
        url: '/coupon/prebuild/create',
        method: 'post',
        data
    })
}


/**
 * 票券编号预生成 - 新建预生成批次-外部生成
 * 
 * @function importExcel
 * 
 * @param {Object} data  
 * @param {String} data.couponColor  票券颜色
 * @param {MultipartFile} data.file - 导入文件
 * 
 */
export const importExcel = data => {
    return axios({
        url: '/coupon/prebuild/importExcel',
        method: 'post',
        data
    })
}


/**
 * 票券业券参数 - 获取票券参数的基础设置
 * 
 * @function getBaseConfig
 * 
 */
export const getBaseConfig = (params) => {
    return axios({
        url: '/coupon/getBaseConfig',
        method: 'get',
        params
    })
}


/**
 * 票券业券参数 -  保存基础设置
 * 
 * @function updateBaseConfig

 * @param {Object} data  
 * @param {Integer} data.exportNumSet  - 批量导出次数设置
 * @param {Integer} data.exportNum  - 批量导出次数
 * @param {Integer} data.printNumSet - 批量打印次数设置
 * @param {Integer} data.printNum - 批量打印次数
 * @param {Integer} data.sendMsgNumSet - 短信发送次数设置
 * @param {Integer} data.sendMsgNum - 短信发送次数
 * @param {Integer} data.sendMsgType - 票券短信提取方式
 * @param {Integer} data.isSelfTicketNumber - 是否只能选择销售本商户票券编号
 * @param {Integer} data.allowDelayTicket - 已过期票券是否允许延期
 * @param {Integer} data.giftTicketWithMsg - 营销活动赠送票券是否发送短信
 * @param {Integer} data.allowMixTicket - 是否允许不同销售单的票券混合使用
 */
export const updateBaseConfig = data => {
    return axios({
        url: '/coupon/updateBaseConfig',
        method: 'post',
        data
    })
}

/**
 * 票务销售申请单管理 - 验证申请单名称重复
 * 
 * @function saleListCheckName
 * 
 * @param {Object} data - 请求参数
 * @param {String} data.couponName - 销售申请单名称
 * @param {Number} [data.id] - 申请单id,修改时，请传入该字段 
 */
export const saleListCheckName = (data) => {
    return axios({
        url: '/coupon/apply/checkName',
        method: 'post',
        data
    })
};


/**
 * 票务销售申请单管理 - 新建或修改票券销售申请单
 * 
 * @function saleListSaveOrUpdate
 * 
 * @param {Object} data - 请求参数
 */
export const saleListSaveOrUpdate = (data) => {
    return axios({
        url: '/coupon/apply/saveOrUpdate',
        method: 'post',
        data
    })
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
export const findSaleList = (data) => {
    return axios({
        url: '/coupon/apply/query',
        method: 'post',
        data
    })
};
/**
 * 票务销售申请单管理 - 销售申请单提交审批
 * 
 * @function createAuditBill
 * 
 * @param {String} data.applyCode - 销售申请单号
 */

export const createAuditBill = (data) => {
    return axios({
        url: '/coupon/apply/createAuditBill',
        method: 'post',
        data
    })
}
/**
 * 票务销售申请单导出 - 销售申请单导出
 * 
 * @function couponExport
 * 
 * @param {String} applyCode - 销售申请单号
 */
export const couponExport = (data) => {
    return exportEXLAxios({
        url: '/coupon/apply/export?applyCode='+data.applyCode,
        method: 'post',
        data
    })
}
/**
 * 票务销售申请单管理 - 预生成编号单查询
 * 
 * @function findByStartAndNum
 * 
 * @param {incomeCinemaId} data.applyCode - 预生成编号单查询
 * @param {startId} data.applyCode -
 * @param {pageSize} data.applyCode - 
 */
export const findByStartAndNum = (data) => {
    return axios({
        url: '/coupon/code/findByStartAndNum',
        method: 'post',
        data
    })
}
/**
 * 票务销售申请单管理 - 票券申请单作废
 * 
 * @function abandonSaleList
 * 
 * @param {String} data.applyCode - 销售申请单号
 */
export const abandonSaleList = (data) => {
    return axios({
        url: '/coupon/apply/cancel',
        method: 'post',
        data
    })
}

/**
 * 票务销售申请单管理 - 票券申请单停用
 * 
 * @function stopSaleList
 * 
 * @param {String} data.applyCode - 销售申请单号
 * @param {String} data.auditState - 审核结果：0-通过，1-不通过;2:未审批
 */
export const stopSaleList = (data) => {
    return axios({
        url: '/coupon/apply/block',
        method: 'post',
        data
    })
}

/**
 * 票务销售申请单管理 - 启用销售单
 * 
 * @function startSaleList
 * @param {*} data 
 */
export const startSaleList = (data) => {
    return axios({
        url: '/coupon/apply/start',
        method: 'post',
        data
    })
}

/**
 * 票务销售申请单管理 - 票券申请单删除
 * 
 * @function deleteSaleList
 * 
 * @param {String} data.applyCode - 销售申请单号
 */
export const deleteSaleList = (data) => {
    return axios({
        url: '/coupon/apply/delete',
        method: 'post',
        data
    })
}

/**
 * 票务销售申请单管理 - 票券申请单延期
 * 
 * @function delaySaleList
 * 
 * @param {String} data.applyCode - 销售申请单号
 */
export const delaySaleList = (data) => {
    return axios({
        url: '/coupon/apply/delay',
        method: 'post',
        data
    })
}

/**
 * 票务销售申请单管理 - 票券申请单查看
 * 
 * @function checkSaleList 
 * 
 * @param {String} data.applyCode - 销售申请单号
 */
export const checkSaleList = (data) => {
    return axios({
        url: '/coupon/apply/view',
        method: 'post',
        data
    })
}

/**
 * 票券编号查询 - 查询
 * 
 * @function queryCodeList 
 * 
 * @param {String} data.applyCode - 销售申请单号
 * @param {String} data.contractCode - 合同协议号
 * @param {String} data.couponCode - 票券编号
 * @param {Number} data.pageNo - 页数
 * @param {Number} data.pageSize - 每页多少行
 * @param {String} data.status - 票券状态
 */
export const queryCodeList = (data) => {
    return axios({
        url: '/coupon/code/queryCodeList',
        method: 'post',
        data
    })
}

/**
 * 票券编号查询 - 票券编号作废
 * 
 * @function cancelCode 
 * 
 * @param {String} data.couponCode - 票券编号
 */
export const cancelCode = (data) => {
    return axios({
        url: '/coupon/code/cancel',
        method: 'post',
        data
    })
}
/**
 *   票券编号查询统计
 * 
 * @function cancelCode 
 * 
 * @param {String} data.couponCode - 票券编号
 */
export const queryCodeListCount = (data) => {
    return axios({
        url: '/coupon/code/queryCodeListCount',
        method: 'post',
        data
    })
}

/**     ---------------票版接口----------
 * @function findcouponPrintModelDef - 查看票券模板列表
 */
export const selectmodel = (data) => {
    return axios({
        url: '/coupon/couponPrint/selectmodel',
        method: 'post',
        data
    })
}
/**      
 * @function selectmodelid - 根据票版id 查询 
 * @param    id
 */
export const selectmodelid = (data) => {
    return axios({
        url: '/coupon/couponPrint/selectmodelid',
        method: 'post',
        data
    })
}
/**      
 * @function deletemodel - 根据票版id 删除
 * @param    id
 */
export const deletemodel = (data) => {
    return axios({
        url: '/coupon/couponPrint/deletemodel',
        method: 'post',
        data
    })
}

/**      
 * @function setdefault - 根据票版id 设置默认票版
 * @param    id
 */
export const setdefault = (data) => {
    return axios({
        url: '/coupon/couponPrint/setdefault',
        method: 'post',
        data
    })
}

/**      
 * @function findcouponPrintModelDef - 查看票券模板元素定义
 */
export const findcouponPrintModelDef = (data) => {
    return axios({
        url: '/coupon/couponPrint/selectdef',
        method: 'get',
        data
    })
}
/**      
 * @function addmodel - 添加票版
 * @param  id   -修改的id不为空 id=null为新增
 */
export const addmodel = (data) => {
    return axios({
        url: '/coupon/couponPrint/addmodel',
        method: 'post',
        data
    })
}  
/**      
 * @function addBackgroundImg - 上传图片
 * @param   file   文件
 */
export const addBackgroundImg = (data) => {
    return axios({
        url: '/coupon/couponPrint/img',
        method: 'post',
        data
    })
}
/**    ------------打印-----------
 * @function findCouponByCondition - 打印票版列表
 */
export const findCouponByCondition = (data) => {
    return axios({
        url: '/coupon/couponPrint/findCouponByCondition',
        method: 'post',
        data
    })
}
export const ticketPrinting = (data) => {
    return axios({
        url: '/coupon/couponPrint/ticketPrinting',
        method: 'post',
        data
    })
}
export const reprint = (data) => {
    return axios({
        url: '/coupon/couponPrint/reprint',
        method: 'post',
        data
    })
}
/**     -----------应收款单------------
 *  @function    receivableList       - 收款管理表查询
 *  @param       
 */
export const receivableList = (data) => {
    return axios({
        url: '/coupon/receivable/findReceivable',
        method: 'post',
        data
    })
}
/**    
 *  @function    receivableSelectItem       - 收款记录列表查询
 *  @param       id
 */
export const receivableSelectItem = (data) => {     
    return axios({
        url: '/coupon/receivable/selectItem',
        method: 'post',
        data
    })
}
/**    
 *  @function    addReceivableItem       - 新建收款记录
 *  @param       id
 */
export const addReceivableItem = (data) => {
    return axios({
        url: '/coupon/receivable/addReceivableItem',
        method: 'post',
        data
    })
}
/**    
 *  @function    receivableUpdateState       - 终止收款单功能接口
 *  @param       id
 */
export const receivableUpdateState = (data) => {
    return axios({
        url: '/coupon/receivable/updateState',
        method: 'post',
        data
    })
}

/**
 * 票卷批次记录弹窗
 * 
 * @function alertSaleList 
 */
export const alertSaleList = (data) => {
    return axios({
        url: 'coupon/apply/query',
        method: 'post',
        data
    })
}

/**
 *  组织结构树   用途  -入账影院
 * 
 * @function getOrgTreeAndCinema 
 * @param uid  -localStore use的uid
 */

export const getOrgTreeAndCinema = (data) => {
    return axios({
        url: '/common/consumer/getOrgAndCinemaTree',
        method: 'post',
        data
    })
} 
/**
 *  组织结构树   用途  -交易客商
 * 
 * @function listBuyerCondition 
 * @param uid  -localStore use的uid
 */

export const listBuyerCondition = (data) => {
    return axios({
        url: '/common/buyer/listBuyerCondition',
        method: 'post',
        data
    })
}
export default {
    testGet,
    testPost,
    login,
    /* 查询票券分类信息 */
    findCouponList,
    insertCouponType,
    findCouponTypeName,
    deleteCouponType,
    updateCouponType,

    findCouponCodeList,
    validateCoupon,
    issueCoupon,
    reimburseCoupon,

    getTicketNumerList,
    importExcel,
    exportExcel,
    createCouponBatch,

    getBaseConfig,
    updateBaseConfig,

    /* 票券销售申请单 */
    findSaleList,
    saleListCheckName,
    saleListSaveOrUpdate,
    abandonSaleList,
    createAuditBill,
    couponExport,
    findByStartAndNum,
    stopSaleList,
    startSaleList,
    deleteSaleList,
    delaySaleList,
    checkSaleList,

    /* 票券编号查询 */
    queryCodeList,
    cancelCode,
    exportTemplate,
    queryCodeListCount,
    /* 票券打印 */
    findCouponByCondition,
    ticketPrinting,
    reprint,

    /* 票券模板 */
    findcouponPrintModelDef,
    selectmodel,
    addmodel,
    deletemodel,
    selectmodelid,
    addBackgroundImg,
    setdefault,

    /* 票卷批次记录弹窗 */
    alertSaleList,
    getOrgTreeAndCinema,
    listBuyerCondition,
    /* 应收款管理*/
    receivableList,
    addReceivableItem,
    receivableUpdateState,
    receivableSelectItem
};