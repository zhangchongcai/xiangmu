<template>
    <div class="home">
        <div :style="{paddingBottom: bottomPadding}" v-show="!isExtends" class="home-left">
            <film-tab @refreshCurrentOrder="refreshCurrentOrder"></film-tab>
            <tickets ref="ticketsbox" :ticketArr="allTickets" class="tickets" @openMoreTicket="openMoreTicket"></tickets>
        </div>
        <!-- 座位图区域 -->
        <div :class="['home-right', !isExtends ? 'small-screen' : 'large-screen']">
           <seat :ticketArr="allTickets" @scaleLarge="scaleLarge" @openMoreTicket="openMoreTicket" @scaleSmall="scaleSmall"></seat>
        </div>
        <div class="shop-pros" v-if="!isExtends">
            <span class="pro-item" v-for="(item, index) in 4" :key="'pro' + index">
                {{'产品' + item}}
            </span>
        </div>
        <!-- 已选座位框 -->
        <seat-selection v-if="!isExtends && seatSelection.length" :selectedTickets="seatSelection" @extendSeats="scaleLarge"></seat-selection>
        <!-- 更多票类对话框 -->
        <tickets-more v-if="ticketsDialog"></tickets-more>
        <!-- 更改票类 -->
        <tickets-change v-if="changingTicket"></tickets-change>
        <!-- 支付弹框 -->
        <settlement-window></settlement-window>
        <!-- 支付一栏 -->
        <pay-tab v-if="!isExtends" v-on:handerDetail="handerDetail"></pay-tab>
        <!-- 日期选择 -->
        <date-picker :isShow="getDatePicker" @confirm="closeDatePicker"></date-picker>
        <!-- 排期展开 -->
        <full-screen-order v-show="fullOrder"></full-screen-order>
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
import {mapGetters, mapMutations} from 'vuex'
import { SHOW_BOTTOM_BAR, EXTEND_SEAT, SHOW_DATE_PICKER, SET_CURRENT_PLANCODE, SAVE_FILM_DATA, SAVE_ALL_PAY, MORE_TICKETS_TRIGER, SAVE_TIME_DATA, SAVE_HALL_DATA, GET_CART_DATA, SAVE_ALL_FILM_DATA, SAVE_ALL_TIME_DATA, SAVE_ALL_HALL_DATA ,GET_CART_BILLCODE, SET_CURRENT_DATE, SAVE_CINEMA_INFO, CHECK_CURRENT_SEAT_STATUS} from 'types'
import { queryFilmDate, queryAllFilm, payType, findCart, findTimeSeatStatus} from 'src/http/apis.js'
import Cart from 'components/cart/layout'

    export default {
        data() {
          return {
              dialogVisible: false,
              bottomPadding: '16vh',
              alltickets: [],
              cartShow:true,
              timeoutNum: 30000
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
               'changingTicket'
            ])
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
                SET_CURRENT_PLANCODE
            ]),

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
                
                this.websock = new WebSocket(`${this.$wsUrl}${localStorage.getItem('cinemaUid')}/${localStorage.getItem('terminalId')}`);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            websocketonopen(e){ //连接建立之后执行send方法发送数据
                // console.log(e)
                // console.log( 'cinemaUid:' + localStorage.getItem('cinemaUid'))
                // console.log( 'terminalId:' + localStorage.getItem('terminalId'))
                this.heartReset()
            },
            websocketonerror(){//连接建立失败重连
                this.reconnect()
                
            },
            websocketonmessage(e){
                if(JSON.parse(e.data)) {
                    let data = (JSON.parse(e.data))
                    findTimeSeatStatus({
                        cinemaCode: data.cinemaCode,
                        planCode: data.planCode
                    }).then(res => {
                        if(res.code == 200) {
                           this.CHECK_CURRENT_SEAT_STATUS(res.data)
                        }
                    })
                }
                this.heartReset()
            },  
            websocketsend(Data){//数据发送
                // console.log(Data)
                this.websock.send(Data)
            },
            websocketclose(){  //关闭
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
                this.EXTEND_SEAT()
                this.SHOW_BOTTOM_BAR()
            },

            openMoreTicket() {
                this.MORE_TICKETS_TRIGER()
            },

            //刷新按钮事件
            refreshCurrentOrder() {
                // 获取可售排期
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
              this.getFilmData({date: obj.dateStr, sequence: 1}, this.SAVE_FILM_DATA);
              this.getFilmData({date: obj.dateStr, sequence: 2}, this.SAVE_TIME_DATA);
              this.getFilmData({date: obj.dateStr, sequence: 3}, this.SAVE_HALL_DATA);
              this.getAllFilmData({date: obj.dateStr, sequence: 1}, this.SAVE_ALL_FILM_DATA);
              this.getAllFilmData({date: obj.dateStr, sequence: 2}, this.SAVE_ALL_TIME_DATA);
              this.getAllFilmData({date: obj.dateStr, sequence: 3}, this.SAVE_ALL_HALL_DATA);
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
                queryFilmDate(paramObj).then(res => {
                    if(res.code == 200 && res.data.length) {
                        callback(res.data)
                    }else {
                        this.SET_CURRENT_PLANCODE({
                            code: null,
                            allowSingleSold: false
                        })
                        this.$message({
                            showClose: true,
                            message: res.data && res.data.length == 0 ? '暂无可售电影排期数据' : res.msg,
                            type: 'error'
                        });
                    }
                })
            },
            
            //获得全部电影排期方法：
            getAllFilmData(paramObj, callback) {
                queryAllFilm(paramObj).then(res => {
                    if(res.code == 200 && res.data.length) {
                        callback(res.data)
                    }else {
                        this.SET_CURRENT_PLANCODE({
                            code: null,
                            allowSingleSold: false
                        })
                        this.$message({
                            showClose: true,
                            message: res.data && res.data.length == 0 ? '暂无全部电影排期数据' : res.msg,
                            type: 'error'
                        });
                    }
                })
            },
        },

        mounted() {
        
        let that = this
        this.SAVE_CINEMA_INFO()

           
        // 获取可售排期
           this.getFilmData({date: this.currentDateStr, sequence: 1}, this.SAVE_FILM_DATA);
           this.getFilmData({date: this.currentDateStr, sequence: 2}, this.SAVE_TIME_DATA);
           this.getFilmData({date: this.currentDateStr, sequence: 3}, this.SAVE_HALL_DATA);

        // 获取全部排期
           this.getAllFilmData({date: this.currentDateStr, sequence: 1}, this.SAVE_ALL_FILM_DATA);
           this.getAllFilmData({date: this.currentDateStr, sequence: 2}, this.SAVE_ALL_TIME_DATA);
           this.getAllFilmData({date: this.currentDateStr, sequence: 3}, this.SAVE_ALL_HALL_DATA);
           
           this.initWebSocket()

           payType().then(res=> {
               if(res.code==200) {
                   let {data} = res
                //    console.log(data)
                   this.SAVE_ALL_PAY(data)
               }else {
                   this.$message({
                            showClose: true,
                            message: res.data && res.data.length == 0 ? '暂无支付方式数据' : res.msg,
                            type: 'error'
                        });
               }
           })
        },

        destroyed() {
            this.killWebSocket()
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
           z-index: 600;
       }
     }

     .home-right {
        //  width: 69vw;
         height: 100%;
     }

     .large-screen {
         width: 100vw;
     }

     .small-screen {
         width: 70vw;
     }
    .mycart{
        position: fixed;
        right: 0;
        bottom: calc(6.3vh + 5.2vh + 2.6vh + 0.3vh);
        transition: all 0.3s;
        transform: translateY(100vh);
        width: 37.3vw;
        opacity: 1;
        z-index: 99;
    }
    .shop-pros {
        width: 70vw;
        position: fixed;
        bottom: 14.4vh;
        right: 0;
        height: 5.2vh;
        display: flex;
        justify-content: space-between;
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
        }
    }
 }
</style>