
const routerView = {template: '<router-view></router-view>'};

let routes = [
  // {
  //   path: 'index',
  //   meta: {
  //     title: '销售主页'
  //   },
  //   component: (resolve) => require(['csm/views/index.vue'], resolve),
  //   name: '销售主页'
  // }, 
  {
    path: 'clearAccountList',
    meta: {
      title: '班次收银管理',
      hidden: true
    },
    name: '班次收银管理',
    component: routerView,
    redirect: 'clearAccountList/list',
    children: [{
      path: 'list',
      meta: {
        title: '班次收银管理'
      },
      component: (resolve) => require(['csm/views/finance/workTime/clearAccount/list.vue'], resolve),
      name: '班次收银管理',
    }, {
      path: 'add',
      meta: {
        title: '上班登记'
      },
      component: (resolve) => require(['csm/views/finance/workTime/clearAccount/add.vue'], resolve),
      name: '上班登记'
    },{
      path: 'detail',
      meta: {
        title: '结算详情'
      },
      component: (resolve) => require(['csm/views/finance/workTime/clearAccount/detail.vue'], resolve),
      name: '结算详情'
    },{
      path: 'adjust',
      meta: {
        title: '追加领用'
      },
      component: (resolve) => require(['csm/views/finance/workTime/clearAccount/adjust.vue'], resolve),
      name: '追加领用'
    },{
      path: 'close',
      meta: {
        title: '开始结算'
      },
      component: (resolve) => require(['csm/views/finance/workTime/clearAccount/close.vue'], resolve),
      name: '开始结算'
    },{
      path: 'moneyAdjust',
      meta: {
        title: '资金调整单'
      },
      component: (resolve) => require(['csm/views/finance/workTime/clearAccount/moneyAdjust.vue'], resolve),
      name: '资金调整单'
    }]
  },
  // 订单管理
  {
    path: 'trandingRecord',
    meta: {
      title: '订单管理',
      hidden: true
    },
    name: '交易管理',
    component: routerView,
    redirect: 'trandingRecord/list',
    children: [{
      path: 'list',
      meta: {
        title: '交易管理'
      },
      component: (resolve) => require(['csm/views/finance/workTime/tradingRecord/list.vue'], resolve),
      name: '交易管理',
    }, {
      path: 'detail',
      meta: {
        title: '上班登记'
      },
      component: (resolve) => require(['csm/views/finance/workTime/tradingRecord/detail.vue'], resolve),
      name: '上班登记'
    }]
  },
  // 领用物品管理
  {
    path: 'thingManage',
    meta: {
      title: '领用物品管理',
      hidden: true
    },
    component: routerView,
    // redirect: 'thingManage/list',
    redirect:'ceshi',
    name: '领用物品管理',
    children:[{
      path: 'list',
      meta: {
        title: '领用物品管理'
      },
      component: (resolve) => require(['csm/views/finance/workTime/thingManage/list.vue'], resolve),
      name: '上班登记'
    },{
      path: 'add',
      meta: {
        title: '添加物品'
      },
      component: (resolve) => require(['csm/views/finance/workTime/thingManage/add.vue'], resolve),
      name: '上班登记'
    }]
  },
   // 抽钞记录管理
   {
    path: 'takeMoney',
    meta: {
      title: '抽钞记录管理',
      hidden: true
    },
    component: routerView,
    redirect: 'takeMoney/list',
    name: '抽钞记录管理',
    children:[{
      path: 'list',
      meta: {
        title: '抽钞记录管理'
      },
      component: (resolve) => require(['csm/views/finance/workTime/takeMoney/list.vue'], resolve),
      name: '抽钞记录管理'
    }]
  },
  {
    path: 'payment',
    meta: {
      title: '支付方式管理'
    },
    component: (resolve) => require(['csm/views/payment/Payment.vue'], resolve),
    name: '支付方式管理',
  },
  {
    path: 'cinemaChannel',
    meta: {
      title: '影院渠道管理'
    },
    component: (resolve) => require(['csm/views/channelManage/Cinema.vue'], resolve),
    name: '影院渠道管理',
  },
  {
    path: 'headquartersChannel',
    meta: {
      title: '总部渠道管理'
    },
    component: (resolve) => require(['csm/views/channelManage/Headquarters.vue'], resolve),
    name: '总部渠道管理',
  },
  {
    path: 'cinemaChannelParam',
    meta: {
      title: '影院渠道参数设置'
    },
    component: (resolve) => require(['csm/views/channelManage/CinemaParam.vue'], resolve),
    name: '影院渠道参数设置',
  },
  {
    path: 'cinema',
    meta: {
      title: '总部渠道管理'
    },
    component: (resolve) => require(['csm/views/finance/workTime/public/singleCinema.vue'], resolve),
    name: '总部渠道管理',
  },
  {
    path: 'ceshi',
    meta: {
      title: '总部渠道管理'
    },
    component: (resolve) => require(['csm/views/finance/workTime/publicModule/ceshi.vue'], resolve),
    name: '总部渠道管理',
  },
];


export default routes;