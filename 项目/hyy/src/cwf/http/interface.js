import axios from './api';
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

export const login = data =>{
    return axios({
        url: '/login' ,
        method: 'post' ,
        data
    })
}

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
        // url: '/AuthorizationSearching/findspAuditBill',
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
export const getUserInfo = data => {
    return axios({
        url: '/workflow/manage/getUserInfo',
        method: 'post',
        data
    })
}
/**
 * @function  - 用租户ID获取角色
 * 
 * @param {Object} data 
 * @param {Number} data.tenantId - 审批流程id
 * 
 */
export const getRoleInfo = data => {
    return axios({
        url: '/workflow/manage/getRoleInfo',
        method: 'post',
        data
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
 * @function  - 业务单据审批查询设置
 * 
 * @param {Object} data 
 * @param {Number} data.global - 是否全局设置0-服务器异常1-成功
 * @param {Number} data.orginizationId - 组织结构id
 * @param {Number} data.tenantId - 租户id
 * 
 */

export const getBillSettingList = data => {
    return axios({
        url: '/workflow/type/query',
        method: 'post',
        data
    })
}

export default { 
    testGet ,
    testPost ,
    login,

    searchApproval,
    commitApproval,
    getApprovalrecord,

    editApprovalProcess,
    deleteApprovalProcess,
    addApprovalProcess,
    selectApprovalProcess,

    
    
    getUserInfo,
    getRoleInfo,
    getOrgTree,
    getBillSettingList
    
};