export default new Vuex.Store({
    state: {
        domain: '',
        loginToken : null ,   //登录用户token
        loginUser: null, //登录用户信息
    },
    mutations: {
        updateLoginToken(state , newToken){ //更新token信息
            state.loginToken = newToken ; 
        },
        updateLoginUser(state , newUserInfor){  //更新登录用户信息
            state.loginUser = newUserInfor ; 
        }
    }
});

