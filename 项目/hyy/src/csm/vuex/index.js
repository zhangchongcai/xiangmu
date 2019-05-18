
export default new Vuex.Store({
    state: {
        domain: '',
        loginToken: null, //登录用户token
        loginUser: null, //登录用户信息
        innerWidth: null, // 浏览器宽度
        innerHeight: null, // 浏览器高度
        dealType:[
            [
                // 消费
                {label: "消费", value: "01"},
                {label: "退货",value: "02"},
                { label: "补登",value: "03"} 
            ],
            [
                {label: "会员开卡",value: "11"  },
                {label: "会员充值", value: "12"},
                {label: "会员补卡", value: "13" },
                {label: "会员注销",value: "14"},
                {label: "升级换卡",value: "15"},
                {label: "充值冲销",value: "16"},
                {label: "会员激活", value: "17"}
            ]
        ]  
            
        
    },
    mutations: {
        updateLoginToken(state, newToken) { //更新token信息
            state.loginToken = newToken;
        },
        updateLoginUser(state, newUserInfor) { //更新登录用户信息
            state.loginUser = newUserInfor;
        },
        changeWindowSize(state, data) {
            // 修改浏览器窗口大小信息
            state.innerWidth = data.innerWidth;
            state.innerHeight = data.innerHeight;
        }
    }
})