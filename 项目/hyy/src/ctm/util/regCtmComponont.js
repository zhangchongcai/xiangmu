import DyTable from '../components/DyTable/DyTable.vue'
import DyFormItem from '../components/DyFormItem/DyFormItem'
import '../assets/element-common.scss'
// import store from '../../frame_cpm/vuex/index';

// import constant from './constant'
// import utils from './uiUtils'

export default {
  install(Vue) {
    // Vue.prototype.$c = constant
    // Vue.prototype.$utils = utils
    // Vue.prototype.$bus = utils.bus
    // Vue.prototype.$to = utils.to

    Vue.component('dy-table', DyTable)
    Vue.component('dy-form-item', DyFormItem)
  }
}