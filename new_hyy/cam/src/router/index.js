const camRoutes = [
  // 入口开始
  {
    path: 'new/home',
    meta: {
      title: '首页',
      hidden: true
    },
    component: resolve => require(['../views/home/home.vue'], resolve),
    name: '首页'
  },
  {
    path: 'new/sale/home',
    meta: {
      title: '卖品概览',
      hidden: true
    },
    component: resolve => require(['../views/home/saleHome.vue'], resolve),
    name: '卖品概览'
  },
  {
    path: 'new/member/home',
    meta: {
      title: '会员概览',
      hidden: true,
      keepAlive: false
    },
    component: resolve => require(['../views/home/memberHome.vue'], resolve),
    name: '会员概览'
  },
  {
    path: 'new/boxOffice/home',
    meta: {
      title: '票房概览',
      hidden: true
    },
    component: resolve => require(['../views/home/boxOfficeHome.vue'], resolve),
    name: '票房概览'
  },
  {
    path: 'new/market/home',
    meta: {
      title: '票劵概览',
      hidden: true
    },
    component: resolve => require(['../views/home/ticketsHome.vue'], resolve),
    name: '票劵概览'
  },
  // 入口结束
  {
    path: 'group/home',
    meta: {
      title: '经营分析概览'
    },
    component: resolve => require(['../views/group/home.vue'], resolve),
    name: '经营分析概览'
  },
  {
    path: 'area/home',
    meta: {
      title: '经营分析概览'
    },
    component: resolve => require(['../views/area/home.vue'], resolve),
    name: '经营分析概览'
  },
  {
    path: 'cinema/home',
    meta: {
      title: '经营分析概览'
    },
    component: resolve => require(['../views/cinema/home.vue'], resolve),
    name: '经营分析概览'
  },
  {
    path: 'group/boxOffice/total',
    meta: {
      title: '票房概览'
    },
    component: resolve =>
      require(['../views/boxOffice/group-boxOffice-use.vue'], resolve),
    name: '票房概览'
  },
  {
    path: 'area/boxOffice/total',
    meta: {
      title: '票房概览'
    },
    component: resolve =>
      require(['../views/boxOffice/area-boxOffice-use.vue'], resolve),
    name: '票房概览'
  },
  {
    path: 'cinema/boxOffice/total',
    meta: {
      title: '票房概览'
    },
    component: resolve =>
      require(['../views/boxOffice/cinema-boxOffice-use.vue'], resolve),
    name: '票房概览'
  },
  {
    path: 'group/sale/total',
    meta: {
      title: '卖品概览'
    },
    component: resolve =>
      require(['../views/sellGoods/overview/sale-group-total.vue'], resolve),
    name: '卖品概览'
  },
  {
    path: 'area/sale/total',
    meta: {
      title: '卖品概览'
    },
    component: resolve =>
      require(['../views/sellGoods/overview/sale-area-total.vue'], resolve),
    name: '卖品概览'
  },
  {
    path: 'cinema/sale/total',
    meta: {
      title: '卖品概览'
    },
    component: resolve =>
      require(['../views/sellGoods/overview/sale-cinema-total.vue'], resolve),
    name: '卖品概览'
  },
  {
    path: 'group/member/total',
    meta: {
      title: '会员概览',
      keepAlive: false
    },
    component: resolve =>
      require(['../views/member/group-member-total.vue'], resolve),
    name: '会员概览'
  },
  {
    path: 'area/member/total',
    meta: {
      title: '会员概览',
      keepAlive: false
    },
    component: resolve =>
      require(['../views/member/area-member-total.vue'], resolve),
    name: '会员概览'
  },
  {
    path: 'cinema/member/total',
    meta: {
      title: '会员概览',
      keepAlive: false
    },
    component: resolve =>
      require(['../views/member/cinema-member-total.vue'], resolve),
    name: '会员概览'
  },
  {
    path: 'group/tickets',
    meta: {
      title: '票券概览'
    },
    component: resolve =>
      require(['../views/market/ticket/tickets-group.vue'], resolve),
    name: '票券概览'
  },
  {
    path: 'area/tickets',
    meta: {
      title: '票券概览'
    },
    component: resolve =>
      require(['../views/market/ticket/tickets-area.vue'], resolve),
    name: '票券概览'
  },
  {
    path: 'cinema/tickets',
    meta: {
      title: '票券概览'
    },
    component: resolve =>
      require(['../views/market/ticket/tickets-cinema.vue'], resolve),
    name: '票券概览'
  },
  {
    path: 'group/inventory',
    meta: {
      title: '进销存分析',
      keepAlive: true
    },
    component: resolve =>
      require(['../views/sellGoods/inventory/inventory-use.vue'], resolve),
    name: '进销存分析'
  },
  {
    path: 'cinema/replenish',
    meta: {
      title: '影院缺货明细',
      keepAlive: true
    },
    component: resolve =>
      require(['../views/sellGoods/inventory/outof-stock.vue'], resolve),
    name: '影院缺货明细'
  },
  {
    path: 'cinema/unsale',
    meta: {
      title: '影院滞销明细',
      keepAlive: true
    },
    component: resolve =>
      require(['../views/sellGoods/inventory/slow-sale.vue'], resolve),
    name: '影院滞销明细'
  },
  {
    path: 'group/cinema/manage',
    meta: {
      title: '竞对影院管理',
      keepAlive: true
    },
    component: resolve =>
      require(['../views/setting/compete-cinema-manage.vue'], resolve),
    name: '竞对影院管理'
  },
  {
    path: 'group/cinema/kpi',
    meta: {
      title: '影院KPI管理',
      keepAlive: true
    },
    component: resolve => require(['../views/setting/cinema-kpi.vue'], resolve),
    name: '影院KPI管理'
  },
  {
    path: 'group/sale/manage',
    meta: {
      title: '卖品规则管理',
      keepAlive: true
    },
    component: resolve =>
      require(['../views/setting/sale-manage.vue'], resolve),
    name: '卖品规则管理'
  },
  // 营销分析
  {
    path: 'group/ticket/use',
    meta: {
      title: '票劵使用效果分析'
      // keepAlive:true
    },
    component: resolve =>
      require(['../views/market/ticket/ticket-group-use.vue'], resolve),
    name: '票劵使用效果分析'
  },
  {
    path: 'area/ticket/use',
    meta: {
      title: '票劵使用效果分析'
      // keepAlive:true
    },
    component: resolve =>
      require(['../views/market/ticket/ticket-area-use.vue'], resolve),
    name: '票劵使用效果分析'
  },
  {
    path: 'cinema/ticket/use',
    meta: {
      title: '票劵使用效果分析'
      // keepAlive:true
    },
    component: resolve =>
      require(['../views/market/ticket/ticket-cinema-use.vue'], resolve),
    name: '票劵使用效果分析'
  },
  {
    path: 'group/category/total',
    meta: {
      title: '品类分析'
      // keepAlive:true
    },
    component: resolve =>
      require(['../views/sellGoods/category/category-use.vue'], resolve),
    name: '品类分析'
  },
  {
    path: 'area/category/total',
    meta: {
      title: '品类分析'
      // keepAlive:true
    },
    component: resolve =>
      require(['../views/sellGoods/category/category-use.vue'], resolve),
    name: '品类分析'
  },
  {
    path: 'cinema/category/total',
    meta: {
      title: '品类分析'
      // keepAlive:true
    },
    component: resolve =>
      require(['../views/sellGoods/category/category-use.vue'], resolve),
    name: '品类分析'
  },
  {
    path: 'group/channel/total',
    meta: {
      title: '渠道分析'
      // keepAlive:true
    },
    component: resolve =>
      require(['../views/sellGoods/channel/channel-use.vue'], resolve),
    name: '渠道分析'
  },
  {
    path: 'area/channel/total',
    meta: {
      title: '渠道分析'
      // keepAlive:true
    },
    component: resolve =>
      require(['../views/sellGoods/channel/channel-use.vue'], resolve),
    name: '渠道分析'
  },
  {
    path: 'cinema/channel/total',
    meta: {
      title: '渠道分析'
      // keepAlive:true
    },
    component: resolve =>
      require(['../views/sellGoods/channel/channel-use.vue'], resolve),
    name: '渠道分析'
  },
  {
    path: 'group/commodity/total',
    meta: {
      title: '商品分析'
    },
    component: resolve =>
      require(['../views/sellGoods/commodity/commodity-use.vue'], resolve),
    name: '商品分析'
  },
  {
    path: 'area/commodity/total',
    meta: {
      title: '商品分析'
    },
    component: resolve =>
      require(['../views/sellGoods/commodity/commodity-use.vue'], resolve),
    name: '商品分析'
  },
  {
    path: 'cinema/commodity/total',
    meta: {
      title: '商品分析'
    },
    component: resolve =>
      require(['../views/sellGoods/commodity/commodity-use.vue'], resolve),
    name: '商品分析'
  },
  {
    path: 'common/commodity/detail',
    meta: {
      title: '商品详情'
    },
    component: resolve =>
      require([
        '../views/sellGoods/commodity/commodity-detail-use.vue'
      ], resolve),
    name: '商品详情'
  }
];
export default camRoutes;
