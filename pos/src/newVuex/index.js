import vue from 'vue'
import Vuex from 'vuex'

vue.use(Vuex)
import user from './model/user'
import tickets from './model/tickets'
import global from './model/global'
import cart from './model/cart'
import config from './model/config'
export default new Vuex.Store({
    modules:{
        global,
        user,
        tickets,
        cart,
        config
    }
})