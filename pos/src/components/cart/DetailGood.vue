<template>
    <div class="goods">
        <!-- 卖票 -->
        <div class="sell_ticket" v-if="cartData.goodsList.length">
            <p class="warp_title" v-if="goodTitleshow">电影票：{{cartData.goodsList.length}}</p>
            <div class="ticket-warp" >
                <div class="ticket-title">
                    <p>{{cartData.movieTemplate.moiveName?cartData.movieTemplate.moiveName:''}}</p>
                    <p class="color-gray movie-plan">
                        <span>{{cartData.movieTemplate.planDate}}</span>
                        <span class="name" :style="{float:(!countShow?'right':'')}">{{cartData.movieTemplate.hallName}}</span>
                    </p>
                </div>
                <div v-if="!modifyPrice">
                    <div class="row-item" v-for="(item,ind) in cartData.goodsList" :key="ind">
                        <ul class="item-warp">
                            <li>
                                <span>{{item.timeSeat.seatRow>=10?item.timeSeat.seatRow:'0'+item.timeSeat.seatRow}}排
                                    {{item.timeSeat.seatCol>=10?item.timeSeat.seatCol:'0'+item.timeSeat.seatCol}}座
                                    ({{item.timeSeat.ticketTypeName}})
                                    </span> 
                            </li>
                            <li>
                                <span class="money">{{item.timeSeat.ticketPrice}}元</span> 
                                <el-tooltip class="item" effect="dark" content="套餐A节假日超级特惠" placement="top-start" v-if="introductionWidth">
                                    <span class="active-tag" :style="{'max-width':introductionWidth+'vw','cursor':'default'}">套餐A节假日超级特惠</span>
                                </el-tooltip>
                                <span class="active-tag" :style="{'max-width':introductionWidth+'vw','cursor':'default'}" v-else>套餐A节假日超级特惠</span>
                            </li>
                            <li class="color-blue" v-if="hiddenAction" >
                                <span class="change_self" @click="handerTicket(item)">换票类</span> 
                                <span class="iconfont iconshanchu" @click="delCartTicket(item)"></span>
                            </li>
                        </ul>
                        <div class="introduction color-gray" v-if="item.timeSeat.addPrice">
                            <span>增值服务费【{{item.timeSeat.seatRow>=10?item.timeSeat.seatRow:'0'+item.timeSeat.seatRow}}排,
                                {{item.timeSeat.seatCol>=10?item.timeSeat.seatCol:'0'+item.timeSeat.seatCol}}号】
                                {{item.timeSeat.addPrice}}元
                            </span> 
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="modify-warp" v-for="(item,ind) in cartData.goodsList" :key="ind">
                        <div class="item">
                            <span>{{item.timeSeat.seatRow>=10?item.timeSeat.seatRow:'0'+item.timeSeat.seatRow}}排{{item.timeSeat.seatCol>=10?item.timeSeat.seatCol:'0'+item.timeSeat.seatCol}}座({{item.timeSeat.ticketTypeName}})</span>
                            <el-input  v-model="item.timeSeat.addPrice" size="mini" />
                            <span style="margin-left:2%">元</span> 
                        </div>
                        <div class="item">
                            <span>增值服务费</span> 
                            <el-input v-model="item.timeSeat.addPrice" size="mini"/>
                            <span style="margin-left:2%">元</span>                             
                        </div>
                    </div>
                </div>
            </div>
            <div class="totall" v-if="countShow">
                <span>小计：影票{{cartData.goodsList.length}}张,共</span>
                <span class="Countmoney color-orange">{{cartData.payAmount}}.</span>    
                <span class="Countmoney color-orange" style="font-size:1.2vw">{{decimal}}</span>    
                <span>元</span>
            </div>
        </div>
        <!-- 卖品 -->
        <div class="sell_good" v-if="cartData.goodsList.length">
            <p class="warp_title" v-if="goodTitleshow">卖品：4</p>
            <ul class="good-warp">
                <li class="row-item">
                    <ul class="item-warp">
                        <li><span>三人乐享套餐</span> </li>
                        <li ><span class="money">42.00元</span></li>
                        <li class="color-blue" v-show="hiddenAction"><span class="change_self" @click="replaceGoods">更换</span> <span class="iconfont iconshanchu"></span></li>
                    </ul>
                    <div class="color-gray introduction"><span>大爆米x1,大可乐x3,中薯条x3</span> </div>
                </li>
                <li v-for="(item,index) in goodsList" :key="index"   
                class="row-item" 
                ref="liCon" 
                :style="{height:liConHeight+'vh'}"
                >
                    <ul class="item-warp">
                        <li><span>{{item.content}}</span></li>
                        <li >
                            <span class="color-orange money">
                            <span>{{item.price}}.00元</span>    
                            <span class="el-icon-arrow-right" :class="item.openFlag?'rotate':''" @click="open(item,index)"></span>
                            </span>
                        </li>    
                        <li v-show="hiddenAction">
                            <span class="change_self pointer" v-if="0">更换</span>
                            <el-input-number size="mini" :min="1" v-model="item.num" v-else @focus="handerNumber(item,index)"></el-input-number>
                            <span class="iconfont iconshanchu color-blue pointer"></span>
                        </li>
                    </ul>
                    <div class="introduction">
                        <span>大爆谷×１，大可乐×3，中薯条×3</span>
                    </div>
                    <div class="inSon" v-for="n in 4" :key="n" style="background:#EFF3FF">
                        <span>大爆米花</span>
                        <span>30.00元</span>
                        <span class="iconfont color-blue iconshanchu"></span>
                    </div>
                </li>
                
            </ul>
            <div class="totall" v-if="countShow">
                <span>小计：卖品3份,共</span>
                <span>￥</span>
                <span class="color-orange Countmoney">156</span>    
            </div>
        </div>
    </div>
</template>
<script>
import {mapMutations , mapGetters} from 'vuex'
import {CHANGE_TICKETS_TRIGER, SHOW_REPLACE_GOODS , SHOW_CART_KEYBOARD , GET_CART_DATA , GET_KIND_PRICE , DEL_SEAT , RENDER_SELECTION_AFTER_RELEASE} from 'types'
import {clearAllTicket,delTicket,findCart,releaseSeat} from 'src/http/apis.js'
export default {
    components: {},
    props: {
        goodsList: { type:Array},
        introductionWidth: { type:Number},
        countShow: { type:Boolean,default:true},
        goodTitleshow: {type:Boolean,default:true},
        hiddenAction:{type:Boolean,default:true},
        modifyPrice:{type:Boolean,default:false}
    },
    data() {
        return {
            liConHeight: 7.5, // 文字的高度
        }
    },
    computed : {
        ...mapGetters([
            'allowSingleSold',
            'channelCode',
            'cinemaCode', //影院编码
            'currentPlanCode',   //放映编码
            'cartData'   //购物车数据
        ]),
        decimal() {
            let decimal = this.cartData.payAmount.toString()
            if(decimal.indexOf('.')>1){
                return decimal.substr(decimal.indexOf('.')+1)
            }else{
                return '00'
            }
        }
    },
    methods: {
        ...mapMutations([
            CHANGE_TICKETS_TRIGER,
            SHOW_REPLACE_GOODS,
            SHOW_CART_KEYBOARD,
            GET_CART_DATA,
            GET_KIND_PRICE,
            DEL_SEAT,
            RENDER_SELECTION_AFTER_RELEASE
        ]),
        open(item, i) {
            const liCon = this.$refs.liCon[i]
            // var height = liCon.offsetHeight
            var height = liCon.style.height.slice(0,-2)
            if (height == this.liConHeight) { // 展开
                console.log(height)
                liCon.style.height = 'auto'
                height = liCon.offsetHeight
                liCon.style.height = this.liConHeight + 'vh'
                var f = document.body.offsetHeight // 必加
                liCon.style.height = height + 'px'
            } else { // 收缩
                liCon.style.height = this.liConHeight + 'vh'
            }
            if (!item.openFlag) {
                Vue.set(item, 'openFlag', true)
            } else {
                Vue.set(item, 'openFlag', false)
            }
        },
        //换票
        handerTicket (item) {
            this.CHANGE_TICKETS_TRIGER(item)
        },
        //删除电影票
        delCartTicket(item) {
            let {billCode} = this.cartData
            let {seatCode} = item.timeSeat
            let _groupCode = item.timeSeat.groupCode
            let {goodsList} = this.cartData
            let dataArr = []
            if(!this.allowSingleSold) { //不可单卖的删除
            console.log(goodsList)
                goodsList.forEach(seat => {
                    if(seat.timeSeat.groupCode == _groupCode){
                        let {timeSeat} = seat
                        let data = {
                            "billCode": billCode,
                            "timeSeat": {"seatCode": timeSeat.seatCode},
                            goodsList:[
                                {
                                    timeSeat:{seatCode:timeSeat.seatCode}
                                }
                            ],
                            "cinemaCode":this.cinemaCode,
                            "planCode":this.currentPlanCode,
                            "lockSeatKey":timeSeat.lockSeatKey,
                            "seatCode":timeSeat.seatCode,
                            "groupCode":timeSeat.groupCode
                        }
                        dataArr.push(data)
                    }
                })
            }else {//单卖的删除
                let data = {
                    "billCode":billCode,
                    goodsList:[
                        {
                            "timeSeat":{"seatCode":seatCode},
                        }
                    ],
                    "cinemaCode":this.cinemaCode,
                    "planCode":this.currentPlanCode,
                    "lockSeatKey":seat.timeSeat.lockSeatKey,
                    "seatCode":seat.timeSeat.seatCode,
                    "groupCode":timeSeat.groupCode
                }
                dataArr.push(data)
            }
            console.log(dataArr)
            delTicket(dataArr).then(res => {
                console.log(res.data)
                if(res.code==200) {
                    findCart({"billCode":billCode}).then(res => {
                        this.GET_CART_DATA(JSON.parse(JSON.stringify(res.data)))
                        this.GET_KIND_PRICE(JSON.parse(JSON.stringify(res.data)))

                        this.DEL_SEAT(_groupCode)//前台位置颜色解锁
                        let data = {
                            channelCode: this.channelCode,
                            cinemaCode: this.cinemaCode,
                            saleBillCode: billCode,
                            timeSeatList: dataArr
                        }
                        //释放座位
                        releaseSeat(data).then(res => {
                            console.log(res)
                            this.RENDER_SELECTION_AFTER_RELEASE(res.data)
                            
                        })
                    })
                    
                }
            })
        },
        //换卖品
        replaceGoods() {
            console.log('换卖品')
            this.SHOW_REPLACE_GOODS()
        },
        //商品数量加减
        handerNumber(item,ind) {
            console.log('数字键盘')
            this.SHOW_CART_KEYBOARD(ind)
        }
    },
    created() {
    },
}
</script>
<style lang="scss">
.goods{
    box-sizing: border-box;
    background: #F5F5F5;
    span{font-size: $font-size12;}
    .warp_title{
        box-sizing: border-box;
        font-family: MicrosoftYaHei-Bold;
        font-weight: 600;
        font-size: $font-size14;
        color: #333333;
        padding: 5px 10px;
    }
    .color-orange{color: #FF7900}
    .color-gray{color: #999999}
    .color-blue{color: $font-color-blue}
    .pointer{cursor: pointer;}
    .icon-neiye-shanchu{font-size: 18px;margin-left: 5px;}
    .change_self{
        box-sizing: border-box;
        display: inline-block;
        vertical-align: middle;
        height: 3.1vh;
        width: 7.8vw;
        text-align: center;
        line-height: 3.3vh;
        border-radius: 2px;
        color: white;
        @include btn-background-color-theme($btn-background-color-theme)
    }
    //购物车
    .row-item{
        padding-top: .5%;
        .item-warp{
            box-sizing: border-box;
            height: 4.5vh;
            padding:0 0 .5% 2%;
            display: flex;
            overflow: hidden;
            text-align: center;
            li{
                height: 4vh;
                line-height: 4vh;
                box-sizing: border-box;
                &:nth-child(1){
                    flex: 1;
                    font-size: $font-size14;
                    text-align: left;
                }
                &:nth-child(2){
                    flex:1;
                    text-align: left;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: #FF7900 ;
                    .money{
                        display: inline-block;
                        vertical-align: middle;
                    }
                    .active-tag{
                        height: 2.5vh;
                        line-height: 2.1vh;
                        box-sizing: border-box;
                        border: 1px solid #FF7900;
                        padding: .1vw .5vw;
                        border-radius: 100px/100px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        display: inline-block;
                        vertical-align: middle;
                        font-size: $font-size12;
                    }
                }
                &:nth-child(3) {
                    box-sizing: border-box;
                    flex:.9;
                    cursor: pointer;
                    text-align: right;
                    padding-right: 2%;
                    &>span:first-child{
                        margin-right: 5%;
                    }
                    .iconfont{
                        vertical-align: middle;
                        font-size: $font-size18
                    }
                }
                
            }
            .rotate{transform: rotate(90deg)}
            .el-input-number{
                margin-right:5%;
                // height: 3.0vh;
                width: 7.8vw;
                padding: 0;
                // line-height: 3vh;
                span{width: 2.3vw!important;font-size: $font-size12;}
                input{padding: 0;margin: 0;font-size: $font-size12;}
            }
        }
    }
    .modify-warp{
        display: flex;
        padding:0 0 .5% 2%;        
        height: 4vh;;
        .item{
            display: flex;
            height: 100%;
            line-height: 4vh;
            flex:1;
            white-space: nowrap;
            .el-input {
                width: 50%;
                margin-left: 5%;
            }
        }
        .item:nth-child(2){
            margin-left: 5%;
        }
    } 
    //介绍 增值、商品信息
    .introduction{
        box-sizing: border-box;
        height: 3vh;
        line-height: 2vh;
        padding:0 0 1% 2%;
    }
    //购物车小计
    .totall{
            text-align: right;
            padding: 1% 2%;
            background: #EBEBEB;
            .Countmoney{
                font-size: $font-size18;
            }
        }
    //卖票
    .sell_ticket{
        .ticket-warp{
            background: white;
            .ticket-title{
                padding: 2% 2%;
                color: #333333;
                p{
                    margin-top: 1.5%;
                    font-size: $font-size14
                }
                .movie-plan{
                    span{font-size: $font-size14;}
                    .name{margin-left: 8%;margin-right: 1%}
                }
            }

        }
    }
    //卖品
    .sell_good{
        .good-warp{
            background: white;
            .row-item {
                overflow: hidden;
                color: #555;
                font-size: 12px;
                transition: height .3s;
            }
            .inSon{
                display: flex;
                justify-content: space-between;
                padding: 1% 2%; 
                &>span:nth-child(3){
                    font-size: $font-size18
                } 

            }
        }
    }
}
</style>

