import * as TYPES from '../types'
import {findCart,initCart ,addCart} from 'http/apis'
import { Message } from 'element-ui';
import Alert from 'components/dialog/alert.js'
const vAlert = Alert.install
// import { stat } from 'fs';
const specialGoodMap = (mapItem,parentMerUid,type) => {//组合 合成品，套餐对象.
    let subObj = {};
    subObj.brandUid = mapItem.brandUid;
    subObj.merCode = mapItem.merCode;
    subObj.merName = mapItem.merName;
    subObj.merType = mapItem.merType;
    subObj.originalPrice = mapItem.price;
    subObj.salePrice = mapItem.price;
    subObj.skuCode = mapItem.skuCode;
    subObj.skuUid =  type!=4 ? mapItem.skuUid:mapItem.skuSellEntity.skuUid;
    subObj.unitUid = mapItem.unitUid;
    subObj.unitName = mapItem.unitName;
    subObj.parentMerUid = parentMerUid;
    subObj.merSpec = mapItem.merSpec;
    subObj.merUid = mapItem.merUid;
    subObj.needCount = mapItem.merCount;
    subObj.aliasName = mapItem.aliasName
    // subObj.skuName = mapItem.skuSellEntity ? mapItem.skuSellEntity.name : '';
    subObj.skuName  = mapItem.skuName;
    if(subObj.merType == 5){
        subObj.needCount = mapItem.needCount;
        subObj.rateAmount = mapItem.rateAmount;
        subObj.parentSkuUid = mapItem.parentSkuUid;
    }
    return subObj;
}

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
         replacegoodDatas:{}, //已获取的更换套餐数据
         replacegoodsInfo:{},
         goodnumber:0 ,//点击确定改变的数量值
         searchGoodsText:'',//卖品查询值
         isPayIng:false,
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
        },
        [TYPES.CART_REPLACE_GOOD_DATAS] : (state,data) => {
            state.replacegoodDatas = data;
        },
        [TYPES.CLEAR_ALL_CART] : (state) => {
            state.cartData.goodsList = []
            state.goodsData.list = []
        },
        [TYPES.CART_IS_PAY_ING] : (state,data) => {
            state.isPayIng = data
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
        },
        isPayIng(state) {
            return state.isPayIng
        }
    },
    actions:{
        async [TYPES.CART_FIND_CART_DATA]({dispatch,commit,rootState},data){
            const cartData = await  findCart({
                billCode:rootState.global.billCode,
            })
            if(cartData.code != 200) return Message.error(cartData.msg);
            if(!cartData.data.goodsList) cartData.data.goodsList = [];
            commit(TYPES.CART_SET_GOODS_DATA,cartData.data.merGoodsList)
            commit(TYPES.GET_KIND_PRICE,cartData.data)
            commit(TYPES.GET_CART_DATA,cartData.data)
            commit(TYPES.GET_CART_BILLCODEUID,cartData.data.uid)
            commit(TYPES.SET_PAYED_LIST, cartData.data.payedList)
            commit(TYPES.SAVE_CONSUME_GROUPON, cartData.data.grouponTicketResults)
            commit(TYPES.SET_ACTIVITY_LIST, cartData.data.marketingResultList)

        },
        async [TYPES.ACTION_CART_INIT_CART]({dispatch,commit},obj){
            const data = await initCart({
                netSaleFlag:'0',
                remark:'一些说明',
            })
            if(data.code == 200){
                commit(TYPES.GET_CART_BILLCODE,data.data)
            }
        },
        async [TYPES.ACTION_CART_ADD_CART]({dispatch,commit,state,rootState },dataItem){
            const item = dataItem;
            let obj = {};
            
            obj.saleNum = 1;

            if([1,2,3,5].includes(item.merType)){
                obj.salePrice = item.skuSellEntity.price;
                obj.originalPrice = item.skuSellEntity.price;
            }else{
                obj.salePrice = item.price;
                obj.originalPrice = item.price;
            }
            obj.saleMer = {};
            obj.saleMer.catUid = item.catUid
            obj.saleMer.brandUid = item.brandUid;
            obj.saleMer.merCode = item.code;
            obj.saleMer.merUid = item.merUid;
            obj.saleMer.merSpec = item.merSpec;
            obj.saleMer.aliasName = item.aliasName;
            obj.saleMer.merType = item.merType;
            obj.saleMer.merName = item.name;
            obj.saleMer.unitUid = item.unitUid;
            obj.saleMer.unitName = item.unitName;
            obj.saleMer.skuName = item.skuSellEntity ? item.skuSellEntity.name : '';
            if(![4].includes(item.merType)){ //非套餐处理
                obj.saleMer.skuCode = item.skuSellEntity.code;
                obj.saleMer.skuUid = item.skuSellEntity.skuUid;
            }
            if(item.merType == 2){ //合成品
                obj.saleMer.merItemList = [];
                item.compoundList.map((mapItem)=>{
                    obj.saleMer.merItemList.push(specialGoodMap(mapItem,item.merUid));
                })
            }
            if(item.merType == 4){ //套餐
                obj.saleMer.merItemList = [];
                for(let i = 0; i< item.cinemaSetMealItemList.length;i++){
                    let mapItem = item.cinemaSetMealItemList[i]
                    obj.saleMer.merItemList.push(specialGoodMap(mapItem,item.merUid,item.merType));
                    if(mapItem.cinemaMakeItemEntityList){
                        mapItem.cinemaMakeItemEntityList.map((map)=>{
                            map.parentSkuUid = mapItem.skuSellEntity.skuUid
                            obj.saleMer.merItemList.push(specialGoodMap(map,mapItem.merUid,)); 
                        })
                    }
                }
            }
            const data = await addCart({
                billCode:rootState.global.billCode,
                merGoodsList:[obj],
                opType:'0'
            })
            if(data.code != 200){
                let msg = data.msg;
                switch(data.code){
                    case 999 :
                        msg = '添加商品库存不足!';
                        break;
                    case 998 :
                        msg = '订单支付中';
                        break;
                    case 997 :
                        msg = '没有库存，不可售商品';
                        break;
                }
                return vAlert(msg);
            } 
            return data
        }
    }
    
}