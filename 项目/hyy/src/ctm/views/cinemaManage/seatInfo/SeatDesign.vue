<template>
  <div class="seatpage">
    <!-- <el-breadcrumb separator=">" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item >我的影院</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/ticket/cinema/edit',query:{uid:params.cinemaUid}}" ><span style="color:#666">影厅管理</span>  </el-breadcrumb-item>
      <el-breadcrumb-item class="edit-seat">编辑座位图</el-breadcrumb-item>
    </el-breadcrumb> -->
    <el-container style="height: 705px;">
      <el-main id="seatMain" style="background-color: #FFF; padding: 0;">
        <!--银幕-->
        <div class="screen" :style="{width: maxcolsize * 41 + 'px', marginLeft: (messageCol + 1) * 41 + 'px'}">
          银幕
        </div>
        <!--座位列头文本框-->
        <table class="tdseatcolheader">
          <tr>
            <template v-model="messagecolArr" v-for="(col,index) in messagecolArr">
              <td v-if="index>1"> 
                <div class="nullBox"></div>
              </td>
              <td v-if="index == 0">
                <div class="editSeatBtn" @click="editSeatBtn()"><span>编辑座位号</span></div>
              </td>
            </template>
            <td v-for="(cell, index) in seatColNumArray" :key="'colName' + index">
              <input class="seatcolheader" v-model="cell.col" :disabled="eaitDisabled" @focus="getColVal(cell.col, index)" @change="colChange(cell.col)"/>
            </td>
            <td v-model="messagecolArr" v-for="(col,index) in messagecolArr">
                <div class="fanzhuagn-box" v-if="index == 1" @click="colIndexBtnEvent">
                  <svg class="icon icon-width20" aria-hidden="true">
                    <use xlink:href="#icon-neiye-zuoyoufanzhuan"></use>
                  </svg>
                  <p class="fanzhuagn-box-title">翻转</p>
                </div>
                <div class="nullBox" v-if="index != 1"></div>
            </td>
          </tr>
        </table>
        <!--座位操作区-->
        <div id="scseat" class="section"
             @contextmenu.prevent="showMenu($event)"
             @mousedown="seatMousedownHandler($event)"
             @mousemove="seatMousemoveHandler($event)"
             @mouseleave="seatMouseupHandler($event)"
             @mouseup="seatMouseupHandler($event)">
             <div v-show="contextBoxVisibility" ref="contextMenu" class="context-box">
               <span class="context-box-item" @mousedown="closeContextMenu(false)">显示座位号码</span>
               <span class="context-box-item" @mousedown="closeContextMenu(true)">显示座位级别</span>
             </div>
          <!--座位背景-->
          <table  class="seatbackground">
            <tr v-for="(col,index) in messagerowArr">
              <td>
                <div class="fanzhuagn-box" 
                     v-if="index == 0"
                     @click="rowIndexBtnEvent"
                >
                  <svg class="icon icon-width20" aria-hidden="true">
                    <use xlink:href="#icon-neiye-shangxiafanzhuan"></use>
                  </svg>
                  <p class="fanzhuagn-box-title">翻转</p>
                </div>
              </td>
              <td v-for="row in messagecolArr">
                <div class="nullBox"></div>
              </td>
              <td v-for="(cell, index) in seatColNumArray">
                <div></div>
              </td>
              <td v-for="row in messagecolArr">
                <div class="nullBox"></div>
              </td>
            </tr>
            <tr v-for="(cell, index) in seatRowNumArray">
              <td>
                <input class="seatrowheader" v-model="cell.row" :disabled="eaitDisabled" @focus="getRowVal(cell.row)" @change="rowChange(cell.row)"/>
              </td>
              <td v-for="row in messagecolArr"></td>
              <td v-for="(cell, index) in seatColNumArray">
                <div></div>
              </td>
              <td v-for="row in messagecolArr"></td>
            </tr>
            <tr v-for="col in messagerowArr">
              <td><div class="nullBox"></div></td>
              <td v-for="row in messagecolArr">
                <div class="nullBox"></div>
              </td>
              <td v-for="(cell, index) in seatColNumArray">
                <div></div>
              </td>
              <td v-for="row in messagecolArr">
                <div class="nullBox"></div>
              </td>
            </tr>
          </table>
          <!--座位区域-->
          <div class="seatarea" style="position: relative;"
               v-bind:style="{top: seatarea.top-this.messageRow*41 + 'px', left: seatarea.left+this.messageCol*41 + 'px', width: seatarea.width + 'px', height: seatarea.height + 'px'}">
            <table class="tdseatarea">
              <tr v-for="seatarearow in seatAreaGrid">
                <td v-for="seatareacol in seatarearow" v-bind:style="{backgroundColor: seatareacol.color, opacity: 0.3}">
                  <div></div>
                </td>
              </tr>
            </table>
          </div>
          <!--座位-->
          <div class="seatcell" style="position: relative;"
               v-bind:style="{top: seatarea.top*2-this.messageRow*41 + 'px', left: seatarea.left+this.messageCol*41 + 'px', width: seatarea.width + 'px', height: seatarea.height + 'px'}">
            <table class="tdseatarea">
              <tr v-for="seatcellrow in seatCellGrid">
                <td v-for="seatcellcol in seatcellrow">
                  <div class="iconfont-text" 
                    v-model="seatlevClickActive"
                    v-bind:class="getIcon(seatcellcol.imageType)" 
                    :sgCode="seatcellcol.sgCode">{{seatlevClickActive == false ? seatcellcol.colAlias : seatcellcol.seatLevel}}</div>
                </td>
              </tr>
            </table>
          </div>
          <!-- 画框线 -->
          <div class="drawline" v-if="drawline.drawing"
               v-bind:style="{left: drawline.left + 'px', top: drawline.top + 'px', width: drawline.width + 'px', height: drawline.height + 'px'}"></div>
        </div>
        <!-- {{this.messageRow}} -->
        <!-- <br> -->
        <!-- {{this.seatCellGrid}} -->
        <!-- {{this.messageRow}} -->
      </el-main>
      <!--右边区域-->
      <el-aside width="300px" style="background-color: #FFF; margin-left: 20px;position: relative;overflow: hidden;">
        <div class="h">
          <div class="seat-area" style="margin-bottom:8px;color: #333;font-size: 14px;"><span>座位区域</span>
            <el-input class="area-row-col seat-inputBtn" type="number" v-model="maxrowsize" @focus="focusMaxrowsize()" @change="maxrowsizeChangeHandler()"/>
            <span style="color:#666666;">行　X</span>
            <el-input class="area-row-col seat-inputBtn" type="number" v-model="maxcolsize" @focus="focusMaxcolsize()" @change="maxcolsizeChangeHandler()"/>
            <span style="color:#666666;">列</span>
          </div>
          <!-- <div class="seat-area" style="margin-bottom:35px;color: #333;font-size: 14px;"><span>留白区域</span>
            <el-input class="area-row-col seat-inputBtn" v-model="messageRow" @focus="focusMessageRow()" @blur="messageRowChangeHandler()"/>
            <span style="color:#666666;">行　X</span>
            <el-input class="area-row-col seat-inputBtn" v-model="messageCol" @focus="focusMessageCol()" @blur="messageColChangeHandler()"/>
            <span style="color:#666666;">列</span>
          </div> -->
          <div style="margin-bottom:17px;color: #333;font-size: 14px;">添加座位</div>
          <div style="margin-top: 10px;margin-bottom:17px;">
            <ul class="seatstyle-tips">
              <template v-for="(addSeat,index) in addSeatArr">
                <li v-if="addSeat.seatNumber == 1" :key="index" @click="addSeatArrEvent(index)">
                  <div class="seatstyle-tips-icon">
                    <svg class="icon icon-single-seat" aria-hidden="true">
                      <use :xlink:href="addSeat.seatActive == false ? addSeat.noChoiceIcon : addSeat.yesChoiceIcon"></use>
                    </svg>
                  </div>
                  <div class="seatstyle-tips-title">{{addSeat.name}}</div>
                </li>
                <li v-if="addSeat.seatNumber == 2" :key="index" @click="addSeatArrEvent(index)">
                  <div class="seatstyle-tips-icon">
                    <svg class="icon icon-twin-seat" aria-hidden="true">
                      <use :xlink:href="addSeat.seatActive == false ? addSeat.noChoiceIcon : addSeat.yesChoiceIcon"></use>
                    </svg>
                  </div>
                  <div class="seatstyle-tips-title">{{addSeat.name}}</div>
                </li>
                <li v-if="addSeat.seatNumber == 3" :key="index" @click="addSeatArrEvent(index)">
                  <div class="seatstyle-tips-icon">
                    <svg class="icon icon-trree-seat" aria-hidden="true">
                      <use :xlink:href="addSeat.seatActive == false ? addSeat.noChoiceIcon : addSeat.yesChoiceIcon"></use>
                    </svg>
                  </div>
                  <div class="seatstyle-tips-title">{{addSeat.name}}</div>
                </li>
              </template>
            </ul>
          </div>
          <div style="margin-bottom:17px;color: #333;font-size: 14px;">编辑座位</div>
          <div style="margin-top: 10px;margin-bottom:17px;">
            <ul class="seatstyle-tips">
              <li v-for="(editseat,index) in editSeatArr" :key="index+7" @click="editSeatArrEvent(index)">
                <div class="seatstyle-tips-icon">
                  <svg class="icon icon-single-seat" aria-hidden="true">
                    <use :xlink:href="editseat.seatActive == false ? editseat.noChoiceIcon : editseat.yesChoiceIcon"></use>
                  </svg>
                </div>
                <div class="seatstyle-tips-title">{{editseat.name}}</div>
              </li>
            </ul>
          </div>
          <div style="margin-bottom:17px; color: #333">设定分区方案</div>
          <setRegionPlan
                  ref="setRegionPlan"
                  :seatAreaGrid="seatAreaGrid"
                  :seatCellGrid="seatCellGrid"
                  @updateDrawBgData="updateDrawBgData"
                  @updateCommonBgData="updateCommonBgData"
                  @updateActiveType="updateActiveType"
                  @updateSeatRegionData="updateSeatRegionData"
          ></setRegionPlan>
<!--          <div class="sales-territory-box">-->
<!--            <ul class="sales-territory-boxUlnone" v-model="drawSaleArea" v-if="drawSaleArea.length == 0">-->
<!--              <li>没有设定分区方案</li>-->
<!--            </ul>-->
<!--            <ul class="sales-territory-boxUl" v-model="drawSaleArea" v-if="drawSaleArea.length > 0">-->
<!--              <li v-for="(draw,index) in drawSaleArea" -->
<!--              :style="'background-color:'+draw.fontColor+';color:' +draw.color+';'" -->
<!--              :key="index"-->
<!--              @click="drawSaleAreaEvent(index)"-->
<!--              >{{draw.name}}</li>-->
<!--            </ul>-->
<!--            <div class="deldrawSaleArea" v-model="drawSaleArea" v-if="drawSaleArea.length > 0">-->
<!--              <span -->
<!--              @click="delSaleEvent()" -->
<!--              >清除座位关联</span>-->
<!--            </div>-->
<!--            &lt;!&ndash; <span class="sales-territory-arrow">-->
<!--              <svg class="icon icon-box" aria-hidden="true">-->
<!--                <use xlink:href="#icon-arrow-left-noSelected"></use>-->
<!--              </svg>-->
<!--            </span>-->
<!--                          v-model="selectDelSaleActive"-->
<!--              :class="selectDelSaleActive == true ? 'active' : ''"-->
<!--            <span class="sales-territory-color">-->
<!--              <div class="sales-territory-div" -->
<!--              v-for="(draw,index) in drawSaleArea" -->
<!--              :style="'background-color:'+draw.fontColor+';color:' +draw.color+';'" :key="index" @click="drawSaleAreaEvent(index)"-->
<!--              >-->
<!--                {{draw.name}}-->
<!--              </div>-->
<!--            </span>-->
<!--            <span class="sales-territory-arrow">-->
<!--              <svg class="icon icon-box" aria-hidden="true">-->
<!--                <use xlink:href="#icon-arrow-right-noSelected"></use>-->
<!--              </svg>-->
<!--            </span>-->
<!--            <span class="sales-territory-add">-->
<!--              <svg class="icon icon-box" aria-hidden="true">-->
<!--                <use xlink:href="#icon-neiye-tianjia"></use>-->
<!--              </svg>-->
<!--            </span> &ndash;&gt;-->
<!--          </div>-->
<!--          <div class="sales-territory-region">-->
<!--            <div class="sales-territory-regionleft">-->
<!--              <p>名称：会员区</p>-->
<!--              <p>可售渠道：柜台、APP及小程序</p>-->
<!--              <p>可售消费者：全部会员</p>-->
<!--              <p>总座位数：20</p>-->
<!--              <span class="regionleft-eait" @click="salesAreaEdit()">编辑</span>-->
<!--            </div>-->
<!--            <div class="sales-territory-regionBtn">-->
<!--              <span @click="delSaleEvent()">清除座位关联</span>-->
<!--              <span>添加选中座位</span>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div style="margin-bottom:17px;margin-top:16px;color: #333">设定选中座位等级</div>-->
<!--          <div class="sales-territory-grade" style="height:24px;position: relative;">-->
<!--            <ul class="sales-territory-gradeUL">-->
<!--              <li v-for="(el,index) in seatlevArr" -->
<!--                  @click="seatlevEvent(index)"-->
<!--                  :class="seatlevActive == index ? 'active' : ''"-->
<!--                >{{el.num}}</li>-->
<!--              <li style="line-height:20px;"-->
<!--                  @click="seatlevEventMore()"-->
<!--                  :class="seatlevActive == 'more' ? 'active' : ''"-->
<!--                >-->
<!--                <svg class="icon icon-addbox" aria-hidden="true">-->
<!--                  <use xlink:href="#icon-quanju-xiala"></use>-->
<!--                </svg>-->
<!--              </li>-->
<!--            </ul>-->
<!--            <div class="moreseatlevBox" v-if="seatlevMore">-->
<!--              <ul class="moreseatlevBox-ul">-->
<!--                <li v-for="(item,index) in seatlevArrmore" -->
<!--                    @click="seatlevmoreLiBtn(index)"-->
<!--                >{{item.num}}</li>-->
<!--              </ul>-->
<!--            </div>-->
<!--          </div>-->
          <div style="margin-bottom:17px;margin-top:16px; color: #333">详情统计</div>
          <div class="sales-details-Statistics">
            <ul class="sales-details-StatisticsUL">
              <li>
                <span class="sales-details-name">影厅名称：</span>
                <span class="sales-details-result" v-model="countSeat">{{countSeat.hallName}}</span>
              </li>
              <li>
                <span class="sales-details-name">总座位数：</span>
                <span class="sales-details-result" v-model="countSeat">{{countSeat.allSeat}}</span>
              </li>
              <li>
                <span class="sales-details-name">普通单座：</span>
                <span class="sales-details-result" v-model="countSeat">{{countSeat.commonSeat}}</span>
              </li>
              <li>
                <span class="sales-details-name">情侣双人座：</span>
                <span class="sales-details-result" v-model="countSeat">{{countSeat.twoSeat}}</span>
              </li>
              <li>
                <span class="sales-details-name">三人座：</span>
                <span class="sales-details-result" v-model="countSeat">{{countSeat.threeSeat}}</span>
              </li>
              <li>
                <span class="sales-details-name">残疾人座：</span>
                <span class="sales-details-result" v-model="countSeat">{{countSeat.Handicapped}}</span>
              </li>
              <li>
                <span class="sales-details-name">儿童座：</span>
                <span class="sales-details-result" v-model="countSeat">{{countSeat.childrenSeat}}</span>
              </li>
              <li>
                <span class="sales-details-name">按摩椅座：</span>
                <span class="sales-details-result" v-model="countSeat">{{countSeat.Massagechair}}</span>
              </li>
              <li>
                <span class="sales-details-name">坏座：</span>
                <span class="sales-details-result" v-model="countSeat">{{countSeat.badSeat}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="bottom-btn">
          <span class="bottom-btn-yesedit" @click="yesEditEvent()">完成编辑</span>
          <span class="bottom-btn-noedit" @click="noEditEvent()">放弃编辑</span>
        </div>
      </el-aside>
    </el-container>
    <el-dialog
      title="设置销售区域"
      :visible.sync="salesArea"
      width="576px"
      :before-close="salesAreahandleClose">
      <div class="salesArea-box">
        <div class="salesArea-box-col">
          <span class="salesArea-box-name"><i class="sign-red">*</i>区域名称：</span>
          <span class="salesArea-input-width">
            <el-input placeholder="请输入内容"></el-input>
          </span>
        </div>
        <div class="salesArea-box-col">
          <span class="salesArea-box-name" style="line-height:normal;    vertical-align: top;"><i style="visibility: hidden;">*</i>可售区域：</span>
          <span class="salesArea-input-width">
            <span class="salesArea-checked-all">选择所有区域</span>
            <div>
              <el-checkbox-group>
                <el-checkbox label="复选框 A"></el-checkbox>
                <el-checkbox label="复选框 A"></el-checkbox>
                <el-checkbox label="复选框 A"></el-checkbox>
                <el-checkbox label="复选框 A"></el-checkbox>
                <el-checkbox label="复选框 B"></el-checkbox>
                <el-checkbox label="复选框 C"></el-checkbox>
                <el-checkbox label="禁用" disabled></el-checkbox>
                <el-checkbox label="选中且禁用" disabled></el-checkbox>
              </el-checkbox-group>
            </div>
          </span>
        </div>
        <div class="salesArea-box-col">
          <span class="salesArea-box-name"></span>
          <span class="newstyle-a"><el-checkbox>影片开映前</el-checkbox></span>
          <span class="salesArea-box-other">
               <el-input placeholder=""></el-input>
          </span>
          <span style="line-height:32px;">分钟取消可售渠道限制</span>
        </div>
        <div class="salesArea-box-col">
          <span class="salesArea-box-name">可售消费者：</span>
          <span class="salesArea-input-width">
            <!-- <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
          </span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="salesArea = false">取 消</el-button>
        <el-button type="primary" @click="salesArea = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
  /**
   * 座位图页面：
   * 画座位图操作区，主要分为四层：
   * 1. 座位背景图；
   * 2. 座位区域；
   * 3. 座位；
   * 4. 画框线；
   * 原理：根据最大行、最大列生成座位背景、座位区域、座位；
   *     画框线后，根据操作类型进行改变对就座位区域、或座位的样式进行显示；
   *
   * **/
  import $ from 'jquery';
  import '../../../assets/iconfont.js';
  import setRegionPlan from 'ctm/views/cinemaManage/seatInfo/SetRegionPlan'
  export default {
    name: 'seatdesign',
    data() {
      const seatWidthHeight = 40, seatNonBorderWidthHeight = 41;//没有边框线座位单元格子的大小像素
      const defaultMaxRowSize = 16, defaultMaxColSize = 16;//初始化默认座位图最大行列数
      const defaultMaxMessageRow = 1, defaultMaxMessageCol = 2;//初始化默认座位图最大行列数
      return {
        //右键菜单开关
        contextBoxVisibility: false,
        //翻转开关
        turnCol: false,
        turnRow: false,
        turnedArr: [], //被编辑过的列号
        //编辑座位时查询返回的数据
        initHallData: {},
        // 保存当前选中列号的值
        nowColVal:"",
        // 保存当前选中行号的值
        nowRowVal:"",
        // 编辑座位号状态
        eaitDisabled:true,
        rowType:0,
        // 销售区域选中状态
        selectDelSaleActive:false,
        // 等级点击状态
        seatlevClickActive:false,
        // 更多等级状态
        seatlevMore:false,
        // 座位等级状态
        seatlevActive:0,
        //座位等级
        seatlevArr:[],
        //座位更多等级
        seatlevArrmore:[],
        // 座位标识
        sgCode:1,
        // 画销售区域
        drawSaleArea:[],
        // 当前选择的销售区域背景色
        drawBgColor:"",
        // 当前选择的销售区域UID
        drawBgRegionUid:"",
        // 普通区背景色
        commonBgColor:"",
        // 普通区域UID
        commonBgRegionUid:"",
        // 销售区域编辑弹窗名字
        salesArea:false,
        // 添加座位数组
        addSeatArr:[],
        // 编辑座位数组
        editSeatArr:[],
        params: {
          cinemaUid: '',
          hallUid: ''
        },
        linkToHallList: '',
        minClientX: 222,
        minClientY: 149,//框选区域时，最少的X、Y坐标
        maxrowsize: defaultMaxRowSize,//最大行数，座位行号列表根据该行数进行生成
        maxcolsize: defaultMaxColSize,//最大列数，座位行号列表根据该列数进行生成
        messageRow: defaultMaxMessageRow,//留白行数默认1行
        messagerowArr:[],
        messageCol: defaultMaxMessageCol,//留白列数默认2列
        messagecolArr:[],
        seatNonBorderWidthHeight: seatNonBorderWidthHeight,//没有边框的座位宽度高度
        seatarea: {//座位区域层次位置参数
          top: -defaultMaxRowSize * seatNonBorderWidthHeight,
          left: seatNonBorderWidthHeight,
          width: defaultMaxColSize * seatNonBorderWidthHeight,
          height: defaultMaxRowSize * seatNonBorderWidthHeight
        },
        seatRowNumArray: [],//座位行号数组，由maxrowsize生成，第一层座位背景图由该行号与列号进行生成
        seatColNumArray: [],//座位列号数组，由maxcolsize生成，第一层座位背景图由该行号与列号进行生成
        seatAreaGrid: [[]],//第二层座位区域二维数组，与第一层座位背景图相对应，每个单元格子对应一个座位背景
        seatCellGrid: [[]],//第三层座位二维数组，与第一层座位背景图相对应，每个单元格子对应一个座位背景
        actionType: 0,//操作类型，画框后根据该类型进行相应的业务操作
        drawline: {//第四层画框线
          drawing: false,//是否正在画框中
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          srcLeft: 0,//原点X坐标
          srcTop: 0,//原点Y坐标
          selectedGrid: []//当前框选的单元格子
        },
        // 影厅名称
        hallName:'',
        // 统计栏参数
        countSeat:{
          hallName:"",
          allSeat:0,
          commonSeat:0,
          twoSeat:0,
          threeSeat:0,
          childrenSeat:0,
          Handicapped:0,
          Massagechair:0,
          badSeat:0
        },
        kktest:""
      }
    },
    components: { setRegionPlan },
    methods: {
      //右键鼠标
      showMenu(e) {
        this.contextBoxVisibility = true
        this.$refs.contextMenu.style.left = e.clientX + 'px';
        this.$refs.contextMenu.style.top = e.clientY + 'px';
      },
      //右键菜单
      closeContextMenu(booleanVal) {
        this.seatlevClickActive = booleanVal
        this.contextBoxVisibility = false
      },
      // 判断座位区域方法
      maxrowsizeEvent(value){
        // alert(value == NaN)
        // if(value <= 0 || value == NaN){
        //     alert(12123)
        //   // this.maxrowsiz = this.kktest
        // }else{

        // }
      },
      focusMaxrowsize(){
        this.kktest = this.maxrowsize
      },
      focusMaxcolsize(){
        this.kktest = this.maxcolsize
      },
      focusMessageRow(){
        this.kktest = this.messageRow
      },
      focusMessageCol(){
        this.kktest = this.messageCol
      },
      delSaleEvent(){
        this.delActiveType()
        this.actionType = 11
      },
      // drawSaleAreaEvent(index){
      //   this.delActiveType()
      //   this.actionType = 10
      //   this.drawBgColor = this.drawSaleArea[index].fontColor
      //   this.drawBgRegionUid = this.drawSaleArea[index].name
      // },
      updateActiveType(val) {
        this.delActiveType()
        this.actionType = val
      },
      updateDrawBgData(data) {
        this.drawBgColor = data.drawBgColor
        this.drawBgRegionUid = data.drawBgRegionUid
      },
      updateCommonBgData(data) {
        this.commonBgColor = data.commonBgColor
        this.commonBgRegionUid = data.commonBgRegionUid
      },
      updateSeatRegionData(color) {
        this.seatAreaGrid.forEach( (item, index) => {
          item.forEach( (innerItem, innerIndex) => {
            if(innerItem.color === color) {
              innerItem.color = this.commonBgColor
              this.seatCellGrid[index][innerIndex].regionUid = this.commonBgRegionUid
            }
          })
        })
        this.seatAreaGrid = JSON.parse(JSON.stringify(this.seatAreaGrid))
        this.seatCellGrid = JSON.parse(JSON.stringify(this.seatCellGrid))
      },
      // 右侧添加座位事件
      addSeatArrEvent(index){
        this.delActiveType()
        // 点击后 按钮状态改变 true 选中 false不选中
        this.addSeatArr[index].seatActive = !this.addSeatArr[index].seatActive
        // 获取当操作状态值
        this.actionType = index + 1
        this.seatlevClickActive = false
      },
      // 统一actionType没有选中状态按钮显示正常
      delActiveType(){
        this.editSeatArr.forEach(function(obj){
            obj.seatActive = false;
        })
        this.addSeatArr.forEach(function(obj){
            obj.seatActive = false;
        })
      },
      // 右侧编辑座位事件
      editSeatArrEvent(index){
        this.addSeatArr.forEach(function(obj){
            obj.seatActive = false;
        })
        this.editSeatArr.forEach(function(obj){
            obj.seatActive = false;
        })
        // 点击后 按钮状态改变 true 选中 false不选中
        this.editSeatArr[index].seatActive = !this.editSeatArr[index].seatActive
        // 获取当操作状态值
        this.actionType = index + 7
        // console.log(this.actionType)
      },
      // 销售区域编辑事件
      salesAreaEdit(){
        this.salesArea = true
      },
      salesAreahandleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      /**
       * 生成座位数据
       */
      generateSeatData() {
        //根据最大行、列数，生成座位行号、列号数组
        this.generateSeatRowColNumArray();
        //根据最大行、列数，生成第二层座位区域二维数组
        this.generateSeatAreaGrid();
        //根据最大行、列数，生成第三层座位二维数组
        this.generateSeatCellGrid();
        //根据第三层座位，生成行号、列号
        this.generateRowColNum();
        this.countSeat = this.countSeatEvent(this.seatCellGrid);
        //如果是从后台请求的数据，生成数据后进行清空数据
        this.initHallData = null;
      },
      /**
       * 根据最大行、列数，生成座位行号、列号数组
       */
      generateSeatRowColNumArray() {
        //生成座位行号数组
        this.seatRowNumArray = [];
        for (let i = 0; i < this.maxrowsize; i++) {
          let cell = {};
          //cell.row = i + 1;
          this.seatRowNumArray.push(cell);
        }

        //生成座位列号数组
        this.seatColNumArray = [];
        for (let i = 0; i < this.maxcolsize; i++) {
          let cell = {};
          //cell.col = i + 1;
          this.seatColNumArray.push(cell);
        }
      },
      /**
       * 根据最大行、列数，生成第二层座位区域二维数组
       */
      generateSeatAreaGrid() {
        //重新初始化座位区域大小 
        this.seatarea.width = this.maxcolsize * 41;
        this.seatarea.height = this.maxrowsize * 41;
        this.seatarea.top = 0 - this.seatarea.height;

        if (!$.isArray(this.seatAreaGrid)) {
          this.seatAreaGrid = [];
        }
        //根据原有的单元格数据，找出已存在的数据
        let seatAreaTemp = [].concat(this.seatAreaGrid);
        let existRowNum = seatAreaTemp.length;
        let existColNum = 0;
        if (existRowNum > 0 && $.isArray(seatAreaTemp[0])) {
          existColNum = seatAreaTemp[0].length;
        }

        //根据最大行、最大列，保持原有的单元格子数据不变，如果多则删除，如果少则补充；
        this.seatAreaGrid = [];
        for (let i = 0; i < this.maxrowsize; i++) {
          let colArray = [];
          for (let j = 0; j < this.maxcolsize; j++) {
            let cell = null;
            if(!$.isEmptyObject(this.initHallData)){
              cell = this.initHallData[[i,j].join('_')];
            }
            if ($.isEmptyObject(cell) && i <= existRowNum - 1 && j <= existColNum - 1) {
              cell = seatAreaTemp[i][j];
            }
            if (!$.isPlainObject(cell)) {
              cell = {};
            }
            // 初始化分区
            if(cell && cell.regionUid) {
              cell.color = cell.region.color
            }
            colArray.push(cell);
          }
          this.seatAreaGrid.push(colArray);
        }
        console.log(this.seatAreaGrid, 'seatAreaGrid')

      },
      /**
       * 根据最大行、列数，生成第三层座位二维数组
       */
      generateSeatCellGrid() {
        if (!$.isArray(this.seatCellGrid)) {
          this.seatCellGrid = [];
        }
        //根据原有的单元格数据，找出已存在的数据
        let seatcellTemp = [].concat(this.seatCellGrid);
        let existRowNum = seatcellTemp.length;
        let existColNum = 0;
        if (existRowNum > 0 && $.isArray(seatcellTemp[0])) {
          existColNum = seatcellTemp[0].length;
        }

        //根据最大行、最大列，保持原有的单元格子数据不变，如果多则删除，如果少则补充；
        this.seatCellGrid = [];
        for (let i = 0; i < this.maxrowsize; i++) {
          let colArray = [];
          for (let j = 0; j < this.maxcolsize; j++) {
            let cell = null;
            if(!$.isEmptyObject(this.initHallData)){
              cell = this.initHallData[[i,j].join('_')];
            }
            if ($.isEmptyObject(cell) && i <= existRowNum - 1 && j <= existColNum - 1) {
              cell = seatcellTemp[i][j];
            }
            if (!$.isPlainObject(cell)) {
              cell = {};
            }
            if(cell.col >= 1) {
              cell.exist = 1;
            }
            //由于座位单元格数据与坐标XY是相反的，所以取数据时传XY值要相反
            
            cell.ulX = j;
            cell.ulY = i;
            colArray.push(cell);
          }
          this.seatCellGrid.push(colArray);
        }

        this.$nextTick( _ => {
          this.$refs.setRegionPlan.asyncRegionSeatCount()
        })

      },
      //计算画线对应的座位单元格
      calculateDrawlineSeatCell() {
        const ignoreWidthOrHeight = 8;
        //如果框选区域忽略像素
        if (this.drawline.left < this.minClientX || this.drawline.top < this.minClientY
          || (this.drawline.width <= ignoreWidthOrHeight && this.drawline.height <= ignoreWidthOrHeight)) {
          this.resetDrawline();
          return;
        }
        //console.log('this.drawline:');
        //console.log(this.drawline);
        //根据当前框选的区域，计算出对应的单元格子
        this.drawline.selectedGrid = [];
        let scrollTop = $('#seatMain').scrollTop();//滚动条滚动的高度
        let scrollLeft = $('#seatMain').scrollLeft();//滚动条滚动的宽度
        //当前框选区域原点（左上角的点）计算对应单元格子公式：
        //当前行索引 = Math.floor((原点Y坐标 - 座位区域离顶边的距离-留白区域 + Y滚动条滚动的高度) / 单元格子的高度)
        //当前列索引 = Math.floor((原点X坐标 - 座位区域离左边的距离-留白区域 + X滚动条滚动的宽度) / 单元格子的宽度)
        let rowIndexStart = Math.floor((this.drawline.top - this.minClientY - this.messageRow*this.seatNonBorderWidthHeight + scrollTop) / this.seatNonBorderWidthHeight);
        let rowIndexEnd = Math.floor((this.drawline.top + this.drawline.height - this.minClientY - this.messageRow*this.seatNonBorderWidthHeight + scrollTop) / this.seatNonBorderWidthHeight);
        let colIndexStart = Math.floor((this.drawline.left - this.minClientX - this.messageCol*this.seatNonBorderWidthHeight + scrollLeft) / this.seatNonBorderWidthHeight);
        let colIndexEnd = Math.floor((this.drawline.left + this.drawline.width - this.minClientX - this.messageCol*this.seatNonBorderWidthHeight + scrollLeft) / this.seatNonBorderWidthHeight);
        if (rowIndexEnd >= this.maxrowsize) {
          rowIndexEnd = this.maxrowsize - 1;
        }
        if (colIndexEnd >= this.maxcolsize) {
          colIndexEnd = this.maxcolsize - 1;
        }
        // debugger
        for (let y = rowIndexStart; y <= rowIndexEnd; y++) {
          let row = [];
          for (let x = colIndexStart + 1; x <= colIndexEnd; x++) {
            row.push({x: x, y: y});
          }
          this.drawline.selectedGrid.push(row);
        }
        this.drawline.drawing = false;
        // console.log('this.drawline.selectedGrid:');
        // console.log(this.drawline.selectedGrid);
        //根据操作类型生成座位格子
        this.drawSeatCell();
        this.countSeat = this.countSeatEvent(this.seatCellGrid)
      },
      //重置画线区域
      resetDrawline() {
        this.drawline.left = 0;
        this.drawline.top = 0;
        this.drawline.srcLeft = 0;
        this.drawline.srcTop = 0;
        this.drawline.width = 0;
        this.drawline.height = 0;
        this.drawline.drawing = false;
        this.drawline.selectedGrid = [];
      },
      //根据操作类型进行处理座位数据
      drawSeatCell() {
        switch (this.actionType) {
          case 0:
            break;
          case 1:
            // 普通单座
            this.addSeat(1);
            break;
          case 2:
            // 双人座
            this.addSeat(2);
            break;
          case 3:
            // 三人座
            this.addSeat(3);
            break;
          case 4:
            // 残疾人座
            this.addSeat(1);
            break;
          case 5:
            // 按摩椅座
            this.addSeat(1);
            break;
          case 6:
            // 儿童座
            this.addSeat(1);
            break;
          case 7:
            // 坏座/解除
            this.editSeat();
            break;  
          case 8:
            // 删除选中座
            this.delSeat();
            break;
          case 9:
            // 合并选中座
            this.mergeSeat();
            break;
          case 10:
            // 框选销售区域
            this.drawSaleEvent();
            break;
          case 11:
            // 删除框选销售区域
            this.deldrawSaleEvent();
            break;
          case 12:
            // 画等级
            this.drawGrade();
            break;
          default:
            break;
        }
        //根据第三层座位，生成行号、列号
        // debugger
        this.generateRowColNum();
      },
      //添加座位
      addSeat(seatLength) {
        if (this.drawline.selectedGrid == null || this.drawline.selectedGrid.length <= 0) {
          return;
        }
        for (let i = 0; i < this.drawline.selectedGrid.length; i++) {
          let selectedRow = this.drawline.selectedGrid[i];
          for (let j = 0; j < selectedRow.length; j++) {
            let selectedCol = selectedRow[j];
            let seatGroupArray = [];
            for(let m = 0; m < seatLength; m++){
              //由于座位单元格数据与坐标XY是相反的，所以取数据时传XY值要相反
              let curSeatCell = this.seatCellGrid[selectedCol.y][selectedCol.x + m];
              if($.isEmptyObject(curSeatCell) || $.isNumeric(curSeatCell.row)){
                break;
              }
              seatGroupArray.push($.extend({}, selectedCol));
            }
            if(seatGroupArray.length == seatLength){
              this.addSeatGroup(seatGroupArray);
              j = j + seatLength - 1;
            }
          }
        }
      },
      // 添加座位组
      addSeatGroup(selectedRow){
        if(!$.isArray(selectedRow) || selectedRow.length <= 0){
          return;
        }
        //每个分组座位的分组编码是一样的
        let $sgCode = ++this.sgCode;
        //渲染单人座位图标
        if(selectedRow.length == 1){
          let selectedCell = selectedRow[0];
          let curSeatCell = this.seatCellGrid[selectedCell.y][selectedCell.x];
          curSeatCell.status = 1;
          curSeatCell.sgCode = $sgCode;
          curSeatCell.seatLevel = this.seatlevActive;
          curSeatCell.color = this.commonBgColor;
          curSeatCell.regionUid = this.commonBgRegionUid;
          switch (this.actionType) {
            case 1:// 普通单座
              curSeatCell.seatType = 0;
              curSeatCell.imageType = 1;
              break;
            case 4:// 残疾人座
              curSeatCell.seatType = 3;
              curSeatCell.imageType = 7;
              break;
            case 5:// 按摩椅座
              curSeatCell.seatType = 4;
              curSeatCell.imageType = 9;
              break;
            case 6:// 儿童座
              curSeatCell.seatType = 5;
              curSeatCell.imageType = 8;
              break;
            default:
              break;
          }
        }
        //渲染情侣座位图标
        else if(selectedRow.length == 2){
          //情侣座左边座位
          let selectedCell = selectedRow[0];
          //由于座位单元格数据与坐标XY是相反的，所以取数据时传XY值要相反
          let seatCellLeft = this.seatCellGrid[selectedCell.y][selectedCell.x];
          seatCellLeft.seatType = 1;
          seatCellLeft.status = 1;
          seatCellLeft.sgCode = $sgCode;
          seatCellLeft.imageType = 2;
          seatCellLeft.seatLevel = this.seatlevActive;
          seatCellLeft.color = this.commonBgColor;
          seatCellLeft.regionUid = this.commonBgRegionUid;

          //情侣座右边座位
          //由于座位单元格数据与坐标XY是相反的，所以取数据时传XY值要相反
          let seatCellRight = this.seatCellGrid[selectedCell.y][selectedCell.x + 1];
          seatCellRight.seatType = 1;
          seatCellRight.status = 1;
          seatCellRight.sgCode = $sgCode;
          seatCellRight.imageType = 3;
          seatCellRight.seatLevel = this.seatlevActive;
          seatCellRight.color = this.commonBgColor;
          seatCellRight.regionUid = this.commonBgRegionUid;

        }
        //渲染多人座位图标
        else{
          let selectedCell = selectedRow[0];
          for(let j = 0; j < selectedRow.length; j++){
            //由于座位单元格数据与坐标XY是相反的，所以取数据时传XY值要相反
            let curSeatCell = this.seatCellGrid[selectedCell.y][selectedCell.x + j];
            curSeatCell.status = 1;
            curSeatCell.seatType = 2;
            curSeatCell.sgCode = $sgCode;
            curSeatCell.seatLevel = this.seatlevActive;
            curSeatCell.color = this.commonBgColor;
            curSeatCell.regionUid = this.commonBgRegionUid;

            if(j == 0){//左边座位
              curSeatCell.imageType = 4;
            }else if(j == selectedRow.length - 1){//右边座位
              curSeatCell.imageType = 6;
            }else{//中间座位
              curSeatCell.imageType = 5;
            }
          }
        }

        this.$nextTick( _ => {
          this.$refs.setRegionPlan.asyncRegionSeatCount()
        })
      },
      //修改座位
      editSeat(){
        if (this.drawline.selectedGrid == null || this.drawline.selectedGrid.length <= 0) {
          return;
        }
        let notEditableArray = [];
        for (let i = 0; i < this.drawline.selectedGrid.length; i++) {
          let selectedRow = this.drawline.selectedGrid[i];
          for (let j = 0; j < selectedRow.length; j++) {
            //由于存在分组数据，所以当多个座位时，要判断当前选择的单元格是否已经存在
            let selectedExist = false, selectedCol = selectedRow[j];
            for(let i = 0; i < notEditableArray.length; i++){
              if(notEditableArray[i].x == selectedCol.x && notEditableArray[i].y == selectedCol.y){
                selectedExist = true;
                break;
              }
            }
            if(selectedExist){
              continue;
            }

            //由于座位单元格数据与坐标XY是相反的，所以取数据时传XY值要相反
            let curSeatCell = this.seatCellGrid[selectedCol.y][selectedCol.x];
            if($.isEmptyObject(curSeatCell) || !$.isNumeric(curSeatCell.row)){
              break;
            }
            let seatGroupArray = [$.extend({}, selectedCol)];
            for(let m = selectedCol.x - 1; m > this.messageCol; m--){
              //由于座位单元格数据与坐标XY是相反的，所以取数据时传XY值要相反
              let leftSeatCell = this.seatCellGrid[selectedCol.y][m];
              if($.isEmptyObject(leftSeatCell)
                  || !$.isNumeric(leftSeatCell.row)
                  || leftSeatCell.sgCode != curSeatCell.sgCode){
                break;
              }
              seatGroupArray.unshift($.extend({}, {'x': m, 'y': selectedCol.y}));
            }
            for(let m = selectedCol.x + 1; m < this.maxcolsize; m++){
              //由于座位单元格数据与坐标XY是相反的，所以取数据时传XY值要相反
              let rightSeatCell = this.seatCellGrid[selectedCol.y][m];
              if($.isEmptyObject(rightSeatCell)
                || !$.isNumeric(rightSeatCell.row)
                || rightSeatCell.sgCode != curSeatCell.sgCode){
                break;
              }
              seatGroupArray.push($.extend({}, {'x': m, 'y': selectedCol.y}));
            }
            if(seatGroupArray.length > 0){
              this.editSeatGroup(seatGroupArray);
              notEditableArray = notEditableArray.concat(seatGroupArray);
            }
          }
        }
      },
      editSeatGroup(selectedRow){
        if(!$.isArray(selectedRow) || selectedRow.length <= 0){
          return;
        }
        //console.log('selectedRow:');
        //console.log([].concat(selectedRow));
        //渲染单人座位图标
        if(selectedRow.length == 1){
          let selectedCell = selectedRow[0];
          //由于座位单元格数据与坐标XY是相反的，所以取数据时传XY值要相反
          let curSeatCell = this.seatCellGrid[selectedCell.y][selectedCell.x];
          //设置编辑座位组状态，如果原状态是有效则设置为无效，如果是无效则设置为有效
          if(curSeatCell.status == 1){
            curSeatCell.status = 0;
            curSeatCell.imageType = 10;
          }else{
            curSeatCell.status = 1;
            switch (curSeatCell.seatType) {
              case 0:// 普通单座
                curSeatCell.imageType = 1;
                break;
              case 3:// 残疾人座
                curSeatCell.imageType = 7;
                break;
              case 4:// 按摩椅座
                curSeatCell.imageType = 9;
                break;
              case 5:// 儿童座
                curSeatCell.imageType = 8;
                break;
              default:
                break;
            }
          }
        }
        //渲染情侣座位图标
        else if(selectedRow.length == 2){
          let selectedCell = selectedRow[0];
          //由于座位单元格数据与坐标XY是相反的，所以取数据时传XY值要相反
          let seatCellLeft = this.seatCellGrid[selectedCell.y][selectedCell.x];
          //设置编辑座位组状态，如果原状态是有效则设置为无效，如果是无效则设置为有效
          if(seatCellLeft.status == 1){
            seatCellLeft.status = 0;
            seatCellLeft.imageType = 11;
          }else{
            seatCellLeft.status = 1;
            seatCellLeft.imageType = 2;
          }

          let seatCellRight = this.seatCellGrid[selectedCell.y][selectedCell.x + 1];
          //设置编辑座位组状态，如果原状态是有效则设置为无效，如果是无效则设置为有效
          if(seatCellRight.status == 1){
            seatCellRight.status = 0;
            seatCellRight.imageType = 12;
          }else{
            seatCellRight.status = 1;
            seatCellRight.imageType = 3;
          }
        }
        //渲染多人座位图标
        else{
          for(let j = 0; j < selectedRow.length; j++){
            let selectedCell = selectedRow[j];
            //由于座位单元格数据与坐标XY是相反的，所以取数据时传XY值要相反
            let curSeatCell = this.seatCellGrid[selectedCell.y][selectedCell.x];
            //设置编辑座位组状态，如果原状态是有效则设置为无效，如果是无效则设置为有效
            if(curSeatCell.status == 1){
              curSeatCell.status = 0;
              if(j == 0){
                curSeatCell.imageType = 13;
              }else if(j == selectedRow.length - 1){
                curSeatCell.imageType = 15;
              }else{
                curSeatCell.imageType = 14;
              }
            }else{
              curSeatCell.status = 1;
              if(j == 0){
                curSeatCell.imageType = 4;
              }else if(j == selectedRow.length - 1){
                curSeatCell.imageType = 6;
              }else{
                curSeatCell.imageType = 5;
              }
            }
          }
        }
      },
      // 框选销售区域
      drawSaleEvent(){
        if (this.drawline.selectedGrid == null || this.drawline.selectedGrid.length <= 0) {
          return;
        }
        for (let i = 0; i < this.seatAreaGrid.length; i++) {
          let selectedRow = this.drawline.selectedGrid[i];
          if (selectedRow == null || selectedRow.length <= 0) {
            break;
          }
          for (let j = 0; j < selectedRow.length; j++) {
            let selectedCol = selectedRow[j];
            if(selectedCol.x < 0 || selectedCol.y < 0 ){
              
            }else{
              var cell = this.seatAreaGrid[selectedCol.y][selectedCol.x];
              var seatCellGridcell = this.seatCellGrid[selectedCol.y][selectedCol.x];
              if(seatCellGridcell.exist == 1){
                cell.color = this.drawBgColor
                seatCellGridcell.regionUid = this.drawBgRegionUid

                //由于座位单元格数据与坐标XY是相反的，所以取数据时传XY值要相反
                // let curSeatCell = this.seatCellGrid[selectedCol.y][selectedCol.x];
                // if($.isEmptyObject(curSeatCell) || !$.isNumeric(curSeatCell.row)){
                //   break;
                // }
                // let seatGroupArray = [$.extend({}, selectedCol)];
                // for(let m = selectedCol.x - 1; m > this.messageCol; m--){
                //   //由于座位单元格数据与坐标XY是相反的，所以取数据时传XY值要相反
                //   let leftSeatCell = this.seatCellGrid[selectedCol.y][m];
                //   if($.isEmptyObject(leftSeatCell)
                //           || !$.isNumeric(leftSeatCell.row)
                //           || leftSeatCell.sgCode != curSeatCell.sgCode){
                //     break;
                //   }
                //   seatGroupArray.unshift($.extend({}, {'x': m, 'y': selectedCol.y}));
                // }
                // for(let m = selectedCol.x + 1; m < this.maxcolsize; m++){
                //   //由于座位单元格数据与坐标XY是相反的，所以取数据时传XY值要相反
                //   let rightSeatCell = this.seatCellGrid[selectedCol.y][m];
                //   if($.isEmptyObject(rightSeatCell)
                //           || !$.isNumeric(rightSeatCell.row)
                //           || rightSeatCell.sgCode != curSeatCell.sgCode){
                //     break;
                //   }
                //   seatGroupArray.push($.extend({}, {'x': m, 'y': selectedCol.y}));
                // }
                //
                // console.log(seatGroupArray, 'seatGroupArrayseatGroupArrayseatGroupArray')

                switch (seatCellGridcell.imageType) {
                  case 2: // 情侣座左
                  case 11: // 坏情侣左座
                    this.seatAreaGrid[selectedCol.y][selectedCol.x + 1].color = this.drawBgColor
                    this.seatCellGrid[selectedCol.y][selectedCol.x + 1].regionUid = this.drawBgRegionUid
                    break
                  case 3: // 情侣座右
                  case 12: // 坏情侣右座
                    this.seatAreaGrid[selectedCol.y][selectedCol.x - 1].color = this.drawBgColor
                    this.seatCellGrid[selectedCol.y][selectedCol.x - 1].regionUid = this.drawBgRegionUid
                    break
                  case 4: // 多人座左
                  case 13: // 坏多人左座
                    this.seatAreaGrid[selectedCol.y][selectedCol.x + 1].color = this.drawBgColor
                    this.seatCellGrid[selectedCol.y][selectedCol.x + 1].regionUid = this.drawBgRegionUid
                    this.seatAreaGrid[selectedCol.y][selectedCol.x + 2].color = this.drawBgColor
                    this.seatCellGrid[selectedCol.y][selectedCol.x + 2].regionUid = this.drawBgRegionUid
                    break
                  case 5: // 多人座中
                  case 14: // 坏多人中座
                    this.seatAreaGrid[selectedCol.y][selectedCol.x - 1].color = this.drawBgColor
                    this.seatCellGrid[selectedCol.y][selectedCol.x - 1].regionUid = this.drawBgRegionUid
                    this.seatAreaGrid[selectedCol.y][selectedCol.x + 1].color = this.drawBgColor
                    this.seatCellGrid[selectedCol.y][selectedCol.x + 1].regionUid = this.drawBgRegionUid
                    break
                  case 6: // 多人座右
                  case 15: // 坏多人右座
                    this.seatAreaGrid[selectedCol.y][selectedCol.x - 2].color = this.drawBgColor
                    this.seatCellGrid[selectedCol.y][selectedCol.x - 2].regionUid = this.drawBgRegionUid
                    this.seatAreaGrid[selectedCol.y][selectedCol.x - 1].color = this.drawBgColor
                    this.seatCellGrid[selectedCol.y][selectedCol.x - 1].regionUid = this.drawBgRegionUid
                    break

                }

              }
            }
          }
        }

        this.$refs.setRegionPlan.asyncRegionSeatCount()

      },
      // 删除框选销售区域
      deldrawSaleEvent(){
        // this.selectDelSaleActive == true
        if (this.drawline.selectedGrid == null || this.drawline.selectedGrid.length <= 0) {
          return;
        }
        for (let i = 0; i < this.seatAreaGrid.length; i++) {
          let selectedRow = this.drawline.selectedGrid[i];
          if (selectedRow == null || selectedRow.length <= 0) {
            break;
          }
          for (let j = 0; j < selectedRow.length; j++) {
            let selectedCol = selectedRow[j];
            if(selectedCol.x < 0 || selectedCol.y < 0 ){
              
            }else{
              let cell = this.seatAreaGrid[selectedCol.y][selectedCol.x];
              let seatCellGridcell = this.seatCellGrid[selectedCol.y][selectedCol.x];
              cell.row = '';
              cell.col = '';

              if(seatCellGridcell.exist == 1) {
                  cell.color = this.commonBgColor;
                  seatCellGridcell.regionUid = this.commonBgRegionUid;
              }else {
                  cell.color = '';
                  seatCellGridcell.regionUid = '';
              }
              switch (seatCellGridcell.imageType) {
                case 2: // 情侣座左
                case 11: // 坏情侣左座
                  this.seatAreaGrid[selectedCol.y][selectedCol.x + 1].color = this.commonBgColor
                  this.seatCellGrid[selectedCol.y][selectedCol.x + 1].regionUid = this.commonBgRegionUid
                  break
                case 3: // 情侣座右
                case 12: // 坏情侣右座
                  this.seatAreaGrid[selectedCol.y][selectedCol.x - 1].color = this.commonBgColor
                  this.seatCellGrid[selectedCol.y][selectedCol.x - 1].regionUid = this.commonBgRegionUid
                  break
                case 4: // 多人座左
                case 13: // 坏多人左座
                  this.seatAreaGrid[selectedCol.y][selectedCol.x + 1].color = this.commonBgColor
                  this.seatCellGrid[selectedCol.y][selectedCol.x + 1].regionUid = this.commonBgRegionUid
                  this.seatAreaGrid[selectedCol.y][selectedCol.x + 2].color = this.commonBgColor
                  this.seatCellGrid[selectedCol.y][selectedCol.x + 2].regionUid = this.commonBgRegionUid
                  break
                case 5: // 多人座中
                case 14: // 坏多人中座
                  this.seatAreaGrid[selectedCol.y][selectedCol.x - 1].color = this.commonBgColor
                  this.seatCellGrid[selectedCol.y][selectedCol.x - 1].regionUid = this.commonBgRegionUid
                  this.seatAreaGrid[selectedCol.y][selectedCol.x + 1].color = this.commonBgColor
                  this.seatCellGrid[selectedCol.y][selectedCol.x + 1].regionUid = this.commonBgRegionUid
                  break
                case 6: // 多人座右
                case 15: // 坏多人右座
                  this.seatAreaGrid[selectedCol.y][selectedCol.x - 2].color = this.commonBgColor
                  this.seatCellGrid[selectedCol.y][selectedCol.x - 2].regionUid = this.commonBgRegionUid
                  this.seatAreaGrid[selectedCol.y][selectedCol.x - 1].color = this.commonBgColor
                  this.seatCellGrid[selectedCol.y][selectedCol.x - 1].regionUid = this.commonBgRegionUid
                  break

              }
            }
          }
        }
        this.$refs.setRegionPlan.asyncRegionSeatCount()

      },
      //删除座位
      delSeat() {
        // debugger
        if (this.drawline.selectedGrid == null || this.drawline.selectedGrid.length <= 0) {
          return;
        }
        for (let i = 0; i < this.drawline.selectedGrid.length; i++) {
          let selectedRow = this.drawline.selectedGrid[i];
          if (selectedRow == null || selectedRow.length <= 0) {
            break;
          }
          for (let j = 0; j < selectedRow.length; j++) {
            let selectedCol = selectedRow[j];
            if(selectedCol.x < 0 || selectedCol.y < 0 ){
              
            }else{
              //由于座位单元格数据与坐标XY是相反的，所以取数据时传XY值要相反
              let cell = this.seatCellGrid[selectedCol.y][selectedCol.x];
              let ff = this.seatCellGrid[selectedCol.y]
              ff.forEach(function(val){
                if(val.sgCode == cell.sgCode){
                    val.imageType = 0;
                    val.row = '';
                    val.rowAlias = '';
                    val.col = '';
                    val.colAlias = '';
                    val.seatType = '';
                    val.status = '';
                    val.exist = 0
                    cell.seatLevel = ""

                    val.color = ''
                    val.regionUid = ''
                }
              })
              cell.imageType = 0;
              cell.row = '';
              cell.rowAlias = '';
              cell.col = '';
              cell.colAlias = '';
              cell.seatType = '';
              cell.status = '';
              cell.exist = 0
              cell.sgCode = null
              cell.seatLevel = ""

              cell.color = ''
              cell.regionUid = ''
            }
          }
        }

        this.$nextTick( _ => {
          this.$refs.setRegionPlan.asyncRegionSeatCount()
        })
      },
      //合并座位
      mergeSeat() {
        if (this.drawline.selectedGrid == null || this.drawline.selectedGrid.length <= 0) {
          return;
        }

        for (let i = 0; i < this.drawline.selectedGrid.length; i++) {
          let selectedRow = this.drawline.selectedGrid[i];
          if (selectedRow == null || selectedRow.length <= 0) {
            break;
          }
          var cellCunArr = []
          var multiGroupArr = [];
          for (let j = 0; j < selectedRow.length; j++) {
            let selectedCol = selectedRow[j];
            if(selectedCol.x < 0 || selectedCol.y < 0 ){
              
            }else{
              // debugger
              var cell = this.seatCellGrid[selectedCol.y][selectedCol.x];
              var currentSgCode = cell.sgCode
              if($.isEmptyObject(cell) || !$.isNumeric(cell.row)){
                if (cellCunArr.length > 0){
                  multiGroupArr.push(cellCunArr);
                  cellCunArr = [];
                }
                continue;
              }
              cellCunArr.push(cell);
              
              for(let q = 0, totalLen = this.seatCellGrid.length; q < totalLen; q++) {
                let itemRow = this.seatCellGrid[q]
                for (let p = 0, rowLen = itemRow.length; p < rowLen; p ++) {
                  let cell = itemRow[p]
                  if(currentSgCode == cell.sgCode) {
                    multiGroupArr.push([cell])
                  }
                }
              }
              /*
              var cellHCol = this.seatCellGrid[selectedCol.y]
              var cellNullObj = {}
              console.info("==========>" + cell.exist)
              if(cell.exist == 1){
                cellNullObj = cell
                cellCunArr.push(cellNullObj)
                this.seatCellGrid[selectedCol.y].forEach(function(val,index){
                   if(val.sgCode == cell.sgCode || val.toString() != cell.toString()){
                      cellNullObj = val
                      cellCunArr.push(cellNullObj)
                   }
                   if(val.toString() == cell.toString()){

                   }
                })
              }
              */
            }
          }
          // 获取到行所有的合坐位置数组
          //cellCunArr = this.arrayUnique2(cellCunArr,"ulY")
          multiGroupArr.push(cellCunArr);
          for (var k = 0 ; k < multiGroupArr.length ; k++){
            cellCunArr = multiGroupArr[k];
            // cellCunArr.sort(this.compare('ulY'))
          // console.log(cellCunArr)
          var seatIdA = this.sgCode
          // 对合坐数组进行渲染
          cellCunArr.forEach(function(val,index,arr){
            if(arr.length == 1){
              val.seatType = 0;
              val.imageType = 1;
            }else if(arr.length == 2){
              val.seatType = 1;
              if(index == 0){
                val.imageType = 2
              }else{
                val.imageType = 3
              }
            }else if(arr.length == 3){
              val.seatType = 2
              if(index == 0){
                val.imageType = 4
              }else if(index == arr.length-1){
                val.imageType =6
              }else{
                val.imageType = 5
              }
            }else if(arr.length > 3){
              val.seatType = 6
              if(index == 0){
                val.imageType = 4
              }else if(index == arr.length-1){
                val.imageType =6
              }else{
                val.imageType = 5
              }
            }
            val.status = 1
            val.sgCode = seatIdA
            val.seatLevel = this.seatlevActive
          },seatIdA)
          seatIdA++
          this.sgCode = seatIdA
          }
          /*
          cellCunArr.sort(this.compare('ulY'))
          console.log(cellCunArr)
          var seatIdA = this.sgCode
          // 对合坐数组进行渲染
          cellCunArr.forEach(function(val,index,arr){
            if(arr.length == 1){
              val.seatType = 0;
              val.imageType = 1;
            }else if(arr.length == 2){
              val.seatType = 1;
              if(index == 0){
                val.imageType = 2
              }else{
                val.imageType = 3
              }
            }else if(arr.length == 3){
              val.seatType = 2
              if(index == 0){
                val.imageType = 4
              }else if(index == arr.length-1){
                val.imageType =6
              }else{
                val.imageType = 5
              }
            }else if(arr.length > 3){
              val.seatType = 6
              if(index == 0){
                val.imageType = 4
              }else if(index == arr.length-1){
                val.imageType =6
              }else{
                val.imageType = 5
              }
            }
            val.status = 1
            val.sgCode = seatIdA
            val.seatLevel = this.seatlevActive
          },seatIdA)
          seatIdA++
          this.sgCode = seatIdA
          */
        }       
      },
      // 画等级
      drawGrade(){
        if (this.drawline.selectedGrid == null || this.drawline.selectedGrid.length <= 0) {
          return;
        }
        for (let i = 0; i < this.drawline.selectedGrid.length; i++) {
          let selectedRow = this.drawline.selectedGrid[i];
          if (selectedRow == null || selectedRow.length <= 0) {
            break;
          }
          for (let j = 0; j < selectedRow.length; j++) {
            let selectedCol = selectedRow[j];
            if(selectedCol.x < 0 || selectedCol.y < 0 ){
              
            }else{
              var cell = this.seatCellGrid[selectedCol.y][selectedCol.x];
              if(cell.exist == 1){
                cell.seatLevel = this.seatlevActive
              }
            }
          }
        }

        // console.log(this.seatCellGrid)
      },
      // 根据属性去重
      arrayUnique2(arr, name) {
        var hash = {};
        return arr.reduce(function (item, next) {
          hash[next[name]] ? '' : hash[next[name]] = true && item.push(next);
          return item;
        }, []);
      },
      // 根据属性排序
      compare(property){
        return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
      },
      //根据第三层座位，生成行号、列号
      generateRowColNum() {
        let seatRowIndexArray = [];
        let seatColIndexArray = [];
        //根据最大行、列数，生成座位行号、列号数组
        this.generateSeatRowColNumArray();

        //根据根据第三层座位，把座位对应的位置行列索引添加到临时变量中，后面再统一进行生成行号、列号
        let row = 0;
        for (let i = 0; i < this.seatCellGrid.length; i++) {
          let seatcellRow = this.seatCellGrid[i];
          if (seatcellRow == null || seatcellRow.length <= 0) {
            continue;
          }
          let hasSeatRow = false;
          let col = 0;
          for (let j = 0; j < seatcellRow.length; j++) {
            let cell = seatcellRow[j];
            if (!$.isPlainObject(cell) || $.trim(cell.imageType) == 0){
              continue;
            }
            if (!hasSeatRow) {
              hasSeatRow = true;
              row += 1;
            }
            col += 1;
            cell.row = row;
            cell.col = col;
            cell.rowAlias = cell.row;
            cell.colAlias = cell.col;
            cell.exist = 1;

            //把行、列索引放入到数组变量中，然后根据行、列索引自动生成行号、列号
            if ($.inArray(cell.ulY, seatRowIndexArray) == -1) {
              seatRowIndexArray.push(cell.ulY);
            }
            if ($.inArray(cell.ulX, seatColIndexArray) == -1) {
              seatColIndexArray.push(cell.ulX);
            }
          }
        }

        if(this.turnCol) {
            for (let i = 0; i < this.seatCellGrid.length; i++) {
              let seatcellRow = this.seatCellGrid[i];
              if (seatcellRow == null || seatcellRow.length <= 0) {
                continue;
              } 
                
                let turnArr = this.turnIndex(seatcellRow, 'colAlias')
                this.seatCellGrid.splice(i, 1, turnArr)

                let colturnArr = this.turnIndex(seatcellRow, 'col')
                this.seatCellGrid.splice(i, 1, colturnArr)
            }
          }

        //根据行索引自动生成行号
        row = 0;
        for (let rowIndex of seatRowIndexArray) {
          row += 1;
          this.seatRowNumArray[rowIndex].row = row;
        }

        if(this.turnRow) {
            let tempSeatRows = this.seatRowNumArray
            this.seatRowNumArray = []
            this.seatRowNumArray = this.turnIndex(tempSeatRows, 'row')
        }

        //根据列索引自动生成列号，由于列索引可能是不连续的，必须进行排序后才能设置列号
        seatColIndexArray.sort(function (a, b) {
          return a - b;
        });
        for (let colIndex of seatColIndexArray) {
          for(let i = 0; i < this.seatCellGrid.length; i++) {
            let seatcellRow = this.seatCellGrid[i];
              if (seatcellRow == null || seatcellRow.length <= 0) {
                continue;
              } 
               for(let j = 0; j < seatcellRow.length; j++) {
                 let seat = seatcellRow[j]
                 if (seat.colAlias && seat.colAlias > 0) {
                    if(colIndex == seatcellRow[j].ulX) {
                        let temp = this.seatColNumArray[colIndex].col
                        if(temp > seatcellRow[j].colAlias) continue;
                        this.seatColNumArray[colIndex].col = seatcellRow[j].colAlias;
                    }
                  }else {
                    continue;
                  }
                 
               }
          }
        }


        // if(this.turnedArr.length) {
        //   this.turnedArr.forEach((item, index, arr) => {
        //     this.seatColNumArray.forEach((seatCol, colIndex, rowArr) => {
        //       let currentvalue = item.colAlias
        //       if(this.turnCol) {
        //           for(let i = item.index; i > 0; i--) {
        //             if(rowArr[i].col) {
        //               rowArr[i].col = currentvalue++
        //             }
        //           }
        //         }else {
        //           for(let i = item.index; i < rowArr.length; i++) {
        //             if(rowArr[i].col) {
        //             rowArr[i].col = currentvalue++
        //             }
        //           }
        //         }
        //     })
        //   })
        // }
      },
      /**
       * 最大行数改变事件处理，将重新初始化座位数据
       */
      maxrowsizeChangeHandler() {
        let maxRow = this.findCurrentSeatsMaxRowCol().row
        if(typeof(this.maxrowsize) == "string" && parseInt(this.maxrowsize) >= 1 && parseInt(this.maxrowsize) !=NaN){
          this.maxrowsize = Number(this.maxrowsize);
          let boolean = (new RegExp(/^\+?[1-9]\d*$/).test(this.maxrowsize)) && (this.maxrowsize > maxRow)
          if(!boolean){
            this.maxrowsize = Number(this.kktest);
            this.$message({
              message: '请输入大于当前行数的整数',
              type: 'warning'
            })
          }
        }
          this.generateSeatData();
          let uu = this.seatCellGrid
          this.addSeatprototype(uu)
      },
      /**
       * 最大列数改变事件处理，将重新初始化座位数据
       */
      maxcolsizeChangeHandler() {
        let maxCol = this.findCurrentSeatsMaxRowCol().col
        // console.log(this.seatColNumArray.length)
        if(typeof(this.maxcolsize) == "string" && parseInt(this.maxcolsize) >= 1 && parseInt(this.maxrowsize) !=NaN){
          this.maxcolsize = Number(this.maxcolsize);
          let boolean = (new RegExp(/^\+?[1-9]\d*$/).test(this.maxcolsize)) && (this.maxcolsize > maxCol)
          if(!boolean){
            this.maxcolsize = Number(this.kktest);
            this.$message({
              message: '请输入大于当前列数的整数',
              type: 'warning'
            })
          }
        }
        this.generateSeatData();
        let uu = this.seatCellGrid
        this.addSeatprototype(uu)
      },
      // 给座位调价属性
      addSeatprototype(i){
        i.forEach(function(val){
          val.forEach(function(val){
            if(!val.hasOwnProperty("exist")){
              val.exist = 0
            }
            if(!val.hasOwnProperty("imageType")){
              val.imageType = 0
            }
          })
        })
      },
      /**
       * 鼠标Mousedown事件监听处理，画框线记录当前位置，并标记为正在画框
       * @param event
       */
      seatMousedownHandler(event) {
        console.log('seatMousedownHandler...');
        console.log(event);
        if (event.clientX < this.minClientX
          || event.clientY < this.minClientY) {
          return;
        }
        this.drawline.drawing = true;
        this.drawline.left = event.clientX;
        this.drawline.top = event.clientY;
        this.drawline.srcLeft = event.clientX;
        this.drawline.srcTop = event.clientY;
        this.drawline.width = 0;
        this.drawline.height = 0;
        this.drawline.selectedGrid = [];
        //console.log($.extend({}, this.drawline));
      },
      /**
       * 鼠标Mouseup、Mouseleave事件监听处理，画框线标记为画框结束，并计算画框对应的座位
       * @param event
       */
      seatMouseupHandler(event) {
        // console.log('seatMouseupHandler...');
        //console.log(event);
        if (!this.drawline.drawing) {
          return;
        }
        this.drawline.drawing = false;
        this.calculateDrawlineSeatCell();
      },
      /**
       * 鼠标Mousemove事件监听处理，根据鼠标移动位置，改变画框线的位置及大小
       * @param event
       */
      seatMousemoveHandler(event) {
        //console.log('seatMousemoveHandler...');
        //console.log(event);
        if (!this.drawline.drawing) {
          return;
        }
        this.drawline.width = Math.abs(event.clientX - this.drawline.srcLeft);
        this.drawline.height = Math.abs(event.clientY - this.drawline.srcTop);
        //从左上往右下画框，左上角原点坐标不变
        if (event.clientX > this.drawline.srcLeft && event.clientY > this.drawline.srcTop) {
        }
        //从左下往右上画框，左上角原点坐标往上移动
        else if (event.clientX > this.drawline.srcLeft && event.clientY < this.drawline.srcTop) {
          this.drawline.top = this.drawline.srcTop - this.drawline.height;
        }
        //从右上往左下画框，左上角原点坐标往左移动
        else if (event.clientX < this.drawline.srcLeft && event.clientY > this.drawline.srcTop) {
          this.drawline.left = this.drawline.srcLeft - this.drawline.width;
        }
        //从右下往左上画框，左上角原点坐标往左上移动
        else if (event.clientX < this.drawline.srcLeft && event.clientY < this.drawline.srcTop) {
          this.drawline.top = this.drawline.srcTop - this.drawline.height;
          this.drawline.left = this.drawline.srcLeft - this.drawline.width;
        }
        // console.log(this.drawline);
      },
      /**
       * 查询当前影厅座位图
       */
      queryHallSeat(){

      },
      // 根据对应的imageType类型对应的座位图图标
      getIcon(i){
        switch(i){
          case 0:
            // 没有座位
            return "";
            break;
          case 1:
            // 单座
            return "iconfont-seaticon-single-normal";
            break;
          case 2:
            // 情侣座左
            return "iconfont-seaticon-single-DoubleLeft";
            break;
          case 3:
            // 情侣座右
            return "iconfont-seaticon-single-DoubleRight";
            break;
          case 4:
            // 多人座左
            return "iconfont-seaticon-single-ThreeLeft";
            break;
          case 5:
          // 多人座中
            return "iconfont-seaticon-single-ThreeCenter";
            break;
          case 6:
          // 多人座右
            return "iconfont-seaticon-single-ThreeRight";
            break;
          case 7:
          // 残疾人座
            return "iconfont-seaticon-single-Handicapped";
            break;
          case 8:
          // 儿童座
            return "iconfont-seaticon-single-Children";
            break;
          case 9:
          // 按摩椅座
            return "iconfont-seaticon-single-message";
            break;
          case 10:
          // 坏座单座
            return "iconfont-seaticon-single-BadSeat";
            break;
          case 11:
          // 坏情侣左座
            return "iconfont-seaticon-single-badDoubleLeft";
            break;
           case 12: 
          // 坏情侣右座
            return "iconfont-seaticon-single-badDoubleRight";
            break;
          case 13:
          // 坏多人左座
            return "iconfont-seaticon-single-badThreeLeft";
            break;
          case 14:
          // 坏多人中座
            return "iconfont-seaticon-single-badThreeCenter";
            break;
          case 15:
          // 坏多人右座
            return "iconfont-seaticon-single-badThreeRight";
            break;
          default:
            break;  

        }
      },
      // 座位等级点击事件
      seatlevEvent(i){
        this.seatlevActive = i
        this.seatlevClickActive = true
        this.delActiveType()
        this.actionType = 12
      },
      // 座位等级更多点击事件
      seatlevEventMore(){
        this.seatlevActive = "more";
        this.seatlevMore = !this.seatlevMore;
        this.seatlevClickActive = true
        this.delActiveType()
      },
      seatlevmoreLiBtn(i){
        this.seatlevActive = i+6
        this.seatlevMore = !this.seatlevMore;
        this.seatlevClickActive = true
        this.delActiveType()
        this.actionType = 12
      },
      // 留白区域列渲染
      lbGetcolArr(i){
        for(let k = 0;k<i;k++){
          let c = k
          this.messagecolArr.push(c)
        }
      },
      // 留白区域行渲染
      lbGetrowArr(i){
        for(let k = 0;k<i;k++){
          let c = k
          // debugger
          this.messagerowArr.push(c)
        }
      },
      messageRowChangeHandler(){
        this.messagerowArr = []
        if(typeof(this.messageRow) == "string" && parseInt(this.messageRow) >= 1 && parseInt(this.messageRow) !=NaN){
          this.messageRow = this.messageRow
          let boolean = new RegExp(/^\+?[1-9]\d*$/).test(this.messageRow)
          if(!boolean){
            this.messageRow = Number(this.kktest);
            this.$message({
              message: '请输入大于1整数',
              type: 'warning'
            })
          }
        }else{
          this.messageRow = this.kktest;
          this.$message({
            message: '留白行输入大于等于1的整数',
            type: 'warning'
          });
        }
        this.lbGetrowArr(this.messageRow)
        this.generateSeatData()
      },
      messageColChangeHandler(){
        this.messagecolArr = []
        if(typeof(this.messageCol) == "string" && parseInt(this.messageCol) >= 2 && parseInt(this.messageCol) !=NaN){
          // debugger
          this.messageCol = this.messageCol
          let boolean = new RegExp(/^\+?[1-9]\d*$/).test(this.messageCol)
          if(!boolean){
            this.messageCol = Number(this.kktest);
            this.$message({
              message: '请输入大于2整数',
              type: 'warning'
            })
          }
        }else{
          // debugger
          this.messageCol = this.kktest;
          this.$message({
            message: '留白列输入大于等于2的整数',
            type: 'warning'
          });
        }
        this.lbGetcolArr(this.messageCol)
        this.generateSeatData()
      },
      noEditEvent(){
        this.$confirm('是否放弃编辑', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path:'/ticket/cinema/edit',
            query:{
              uid:this.$route.query.cinemaUid
            }
          })
        }).catch(() => {
        
        });

      },
      // 编辑座位号
      editSeatBtn(){
        this.eaitDisabled = !this.eaitDisabled
      },
      getColVal(value, index){
        this.nowColValIndex = index
        this.nowColVal = value
      },
      getRowVal(value){
        this.nowRowVal = value
      },
      colChange(value){
        console.log("哈哈")
        console.log(value)
        let ActiveVal = this.nowColVal
        this.seatCellGrid.forEach((row,index)=>{
          row.forEach((val,index,arr)=>{
            if(val.colAlias ==  ActiveVal){
              val.colAlias = value
              if(this.turnCol) {
                let currentvalue = value
                for(let i = index; i >= 0; i--) {
                  if(arr[i].colAlias) {
                    arr[i].colAlias = currentvalue++
                    arr[i].col = arr[i].colAlias
                  }
                }
              }else {
                let currentvalue = value
                for(let i = index; i < arr.length; i++) {
                  if(arr[i].colAlias) {
                   arr[i].colAlias = currentvalue++
                   arr[i].col = arr[i].colAlias
                  }
                }
              }
            }
          })
        })
        //将替换的列存在数组中，相同就替换，不同就添加
        let obj = {
          index: this.nowColValIndex,
          colAlias: value
        }

        this.turnedArr.unshift(obj)

        if(this.turnedArr.length) {
            let obj = {};
            this.turnedArr = this.turnedArr.reduce((setArr, next) => {
                obj[next.index] ? "" : obj[next.index] = true && setArr.push(next);
                return setArr;
            }, [])
          }
        
        this.seatColNumArray.forEach((seatCol, colIndex, rowArr) => {
           let currentvalue = value
           if(this.turnCol) {
              for(let i = this.nowColValIndex; i > 0; i--) {
                if(rowArr[i].col) {
                  rowArr[i].col = currentvalue++
                }
              }
            }else {
              for(let i = this.nowColValIndex; i < rowArr.length; i++) {
                if(rowArr[i].col) {
                rowArr[i].col = currentvalue++
                }
              }
            }
        })

        // console.log(this.turnedArr)
      },
      rowChange(value){
        let ActiveVal = this.nowRowVal
        this.seatCellGrid.forEach((val,index)=>{
          val.forEach((val,index,arr)=>{
            if(val.row ==  ActiveVal){
              val.row = value
            }
          })
        })
      },
      findCurrentSeatsMaxRowCol() {
        let seatList = this.getSaveSeatArray()
        let seatsMaxRowCol = {row: 2, col: 2}
        let ulXs = []
        let ulYs = []
        if(seatList.length) {
          seatList.forEach(item => {
             ulXs.push(item.ulX)
             ulYs.push(item.ulY)
          })
          seatsMaxRowCol.col = Math.max.apply(null, ulXs) + 1;
          seatsMaxRowCol.row = Math.max.apply(null, ulYs) + 1;
        }
        console.log(seatsMaxRowCol)
        return seatsMaxRowCol;
      },
      //
      getSaveSeatArray(){
        let tempArray = [];
        this.seatCellGrid.forEach((rowData,index)=>{
          rowData.forEach((cellData,index,arr)=>{
            if(cellData.row > 0 && cellData.col > 0){
              tempArray.push($.extend({}, cellData));
            }
          });
        });
        return tempArray;
      },
      // 完成编辑保存
      yesEditEvent(){
        if(!this.getSaveSeatArray().length) {
          return this.$confirm("暂无座位添加，是否关闭？", "提示", {
            confirmButtonText: '关闭页面',
            cancelButtonText: '继续编辑',
            type: 'warning'
          }).then(() => {
            this.$router.push({
              path:'/ticket/cinema/edit',
              query:{
                uid:this.$route.query.cinemaUid
              }
            })
          })
        }
        this.$confirm('完成编辑', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let data = {
            hallUid:this.$route.query.hallUid,
            hallName: this.hallName,
            cinemaUid:this.$route.query.cinemaUid,
            hallBlankAreaX:this.messageRow,
            hallBlankAreaY:this.messageCol,
            hallSeatX:this.maxrowsize,
            hallSeatY:this.maxcolsize,
            seatList:this.getSaveSeatArray(),
            regionInfoList: this.$refs.setRegionPlan.regionInfoList
          };
          this.$ctmList.ciseatSave(data).then( data => {
              if(data.code === 200) {
                this.$message.success('保存成功');
                 // 返回影厅列表
                this.$router.push({
                  path:'/ticket/cinema/edit',
                  query:{
                    uid:this.$route.query.cinemaUid
                  }
                })
              }else {
                this.$message.error(data.msg);
              }
          })
        
        }).catch(() => {
        
        });
      },
      // 获取界面最大的sgCode
      getMaxSgCode(bb){
        var aa = 0
          bb.forEach((val,index,arr)=>{
            val.forEach((val,index,arr)=>{
                if(parseInt(val.sgCode) != NaN && parseInt(val.sgCode) >= parseInt(aa)){
                    aa = val.sgCode
                }
            })
          })
        return aa
      },

      //翻转方法
      turnIndex(arr, direction) {
         let leftIndex = 0, rightIndex = arr.length - 1;
         let leftCell = null, rightCell = null;
         while(leftIndex <= rightIndex){
            if(!$.isPlainObject(leftCell)){
              leftCell = arr[leftIndex];
              if($.isEmptyObject(leftCell) || !$.isNumeric(leftCell[direction])){
                leftIndex++;
                leftCell = null;
                continue;
              }
            }

            if(!$.isPlainObject(rightCell)){
              rightCell = arr[rightIndex];
              if($.isEmptyObject(rightCell) || !$.isNumeric(rightCell[direction])){
                rightIndex--;
                rightCell = null;
                continue;
              }
            }


           let temp = arr[leftIndex][direction];
           arr[leftIndex][direction] = arr[rightIndex][direction];
           arr[rightIndex][direction] = temp;
           leftCell = null;
           rightCell = null;
           leftIndex++;
           rightIndex--;
         }

         return arr;
      },

      // 行号反转
      rowIndexBtnEvent(){
          this.turnRow = !this.turnRow
         if(this.seatCellGrid.length) {
            let tempSeatRows = this.seatRowNumArray
            this.seatRowNumArray = []
            this.seatRowNumArray = this.turnIndex(tempSeatRows, 'row')

            this.seatRowNumArray.forEach((item, index, arr) => {
              let currentRow = item.row;
              this.seatCellGrid[index].forEach((seat) => {
                seat.rowAlias = currentRow
              })
            })
         }
      },
      // 列号反转事件
      colIndexBtnEvent(){
          this.turnedArr = []
          this.turnCol = !this.turnCol
          if(this.seatCellGrid.length) {
            let tempSeatCols = this.seatColNumArray
            this.seatColNumArray = []
            this.seatColNumArray = this.turnIndex(tempSeatCols, 'col')

            for (let i = 0; i < this.seatCellGrid.length; i++) {
            let seatcellRow = this.seatCellGrid[i];
            if (seatcellRow == null || seatcellRow.length <= 0) {
              continue;
            } 
              
              let turnArr = this.turnIndex(seatcellRow, 'colAlias')
              this.seatCellGrid.splice(i, 1, turnArr)

              let colturnArr = this.turnIndex(seatcellRow, 'col')
              this.seatCellGrid.splice(i, 1, colturnArr)
          }
          }
      },
      // 根据属性排序
      sortBy: function(attr,rev){
        //第二个参数没有传递 默认升序排列
        if(rev ==  undefined){
            rev = 1;
        }else{
            rev = (rev) ? 1 : -1;
        }
        return function(a,b){
            a = a[attr];
            b = b[attr];
            if(a < b){
                return rev * -1;
            }
            if(a > b){
                return rev * 1;
            }
            return 0;
        }
      },
      // 统计栏方法、
      countSeatEvent(i){
        // console.log(i)
        let Seat = this.countSeat
        let allSeat = 0
        let commonSeat = 0
        let twoSeat = 0
        let threeSeat = 0
        let Handicapped = 0
        let childrenSeat = 0
        let Massagechair = 0
        let badSeat = 0
        i.forEach((val,index,arr) =>{
          val.forEach((val,index,arr) =>{
            if(val.exist == 1){
              allSeat++
            }
            if(val.seatType == 0 && val.status ==1){
              commonSeat++
            }
            if(val.seatType == 1 && val.status ==1){
              twoSeat++
            }
            if(val.seatType == 2 && val.status ==1){
              threeSeat++
            }
            if(val.seatType == 3 && val.status ==1){
              Handicapped++
            }
            if(val.seatType == 5 && val.status ==1){
              childrenSeat++
            }
            if(val.seatType == 4 && val.status ==1){
              Massagechair++
            }
            if(val.status == 0 && val.exist == 1){
              badSeat++
            }
          })
        })
        Seat.allSeat = allSeat
        Seat.commonSeat = commonSeat
        Seat.twoSeat = twoSeat/2
        Seat.threeSeat = threeSeat/3
        Seat.Handicapped = Handicapped
        Seat.childrenSeat = childrenSeat
        Seat.Massagechair = Massagechair
        Seat.badSeat = badSeat
        Seat.hallName= this.hallName
        allSeat = 0
        commonSeat = 0
        twoSeat = 0
        threeSeat = 0
        Handicapped = 0
        childrenSeat = 0
        Massagechair = 0
        badSeat = 0
        return Seat
      }
    },
    created: function(){
      //接收参数，并进行路由跳转设置
      // console.log(this.$route.query.cinemaUid)
      this.params = this.$route.query;
      this.linkToHallList = '/CTM/cinemawall/list?cinemaUid=' + this.params.cinemaUid;
      let data = {hallUid:this.$route.query.hallUid};
      this.$ctmList.ciseatLoad(data).then( data => {
          if (data && data.code === 200) {
            this.initHallData = data.data;
            // console.log('this.initHallData:');
            // console.log(this.initHallData);
            if(!$.isEmptyObject(this.initHallData)){
                this.maxrowsize = this.initHallData.hallSeatX;
                this.maxcolsize = this.initHallData.hallSeatY;
                this.hallName = this.initHallData.hallName;
              }
            if(!$.isEmptyObject(this.initHallData) && $.isArray(this.initHallData.seatList)){
              if(this.initHallData.seatList.length >= 2 && this.initHallData.seatList[0].col > this.initHallData.seatList[1].col) {
                this.turnCol = true;
              }
              if(this.initHallData.seatList.length >= 2 && this.initHallData.seatList[0].row > this.initHallData.seatList[1].row) {
                this.turnRow = true;
              }
              this.initHallData.seatList.forEach((cell,index,arr) => {
                //由于座位单元格数据与坐标XY是相反的，所以取数据时传XY值要相反
                this.initHallData[[parseInt(cell.ulY), parseInt(cell.ulX)].join('_')] = cell;
                
              });
            }
          } else {
            this.error(data.msg)
          }
          // console.log(this.turnCol)
          this.generateSeatData();
          }).catch( err => {
            // console.log(err,1111)
          })
    },
    // watch: {
    //    '$route'() {
    //      console.log(this.$route)
    //    }
    // },
    destroyed() {
      $('.content-wrapper').css("overflowY", "auto")
      $('.content-wrapper').css("height", "calc(100% - 34px)")
    },
    mounted() {
      this.$nextTick(() => {
        $('.content-wrapper').css("overflowY", "hidden")
        $('.content-wrapper').css("height", "auto")
      })
      this.lbGetcolArr(this.messageCol)
      this.lbGetrowArr(this.messageRow)
      // 右侧添加座位图标
      this.addSeatArr = [
        {"noChoiceIcon":"#icon-Single-seat",
        "yesChoiceIcon":"#icon-Single-seat-state",
        "name":"单座",
        "seatNumber":"1",
        "seatActive":false
        },
        {"noChoiceIcon":"#icon-Double-seat",
        "yesChoiceIcon":"#icon-Double-seat-state",
        "name":"情侣座",
        "seatNumber":"2",
        "seatActive":false
        },
        {"noChoiceIcon":"#icon-Three-seat",
        "yesChoiceIcon":"#icon-Three-seat-state",
        "name":"三人座",
        "seatNumber":"3",
        "seatActive":false
        },
        {"noChoiceIcon":"#icon-Handicapped-seat",
        "yesChoiceIcon":"#icon-Handicapped-seat-state",
        "name":"残疾人座",
        "seatNumber":"1",
        "seatActive":false
        },
        {"noChoiceIcon":"#icon-Massagechair-seat",
        "yesChoiceIcon":"#icon-Massagechair-seat-state",
        "name":"按摩椅座",
        "seatNumber":"1",
        "seatActive":false
        },
        {"noChoiceIcon":"#icon-Children-seat",
        "yesChoiceIcon":"#icon-Children-seat-state",
        "name":"儿童座",
        "seatNumber":"1",
        "seatActive":false
        },
      ],
      // 右侧编辑座位
      this.editSeatArr = [
        {"noChoiceIcon":"#icon-Bad-seat",
          "yesChoiceIcon":"#icon-Bad-seat-state",
          "name":"坏座/解除",
          "seatNumber":"1",
          "seatActive":false
          },
          {"noChoiceIcon":"#icon-Dellete-seat",
          "yesChoiceIcon":"#icon-Dellete-seat-state",
          "name":"删除选中座",
          "seatNumber":"1",
          "seatActive":false
          },
          {"noChoiceIcon":"#icon-Merge-seat",
          "yesChoiceIcon":"#icon-Merge-seat-state",
          "name":"合并/拆分",
          "seatNumber":"1",
          "seatActive":false
          }
      ],
      this.seatlevArr = [
        {num:0},
        {num:1},
        {num:2},
        {num:3},
        {num:4},
        {num:5}
      ],
      this.seatlevArrmore = [
        {num:6},
        {num:7},
        {num:8},
        {num:9}
      ],
      this.drawSaleArea = [
        {"name":"会员区",
        "fontColor":"#FF6E3C",
        "color":"#ffffff"
        },
        {"name":"活动区",
        "fontColor":"#e7f7d5",
        "color":"#BCBCBC"
        }
      ]
    }
  };
</script>
<style lang='scss'>
  $seatWidthHeight: 40px; //座位宽度高度
  $seatNonBorderWidthHeight: 41px; //没有线框的座位宽度高度
  /**整个页面样式**/
  html{
    overflow: hidden;
  }
  .seatpage {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .edit-seat .el-breadcrumb__inner{
      color: #3B74FF !important;
  }

  /**银幕样式**/
  .screen {
    height: 24px;
    background-color: #F2F4FD;
    color: #666;
    line-height: 24px;
    text-align: center;
    border-bottom-left-radius: 120px;
    border-bottom-right-radius: 120px;
  }

  .cont_router {
    background-color: #F5F5F5;
  }

  ;
  .tdseatcolheader {
    margin-left: 41px;
  }

  .section {
    height: -webkit-fill-available;
    width: 100%;
  }

  ;
  /**座位背景样式**/
  .tdseatcolheader td, .seatbackground td {
    border-left: 1px solid #FFF;
    border-top: 1px solid #FFF;
    vertical-align: middle;
    height: $seatWidthHeight;
    width: $seatWidthHeight;
  }

  ;
  .seatbackground tr:nth-child(odd) {
    background-color: #F5F5F5;
  }

  ;
  .seatbackground tr:nth-child(even) {
    background-color: #EAEAEA;
  }

  ;
  .seatcolheader, .seatrowheader, .seatbackground td div {
    height: $seatWidthHeight;
    width: $seatWidthHeight;
    text-align: center;
  }

  input.seatcolheader, input.seatrowheader {
    background: #d2dae6;
    border: none;
  }

  ;
  /**座位区域样式**/
  .tdseatarea td {
    text-align: center;
    vertical-align: middle;
    /*opacity: 0.3;*/
  }

  .tdseatarea td div {
    height: $seatNonBorderWidthHeight;
    width: $seatNonBorderWidthHeight;
    vertical-align: middle;
    font-size:12px;
  }

  /**行头、列头文本框样式**/
  .seatcolheader .el-input__inner, .seatrowheader .el-input__inner {
    height: $seatWidthHeight;
    padding: 0 8px;
    text-align: center;
    border-radius: 0;
  }

  /**画区域线**/
  .drawline {
    border: 2px solid #151515;
    position: absolute;
    width: 0;
    height: 0;
    top: 0;
    left: 0;
    z-index: 99999;
    background-color: #666666;
    opacity: 0.5;
  }

  ;
  .area-row-col {
    width: 58px;
  }

  /**座位图标上的文字显示**/
  .iconfont-text {
    color: white;
    text-align: center;
    vertical-align: center;
    line-height: 30px;
  }

  /**座位图标显示**/
  .iconfont-seaticon {
    background-repeat: no-repeat;
    background-size: 80% 80%;
    -moz-background-size: 80% 80%;
    background-position: center;
  }

  /**座位图标显示--普通单人座**/
  .iconfont-seaticon-single-normal {
    @extend .iconfont-seaticon;
    background-image: url("../../../assets/images/seat/Single-seat.png");
  }
  /**座位图标显示--情侣座左**/
  .iconfont-seaticon-single-DoubleLeft {
    @extend .iconfont-seaticon;
    background-image: url("../../../assets/images/seat/DoubleLeft.png");
    background-size: cover;
  }
  /**座位图标显示--情侣座右**/
  .iconfont-seaticon-single-DoubleRight {
    @extend .iconfont-seaticon;
    background-image: url("../../../assets/images/seat/DoubleRight.png");
    background-size: cover;
  }

  /**座位图标显示--多人座左**/
  .iconfont-seaticon-single-ThreeLeft {
    @extend .iconfont-seaticon;
    background-image: url("../../../assets/images/seat/ThreeLeft.png");
    background-size: cover;
  }
  /**座位图标显示--多人座右**/
  .iconfont-seaticon-single-ThreeRight {
    @extend .iconfont-seaticon;
    background-image: url("../../../assets/images/seat/ThreeRight.png");
    background-size: cover;
  }
  /**座位图标显示--多人座中**/
  .iconfont-seaticon-single-ThreeCenter {
    @extend .iconfont-seaticon;
    background-image: url("../../../assets/images/seat/ThreeCenter.png");
    background-size: cover;
  }






  /**座位图标显示--残疾人座**/
  .iconfont-seaticon-single-Handicapped {
    @extend .iconfont-seaticon;
    background-image: url("../../../assets/images/seat/Handicapped-seat.png");
  }
  /**座位图标显示--儿童座**/
  .iconfont-seaticon-single-Children {
    @extend .iconfont-seaticon;
    background-image: url("../../../assets/images/seat/Children-seat.png");
  }

  /**座位图标显示--电动按摩单人座**/
  .iconfont-seaticon-single-message {
    @extend .iconfont-seaticon;
    background-image: url("../../../assets/images/seat/Massagechair-seat.png");
  }
  /**座位图标显示--坏座**/
  .iconfont-seaticon-single-BadSeat {
    @extend .iconfont-seaticon;
    background-image: url("../../../assets/images/seat/Bad-seat.png");
  }
  /**座位图标显示--坏情侣左座**/
  .iconfont-seaticon-single-badDoubleLeft {
    @extend .iconfont-seaticon;
    background-image: url("../../../assets/images/seat/badDoubleLeft.png");
    background-size: cover;
  }
  /**座位图标显示--坏情侣右座**/
  .iconfont-seaticon-single-badDoubleRight {
    @extend .iconfont-seaticon;
    background-image: url("../../../assets/images/seat/badDoubleRight.png");
    background-size: cover;
  }
  /**座位图标显示--坏多人左座**/
  .iconfont-seaticon-single-badThreeLeft {
    @extend .iconfont-seaticon;
    background-image: url("../../../assets/images/seat/badThreeLeft.png");
    background-size: cover;
  }
  /**座位图标显示--坏多人中座**/
  .iconfont-seaticon-single-badThreeCenter {
    @extend .iconfont-seaticon;
    background-image: url("../../../assets/images/seat/badThreeCenter.png");
    background-size: cover;
  }
  /**座位图标显示--坏多人右座**/
  .iconfont-seaticon-single-badThreeRight {
    @extend .iconfont-seaticon;
    background-image: url("../../../assets/images/seat/badThreeRight.png");
    background-size: cover;
  }
  /**添加座位在右边的显示**/
  .seatstyle-tips{
    width:100%;
    overflow: hidden;
  }
  .seatstyle-tips li{
    float:left;
    width:33.33333333%;
    height:45px;
    position: relative;
    margin-bottom:17px;
  }
  .seatstyle-tips-icon{
    text-align: center;
    cursor: pointer;
  }
  .seatstyle-tips-title{
    text-align: center;
    cursor: pointer;
    color:#666666;
    font-size: 12px;
  }
  .icon-single-seat{
    width:18px;
    height:18px;
  }
  .icon-twin-seat{
    width:40px;
    height:18px;
  }
  .icon-trree-seat{
    width:66px;
    height:18px;
  }
  .sales-territory-box{
    overflow: hidden;
  }
  .sales-territory-arrow{
    display:inline-block;
    width:18px;
    height:24px;
    line-height: 24px;
    background: #F2F4FD;
    cursor: pointer;
    text-align: center;
    float:left;
  }
  .sales-territory-arrow .icon{
    width:10px;
    height:10px;
  }
  .icon-box{
    width:80%;
    height:100%;
  }
  .sales-territory-color{
    display:inline-block;
    width:144px;
    height:24px;
    float:left;
    overflow: hidden;
  }
  .sales-territory-div{
    width:72px;
    height:24px;
    line-height: 24px;
    text-align: center;
    float:left;
    font-size: 12px;
    cursor:pointer;
  }
  .sales-territory-Member{
    background-color:#FF6E3C;
    color:#ffffff;
  }
  .sales-territory-activity{
    background-color:#e7f7d5;
    color: #BCBCBC;
  }
  .sales-territory-add{
    display:inline-block;
    width:24px;
    height:24px;
    float:right;
    cursor: pointer;
    background: #F2F4FD;
    text-align: center;
    line-height: 24px;
  }
  .sales-territory-add .icon{
    width:10px;
    height:10px;
  }
  .sales-territory-region{
    padding: 14px;
    width:100%;
    box-sizing: border-box;
    background: #F2F4FD;
    overflow: hidden;
    position: relative;
  }
  .sales-territory-regionleft{
    float:left;
    width:240px;
    height:100%;
    box-sizing: border-box;
    padding:14px;
    padding-right:0px;
    padding-left:0px;
    position: relative;
  }
  .sales-territory-regionleft p{
    margin-bottom:5px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    font-size: 12px;
    color: #333333;
    width: auto;
    padding-right: 40px;
  }
  .regionleft-eait{
    position:absolute;
    top:14px;
    right:10px;
    cursor:pointer;
    font-size: 12px;
    color: #3B74FF;
  }
  .sales-territory-regionBtn{
    width:100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .sales-territory-regionBtn span{
    display: inline-block;
    width:90px;
    height:30px;
    text-align:center;
    line-height:30px;
    font-size: 12px;
    color: #3B74FF;
    border: 1px solid #3B74FF;
    border-radius: 4px;
    cursor: pointer;
  }
  .sales-territory-gradeUL{
    overflow: hidden;
    width:100%;
  }
  .sales-territory-gradeUL li{
    width:24px;
    height:24px;
    box-sizing: border-box;
    text-align:center;
    line-height:24px;
    background: #FFFFFF;
    border: 1px solid #BCBCBC;
    border-radius: 4px;
    float:left;
    margin-right:10px;
    font-size: 12px;
    color: #666666;
    cursor:pointer;
  }
  .sales-territory-gradeUL li.active{
    border: 1px solid #3B74FF;
    color: #3B74FF;
  }
  .sales-details-Statistics{
    
  }
  .sales-details-StatisticsUL{

  }
  .sales-details-name{
    display: inline-block;
    width:140px;
  }
  .sales-details-StatisticsUL li{
    margin-bottom:8px;
    font-size: 12px;
    color: #666666;
  }

  .bottom-btn{
    position: absolute;
    width:100%;
    height:66px;
    background-color:#fff;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  }
  .bottom-btn span{
    display: inline-block;
    width:100px;
    height:32px;
    text-align:center;
    line-height:32px;
    font-size: 12px;
    border-radius: 4px;
    box-sizing: border-box;
    margin-top:10px;
  }
  .bottom-btn-yesedit{
    background: #3B74FF;
    color: #FFFFFF;
  }
  .bottom-btn-noedit{
    background: #FFFFFF;
    border: 1px solid #BCBCBC;
    color: #666666;
  }
  .h{
    position: absolute;
    left:0px;
    top:0px;
    height:639px;
    width: 100%;
    padding-left: 20px;
    padding-top: 68px;
    box-sizing: border-box;
    overflow: auto;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;
  }
  .icon-addbox{
    width:8px;
    height:4px;
  }
  .seat-inputBtn{
    width:40px;
    height:32px;
    box-sizing: border-box;
    margin-left:10px;
    margin-right:8px;
    font-size: 12px;
  }
  .seat-inputBtn input{
    padding:0px;
    text-align:center;
    color: #666666;
  }

  
  .salesArea-box{

  }
  .salesArea-box-col{
    margin-bottom:16px;
    display:flex;
    flex-flow:row;
  }
  .salesArea-box-name{
    width:100px;
    display: inline-block;
    color: #151515;
    height:30px;
    line-height: 30px;
    font-size:12px;
  }
  .salesArea-input-width{
    flex:1;
    display: block;
  }
  .salesArea-input-width input{
    width:180px;
    font-size: 12px;
  }
  .sign-red{
    color:#F33530;
  }
  .el-dialog__title{
    font-size: 14px;
    color: #333333;
  }
  .el-checkbox__label{
    float:none;
  }
  .el-checkbox+.el-checkbox{
    margin-left:0px;
  }
  .newstyle-a .el-checkbox{
    margin-right:16px;
    margin-bottom:0px;
    line-height:32px;
  }
  .el-checkbox{
    margin-right:16px;
    margin-bottom:8px;
  }
  .salesArea-checked-all{
    font-size: 12px;
    color: #3B74FF;
    margin-bottom:16px;
    display: block;
  }
  .salesArea-box-other{
    display:block;width:60px;margin-right:16px;
  }
  .salesArea-box-other input{
    padding: 0px;
    text-align: center;
    color: #666666;
  }
  .moreseatlevBox{
    position: absolute;
    top:25px;
    right:24px;
  }
  .moreseatlevBox-ul{
    border: 1px solid #BCBCBC;
    width:24px;
    box-shadow: 0 1px 4px 0 rgba(102,102,102,0.25);
  }
  .moreseatlevBox-ul li{
    width: 24px;
    height: 24px;
    box-sizing: border-box;
    text-align: center;
    line-height: 24px;
    background: #FFFFFF;
    border-radius: 4px;
    margin-right: 10px;
    font-size: 12px;
    color: #666666;
    cursor: pointer;
  }
  .moreseatlevBox-ul li:hover{
    background: #F5F5F5;
  }
  .sales-territory-boxUlnone{
    width:100%;
    height:80px;
    background: #e0e7f8;
    text-align: center;
    line-height: 80px;
    color:#999;
  }
  .sales-territory-boxUl{
    width:100%;
    overflow: hidden;
  }
  .sales-territory-boxUl li{
    cursor: pointer;
    text-align: center;
    line-height: 40px;
    width:50%;
    height:40px;
    float: left;
  }
  .deldrawSaleArea{

  }
  .deldrawSaleArea span{
    display:block;
    width:50%;
    height:30px;
    text-align: center;
    line-height: 30px;
    font-size: 12px;
    border-radius: 4px;
    box-sizing: border-box;
    margin: 10px auto;
    cursor: pointer;
    background: #FFFFFF;
    border: 1px solid #BCBCBC;
    color: #666666;
  }
  .deldrawSaleArea span.active{
    border: 1px solid #3B74FF;
    color: #3B74FF;
  }
  .icon-width20{
    width:20px;
    height:20px;
  }
  .fanzhuagn-box{
    text-align: center;
    cursor: pointer;
    height:40px;
    overflow: hidden;
    width:40px;
  }
  .nullBox{
    height:40px;
    width:40px;
  }
  .fanzhuagn-box-title{
    font-size: 12px;
    color: #666666;
    text-align: center;
  }
  .editSeatBtn{
    width:82px;
  }
  .editSeatBtn span{
    display:block;
    width:72px;
    height:20px;
    line-height:20px;
    text-align: center;
    border: 1px solid #3B74FF;
    border-radius: 2px;
    font-size:12px;
    cursor: pointer;
    color: #3B74FF;
  }
  .context-box {
    width: 120px;
    height: 78px;
    background: #f2f4fd;
    position: absolute;
    z-index: 100;
    box-shadow: 0 0 2px 1px #bfd0f9;
    display: flex;
    flex-direction: column;
    justify-content:  center;
    align-items: center;
  }
  .context-box-item {
    display: flex;
    width: 100%;
    flex: 0 0 50%;
    justify-content: center;
    align-items: center;
    color: #333333;
    border-radius: 2px;
  }
  .context-box-item:hover {
    cursor: pointer;
    opacity: 0.88;
    background: rgba(164, 188, 248, 0.61);
  }
  .context-box-item:active {
    cursor: pointer;
    opacity: 0.88;
    background: rgba(164, 188, 248, 0.77);
  }
</style>


