import * as TYPES from '../types'
import {findCart} from 'http/apis'
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
         goodsData:{ //卖品信息
            list:[],
         },
         goodlistIndex:'',   //下标索引值
         showReplacegoods:false,
         replacegoods: [], //套餐中包含的产品
         replacegoodsInfo:{},
         goodnumber:0 ,//点击确定改变的数量值
         searchGoodsText:'',//卖品查询值
 
    },

    mutations : {
        //获取电影数组
        [TYPES.GET_CART_DATA] : (state,val) => {
            console.log(val)
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
            state.goodnumber = val
        },
        [TYPES.SHOW_REPLACE_GOODS] : (state) => {
            state.showReplacegoods = !state.showReplacegoods
        },

        [TYPES.CART_SET_GOODS_DATA] : (state,data) => {
            state.goodsData.list = data || []
        },
        [TYPES.CART_SET_REPLAC_GOODS] : (state,data) => {
            state.replacegoods = data
        },
        [TYPES.CART_SEARCH_GOODS_TEXT] : (state,data) => {
            state.searchGoodsText = data
        },
        [TYPES.CART_REPLAC_GOODS_INFO] : (state,data) => {
            state.replacegoodsInfo = data
        }
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
        },
        //更换套餐内容
        showReplacegoods(state) {
            return state.showReplacegoods
         },
         replacegoods(state) {
             
            return state.replacegoods
        },
        cartGoodnumber(state){
            return state.goodnumber
        },
        cartGoodlistIndex(state){
            return state.goodlistIndex
        },
        //卖品数组
        cartDatalist(state) {
            return state.goodsData.list
        }
    },
    actions:{
        async [TYPES.CART_FIND_CART_DATA]({dispatch,commit},data){
            const cartData = await  findCart({
                billCode:data,
            })
            if(cartData.code != 200) return this.$message.error(cartData.msg);
            if(!cartData.data.goodsList) cartData.data.goodsList = [];
            commit(TYPES.CART_SET_GOODS_DATA,cartData.data.merGoodsList)
            commit(TYPES.GET_KIND_PRICE,cartData.data)
            commit(TYPES.GET_CART_DATA,cartData.data)
            commit(TYPES.GET_CART_BILLCODEUID,cartData.data.uid)
        }
    }
    
}