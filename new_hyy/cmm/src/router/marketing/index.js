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
        path: 'movieTicketActivity/edit',
        name: '修改影票活动',
        meta: {
            title: '修改影票活动',
        },
        component: (resolve) => require(['../../views/marketing/movieTicketActivity/edit.vue'], resolve),
    },
    {
        path: 'movieTicketActivity/revise',
        name: '修订影票活动',
        meta: {
            title: '修订影票活动',
        },
        component: (resolve) => require(['../../views/marketing/movieTicketActivity/revise.vue'], resolve),
    },
    {
        path: 'movieTicketActivity/create',
        name: '新建影票活动',
        meta: {
            title: '新建影票活动',
        },
        component: (resolve) => require(['../../views/marketing/movieTicketActivity/create.vue'], resolve),
    },
    {
        path: 'movieTicketActivity/copy',
        name: '复制影票活动',
        meta: {
            title: '复制影票活动',
        },
        component: (resolve) => require(['../../views/marketing/movieTicketActivity/copy.vue'], resolve),
    },

    //卖品活动管理
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
        path: 'salesActivity/edit',
        name: '修改卖品活动',
        meta: {
            title: '修改卖品活动',
        },
        component: (resolve) => require(['../../views/marketing/salesActivity/edit.vue'], resolve),
    },
    {
        path: 'salesActivity/revise',
        name: '修订卖品活动',
        meta: {
            title: '修订卖品活动',
        },
        component: (resolve) => require(['../../views/marketing/salesActivity/revise.vue'], resolve),
    },
    {
        path: 'salesActivity/create',
        name: '新建卖品活动',
        meta: {
            title: '新建卖品活动',
        },
        component: (resolve) => require(['../../views/marketing/salesActivity/create.vue'], resolve),
    },
    {
        path: 'salesActivity/copy',
        name: '复制卖品活动',
        meta: {
            title: '复制卖品活动',
        },
        component: (resolve) => require(['../../views/marketing/salesActivity/copy.vue'], resolve),
    },
    //套票促销活动管理
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
        path: 'packagePromotionActivity/edit',
        name: '修改套票促销活动',
        meta: {
            title: '修改套票促销活动',
        },
        component: (resolve) => require(['../../views/marketing/packagePromotionActivity/edit.vue'], resolve),
    },
    {
        path: 'packagePromotionActivity/revise',
        name: '修订套票促销活动',
        meta: {
            title: '修订套票促销活动',
        },
        component: (resolve) => require(['../../views/marketing/packagePromotionActivity/revise.vue'], resolve),
    },
    {
        path: 'packagePromotionActivity/create',
        name: '新建套票促销活动',
        meta: {
            title: '新建套票促销活动',
        },
        component: (resolve) => require(['../../views/marketing/packagePromotionActivity/create.vue'], resolve),
    },
    {
        path: 'packagePromotionActivity/copy',
        name: '复制套票促销活动',
        meta: {
            title: '复制套票促销活动',
        },
        component: (resolve) => require(['../../views/marketing/packagePromotionActivity/copy.vue'], resolve),
    },
    //赠送积分活动管理
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
        path: 'giftPointsActivity/edit',
        name: '修改赠送积分活动',
        meta: {
            title: '修改赠送积分活动',
        },
        component: (resolve) => require(['../../views/marketing/giftPointsActivity/edit.vue'], resolve),
    },
    {
        path: 'giftPointsActivity/revise',
        name: '修订赠送积分活动',
        meta: {
            title: '修订赠送积分活动',
        },
        component: (resolve) => require(['../../views/marketing/giftPointsActivity/revise.vue'], resolve),
    },
    {
        path: 'giftPointsActivity/create',
        name: '新建赠送积分活动',
        meta: {
            title: '新建赠送积分活动',
        },
        component: (resolve) => require(['../../views/marketing/giftPointsActivity/create.vue'], resolve),
    },
    {
        path: 'giftPointsActivity/copy',
        name: '复制赠送积分活动',
        meta: {
            title: '复制赠送积分活动',
        },
        component: (resolve) => require(['../../views/marketing/giftPointsActivity/copy.vue'], resolve),
    },
    //赠送余额活动管理
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
        path: 'giftBalanceActivity/edit',
        name: '修改赠送余额活动',
        meta: {
            title: '修改赠送余额活动',
        },
        component: (resolve) => require(['../../views/marketing/giftBalanceActivity/edit.vue'], resolve),
    },
    {
        path: 'giftBalanceActivity/revise',
        name: '修订赠送余额活动',
        meta: {
            title: '修订赠送余额活动',
        },
        component: (resolve) => require(['../../views/marketing/giftBalanceActivity/revise.vue'], resolve),
    },
    {
        path: 'giftBalanceActivity/create',
        name: '新建赠送余额活动',
        meta: {
            title: '新建赠送余额活动',
        },
        component: (resolve) => require(['../../views/marketing/giftBalanceActivity/create.vue'], resolve),
    },
    {
        path: 'giftBalanceActivity/copy',
        name: '复制赠送余额活动',
        meta: {
            title: '复制赠送余额活动',
        },
        component: (resolve) => require(['../../views/marketing/giftBalanceActivity/copy.vue'], resolve),
    },
    //赠送票券活动管理
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
        path: 'giftTicketsActivity/edit',
        name: '修改赠送票券活动',
        meta: {
            title: '修改赠送票券活动',
        },
        component: (resolve) => require(['../../views/marketing/giftTicketsActivity/edit.vue'], resolve),
    },
    {
        path: 'giftTicketsActivity/revise',
        name: '修订赠送票券活动',
        meta: {
            title: '修订赠送票券活动',
        },
        component: (resolve) => require(['../../views/marketing/giftTicketsActivity/revise.vue'], resolve),
    },
    {
        path: 'giftTicketsActivity/create',
        name: '新建赠送票券活动',
        meta: {
            title: '新建赠送票券活动',
        },
        component: (resolve) => require(['../../views/marketing/giftTicketsActivity/create.vue'], resolve),
    },
    {
        path: 'giftTicketsActivity/copy',
        name: '复制赠送票券活动',
        meta: {
            title: '复制赠送票券活动',
        },
        component: (resolve) => require(['../../views/marketing/giftTicketsActivity/copy.vue'], resolve),
    },
    //自定义营销活动管理
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
    },
    {
        path: 'userDefinedActivity/edit',
        name: '修改自定义营销活动',
        meta: {
            title: '修改自定义营销活动',
        },
        component: (resolve) => require(['../../views/marketing/userDefinedActivity/edit.vue'], resolve),
    },
    {
        path: 'userDefinedActivity/revise',
        name: '修订自定义营销活动',
        meta: {
            title: '修订自定义营销活动',
        },
        component: (resolve) => require(['../../views/marketing/userDefinedActivity/revise.vue'], resolve),
    },
    {
        path: 'userDefinedActivity/create',
        name: '新建自定义营销活动',
        meta: {
            title: '新建自定义营销活动',
        },
        component: (resolve) => require(['../../views/marketing/userDefinedActivity/create.vue'], resolve),
    },
    {
        path: 'userDefinedActivity/copy',
        name: '复制自定义营销活动',
        meta: {
            title: '复制自定义营销活动',
        },
        component: (resolve) => require(['../../views/marketing/userDefinedActivity/copy.vue'], resolve),
    },
]

export default marketingRoutes