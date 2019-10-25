/* eslint no-extend-native: ["error", { "exceptions": ["String","Number"] }] */

// import DyTable from '../components/DyTable/DyTable.vue'
// import DyFormItem from '../components/DyFormItem/DyFormItem'
import store from '../vuex/index';

import constant from './constant';
import utils from './uiUtils';
import cpmList from 'baseSrc/http/interface';
import '../assets/element-variables.scss';
import '../assets/iconfont/iconfont.css';
import '../assets/css/base.scss';

import vfilter from '../filter/vfilters';
import { MessageBox, Message } from 'element-ui';

export default {
  install (Vue) {
    Vue.prototype.$c = constant;
    Vue.prototype.$utils = utils;
    // Vue.prototype.$bus = utils.bus
    Vue.prototype.$to = utils.to;
    // 挂载全局
    // Vue.prototype.$CryptoJS = CryptoJS;

    // Vue.component('dy-table', DyTable)
    // Vue.component('dy-form-item', DyFormItem)
    Object.defineProperties(Vue.prototype, {
      // 挂载在Vue原型的 $api 对象上
      $cpmList: {
        get () {
          return cpmList;
        }
      }
    });

    Object.keys(vfilter).forEach(key => {
      Vue.filter(key, vfilter[key]);
    });

    Vue.prototype.$_has = function (value) {
      // debugger
      // console.log(value)
      let isExist = false;
      if (!value) {
        return false;
      }
      // console.log(store.state.commonData);
      let buttonperms = store.state.commonData.perms;
      for (let i = 0; i < buttonperms.length; i++) {
        if (buttonperms[i].menuCode === value) {
          isExist = true;
          break;
        }
      }
      return isExist;
    };

    Vue.directive('auth', {
      bind: function (el, binding) {
        // console.log("权限验证");
        if (!Vue.prototype.$_has(binding.value)) {
          el.parentNode.removeChild(el);
        }
      }
      // update: function (el, binding, vnode) { //3-更新
      //   console.log("3-update 更新");
      //   if (!Vue.prototype.$_has(binding.value)) {
      //     el.parentNode.removeChild(el)
      //   }
      // }
    });
    // 整理全局弹出框
    Vue.prototype.alert = function (obj) {
      let str = obj.str ? obj.str : '',
        title = obj.title ? obj.title : '提示',
        btnText = obj.btnText ? obj.btnText : '确定';
      MessageBox.alert(str, title, {
        confirmButtonText: btnText,
        callback: action => {
          if (obj.callBack) {
            obj.callBack(action);
          }
        }
      });
    };
    // 整理全局访问框
    Vue.prototype.confirm = function (obj) {
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
    // 整理全局错误信息
    Vue.prototype.error = function (str) {
      Message({
        message: str,
        type: 'error',
        center: true,
        showClose: false,
        customClass: 'hyy-toast',
        iconClass: 'icon-danchuang-cuowu iconfont',
        duration: 1500
      });
    };
    // 整理全局错误信息
    Vue.prototype.warning = function (str) {
      Message({
        message: str,
        type: 'warning',
        center: true,
        showClose: false,
        customClass: 'hyy-toast',
        iconClass: 'icon-danchuang-jingtanhao iconfont',
        duration: 1500
      });
    };
    // 整理全局成功信息
    Vue.prototype.success = function (str) {
      Message({
        message: str,
        type: 'success',
        center: true,
        showClose: false,
        customClass: 'hyy-toast',
        iconClass: 'icon-danchuang-wancheng iconfont',
        duration: 1500
      });
    };

    // 升降序
    Vue.prototype.sort = function (str, type) {
      return function (a, b) {
        if (type === 'up') {
          return a[str] - b[str];
        } else if (type === 'down') {
          return b[str] - a[str];
        }
      };
    };
    // 格式化日期时间  兼容safari浏览器
    String.prototype.toValidDate = function () {
      return this.replace(/-/g, '/');
    };
  }
};
