let routes = [{
        path: 'DataCenter=R01',
        meta: {
            title: 'R01影院营业收入报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterR01.vue'], resolve),
        name: 'DataCenterR01'
    },
    {
        path: 'DataCenter=R02',
        meta: {
            title: 'R02支付记录分析报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterR02.vue'], resolve),
        name: 'DataCenterR02'
    },
    {
        path: 'DataCenter=R03',
        meta: {
            title: 'R03清机日报表 '
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterR03.vue'], resolve),
        name: 'DataCenterR03'
    },
    {
        path: 'DataCenter=R04',
        meta: {
            title: 'R04收银员销售收入日报表 '
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterR04.vue'], resolve),
        name: 'DataCenterR04'
    },
    {
        path: 'DataCenter=R05',
        meta: {
            title: 'R05 会员业务报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterR05.vue'], resolve),
        name: 'DataCenterR05'
    },
    {
        path: 'DataCenter=R06',
        meta: {
            title: 'R06会员消费报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterR06.vue'], resolve),
        name: 'DataCenterR06'
    },
    {
        path: 'DataCenter=R07',
        meta: {
            title: 'R07按交易渠道统计取票取货报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterR07.vue'], resolve),
        name: 'DataCenterR07'
    },
    {
        path: 'DataCenter=R08',
        meta: {
            title: 'R08按取票渠道统计取票取货报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterR08.vue'], resolve),
        name: 'DataCenterR08'
    },
    {
        path: 'DataCenter=R09',
        meta: {
            title: 'R09合作商电影票结算报表 '
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterR09.vue'], resolve),
        name: 'DataCenterR09'
    },
    {
        path: 'DataCenter=R10',
        meta: {
            title: 'R10 代理商卖品结算报表 '
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterR10.vue'], resolve),
        name: 'DataCenterR10'
    },
    {
        path: 'DataCenter=R11',
        meta: {
            title: 'R11影院补贴汇总统计表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterR11.vue'], resolve),
        name: 'DataCenterR11'
    },
    {
        path: 'DataCenter=R12',
        meta: {
            title: 'R12影院营运综合分析报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterR12.vue'], resolve),
        name: 'DataCenterR12'
    },
    {
        path: 'DataCenter=R15',
        meta: {
            title: 'R15按取票渠道统计取票取货报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterR15.vue'], resolve),
        name: 'DataCenterR15'
    },
    {
        path: 'DataCenter=R20',
        meta: {
            title: 'R20影院补贴汇总统计表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterR20.vue'], resolve),
        name: 'DataCenterR20'
    },
    {
        path: 'DataCenter=R23',
        meta: {
            title: 'R23影院营业收入月报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterR23.vue'], resolve),
        name: 'DataCenterR23'
    },
    {
        path: 'DataCenter=R24',
        meta: {
            title: 'R24影院营业综合日报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterR24.vue'], resolve),
        name: 'DataCenterR24'
    },
    {
        path: 'DataCenter=R25',
        meta: {
            title: 'R25团购网电影票结算报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterR25.vue'], resolve),
        name: 'DataCenterR25'
    },
    {
        path: 'DataCenter=R26',
        meta: {
            title: 'R26团购网卖品结算报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterR26.vue'], resolve),
        name: 'DataCenterR26'
    },
    {
        path: 'DataCenter=R27',
        meta: {
            title: 'R27按取票渠道统计取票取货报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterR27.vue'], resolve),
        name: 'DataCenterR27'
    },
    {
        path: 'DataCenter=T01',
        meta: {
            title: 'T01影片票房日报表 '
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterT01.vue'], resolve),
        name: 'DataCenterT01'
    },
    {
        path: 'DataCenter=T02',
        meta: {
            title: 'T02放映场次票房报表 '
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterT02.vue'], resolve),
        name: 'DataCenterT02'
    },
    {
        path: 'DataCenter=T03',
        meta: {
            title: 'T03电影票销售收入报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterT03.vue'], resolve),
        name: 'DataCenterT03'
    },
    {
        path: 'DataCenter=T04',
        meta: {
            title: 'T04票类分类销售汇总收入日报表 '
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterT04.vue'], resolve),
        name: 'DataCenterT04'
    },
    {
        path: 'DataCenter=T05',
        meta: {
            title: 'T05电影票销售明细报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterT05.vue'], resolve),
        name: 'DataCenterT05'
    },
    {
        path: 'DataCenter=T06',
        meta: {
            title: 'T06票房分账报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterT06.vue'], resolve),
        name: 'DataCenterT06'
    },
    {
        path: 'DataCenter=T07',
        meta: {
            title: 'T07影片票房汇总表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterT07.vue'], resolve),
        name: 'DataCenterT07'
    },
    {
        path: 'DataCenter=T08',
        meta: {
            title: 'T08国产进口影片统计报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterT08.vue'], resolve),
        name: 'DataCenterT08'
    },
    {
        path: 'DataCenter=T09',
        meta: {
            title: 'T09国产进口影片统计报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterT09.vue'], resolve),
        name: 'DataCenterT09'
    },
    {
        path: 'DataCenter=M01',
        meta: {
            title: 'M01商品销售明细报表 '
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterM01.vue'], resolve),
        name: 'DataCenterM01'
    },
    {
        path: 'DataCenter=M02',
        meta: {
            title: 'M02商品销售日报表 '
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterM02.vue'], resolve),
        name: 'DataCenterM02'
    },
    {
        path: 'DataCenter=M03',
        meta: {
            title: 'M03商品销售汇总报表 '
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterM03.vue'], resolve),
        name: 'DataCenterM03'
    },
    {
        path: 'DataCenter=M04',
        meta: {
            title: 'M04套餐子商品销售汇总表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterM04.vue'], resolve),
        name: 'DataCenterM04'
    },
    {
        path: 'DataCenter=M05',
        meta: {
            title: 'M05商品毛利率汇总报表 '
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterM05.vue'], resolve),
        name: 'DataCenterM05'
    },
    {
        path: 'DataCenter=S01',
        meta: {
            title: 'S01商品库存查询报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterS01.vue'], resolve),
        name: 'DataCenterS01'
    },
    {
        path: 'DataCenter=S02',
        meta: {
            title: 'S02商品出入库明细报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterS02.vue'], resolve),
        name: 'DataCenterS02'
    },
    {
        path: 'DataCenter=S03',
        meta: {
            title: 'S03商品进销存报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterS03.vue'], resolve),
        name: 'DataCenterS03'
    },
    {
        path: 'DataCenter=S04',
        meta: {
            title: 'S04影院商品分类成本分析报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterS04.vue'], resolve),
        name: 'DataCenterS04'
    },
    {
        path: 'DataCenter=S05',
        meta: {
            title: 'S05影院报损明细报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterS05.vue'], resolve),
        name: 'DataCenterS05'
    },
    {
        path: 'DataCenter=S06',
        meta: {
            title: 'S06影院商品分类成本分析报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterS06.vue'], resolve),
        name: 'DataCenterS06'
    },
    {
        path: 'DataCenter=S12',
        meta: {
            title: 'S12影院报损明细报表'
        },
        component: (resolve) => require(['../views/dataCenter/dataCenterS12.vue'], resolve),
        name: 'DataCenterS12'
    },

]


export default routes;