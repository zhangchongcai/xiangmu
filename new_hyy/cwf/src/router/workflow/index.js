const routes = [{
        path: 'normalApproval',
        meta: {
            title: '常规业务审批'
        },
        component: (resolve) => require(['../../views/workflow/normalApproval/index.vue'], resolve),
        name: '常规业务审批'
    },
    {
        path: 'checkNormalApproval',
        meta: {
            title: '审批详情'
        },
        component: (resolve) => require(['../../views/workflow/normalApproval/checkNormalApproval.vue'], resolve),
        name: '审批详情'
    },
    {
        path: 'approvalSetting',
        meta: {
            title: '审批流程设置'
        },
        component: (resolve) => require(['../../views/workflow/approvalSetting/index.vue'], resolve),
        name: '审批流程设置'
    },
    {
        path: 'editApprovalSetting',
        meta: {
            title: '操作审批流程设置'
        },
        component: (resolve) => require(['../../views/workflow/approvalSetting/editApprovalSetting.vue'], resolve),
        name: '操作审批流程设置'
    },
    {
        path: 'checkApprovalSetting',
        meta: {
            title: '查看审批流程设置'
        },
        component: (resolve) => require(['../../views/workflow/approvalSetting/checkApprovalSetting.vue'], resolve),
        name: '查看审批流程设置'
    },
    {
        path: 'billSetting',
        meta: {
            title: '业务单据审批设置'
        },
        component: (resolve) => require(['../../views/workflow/billSetting/index.vue'], resolve),
        name: '业务单据审批设置'
    },
    {
        path: 'editBillSetting',
        meta: {
            title: '操作业务单据审批设置'
        },
        component: (resolve) => require(['../../views/workflow/billSetting/editBillSetting.vue'], resolve),
        name: '操作业务单据审批设置'
    }
]

export default routes