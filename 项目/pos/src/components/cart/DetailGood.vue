<template>
    <div class="goods" >
        <!-- 卖票 -->
        <div class="sell_ticket" v-if="cartData.goodsList && cartData.goodsList.length">
            <p class="warp_title" v-if="goodTitleshow">电影票：{{cartData.goodsList.length}}</p>
            <div class="ticket-warp" >
                <div class="ticket-title">
                    <p>{{cartData.movieTemplate.movieName?cartData.movieTemplate.movieName:''}}</p>
                    <p class="color-gray movie-plan">
                        <span>{{cartData.movieTemplate.showTime}}</span>
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
                                <!-- <el-tooltip class="item" effect="dark" content="套餐A节假日超级特惠" placement="top-start" v-if="introductionWidth">
                                    <span class="active-tag" :style="{'max-width':introductionWidth+'vw','cursor':'default'}">套餐A节假日超级特惠</span>
                                </el-tooltip>
                                <span class="active-tag" :style="{'max-width':introductionWidth+'vw','cursor':'default'}" v-else>套餐A节假日超级特惠</span> -->
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
                <span class="Countmoney color-orange">{{ticketPrice}}.</span>    
                <span class="Countmoney color-orange" style="font-size:1.2vw">{{decimal}}</span>    
                <span>元</span>
            </div>
        </div>
        <!-- 卖品 -->
        <div class="sell_good" >
            <p class="warp_title" v-if="goodTitleshow && dataGoodsList.length">卖品：{{dataGoodsList.length}}</p>
            <ul class="good-warp">
                <!-- <li class="row-item">
                    <ul class="item-warp">
                        <li><span>{{testData.name}}</span> </li>
                        <li ><span class="money">{{testData.price + '元'}}</span></li>
                        <li class="color-blue" v-show="hiddenAction"><span class="change_self" @click="replaceGoods(testData.contents)">更换</span> <span class="iconfont iconshanchu"></span></li>
                    </ul>
                    <div class="color-gray introduction"><span v-for="(item, index) in testData.contents" :key="index">{{item.skuName + '✖' + item.merCount + '    '}}</span> </div>
                </li> -->
                <li v-for="(item,index) in dataGoodsList" :key="item.uid"   
                class="row-item" 
                ref="liCon" 
                :style="{maxHeight:item.saleMer.merType == 3 ? 'auto' : liConHeight+'vh'}"
                >
                    <ul class="item-warp">
                        <li><span>{{item.saleMer.merName}}</span></li>
                        <li >
                            <span class="color-orange money">
                            <span>{{item.salePrice*item.saleNum}}.00元</span>    
                            <span  v-if="item.saleMer.merType!=3 &&item.saleNum>1" class="el-icon-arrow-right" :class="item.openFlag?'rotate':''" @click="open(item,index)"></span>
                            </span>
                        </li>    
                        <li v-show="hiddenAction">
                            <span class="change_self pointer" v-if="item.goodsType == 3" @click="replaceGoods(item)" >更换</span>
                            <el-input-number size="mini" :min="1" v-model="item.saleNum" @change="numberChange(item)" v-else @focus="handerNumber(item,index)"></el-input-number>
                            <span class="iconfont iconshanchu color-blue pointer" @click="delGood(item)"></span>
                        </li>
                    </ul>
                    <!-- <div class="introduction" >
                        <span>大爆谷×１，大可乐×3，中薯条×3</span>
                    </div> -->
                    <div class="color-gray introduction" v-if="item.saleMer.merType == 3">
                        <span 
                        v-for="(subItem, subIndex) in item.saleMer.merItemList" 
                        :key="subIndex"
                       >
                       <template  v-if=" subItem.merType !=12">
                           {{subItem.merName + '✖' + subItem.needCount + '    '}}
                       </template>
                       </span>
                    </div>
                    <template v-if="item.saleMer.merType != 3 && item.saleNum > 1">
                       <div   class="inSon" v-for="n in item.saleNum" :key="n" style="background:#EFF3FF">
                            <span>{{item.saleMer.merName}}</span>
                            <span>{{item.salePrice}}.00元</span>
                            <span class="iconfont color-blue iconshanchu"></span>
                        </div>
                    </template>
                </li>
                
            </ul>
            <div class="totall" v-if="countShow">
                <span>小计：卖品{{dataGoodsList.length}}份,共</span>
                <span>￥</span>
                <span class="color-orange Countmoney">{{goodsPrice}}</span>    
            </div>
        </div>
    </div>
</template>
<script>
import {mapMutations , mapGetters,mapState} from 'vuex'
import {CHANGE_TICKETS_TRIGER, SHOW_REPLACE_GOODS , SHOW_CART_KEYBOARD , GET_CART_DATA , GET_KIND_PRICE , DEL_SEAT , RENDER_SELECTION_AFTER_RELEASE,CART_SET_GOODS_DATA,CART_SET_REPLAC_GOODS,GET_CART_BILLCODEUID,CART_REPLAC_GOODS_INFO} from 'types'
import {clearAllTicket,delTicket,findCart,releaseSeat,addCart,replaceGood,addFixMer} from 'src/http/apis.js'
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
            liConHeight: 4, // 文字的高度
            testData: {       //廖梦飞测试数据
                cinemaUid: "123123",
                merUid: "12345678",
                name: "家庭三人套餐",
                price: 88.88,
                contents: [
                    {
                         skuName: "可乐（中）",
                         merCount: 1,
                         itemSkuUid: "测试sku009",
                    },
                    {
                        skuName: "爆米花（大）",
                        itemSkuUid: "测试sku014",
                        merCount: 1
                    },
                    {
                        itemSkuUid: "测试sku003",
                        skuName: "咖啡",
                        merCount: 1
                    }
                ]    
                                    
            }
        }
    },
    computed : {
        ...mapState({
            dataGoodsList : state => state.cart.goodsData.list 
        }),
        ...mapGetters([
            'allowSingleSold',
            'channelCode',
            'cinemaCode', //影院编码
            'currentPlanCode',   //放映编码
            'cartData',   //购物车数据
            'billCode',
            'cartGoodnumber',
            'cartGoodlistIndex',
            'cinemaUid',
            'terminalId',
        ]),
        decimal() {
            let decimal = this.cartData.payAmount.toString()
            if(decimal.indexOf('.')>1){
                return decimal.substr(decimal.indexOf('.')+1)
            }else{
                return '00'
            }
        },
        goodsPrice(){
            let num = 0;
            this.dataGoodsList.map((item)=>{
                num += (item.saleNum * item.salePrice)
            })
            return num;
        },
        ticketPrice(){
            let num = 0;
            this.cartData.goodsList.map((item)=>{
                num += (item.saleNum * item.salePrice)
            })
            return num;
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
            RENDER_SELECTION_AFTER_RELEASE,
            CART_SET_GOODS_DATA,
            CART_SET_REPLAC_GOODS,
            GET_CART_BILLCODEUID,
            CART_REPLAC_GOODS_INFO
        ]),
        open(item, i) {
            const liCon = this.$refs.liCon[i]
            // var height = liCon.offsetHeight
            var height = liCon.style.height.slice(0,-2)
            if (!item.openFlag) { // 展开
                // console.log(height)
                // liCon.style.height = 'auto'
                // height = liCon.offsetHeight
                // liCon.style.height = this.liConHeight + 'vh'
                // var f = document.body.offsetHeight // 必加
                // liCon.style.height = height + 'px'
                liCon.style.maxHeight = '100vh'
            } else { // 收缩
                liCon.style.maxHeight = this.liConHeight + 'vh'
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
            // debugger
            let {goodsList} = this.cartData
            let dataArr = []
            if(!this.allowSingleSold) { //不可单卖的删除
            // console.log(goodsList)
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
                    "lockSeatKey":item.timeSeat.lockSeatKey,
                    "seatCode":item.timeSeat.seatCode,
                    "groupCode":item.timeSeat.groupCode
                }
                dataArr.push(data)
            }
            // console.log(dataArr)
            delTicket(dataArr[0]).then(res => {
                // console.log(res.data)
                if(res.code==200) {
                    //释放座位
                         let data = {
                                channelCode: this.channelCode,
                                cinemaCode: this.cinemaCode,
                                saleBillCode: billCode,
                                timeSeatList: dataArr
                            }
                        releaseSeat(data).then(res => {
                            // console.log(res)
                            this.RENDER_SELECTION_AFTER_RELEASE(res.data)
                            findCart({"billCode":billCode}).then(res => {
                                this.GET_CART_DATA(res.data)

                                this.GET_KIND_PRICE(res.data)
                                this.allowSingleSold ? this.DEL_SEAT(seatCode) : this.DEL_SEAT(_groupCode)
                            })
                        })
                    
                }
            })
        },
        //换卖品
        async replaceGoods(item) {
            console.log(item)
            let setmealChangeVoList = [];
            for(let i = 0 ; i < item.saleMer.merItemList.length; i++){
                let dataItem = item.saleMer.merItemList[i];
                if(dataItem.merType !=12){
                    setmealChangeVoList.push(
                        {
                         merType:dataItem.merType,
                         sku: dataItem.skuUid,
                         signType : i,
                         skuName : dataItem.merName,
                        }
                    )  
                 }
            }
            const data = await replaceGood({
                cinemaUid : this.cinemaUid,
                setmealChangeVoList,
                terminalCode : this.terminalId,
            })
            if(data.code!=200) return this.$message.error(data.msg)
            if(!data.data.length) return this.$message.warning('无可更换的商品！')
            this[CART_REPLAC_GOODS_INFO](item)
            this[CART_SET_REPLAC_GOODS](data.data);
            this.SHOW_REPLACE_GOODS();
        },
        //商品数量加减
        handerNumber(item,ind) {
            console.log('数字键盘')
            this.SHOW_CART_KEYBOARD(ind)
        },
        async numberChange(item){
            item.billCode = this.billCode
            const data = await addFixMer(item)
            if(data.code !=200) return
            this.getgoodsList()
        },
        async getgoodsList(){
            const cartData = await  findCart({
                billCode:this.billCode,
            })
            if(cartData.code != 200) return this.$message.error(cartData.msg);
            if(!cartData.data.goodsList) cartData.data.goodsList = [];
            this[CART_SET_GOODS_DATA](cartData.data.merGoodsList)
            this[GET_KIND_PRICE](cartData.data)
            this[GET_CART_DATA](cartData.data)
            this[GET_CART_BILLCODEUID](cartData.data.uid)
        },
        async delGood(item){
            let obj = {
                goodsType : item.goodsType,
                saleMer : {
                    merCode : item.saleMer.merCode,
                    skuCode : item.saleMer.skuCode
                },
                uid : item.uid,
                saleNum : item.saleNum
            }
            const data = await delTicket({
                billCode : this.billCode,
                merGoodsList:[obj]
            })
            if(data.code != 200) return this.$message.error(data.msg)
            this.getgoodsList()
        }
    },
    watch:{
        cartGoodnumber(newVal,oldVal){
            let item = {...this.dataGoodsList[this.cartGoodlistIndex]}
            item.saleNum = newVal;
            this.numberChange(item)
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
                transition: all .3s;
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

