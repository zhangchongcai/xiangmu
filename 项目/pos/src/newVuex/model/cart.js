import * as TYPES from '../types'
// import { stat } from 'fs';
export default {
    state : {
        //电影票
        cartData:{
           goodsList:[]
        },
         //卖品
         showCartKeyBoard:false,
         goodsList:[
            {content:"三人家庭爆米花",price:35,num:1},
            {content:"三人家庭爆米花",price:45,num:1},
         ],
         goodlistIndex:'',   //下标索引值
 
    },

    mutations : {
        //获取电影数组
        [TYPES.GET_CART_DATA] : (state,val) => {
            state.cartData = val
        },

        //显示购物车的键盘
        [TYPES.SHOW_CART_KEYBOARD] : (state,val) => {
            state.showCartKeyBoard = !state.showCartKeyBoard
            state.goodlistIndex = val       //下标
        },
        //获取卖品数组
        [TYPES.GET_CART_GOODSLIST] : (state,val) => {
            state.getGoodslist = val
        },
        //卖品数量加减
        [TYPES.SET_CART_NUMBER] : (state,val) => {
            state.goodsList[state.goodlistIndex].num = val
        },
    },


    getters : {
        //电影票
        cartData(state) {
            return state.cartData
        },
        //卖品
        showCartKeyBoard(state) {
            return state.showCartKeyBoard
        },
        goodsList(state) {
            return state.goodsList
        },
        getcartNumber(state) {
            return state.getcartNumber
        }
    }
    
}