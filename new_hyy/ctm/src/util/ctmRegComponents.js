// import DyTable from '../components/DyTable/DyTable.vue'
import '../assets/css/element-common.scss';
import ctmList from 'ctmSrc/http/interface';
import DyTable from '../components/DyTable/DyTable.vue';
import DyFormItem from '../components/DyFormItem/DyFormItem';

export default {
  install (Vue) {
    Vue.component('dy-table', DyTable);
    Vue.component('dy-form-item', DyFormItem);

    Object.defineProperties(Vue.prototype, {
      // 挂载在Vue原型的 $api 对象上
      $ctmList: {
        get () {
          return ctmList;
        }
      }
    });

    // Vue.component('dy-table', DyTable)
  }
};
