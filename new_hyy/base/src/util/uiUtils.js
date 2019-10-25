import { Message, MessageBox } from 'element-ui';
import Vue from 'vue';
import Utils from './utils';

// import constant from './constant'

// 这个bus对象用作全局的事件总线,用于一些特殊场景下的组件通讯
const bus = new Vue();
const h = bus.$createElement;

class UiUtils extends Utils {
  // bus = null
  constructor () {
    super();
    this.bus = bus;
  }
  // 消息框简单封装
  message (message, type = 'success', duration = 3000) {
    Message({
      message,
      type,
      duration
    });
  }
  // alert
  alert (content, title = '提示信息', options) {
    return new Promise(resolve => {
      MessageBox.alert(content, title, {
        type: 'info',
        ...options
      })
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  confirm (content, title = '确认操作', options) {
    return new Promise(resolve => {
      MessageBox.confirm(content, title, {
        type: 'warning',
        ...options
      })
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }
  // 消息框支持jsx
  msgbox (option) {
    if (option.render) {
      option.message = option.render(h);
      delete option.render;
    }
    MessageBox(option);
  }
}
const uiUtils = new UiUtils();
export default uiUtils;
