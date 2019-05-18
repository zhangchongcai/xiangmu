let routes = [
    {
        path: 'DataCenter=R01',
        meta: {
            title: 'R01影院营业收入报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterR01'
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
        path: 'DataCenter=R04',
        meta: {
            title: 'R04清机日报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterR04'
    },
    {
        path: 'DataCenter=R05',
        meta: {
            title: 'R05收银员销售收入日报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterR05'
    },
    {
        path: 'DataCenter=R07',
        meta: {
            title: 'R07会员业务报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterR07'
    },
    {
        path: 'DataCenter=R08',
        meta: {
            title: 'R08会员消费报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterR08'
    },
    {
        path: 'DataCenter=R10',
        meta: {
            title: 'R10取票取货统计报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterR10'
    },
    {
        path: 'DataCenter=R12',
        meta: {
            title: 'R12合作商电影票结算报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterR12'
    },
    {
        path: 'DataCenter=R13',
        meta: {
            title: 'R13代理商卖品结算报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterR13'
    },
    {
        path: 'DataCenter=R20',
        meta: {
            title: 'R20影院补贴汇总统计表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterR20'
    },
    {
        path: 'DataCenter=R23',
        meta: {
            title: 'R23影院营业收入月报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterR23'
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
        path: 'DataCenter=T01',
        meta: {
            title: 'T01影院营业收入日报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterT01'
    },
    {
        path: 'DataCenter=T02',
        meta: {
            title: 'T02放映场次票房报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterT02'
    },
    {
        path: 'DataCenter=T03',
        meta: {
            title: 'T03电影票销售收入报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterT03'
    },
    {
        path: 'DataCenter=T04',
        meta: {
            title: 'T04票类分类销售汇总收入日报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterT04'
    },
    {
        path: 'DataCenter=T05',
        meta: {
            title: 'T04电影票销售明细报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterT05'
    },
    {
        path: 'DataCenter=T07',
        meta: {
            title: 'T07票房分账报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterT07'
    },
    {
        path: 'DataCenter=T08',
        meta: {
            title: 'T08影片票房汇总表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterT08'
    },
    {
        path: 'DataCenter=T09',
        meta: {
            title: 'T09国产进口影片统计报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterT09'
    },
    {
        path: 'DataCenter=M01',
        meta: {
            title: 'M01 商品销售明细报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterM01'
    },
    {
        path: 'DataCenter=M02',
        meta: {
            title: 'M02商品销售日报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterM02'
    },
    {
        path: 'DataCenter=M03',
        meta: {
            title: 'M03商品销售汇总报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterM03'
    },
    {
        path: 'DataCenter=M04',
        meta: {
            title: 'M04套餐子商品销售汇总表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterM04'
    },
    {
        path: 'DataCenter=S01',
        meta: {
            title: 'S01商品库存查询报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterS01'
    },
    {
        path: 'DataCenter=S02',
        meta: {
            title: 'S02商品出入库明细报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterS02'
    },
    {
        path: 'DataCenter=S04',
        meta: {
            title: 'S04商品进销存月报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterS04'
    },
    {
        path: 'DataCenter=S06',
        meta: {
            title: 'S06影院商品分类成本分析报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterS06'
    },
    {
        path: 'DataCenter=S12',
        meta: {
            title: 'S12影院报损明细报表'
        },
        component: (resolve) => require(['../views/dataCenter.vue'], resolve),
        name: 'DataCenterS12'
    },
    
]


export default routes;