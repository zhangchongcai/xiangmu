const routerView = {
  template: `<keep-alive v-if="$route.meta.keepAlive">
  <router-view></router-view>
  </keep-alive>
  <router-view v-else-if="!$route.meta.keepAlive">
  </router-view>`
  // template:'<keep-alive><router-view></router-view></<keep-alive>'
};

let routes = [{
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
    }, {
      path: 'detail',
      meta: {
        title: '结算详情'
      },
      component: (resolve) => require(['csm/views/finance/workTime/clearAccount/detail.vue'], resolve),
      name: '结算详情'
    }, {
      path: 'adjust',
      meta: {
        title: '追加领用'
      },
      component: (resolve) => require(['csm/views/finance/workTime/clearAccount/adjust.vue'], resolve),
      name: '追加领用'
    }, {
      path: 'close',
      meta: {
        title: '开始结算'
      },
      component: (resolve) => require(['csm/views/finance/workTime/clearAccount/close.vue'], resolve),
      name: '开始结算'
    }, {
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
      hidden: true,
      keepAlive: true // 需要被缓存
    },
    name: '交易管理',
    component: routerView,
    redirect: 'trandingRecord/list',
    children: [{
      path: 'list',
      meta: {
        title: '交易管理',
        keepAlive: true // 需要被缓存
      },
      component: (resolve) => require(['csm/views/finance/workTime/tradingRecord/list.vue'], resolve),
      name: '交易管理',
    }, {
      path: 'detail',
      meta: {
        title: '查看详情',
        keepAlive: false // 需要被缓存
      },
      component: (resolve) => require(['csm/views/finance/workTime/tradingRecord/detail.vue'], resolve),
      name: '查看详情'
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
    redirect: 'thingManage/list',
    name: '领用物品管理',
    children: [{
      path: 'list',
      meta: {
        title: '领用物品管理'
      },
      component: (resolve) => require(['csm/views/finance/workTime/thingManage/list.vue'], resolve),
      name: '领用物品管理'
    }, {
      path: 'add',
      meta: {
        title: '添加物品'
      },
      component: (resolve) => require(['csm/views/finance/workTime/thingManage/add.vue'], resolve),
      name: '添加物品'
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
    children: [{
      path: 'list',
      meta: {
        title: '抽钞记录管理'
      },
      // component: (resolve) => require(['csm/views/finance/workTime/salesLocation/list.vue'], resolve), 
      component: (resolve) => require(['csm/views/finance/workTime/takeMoney/list.vue'], resolve),
      name: '抽钞记录管理'
    }]
  },
  { // 销售地点管理
    path: 'saleLocation',
    meta: {
      title: '销售地点',
      hidden: true
    },
    component: routerView,
    redirect: 'saleLocation/list',
    name: '销售地点',
    children: [{
      path: 'list',
      meta: {
        title: '销售地点管理'
      },
      component: (resolve) => require(['csm/views/finance/workTime/salesLocation/list.vue'], resolve),
      name: '抽钞记录管理'
    }, {
      path: 'add',
      meta: {
        title: '新建销售地点'
      },
      component: (resolve) => require(['csm/views/finance/workTime/salesLocation/add.vue'], resolve),
      name: '新建销售地点'
    }, {
      path: 'change',
      meta: {
        title: '修改销售地点'
      },
      component: (resolve) => require(['csm/views/finance/workTime/salesLocation/change.vue'], resolve),
      name: '修改销售地点'
    }]
  },
  { // 资金调整单管理
    path: 'adjustManage',
    meta: {
      title: '资金调整单管理',
      hidden: true
    },
    component: routerView,
    redirect: 'clearAccountList/moneyAdjust',
    name: '资金调整管理',
    children: [{
      path: 'list',
      meta: {
        title: '资金调整管理'
      },
      component: (resolve) => require(['csm/views/finance/workTime/adjustManage/list.vue'], resolve),
      name: '资金调整管理'
    }]
  },
  { // 资金科目管理
    path: 'subjectManage',
    meta: {
      title: '资金科目管理',
      hidden: true
    },
    component: routerView,
    redirect: 'subjectManage/list',
    name: '资金科目管理',
    children: [{
      path: 'list',
      meta: {
        title: '资金科目管理'
      },
      component: (resolve) => require(['csm/views/finance/workTime/subjectManage/list.vue'], resolve),
      name: '资金科目管理'
    }]
  },
  {  // 抽钞记录管理
    path: 'salesManage',
    meta: {
      title: '销售终端管理',
      hidden: true
    },
    component: routerView,
    redirect: 'salesManage/list',
    name: '销售终端管理',
    children: [{
      path: 'list',
      meta: {
        title: '销售终端管理'
      },
      component: (resolve) => require(['csm/views/finance/workTime/salesManage/list.vue'], resolve),
      name: '销售终端管理'
    }]
  },
  //  公共接口
  {
    path: 'headquartersPayment',
    meta: {
      title: '总部支付方式管理'
    },
    component: (resolve) => require(['csm/views/paymentManage/HeadquartersView.vue'], resolve),
    name: '总部支付方式管理',
  },
  {
    path: 'cinemaPayment',
    meta: {
      title: '影院支付方式管理'
    },
    component: (resolve) => require(['csm/views/paymentManage/CinemaView.vue'], resolve),
    name: '影院支付方式管理',
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
    path: 'cinemaChannelDetail',
    meta: {
      title: '影院渠道详情'
    },
    component: (resolve) => require(['csm/views/channelManage/CinemaDetail.vue'], resolve),
    name: '影院渠道详情',
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