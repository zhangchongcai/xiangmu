/**
 * Created by zhanchenlong on 2019/8/1.
 */
import Vue from 'vue';
import Vuex from 'vuex';

import defaultStore from './modules/defaultStore';
import frameCpm from './modules';

// import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

// const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  state: {
    domain: '',
    loginToken: null, // 登录用户token
    loginUser: null, // 登录用户信息
    innerWidth: null, // 浏览器宽度
    innerHeight: null, // 浏览器高度
    changeCinemaData: null, // 影片资料影院data
    password: null,
    CpmUserKey: null,
    sliderData: null
  },
  mutations: {
    updateLoginTokenCPM (state, newToken) {
      // 更新token信息
      state.loginToken = newToken;
    },
    updateLoginUserCPM (state, newUserInfor) {
      // 更新登录用户信息
      state.loginUser = newUserInfor;
    },
    changeWindowSize (state, data) {
      // 修改浏览器窗口大小信息
      state.innerWidth = data.innerWidth;
      state.innerHeight = data.innerHeight;
    },
    changeCinemaData (state, data) {
      // console.log('进来了：',data)
      state.changeCinemaData = data;
    },
    changePwd (state, data) {
      state.password = data;
    },
    updateUserKey (state, data) {
      // 更新登录用户信息
      state.CpmUserKey = data;
    }
  },
  modules: {
    default: defaultStore,
    ...frameCpm
  }
  // plugins: [
  //   createPersistedState({
  //     storage: window.localStorage,
  //     reducer: state => ({
  //       default: {
  //         userInfo: state.default.userInfo,
  //         menus: state.default.menus,
  //         menuTabs: state.default.menuTabs,
  //         selectedTab: state.default.selectedTab,
  //         noMenuTabsMap: state.default.noMenuTabsMap,
  //         allAreas: state.default.allAreas
  //       }
  //     })
  //   })
  // ]
});

// store.registerModule('demo', demoStore)
// store.registerModule('default',defaultStore)
// store.registerModule('genStore',genStore)
// store.registerModule('bidStore',bidStore)
// store.registerModule('system',systemStore)
// store.registerModule('contract',contractStore)

export default store;
