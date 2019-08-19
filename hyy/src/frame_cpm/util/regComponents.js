// import DyTable from '../components/DyTable/DyTable.vue'
// import DyFormItem from '../components/DyFormItem/DyFormItem'
import store from '../vuex/index'

import constant from './constant'
import utils from './uiUtils'

export default {
  install(Vue) {
    Vue.prototype.$c = constant
    Vue.prototype.$utils = utils
    // Vue.prototype.$bus = utils.bus
    Vue.prototype.$to = utils.to

    // Vue.component('dy-table', DyTable)
    // Vue.component('dy-form-item', DyFormItem)

    Vue.prototype.$_has = function(value) {
      // debugger
      // console.log(value)
      let isExist = false
      if (!value) {
        return false
      }
      // console.log(store.state.commonData);
      let buttonperms = store.state.commonData.perms
      for (let i = 0; i < buttonperms.length; i++) {
        if (buttonperms[i].menuCode === value) {
          isExist = true
          break
        }
      }
      return isExist
    }

    Vue.directive('auth', {
      bind: function(el, binding) {
        // console.log("权限验证");
        if (!Vue.prototype.$_has(binding.value)) {
          el.parentNode.removeChild(el)
        }
      }
      // update: function (el, binding, vnode) { //3-更新
      //   console.log("3-update 更新");
      //   if (!Vue.prototype.$_has(binding.value)) {
      //     el.parentNode.removeChild(el)
      //   }
      // }
    })
    //格式化日期时间  兼容safari浏览器
    String.prototype.toValidDate = function() {
      return this.replace(/-/g, '/')
    }
  }
}
