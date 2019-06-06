import Vue from 'vue';
import App from './App.vue';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import store from './newVuex/index';
import routes from './router/index';
import md5 from 'md5';
//导入mock数据文件
require('./mocks/films.js')
import {
    MessageBox,
    Message
} from 'element-ui';
import './assets/element-common.scss'
import './assets/iconfont/iconfont.css'
import './assets/css/mixin.scss'
import './assets/iconfont/iconfont'
import Axios from './http/http'
import * as TYPES from './newVuex/types'
import util from './http/app'
import payLoading from 'views/member/components/payLoading'
Vue.use(VueRouter);
Vue.use(payLoading);
Vue.prototype.$get = Axios.get;
Vue.prototype.$post = Axios.post;

Vue.prototype.$md5 = md5;
Vue.prototype.pageLoading = false;
// Vue.use(ElementUI)
const router = new VueRouter({
    mode: 'history',    //本地开发
    routes
});

/**
 * Config
 */

Vue.config.debug = process.env.NODE_ENV === 'development'
Vue.config.silent = process.env.NODE_ENV === 'production'
Vue.config.devtools = true
Vue.config.productionTip = false

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
}
Vue.prototype.$wsUrl = process.env.NODE_ENV == 'production' ? `ws://api${location.host}/websocket/server/` : 'ws://apidevpos.oristarcloud.com/websocket/server/'

Vue.use(require('vue-wechat-title'));

//获取终端配置
util.readTerminalParameter((configData)=>{
    store.commit(TYPES.SET_CONFIG_DATA,configData)
    util.readCard(configData,function(e){
        if(e.toString() === '浏览器不支持此功能'){
            localStorage['globalAppState'] = false;
        }else{
            localStorage['globalAppState'] = true;
        }
    })
})
// router.beforeEach((to,form,next) => {
//     //数组里放哪里页面不需要头部尾部显示的 routerName
//     if(['setting'].includes(to.name)){
      
//     }else{
//         // store.commit(TYPES.USER_INFO,true)
//     }
//     next();
// })

router.beforeEach((to, from, next) => {
    store.commit(TYPES.SAVE_CINEMA_INFO)
    switch(to.name){
        case 'toHome' :
        case 'memberHome':
            let token = localStorage.getItem('token');
            if (token) {
                next();
            } else {
                next({ path: '/login' });
            }
            break;
        case 'pickUp':
        case 'returnGoods':
        case 'registerTicket':
        case 'withdrawMoney':
        case 'rePrint':
            if(false){
                store.commit(TYPES.EMPOWER_SET_USER,'')
                store.commit(TYPES.EMPOWER_SET_PASSWORD,'')
                store.commit(TYPES.EMPOWER_SET_SHOW,true)
            }
            next();
            break;
        default: next();
        
    }
    
    		
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
        type: 'warning'
    });
};

//整理全局成功信息
Vue.prototype.success = function(str) {
    Message({
        message: str,
        type: 'success'
    });
};

//  全局组件之间通信
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()
Vue.prototype.$vm = new Vue()

//pos 会员部分sign生成
Vue.prototype.$sign = function(obj){
    if(!obj)throw new Error('缺少加密参数字段');
    let parseObj = {},
        keyArr = [],
        valueArr = [];
    Object.keys(obj).forEach((item,index)=>{
        keyArr.push(item.toLowerCase());
        parseObj[item.toLowerCase()] = obj[item];
    });
    keyArr.sort().forEach((item,index)=>{
        if(parseObj[item] != null){
            valueArr.push(parseObj[item]);
        }
    })
    return Object.assign({},obj,{
        sign : Vue.prototype.$md5(valueArr.join('')+'memberPos')
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