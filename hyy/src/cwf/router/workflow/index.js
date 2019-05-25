const routes = [{
        path: 'link',
        meta: {
            title: '审批工作流链接页'
        },
        component: (resolve) => require(['../../views/workflow/link.vue'], resolve),
        name: '审批工作流链接页'
    },
    {
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
            title: '查看审批'
        },
        component: (resolve) => require(['../../views/workflow/normalApproval/check.vue'], resolve),
        name: '查看审批'
    },
    {
        path: 'approvalNormalApproval',
        meta: {
            title: '审批审批'
        },
        component: (resolve) => require(['../../views/workflow/normalApproval/approval.vue'], resolve),
        name: '审批审批'
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
            title: '编辑审批流程设置'
        },
        component: (resolve) => require(['../../views/workflow/approvalSetting/edit.vue'], resolve),
        name: '编辑审批流程设置'
    },
    {
        path: 'checkApprovalSetting',
        meta: {
            title: '查看审批流程设置'
        },
        component: (resolve) => require(['../../views/workflow/approvalSetting/check.vue'], resolve),
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
            title: '编辑业务单据审批设置'
        },
        component: (resolve) => require(['../../views/workflow/billSetting/edit.vue'], resolve),
        name: '编辑业务单据审批设置'
    }
]

export default routes