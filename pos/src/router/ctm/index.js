// ctm router-children
const routerView = {template: '<router-view></router-view>'};

const ctmRoutes = [
  {
    path: 'index',
    meta: {
      title: '票务主页'
    },
    component: (resolve) => require(['views/ctm/index.vue'], resolve),
    name: '票务主页'
  },
  {
    path: 'projectionPlan',
    meta: {
      title: '放映计划',
      hidden: true
    },
    name: '放映计划',
    component: (resolve) => require(['views/ctm/moviePlan/planManage/Index.vue'], resolve),
    redirect: 'projectionPlan/manage',
    children: [
      {
      path: 'manage',
      meta: {
        title: '管理放映计划'
      },
      component: (resolve) => require(['views/ctm/moviePlan/planManage/Manage.vue'], resolve),
      name: '管理放映计划',
    }, {
      path: 'audit',
      meta: {
        title: '放映计划审核'
      },
      component: (resolve) => require(['views/ctm/moviePlan/planApprove/Audit.vue'], resolve),
      name: '放映计划审核',
    }, {
      path: 'openCloseSale',
      meta: {
        title: '场次渠道开停售'
      },
      component: (resolve) => require(['views/ctm/moviePlan/planChannel/OpenCloseSale.vue'], resolve),
      name: '场次渠道开停售',
    }]
  },
  {
    path: 'boxOfficeReport',
    meta: {
      title: '票房上报',
      hidden: true
    },
    name: '票房上报',
    component: (resolve) => require(['views/ctm/boxOfficeReport/Index.vue'], resolve),
    redirect: 'boxOfficeReport/control',
    children: [{
      path: 'control',
      meta: {
        title: '上报监控'
      },
      component: (resolve) => require(['views/ctm/boxOfficeReport/Control.vue'], resolve),
      name: '上报监控',
    }]
  },
  {
    path: 'moviePlan',
    meta: {
      title: '编辑放映计划'
    },
    component: routerView,
    redirect: 'moviePlan/layout',
    children: [
        {
        path: 'layout',
        meta: {
          title: '设置放映计划'
        },
        component: (resolve) => require(['views/ctm/moviePlan/planEdit/layout.vue'], resolve),
        name: '设置放映计划'
      },
      {
        path: 'detail',
        meta: {
          title: '计划详情'
        },
        component: (resolve) => require(['views/ctm/moviePlan/planEdit/detail.vue'], resolve),
        name: '计划详情'
      },
      {
        path: 'planReference',
        meta: {
          title: '排片参考'
        },
        component: (resolve) => require(['views/ctm/moviePlan/planEdit/planReference.vue'], resolve),
        name: '排片参考'
      }
    ]
  },
  // 影片管理
  // 影院影片库
  {
    path: 'Film_manage/cinema_stock',
    meta: {
      title: '影院影片库'
    },
    component: (resolve) => require(['views/ctm/movieManage/cinemaMovie/index.vue'], resolve),
    name: '影院影片库',
    redirect: '/Film_manage/cinema_stock/list',
    children: [{
      path: 'list',
      meta: {
        title: '影院影片库列表',
        hidden: true
      },
      component: (resolve) => require(['views/ctm/movieManage/cinemaMovie/common/List.vue'], resolve),
      name: '影院影片库列表',
    },
      {
        path: 'edit',
        meta: {
          title: '影院影片库编辑',
          hidden: true
        },
        component: (resolve) => require(['views/ctm/movieManage/cinemaMovie/common/Edit.vue'], resolve),
        name: '影院影片库编辑',
      },
      {
        path: 'scan',
        meta: {
          title: '查看影片庫信息',
          hidden: true
        },
        component: (resolve) => require(['views/ctm/movieManage/cinemaMovie/common/Scan.vue'], resolve),
        name: '查看影片庫信息',
      }

    ]
  },
  //下载影片
  {
    path: 'Film_manage/Download_films',
    meta: {
      title: '下载影片'
    },
    redirect: '/Film_manage/list',
    component: (resolve) => require(['views/ctm/movieManage/groupMovie/index.vue'], resolve),
    name: '下载影片',
    children: [{
      path: 'edit',
      meta: {
        title: '修改影片信息'
      },
      component: (resolve) => require(['views/ctm/movieManage/groupMovie/common/Edit.vue'], resolve),
      name: '修改影片',
    },
      {
        path: 'list',
        meta: {
          title: '影片列表',
          hidden: true,
        },
        component: (resolve) => require(['views/ctm/movieManage/groupMovie/common/List.vue'], resolve)
      },
      {
        path: 'scan',
        meta: {
          title: '查看影片信息',
          hidden: true,
        },
        component: (resolve) => require(['views/ctm/movieManage/groupMovie/common/Scan.vue'], resolve)
      }
    ]
  },
  //价格方案
  {
    path: 'ticketPrice_Plan',
    name: "价格方案",
    meta: {
      title: "价格方案"
    },
    component: (resolve) => require(['views/ctm/pricePlan/index.vue'], resolve),
    children: [{
      path: 'list',
      meta: {
        title: '价格方案列表'
      },
      component: (resolve) => require(['views/ctm/pricePlan/common/List.vue'], resolve),
    },
      {
        path: 'add',
        meta: {
          title: '新建价格方案'
        },
        component: (resolve) => require(['views/ctm/pricePlan/common/Add.vue'], resolve),
      },
      {
        path: 'scan',
        meta: {
          title: '查看价格方案'
        },
        component: (resolve) => require(['views/ctm/pricePlan/common/Scan.vue'], resolve),
      },
      {
        path: 'edit',
        meta: {
          title: '修改价格方案'
        },
        component: (resolve) => require(['views/ctm/pricePlan/common/Edit.vue'], resolve),
      },
    ]

  },
  // 票类票版
  {
    path: 'ticketTypeManage',
    name: 'ticketTypeManage',
    meta: {
      title: '票类管理',
    },
    component: (resolve) => require(['views/ctm/ticketType/ticketType.vue'], resolve),

  },
  //票版编辑
  {
    path: 'ticketSampleManage',
    name: 'ticketSampleManage',
    meta: {
      title: '票版管理',
    },
    component: (resolve) => require(['views/ctm/ticketSample/index'], resolve),
    redirect: 'ticketSampleManage/list',
    children: [
      {
        path: 'list',
        name: 'list',
        meta: {
          title: '票版管理',
        },
        component: (resolve) => require(['views/ctm/ticketSample/ticketSample'], resolve),
      },
      {
        path: 'ticketdesign',
        meta: {
          title: '票版编辑'
        },
        component: (resolve) => require(['views/ctm/ticketSample/TicketDesign'], resolve),
      },
      {
        path:'ticketdetail',
        meta:{
            title:'票版详情'
        },
        component: (resolve) => require(['views/ctm/ticketSample/TicketSearchDetail'], resolve),
    }
    ]

  },
  // 影厅管理
  {
    path: 'cinemawall',
    meta: {
      title: '影厅管理',
    },
    component: routerView,
    name: '影厅管理',
    redirect: 'cinemawall/list',
    children: [{
      path: 'list',
      meta: {
        title: '影厅list'
      },
      component: (resolve) => require(['views/ctm/cinemaManage/hallInfo/List.vue'], resolve),
      name: '影厅list',
    },
    {
      path: 'addAndnew',
      meta: {
          title: '影厅edit'
      },
      component: (resolve) => require(['views/ctm/cinemaManage/hallInfo/addAndEdit.vue'], resolve),
      name: '影厅修改新建'
  },
      {
        path: 'seatdesign',
        meta: {
          title: '座位编辑'
        },
        component: (resolve) => require(['views/ctm/cinemaManage/seatInfo/SeatDesign'], resolve),
        name: '座位编辑'
      }
    ]
  },
  // 影院管理
  {
    path: 'cinema',
    name: 'cinemaManage',
    meta: {
      title: '影院管理',
    },
    component: routerView,
    redirect: 'cinema/list',
    children: [
      {
        path: 'list',
        name: '影院列表',
        meta: {
          title: '影院列表'
        },
        component: (resolve) => require(['views/ctm/cinemaManage/cinemaInfo/List'], resolve),
      },
      {
        path: 'edit',
        name: 'cinemaInfoEdit',
        meta: {
          title: '影院编辑'
        },
        component: (resolve) => require(['views/ctm/cinemaManage/cinemaInfo/Edit'], resolve),
      },
      {
        path: 'search',
        name: '影院查看',
        meta: {
          title: '影院查看'
        },
        component: (resolve) => require(['views/ctm/cinemaManage/cinemaInfo/search'], resolve),
      },

    ]
  }

];

export default ctmRoutes;