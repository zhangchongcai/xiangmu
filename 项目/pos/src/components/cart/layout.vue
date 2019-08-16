<template>
    <div class="cart" >
        <header class="header"><span class="el-icon-arrow-down" style="margin-right:5px;cursor:pointer" @click="popCart" ></span><span @click="popCart" style="cursor:pointer">收起</span> </header>
        <main class="content-warp" ref='cart'>
            <DetailGood 
            :goodsList="goodsList"
            :cartData="cartData"
            :introductionWidth = 9
            :moneyWidth = "moneyWidth"
            :countShow=false
            ></DetailGood>
        </main>
        <footer class="footer">
            <div class="pagation">
                <el-button plain size="mini" :disabled="up" class="el-icon-arrow-up up-down-btn"     @click="handerScroll(false)"></el-button>
                <el-button plain size="mini" :disabled="down" class="el-icon-arrow-down up-down-btn"     @click="handerScroll(true)"></el-button>
                <!-- <span href="javascript:void(0)" class="el-icon-arrow-up up-down-btn"  :disabled="scroll" @click="handerScroll(false)"></span>

                <span href="javascript:void(0)" class="el-icon-arrow-down up-down-btn" :disabled="scroll" @click="handerScroll(true)"></span> -->
            </div>
            <ul class="pay-ment">
                <li>
                    <span>应收：{{cartData.payAmount?cartData.payAmount:0}}元</span>

                </li>
                <li>
                    <span>已付：{{cartData.payedAmount?cartData.payedAmount:0}}元</span>
                </li>
                <li>
                    <span>未付：</span>    
                    <span class="not-pay">{{notPayAmounts[0]}}.</span>
                    <span>{{notPayAmounts[1]}}元</span>
                </li>                    
            </ul>
            <div class="button-warp">
                <el-button class="btn-style" plain @click="emptyCart">清空</el-button>
                <!-- <el-button class="btn-style" plain @click="preparemeals">备餐</el-button>
                <el-button class="btn-style" plain>挂单</el-button> -->
                <el-button class="btn-style" plain @click="detail">详情</el-button>
            </div>
        </footer>
    </div>
</template>
<script>
import DetailGood from './DetailGood';
import { findCart , clearAllCart , releaseSeat } from 'src/http/apis.js'
import {mapMutations,mapGetters} from 'vuex'
import {GET_CART_GOODSLIST, CART_SET_GOODS_DATA, GET_CART_DATA,GET_CART_BILLCODE , RENDER_SELECTION_AFTER_RELEASE ,CLEAR_SELECTION} from 'types'
export default {
    components:{DetailGood},
    props:{},
    data() {
        return {
            moneyWidth:'40%',
            cartIsshow:false,
            scroll:false,
            down:true,
            up:true
        }
    },
    mounted(){
        this.$refs.cart.addEventListener('scroll',this.scrollChange)
        this.scrollChange()
    },
    beforeDestroy(){
        this.$refs.cart.removeEventListener('scroll',this.scrollChange)
    },
    computed : {
        ...mapGetters([
            'getcartNumber',
            'goodsList',
            'cartData',
            'payData' ,
            'channelCode',
            'cinemaCode',
            'currentPlanCode',   //放映编码
            'cartDatalist'  //卖品数组
        ]),
        decimal() {
            let money = this.cartData.payAmount?this.cartData.payAmount:0
            let decimal = money.toString()
            if(decimal.indexOf('.')>1){
                return decimal.substr(decimal.indexOf('.')+1)
            }else{
                return '00'
            }
        },
        notPayAmounts(){
            let money = this.cartData.payAmount?this.cartData.payAmount:'0.00';
            money = money.toString()
            let arr = money.split('.');
            if(arr.length  == 1) arr.push('00')
            return arr
        },
        cartLength(){
            return this.cartDatalist.length+this.cartData.goodsList.length
        }
    },
    watch:{
        cartLength(val){
            // console.log(val)
            // const offsetHeight =  this.$refs.cart.offsetHeight
            // const scrollHeight = this.$refs.cart.scrollHeight
            // const scrollTop = this.$refs.cart.scrollTop
            // if(scrollHeight > offsetHeight) this.down = false;
            // if(scrollTop > 0) this.up = false
            // if(scrollTop == 0) this.up = true
            // if((scrollTop+offsetHeight) == scrollHeight) this.down = true;
            // this.$refs.cart.scrollTop
            this.scrollChange()
        }
    },
    methods: {
        ...mapMutations([
            GET_CART_GOODSLIST,
            GET_CART_DATA,
            GET_CART_BILLCODE,
            RENDER_SELECTION_AFTER_RELEASE,
            CLEAR_SELECTION,
            CART_SET_GOODS_DATA //清空卖品数组
        ]),
        //滚动条滚动
        handerScroll(down) {
            let scrollHeight = this.$refs.cart.scrollHeight
            let boxHeight = this.$refs.cart.offsetHeight
            let currentScrolltop = this.$refs.cart.scrollTop
            let OldscroolHeight = this.$refs.cart.scrollTop
            let swiperHeight = 100
            if(scrollHeight>boxHeight){
                let Timer = setInterval( _ => {
                    let speed = down? Math.floor(swiperHeight / 6) : Math.floor(-swiperHeight / 6);
                    this.$refs.cart.scrollTop += speed 
                    currentScrolltop += speed;
                    if(down){
                        if(currentScrolltop >= OldscroolHeight*1+swiperHeight){
                            clearInterval(Timer)
                        }
                    }else {
                        if(currentScrolltop <= OldscroolHeight-swiperHeight){
                            clearInterval(Timer)
                        }
                    }
                },20)
            }
        },
        scrollChange(){
            const offsetHeight =  this.$refs.cart.offsetHeight
            const scrollHeight = this.$refs.cart.scrollHeight
            const scrollTop = this.$refs.cart.scrollTop
            if(scrollHeight > offsetHeight) this.down = false;
            if(scrollTop > 0) this.up = false
            if(scrollTop == 0) this.up = true
            if((scrollTop+offsetHeight) == scrollHeight) this.down = true;
        },
        detail() {
            this.$router.push({name:"order"})
        },
        popCart() {
            this.$emit('handerDetail')
        },
        //清空
        emptyCart() {
            if(this.cartData.goodsList.length || this.cartDatalist.length){
                clearAllCart({"billCode":this.cartData.billCode}).then(res => {
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

                        this.CART_SET_GOODS_DATA([])
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
        //备餐
        preparemeals() {
            this.$router.push({name:'preparemeals'})
        }
        
    },
    created() {
        // this.getCartInof()
    }
}
</script>
<style lang="scss">
    .cart{
        display: flex;
        flex-direction: column;
        width: 37.3vw;
        height: 77.1vh;
        width: 100%;
        box-sizing: border-box;
        background: #FFFFFF ;
        box-shadow: -1px -1px 10px 1px #869ed8;
        
        .orange{
            color:#FF7900 
        }
        .header{
            width: 100%;
            font-size: 1.2vw;
            height: 3.6vh;
            line-height: 3.6vh;
            border-top-left-radius: 2px;
            border-top-right-radius: 2px;
            text-align: center;
            color: aliceblue;
            span{font-size: $font-size12;}
            @include btn-background-color-theme($btn-background-color-theme);
        }
        .content-warp{
            flex: 1;
            width: 100%;
            overflow: auto;
            background: #FFF;
            border-left: 1px solid #f5f5f5;
        }
        .footer{
            box-sizing: border-box;
            border-top: 2% white solid;
            padding-top: 2%;
            width: 100%;
            .pagation{
                text-align: center;
                // .up-down-btn{
                //     display: inline-block;
                //     width: 3.8vw;
                //     height: 3.4vh;
                //     margin: 2px;
                //     font-size: 1.2vw;
                //     line-height: 3.4vh;
                //     cursor: pointer;
                //     border: #3b74ff 1px solid;
                //     border-radius: 2px;
                //     font-size: $font-size12;
                //     color: #3b74ff;
                //     &:active{
                //         background: #3b74ff;
                //         color: #ffffff
                //     }
                // }
            }
            .pay-ment{
                display: flex;
                padding:5%;
                text-align: left;
                line-height: 100%;
                li{
                    flex:1;
                    display: inline-block;
                    span{
                        color:  #333333;
                        font-size: $font-size12;
                    }
                    .not-pay{
                        font-size: $font-size18;
                        color: #FF7900;
                    }
                    .not-pay + span {
                        color: #FF7900;
                    }
                }
            }
            .button-warp{
                margin-bottom: 5px;
                text-align: center;
                .btn-style {
                    border: 1px solid #bcbcbc;
                    color: #333 !important;
                }
                .el-button{
                    width: 8.2vw;
                    height:5.2vh;
                    padding: 5px 12px;
                    margin: 2px;
                    span{
                        font-size: 1.2vw;
                    }
                }
            }
        }
    }
</style>

