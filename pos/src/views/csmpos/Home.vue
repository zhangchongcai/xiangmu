<template>
    <div v-loading="leftLoading" element-loading-text="排期刷新中......" element-loading-spinner="el-icon-loading"  element-loading-background="rgba(255, 255, 255, 0.65)" class="home">
        <div :style="{paddingBottom: bottomPadding}" v-show="!isExtends" class="home-left">
            <film-tab  @preDate="preDate" @nextDate="nextDate" @refreshCurrentOrder="refreshCurrentOrder" @getAllFilmDatas="getAllFilmDatas"></film-tab>
            <tickets ref="ticketsbox" :ticketArr="allTickets" class="tickets" @openMoreTicket="openMoreTicket"></tickets>
        </div>
        <!-- 座位图区域 -->
        <div :class="['home-right', !isExtends ? 'small-screen' : 'large-screen']">
           <i v-if="isExtends" class="iconfont icontuichuquanping extend-btn" @click="scaleSmall"></i>
           <seat ref="seatComp" :ticketArr="allTickets" @scaleLarge="scaleLarge" @openMoreTicket="openMoreTicket"></seat>
        </div>
        <div class="shop-pros" v-if="!isExtends && hotGoods.length">
            <span class="pro-item" 
            :class="[
            item.soleUid === isSelect ? 'active' :'',
            item.saleStatus ? '' : 'disabled' 
            ]"
            v-for="(item, index) in hotGoods" 
            :key="'pro' + index"
            @click="addCart(item)">
                <!-- {{item.aliasName ?item.aliasName:[1,3,5].includes(item.merType)?item.skuSellEntity.name: 
                item.merType==2 ? item.name+'/'+ item.skuSellEntity.name : item.name}}  -->
                {{goodsName(item)}}
                ￥{{[1,2,3,5].includes(item.merType)?item.skuSellEntity.price:item.price}}
            </span>
        </div>
        <!-- 已选座位框 -->
        <seat-selection :style="{bottom: hotGoods.length ? '19.8vh' : '14.4vh'}" v-if="!isExtends && seatSelection.length" :selectedTickets="seatSelection" @extendSeats="scaleLarge"></seat-selection>
        <!-- 更多票类对话框 -->
        <tickets-more v-if="ticketsDialog"></tickets-more>
        <!-- 更改票类 -->
        <tickets-change v-if="changingTicket"></tickets-change>
        <!-- 支付弹框 -->
        <settlement-window ref="settlement"></settlement-window>
        <!-- 支付一栏 -->
        <pay-tab v-if="!isExtends" v-on:handerDetail="handerDetail"></pay-tab>
        <!-- 日期选择 -->
        <date-picker ref="dateComp" :isShow="getDatePicker" @confirm="closeDatePicker"></date-picker>
        <!-- 排期展开 -->
        <full-screen-order v-show="fullOrder" @preDate="preDate" @nextDate="nextDate" @refreshCurrentOrder="refreshCurrentOrder"></full-screen-order>
        <!-- 购物车 -->
        <div class="mycart" ref="cart">
            <cart @handerDetail="handerDetail"></cart>
        </div>
        <!-- 更换商品 -->
        <ReplaceGoods></ReplaceGoods>
        <!-- 商品数量键盘 -->
        <KeyNumberBoard></KeyNumberBoard>
        <!-- 更多支付方式 -->
        <more-pay></more-pay>
    </div>
</template>

<script>
import Seat from "components/newseats/Seat"
import Tickets from "components/newseats/Tickets"
import PayTab from "components/paytab"
import FilmTab from "components/film/FilmTab"
import SeatSelection from 'components/newseats/SeatSelection'
import SettlementWindow from 'components/settlement/SettlementWindow'
import TicketsMore from 'components/moreTickets/TicketsMore'
import TicketsChange from 'components/ticketsChanging'
import DatePicker from 'components/datePicker'
import ReplaceGoods from 'src/components/dialog/ReplaceGoods'
import KeyNumberBoard from 'src/components/dialog/CartNumberKeyBoard'
import FullScreenOrder from 'components/fullScreenOrder'
import MorePay from 'components/dialog/MorePay'
import {mapGetters, mapMutations,mapActions} from 'vuex'
import { SHOW_BOTTOM_BAR, EXTEND_SEAT, SHOW_DATE_PICKER, SET_CURRENT_PLANCODE, CLEAR_FILM_TITLE, SAVE_FILM_DATA, SAVE_ALL_PAY, MORE_TICKETS_TRIGER, SAVE_TIME_DATA, SAVE_HALL_DATA, GET_CART_DATA, SAVE_ALL_FILM_DATA, SAVE_ALL_TIME_DATA, SAVE_ALL_HALL_DATA ,GET_CART_BILLCODE, SET_CURRENT_DATE, SAVE_CINEMA_INFO, CHECK_CURRENT_SEAT_STATUS, WITH_OUT_DATA,ACTION_CART_INIT_CART,ACTION_CART_ADD_CART,CART_FIND_CART_DATA,GLOBAL_SET_FIRST_LOGON} from 'types'
import { VM_ON_LOGIN_UESINFO } from 'types/vmOnType'
import { queryFilmDate, queryAllFilm, payType, findCart, findTimeSeatStatus,productExhibitionRecommend,storeHouseCheck} from 'src/http/apis.js'
import Cart from 'components/cart/layout'

    export default {
        data() {
          return {
              dialogVisible: false,
              bottomPadding: '16vh',
              leftLoading: false,
              alltickets: [],
              cartShow:true,
              timeoutNum: 30000,
              hotGoods:[],
              isSelect:'',
              goodLoading:false,
              filmDataLenght: 0,
              querySellTimer: null,
              newListMuen:[],
          }
        },
        
        computed: {
            ...mapGetters([
               'seatSelection',
               'isExtends',
               'getDatePicker',
               'getCurrentFilmTicket',
               'ticketsDialog',
               'fullOrder',
               'allTickets',
               'currentDateStr',
               'currentPlanCode',
               'cinemaUid',
               'terminalCode',
               'changingTicket',
               'terminalId',
               'billCode',
               'getFilmTimeData',
               'payDialog',
               'firstLogon',
               'cinemaCode',
               'getUserConfig',
               'cartData'
            ])
        },

        watch: {
          currentDateStr(val) {
              this.WITH_OUT_DATA()
              this.CLEAR_FILM_TITLE();
              this.getFilmData({date: val, sequence: 1}, this.SAVE_FILM_DATA);
              this.getFilmData({date: val, sequence: 2}, this.SAVE_TIME_DATA);
              this.getFilmData({date: val, sequence: 3}, this.SAVE_HALL_DATA);
          },
          payDialog(val){
              if(!val){
                  this.refreshCurrentOrder()
              }
          },
          filmDataLenght(val) {
              if(val != this.getFilmTimeData.length) {
                  if(!this.payDialog) this.refreshCurrentOrder()
                  if(this.payDialog) {
                      if((Object.keys(this.cartData.movieTemplate)).length) {
                          let planCode = this.cartData.movieTemplate.planCode
                          if(!(this.newListMuen.some(item => {
                              return item.plan_code == planCode
                          }))) {
                            this.$confirm('当前排期停售或过期，请退出支付页面，重新选择', '排期刷新提示', {
                                confirmButtonText: '确定',
                                showCancelButton: false,
                                showClose: false,
                                closeOnClickModal: false,
                                type: 'warning'
                                }).then(() => {
                                    this.$refs.settlement.closePay()
                                    this.refreshCurrentOrder()
                                })
                          }
                      }
                  }
              }
          },

          $route() {
            let token = localStorage.getItem('token')
            if(token) {
              this.getHotGoods()
              this.getAllPayType()
            }
            if(this.$route.name == 'toHome'){
                if(this.firstLogon){
                this.$eventHub.$emit(VM_ON_LOGIN_UESINFO,this.firstLogon)
                this[GLOBAL_SET_FIRST_LOGON](false)
            } 
            }
             
          }
        },

        methods: {
            ...mapMutations([
                SHOW_BOTTOM_BAR, //显示隐藏底部bar
                EXTEND_SEAT, //是否最大化
                SHOW_DATE_PICKER, //日期选择器
                SAVE_FILM_DATA, //按影片可售
                SAVE_ALL_PAY, //影院所有支付方式
                MORE_TICKETS_TRIGER, //更多票类弹窗
                SAVE_TIME_DATA, //按时间可售
                SAVE_HALL_DATA, //按影厅可售
                SAVE_ALL_FILM_DATA, //按影片全部
                SAVE_ALL_TIME_DATA, //按时间全部
                SAVE_ALL_HALL_DATA, //获取按影厅排序全部
                GET_CART_DATA, //电影票缓存
                GET_CART_BILLCODE, //获得订单编号
                SET_CURRENT_DATE, //当前日期
                SAVE_CINEMA_INFO,
                CHECK_CURRENT_SEAT_STATUS,
                SET_CURRENT_PLANCODE,
                WITH_OUT_DATA, //没有数据时清空之前的所有数据
                CLEAR_FILM_TITLE, //切换日期时清空电影标题
                GLOBAL_SET_FIRST_LOGON
            ]),
            ...mapActions([
                ACTION_CART_INIT_CART,
                ACTION_CART_ADD_CART,
                CART_FIND_CART_DATA
            ]),
            goodsName(item){
                let goodsName = ""
                if([1,2].includes(item.merType)){
                    if(item.name == item.skuSellEntity.name) return goodsName = item.name
                    if(item.skuSellEntity.name){
                        return goodsName = item.name +'-'+ item.skuSellEntity.name
                    }else{
                        return goodsName = item.name +' '+ item.skuSellEntity.name
                    }
                }
                if([3,4].includes(item.merType)){
                    return goodsName = item.name 
                }
                return goodsName = item.skuSellEntity.name
                // let goodsName = '';
                // if(item.skuSellEntity && (item.skuSellEntity.name && item.aliasName)){
                //     if(item.merType == 2){
                //         return goodsName = item.skuSellEntity.name == item.aliasName ? item.aliasName : item.aliasName+item.skuSellEntity.name
                //     }
                //     let skuNameArr = item.skuSellEntity.name.split('-');
                //     if(skuNameArr[1]){
                //         return goodsName = item.aliasName + "-" + skuNameArr[1]
                //     }else{
                //         return goodsName = item.aliasName
                //     }
                // }
                // if(item.merType == 2){
                //     return goodsName = (item.aliasName ? item.aliasName : item.name) + ' ' + item.skuSellEntity.name
                // }
                // if(!item.skuSellEntity){
                //     return goodsName = item.aliasName ? item.aliasName : item.name
                // }
                // return goodsName = item.skuSellEntity.name ? item.skuSellEntity.name : item.name
            },
            preDate() {
              this.$refs.dateComp.preDate()
            },

            nextDate() {
              this.$refs.dateComp.nextDate()
            },

            //心跳机制

            heartReset() {
                clearInterval(this.heart);
                this.heartStart();
            },
            heartStart() {
                this.heart = setInterval(() => {
                    this.websocketsend('holdOn')
                }, this.timeoutNum)
            },

            reconnect() {
                if(this.lockReconnect) {
                    return
                }
                this.lockReconnect = true
                this.reInit = setTimeout( () => {     //没连接上会一直重连，设置延迟避免请求过多
                this.initWebSocket();
                this.lockReconnect = false
                }, 4000);
            },

            initWebSocket(){ //初始化weosocket
                // console.log("开始重连")
                
                this.websock = new WebSocket(`${this.$wsUrl}/${localStorage.getItem('tenantId')}/${localStorage.getItem('cinemaUid')}/${localStorage.getItem('terminalId')}`);
                this.websock.onopen = this.websocketonopen;
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            websocketonopen(e){ //连接建立之后执行send方法发送数据
                // console.log('setUpWS', e)
                this.heartReset()
            },
            websocketonerror(e){//连接建立失败重连
                // console.log('connectErr', e)
                this.reconnect()
                
            },
            websocketonmessage(e){
                console.log('receiveMessage', e)
                // console.log(this.$route)
                // if(this.$route.name != 'toHome') return
                if(e.data != '连接成功' && e.data != 'holdOn') {
                    let data = (JSON.parse(e.data))
                    if(data.type == 0) {
                       if((data.planCode != this.currentPlanCode) && !data.planCode) return
                        findTimeSeatStatus({
                            cinemaCode: data.cinemaCode,
                            planCode: data.planCode
                        }).then(res => {
                            if(res.code == 200) {
                            this.CHECK_CURRENT_SEAT_STATUS(res.data)
                            }
                        })
                    }else if(data.type == 1){
                      queryFilmDate({date: this.currentDateStr, sequence: 2}).then(res => {
                            if(res.code == 200 && res.data.length) {
                                this.filmDataLenght = res.data.length
                                this.newListMuen = res.data
                            }
                        })
                    }
                    
                }
                this.heartReset()
            },  
            websocketsend(Data){//数据发送
                // console.log('sendMessage', Data)
                this.websock.send(Data)
            },
            websocketclose(e){  //关闭
                // console.log('close', e)
                this.reconnect()
            },

            //切换页面干掉webSocket
            killWebSocket() {
                clearInterval(this.heart);
                this.lockReconnect = true;
                clearInterval(this.reInit);
                this.websock.onclose = null;
                this.websock.onerror = null;
                this.websock = null;
            },

            scaleLarge() { //全屏放大选座

                this.$children.forEach(item => {
                    if(item.$options._componentTag == "seat") {
                        item.extendSeats()
                    }
                })
            },


            scaleSmall() { //缩小还原
                this.$refs.seatComp.narrowSeats();
            },

            openMoreTicket() {
                this.MORE_TICKETS_TRIGER()
            },

            //开场后售票时间的查询
            querySellTime() {
              this.querySellTimer = setInterval(() => {
                  if(this.getFilmTimeData.length) {
                    let currentTime = (new Date()).getTime()
                    let firstTime =(new Date(this.getFilmTimeData[0].show_time)).getTime()
                    let dt = currentTime - firstTime
                    if(dt >= this.getUserConfig.refuse_sale_ticket_time * 60 * 1000) {
                        queryFilmDate({date: this.currentDateStr, sequence: 2}).then(res => {
                                if(res.code == 200 && res.data.length) {
                                    this.filmDataLenght = res.data.length
                                }
                            })
                    }
                }else {
                //  console.log("排期查询中...")
                }
              }, 1000)
            },

            //刷新按钮事件
            refreshCurrentOrder() {
                this.$refs.seatComp.loading = false;
                // 获取可售排期
                this.WITH_OUT_DATA()
                this.CLEAR_FILM_TITLE();
                this.getFilmData({date: this.currentDateStr, sequence: 1}, this.SAVE_FILM_DATA);
                this.getFilmData({date: this.currentDateStr, sequence: 2}, this.SAVE_TIME_DATA);
                this.getFilmData({date: this.currentDateStr, sequence: 3}, this.SAVE_HALL_DATA);

                // 获取全部排期
                this.getAllFilmData({date: this.currentDateStr, sequence: 1}, this.SAVE_ALL_FILM_DATA);
                this.getAllFilmData({date: this.currentDateStr, sequence: 2}, this.SAVE_ALL_TIME_DATA);
                this.getAllFilmData({date: this.currentDateStr, sequence: 3}, this.SAVE_ALL_HALL_DATA);
            },

            //关闭日期组件
            closeDatePicker(obj) {
              this.SET_CURRENT_DATE(obj.dateStr)
              this.SHOW_DATE_PICKER()
            },
            //收起购物车
            handerDetail() {
                this.cartShow = !this.cartShow
                if(this.cartShow){
                    this.$refs.cart.style.opacity = '0.0'
                    this.$refs.cart.style.transform = 'translateY(100vh)'
                }else{
                    this.$refs.cart.style.opacity = '1.0'
                    this.$refs.cart.style.transform = 'translateY(0)'
                }
            },

            //获取可售电影排期的方法：
            getFilmData(paramObj, callback) {
                this.leftLoading = true
                queryFilmDate(paramObj).then(res => {
                    if(res.code == 200 && res.data.length) {
                        callback(res.data)
                        this.leftLoading = false
                    }else {
                        setTimeout(() => {
                          this.leftLoading = false
                        }, 1800)
                        this.SET_CURRENT_PLANCODE({
                            code: null,
                            allowSingleSold: false
                        })
                    }
                    
                })
            },
            
            //获得全部电影排期通用方法：
            getAllFilmData(paramObj, callback) {
                queryAllFilm(paramObj).then(res => {
                    if(res.code == 200 && res.data.length) {
                        callback(res.data)
                    }else {
                        this.SET_CURRENT_PLANCODE({
                            code: null,
                            allowSingleSold: false
                        })
                        // this.$message({
                        //     showClose: true,
                        //     message: res.data && res.data.length == 0 ? '暂无电影排期数据' : res.msg,
                        //     type: 'error'
                        // });
                    }
                })
            },
            //按时间按影片按影厅获取全部电影排期
            getAllFilmDatas() {
               this.getAllFilmData({date: this.currentDateStr, sequence: 1}, this.SAVE_ALL_FILM_DATA);
               this.getAllFilmData({date: this.currentDateStr, sequence: 2}, this.SAVE_ALL_TIME_DATA);
               this.getAllFilmData({date: this.currentDateStr, sequence: 3}, this.SAVE_ALL_HALL_DATA);
            },

            async getHotGoods(){
                const storeHouseCheckData = await storeHouseCheck({
                    cinemaUid: this.cinemaUid,
                    terminalCode : this.terminalId
                })
                if(storeHouseCheckData.code != 200) return this.$message.error(storeHouseCheckData.msg)
                if(storeHouseCheckData.data == 2) return
                const data = await productExhibitionRecommend({
                    cinemaUid :  this.cinemaUid,
                    terminalId :  this.terminalId,
                    channelUid:'0'
                })
                if(data.code !=200) {
                    if(data.code == -301) return
                    return this.$message.error(data.msg)
                }
                this.hotGoods = data.data || [];
                // console.log(data)
            },

            async getAllPayType() {
                const payTypeData = await payType()
                if(payTypeData.code == 200) {
                    this.SAVE_ALL_PAY(payTypeData.data)
                }else {
                   this.$message({
                            showClose: true,
                            message: payTypeData.data && payTypeData.data.length == 0 ? '暂无支付方式数据' : payTypeData.msg,
                            type: 'error'
                        }); 
                }
            },

            async addCart(item){
                if(!item.saleStatus) return;
                if(!this.billCode){
                    // await this.initCart()
                    await this[ACTION_CART_INIT_CART]()
                }
                this.SelectIntroduce(item)
            },
            async SelectIntroduce(dataItem) {
                
            // console.log(dataItem)
                if(this.goodLoading) return
                this.goodLoading = true 
                const data = await this[ACTION_CART_ADD_CART](dataItem)
                this.goodLoading = false
                if(data.code != 200) return 
                this[CART_FIND_CART_DATA]();
                this.isSelect = dataItem.soleUid;
                setTimeout(()=>{
                    this.isSelect = '';
                },300)
            },
        },

        mounted() {
        this.querySellTime()

        this.SAVE_CINEMA_INFO()
        if(this.firstLogon){
            this.$eventHub.$emit(VM_ON_LOGIN_UESINFO,this.firstLogon)
            this[GLOBAL_SET_FIRST_LOGON](false)
        } 
           
        // 获取可售排期
           this.getFilmData({date: this.currentDateStr, sequence: 1}, this.SAVE_FILM_DATA);
           this.getFilmData({date: this.currentDateStr, sequence: 2}, this.SAVE_TIME_DATA);
           this.getFilmData({date: this.currentDateStr, sequence: 3}, this.SAVE_HALL_DATA);

           this.initWebSocket()

           this.getHotGoods()

           this.getAllPayType()
            
           
        },

        destroyed() {
            this.killWebSocket()
            this.querySellTimer = null
        },
        
        components: {
            Seat,
            Tickets,
            PayTab,
            FilmTab,
            SeatSelection,
            SettlementWindow,
            DatePicker,
            TicketsMore,
            FullScreenOrder,
            MorePay,
            Cart,
            ReplaceGoods,
            KeyNumberBoard,
            TicketsChange
        }
    }
</script>

<style scoped lang="scss">
 .testing {
     font-size: 20px;
     height: 60px;
     width: 120px;
     background:#ff8900;
 }
 .home {
     width: 100vw;
     height: 100%;
     overflow: hidden;
     display: flex;
     justify-content: space-between;
     align-items: flex-start;

     .home-left {
       width: 30vw;
       height: 100%;
       position: relative;
       box-sizing: border-box;

       .tickets {
           width: 100%;
           position: absolute;
           bottom: 0;
           left: 0;
           z-index: 300;
       }
     }

     .home-right {
         width: 70vw;
         height: 100%;
     }

     //放大按钮
    .extend-btn {
        position: fixed;
        top: 2.82vh;
        right: 25.4vw;
        color:  #333333;
        font-weight: 200;
        font-size: $font-size18;
        cursor: pointer;
        z-index: 100;
    }

     .large-screen {
         width: 100vw;
         height:100%;
     }

     .small-screen {
         width: 70vw;
         height:100%;
     }
    .mycart{
        position: fixed;
        right: 0;
        bottom: calc(6.3vh + 5.2vh + 2.6vh + 0.3vh);
        transition: all 0.3s;
        transform: translateY(100vh);
        width: 37.3vw;
        opacity: 0;
        z-index: 100;
    }
    .shop-pros {
        width: 70vw;
        position: fixed;
        bottom: 14.4vh;
        right: 0;
        height: 5.2vh;
        display: flex;
        // justify-content: space-between;
        align-items: center;

        .pro-item {
            box-sizing: border-box;
            width: calc(69.8vw / 4);
            height: 100%;
            line-height: 5.2vh;
            border: 1px solid #bcbcbc;
            border-radius: 2px;
            background: #ffffff;
            font-size: $font-size12;
            color: $font-color3;
            text-align: center;
            margin-left: 2px;
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .disabled {
            background: rgb(242,242,242);
            border-color:#333;
            cursor: not-allowed;
        }
        .active {
            background: #3b74ff;
            border-color: #3b74ff;
            color:#fff;
        }
    }
 }
</style>