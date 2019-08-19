const homeRoutes = [
    {
        path: '/',
        meta: {
          title: '销售主页',
          keepAlive: true
        },
        name: 'toHome',
        component: () => import('views/csmpos/Home')
      },
      
      // TODO  补充后续其他栏目 主页
      {
        path: 'goods',
        meta: {
          title: '卖品index'
        },
        name: '卖品index',
        component: () => import('views/csmpos/goods'),
        redirect:'goods/cellgoods/',
        children:[
          {
            path: 'cellgoods',
            meta: {
              title: '卖品主页'
            },
            name: 'sellerIndex',
            component: () => import('views/csmpos/goods/layout'),
          }
        ]
      },
      
      
]

export default homeRoutes