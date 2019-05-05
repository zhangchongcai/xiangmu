let routes = [
    {
        path: 'DataCenter=T01',
        meta: {
            title: 'T01影院营业收入日报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterT01'
    },
    {
        path: 'DataCenter=R03',
        meta: {
            title: 'R03商品销售汇总报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterR03'
    },
    {
        path: 'DataCenter=R24',
        meta: {
            title: 'R24影院营业综合日报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterR24'
    },
    {
        path: 'DataCenter=R25',
        meta: {
            title: 'R25团购网电影票结算报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterR25'
    },
    {
        path: 'DataCenter=R26',
        meta: {
            title: 'R26团购网卖品结算报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterR26'
    },
    {
        path: 'DataCenter=R27',
        meta: {
            title: 'R27按取票渠道统计取票取货报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterR27'
    },
    {
        path: 'DataCenter=S04',
        meta: {
            title: 'S04商品进销存月报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterS04'
    }
]


export default routes;