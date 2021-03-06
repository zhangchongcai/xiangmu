import Vue from 'vue';
import store from './vuex/';
import ElementUI from 'element-ui';
import moment from 'moment';
import axios from 'axios';
import echarts from 'echarts';
import VCharts from 'v-charts';
import { baseRouter, sysRoutes, Login, Main, Home, App } from './index';

import baseRegComponents from 'baseSrc/util/baseRegComponents';

import NProgress from 'nprogress';
Vue.prototype.$echarts = echarts;
Vue.prototype.axios = axios;
Vue.prototype.$moment = moment;
Vue.use(VCharts);
Vue.use(ElementUI);

console.log(process.env);
store.commit('updateProcessEnv', process.env);
Vue.use(baseRegComponents);

// import { router } from './index'
// import routerFn from "./baseRouter";

// let mixRouter = routerFn(router);
// console.log(mixRouter);

const setGlobalTopNavs = function (to, next) {
  let matchedLength = to.matched.length;
  let item = to;
  if (matchedLength > 2) {
    item = to.matched[2];
  }
  if (!item.meta.hidden) {
    let newItem = {
      name: item.meta.title,
      path: item.path,
      query: item.query,
      params: item.params
    };
    store.commit('updateNavTabData', newItem);
  }
  next();
};

/**
 * Config
 */

Vue.config.debug = process.env.NODE_ENV === 'development';
Vue.config.silent = process.env.NODE_ENV === 'production';
Vue.config.devtools = true;
Vue.config.productionTip = false;
// sessionStorage.setItem("token", "3049fd0f-da89-4c91-89ef-c9213be32eef");

const routerView = {
  template: '<router-view></router-view>'
};

// baseRouter.options.routes = baseRouter.options.routes.concat(router);

let routes = [
  {
    path: '/login',
    meta: {
      title: '登录'
    },
    component: Login,
    name: '登录'
  },
  {
    path: '/',
    meta: {
      title: '首页'
    },
    component: Main,
    redirect: 'home',
    children: [
      // 首页
      {
        path: 'home',
        meta: {
          title: '工作台',
          hidden: true
        },
        component: Home,
        name: '主页'
      },
      // 基础平台系统路由
      {
        path: 'sys',
        meta: {
          title: '系统管理'
        },
        component: routerView,
        name: '系统管理',
        children: sysRoutes
      }
    ]
  }
];
baseRouter.options.routes = routes;
baseRouter.addRoutes(routes);

baseRouter.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem('token');
  let user = localStorage.getItem('user');
  NProgress.start();
  /* if(from.path=='/login'){
      sessionStorage.removeItem('tagNavList')
  } */
  if (to.path == '/login') {
    localStorage.clear();
    store.commit('updateLoginToken', null);
    store.commit('updateLoginUser', null);
    store.commit('updateUserMenu', null);
    // store.commit('updateNavTabDataByIndex',[{
    //     path: '/home',
    //     title: '主页',
    // }] )
    next();
  } else {
    if (!store.state.loginToken || !user) {
      if (token && user) {
        store.commit('updateLoginTokenCPM', token);
        store.commit('updateLoginUserCPM', JSON.parse(user));
        setGlobalTopNavs(to, next);
      } else {
        next({
          path: '/login'
        });
      }
    } else {
      setGlobalTopNavs(to, next);
    }
  }
  next();
});
baseRouter.afterEach(transition => {
  NProgress.done();
  // setTimeout(() => {
  //     if (document && document.getElementById('wholeLoadingId') && document.getElementById('wholeLoadingId').style.display != 'none') {
  //         document.getElementById('wholeLoadingId').style.display = 'none'
  //     }
  // }, 20)
});

//  全局组件之间通信
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue();

// 设置浏览器窗口大小
window.onresize = function (e) {
  store.commit('changeWindowSize', {
    innerWidth: e.target.innerWidth,
    innerHeight: e.target.innerHeight
  });
};
console.log(store);

new Vue({
  router: baseRouter,
  store,
  render: h => h(App)
}).$mount('#app');
