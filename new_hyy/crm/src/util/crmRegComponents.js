// import DyTable from '../components/DyTable/DyTable.vue'
import '../assets/css/element-common.scss';
import crmList from 'crmSrc/http/interface';

export default {
  install (Vue) {
    // Vue.prototype.$c = constant
    // Vue.prototype.$utils = utils
    // Vue.prototype.$bus = utils.bus
    // Vue.prototype.$to = utils.to
    Object.defineProperties(Vue.prototype, {
      // 挂载在Vue原型的 $api 对象上
      $crmList: {
        get () {
          return crmList;
        }
      }
    });

    // Vue.component('dy-table', DyTable)
  }
};
