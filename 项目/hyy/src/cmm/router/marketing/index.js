// marketing router-children
const marketingRoutes = [
    // 影票活动管理
    {
        path: 'movieTicketActivity',
        name: '影票活动管理',
        meta: {
            title: '影票活动管理',
        },
        component: (resolve) => require(['../../views/marketing/movieTicketActivity/list.vue'], resolve),
    },
    {
        path: 'movieTicketActivity/detail',
        name: '影票活动管理详情',
        meta: {
            title: '影票活动管理详情',
        },
        component: (resolve) => require(['../../views/marketing/movieTicketActivity/detail.vue'], resolve),
    },
    {
        path: 'salesActivity',
        name: '卖品活动管理',
        meta: {
            title: '卖品活动管理',
        },
        component: (resolve) => require(['../../views/marketing/salesActivity/list.vue'], resolve),
    },
    {
        path: "salesActivity/detail",
        meta: {
            title: "卖品活动管理详情"
        },
        component: resolve =>
            require(["../../views/marketing/salesActivity/detail.vue"], resolve),
        name: "卖品活动管理详情"
    },
    {
        path: 'packagePromotionActivity',
        name: '套票促销活动管理',
        meta: {
            title: '套票促销活动管理',
        },
        component: (resolve) => require(['../../views/marketing/packagePromotionActivity/list.vue'], resolve),
    },
    {
        path: "packagePromotionActivity/detail",
            meta: {
                title: "套票促销活动管理详情"
            },
            component: resolve =>
                require(["../../views/marketing/packagePromotionActivity/detail.vue"], resolve),
            name: "套票促销活动管理详情"
    },
    {
        path: 'giftPointsActivity',
        name: '赠送积分活动管理',
        meta: {
            title: '赠送积分活动管理',
        },
        component: (resolve) => require(['../../views/marketing/giftPointsActivity/list.vue'], resolve),
    },
    {
        path: "giftPointsActivity/detail",
        meta: {
            title: "赠送积分活动管理详情"
        },
        component: resolve =>
            require(["../../views/marketing/giftPointsActivity/detail.vue"], resolve),
        name: "赠送积分活动管理详情"
    },
    {
        path: 'giftBalanceActivity',
        name: '赠送余额活动管理',
        meta: {
            title: '赠送余额活动管理',
        },
        component: (resolve) => require(['../../views/marketing/giftBalanceActivity/list.vue'], resolve),
    },
    {
        path: "giftBalanceActivity/detail",
            meta: {
                title: "赠送余额活动管理详情"
            },
            component: resolve =>
                require(["../../views/marketing/giftBalanceActivity/detail.vue"], resolve),
            name: "赠送余额活动管理详情"
    },
    {
        path: 'giftTicketsActivity',
        name: '赠送票券活动管理',
        meta: {
            title: '赠送票券活动管理',
        },
        component: (resolve) => require(['../../views/marketing/giftTicketsActivity/list.vue'], resolve),
    },
    {
        path: "giftTicketsActivity/detail",
            meta: {
                title: "赠送票券活动管理详情"
            },
            component: resolve =>
                require(["../../views/marketing/giftTicketsActivity/detail.vue"], resolve),
            name: "赠送票券活动管理详情"
    },
    {
        path: 'userDefinedActivity',
        name: '自定义营销活动管理',
        meta: {
            title: '自定义营销活动管理',
        },
        component: (resolve) => require(['../../views/marketing/userDefinedActivity/list.vue'], resolve),
    },
    {
        path: "userDefinedActivity/detail",
            meta: {
                title: "自定义营销活动管理详情"
            },
            component: resolve =>
                require(["../../views/marketing/userDefinedActivity/detail.vue"], resolve),
            name: "自定义营销活动管理详情"
    }
]

export default marketingRoutes