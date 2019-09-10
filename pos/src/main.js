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
import vAlert from './components/dialog/alert.js'
Vue.prototype.$alert = vAlert.install

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
const isProduction = process.env.NODE_ENV === 'production'
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
Vue.prototype.$wsUrl = process.env.NODE_ENV == 'production' ? `wss://api${location.host}/websocket/server/` : 'wss://apitestpos.oristarcloud.com/websocket/server'

Vue.use(require('vue-wechat-title'));

//获取终端配置
const getConfigData = () => {
    return new Promise((res,rej) => {
        util.readTerminalParameter((configData)=>{
            let data = {
                ...store.state.config.configData,
                ...configData
            }
            store.commit(TYPES.SET_CONFIG_DATA,data)
            if(configData.isBrowser){
                localStorage['globalAppState'] = false;
            }else{
                localStorage['globalAppState'] = true;
            }
            res()
        })
    })
}
//获取终端配置 同步阻塞 确保进入 beforEach已经获取到配置信息
(async () => {
    await getConfigData()
})()

router.beforeEach((to, from, next) => {
    store.commit(TYPES.SAVE_CINEMA_INFO)
    switch(to.name){
        case 'toHome' :
        case 'memberHome':
            let token = localStorage.getItem('token');
            if (token) {
                let globalAppState = JSON.parse(localStorage.getItem('globalAppState')) 
                if(globalAppState && !store.state.config.configData.isSetting) next({name:'setting'})
                next()
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
//home页面添加 第一层菜单添加icon
Vue.prototype.$addHomeNavIcon = function(nav){
    var iconList = {
        'csm_pos_sale_ticket_manager':'iconpiaowushouye',
        'csm_pos_sale_goods_manager':'iconmaipin',
        'csm_pos_member':'iconhuiyuan'
    };
    var turnBack = navList => {
        navList.map(item=>{
            item.icon = iconList[item.menuCode];
            if(item.submenu.length){
                turnBack(item.submenu)
            }
        })
    };
    turnBack(nav[0].submenu)
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