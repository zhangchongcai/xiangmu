import Vue from 'vue';
import App from './App.vue';
import 'element-ui/lib/theme-chalk/index.css';
import api from './http/index';
import VueRouter from 'vue-router';
import store from './vuex/index';
import routes from './router/index';
import NProgress from 'nprogress';
import axios from 'axios';
import Echarts from 'vue-echarts'
import 'nprogress/nprogress.css';
import {
    MessageBox,
    Message
} from 'element-ui';
import './assets/element-common.scss'
Vue.use(VueRouter);
Vue.use(api);
Vue.prototype.axios = axios;

// Vue.use(ElementUI)
const router = new VueRouter({
    mode: 'history',
    routes
});

/**
 * Config
 */

Vue.config.debug = process.env.NODE_ENV === 'development';
Vue.config.silent = process.env.NODE_ENV === 'production';
Vue.config.devtools = true;
Vue.config.productionTip = false;

const setGlobalTopNavs = function(to, next) {
    let matchedLength = to.matched.length;
    let item = to;
    if (matchedLength > 2) {
        item = to.matched[1];
    }
    if (!item.meta.hidden) {
        let newItem = {
            name: item.meta.title,
            path: item.path,
            query: item.query,
            params: item.params
        }
        store.commit('updateNavTabData', newItem);
    }
    next();
};

Vue.use(require('vue-wechat-title'));
router.beforeEach((to, from, next) => {
    //console.log(from,to);
    let token = localStorage.getItem('token');
    NProgress.start();
    // if (to.path == '/login') {
    //     let loginInfor = localStorage.getItem('userLocation');
    //     localStorage.clear();
    //     localStorage.setItem('userLocation', loginInfor);
    //     store.commit('updateLoginToken', null);
    //     store.commit('updateLoginUser', null);
    //     store.commit('updateUserMenu', null);
    //     localStorage.removeItem('navTabData');
    //     store.commit('updateNavTabDataByIndex', [{
    //         name: '首页',
    //         url: '/home',
    //         active: true,
    //     }])
    // 	next();
    // } else {		
    // 	if (!store.state.loginToken) {
    // 		if (token) {
    //             store.commit('updateLoginToken', token);
    //             store.commit('updateLoginUser', JSON.parse(localStorage.getItem('user')));
    //             store.commit('updateUserMenu', JSON.parse(localStorage.getItem('userMenu')));
    //             setGlobalTopNavs(to , next);
    // 		} else {
    // 			next({ path: '/login' });
    // 		}
    // 	} else {
    //         // next();
    //         setGlobalTopNavs(to, next);
    // 	}
    // }
    next();
});
router.afterEach((transition) => {
    NProgress.done();
});

//整理全局弹出框
Vue.prototype.alert = function(obj) {
    let str = obj.str ? obj.str : '',
        title = obj.title ? obj.title : '提示',
        btnText = obj.btnText ? obj.btnText : '确定';
    MessageBox.alert(str, title, {
        confirmButtonText: btnText,
        callback: (action) => {
            if (obj.callBack) {
                obj.callBack(action);
            }
        }
    });
};
//整理全局访问框
Vue.prototype.confirm = function(obj) {
    let str = obj.str ? obj.str : '',
        title = obj.title ? obj.title : '提示',
        btnText = obj.btnText ? obj.btnText : '确定',
        cancelText = obj.cancelText ? obj.cancelText : '取消',
        type = obj.type ? obj.type : 'warning';
    MessageBox.confirm(str, title, {
            confirmButtonText: btnText,
            cancelButtonText: cancelText,
            type: type
        })
        .then(() => {
            if (obj.callBack) {
                obj.callBack();
            }
        })
        .catch(() => {
            if (obj.cancelCallBack) {
                obj.cancelCallBack();
            }
        });
};
//整理全局错误信息
Vue.prototype.error = function(str) {
    Message({
        message: str,
        type: 'error',
        center: true,
        showClose: false,
        customClass: 'hyy-toast',
        iconClass: 'icon-danchuang-cuowu iconfont',
        duration: 1500
    })
}
//整理全局错误信息
Vue.prototype.warning = function(str) {
    Message({
        message: str,
        type: 'warning',
        center: true,
        showClose: false,
        customClass: 'hyy-toast',
        iconClass: 'icon-danchuang-jingtanhao iconfont',
        duration: 1500
    })
}
//整理全局成功信息
Vue.prototype.success = function(str) {
    Message({
        message: str,
        type: 'success',
        center: true,
        showClose: false,
        customClass: 'hyy-toast',
        iconClass: 'icon-danchuang-wancheng iconfont',
        duration: 1500
    })
}

// 升降序
Vue.prototype.sort = function(str, type) {
    return function(a, b) {
        if (type == 'up') {
            return a[str] - b[str];
        } else if (type == 'down') {
            return b[str] - a[str];
        }
    }
}

//  全局组件之间通信
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()

// 设置浏览器窗口大小
window.onresize = function(e) {
    store.commit('changeWindowSize', {
        innerWidth: e.target.innerWidth,
        innerHeight: e.target.innerHeight
    });
}



new Vue({
    router,
    store,
    el: '#app',
    data: {
        eventHub: new Vue()
    },
    render: (h) => h(App)
});