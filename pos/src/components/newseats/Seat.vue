<template>
    <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.0)" class="seat-container">
      <div :class="['right', isReverse ? 'reverse-style' : '']">
        <div :class="['header', isExtends ? 'extendFontHeader' : '']">
          {{currentFilmTitle}}
          <!-- 放大按钮 -->
          <i v-show="!isExtends" class="iconfont iconzuoweiquanping extend-btn" @click="extendSeats"></i>
          <!-- 缩小 -->
          <!-- <i v-show="isExtends" class="iconfont icontuichuquanping extend-btn" @click="narrowSeats"></i> -->
        </div>
        
        <div class="screen" :style="{width: (extendNum * 48) + 'vw'}">
          银幕
        </div>

        <!-- 座位渲染开始begin -->
        <div class="seats" :style="{width: (extendNum * 62) + 'vw', height: (isExtends ? 65 : 50.5) + 'vh'}" id="box" @mousedown="drawRect">
          <div v-show="allSeat.length" class="row-default-left" :style="{height: !isExtends ? '50.5vh' : '65vh'}">
            <div  class="row-default" :style="{marginTop: ((maxHeight + 6) / scaleNum * extendNum)  + 'px'}">
              <span :class="['row-num-style', lightRow == index + 1 ? 'highlight-row' : '']" :style="{top: item *  extendNum * scaleNum  + 'vw', transform: `translateX(-50%) ${scaleString}`}" v-for="(item, index) in rowYs" :key="'row' + index">
                {{index + 1}}
              </span>
            </div>
          </div>
          
          <div id="realRect" v-if="allSeat.length" class="seats-center">
             <div :style="{width: (isExtends ? extendNum * hallWidth : hallWidth) + 'vw', height: (!isExtends ? 50.5 : 65) + 'vh', top: maxHeight + 'px', left: maxWidth + 'px'}" class="seats-container"> 
               <div :style="{backgroundColor: item.color, width: (2.7 * extendNum) + 'vw', height: (2.7 * extendNum) + 'vw', top: item.y * extendNum * scaleNum + 'vw', left: item.x * extendNum * scaleNum + 'vw', justifyContent: item.imageType == 2 || item.imageType == 4 ? 'flex-end' : item.imageType == 3 || item.imageType == 6 ? 'flex-start' : item.imageType == 5 ? '' : 'center', transform:  scaleString}" class="seat-default" v-for="(item, index) in allSeat" :key="'seat' + index" @click.stop="selSingleSeat(item)" @mouseover="highLigth(item)">
                  <div v-show="item.netSaleFlag == 1" :style="{transform: scaleString}" class="net-seal-style"></div>
                  <i :class="['iconfont', 'iconputongzuoyi', 'seat-default-style', item.seatIcon, item.status == 3 ? 'seat-default-style-active' : '', item.colorStyle]" :style="{fontSize: isExtends ? '2.5vw' : '2.2vw'}"></i>
                  <span v-show="item.status != 0" :class="['seat-num-default', item.status != 1 ? 'active-seat-num' : '']" :style="{fontSize: isExtends ? '1.26vw' : '1.04vw', transform: `translate(-50%, -50%)`, scaleString}">{{item.status != 0 ? item.colAlias : ''}}</span>
                  <span v-show="item.status == 0" :style="{transform: `translate(-50%, -50%)`, scaleString}" class="seat-num-default iconfont iconhuaizuo1"></span>
                </div>
             </div>
          </div>

          <div v-else>
            <img class="no-seat-pic" src="/static/imgs/nodate.png" alt="暂无排期">
            <span class="no-seat-font">{{loadingSeat}}</span>
          </div>

          <div v-show="allSeat.length" class="row-default-right" :style="{height: !isExtends ? '50.5vh' : '65vh'}">
            <div class="row-default" :style="{height: rows * extendNum + 'px', marginTop: ((maxHeight + 6) / scaleNum * extendNum) + 'px'}">
                <span :class="['row-num-style', lightRow == index + 1 ? 'highlight-row' : '']" :style="{top: item *  extendNum * scaleNum + 'vw',  transform: `translateX(-50%) ${scaleString}`}" v-for="(item, index) in rowYs" :key="'row' + index">
                  {{index + 1}}
                </span>
              </div>
          </div>
          
        </div>
        <!-- 坐座渲染结束end -->

         <!-- 底部座位说明begin  -->
        <div v-if="allSeat.length" :class="['footer-default', isExtends ? '' : 'footer']">
         <div class="seat-intro">
           <span class="intor-margin">
             <i :class="['iconfont', 'intor-img', 'iconputongzuoyi', isExtends ? 'intor-img-large' : '']"></i>
             <span :class="['intor-font', isExtends ? 'intor-font-large' : '']">普通座椅</span>
           </span>
           <span class="intor-margin">
             <i :class="['iconfont', 'intor-img', 'iconanmozuoyi1', isExtends ? 'intor-img-large' : '']"></i>
             <span :class="['intor-font', isExtends ? 'intor-font-large' : '']">按摩座椅</span>
           </span>
           <span class="intor-margin">
             <i :class="['iconfont', 'intor-img', 'iconcanjizuoyi', isExtends ? 'intor-img-large' : '']"></i>
             <span :class="['intor-font', isExtends ? 'intor-font-large' : '']">残疾人座椅</span>
           </span>
           <span class="intor-margin">
             <i :class="['iconfont', 'intor-img', 'iconertongzuowei', isExtends ? 'intor-img-large' : '']"></i>
             <span :class="['intor-font', isExtends ? 'intor-font-large' : '']">儿童座椅</span>
           </span>
           <span class="intor-margin" v-for="(item, index) in regionArr" :key="index">
             <span :class="['intor-img', isExtends ? 'intor-img-large' : '']" :style="{display: 'inline-block', width: '3.0vw', height: '2.0vh', backgroundColor: item.color}"></span>
             <span :class="['intor-font', isExtends ? 'intor-font-large' : '']">{{item.regionName}}</span>
           </span>
         </div>

         <div class="seat-intro">
           <span class="intor-margin-small">
             <i class="circle-style" style="background: #DBE3F6"></i>
             <span :class="['intor-font', isExtends ? 'intor-font-large' : '']">可售({{ticketsStatus.isSell}})</span>
           </span>
           <span class="intor-margin-small">
             <i class="circle-style" style="background: #FF6D6D"></i>
             <span :class="['intor-font', isExtends ? 'intor-font-large' : '']">柜台售卖({{ticketsStatus.mallSell}})</span>
           </span>
           <span class="intor-margin-small">
             <i class="circle-style circle-style-font">网</i>
             <span :class="['intor-font', isExtends ? 'intor-font-large' : '']">网售({{ticketsStatus.netSell}})</span>
           </span>
           <span class="intor-margin-small">
             <i class="circle-style" style="background: #3B74FF"></i>
             <span :class="['intor-font', isExtends ? 'intor-font-large' : '']">已锁定({{ticketsStatus.isLocked}})</span>
           </span>
           <span class="intor-margin-small">
             <i class="circle-style" style="background: #FF9E42"></i>
             <span :class="['intor-font', isExtends ? 'intor-font-large' : '']">留座({{ticketsStatus.isHeld}})</span>
           </span>
           <span class="intor-margin-small">
             <i class="circle-style" style="background: #888888"></i>
             <span :class="['intor-font', isExtends ? 'intor-font-large' : '']">不可售({{ticketsStatus.cantNotSell}})</span>
           </span>
           <!-- <span class="intor-margin-small">
             <i class="circle-style circle-style-font">未</i>
             <span :class="['intor-font', isExtends ? 'intor-font-large' : '']">未取票({{ticketsStatus.noTaken}})</span>
           </span> -->
           <span class="intor-margin-small">
             <i class="iconhuaizuo1 iconfont" style="font-size: 12px"></i>
             <span :class="['intor-font', isExtends ? 'intor-font-large' : '']">坏座({{ticketsStatus.isBroken}})</span>
           </span>
         </div>
        </div>
        <!-- 底部座位说明end -->

      </div>
      
      <!-- 放大后右边详情begin -->
      <div v-show="isExtends" class="seat-detail">
        
        <!-- 右侧小地图区域 -->
        <div style="width: 23vw">
          <div class="small-map-screen">
            银幕
          </div>
          <div ref="smallbox" id="smallbox" style="width:23vw; height: 19.9vh; position: relative; overflow: scroll; transition: all 0.2s; display: flex; justify-content: center;" @click="movingCapture">
            <div ref="captureParent" class="small-seats-map" :style="{height: (16 * rowYs.length) + 'px', width: (16 * colXs.length) + 'px'}">
              <div v-show="showCapture" ref="capture" class="pointer-circle"></div>
              <div :style="{width: '16px', height: '16px', top: (16 * item.y / 2.7) + 'px', left: (16 * item.x / 2.7) + 'px'}" class="seat-default" v-for="(item, index) in allSeat" :key="'seat' + index">
                <i :class="['iconfont', 'iconputongzuoyi', 'seat-default-style', item.status == 3 ? 'seat-default-style-active' : '', item.colorStyle]" style="font-size: 14px;"></i>
                <span :class="['seat-num-default-small', item.status != 1 ? 'active-seat-num' : '']" style="font-size: 12px">{{item.colAlias}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="seat-contorl">

         <div class="small-map-control">
            <!-- 居中按钮 -->
            <i title="居中" class="iconfont iconjuzhong  control-common-style" style="font-size: 18px; margin-right: 1px" @click="setCenter"></i>
            <!-- 页面翻转按钮 -->
            <i title="翻转" class="iconfont iconfanzhuan  control-common-style" style="font-size: 18px" @click="turnReverse"></i>
         </div>
         
         <!-- 系统票类  -->
         <div class="tickets-type">
           <span style="font-weight: bold;" class="is-sel-seats-header-font">票类</span>
           <span style="font-size: 1.2vw" v-if="selPriceItem.length">(已选：{{selPriceItem[0].name + "￥" + selPriceItem[0].price}})</span>
         </div>
         <div class="tickets-container">
            <div style="color: #333333" class="tickets-common-style" v-for="(ticketsitem, index) in ticketArr.slice(0, 3)" :key="'tickets' + index" @click="selTicket(ticketsitem.id)">
                {{ticketsitem.name}} ￥{{ticketsitem.price}}
                <i v-if="ticketsitem.id == currentTicketId" class="iconfont iconpiaoleixuanzhong1"></i>
                </div>
            <div class="tickets-common-style" @click="openMoreTicket">更多票类</div>
          </div>

          <!-- 已选座位 -->
          <div class="is-sel-seats-header">
            <span class="is-sel-seats-header-font">已选{{seatSelection.length}}个位置</span>
          </div>
          <div class="tickets-sel-container">
            <div :class="['control-common-style-selected']" v-for="(seleteditem, index) in pagesSeatSelection[moreSel]" :key="'sel' + index">
              <span style="font-size: 14px; color: #333333; font-weight: bold; margin-left: 10px">{{seleteditem.seat_name}}</span>
              <span style="font-size: 14px; color: #ffffff;" class="have-selected-ticket">{{seleteditem.type_price}} 
                <!-- <i class="ticket-arrow iconfont iconyoujiantouda"></i> -->
              </span>
            </div>
          </div>
        </div>
        <div class="tickets-sel-tab">
          <span class="commonbtn-pre" @click="preSel">&lt;</span>
          <span class="commonbtn-next" @click="nextSel">&gt;</span>
        </div>
        <div class="finished-btn" @click="narrowSeats">完成</div>
      </div>
      <!-- 放大后右边详情end -->
    </div>
</template>

<script>
  import {queryAllSeat, queryCurrentPlanSeat, initCart, lockSeat, addCart, findCart, delTicket, releaseSeat, findTimeSeatStatus, queryCurrentPlanRegion, getTicketPrice} from 'src/http/apis.js'  //获取全部座位，用来座位布局
  import {mapGetters, mapMutations} from 'vuex'
  import {SEAT_SELECTION, DEL_SEAT, EXTEND_SEAT, SHOW_BOTTOM_BAR, SET_CURRENT_TICKET_ID, SAVE_CURRENT_PLAN_SEAT, GET_CART_BILLCODE, GET_CART_TICKETS, GET_KIND_PRICE, GET_CART_BILLCODEUID, GET_CART_CINEMAUID, RENDER_SELECTION, RENDER_SELECTION_AFTER_RELEASE,GET_CART_DATA, CHECK_CURRENT_SEAT_STATUS, WITH_OUT_DATA, CLEAR_SELECTION, COVER_TICKET_PRICE, CLEAR_ALL_SEAT} from 'types'

  export default {
    props: {
        ticketArr: {
            type: Array,
            default: () => [
                                {
                                    name: "成人票",
                                    value: "60.0",
                                    is_sel: false
                                },
                                {
                                    name: "军人票",
                                    value: "30.0",
                                    is_sel: false
                                },
                            ]
                    }
    },
    data() {
      return {
        viewWidth: 0,
        viewHeight: 0,
        hallWidth: 0,
        hallHeight: 0,
        scaleNum: 1, //超出基准后缩小座位
        scaleString: '',
        isReverse: false, //屏幕是否翻转
        maxWidth: 0, //放大后横向值，实际上是一个小地图横向运动的距离
        maxHeight: 0, //放大后纵向值，实际上是一个小地图纵向运动的距离
        cols: 0, //最大列数
        rows: 0, //最大行数
        seat_data: [], //所有座位的数据
        rowYs: [], //坐标去重后的数据用来渲染 排数和行数
        colXs: [], //坐标去重后的数据用来渲染 排数和行数
        basicUnit: 0, //基本单位长度，控制每个座位的位置，大小
        moreSel: 0, //已选影票的翻页控制
        currentSeatStatusArr: [], //当前场次座位的状态 每五秒获取一次
        firstYcoord:0,
        firstXcoord:0,
        selectedPages: [],  //分组后的选中影票
        pages: 0,
        rectArr: [], //框选中的座位
        startX: 0, //框选时的起点X
        startY: 0, //框选时的起点Y
        multipleSelection: false, //是否开启多选功能
        loading: false,
        showCapture: true, //是否显示移动焦点，当选中最佳观影区域时，此点消失
        lightRow: null, //高亮显示座位对应的排数
        regionArr: [], //分区集合
        loadingSeat: "座位加载中..."
      }
    },
    computed: {
      ...mapGetters([
          'seatSelection',
          'isExtends',
          'pagesSeatSelection',
          'currentTicketId',
          'currentFilmTitle',
          'allSeat',
          'billCode',
          'channelCode',
          'cinemaCode',
          'cinemaUid',
          'cinemaName',
          'currentPlanCode',
          'cartData',
          'allowSingleSold',
          'ticketsStatus',
          'currentDateStr',
          'getUserConfig'
      ]),

      extendNum() {  //小屏幕到大屏幕的放大系数
        return this.isExtends ? 1.2 : 1
      },

      selPriceItem() {
            let arr = this.ticketArr.filter(item => {
                return item.id == this.currentTicketId
            })

            return arr
        }
    },

    watch: {
         currentPlanCode() {
          //  this.WITH_OUT_DATA()
           this.regionArr = []
           this.CLEAR_ALL_SEAT()
           this.getCurrentSeat({cinemaCode: this.cinemaCode, planCode: this.currentPlanCode}, this.getAllSeatsType);
         }
      },

    mounted() {
        this.getCurrentSeat({cinemaCode: this.cinemaCode, planCode: this.currentPlanCode}, this.getAllSeatsType);
    },

    created() {
      this.viewWidth = document.documentElement.clientWidth
      this.viewHeight = document.documentElement.clientHeight
    },
     
    methods: {
      ...mapMutations([
        SEAT_SELECTION,
        DEL_SEAT,
        EXTEND_SEAT,
        SHOW_BOTTOM_BAR,
        SET_CURRENT_TICKET_ID,
        SAVE_CURRENT_PLAN_SEAT,
        GET_CART_BILLCODE,
        GET_CART_DATA,
        GET_KIND_PRICE,
        GET_CART_BILLCODEUID,
        GET_CART_CINEMAUID,
        RENDER_SELECTION,
        RENDER_SELECTION_AFTER_RELEASE,
        CHECK_CURRENT_SEAT_STATUS,
        WITH_OUT_DATA,
        CLEAR_SELECTION,
        COVER_TICKET_PRICE,
        CLEAR_ALL_SEAT
      ]),
      //高亮显示排数
      highLigth(item) {
          this.lightRow = item.row
      },
      //点击移动小地图
      movingCapture(e) {
            this.showCapture = true;
            let captureParent = this.$refs.captureParent;
            let capture = this.$refs.capture;
            let captureParentLeft = captureParent.getBoundingClientRect().left;
            let captureParentTop = captureParent.getBoundingClientRect().top;
            let diffX = e.clientX - captureParentLeft;
            let diffY = e.clientY - captureParentTop;
            capture.style.left = diffX - capture.offsetWidth / 2 + 'px';
            capture.style.top = diffY - capture.offsetHeight / 2 + 'px';
            this.maxWidth = capture.offsetLeft + capture.offsetWidth / 2
            this.maxHeight =  (capture.offsetTop + capture.offsetHeight / 2) * 2

            if(this.maxWidth > captureParent.offsetWidth / 2) {
              this.maxWidth = -(this.maxWidth)
            }
            if(this.maxHeight > captureParent.offsetHeight / 2) {
              this.maxHeight = -(this.maxHeight * 1.2)
            }
      },
      //获得当前场次座位以及状态
      getCurrentSeat(paramObj, callback) {
          this.loadingSeat = "座位加载中..."
          if(!(paramObj.cinemaCode && paramObj.planCode)) {
            return
          }
          queryCurrentPlanSeat(paramObj).then(res => {
              if(res.code == 200) {
                  callback(res.data)
                  findTimeSeatStatus({cinemaCode: this.cinemaCode, planCode: this.currentPlanCode}).then(res => {
                        if(res.code == 200) {
                           this.CHECK_CURRENT_SEAT_STATUS(res.data)
                        }
                    })
                  // console.log(res.data)
              }else {
                  this.$message({
                      showClose: true,
                      message: res.msg,
                      type: 'error'
                  });
              }
          })

          queryCurrentPlanRegion(paramObj).then(res => {
            if(res.code == 200 && res.data.length) {
              this.regionArr = res.data
            }
          })
      },
      
      //获取所有座位部分状态
      getAllSeatsType(arr) {
            if(arr.length) {
              this.SAVE_CURRENT_PLAN_SEAT(arr)
            }else {
              this.loadingSeat = "暂无座位"
              return
            }
              // this.seat_data = this.allSeat
              
              this.basicUnit = parseInt(this.allSeat[0].width) //原始座位大小，一个单位

              let rowArr = this.allSeat.map((item) => {
                let obj = {
                  row: item.row,
                  y: item.y
                }
                return obj
              })

              let colArr = this.allSeat.map((item) => {
                let obj = {
                  col: item.col,
                  x: item.x
                }
                return obj
              })

              this.rowYs = []
              this.colXs = []

              for(let i = 0; i < rowArr.length; i++) {
                this.rowYs.push(rowArr[i].y)
              }
              for(let i = 0; i < colArr.length; i++) {
                this.colXs.push(colArr[i].x)
              }

              this.rowYs = Array.from(new Set(this.rowYs))
              this.rowYs.sort((a, b) => {
                 return a - b
              })
              this.colXs = Array.from(new Set(this.colXs))

              this.cols = Math.max.apply(null, this.colXs);
              this.rows = Math.max.apply(null, this.rowYs);   

              // 以 9排  18 座  为基数， 大于这两个基数则进行计算按比例缩小
              if((this.rows > 9 * 2.7 || this.cols > 18 * 2.7) && !this.isExtends) {
               this.scaleNum =  `${Math.min(9 * 2.7/this.rows, 18 * 2.7/this.cols)}`
               this.scaleString = `scale(${Math.min(9 * 2.7/this.rows, 18 * 2.7/this.cols)})`
              }else {
                this.scaleNum =  1
                this.scaleString = `scale(1, 1)`
              }

              // console.log(this.scaleNum)

              this.hallWidth = this.cols * parseFloat(this.scaleNum) + 3.0
              this.hallHeight = this.rows * parseFloat(this.scaleNum) + 2.8
      },

      //页面居中
      setCenter() {
        let smallbox = document.getElementById('smallbox')
        let diffX = smallbox.scrollWidth - smallbox.clientWidth;
        let diffY = smallbox.scrollHeight - smallbox.clientHeight;
        this.maxWidth = 0;
        this.maxHeight = 0;
        smallbox.scrollTo( diffX / 2, diffY / 2)
        this.maxWidth = - diffX / 2;
        this.maxHeight = - diffY / 2;
      },
      //页面翻转
      turnReverse() {
        this.isReverse = !this.isReverse
      },
      doPages() {  //最终用来渲染已选座位  每六个一组
        let len = this.seatSelection.length
        if(len) {
            this.moreSel = 0
            this.pages = len%5 == 0 ? parseInt(len/5) : parseInt(len/5) + 1
        }
        
      },
      //已选座位上一页按钮
      preSel() {
        if(this.pages > 1 && this.moreSel != 0) {
          // console.log("上一页")
          this.moreSel -= 1
          // this.selectedPages = this.selectedPages[this.moreSel]
          // console.log(this.selectedPages)
        } 
      },
      //已选座位下一页按钮
      nextSel() {
        if(this.moreSel < this.pages - 1) {
          // console.log("下一页")
          this.moreSel += 1
          // this.selectedPages = this.selectedPages[this.moreSel]
          // console.log(this.selectedPages)
        } 
      },
      //框选多个
      drawRect(ev) {
        if(!this.loading && this.scaleNum >= 0.75) {
        let that = this;
        that.rectArr = []; //清空上次选择的数据
        let oBox = document.getElementById("box");
        let oDiv = document.createElement("div");
        oDiv.style.position = "absolute";
        let realRect = document.getElementById("realRect");
        // console.log(oBox)
        //记录四个点的坐标
        let x1 = 0;
        let y1 = 0;
        let x2 = 0;
        let y2 = 0;
        let cx = 0;
        let cy = 0;
        let calcx1, calcy1, calcx2, calcy2;
        ev = window.event || ev;
        x1 = ev.clientX - oBox.offsetLeft;
        y1 = ev.clientY - oBox.offsetTop;
        oBox.appendChild(oDiv);
        document.onmousemove = function (ev) {
            ev = window.event || ev;
            if(ev.clientX < oBox.offsetLeft || ev.clientX > oBox.offsetLeft + oBox.offsetWidth || ev.clientY < oBox.offsetTop || ev.clientY > oBox.offsetHeight + oBox.offsetTop) {
              if(oDiv) {
                oBox.removeChild(oDiv);
                oDiv = null
              }
              return
            }else {
                x2 = ev.clientX - oBox.offsetLeft;
                y2 = ev.clientY - oBox.offsetTop;
                cx = x2 - x1;
                cy = y2 - y1;
                //设置div的样式  四个方向设置不同的矩形位置
                if(cx>0 && cy>0) {
                  oDiv.style.left = x1 +"px";
                  oDiv.style.top = y1 +"px";
                }else if(cx<0 && cy>0){
                  oDiv.style.left = x2 +"px"; 
                  oDiv.style.top = y1 +"px";
                }else if(cx>0 && cy<0){
                  oDiv.style.left = x1 +"px"; 
                  oDiv.style.top = y2 +"px";
                  
                }else if(cx<0 && cy<0){
                  oDiv.style.left = x2 +"px"; 
                  oDiv.style.top = y2 +"px";
                }
                
                oDiv.style.width = Math.abs(cx)+"px";
                oDiv.style.height =Math.abs(cy)+"px";
                oDiv.style.borderColor = "#dedede";
                oDiv.style.borderWidth = "1px";
                oDiv.style.borderStyle = "dashed";
                oDiv.style.opacity = 1;
                // 框选区域的整数化 正向华 （左上到右下的方向）
                  // let calcx1, calcy1, calcx2, calcy2;
                  if(cx>0 && cy>0) {
                    calcx1 = x1 + that.maxWidth - realRect.offsetLeft
                    calcy1 = y1 + that.maxHeight
                    calcx2 = x2 + that.maxWidth - realRect.offsetLeft
                    calcy2 = y2 + that.maxHeight
                  }else if(cx<0 && cy>0){
                    calcx1 = x1 - Math.abs(cx) + that.maxWidth - realRect.offsetLeft
                    calcy1 = y1 + that.maxHeight
                    calcx2 = x2 + Math.abs(cx) + that.maxWidth - realRect.offsetLeft
                    calcy2 = y2 + that.maxHeight
                  }else if(cx>0 && cy<0){
                    calcx1 = x1 + that.maxWidth - realRect.offsetLeft
                    calcy1 = y1 - Math.abs(cy) + that.maxHeight
                    calcx2 = x2 + that.maxWidth - realRect.offsetLeft
                    calcy2 = y2 + Math.abs(cy) + that.maxHeight
                    
                  }else if(cx<0 && cy<0){
                    calcx1 = x1 - Math.abs(cx) + that.maxWidth - realRect.offsetLeft
                    calcy1 = y1 - Math.abs(cy) + that.maxHeight
                    calcx2 = x2 + Math.abs(cx) + that.maxWidth - realRect.offsetLeft
                    calcy2 = y2 + Math.abs(cy) + that.maxHeight
                  }
            }
        }
               
        //在鼠标抬起后终止onmousemove事件
        oBox.onmouseup = function (ev) {
                
                that.$nextTick(() => {
                    oBox.removeChild(oDiv);
                    oDiv = null
                })

                if(Math.abs(cx) > 0 && Math.abs(cy) > 0) {
                   for(let i = 0; i < that.allSeat.length; i++) {
                        let item = that.allSeat[i]
                        let y = (item.y) * that.extendNum * that.viewWidth / 100 + 5
                        let x = (item.x)  * that.extendNum * that.viewWidth / 100 + 5
                        if((x<calcx2 && y<calcy2) && (calcx1<=x && calcy1<=y) && item.status == 1) {
                          that.rectArr.push(item)
                        }
                      }

                    // console.log(that.rectArr)

                    if((that.rectArr.length + that.seatSelection.length) > that.getUserConfig.max_sale_seat_num) {
                        document.onmousemove = null;
                        return that.$message({
                                                      showClose: true,
                                                      message: "最大锁座个数为" + that.getUserConfig.max_sale_seat_num,
                                                      type: 'warning'
                                                  });
                      }

                    // that.loading = true
                    if(that.rectArr.length) {
                      let seatCodeArr = that.rectArr.map(seat => {
                        return seat.seatCode
                      })
                      getTicketPrice({
                          planCode: that.currentPlanCode,
                          ticketUid: that.currentTicketId,
                          seatCode: seatCodeArr
                        }).then(res => {
                          if(res.code == 200) {
                            if(res.data.length) {
                              that.COVER_TICKET_PRICE(res.data)
                            }
                              that.addSeat(that.rectArr)
                          }else {
                              that.$message({
                                            showClose: true,
                                            message: res.msg,
                                            type: 'error'
                                        });
                          }
                        })
                    }
                }

                document.onmousemove = null;
        }

        return false;  //解除在划动过程中鼠标样式改变的BUG
        }
      },
      //单选
      selSingleSeat(item) {  //修改为先添加然后渲染座位状态
        // console.log(item)
        if(item.status == 1 || item.status == 100) {
          this.loading = true
          // let currentstatus = !item.is_sel
          let currentItems = []
          if(!this.allowSingleSold) {
            //此处原来是 allSeat  allSeat会突然清空 现在使用当前渲染的seat_data来遍历
            this.allSeat.forEach(seat => {
              if(item.groupCode == seat.groupCode) {
                currentItems.push(seat)
              }
            })
          }else {
            currentItems.push(item)
          }
          // console.log(currentItems)
          if(item.status == 1) {
            if(this.seatSelection.length + currentItems.length > this.getUserConfig.max_sale_seat_num) {
              this.loading = false
              return this.$message({
                                            showClose: true,
                                            message: "最大锁座个数为" + this.getUserConfig.max_sale_seat_num,
                                            type: 'warning'
                                        });
            }
            let seatCodeArr = currentItems.map(seat => {
                        return seat.seatCode
                      })
            getTicketPrice({
              planCode: this.currentPlanCode,
              ticketUid: this.currentTicketId,
              seatCode: seatCodeArr
            }).then(res => {
              if(res.code == 200) {
                if(res.data.length) {
                  this.COVER_TICKET_PRICE(res.data)
                }
                  this.addSeat(currentItems)
              }else {
                   this.$message({
                                showClose: true,
                                message: res.msg,
                                type: 'error'
                            });
              }
            })
          }else if(item.status == 100){
            this.delSeat(currentItems)
          }
        }
      },
      //判断是否有billCode存在  没有就请求新的billCode  有的话就不发请求
      isBillCode(items) {
         if(!this.billCode) {
           initCart({
              netSaleFlag: '0',
              remark: ''
           }).then(res => {
             if(res.code == 200) {
               this.GET_CART_BILLCODE(res.data)
               this.doLockSeat(items)
             }else {
               this.$message({
                                showClose: true,
                                message: res.msg,
                                type: 'error'
                            });
             }
           })
         }else {
           this.doLockSeat(items)
         }
      },
      //锁座异步方法
      doLockSeat(items) {
        lockSeat({
                    channelCode: this.channelCode,
                    cinemaCode: this.cinemaCode,
                    saleBillCode: this.billCode,
                    timeSeatList: items
        }).then(res => {
          if(res.code == 200 && res.data) {
            items.forEach((item, index) => {
                        item.lockSeatKey = res.data.timeSeatList[index].lockSeatKey
                      })
            this.doAddCart(items)
          }else {
            this.$message({
                                showClose: true,
                                message: '锁座失败',
                                type: 'error'
                            });
            setTimeout(() => {
              this.loading = false
            }, 2500)
          }
        })
      },
      //添加购物车方法
      doAddCart(items) {
        // console.log(items)
         let addCartParalist = items.map((item) => {
                        let obj = {
                          cinemaUid: item.cinemaUid,
                          goodsType: 4,
                          saleNum: 1,
                          timeSeat: {
                            seatLevel: item.seatLevel,
                            addPrice: item.addPrice,
                            lockSeatKey: item.lockSeatKey,
                            planCode: item.planCode,
                            planUid: item.planUid,
                            seatCode: item.seatCode,
                            seatCol: item.col,
                            seatRow: item.row,
                            ticketPrice: item.ticketPrice,
                            originalTicketPrice: item.originalTicketPrice,
                            ticketTypeName: item.ticketTypeName,
                            ticketTypeUid: item.ticketTypeUid,
                            groupCode: item.groupCode
                          }
                        }

                        return obj
                      })

        addCart({
          billCode: this.billCode,
          goodsList: addCartParalist,
        }).then(res => {
          if(res.code == 200) {
            findTimeSeatStatus({cinemaCode: this.cinemaCode, planCode: this.currentPlanCode}).then(res => {
                        if(res.code == 200) {
                           this.SEAT_SELECTION(items)
                           this.CHECK_CURRENT_SEAT_STATUS(res.data)
                        }
                    })
            // this.SEAT_SELECTION(items)
            this.loading = false
            findCart({billCode: this.billCode}).then(res => {
                              if(res.code == 200) {
                                this.GET_CART_DATA(res.data)
                                this.GET_KIND_PRICE(res.data)
                                this.GET_CART_BILLCODEUID(res.data.uid)
                                this.GET_CART_CINEMAUID(res.data.cinemaUid)
                              
                              }else {
                                this.$message({
                                              showClose: true,
                                              message: res.msg,
                                              type: 'error'
                                          });
                              }
                          })
          }else {
            releaseSeat({
                        channelCode: this.channelCode,
                        cinemaCode: this.cinemaCode,
                        saleBillCode: this.billCode,
                        timeSeatList: items
                        }).then(res => {
                        if(res.code == 200) {
                            findTimeSeatStatus({cinemaCode: this.cinemaCode, planCode: this.currentPlanCode}).then(res => {
                                if(res.code == 200) {
                                this.CLEAR_SELECTION()
                                this.CHECK_CURRENT_SEAT_STATUS(res.data)
                                }
                            })
                            this.GET_CART_DATA({goodsList: []})
                            // this.CLEAR_SELECTION()
                            // this.GET_CART_BILLCODE('')
                            // this.GET_CART_BILLCODEUID('')
                            this.GET_CART_DATA({goodsList:[]})
                            this.RENDER_SELECTION_AFTER_RELEASE(res.data)
                            }else {
                                this.$message({
                                        showClose: true,
                                        message: res.msg,
                                        type: 'error'
                                    });
                            }
                    })
            this.loading = false
            this.$message({
                                showClose: true,
                                message: res.msg,
                                type: 'error'
                            });
          }
        })
        
      },
      //将选中的座位放到数组中
      addSeat(items) {
        // console.log(items)
         if(!this.allowSingleSold) {
           this.allSeat.forEach(item => {
             items.forEach(selitem => {
               if(selitem.groupCode == item.groupCode) {
                 items.push(item)
               }
             })
           })
         }

         items = Array.from(new Set(items))

         let currentObj = JSON.parse(JSON.stringify(this.selPriceItem[0]));

         let currentTicketType = currentObj.name + "￥" + currentObj.price

         items.forEach(item => {
           item.type_price = currentTicketType
           item.ticketTypeName = currentObj.name
           item.ticketTypeUid = currentObj.id
         })

         this.isBillCode(items)
         
         this.doPages()
      },
      //单个座位删除
      delSeat(items) {
        if(!items[0].lockSeatKey) {
           this.$message({
                            showClose: true,
                            message: "此座位已被其他终端锁定，不可以操作",
                            type: 'warning'
                        });
            this.loading = false
            return
        }
        let goodsList = items.map(item => {
          let obj = {
            timeSeat: {
              seatCode: item.seatCode
            }
          }
          return obj
        })

        let delDatas = {
          billCode: this.billCode,
          goodsList
        }

        // console.log(delDatas)

        delTicket(delDatas).then(res => {
           if(res.code == 200) {
             findCart({billCode: this.billCode}).then(res => {
                        if(res.code == 200) {
                          this.GET_CART_DATA(res.data)
                          this.GET_KIND_PRICE(res.data)
                          }else {
                            this.$message({
                                          showClose: true,
                                          message: res.msg,
                                          type: 'error'
                                      });
                          }
                      })
             releaseSeat({
                  channelCode: this.channelCode,
                  cinemaCode: this.cinemaCode,
                  saleBillCode: this.billCode,
                  timeSeatList: items
                }).then(res => {
                  if(res.code == 200) {
                    findTimeSeatStatus({cinemaCode: this.cinemaCode, planCode: this.currentPlanCode}).then(res => {
                                if(res.code == 200) {
                                this.CHECK_CURRENT_SEAT_STATUS(res.data)
                                }
                            })
                    this.RENDER_SELECTION_AFTER_RELEASE(res.data)
                    this.loading = false
                  }
              })
           }else {
             this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'error'
                        });
             setTimeout(() => {
              this.loading = false
            }, 2500)
           }
        })
        for(let i = 0; i < items.length; i++) {
          this.allowSingleSold ? this.DEL_SEAT(items[i].seatCode) : this.DEL_SEAT(items[i].groupCode)
          
        }
        this.doPages()
      },
      //点击放大
      extendSeats() {
        this.EXTEND_SEAT()
        this.SHOW_BOTTOM_BAR()

        this.scaleNum = 1;
        this.scaleString = '';
        this.hallWidth = this.cols * parseFloat(this.scaleNum)
        this.hallHeight = this.rows * parseFloat(this.scaleNum)
      },
      //缩小
      narrowSeats() {
        this.isReverse = false
        this.EXTEND_SEAT()
        this.SHOW_BOTTOM_BAR()
        this.maxWidth = 0
        this.maxHeight = 0

        // 以 9排  18 座  为基数， 大于这两个基数则进行计算按比例缩小
        if((this.rows > 9 * 2.7 || this.cols > 18 * 2.7) && !this.isExtends) {
               this.scaleNum =  `${Math.min(9 * 2.7/this.rows, 18 * 2.7/this.cols)}`
               this.scaleString = `scale(${Math.min(9 * 2.7/this.rows, 18 * 2.7/this.cols)})`
              }else {
                this.scaleNum =  1
                this.scaleString = `scale(1, 1)`
              }

        this.hallWidth = this.cols * parseFloat(this.scaleNum) + 3.0;
        this.hallHeight = this.rows * parseFloat(this.scaleNum) + 2.8;
      },
      //选择电影票
       selTicket(id) {
           this.SET_CURRENT_TICKET_ID(id)
       },
      //打开更多票类
      openMoreTicket() {
          this.$emit("openMoreTicket")
      }
    },
  }
</script>

<style scoped lang="scss">
  .seat-container {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    user-select: none;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
  }

  .right {
    box-sizing: border-box;
    width: 76vw;
    height: 100%;
    background: #ffffff;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .header {
    font-size: $font-size14;
    color: #333333;
    text-align: center;
    margin-bottom: 2%;
    position: relative;
    width: 100%;
    user-select: none;
  }

  .extendFontHeader {
    font-size: $font-size16;
  }

  .screen {
    height: 24px;
    @include screen_bgcolor();
    text-align: center;
    line-height: 24px;
    margin-bottom: 12px;
    border-bottom-right-radius: 30px;
    border-bottom-left-radius: 30px;
    user-select: none;
    font-size: 14px;
  }

  .seats {
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    position: relative;
  }

  .seats-center {
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: start;
    position: relative;
    user-select: none;
  }

  .seats-container {
    box-sizing: border-box;
    position: relative;
    transition: all 0.3s;
  }

  // 座位默认样式
  .seat-default {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.2s linear;
  }
  .seat-default:hover {
     cursor: pointer;
  }
  .seat-default-style {
    @include seat_color();
    transition: all 0.3s linear;
  }
  .seat-default-style-active {
    @include seat_active_color();
  }
  .seat-num-default {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: $font-color6;
    user-select: none;
  }
  .seat-num-default-small {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    color: $font-color6;
    user-select: none;
  }
  .active-seat-num {
    color: #ffffff;
    font-weight: 400;
  }
  .row-default  {
    width: 100%;
    @include seat_rows_bgcolor();
    border-radius: 9px;
    position: relative;
    user-select: none;
  }
  .row-default-left, .row-default-right {
    width: 1.6vw;
    min-width: 1.6vw;
    @include seat_rows_bgcolor();
    border-radius: 0.8vw;
    overflow: hidden;
  }
  .row-num-style {
    position: absolute;
    left: 50%;
    user-select: none;
  }
  .seatLargeBox {
    width: 32px !important;
    height: 28px !important;
  }
  .active-seat {
    @include seat_active_color();
  }
  .extendFontNum {
    font-size: $font-size14 !important;
  }
  .outside-common {
    width: 16px;
    background: #f2f2f2;
    border-radius: 8px;
  }
  .seat-intro {
    margin: 12px 0;
    display: flex;
    justify-content: center;
  }
  .intor-margin {
    margin: 0 18px;
    display: flex;
    align-items: center;
  }
  .intor-font {
    color: #333333;
    font-size: $font-size12;
  }
  .intor-img {
    font-size: $font-size14;
    color: #DBE3F6;
  }
  .intor-img-large {
    font-size: $font-size18;
    color: #DBE3F6;
  }
  .intor-margin-small {
    margin: 0 6px;
    display: flex;
    align-items: center;
  }
  .circle-style {
    display: inline-block;
    width: 1.2vw;
    height: 1.2vw;
    border-radius: 50%;
    margin-right: 4px;
  }

  .circle-style-font {
    background: #F33430; 
    font-size: 10px; 
    color: #ffffff; 
    text-align: center; 
    line-height: 1.2vw; 
    font-style: normal
  }

  //放大按钮
  .extend-btn {
    position: absolute;
    top: 2px;
    right: 45px;
    color:  #333333;
    font-weight: 200;
    font-size: $font-size18;
    cursor: pointer;
  }

  //放大后的字体大小
  .extendFont {
    font-size: 28px !important;
  }
  .intor-font-large {
    font-size: $font-size14 !important;
  }

  //左侧向上向下箭头
  .arrow-common {
    position: absolute;
    width: 70px;
    height: 20px;
    background: #436AC8;
    opacity: 0.3;
    z-index: 5000;
  }

  .arrow-common:nth-child(1) {
    top: 40px;
    left: 20px;
  }

  .arrow-common:nth-child(2) {
    bottom: 0;
    left: 20px;
  }

  .small-map-film-name {
    display: block;
    width: 100%;
    overflow: hidden;
    font-size: $font-size12;
    color: #333333;
    text-align: center;
    transform: scale(0.68);
    word-break:keep-all;           /* 不换行 */
    white-space:nowrap;          /* 不换行 */
  }

  .small-map-screen {
    width: 100%;
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    color: #333333;
    text-align: center;
    background: #f2f2f2;
    transform: scaleY(0.6);
    margin: 12px 0;
  }

  .seat-contorl {
    width: 100%;
    background: #f2f2f2;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    font-size: $font-size12;
    position: relative;
  }

  .control-common-style {
    display: inline-block;
    width: 10vw;
    height: 4.2vh;
    line-height: 4.2vh;
    border: 1px solid #A4BEFC;
    color: #3b74ff;
    text-align: center;
    margin-top: 12px 0;
    background: #ffffff;
    font-size: $font-size12;
    margin-right: 1px;
    margin-top: 1px;
  }

  .tickets-common-style {
    display: inline-block;
    width: 10vw;
    height: 4.2vh;
    line-height: 4.2vh;
    border: 1px solid #A4BEFC;
    color: #3b74ff;
    text-align: center;
    margin-top: 12px 0;
    background: #ffffff;
    font-size: $font-size12;
    margin-right: 1px;
    margin-top: 1px;
    cursor: pointer;
    position: relative;
  }

  .control-common-style-selected {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    font-size:$font-size12;
    margin-right: 1px;
    margin-bottom: 12px;
  }

  .have-selected-ticket {
    display: inline-block;
    width: 12.7vw;
    height: 3.1vh;
    line-height: 3.1vh;
    border: 1px solid #A4BEFC;
    color: #ffffff;
    text-align: center;
    background: #3b74ff;
    font-size: $font-size12;
    margin: 0 4px;
  }

  .icon-arrow-right-noSelected, .icon-arrow-left-Selected {
    font-size: 12px;
    font-weight: 100;
    transform: scale(0.8);
  }

  .iconpiaoleixuanzhong1{
    position: absolute;
    top: 0px;
    right: 0;
    font-size: 2.24vw;
    color: $font-color-blue;
  }

  .commonbtn-pre, .commonbtn-next {
    background: #fff;
    margin: 0 1.5vw;
    width: 3.9vw;
    height: 3.4vh;
    line-height: 3.4vh;
    text-align: center;
    font-size: $font-size14;
    color: $font-color-blue;
    border: 1px solid #3B74FF;
    border-radius: 2px;
  }

  .ticket-arrow {
    margin-right: -24px;
    transform: scale(0.8);
    font-weight: 100;
  }

.part-sel {
   flex: 0 0 50%;
   height: 50%; 
   box-sizing: border-box; 
   border: 1px dashed #DBE3F6;
   z-index: 500;
}
.part-sel:hover {
  background: rgba(152, 180, 245, 0.527);
  cursor: pointer;
  border: 1px dashed rgb(41, 104, 252);
}

.reverse-style {
  transform: rotate(-180deg);
}
.tickets-container {
  box-sizing: border-box;
  display: flex; 
  justify-content: flex-start; 
  margin: 12px 0; 
  width: calc(100% - 2vw); 
  flex-wrap: wrap;
}
.tickets-sel-container {
  display: flex; 
  justify-content: flex-start; 
  flex-direction: column;
  align-items: flex-start;
  margin: 12px 0; 
  width: 100%;
  min-height: 50vh;
  flex-wrap: wrap;
}
.tickets-sel-tab {
  position: absolute;
  right: 0;
  bottom: 5.5vh;
  width: 100%;
  height: 5.5vh;
  display: flex; 
  justify-content: center;
  flex-wrap: wrap;
}
.finished-btn {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 5.5vh;
  color: #ffffff; 
  background: #3b74ff;
  line-height: 5.5vh; 
  text-align: center; 
  cursor: pointer;
}
.is-sel-seats-header {
   width:100%; 
   height: 48px;
   line-height: 48px; 
   background: #DBE3F6;
}
.small-map-control {
  width: 100%; 
  display: flex; 
  justify-content: center; 
  margin-top: 12px;
}
.tickets-type {
  width:100%; 
  height: 48px; 
  line-height: 48px; 
  background: #DBE3F6;
  margin-top: 12px;
}
.is-sel-seats-header-font {
  margin-left: 12px;
  font-size: $font-size13;
  color: #333;
}
.iconduorenzuoyizhong {
  transform: scaleX(1.25);
}

.iconduorenzuoyizuo,
.iconduorenzuoyiyou {
  transform: scaleX(1.25);
}
.footer-default {
  position: relative;
  z-index: 10;
  background: #ffffff;
  // width: calc(100% + 140px);
  user-select: none;
}
.seat-detail {
  width: 23vw;
  height: 100vh;
  position: relative;
}
.broken-seat {
  color: #dddddd !important;
}
.hold-seat {
  color: #FF9E42 !important;
}
.sold-seat {
  color: #FF6D6D !important;
}
.local-selected-style {
  color: #67c23a !important;
}
.small-seats-map {
  position: relative;
}
.small-seats-map-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70px;
  height: 56px;
  z-index: 1000;
  border: 1px dashed #FF9E42;
}
.pointer-circle {
  position: absolute;
  z-index: 500;
  background: rgba(255, 137, 0, 0.6);
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.highlight-row {
  color: $font-color-blue;
  font-weight: 400;
  text-decoration: underline;
  transform: translateX(-50%) scale(1.04) !important;
}
.no-seat-pic {
  width: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation:mymove 3s infinite;
  -webkit-animation:mymove 3s infinite;
}
.no-seat-font {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
}
.net-seal-style {
  width: 1.2vw;
  height: 1.2vw;
  border-radius: 50%;
  background: #F33430;
  box-shadow: 0 0 2px 2px #fff;
  font-size: 0.85vw;
  position: absolute;
  right: 0;
  top: -0.14vw;
}
.net-seal-style:before {
  display: block;
  content: '网';
  color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.notoken-seal-style {
  width: 1.2vw;
  height: 1.2vw;
  border-radius: 50%;
  background: #F33430;
  box-shadow: 0 0 2px 2px #fff;
  position: absolute;
  right: 0;
  top: -0.3vw;
}
.notoken-seal-style:before {
  display: block;
  content: '未';
  color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

@keyframes mymove
{
  
0%   {opacity: 0.68;}
30%  {opacity: 0.73;}
50%  {opacity: 0.78;}
70%  {opacity: 0.88;}
100% {opacity: 1.0;}
}

@-webkit-keyframes mymove /* Safari and Chrome */
{
0%   {opacity: 0.68;}
30%  {opacity: 0.73;}
50%  {opacity: 0.78;}
70%  {opacity: 0.88;}
100% {opacity: 1.0;}
}
</style>