import * as TYPES from '../types'
// import { stat } from 'fs';
export default {
    state : {
        configData:{
            film_print:[],// 电影打印机
            bill_print:[], //小票打印机
            coupon_print:[],//票券打印机
            cash_box:[],//钱箱
            card_reader:[],//读卡器
            keyboard:[],//密码键盘
            film_print_offset:{}, //影票打印机偏移坐标x,y
            counter_type:[],//售卖商品范围
            
            pos_type:[],//银行卡支付对接银联POS机类型
            pos_show_type:[],//POS机客显类型
            print_voucher:[],//打印凭证
            meal_preparation:[],//备餐菜单
        }
    },

    mutations : {
        //设置全部数据
        [TYPES.SET_CONFIG_DATA] : (state,val) => {
            state.configData = val
        },
        //设置电影打印机
        [TYPES.SET_FILM_PRINT] : (state,val) => {
            state.configData.film_print = val
        },
        //设置小票打印机
        [TYPES.SET_BILL_PRINT] : (state,val) => {
            state.configData.bill_print = val
        },
        //设置票券打印机
        [TYPES.SET_COUPON_PRINT] : (state,val) => {
            state.configData.coupon_print = val
        },
        //设置钱箱
        [TYPES.SET_CASH_BOX] : (state,val) => {
            state.configData.cash_box = val
        },
        //设置读卡器
        [TYPES.SET_CARD_READER] : (state,val) => {
            state.configData.card_reader = val
        },
        //设置密码键盘
        [TYPES.SET_KEYBOARD] : (state,val) => {
            state.configData.keyboard = val
        },
        //设置影票打印机偏移坐标
        [TYPES.SET_FILM_PRINT_OFFSET] : (state,val) => {
            state.configData.film_print_offset = val
        },
        //设置终端售卖商品范围
        [TYPES.SET_COUNTER_TYPE] : (state,val) => {
            state.configData.counter_type = val
        },
    },


    getters : {
        configData(state){
            return state.configData
        },
        filmPrint(state){
            return state.configData.film_print
        }
    }
    
}

