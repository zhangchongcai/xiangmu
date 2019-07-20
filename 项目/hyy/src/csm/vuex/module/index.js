
export default {
    state: {
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
        ],
        cinemaUid:"",
        tradingSearch:{}
    },
    mutations: {
        csmChangeCinemaUid( state,data ){
            state.cinemaUid = data
        },
        csmRemberTrading (state,data){
            state.tradingSearch = data
            // state.tradingSearch["cinemaName"] = cinemaName
        }
    }
}