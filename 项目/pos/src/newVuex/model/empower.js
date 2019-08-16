import * as TYPES from '../types'

export default {
  state:{
    show:false,
    typesCode:'',
    type:1,
    user:'',
    password:'',
  },
  mutations:{
    [TYPES.EMPOWER_SET_SHOW] : (state,data) => {
      state.show = data.show
      state.typesCode = data.type
    },
    [TYPES.EMPOWER_SET_USER] : (state,val) => {
      state.user = val
    },
    [TYPES.EMPOWER_SET_PASSWORD] : (state,val) => {
      state.password = val
    },
    [TYPES.EMPOWER_SET_TYPE] : (state,val) => {
      state.type = val
    }
  },
  actions:{
    
  }
}