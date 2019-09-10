<template>
    <div class="goods" >
        <!-- 卖票 -->
        <div class="sell_ticket" v-if="cartData.goodsList && cartData.goodsList.length">
            <p class="warp_title" v-if="goodTitleshow">电影票：{{cartData.goodsList.length}}</p>
            <div class="ticket-warp" >
                <div class="ticket-title">
                    <p>
                        {{cartData.movieTemplate.movieName?cartData.movieTemplate.movieName:''}}
                        <template v-if="cartData.movieTemplate.disVersion || cartData.movieTemplate.movieDescLanguage">
                            (
                                {{cartData.movieTemplate.disVersion ?  cartData.movieTemplate.disVersion : ''}}
                                <template v-if="cartData.movieTemplate.disVersion && cartData.movieTemplate.movieDescLanguage">
                                    /
                                </template>
                                {{cartData.movieTemplate.movieDescLanguage ? cartData.movieTemplate.movieDescLanguage  : ''}}
                            )
                        </template>
                    </p>
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
                                <span class="money" v-if="item.couponType == 0">{{item.timeSeat.ticketPrice}}元</span> 
                                <template v-else>
                                   <span class="money" >{{item.timeSeat.ticketPrice}}元</span>
                                   <span class="originalPrice">{{item.timeSeat.originalTicketPrice}}元</span>
                                    <el-tooltip class="item" effect="dark" :content="item.couponTicketSpec || '优惠券'" placement="top">
                                    <span class="tip" :class="'tip'+item.couponType">{{item.couponTicketSpec || '优惠券'}}</span>
                                    </el-tooltip>   
                                </template>
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
                            <el-input  
                            v-model="item.timeSeat.ticketPrice" 
                            size="mini"
                            @change="modelChange(item.timeSeat,'oldticketPrice',...arguments)"
                            @focus="modelFocus(item.timeSeat,'oldticketPrice')"
                             />
                            <span style="margin-left:2%">元</span> 
                        </div>
                        <div class="item">
                            <span>增值服务费</span> 
                            <el-input 
                            v-model="item.timeSeat.addPrice" 
                            size="mini"
                            @change="modelChange(item.timeSeat,'oldaddPrice',...arguments)"
                            @focus="modelFocus(item.timeSeat,'oldaddPrice')"/>
                            <span style="margin-left:2%">元</span>                             
                        </div>
                    </div>
                </div>
            </div>
            <div class="totall" v-if="countShow">
                <span>小计：影票{{cartData.goodsList.length}}张,共</span>
                <span class="Countmoney color-orange">{{ticketPrice}}</span>    
                <!-- <span class="Countmoney color-orange" style="font-size:1.2vw">{{decimal}}</span>     -->
                <span>元</span>
            </div>
        </div>
        <!-- 卖品 -->
        <div class="sell_good" >
            <p class="warp_title" v-if="goodTitleshow && dataGoodsList.length">卖品：{{goodsNumber}}</p>
            <ul class="good-warp">
                <!-- <li class="row-item">
                    <ul class="item-warp">
                        <li><span>{{testData.name}}</span> </li>
                        <li ><span class="money">{{testData.price + '元'}}</span></li>
                        <li class="color-blue" v-show="hiddenAction"><span class="change_self" @click="replaceGoods(testData.contents)">更换</span> <span class="iconfont iconshanchu"></span></li>
                    </ul>
                    <div class="color-gray introduction"><span v-for="(item, index) in testData.contents" :key="index">{{item.skuName + '✖' + item.merCount + '    '}}</span> </div>
                </li> -->
                <li v-for="(item,index) in dataGoodsList" :key="item.uid + index"   
                class="row-item" 
                ref="liCon" 
                :style="{maxHeight:item.saleMer.merType == 3 ? 'auto' : liConHeight+'vh'}"
                >
                    <ul class="item-warp">
                        <li>
                            <span :style="{color:'#333333'}">
                            {{item.goodsName}}
                            <!-- {{[1,3,5].includes(item.merType) ? item.skuSellEntity.name:
                                item.merType==2 ? item.name+'/'+ item.skuSellEntity.name : item.name}} -->
                            <template v-if="modifyPrice && item.goodsType!=3">
                                x{{item.saleNum}}
                            </template>
                            <template v-if="!hiddenAction">
                                x{{item.saleNum}}
                            </template>
                            </span>
                        </li>
                        <li >
                            <div v-if="modifyPrice " >
                                <span :style="{color:'#999999'}">单价</span>
                                <el-input 
                                size="mini"
                                :style="{width:'14.6vw'}"
                                v-model.number="item.salePrice"
                                @change="modelChange(item,'oldsalePrice',...arguments)"
                                @focus="modelFocus(item,'oldsalePrice')"></el-input>
                                <span :style="{color:'#333333'}">元</span>
                            </div>
                            <span class="color-orange money" v-else>
                                <span 
                                    v-if="item.saleMer.merType!=3 &&item.saleNum>1"
                                    @click="open(item,index)">
                                    <span>{{Number(item.salePrice*item.saleNum).toFixed(2)}}元</span> <span  class="el-icon-arrow-right" :class="item.openFlag?'rotate':''" ></span>
                                </span>
                                <span v-else>{{Number(item.salePrice*item.saleNum).toFixed(2)}}元</span>
                                <template v-if="item.couponType">
                                    <span class="originalPrice">{{Number(item.originalPrice*item.saleNum).toFixed(2)}}元</span>
                                    <el-tooltip class="item" effect="dark" :content="item.couponMerSpec || '优惠券'" placement="top">
                                        <span class="tip" :class="'tip'+item.couponType">
                                        {{item.couponMerSpec || '优惠券'}}
                                    </span>
                                    </el-tooltip>
                                    
                                    
                                    
                                </template>
                            </span>
                            
                        </li>    
                        <li v-show="hiddenAction">
                            <template v-if="!modifyPrice">
                                <!-- <span class="change_self pointer" v-if="item.goodsType == 3 && item.cinemaSetmealItemList" @click="replaceGoods(item)" >更换</span> -->
                                <span class="change_self pointer" v-if="item.goodsType == 3 " @click="replaceGoods(item)" >更换</span>
                                <!-- <el-input-number  size="mini" :min="1" v-model="item.saleNum" @change="numberChange(item)" v-else @focus="handerNumber(item,index)"></el-input-number> -->
                                <numberInput :min="1" v-model="item.saleNum" @change="numberChange(item)" v-if="item.goodsType != 3" @focus="handerNumber(item,index)" ></numberInput>
                                <span class="iconfont iconshanchu color-blue pointer" @click="delGood(item)"></span>
                            </template>

                            <span class="change_self pointer" 
                            v-if="modifyPrice && item.saleNum > 1"  
                            @click="openAdjust(item,index)">调整</span>
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
                           {{subItem.merName + 'x' + subItem.needCount + '    '}}
                       </template>
                       </span>
                    </div>
                    <template v-if="item.saleMer.merType != 3 && item.saleNum > 1">
                       <div   class="inSon" v-for="n in item.saleNum" :key="n" style="background:#EFF3FF">
                            <span>{{item.saleMer.merName}}</span>
                            <span>{{Number(item.salePrice).toFixed(2)}}元</span>
                            <span v-if="hiddenAction" @click="delSubItem(item)" class="iconfont color-blue iconshanchu"></span>
                        </div>
                    </template>
                </li>
                
            </ul>
            <div class="totall" v-if="countShow &&dataGoodsList.length">
                <span>小计：卖品{{goodsNumber}}份,共</span>
                <span>￥</span>
                <span class="color-orange Countmoney">{{goodsPrice}}</span>    
            </div>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="42%"
            >
            <el-form    :model="adjustForm" :rules="rules" ref="adjustForm" >
                <el-form-item label="调价数量：" prop="saleNum" label-width="13vw">
                    <el-input v-model.number="adjustForm.saleNum" style="width:23vw"  ></el-input>
                </el-form-item>
                <el-form-item label="单价：" prop="salePrice" label-width="13vw">
                    <el-input v-model.number="adjustForm.salePrice" style="width:23vw"></el-input>
                </el-form-item>
                <el-form-item style="text-align:center;">
                    <el-button @click="dialogVisible=false">取消</el-button>
                    <el-button type="primary" @click="adjust">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        
    </div>
</template>
<script>
import {mapMutations , mapGetters,mapState} from 'vuex'
import { VM_CART_MODEFY_PRICE_START,VM_CART_MODEFY_PRICE_REFER,VM_CART_NUMBER_CHANGE,VM_GET_GOODS_LIST } from 'types/vmOnType'
import {CHANGE_TICKETS_TRIGER, SHOW_REPLACE_GOODS , SHOW_CART_KEYBOARD , GET_CART_DATA , GET_KIND_PRICE , DEL_SEAT , RENDER_SELECTION_AFTER_RELEASE,CART_SET_GOODS_DATA,CART_SET_REPLAC_GOODS,GET_CART_BILLCODEUID,CART_REPLAC_GOODS_INFO,CART_REPLACE_GOOD_DATAS} from 'types'
import {clearAllTicket,delTicket,findCart,releaseSeat,addCart,replaceGood,addFixMer} from 'src/http/apis.js'
import numberInput from 'components/numberInput' ;

const saleNumRule = (_this,rule, value, callback) => {
     if (value === '') return callback(new Error('请输入调价数量'));
     if(!Number.isInteger(value)) return callback(new Error('请输入正整数'));
     if(value > _this.adjustForm.oldSaleNum) return callback(new Error('调价数量不能大于'+_this.adjustForm.oldSaleNum));
     if(value < 1) return callback(new Error('调价数量不能小于1'));
     callback();
    
}
const salePriceRule = (rule, value, callback) => {
    if(value === '') return callback(new Error('请输入单价'));
    if(typeof value != 'number') return callback(new Error('请输入数字'))
    if(value < 0) return callback(new Error('单价不能为负数'))
    const req = /\.([0-9]{3})/
    if(req.test(value)) return callback(new Error('小数不能超过2位'));
    callback();
}
export default {
    components: {
        numberInput
    },
    props: {
        goodsList: { type:Array},
        introductionWidth: { type:Number},
        countShow: { type:Boolean,default:true},
        goodTitleshow: {type:Boolean,default:true},
        hiddenAction:{type:Boolean,default:true},
        modifyPrice:{type:Boolean,default:false}
    },
    data() {
        const _this = this;
        return {
            numa:1,
            liConHeight: 4, // 文字的高度
            delState:false,
            oldData:null,
            dialogVisible:false,
            adjustForm:{},
            selectAdjustIndex:'',
            rules:{
                saleNum:[
                    { validator :  function(rule, value, callback){
                        saleNumRule(_this,...arguments)
                    } ,trgger:'input' }
                ],
                salePrice:[
                    { validator:salePriceRule,trgger:'input' }
                ]
            }
        }
    },
    computed : {
        ...mapState({
            dataGoodsList : state => state.cart.goodsData.list ,
            replaceGoodDatas : state => state.cart.replacegoodDatas
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
        // decimal() {
        //     let decimal = this.cartData.payAmount.toString()
        //     if(decimal.indexOf('.')>1){
        //         return decimal.substr(decimal.indexOf('.')+1)
        //     }else{
        //         return '00'
        //     }
        // },
        goodsPrice(){
            let num = 0;
            this.dataGoodsList.map((item)=>{
                num += ((item.saleNum * (item.salePrice * 100000))/100000)
            })
            return Number(num).toFixed(2);
        },
        ticketPrice(){
            let num = 0;
            this.cartData.goodsList.map((item)=>{
                num += (((item.timeSeat.ticketPrice + item.timeSeat.addPrice) * 100000)/100000)
            })
            return Number(num).toFixed(2);
        },
        goodsNumber(){
            let num = 0;
            this.dataGoodsList.map((item)=>{
                num += item.saleNum
            })
            return num
        }
    },
    created() {
    },
    mounted(){
        if(this.$route.name == 'order'){
            this.$vm.$on(VM_CART_MODEFY_PRICE_START,(data)=>{
                if(data){
                    this.oldData = JSON.parse(JSON.stringify(this.cartData))
                }else{
                    this.setShoppingCartData(this.oldData)
                }
            })
            this.$vm.$on(VM_CART_MODEFY_PRICE_REFER,() => {
                this.referAdjust();
            })
        }
        if(!this.$vm._events[VM_CART_NUMBER_CHANGE]){
            this.$vm.$on(VM_CART_NUMBER_CHANGE,(num)=>{
                let item = {...this.dataGoodsList[this.cartGoodlistIndex]}
                item.saleNum = num;
                this.numberChange(item)
            })
        }
        console.log(this.$vm)
        
        
    },
    beforeDestroy(){
        if(this.$route.name == 'order'){
            this.$vm.$off([VM_CART_MODEFY_PRICE_START,VM_CART_MODEFY_PRICE_REFER])
        }
        // console.log('解绑')
        // this.$vm.$off(VM_CART_NUMBER_CHANGE)
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
            CART_REPLAC_GOODS_INFO,
            CART_REPLACE_GOOD_DATAS
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
            // let data = {
            //             "billCode": billCode,
                      
            //             goodsList:[
                            
            //             ],
                        
            //         }
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
                        // let obj = {
                        //         timeSeat:{seatCode:timeSeat.seatCode}
                        //     }
                            
                        // data.goodsList.push(obj)
                    }
                })
                // dataArr.push(data)
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
            for(let i = 0; i < dataArr.length; i++){
                delTicket(dataArr[i]).then(res => {
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
            }
            // delTicket(dataArr[0]).then(res => {
            //     // console.log(res.data)
            //     if(res.code==200) {
            //         //释放座位
            //              let data = {
            //                     channelCode: this.channelCode,
            //                     cinemaCode: this.cinemaCode,
            //                     saleBillCode: billCode,
            //                     timeSeatList: dataArr
            //                 }
            //             releaseSeat(data).then(res => {
            //                 // console.log(res)
            //                 this.RENDER_SELECTION_AFTER_RELEASE(res.data)
            //                 findCart({"billCode":billCode}).then(res => {
            //                     this.GET_CART_DATA(res.data)

            //                     this.GET_KIND_PRICE(res.data)
            //                     this.allowSingleSold ? this.DEL_SEAT(seatCode) : this.DEL_SEAT(_groupCode)
            //                 })
            //             })
                    
            //     }
            // })
        },
        //换卖品
        async replaceGoods(item) {
            let data = null;
            if(this.replaceGoodDatas[item.uid]){
                 data = {
                    data: this.replaceGoodDatas[item.uid]
                }
            }else{
                 data = await replaceGood({
                    cinemaUid : this.cinemaUid,
                    comboUid:item.saleMer.merUid,
                    terminalCode : this.terminalId,
                })
                if(data.code!=200) return this.$message.error(data.msg)
                if(!data.data.length) return this.$alert ('无可更换的商品！')
                
                
                let obj = JSON.parse(JSON.stringify(this.replaceGoodDatas)) ;
                data.data.map((dataItem)=>{
                    dataItem.oldItemSkuUid = dataItem.itemSkuUid
                    dataItem.cinemaSetmealItemChangeVoList.map((subItem)=>{
                        subItem.oldItemSkuUid = dataItem.itemSkuUid
                    })
                })
                obj[item.uid] = data.data
                this[CART_REPLACE_GOOD_DATAS](obj)
            }
            this[CART_REPLAC_GOODS_INFO](item)
            this[CART_SET_REPLAC_GOODS](data.data);
            this.SHOW_REPLACE_GOODS();
        },
        //商品数量加减
        handerNumber(item,ind) {
            this.SHOW_CART_KEYBOARD(ind)
        },
        async numberChange(item){
            item.billCode = this.billCode
            const data = await addFixMer(item)
            if(data.code !=200)  {
                this.$alert(data.msg)
            }
            this.getgoodsList()
            this.$vm.$emit(VM_GET_GOODS_LIST)
            
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
            if(this.delState) return
            this.delState = true
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
            
            if(data.code != 200) {
                this.delState = false
                return this.$message.error(data.msg)
            }
            await this.getgoodsList()
            this.$vm.$emit(VM_GET_GOODS_LIST)
            this.delState = false
        },
        delSubItem(item){
            item.saleNum = item.saleNum-1;
            this.numberChange(item); 
        },
        openAdjust(item,index){
            this.adjustForm = JSON.parse(JSON.stringify(item));
            this.adjustForm.oldSaleNum = item.saleNum;
            this.selectAdjustIndex = index;
            this.dialogVisible = true;
        },
        adjust(){
           this.$refs.adjustForm.validate((state)=>{
                if(state){
                    let newCartData = JSON.parse(JSON.stringify(this.cartData))
                    let item = newCartData.merGoodsList[this.selectAdjustIndex]
                    if(item.saleNum == this.adjustForm.saleNum){
                        item.salePrice = this.adjustForm.salePrice;
                    }else{
                        item.saleNum = item.saleNum - this.adjustForm.saleNum;
                        newCartData.merGoodsList.splice(this.selectAdjustIndex+1,0,this.adjustForm)
                    }
                    this.setShoppingCartData(newCartData);
                    this.dialogVisible = false;
                }
            })
        },
        referAdjust(){
            let refetObj = {
                billCode : this.billCode,
                goodsList : this.cartData.goodsList.map((item)=>{
                    let goodsListObj = {
                        timeSeat : {
                            seatCode : item.timeSeat.seatCode,
                            ticketPrice : item.timeSeat.ticketPrice,
                            addPrice : item.timeSeat.addPrice,
                        }
                    }
                    return goodsListObj
                }),
                merGoodsList : this.dataGoodsList.map((item)=>{
                     let merGoodsListObj = {
                        uid : item.uid,
                        goodsType : item.goodsType,
                        salePrice : item.salePrice,
                        saleNum : item.saleNum,
                    }
                    return merGoodsListObj
                }),
            }
            console.log(refetObj)
            
        },
        setShoppingCartData(data){
            this[CART_SET_GOODS_DATA](data.merGoodsList)
            this[GET_KIND_PRICE](data)
            this[GET_CART_DATA](data)
            // this[GET_CART_BILLCODEUID](data.uid)
        },
        modelChange(item,str,val){
            salePriceRule('',isNaN(Number(val)) ? val : Number(val) ,(data)=>{
                if(data){
                    this.$message.error(data.message);
                    item[str.substring(3,str.length)] = item[str];
                }
            })
        },
        modelFocus(item,str){
            if(!item[str]) item[str] = item[str.substring(3,str.length)] || 0
        }


    },
    // watch:{
    //     cartGoodnumber(newVal,oldVal){
    //         let item = {...this.dataGoodsList[this.cartGoodlistIndex]}
    //         item.saleNum = newVal;
    //         this.numberChange(item)
    //     }
    // },
    
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
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                &:nth-child(2){
                    flex:1;
                    text-align: left;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: #FF7900 ;
                    display: flex;
                    align-items: center;
                    span{
                        margin-right: 0.4vw;
                    }
                    .money{
                        display: flex;
                        vertical-align: middle;
                        flex: 1;
                        overflow: hidden;
                        align-items: center;
                    }
                    .originalPrice {
                        display: inline-block;
                        vertical-align: middle;
                        color: #999999;
                        text-decoration: line-through;
                    }
                    .tip{
                        border: 1px solid;
                        vertical-align: middle;
                        padding: 0px 5px;
                        border-radius: 16px;
                        display: inline-block;
                        height: 1.5vw;
                        line-height: 1.5vw;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        max-width: 40%;
                    }
                    .tip2{
                        color:#3B74FF;
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
                    span{font-size: $font-size12;}
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

