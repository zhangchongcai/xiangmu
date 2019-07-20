import axios from "frame_cpm/http/api.js";
/**
 * 将所有接口统一起来便于维护
 * 如果项目很大可以将 URL 独立成文件，接口分成不同的模块
 */
/**


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
    })
}

/**
 * @function  - 审批任务
 * 
 * @param {Object} data 
 * @param {Number} data.id - 营销活动id
 * @param {String} data.tenantId - 租户id
 * 
 */

export const commitApproval = data => {
    return axios({
        url: '/workflow/AuthorizationSearching/approvalSubtas',
        method: 'post',
        data
    })
}

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
    })
}

/**
 * @function  - 新建审批流程
 * 
 * @param {Object} data 
 * @param {String} data.name - 审批流程方案名称
 * @param {Number} data.noteNum - 节点数
 * @param {Array<object>} data.processList - 流程表
 * -@param {String} data.processList.assigneeId - 受理人/角色ID
 * -@param {String} data.processList.assigneeName - 受理人/角色 名称
 * -@param {String} data.processList.assigneeType - 受理人类型 0:个人 1:角色
 * -@param {Number} data.processList.nextNoteNum - 下一个节点id
 * -@param {Number} data.processList.noteNum - 流程的第几个节点
 * -@param {Number} data.processList.tenantId - 租户id
 * @param {Number} data.status - 状态
 * @param {Number} data.tenantId - 租户id
 * 
 */

export const addApprovalProcess = data => {
    return axios({
        url: '/workflow/manage/create',
        method: 'post',
        data
    })
}

/**
 * @function  - 修改审批流程
 * 
 * @param {Object} data 
 * @param {String} data.name - 审批流程名称
 * @param {Array<object>} data.processList - 流程表
 * -@param {String} data.processList.assigneeId - 受理人/角色ID
 * -@param {String} data.processList.assigneeName - 受理人/角色 名称
 * -@param {String} data.processList.assigneeType - 受理人类型 0:个人 1:角色
 * -@param {Number} data.processList.id - 受理人类型 0:个人 1:角色
 * 
 */

export const editApprovalProcess = data => {
    return axios({
        url: '/workflow/manage/update',
        method: 'post',
        data
    })
}

/**
 * @function  - 查询审批流程
 * 
 * @param {Object} data 
 * @param {Number} data.pageNo - 页数
 * 
 */

export const selectApprovalProcess = data => {
    return axios({
        url: '/workflow/manage/query',
        method: 'post',
        data
    })
}

/**
 * @function  - 删除审批流程
 * 
 * @param {Object} data 
 * @param {Number} data.id - 审批流程id
 * 
 */

export const deleteApprovalProcess = data => {
    return axios({
        url: '/workflow/manage/delete',
        method: 'post',
        data
    })
}

/**
 * @function  - 用租户ID获取用户
 * 
 * @param {Object} data 
 * @param {Number} data.tenantId - 审批流程id
 * 
 */

export const getUserInfo = params => {
    return axios({
        url: '/common/user/getUserInfo',
        method: 'post',
        params
    })
}

/**
 * @function  - 用租户ID获取角色
 * 
 * @param {Object} data 
 * @param {Number} data.tenantId - 审批流程id
 * 
 */

export const getRoleInfo = params => {
    return axios({
        url: '/common/role/getRoleInfo',
        method: 'post',
        params
    })
}

/**
 * @function  - 获取租户下组织结构
 * 
 * @param {Object} data 
 * @param {Number} data.consumerId - 审批流程id
 * 
 */

export const getOrgTree = data => {
    return axios({
        url: '/common/consumer/getOrgTree',
        method: 'post',
        data
    })
}

/**
 * @function  - 获取租户下组织结构(最新)
 * 
 * @param {Object} data 
 * @param {Number} data.userUid - 用户组织id
 * 
 */

export const getOrgTreeAndCinema = data => {
    return axios({
        url: '/common/consumer/getOrgTreeAndCinema',
        method: 'post',
        data
    })
}

/**
 * @function  - 业务个性单据设置-通用设置
 * 
 * @param {Object} data 
 * @param {Number} data.global - 是否全局设置0-服务器异常1-成功
 * @param {Number} data.orginizationId - 组织结构id
 * @param {Number} data.tenantId - 租户id
 * 
 */

export const getBillNormalSetting = params => {
    return axios({
        url: '/workflow/type/query',
        method: 'post',
        params
    })
}

/**
 * @function  - 业务个性单据设置-查询商户个性设置列表
 * 
 * @param {Object} data 
 * @param {Number} data.pageNo - 页数
 * @param {Number} data.pageSize - 条数
 * @param {Number} data.tenantId - 租户id
 * @param {Number} data.orginizationName - 使用商户名称
 * 
 */

export const searchBillSetting = params => {
    return axios({
        url: '/workflow/type/queryBusinessName',
        method: 'post',
        params
    })
}

/**
 * @function  - 业务个性单据设置-按商户个性设置列表
 * 
 * @param {Object} data 
 * @param {Number} data.pageNo - 页数
 * @param {Number} data.pageSize - 条数
 * @param {Number} data.tenantId - 租户id
 * 
 */

export const getBillSettingList = params => {
        return axios({
            url: '/workflow/type/queryPersonalization',
            method: 'post',
            params
        })
    }
    /**
     * @function  - 业务个性单据设置-检查是否新建时有重复的组织节点
     * 
     * @param {Object} data 
     * @param {Number} data.pageNo - 页数
     * @param {Number} data.pageSize - 条数
     * @param {Number} data.tenantId - 租户id
     * 
     */

export const querySetHistory = params => {
    return axios({
        url: '/workflow/type/querySetHistory',
        method: 'post',
        params
    })
}

/**
 * @function  - 修改业务个性单据设置
 * 
 * @param {Object} data 
 * @param {Array} data.list - 是否全局设置0-服务器异常1-成功
 * -@param {String} data.list.businessTypeCode - 业务类型编码
 * -@param {Number} data.list.global - 是否全局设置0-是 1-否
 * -@param {Number} data.list.orginizationId - 组织结构id
 * -@param {Number} data.list.id - id
 * -@param {String} data.list.orginizationName - 组织结构名称
 * -@param {Number} data.list.tenantId - 租户id
 * -@param {Number} data.list.workflowBusinessId - 流程方案id
 * 
 */

export const editBillSetting = data => {
    return axios({
        url: '/workflow/type/update',
        method: 'post',
        data
    })
}


/**
 * @function  - 保存业务通用单据设置
 * 
 * @param {Object} data 
 * @param {Array} data.list - 是否全局设置0-服务器异常1-成功
 * -@param {String} data.list.businessTypeCode - 业务类型编码
 * -@param {Number} data.list.global - 是否全局设置0-是 1-否
 * -@param {Number} data.list.orginizationId - 组织结构id
 * -@param {String} data.list.orginizationName - 组织结构名称
 * -@param {Number} data.list.tenantId - 租户id
 * -@param {Number} data.list.workflowBusinessId - 流程方案id
 * 
 */

export const saveBillSetting = data => {
    return axios({
        url: '/workflow/type/setUp',
        method: 'post',
        data
    })
}

/**
 * @function  - 新建业务个性单据设置
 * 
 * @param {Object} data 
 * @param {Array} data.list - 是否全局设置0-服务器异常1-成功
 * -@param {String} data.list.businessTypeCode - 业务类型编码
 * -@param {Number} data.list.global - 是否全局设置0-是 1-否
 * -@param {Number} data.list.orginizationId - 组织结构id
 * -@param {String} data.list.orginizationName - 组织结构名称
 * -@param {Number} data.list.tenantId - 租户id
 * -@param {Number} data.list.workflowBusinessId - 流程方案id
 * 
 */

export const addPersonalSetting = data => {
    return axios({
        url: '/workflow/type/setPersonalized',
        method: 'post',
        data
    })
}

/**
 * @function  - 删除业务个性单据设置
 * 
 * @param {Object} data 
 * -@param {Number} data.orginizationId - 组织结构id
 * -@param {Number} data.tenantId - 租户id
 * 
 */

export const deleteBillSetting = params => {
    return axios({
        url: '/workflow/type/delete',
        method: 'post',
        params
    })
}



export default {

    //业务审批接口
    searchApproval,
    commitApproval,
    getApprovalrecord,

    //业务流程接口
    editApprovalProcess,
    deleteApprovalProcess,
    addApprovalProcess,
    selectApprovalProcess,

    //业务个性单据设置接口
    searchBillSetting,
    getBillNormalSetting,
    getBillSettingList,
    saveBillSetting,
    editBillSetting,
    deleteBillSetting,
    addPersonalSetting,
    querySetHistory,


    getUserInfo,
    getRoleInfo,
    getOrgTree,
    getOrgTreeAndCinema
};