const ctmRoutes = [
  {
    path: 'index',
    meta: {
      title: '票务主页'
    },
    component: resolve => require(['ctmSrc/views/index'], resolve),
    name: '票务主页'
  },
  {
    path: 'projectionPlan',
    meta: {
      title: '放映计划',
      hidden: true
    },
    name: '放映计划',
    component: resolve =>
      require(['ctmSrc/views/moviePlan/planManage/Index'], resolve),
    redirect: 'projectionPlan/manage',
    children: [
      {
        path: 'manage',
        meta: {
          title: '管理放映计划'
        },
        component: resolve =>
          require(['ctmSrc/views/moviePlan/planManage/Manage'], resolve),
        name: '管理放映计划'
      },
      {
        path: 'audit',
        meta: {
          title: '放映计划审核'
        },
        component: resolve =>
          require(['ctmSrc/views/moviePlan/planApprove/Audit'], resolve),
        name: '放映计划审核'
      },
      {
        path: 'openCloseSale',
        meta: {
          title: '场次渠道开停售'
        },
        component: resolve =>
          require([
            'ctmSrc/views/moviePlan/planChannel/OpenCloseSale'
          ], resolve),
        name: '场次渠道开停售'
      }
    ]
  },
  {
    path: 'boxOfficeReport',
    meta: {
      title: '票房上报',
      hidden: true
    },
    name: '票房上报',
    component: resolve =>
      require(['ctmSrc/views/boxOfficeReport/Index'], resolve),
    redirect: 'boxOfficeReport/control',
    children: [
      {
        path: 'control',
        meta: {
          title: '票房上报'
        },
        component: resolve =>
          require(['ctmSrc/views/boxOfficeReport/Control'], resolve),
        name: '票房上报'
      }
    ]
  },
  {
    path: 'regionTypeManage',
    meta: {
      title: '分区类型管理',
      hidden: true
    },
    name: '分区类型管理',
    component: resolve =>
      require(['ctmSrc/views/regionTypeManage/Index'], resolve),
    redirect: 'regionTypeManage/main',
    children: [
      {
        path: 'main',
        meta: {
          title: '分区类型管理'
        },
        component: resolve =>
          require(['ctmSrc/views/regionTypeManage/Main'], resolve),
        name: '分区类型管理'
      }
    ]
  },
  {
    path: 'scheduleInfo',
    meta: {
      title: '排片信息表',
      hidden: true
    },
    name: '排片信息表',
    component: resolve => require(['ctmSrc/views/scheduleInfo/Index'], resolve),
    redirect: 'scheduleInfo/list',
    children: [
      {
        path: 'list',
        meta: {
          title: '排片信息表'
        },
        component: resolve =>
          require(['ctmSrc/views/scheduleInfo/List'], resolve),
        name: '排片信息表'
      },
      {
        path: 'add',
        meta: {
          title: '新建排片信息表'
        },
        component: resolve =>
          require(['ctmSrc/views/scheduleInfo/Add'], resolve),
        name: '新建排片信息表'
      },
      {
        path: 'edit',
        meta: {
          title: '编辑排片信息表'
        },
        component: resolve =>
          require(['ctmSrc/views/scheduleInfo/Add'], resolve),
        name: '编辑排片信息表'
      },
      {
        path: 'view',
        meta: {
          title: '查看排片信息表'
        },
        component: resolve =>
          require(['ctmSrc/views/scheduleInfo/Add'], resolve),
        name: '查看排片信息表'
      },
      {
        path: 'approve',
        meta: {
          title: '审批排片信息表'
        },
        component: resolve =>
          require(['ctmSrc/views/scheduleInfo/Add'], resolve),
        name: '审批排片信息表'
      }
    ]
  },
  {
    path: 'setPrimeTime',
    meta: {
      title: '设置黄金时段',
      hidden: true
    },
    name: '设置黄金时段',
    component: resolve => require(['ctmSrc/views/setPrimeTime/Index'], resolve),
    redirect: 'setPrimeTime/list',
    children: [
      {
        path: 'list',
        meta: {
          title: '设置黄金时段'
        },
        component: resolve =>
          require(['ctmSrc/views/setPrimeTime/List'], resolve),
        name: '设置黄金时段'
      }
    ]
  },
  // 数据字典
  {
    path: 'dict',
    meta: {
      title: '数据字典'
    },
    component: resolve => require(['ctmSrc/views/dict/index.vue'], resolve),
    redirect: 'dict/list',
    name: '数据字典',
    children: [
      {
        path: 'index',
        meta: {
          title: '数据字典'
        },
        component: resolve => require(['ctmSrc/views/dict/list.vue'], resolve),
        name: '数据字典'
      },
      {
        path: 'detail',
        meta: {
          title: '查看字典'
        },
        component: resolve =>
          require(['ctmSrc/views/dict/detail.vue'], resolve),
        name: '查看字典'
      },
      {
        path: 'create',
        meta: {
          title: '新建字典'
        },
        component: resolve =>
          require(['ctmSrc/views/dict/detail.vue'], resolve),
        name: '新建字典'
      },
      {
        path: 'edit',
        meta: {
          title: '修改字典'
        },
        component: resolve =>
          require(['ctmSrc/views/dict/detail.vue'], resolve),
        name: '修改字典'
      }
    ]
  },
  {
    path: 'moviePlan',
    meta: {
      title: '编排放映计划'
    },
    component: resolve =>
      require(['ctmSrc/views/moviePlan/planEdit/index'], resolve),
    redirect: 'moviePlan/layout',
    children: [
      {
        path: 'layout',
        meta: {
          title: '编排放映计划'
        },
        component: resolve =>
          require(['ctmSrc/views/moviePlan/planEdit/layout'], resolve),
        name: '编排放映计划'
      },
      {
        path: 'scan',
        meta: {
          title: '查看放映计划'
        },
        component: resolve =>
          require(['ctmSrc/views/moviePlan/planEdit/layout'], resolve),
        name: '查看放映计划'
      },
      {
        path: 'add',
        meta: {
          title: '新建排期'
        },
        component: resolve =>
          require(['ctmSrc/views/moviePlan/planEdit/layout'], resolve),
        name: '新建排期'
      },
      {
        path: 'detail',
        meta: {
          title: '计划详情'
        },
        component: resolve =>
          require(['ctmSrc/views/moviePlan/planEdit/detail'], resolve),
        name: '计划详情'
      },
      {
        path: 'planReference',
        meta: {
          title: '排片参考'
        },
        component: resolve =>
          require(['ctmSrc/views/moviePlan/planEdit/planReference'], resolve),
        name: '排片参考'
      },
      {
        path: 'consecutivePlan',
        meta: {
          title: '连排'
        },
        component: resolve =>
          require(['ctmSrc/views/moviePlan/planEdit/consecutivePlan'], resolve),
        name: '连排'
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
    component: resolve =>
      require(['ctmSrc/views/movieManage/cinemaMovie/index'], resolve),
    name: '影院影片库',
    redirect: '/Film_manage/cinema_stock/list',
    children: [
      {
        path: 'list',
        meta: {
          title: '影院影片库列表'
          // hidden: true
        },
        component: resolve =>
          require([
            'ctmSrc/views/movieManage/cinemaMovie/common/List'
          ], resolve),
        name: '影院影片库列表'
      },
      {
        path: 'edit',
        meta: {
          title: '影院影片库编辑'
          // hidden: true
        },
        component: resolve =>
          require([
            'ctmSrc/views/movieManage/cinemaMovie/common/Edit'
          ], resolve),
        name: '影院影片库编辑'
      },
      {
        path: 'scan',
        meta: {
          title: '查看影片库信息'
          // hidden: true
        },
        component: resolve =>
          require([
            'ctmSrc/views/movieManage/cinemaMovie/common/Scan'
          ], resolve),
        name: '查看影片库信息'
      }
    ]
  },
  // 下载影片
  {
    path: 'Film_manage/Download_films',
    meta: {
      title: '下载影片'
    },
    redirect: '/Film_manage/list',
    component: resolve =>
      require(['ctmSrc/views/movieManage/groupMovie/index'], resolve),
    name: '下载影片',
    children: [
      {
        path: 'edit',
        meta: {
          title: '修改影片信息'
        },
        component: resolve =>
          require(['ctmSrc/views/movieManage/groupMovie/common/Edit'], resolve),
        name: '修改影片'
      },
      {
        path: 'list',
        meta: {
          title: '总部影片列表'
          // hidden: true,
        },
        component: resolve =>
          require(['ctmSrc/views/movieManage/groupMovie/common/List'], resolve)
      },
      {
        path: 'scan',
        meta: {
          title: '查看影片信息'
          // hidden: true,
        },
        component: resolve =>
          require(['ctmSrc/views/movieManage/groupMovie/common/Scan'], resolve)
      }
    ]
  },
  // 价格方案
  {
    path: 'ticketPrice_Plan',
    name: '价格方案',
    meta: {
      title: '价格方案'
    },
    component: resolve => require(['ctmSrc/views/pricePlan/index'], resolve),
    children: [
      {
        path: 'list',
        meta: {
          title: '价格方案列表'
        },
        component: resolve =>
          require(['ctmSrc/views/pricePlan/common/List'], resolve)
      },
      {
        path: 'add',
        meta: {
          title: '新建价格方案'
        },
        component: resolve =>
          require(['ctmSrc/views/pricePlan/common/Add'], resolve)
      },
      {
        path: 'scan',
        meta: {
          title: '查看价格方案'
        },
        component: resolve =>
          require(['ctmSrc/views/pricePlan/common/Scan'], resolve)
      },
      {
        path: 'edit',
        meta: {
          title: '修改价格方案'
        },
        component: resolve =>
          require(['ctmSrc/views/pricePlan/common/Edit'], resolve)
      }
    ]
  },
  // 总部排片指导
  {
    path: 'playGuide',
    name: '总部排片指导',
    meta: {
      title: '总部排片指导'
    },
    component: resolve => require(['ctmSrc/views/playGuide/index'], resolve),
    children: [
      {
        path: 'list',
        meta: {
          title: '总部排片指导'
        },
        component: resolve =>
          require(['ctmSrc/views/playGuide/common/List'], resolve)
      },
      {
        path: 'edit',
        meta: {
          title: '编辑排片指导'
        },
        component: resolve =>
          require(['ctmSrc/views/playGuide/common/Edit'], resolve)
      },
      {
        path: 'add',
        meta: {
          title: '新建排片指导'
        },
        component: resolve =>
          require(['ctmSrc/views/playGuide/common/Add'], resolve)
      },
      {
        path: 'scan',
        meta: {
          title: '查看排片指导'
        },
        component: resolve =>
          require(['ctmSrc/views/playGuide/common/Scan'], resolve)
      }
    ]
  },
  // 城市分类管理
  {
    path: 'citySortManager',
    name: '城市分类管理',
    meta: {
      title: '城市分类管理'
    },
    component: resolve =>
      require(['ctmSrc/views/citySortManager/index'], resolve),
    children: [
      {
        path: 'list',
        meta: {
          title: '城市分类管理'
        },
        component: resolve =>
          require(['ctmSrc/views/citySortManager/common/List'], resolve)
      }
    ]
  },
  // 增值服务价格管理
  {
    path: 'extraPrice',
    name: '增值服务价格管理',
    meta: {
      title: '增值服务价格管理'
    },
    component: resolve => require(['ctmSrc/views/extraPrice/index'], resolve),
    children: [
      {
        path: 'list',
        meta: {
          title: '增值服务价格管理'
        },
        component: resolve =>
          require(['ctmSrc/views/extraPrice/common/List'], resolve)
      },
      {
        path: 'edit',
        meta: {
          title: '编辑增值服务费'
        },
        component: resolve =>
          require(['ctmSrc/views/extraPrice/common/Edit'], resolve)
      },
      {
        path: 'add',
        meta: {
          title: '新建增值服务费'
        },
        component: resolve =>
          require(['ctmSrc/views/extraPrice/common/Add'], resolve)
      },
      {
        path: 'scan',
        meta: {
          title: '查看增值服务费'
        },
        component: resolve =>
          require(['ctmSrc/views/extraPrice/common/Scan'], resolve)
      }
    ]
  },
  // 票类票版
  {
    path: 'ticketTypeManage',
    name: 'ticketTypeManage',
    meta: {
      title: '票类管理',
      keepAlive: true
    },
    component: resolve =>
      require(['ctmSrc/views/ticketType/ticketType'], resolve)
  },

  // 票版编辑
  {
    path: 'ticketSampleManage',
    name: 'ticketSampleManage',
    meta: {
      title: '票版管理',
      keepAlive: true
    },
    component: resolve => require(['ctmSrc/views/ticketSample/index'], resolve),
    redirect: 'ticketSampleManage/list',
    children: [
      {
        path: 'list',
        name: 'list',
        meta: {
          title: '票版管理',
          keepAlive: true
        },
        component: resolve =>
          require(['ctmSrc/views/ticketSample/ticketSample'], resolve)
      },
      {
        path: 'ticketdesign',
        meta: {
          title: '票版编辑',
          keepAlive: true
        },
        component: resolve =>
          require(['ctmSrc/views/ticketSample/TicketDesign'], resolve)
      },
      {
        path: 'ticketdetail',
        meta: {
          title: '票版详情',
          keepAlive: true
        },
        component: resolve =>
          require(['ctmSrc/views/ticketSample/TicketSearchDetail'], resolve)
      }
    ]
  },
  // 影厅管理
  {
    path: 'cinemawall',
    meta: {
      title: '影厅管理',
      keepAlive: true
    },
    component: resolve =>
      require(['ctmSrc/views/cinemaManage/hallInfo/index'], resolve),
    name: '影厅管理',
    redirect: 'cinemawall/list',
    children: [
      {
        path: 'list',
        meta: {
          title: '影厅list',
          keepAlive: true
        },
        component: resolve =>
          require(['ctmSrc/views/cinemaManage/hallInfo/List'], resolve),
        name: '影厅list'
      },
      {
        path: 'addAndnew',
        meta: {
          title: '影厅编辑'
        },
        component: resolve =>
          require(['ctmSrc/views/cinemaManage/hallInfo/addAndEdit'], resolve),
        name: '影厅修改新建'
      },
      {
        path: 'seatdesign',
        meta: {
          title: '座位编辑'
        },
        component: resolve =>
          require(['ctmSrc/views/cinemaManage/seatInfo/SeatDesign'], resolve),
        name: '座位编辑'
      }
    ]
  },
  // 影院管理
  {
    path: 'cinema',
    name: 'cinemaManage',
    meta: {
      title: '影院管理'
    },
    component: resolve =>
      require(['ctmSrc/views/cinemaManage/cinemaInfo/index'], resolve),
    redirect: 'cinema/list',
    children: [
      {
        path: 'list',
        name: 'cinemaManageList',
        meta: {
          title: '影院列表'
        },
        component: resolve =>
          require(['ctmSrc/views/cinemaManage/cinemaInfo/List'], resolve)
      },
      {
        path: 'edit',
        name: '影院编辑',
        meta: {
          title: '影院编辑'
        },
        component: resolve =>
          require(['ctmSrc/views/cinemaManage/cinemaInfo/Edit'], resolve)
      },
      {
        path: 'search',
        name: '影院查看',
        meta: {
          title: '影院查看'
        },
        component: resolve =>
          require(['ctmSrc/views/cinemaManage/cinemaInfo/search'], resolve)
      }
    ]
  },
  // 总部排片指导
  {
    path: 'planGuide',
    name: '排片指导',
    meta: {
      title: '排片指导'
    },
    component: resolve => require(['ctmSrc/views/planGuide/index'], resolve),
    children: [
      {
        path: 'list',
        meta: {
          title: '排片指导'
        },
        component: resolve =>
          require(['ctmSrc/views/planGuide/guideList'], resolve)
      },
      {
        path: 'add',
        meta: {
          title: '新建排片指导'
        },
        component: resolve =>
          require(['ctmSrc/views/planGuide/guideDetail'], resolve)
      },
      {
        path: 'view',
        meta: {
          title: '查看排片指导'
        },
        component: resolve =>
          require(['ctmSrc/views/planGuide/guideDetail'], resolve)
      },
      {
        path: 'edit',
        meta: {
          title: '编辑排片指导'
        },
        component: resolve =>
          require(['ctmSrc/views/planGuide/guideDetail'], resolve)
      }
    ]
  },
  // 门店参数
  {
    path: 'sysParam',
    name: 'sysParam',
    meta: {
      title: '门店参数设置'
    },
    component: resolve =>
      require(['ctmSrc/views/system/systemParam/layout'], resolve)
  },
  {
    path: 'softwareUpgrade',
    name: 'softwareUpgrade',
    meta: {
      title: '软件升级信息'
    },
    component: resolve =>
      require(['ctmSrc/views/system/softwareUpgrade/layout'], resolve)
  },

  {
    // 排期展示终端管理
    path: 'filmShow',
    meta: {
      title: '终端账号管理'
    },
    component: resolve => require(['ctmSrc/views/filmShow/index'], resolve),
    redirect: 'filmShow/list',
    name: '终端账号管理',
    children: [
      {
        path: 'list',
        meta: {
          title: '终端账号管理'
        },
        component: resolve =>
          require(['ctmSrc/views/filmShow/list.vue'], resolve),
        name: '终端账号管理'
      },
      {
        path: 'add',
        meta: {
          title: '慧影云排期展示首页'
        },
        component: resolve =>
          require(['ctmSrc/views/filmShow/add.vue'], resolve),
        name: '慧影云排期展示首页'
      },
      {
        path: 'editor',
        meta: {
          title: '排期展示模板编辑'
        },
        component: resolve =>
          require(['ctmSrc/views/filmShow/editor.vue'], resolve),
        name: '排期展示模板编辑'
      },
      {
        path: 'login',
        meta: {
          title: '慧影云排期展示首页'
        },
        component: resolve =>
          require(['ctmSrc/views/filmShow/login.vue'], resolve),
        name: '慧影云排期展示首页'
      },
      {
        path: 'swiperList',
        meta: {
          title: '慧影云排期展示首页'
        },
        component: resolve =>
          require(['ctmSrc/views/filmShow/swiperList.vue'], resolve),
        name: '慧影云排期展示首页'
      },
      {
        path: 'manageList',
        meta: {
          title: '慧影云排期展示首页'
        },
        component: resolve =>
          require(['ctmSrc/views/filmShow/manageList.vue'], resolve),
        name: '慧影云排期展示首页'
      }
    ]
  }
];

export default ctmRoutes;
