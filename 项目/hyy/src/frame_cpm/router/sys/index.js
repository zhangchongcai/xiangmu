const sysRoutes = [
  {
    path: 'commFun',
    meta: {
      title: '添加功能',
    },
    component: (resolve) => require(['../../views/commonFunctions.vue'], resolve),
    name: '添加功能',
  },
  {
    path: 'buyer',
    meta: {
      title: '客户管理',
    },
    component: (resolve) => require(['../../views/sysMange/customer/index.vue'], resolve),
    name: '客户管理',
    redirect: 'buyer/index',
    children: [{
      path: 'index',
      meta: {
        title: "客户管理",
        keepAlive:true,
      },
      component: (resolve) => require(['../../views/sysMange/customer/cusList.vue'], resolve),
      name: '客户管理',
    },
      {
        path: 'newCus',
        meta: {
          title: '新建客户',
          // keepAlive:true,
        },
        component: (resolve) => require(['../../views/sysMange/customer/newCus.vue'], resolve),
        name: '新建客户',
      },
      {
        path: 'editCus',
        meta: {
          title: '编辑客户',
          // keepAlive:true,
        },
        component: (resolve) => require(['../../views/sysMange/customer/newCus.vue'], resolve),
        name: '编辑客户',
      },
      {
        path: 'seeCus',
        meta: {
          title: '查看客户',
        },
        component: (resolve) => require(['../../views/sysMange/customer/newCus.vue'], resolve),
        name: '查看客户',
      }
    ]
  },
  {
    path: 'holiday',
    meta: {
      title: '节假日管理',
    },
    component: (resolve) => require(['../../views/sysMange/holiday/index.vue'], resolve),
    name: '节假日管理',
    redirect: 'holiday/index',
    children: [{
      path: 'index',
      meta: {
        title: "节假日管理",
        keepAlive:true,
      },
      component: (resolve) => require(['../../views/sysMange/holiday/holList.vue'], resolve),
      name: '节假日管理',
    },
      {
        path: 'newHol',
        meta: {
          title: '新增假日',
          // keepAlive:true,
        },
        component: (resolve) => require(['../../views/sysMange/holiday/newHol.vue'], resolve),
        name: '新增假日',
      },
      {
        path: 'editHol',
        meta: {
          title: '编辑假日',
          // keepAlive:true,
        },
        component: (resolve) => require(['../../views/sysMange/holiday/newHol.vue'], resolve),
        name: '编辑假日',
      },
    ]
  },
  {
    path: 'log',
    meta: {
      title: '操作日志',
    },
    component: (resolve) => require(['../../views/sysMange/logs/index.vue'], resolve),
    name: '操作日志',
    redirect: 'log/index',
    children: [{
      path: 'index',
      meta: {
        title: "操作日志",
      },
      component: (resolve) => require(['../../views/sysMange/logs/logList.vue'], resolve),
      name: '操作日志',
    },
    {
      path: 'detail',
      meta: {
        title: "日志详情"
      },
      component: (resolve) => require(['../../views/sysMange/logs/detail.vue'], resolve),
      name: '日志详情',
    }]
  },
  {
    path: 'dict',
    meta: {
      title: '数据字典'
    },
    component: (resolve) => require(['../../views/sysMange/dict/index.vue'], resolve),
    name: '数据字典',
    redirect: 'log/index',
    children: [{
      path: 'index',
      meta: {
        title: "数据字典"
      },
      component: (resolve) => require(['../../views/sysMange/dict/list.vue'], resolve),
      name: '数据字典',
    },
    {
      path: 'detail',
      meta: {
          title: '查看字典'
      },
      component: (resolve) => require(['../../views/sysMange/dict/detail.vue'], resolve),
      name: '查看字典',
    },
    {
      path: 'create',
      meta: {
          title: '新建字典'
      },
      component: (resolve) => require(['../../views/sysMange/dict/detail.vue'], resolve),
      name: '新建字典',
    },
    {
      path: 'edit',
      meta: {
          title: '修改字典'
      },
      component: (resolve) => require(['../../views/sysMange/dict/detail.vue'], resolve),
      name: '修改字典',
    }
    ]
  },
  {
    path: 'org',
    meta: {
      title: '组织结构管理'
    },
    component: (resolve) => require(['../../views/sysMange/orgManage/orgManage.vue'], resolve),
    name: '组织结构管理'
  },
  {
    path: 'role',
    meta: {
      title: '角色管理'
    },
    component: (resolve) => require(['../../views/sysMange/roleManage/index.vue'], resolve),
    name: '角色管理',
    redirect: 'role/index',
    children: [{
      path: 'index',
      meta: {
        title: "角色管理",
        keepAlive:true,
      },
      component: (resolve) => require(['../../views/sysMange/roleManage/roleMange.vue'], resolve),
      name: '角色管理',
    },
      {
        path: 'createRole',
        meta: {
          title: '新建角色',
          // keepAlive:true,
        },
        component: (resolve) => require(['../../views/sysMange/roleManage/newRole.vue'], resolve),
        name: '新建角色',
      },
      {
        path: 'editRole',
        meta: {
          title: '编辑角色',
          // keepAlive:true,
        },
        component: (resolve) => require(['../../views/sysMange/roleManage/newRole.vue'], resolve),
        name: '编辑角色',
      },
      {
        path: 'seeRole',
        meta: {
          title: '查看角色'
        },
        component: (resolve) => require(['../../views/sysMange/roleManage/newRole.vue'], resolve),
        name: '查看角色',
      }
    ]
  },
  {
    path: 'user',
    meta: {
      title: '用户管理'
    },
    component: (resolve) => require(['../../views/sysMange/userManage/index.vue'], resolve),
    name: '用户管理',
    redirect: 'user/index',
    children: [{
      path: 'index',
      meta: {
        title: "用户管理",
        keepAlive:true,
      },
      component: (resolve) => require(['../../views/sysMange/userManage/userList.vue'], resolve),
      name: '用户管理',

    },
      {
        path: 'newUser',
        meta: {
          title: '新建用户',
          // keepAlive:true,
        },
        component: (resolve) => require(['../../views/sysMange/userManage/newUser.vue'], resolve),
        name: '新建用户',
      },
      {
        path: 'editUser',
        meta: {
          title: '编辑用户',
          // keepAlive:true,
        },
        component: (resolve) => require(['../../views/sysMange/userManage/editUser.vue'], resolve),
        name: '编辑用户',
      },
      {
        path: 'userDetail',
        meta: {
          title: '查看用户'
        },
        component: (resolve) => require(['../../views/sysMange/userManage/userDetail.vue'], resolve),
        name: '查看用户',
      },
    ]
  },
  {
    path: 'filmDetail',
    meta: {
      title: '查看基础影片'
    },
    component: (resolve) => require(['../../views/film/filmDetail.vue'], resolve),
    name: '查看基础影片'
  },
  {
    path: 'demo',
    meta: {
      title: '公共组件调用实例'
    },
    component: (resolve) => require(['../../views/demo/cinema/index.vue'], resolve),
    name: '影院组件实例',
    redirect: 'demmo/cinema',
    children: [{
      path: 'cinema',
      meta: {
        title: "影院组件实例"
      },
      component: (resolve) => require(['../../views/demo/cinema/list.vue'], resolve),
      name: '影院组件实例',

    },
    {
      path: 'film',
      meta: {
        title: "影片组件实例"
      },
      component: (resolve) => require(['../../views/demo/film/list.vue'], resolve),
      name: '影片组件实例',
    },
    {
      path: 'test',
      meta: {
        title: "影片组件实例"
      },
      component: (resolve) => require(['../../views/demo/cinema/test.vue'], resolve),
      name: '影片组件实例',
    }
    ]
  },
  {
    path: 'message',
    meta: {
      title: '短信模板管理'
    },
    component: (resolve) => require(['../../views/sysMange/messageTemplate/index.vue'], resolve),
    name: '短信模板管理',
    redirect: 'message/messageTemplate',
    children: [{
      path: 'messageTemplate',
      meta: {
        title: "短信模板管理",
        keepAlive:true,
      },
      component: (resolve) => require(['../../views/sysMange/messageTemplate/list.vue'], resolve),
      name: '短信模板管理',

    },
    {
      path:'detailTemplate',
      meta: {
        title: "查看短信模板"
      },
      component: (resolve) => require(['../../views/sysMange/messageTemplate/detail.vue'], resolve),
      name: '查看短信模板',
    },
    {
      path:'editTemplate',
      meta: {
        title: "编辑短信模板",
        keepAlive:true,
      },
      component: (resolve) => require(['../../views/sysMange/messageTemplate/edit.vue'], resolve),
      name: '编辑短信模板',
    },
    {
      path:'addTemplate',
      meta: {
        title: "新建短信模板",
        keepAlive:true,
      },
      component: (resolve) => require(['../../views/sysMange/messageTemplate/add.vue'], resolve),
      name: '新建短信模板',
    },
    {
      path:'distribution',
      meta: {
        title: "短信群发管理",
        keepAlive:true,
      },
      component: (resolve) => require(['../../views/sysMange/messageDistribution/list.vue'], resolve),
      name: '短信群发管理',
    },
    {
      path:'sendDistribution',
      meta: {
        title: "新建短信群发",
        keepAlive:true,
      },
      component: (resolve) => require(['../../views/sysMange/messageDistribution/send.vue'], resolve),
      name: '新建短信群发',
    },
    {
      path:'detailDistribution',
      meta: {
        title: "短信群发详情",
        keepAlive:true,
      },
      component: (resolve) => require(['../../views/sysMange/messageDistribution/detail.vue'], resolve),
      name: '短信群发详情',
    }
    ]
  },
  {
    path: 'record',
    meta: {
      title: '查询短信记录'
    },
    component: (resolve) => require(['../../views/sysMange/messageRecord/index.vue'], resolve),
    name: '查询短信记录',
    redirect: 'record/messageRecord',
    children: [{
      path: 'messageRecord',
      meta: {
        title: "查询短信记录",
        keepAlive:true,
      },
      component: (resolve) => require(['../../views/sysMange/messageRecord/list.vue'], resolve),
      name: '查询短信记录',

    }
    ]
  }
]

export default sysRoutes
