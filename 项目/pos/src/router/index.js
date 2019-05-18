import cimRoutes from './cim'
import ctmRoutes from './ctm'
import csmRoutes from './csm'

const routerView = {template: '<router-view></router-view>'};

let routes = [
  {
    path: '/',
    component: routerView,
    redirect: 'ctm'
  },
  {
    path: '/cim',
    meta: {
      title: '卖品'
    },
    name: '卖品',
    component: routerView,
    redirect: 'cim/index',
    children: cimRoutes

  },
  {
    path: '/ctm',
    meta: {
      title: '票务'
    },
    name: '票务',
    component: routerView,
    redirect: 'ctm/index',
    children: ctmRoutes
  },
  {
    path: '/csm',
    meta: {
      title: '销售'
    },
    name: '销售',
    component: routerView,
    redirect: 'csm/index',
    children: csmRoutes
  }
];

export default routes;