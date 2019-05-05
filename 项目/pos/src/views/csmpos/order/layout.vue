<template>
    <div class="order">
        <div class="header">
            <span>详情</span> 
            <span  class="iconfont iconguanbi to-back" style="cursor:pointer" @click="toBack" ></span>
        </div>
        <main class="container">
            <div class="goods-warp">
                <div class="warp_title">
                    <span >订单详情</span>
                </div>
                <div class="goods">
                    <Goods  :goodTitleshow="false" 
                    :goodsList='goodsList'
                    :cartData='cartData'
                    :modifyPrice= 'modifyPr'
                    ></Goods>
                </div>
                <div class="goods-btn">
                    <div class="paginaButtoms">
                        <span class="previous">&lt;</span>
                        <span class="next">&gt;</span>
                    </div>
                </div>
            </div>
            <template>
                <div class="detial-warp">
                    <div class="warp_title">
                        <span  v-if="cartData.saleBillPayList">已支付明细:3</span>
                    </div>
                    <div class="money" v-if="cartData.saleBillPayList"> 
                        <div class="item" v-for="(item,ind) in cartData.saleBillPayList" :key="ind" >
                            <span>{{item.payTypeName}}</span>
                            <span>{{item.payAmount}}元</span>
                            <span class="iconfont iconshanchu"></span>
                        </div>
                        <div class="pay-btn">
                            <div href="javascript::void(0)" plain class="el-icon-arrow-right"></div>
                            <div href="javascript::void(0)" plain class="el-icon-arrow-left"></div>
                        </div>
                    </div>
                    <div class="row-item">
                        <div>
                            <span class="title">原价：</span>
                            <span class="bold">{{cartData.originalAmount?cartData.originalAmount:0}}元</span>
                        </div>
                        <div>
                            <span class="title">优惠：</span>
                            <span class="bold">{{cartData.couponAmount?cartData.couponAmount:0}}元</span>
                        </div>
                    </div>
                    <div class="row-item">
                        <div>
                            <span class="title">应收：</span>
                            <span class="bold">{{cartData.payAmount?cartData.payAmount:0}}元</span>
                        </div>
                        <div>
                            <span>(影院补贴15元)</span>
                        </div>
                    </div>
                    <div class="row-item">
                        <div>
                            <span class="title">已支付：</span>
                            <span class="bold">{{cartData.payedAmount?cartData.payedAmount:0}}元</span>
                        </div>
                        <div></div>
                    </div>
                    <div class="row-item">
                        <div>
                            <span class="title">待支付：</span>
                            <span class="bold">{{cartData.notPayAmount?cartData.notPayAmount:0}}元</span>
                        </div>
                        <div></div>
                    </div>
                    <div class="menue-btn" v-if="!modifyPr">
                        <span class="" type="primary" plain size="mini" @click="give">赠送</span>
                        <span class="" type="primary" plain @click="lost">报损</span>
                        <span class="" type="primary" plain @click="empty">清空购物车</span>
                        <span class="" type="primary" @click="modifyPrice">调价</span>
                    </div>
                    <div class="menue-btn" v-else >
                        <span class="" type="primary" plain size="mini" @click="handerModify(false)">取消</span>
                        <span class="" type="primary" plain     @click="handerModify(true)">确定</span>
                    </div>
                </div>
            </template>
        </main>
        <ticketsChanging v-if="changingTicket"></ticketsChanging>
        <key-number-board></key-number-board>
        <replace-goods></replace-goods>
    </div>
</template>
<script>
import sele from 'src/components/activity'
import Goods from 'src/components/cart/DetailGood';

import ReplaceGoods from 'src/components/dialog/ReplaceGoods'
import ticketsChanging from 'src/components/ticketsChanging'
import SettlementWindow from 'components/settlement/SettlementWindow'
import KeyNumberBoard from 'components/dialog/CartNumberKeyBoard'

import {mapGetters,mapMutations} from 'vuex'
import {RENDER_SELECTION_AFTER_RELEASE,GET_CART_DATA,GET_CART_BILLCODE,CLEAR_SELECTION} from 'src/newVuex/types'
import {clearAllTicket,releaseSeat} from 'src/http/apis.js'

export default {
    name:'order',
    components:{Goods,sele,ticketsChanging,ReplaceGoods, KeyNumberBoard},
    data() {
        return {
            modifyPr:false,
            goodlist:[
                {content:"三人家庭爆米花"},
                {content:"三人家庭爆米花"},
                {content:"三人家庭爆米花"},
                {content:"三人家庭爆米花"},
                {content:"三人家庭爆米花"},
                {content:"三人家庭爆米花"},
            ]
        }
    },
    computed: {
        ...mapGetters([
            'goodsList',
            'cartData',
            'channelCode',
            'cinemaCode',
            'currentPlanCode',   //放映编码
            'changingTicket'
        ])
    },
    methods: {
        ...mapMutations([
            RENDER_SELECTION_AFTER_RELEASE,
            GET_CART_DATA,
            GET_CART_BILLCODE,
            CLEAR_SELECTION
        ]),
        give() {},
        lost() {},
        empty() {
            if(this.cartData.goodsList.length){
                clearAllTicket({"billCode":this.cartData.billCode}).then(res => {
                    if(res.code==200){
                        //释放座位
                        let dataArr = []
                        this.cartData.goodsList.forEach(item => {
                            let {timeSeat} = item
                            let ticket = {
                                "cinemaCode":this.cinemaCode,
                                "planCode":this.currentPlanCode,
                                "lockSeatKey":timeSeat.lockSeatKey,
                                "seatCode":timeSeat.seatCode,
                                "groupCode":timeSeat.groupCode,
                            }
                            dataArr.push(ticket)
                        })
                        let datas = {
                            channelCode: this.channelCode,
                            cinemaCode: this.cinemaCode,
                            saleBillCode: this.cartData.billCode,
                            timeSeatList: dataArr
                        }
                        //释放座位
                        releaseSeat(datas).then(res => {
                            if(res.code == 200) {
                                this.RENDER_SELECTION_AFTER_RELEASE(res.data)
                                this.GET_CART_DATA({goodsList:[]})   //置空购物车vuex的数据
                                this.GET_CART_BILLCODE('')
                                this.CLEAR_SELECTION()
                            }
                        })
                    }
                })  //清空
            }else{
                this.$message({
                    type:'warning',
                    message:'已清空购物车',
                    duration:1000
                })
            }
        },
        handerModify(yse) {
            if(yse){
                if(this.cartData.goodsList.length) {

                }else {
                    this.modifyPr = false
                }
            }else{
                this.modifyPr = false
            }
        },
        modifyPrice() {
            console.log('调价')
            this.modifyPr = true
        },
        toBack() {
            this.$router.go(-1)
        }
    } 

}
</script>
<style lang="scss">
.order{
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    overflow: hidden;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    .header{
        display: flex;
        height: 6.3vh;
        line-height: 6.3vh;
        padding:0 2.5vw;
        justify-content: space-between;
        color: #FFFFFF;
        font-size: $font-size16;
        @include bg_color($background-color-theme);
        span{font-size: $font-size16}
    }
    .warp_title{
        font-family: MicrosoftYaHei-Bold;
        font-weight: 600;
        font-size: $font-size14;
        color: #333333;
        padding: 0 10px;
        height: 5vh;
        line-height: 5vh;
    }
    .container{
        overflow: hidden;
        flex: 1;
        display: flex;
        padding-bottom: 2.6vh;
        .goods-warp{
            background: #f5f5f5;;
            display:flex;
            flex-direction: column; 
            flex: 1;
            padding-left: 2vw;
            .goods{
                flex: 1;
                overflow: auto;
            }
            .goods-btn{
                height: 11.6vh;
                background: #fff;
                position: relative;
                .paginaButtoms{
                    position: absolute;
                    bottom: 10%;
                    left: 50%;
                    transform: translateX(-50%);
                    text-align: center;
                    span{
                        display: inline-block;
                        width: 3.9vw;
                        height: 3.4vh;
                        line-height: 3.4vh;
                        border: #3B74FF solid 1px;
                        border-radius: 0.2vw;
                        margin-left: 1.5vw;
                        cursor: pointer;
                    }
                }
            }
        }
        .detial-warp{
            position: relative;
            width: 33.6%;
            float: right;
            padding:0 2vw;
            background: #f5f5f5;
            .money{
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
                background: #FFFFFF;
                padding:10px 2vw;
                margin:0px 0; 
                .item{
                    display: flex;
                    flex: 1;
                    margin-bottom: 10px;
                        span{font-size: $font-size14};
                        &>span:first-child{
                            width: 20%
                        }
                        &>span:nth-child(2) {
                            display: inline-block;
                            width: 60%;
                            color: #FF7900;
                        }
                        &>span:nth-child(3) {
                            width: 20%;
                            color: #3B74FF;
                            text-align: right;
                            cursor: pointer;
                            font-size: 18px;
                        }
                }
                .pay-btn{
                    padding-right: 5%;
                    &>div{
                        float: right;
                        width: 3.9vw;
                        height: 3.4vh;
                        line-height: 3.4vh;
                        text-align: center;
                        border:$btn-background-color-theme 1px solid;
                        font-size: $font-size12;
                        border-radius: 2px; 
                        cursor: pointer;
                        &:active{background:$btn-background-color-theme;color: #FFFFFF }
                    }
                    &>div:last-child{
                        margin-right: .5vw;
                    }
                }
                
            }
            .row-item{
                background: #FFFFFF;
                margin-bottom:1.5vh;
                padding: 5% 10%;
                display: flex;
                &>div{
                    display: flex;
                    flex:1;
                    span{flex:50%;font-size: $font-size14}
                    .title{color:#666666;display: inline-block}
                    .bold{font-weight: 600}
                }
            }
            .menue-btn{
                position: absolute;
                bottom: 0;
                right: 5%;
                margin-top: 5vh;
                text-align: center;
                span{
                    box-sizing: border-box;
                    display: inline-block;
                    font-size: $font-size14;
                    width: 7.8vw;
                    height: 4.2vh;
                    line-height: 4.2vh;
                    text-align: center;
                    border:$btn-background-color-theme 1px solid;
                    font-size: $font-size12;
                    border-radius: 2px; 
                    cursor: pointer;
                    &:active{background:$btn-background-color-theme;color: #FFFFFF }
                }
            }

        }

    }
}
</style>


