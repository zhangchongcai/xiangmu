// 不带底部bar的子路由页面
const memberRouters = [

    {
        path: 'memberHome',
        meta: {
            title: '会员首页'
        },
        name: 'memberHome',
        component: () => import('views/member/memberHome'),
    },
    {
        path: 'queryDetails',
        meta: {
            title: '查询详情'
        },
        name: 'queryDetails',
        component: () => import('views/member/queryDetail'),
    },
    {
        path: 'memberApplyCard',
        meta: {
            title: '会员开卡'
        },
        name: 'memberApplyCard',
        component: () => import('views/member/memberApplyCard'),
    },
    {
        path: 'memberRecharge',
        meta: {
            title: '会员充值'
        },
        name: 'memberRecharge',
        component: () => import('views/member/memberRecharge'),
    },
    {
        path: 'memberChangePsd',
        meta: {
            title: '会员修改密码'
        },
        name: 'memberChangePsd',
        component: () => import('views/member/memberChangePsd'),
    },
    {
        path: 'lossCard',
        meta: {
            title: '挂失/解挂'
        },
        name: 'lossCard',
        component: () => import('views/member/lossCard'),
    },
    {
        path: 'resetPsd',
        meta: {
            title: '重置密码'
        },
        name: 'resetPsd',
        component: () => import('views//member/resetPsd'),
    },
    {
        path: 'repairCard',
        meta: {
            title: '补卡'
        },
        name: 'repairCard',
        component: () => import('views/member/repairCard'),
    },
    {
        path: 'cancellationCard',
        meta: {
            title: '会员注销'
        },
        name: 'cancellationCard',
        component: () => import('views/member/cancellationCard'),
    },
    {
        path: 'ModifyData',
        meta: {
            title: '修改资料'
        },
        name: 'ModifyData',
        component: () => import('views/member/ModifyData'),
    },
    {
        path: 'sterilisation',
        meta: {
            title: '冲销'
        },
        name: 'sterilisation',
        component: () => import('views/member/sterilisation'),
    },
    {
        path: 'turnBalance',
        meta: {
            title: '余额转结'
        },
        name: 'turnBalance',
        component: () => import('views/member/turnBalance'),
    },
    {
        path: 'memberThaw',
        meta: {
            title: '解冻'
        },
        name: 'memberThaw',
        component: () => import('views/member/memberThaw'),
    },
    {
        path: 'records',
        meta: {
            title: '交易记录'
        },
        name: 'records',
        component: () => import('views/member/checkPagers/TransactionRecords/index'),
    },
    {
        path: 'recordDetail/:flowNo',
        meta: {
            title: '交易详情'
        },
        name: 'recordDetail',
        component: () => import('views/member/checkPagers/TransactionRecords/recordDetail')
    },
    {
        path: 'bindTicket',
        meta: {
            title: '绑定票券'
        },
        name: 'bindTicket',
        component: () => import('views/member/checkPagers/bindTicket/index'),
    },
    {
        path: 'changeRecord',
        meta: {
            title: '变更记录'
        },
        name: 'bindTicket',
        component: () => import('views/member/checkPagers/changeRecord/index'),
    },
    {
        path: 'applyCinema',
        meta: {
            title: '适用影院'
        },
        name: 'applyCinema',
        component: () => import('views/member/checkPagers/applyCinema/index'),
    }
]

export default memberRouters