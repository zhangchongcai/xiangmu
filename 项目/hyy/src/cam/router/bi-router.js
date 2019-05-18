let routes = [
    {
        path: 'new/home',
        meta: {
            title: '首页'
        },
        component: (resolve) => require(['../views/home/home.vue'], resolve),
        name: '首页'
    },
    {
        path: 'new/sale/home',
        meta: {
            title: '卖品概览'
        },
        component: (resolve) => require(['../views/home/saleHome.vue'], resolve),
        name: '卖品概览'
    },
    {
        path: 'group/home',
        meta: {
            title: '首页'
        },
        component: (resolve) => require(['../views/group/home.vue'], resolve),
        name: '首页'
    },
    {
        path: 'area/home',
        meta: {
            title: '城市体首页'
        },
        component: (resolve) => require(['../views/area/home.vue'], resolve),
        name: '城市体首页'
    },
    {
        path: 'cinema/home',
        meta: {
            title: '影院首页'
        },
        component: (resolve) => require(['../views/cinema/home.vue'], resolve),
        name: '影院首页'
    },
    {
        path: 'group/sale/total',
        meta: {
            title: '集团卖品分析'
        },
        component: (resolve) => require(['../views/group/sale-total.vue'], resolve),
        name: '集团卖品分析'
    },
    {
        path: 'area/sale/total',
        meta: {
            title: '城市体卖品分析'
        },
        component: (resolve) => require(['../views/area/sale-total.vue'], resolve),
        name: '城市体卖品分析'
    }, 
    {
        path: 'cinema/sale/total',
        meta: {
            title: '影院卖品分析'
        },
        component: (resolve) => require(['../views/cinema/sale-total.vue'], resolve),
        name: '影院卖品分析'
    },{
      path:'group/inventory',
      meta:{
          title:'集团进销存首页'
      },
      component:(resolve) => require(['../views/group/inventory.vue'],resolve),
      name:'进销存首页'
    },{
        path:'area/inventory',
        meta:{
            title:'城市体进销存首页'
        },
        component:(resolve) => require(['../views/area/inventory.vue'],resolve),
        name:'进销存首页'
      },{
        path:'cinema/inventory',
        meta:{
            title:'影院进销存首页'
        },
        component:(resolve) => require(['../views/cinema/inventory.vue'],resolve),
        name:'进销存首页'
    },{
        path:'cinema/replenish',
        meta:{
            title:'影院补货明细'
        },
        component:(resolve) => require(['../views/cinema/replenish.vue'],resolve),
        name:'影院补货明细'
    },{
        path:'cinema/unsale',
        meta:{
            title:'影院滞销明细'
        },
        component:(resolve) => require(['../views/cinema/unsale.vue'],resolve),
        name:'影院滞销明细'
    },{
        path:'group/cinema/manage',
        meta:{
            title:'竞对影院管理'
        },
        component:(resolve) => require(['../views/group/cinemaManage.vue'],resolve),
        name:'竞对影院管理'
    },
    // {
    //     path:'area/cinema/manage',
    //     meta:{
    //         title:'城市竞对影院管理'
    //     },
    //     component:(resolve) => require(['../views/area/cinemaManage.vue'],resolve),
    //     name:'城市竞对影院管理'
    // },
    // {
    //     path:'cinema/cinema/manage',
    //     meta:{
    //         title:'影院竞对影院管理'
    //     },
    //     component:(resolve) => require(['../views/cinema/cinemaManage.vue'],resolve),
    //     name:'影院竞对影院管理'
    // },
    {
        path:'group/cinema/kpi',
        meta:{
            title:'影院KPI管理'
        },
        component:(resolve) => require(['../views/group/cinemaKpi.vue'],resolve),
        name:'影院KPI管理'
    },{
        path:'group/sale/manage',
        meta:{
            title:'卖品规则管理'
        },
        component:(resolve) => require(['../views/group/saleManage.vue'],resolve),
        name:'卖品规则管理'
    }
];

export default routes;