// 不带底部bar的子路由页面
const pagesRoutes = [
    {
      path: 'setting',
      meta: {
        title: '系统设置'
      },
      name: 'setting',
      component: () => import('views/csmpos/setting')
    },
    { 
      path: 'order', 
      meta: { title: '订单页面' }, 
      component: (resolve) => require(['views/csmpos/order/layout'], resolve), 
      name: 'order', 
    },
    {
      path: 'pickUp', //取货首页
      meta: { title: '取货' },
      component: () => import('views/pickUp/index'),
      name: 'pickUp'
    },
    {
      path: 'appointment', // 场次留座查询
      meta: { title: '取货' },
      component: () => import('views/pickUp/appointment'),
      name: 'appointment'
    },
    {
      path: 'pickGoods',  // 取货
      component: () => import('views/pickUp/pickGoods'),
      name: 'pickGoods'
    },
    {
      path: 'ticketPick', //取票
      component: () => import('views/pickUp/ticketPick'),
      name: 'ticketPick'
    },
    {
      path: 'checkTicket', //验票
      component: () => import('views/checkTicket/checkTicket'),
      name: 'checkTicket'
    },
    {
      path: 'registerTicket', //补登票
      component: () => import('views/checkTicket/registerTicket'),
      name: 'registerTicket'
    },
    {
      path: 'returnGoods', //退货
      component: () => import('views/returnGoods/returnGoods'),
      name: 'returnGoods',
    },
    {
      path: 'selectReturnGoods', //按场次退货
      component: () => import('views/returnGoods/selectReturnGoods'),
      name: 'selectReturnGoods',
    },
    {
      path: 'recharge', //充值
      component: () => import('views/recharge/recharge'),
      name: 'recharge',
    },
    {
      path: 'noticeLists', //广电通知
      component: () => import('views/notice/lists'),
      name:'noticeLists',
    },
    {
      path: 'settings', //设置、配置类型的Layer,
      component: () => import('views/setting/index'),
      children:[
        {
          path:'changePassword', //修改密码,
          component: () => import('views/setting/changePassword'),
          name:'changePassword',
          meta:{
            title:'修改密码'
          }
        },
        {
          path:'withdrawMoney', //抽钞记录,
          component: () => import('views/setting/withdrawMoney'),
          name:'withdrawMoney',
          meta:{
            title:'抽钞记录'
          }
        },
        {
          path: 'lockedPage',//锁机页
          component: () => import('views/setting/locked'),
          name: 'lockedPage',
          meta:{
            title:'锁机'
          }
        },
        {
          path: 'emPower',//授权页
          component: () => import('views/setting/emPower'),
          name: 'emPower',
          meta:{
            title:'开钱箱'
          }
        },
        {
          path: 'vipServe', //会员服务
          component: () => import('views/setting/vipServe'),
          name: 'vipServe',
          meta:{
            title:'会员服务'
          }
        },
        {
          path: 'modifyingData', //修改资料
          component: () => import('views/setting/modifyingData'),
          name: 'modifyingData',
          meta:{
            title:'修改资料'
          }
        },
        {
          path: 'resetPassword', //重置密码
          component: () => import('views/setting/resetPassword'),
          name: 'resetPassword',
          meta:{
            title:'重置密码'
          }
        },
        {
          path: 'patchCard', //补卡
          component: () => import('views/setting/patchCard'),
          name: 'patchCard',
          meta:{
            title:'补卡'
          }
        },
        {
          path: 'updateCard', //升级换卡,
          component: () => import('views/setting/updateCard'),
          name: 'updateCard',
          meta:{
            title:'升级换卡'
          }
        }
      ]
      
    },
    {
      path: 'rePrint', //重打印
      name: 'rePrint',
      component: () => import('views/csmpos/reprint/reprint'),
    },
    {
      path: 'printcheck', //重打印查看
      component: () => import('views/csmpos/reprint/printcheck'),
      name: 'printcheck',
    },
    {
      path:'voucherList', //重打印凭证
      component: () => import('views/csmpos/reprint/voucherList'),
      name: 'voucherList'
    },
    {
      path: 'prePareMeals', //备餐
      name: 'prePareMeals',
      component: () => import('views/csmpos/preparemeals/preparemeals'),
    },
    {
      path: 'sellCoupon', //票卷销售
      name: 'sellCoupon',
      component: () => import('views/csmpos/sellcoupon'),
    },
    // {
    //   path:'demo',
    //   name:'demo',
    //   component: () => import('views/dome/index')
    // }

]

export default pagesRoutes