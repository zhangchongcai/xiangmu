import Vue from 'vue'
import alert from './alert.vue'

const alertBox = Vue.extend(alert)

alert.install = function (data) {
  let instance = new alertBox({
    data:{
      dialogVisible:true,
      info:data
    }
  }).$mount()

  document.body.appendChild(instance.$el)

  
}

export default alert