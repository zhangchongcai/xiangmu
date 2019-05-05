<template>
  <div class="seatpage">
    <el-breadcrumb separator=">" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/CTM/cinema/list">我的影院</el-breadcrumb-item>
      <el-breadcrumb-item :to="linkToHallList">影厅管理</el-breadcrumb-item>
      <el-breadcrumb-item class="edit-seat">编辑座位图</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container style="height: 705px;">
      <el-main id="seatMain" style="background-color: #FFF; padding: 0;">
        <!--银幕-->
        <div class="screen">
        </div>
        <!--座位列头文本框-->
        <table class="tdseatcolheader">
          <tr>
            <template v-model="messagecolArr" v-for="(col,index) in messagecolArr">
              <td v-if="index>1"> 
              </td>
              <td v-if="index == 0">
                <div class="editSeatBtn" @click="editSeatBtn()"><span>编辑座位号</span></div>
              </td>
            </template>
            <td v-for="(cell, index) in seatColNumArray">
              <el-input class="seatcolheader" v-model="cell.col" :disabled="eaitDisabled" @focus="getColVal(cell.col)" @change="colChange(cell.col)"/>
            </td>
            <td v-model="messagecolArr" v-for="(col,index) in messagecolArr">
                <div class="fanzhuagn-box" v-if="index == 1" @click="colIndexBtnEvent()">
                  <svg class="icon icon-width20" aria-hidden="true">
                    <use xlink:href="#icon-neiye-zuoyoufanzhuan"></use>
                  </svg>
                  <p class="fanzhuagn-box-title">翻转</p>
                </div>
            </td>
          </tr>
        </table>
        <!--座位操作区-->
        <div id="scseat" class="section"
             @mousedown="seatMousedownHandler($event)"
             @mousemove="seatMousemoveHandler($event)"
             @mouseleave="seatMouseupHandler($event)"
             @mouseup="seatMouseupHandler($event)">
          <!--座位背景-->
          <table class="seatbackground">
            <tr v-for="(col,index) in messagerowArr">
              <td>
                <div class="fanzhuagn-box" 
                     v-if="index == 0"
                     @click="rowIndexBtnEvent()"
                >
                  <svg class="icon icon-width20" aria-hidden="true">
                    <use xlink:href="#icon-neiye-shangxiafanzhuan"></use>
                  </svg>
                  <p class="fanzhuagn-box-title">翻转</p>
                </div>
              </td>
              <td v-for="row in messagecolArr"></td>
              <td v-for="(cell, index) in seatColNumArray">
                <div></div>
              </td>
              <td v-for="row in messagecolArr"></td>
            </tr>
            <tr v-for="(cell, index) in seatRowNumArray">
              <td>
                <el-input class="seatrowheader" v-model="cell.row" :disabled="eaitDisabled" @focus="getRowVal(cell.row)" @change="rowChange(cell.row)"/>
              </td>
              <td v-for="row in messagecolArr"></td>
              <td v-for="(cell, index) in seatColNumArray">
                <div></div>
              </td>
              <td v-for="row in messagecolArr"></td>
            </tr>
            <tr v-for="col in messagerowArr">
              <td></td>
              <td v-for="row in messagecolArr"></td>
              <td v-for="(cell, index) in seatColNumArray">
                <div></div>
              </td>
              <td v-for="row in messagecolArr"></td>
            </tr>
          </table>
          <!--座位区域-->
          <div class="seatarea" style="position: relative;"
               v-bind:style="{top: seatarea.top-this.messageRow*41 + 'px', left: seatarea.left+this.messageCol*41 + 'px', width: seatarea.width + 'px', height: seatarea.height + 'px'}">
            <table class="tdseatarea">
              <tr v-for="seatarearow in seatAreaGrid">
                <td v-for="seatareacol in seatarearow" v-bind:style="{backgroundColor: seatareacol.color}">
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
                    :sgCode="seatcellcol.sgCode">{{seatlevClickActive == false ? seatcellcol.col : seatcellcol.seatLevel}}</div>
                </td>
              </tr>
            </table>
          </div>
          <!-- 画框线 -->
          <div class="drawline" v-if="drawline.drawing"
               v-bind:style="{left: drawline.left + 'px', top: drawline.top + 'px', width: drawline.width + 'px', height: drawline.height + 'px'}"></div>
        </div>
        {{this.seatColNumArray}}
        <br/> 
        {{this.seatRowNumArray}}
        <br/>
        <!-- {{this.eaitDisabled}} -->
        <br/>
        <!-- <hr> -->
        {{this.seatAreaGrid}}
        <br/>
        <hr>
        {{this.seatCellGrid}}
        <br/>
        <!-- <hr> -->
        <!-- {{this.drawline.selectedGrid}} -->
      </el-main>
      <!--右边区域-->
      <el-aside width="300px" style="background-color: #FFF; margin-left: 20px;position: relative;overflow: hidden;">
        <div class="h">
          <div class="seat-area" style="margin-bottom:8px;"><span>座位区域</span>
            <el-input class="area-row-col seat-inputBtn" v-model="maxrowsize" @change="maxrowsizeChangeHandler()"/>
            <span style="color:#666666;">行　X</span>
            <el-input class="area-row-col seat-inputBtn" v-model="maxcolsize" @change="maxcolsizeChangeHandler()"/>
            <span style="color:#666666;">列</span>
          </div>
          <div class="seat-area" style="margin-bottom:35px;"><span>留白区域</span>
            <el-input class="area-row-col seat-inputBtn" v-model="messageRow" @change="messageRowChangeHandler()"/>
            <span style="color:#666666;">行　X</span>
            <el-input class="area-row-col seat-inputBtn" v-model="messageCol" @change="messageColChangeHandler()"/>
            <span style="color:#666666;">列</span>
          </div>
          <div style="margin-bottom:17px;">添加座位</div>
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
          <div style="margin-bottom:17px;">编辑座位</div>
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
          <div style="margin-bottom:17px;">设定分区方案</div>
          <div class="sales-territory-box">
            <ul class="sales-territory-boxUlnone" v-model="drawSaleArea" v-if="drawSaleArea.length == 0">
              <li>没有设定分区方案</li>
            </ul>
            <ul class="sales-territory-boxUl" v-model="drawSaleArea" v-if="drawSaleArea.length > 0">
              <li v-for="(draw,index) in drawSaleArea" 
              :style="'background-color:'+draw.fontColor+';color:' +draw.color+';'" 
              :key="index"
              @click="drawSaleAreaEvent(index)"
              >{{draw.name}}</li>
            </ul>
            <div class="deldrawSaleArea" v-model="drawSaleArea" v-if="drawSaleArea.length > 0">
              <span 
              @click="delSaleEvent()" 
              >清除座位关联</span>
            </div>
            <!-- <span class="sales-territory-arrow">
              <svg class="icon icon-box" aria-hidden="true">
                <use xlink:href="#icon-arrow-left-noSelected"></use>
              </svg>
            </span>
                          v-model="selectDelSaleActive"
              :class="selectDelSaleActive == true ? 'active' : ''"
            <span class="sales-territory-color">
              <div class="sales-territory-div" 
              v-for="(draw,index) in drawSaleArea" 
              :style="'background-color:'+draw.fontColor+';color:' +draw.color+';'" :key="index" @click="drawSaleAreaEvent(index)"
              >
                {{draw.name}}
              </div>
            </span>
            <span class="sales-territory-arrow">
              <svg class="icon icon-box" aria-hidden="true">
                <use xlink:href="#icon-arrow-right-noSelected"></use>
              </svg>
            </span>
            <span class="sales-territory-add">
              <svg class="icon icon-box" aria-hidden="true">
                <use xlink:href="#icon-neiye-tianjia"></use>
              </svg>
            </span> -->
          </div>
          <!-- <div class="sales-territory-region">
            <div class="sales-territory-regionleft">
              <p>名称：会员区</p>
              <p>可售渠道：柜台、APP及小程序</p>
              <p>可售消费者：全部会员</p>
              <p>总座位数：20</p>
              <span class="regionleft-eait" @click="salesAreaEdit()">编辑</span>
            </div>
            <div class="sales-territory-regionBtn">
              <span @click="delSaleEvent()">清除座位关联</span>
              <span>添加选中座位</span>
            </div>
          </div> -->
          <div style="margin-bottom:17px;margin-top:16px;">设定选中座位等级</div>
          <div class="sales-territory-grade" style="height:24px;position: relative;">
            <ul class="sales-territory-gradeUL">
              <li v-for="(el,index) in seatlevArr" 
                  @click="seatlevEvent(index)"
                  :class="seatlevActive == index ? 'active' : ''"
                >{{el.num}}</li>
              <li style="line-height:20px;"
                  @click="seatlevEventMore()"
                  :class="seatlevActive == 'more' ? 'active' : ''"
                >
                <svg class="icon icon-addbox" aria-hidden="true">
                  <use xlink:href="#icon-quanju-xiala"></use>
                </svg>
              </li>
            </ul>
            <div class="moreseatlevBox" v-if="seatlevMore">
              <ul class="moreseatlevBox-ul">
                <li v-for="(item,index) in seatlevArrmore" 
                    @click="seatlevmoreLiBtn(index)"
                >{{item.num}}</li>
              </ul>
            </div>
          </div>
          <div style="margin-bottom:17px;margin-top:16px;">详情统计</div>
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
  export default {
    name: 'seatdesign',
    data() {
      const seatWidthHeight = 40, seatNonBorderWidthHeight = 41;//没有边框线座位单元格子的大小像素
      const defaultMaxRowSize = 0, defaultMaxColSize = 0;//初始化默认座位图最大行列数
      return {
        testData:{},
        // totalArr:{
        //   // 影厅名称
        //   hallName:"",
        //   // 总座位数
        //   wholeSeatNum:"",

        
        // }
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
        sgCode:0,
        // 画销售区域
        drawSaleArea:[],
        // 当前选择的销售区域背景色
        drawBgColor:"",
        // 当前选择的销售区域名字
        drawBgName:"",
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
        minClientX: 41,
        minClientY: 115,//框选区域时，最少的X、Y坐标
        maxrowsize: defaultMaxRowSize,//最大行数，座位行号列表根据该行数进行生成
        maxcolsize: defaultMaxColSize,//最大列数，座位行号列表根据该列数进行生成
        messageRow: 1,//留白行数默认1行
        messagerowArr:[],
        messageCol: 2,//留白列数默认2列
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
        }
      }
    },
    components: {},
    methods: {
      delSaleEvent(){
        this.delActiveType()
        this.actionType = 11
      },
      drawSaleAreaEvent(index){
        this.delActiveType()
        this.actionType = 10
        this.drawBgColor = this.drawSaleArea[index].fontColor
        this.drawBgName = this.drawSaleArea[index].name
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
        console.log(this.actionType)
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
        this.countSeat = this.countSeatEvent(this.seatCellGrid)
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
            let cell = {};
            if (i <= existRowNum - 1 && j <= existColNum - 1) {
              cell = seatAreaTemp[i][j];
            }
            if (!$.isPlainObject(cell)) {
              cell = {};
            }
            colArray.push(cell);
          }
          this.seatAreaGrid.push(colArray);
        }
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
            let cell = {};
            if (i <= existRowNum - 1 && j <= existColNum - 1) {
              cell = seatcellTemp[i][j];
            }
            if (!$.isPlainObject(cell)) {
              cell = {};
            }
            cell.ulX = i + 1;
            cell.ulY = j + 1;
            // cell.seatType = 0;
            // cell.status = null;
            // cell.seatLevel = "";
            // cell.rowAlias = null;
            // cell.colAlias = null;
            // cell.sgCode = "";
            // cell.regionUid = null;

            colArray.push(cell);
          }
          this.seatCellGrid.push(colArray);
        }
      },
      //计算画线对应的座位单元格
      calculateDrawlineSeatCell() {
        const ignoreWidthOrHeight = 8;
        // debugger
        //如果框选区域忽略像素
        if (this.drawline.left < this.minClientX || this.drawline.top < this.minClientY
          || (this.drawline.width <= ignoreWidthOrHeight && this.drawline.height <= ignoreWidthOrHeight)) {
          this.resetDrawline();
          return;
        }
        console.log('this.drawline:');
        console.log(this.drawline);
        //根据当前框选的区域，计算出对应的单元格子
        this.drawline.selectedGrid = [];
        let scrollTop = $('#seatMain').scrollTop();//滚动条滚动的高度
        let scrollLeft = $('#seatMain').scrollLeft();//滚动条滚动的宽度
        //当前框选区域原点（左上角的点）计算对应单元格子公式：
        //当前行索引 = Math.floor((原点Y坐标 - 座位区域离顶边的距离-留白区域 + Y滚动条滚动的高度) / 单元格子的高度)
        //当前列索引 = Math.floor((原点X坐标 - 座位区域离左边的距离-留白区域 + X滚动条滚动的宽度) / 单元格子的宽度)
        let rowIndexStart = Math.floor((this.drawline.top - this.minClientY - 41*this.messageRow + scrollTop) / this.seatNonBorderWidthHeight);
        // debugger
        let rowIndexEnd = Math.floor((this.drawline.top + this.drawline.height - this.minClientY - 41*this.messageRow + scrollTop) / this.seatNonBorderWidthHeight);
        let colIndexStart = Math.floor((this.drawline.left - this.minClientX - 41*this.messageCol + scrollLeft) / this.seatNonBorderWidthHeight);
        let colIndexEnd = Math.floor((this.drawline.left + this.drawline.width - this.minClientX - 41*this.messageCol + scrollLeft) / this.seatNonBorderWidthHeight);
        if (rowIndexEnd >= this.maxrowsize) {
          rowIndexEnd = this.maxrowsize - 1;
        }
        if (colIndexEnd >= this.maxcolsize) {
          colIndexEnd = this.maxcolsize - 1;
        }
        for (let y = rowIndexStart; y <= rowIndexEnd; y++) {
          let row = [];
          for (let x = colIndexStart; x <= colIndexEnd; x++) {
            
            row.push({x: x, y: y});
            // debugger
            console.log(row)
          }
          // debugger
          this.drawline.selectedGrid.push(row);
        }
        this.drawline.drawing = false;
        console.log('this.drawline.selectedGrid:');
        console.log(this.drawline.selectedGrid);
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
            this.addSeat();
            break;
          case 2:
            // 双人座
            this.addtwoSeat();
            break;
          case 3:
            // 三人座
            this.addthreeSeat();
            break;
          case 4:
            // 残疾人座
            this.addHandicappedSeat();
            break;
          case 5:
            // 按摩椅座
            this.addMassagechairSeat();
            break;
          case 6:
            // 儿童座
            this.addChildrenSeat();
            break;
          case 7:
            // 坏座/解除
            this.badSeat();
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
          default:
            break;
        }
        //根据第三层座位，生成行号、列号
        // debugger
        this.generateRowColNum();
      },
      //添加座位
      addSeat() {
        if (this.drawline.selectedGrid == null || this.drawline.selectedGrid.length <= 0) {
          return;
        }
        for (let i = 0; i < this.drawline.selectedGrid.length; i++) {
          // debugger
          let selectedRow = this.drawline.selectedGrid[i];
          if (selectedRow == null || selectedRow.length <= 0) {
            break;
          }
          for (let j = 0; j < selectedRow.length; j++) {
            let selectedCol = selectedRow[j];
            if(selectedCol.x < 0 || selectedCol.y < 0 ){
              
            }else{
              var cell = this.seatCellGrid[selectedCol.y][selectedCol.x];
              if(cell.exist == 0){
                cell.seatType = 0;
                cell.status = 1
                cell.sgCode = ++this.sgCode
                cell.imageType = 1;
                cell.exist = 1
                cell.seatLevel = this.seatlevActive
              }else{
                break
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
                cell.color = this.drawBgColor;
                seatCellGridcell.regionCode = this.drawBgName
              }
            }
          }
        this.seatAreaGrid.push();
        // 
        }
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
              cell.color = '';
              seatCellGridcell.regionCode = '';
            } 
          }
        this.seatAreaGrid.push();
        }
      },
      //添加情侣座
      addtwoSeat() {
        if (this.drawline.selectedGrid == null || this.drawline.selectedGrid.length <= 0) {
          return;
        }
        for (let i = 0; i < this.drawline.selectedGrid.length; i++) {
          let selectedRow = this.drawline.selectedGrid[i];
          let startRow = this.seatCellGrid[i]
          if (selectedRow == null || selectedRow.length <= 0) {
            break;
          }
          for (let j = 0; j < selectedRow.length; j=j+2) {
            let selectedCol = selectedRow[j];
            if(selectedCol.x < 0 || selectedCol.y < 0 ){
              
            }else{
              var cell = this.seatCellGrid[selectedCol.y][selectedCol.x]
              var cell1 = this.seatCellGrid[selectedCol.y][selectedCol.x+1]
              if(cell1 == undefined){}else{
                if(cell.exist == 0 && cell1.exist == 0){
                  ++this.sgCode
                  cell.sgCode = this.sgCode
                  cell1.sgCode = this.sgCode
                  this.addtwoSeatFun(cell,cell1)
                  cell.exist = 1
                  cell1.exist = 1
                  cell.seatLevel = this.seatlevActive
                  cell1.seatLevel = this.seatlevActive
                }else{

                }
              }
            }
          }
        }
      },
      // 渲染情侣座位图标
      addtwoSeatFun(left,right){
        left.seatType = 1
        left.status = 1
        left.imageType = 2
        right.seatType = 1
        right.status = 1
        right.imageType = 3
      },
      //添加三人座
      addthreeSeat() {
        if (this.drawline.selectedGrid == null || this.drawline.selectedGrid.length <= 0) {
          return;
        }
        for (let i = 0; i < this.drawline.selectedGrid.length; i++) {
          let selectedRow = this.drawline.selectedGrid[i];
          let startRow = this.seatCellGrid[i]
          if (selectedRow == null || selectedRow.length <= 0) {
            break;
          }
          for (let j = 0; j < selectedRow.length; j=j+3) {
            let selectedCol = selectedRow[j];
            if(selectedCol.x < 0 || selectedCol.y < 0 ){
              
            }else{
              var cell = this.seatCellGrid[selectedCol.y][selectedCol.x]
              var cell1 = this.seatCellGrid[selectedCol.y][selectedCol.x+1]
              var cell2 = this.seatCellGrid[selectedCol.y][selectedCol.x+2]
              if(cell1 == undefined || cell2 == undefined){}else{
                if(cell.exist == 0 && cell1.exist == 0 && cell2.exist == 0){
                  ++this.sgCode
                  cell.sgCode = this.sgCode
                  cell1.sgCode = this.sgCode
                  cell2.sgCode = this.sgCode
                  this.addThreeSeatFun(cell,cell1,cell2)
                  cell.exist = 1
                  cell1.exist = 1
                  cell2.exist = 1
                  cell.seatLevel = this.seatlevActive
                  cell1.seatLevel = this.seatlevActive
                  cell2.seatLevel = this.seatlevActive
                }else{

                }
              }
            }
          }
        }
      },
      // 渲染三人座位图标
      addThreeSeatFun(left,center,right){
        left.seatType = 2
        center.seatType = 2
        right.seatType = 2
        left.status = 1
        center.status = 1
        right.status = 1
        left.imageType = 4
        center.imageType = 5
        right.imageType = 6
        
      },
      // 添加残疾人座
      addHandicappedSeat() {
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
              if(cell.exist == 0){
                cell.seatType = 3
                cell.sgCode = ++this.sgCode
                cell.imageType = 7;
                cell.exist = 1
                cell.status = 1
                cell.seatLevel = this.seatlevActive
              }else{}
            }
          }
        }
      },
      // 添加按摩椅座
      addMassagechairSeat() {
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
              if(cell.exist == 0){
                cell.seatType = 4
                cell.status = 1
                cell.sgCode = ++this.sgCode
                cell.imageType = 9;
                cell.exist = 1
                cell.seatLevel = this.seatlevActive
              }else{}
            }
          }  
        }
      },
      // 添加儿童座
      addChildrenSeat() {
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
              if(cell.exist == 0){
                cell.seatType = 5
                cell.status = 1
                cell.sgCode = ++this.sgCode
                cell.imageType = 8;
                cell.exist = 1
                cell.seatLevel = this.seatlevActive
              }
            }
          }
        }
      },
      // 添加坏座
      badSeat() {
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
                let cell = this.seatCellGrid[selectedCol.y][selectedCol.x];
                let ff =  this.seatCellGrid[selectedCol.y]
                if(cell.exist == 1){
                  let badArr = []
                  ff.forEach(function(val,index){
                    if(val.sgCode == cell.sgCode){
                      badArr.push(val)
                    }
                  })
                  if(badArr.length == 1){
                    badArr[0].imageType = 10
                    badArr[0].status = 0
                  }else if(badArr.length == 2){
                    badArr[0].imageType = 11
                    badArr[0].status = 0
                    badArr[badArr.length-1].imageType = 12
                    badArr[badArr.length-1].status = 0
                  }else if(badArr.length >= 3){
                    badArr.forEach(function(val,index,arr){
                      if(index == 0){
                        val.imageType = 13
                        val.status = 0
                      }else if(index == arr.length-1){
                        val.imageType = 15
                        val.status = 0
                      }else{
                        val.imageType = 14
                        val.status = 0
                      }
                    })
                  }
                }
            }
          }  
        }
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
              let cell = this.seatCellGrid[selectedCol.y][selectedCol.x];
              let ff = this.seatCellGrid[selectedCol.y]
              ff.forEach(function(val){
                if(val.sgCode == cell.sgCode){
                    val.imageType = 0;
                    val.row = '';
                    val.col = '';
                    val.seatType = '';
                    val.status = '';
                    val.exist = 0
                    cell.seatLevel = ""
                }
              })
              cell.imageType = 0;
              cell.row = '';
              cell.col = '';
              cell.seatType = '';
              cell.status = '';
              cell.exist = 0
              cell.sgCode = null
              cell.seatLevel = ""
            }
          }
        }     
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
          for (let j = 0; j < selectedRow.length; j++) {
            let selectedCol = selectedRow[j];
            if(selectedCol.x < 0 || selectedCol.y < 0 ){
              
            }else{
              // debugger
              var cell = this.seatCellGrid[selectedCol.y][selectedCol.x];
              var cellHCol = this.seatCellGrid[selectedCol.y]
              var cellNullObj = {}
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
            }
          }
          // 获取到行所有的合坐位置数组
          cellCunArr = this.arrayUnique2(cellCunArr,"ulY")
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
        }       
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
            console.log(cell.row)
            cell.row = row;
            cell.col = col;
            // cell.seatId = String(row) + String(col)
            //把行、列索引放入到数组变量中，然后根据行、列索引自动生成行号、列号
            if ($.inArray(cell.ulX - 1, seatRowIndexArray) == -1) {
              seatRowIndexArray.push(cell.ulX - 1);
            }
            if ($.inArray(cell.ulY - 1, seatColIndexArray) == -1) {
              seatColIndexArray.push(cell.ulY - 1);
            }
          }
        }

        //根据行索引自动生成行号
        row = 0;
        for (let rowIndex of seatRowIndexArray) {
          row += 1;
          this.seatRowNumArray[rowIndex].row = row;
        }

        //根据列索引自动生成列号，由于列索引可能是不连续的，必须进行排序后才能设置列号
        let col = 0;
        seatColIndexArray.sort(function (a, b) {
          return a - b;
        });
        for (let colIndex of seatColIndexArray) {
          col += 1;
          this.seatColNumArray[colIndex].col = col;
        }
      },
      /**
       * 最大行数改变事件处理，将重新初始化座位数据
       */
      maxrowsizeChangeHandler() {
        // this.maxrowsize == "" ? 1 : this.maxrowsize
        this.maxrowsize = Number(this.maxrowsize);
        this.generateSeatData();
        let uu = this.seatCellGrid
        this.addSeatprototype(uu)
      },
      /**
       * 最大列数改变事件处理，将重新初始化座位数据
       */
      maxcolsizeChangeHandler() {
        console.log(this.seatCellGrid)
        this.maxcolsize = Number(this.maxcolsize);
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
        console.log($.extend({}, this.drawline));
      },
      /**
       * 鼠标Mouseup、Mouseleave事件监听处理，画框线标记为画框结束，并计算画框对应的座位
       * @param event
       */
      seatMouseupHandler(event) {
        console.log('seatMouseupHandler...');
        console.log(event);
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
        // debugger
        let a = this.messageRow
        this.messageRow == '' ? messageRow : a
        this.lbGetrowArr(this.messageRow)
        this.generateSeatData()
      },
      messageColChangeHandler(){
        this.messagecolArr = []
        // this.messageCol == '' ? messageCol : 2
        this.lbGetcolArr(this.messageCol)
        this.generateSeatData()
      },
      noEditEvent(){
        let data = {
          hallUid:this.$route.query.hallUid
          // hallUid:"0be5d90b-6ac5-4483-b673-b5c53bdc2619"
          } ;
      this.$api.ciseatMap(data).then( data => {
        let _self = this
          if (data && data.code === 200) {
            let newdata = data.data
            _self.testData = newdata
            _self.maxrowsize = newdata.hallSeatX
            _self.maxcolsize = newdata.hallSeatY
            _self.seatAreaGrid = newdata.regionArray
            _self.seatCellGrid = newdata.seatArray
            _self.drawSaleArea = newdata.regionList
            _self.hallName = newdata.hallName
            _self.messageRow = newdata.hallBlankAreaX < 1 ? 1 : newdata.hallBlankAreaX
            _self.messageCol = newdata.hallBlankAreaY < 2 ? 2 : newdata.hallBlankAreaY
            _self.generateSeatData()
            _self.sgCode = _self.getMaxSgCode(newdata.seatArray)
          }
          }).catch( err => {
            console.log(err,1111)
          })
      },
      // 编辑座位号
      editSeatBtn(){
        this.eaitDisabled = !this.eaitDisabled
      },
      getColVal(value){
        this.nowColVal = value
      },
      getRowVal(value){
        this.nowRowVal = value
      },
      colChange(value){
        let ActiveVal = this.nowColVal
        this.seatCellGrid.forEach((val,index)=>{
          val.forEach((val,index,arr)=>{
            if(val.col ==  ActiveVal){
              val.col = value
            }
          })
        })
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
      // 完成编辑保存
      yesEditEvent(){
        let data = {
          hallUid:this.$route.query.hallUid,
          cinemaUid:this.$route.query.cinemaUid,
          hallBlankAreaX:this.messageRow,
          hallBlankAreaY:this.messageCol,
          hallSeatX:this.maxrowsize,
          hallSeatY:this.maxcolsize,
          regionArray:this.seatAreaGrid,
          regionList:this.drawSaleArea,
          seatArray:this.seatCellGrid
        }
        console.log(data)
        this.$api.ciseatDesign(data).then( data => {
            if(res.code === 200) {
              this.$message.success('上报成功！');

            }else {
              this.$message.error(res.msg);
            }
        }).catch( err => {
            console.log(err,1111)
          })
      },
      // 获取界面最大的sgCode
      getMaxSgCode(arr){
        let getmaxvalue = 0
        for(let i = 0 ; i<arr.length;i++ ){
          for(let j = 0 ; j<arr[i].length;j++){
            let aa = arr[i][j].sgCode
            if(aa == null){}else{
              if(aa >= getmaxvalue){
                getmaxvalue = aa
              }else{
                break
              }
            }
          }
        }
        return getmaxvalue
      },
      // 行翻转事件
      rowIndexBtnEvent(){
        if(this.getSeatNum() == true){
          this.seatRowNumArray = this.rowIndexBtnEventItem()
          let lsCellGrid = this.seatCellGrid
          let lsVal = ""
          this.seatRowNumArray.forEach((val,index,arr)=>{
            lsVal = val.row
            lsCellGrid[index].forEach((val,index,arr)=>{
              val.row = lsVal
            })
          })
        }
      },
      // 行号反转
      rowIndexBtnEventItem(){
        let oldArr = this.seatRowNumArray
        let tempArr = [...oldArr].reverse()
        let llArr = []
        tempArr.forEach((val,index)=>{
          if(val.hasOwnProperty("row")){
            llArr.push(val)
          }
        })
        oldArr.forEach((val,index)=>{
          if(val.row == undefined){
            llArr.splice(index, 0, "{}")
          }
        })
        return llArr
      },
      // 判断有没有座位
      getSeatNum(){
        let getSeatNumActive = false
        this.seatCellGrid.forEach((val,index,arr)=>{
          val.forEach((val,index,arr)=>{
            if(val.hasOwnProperty("exist") && val.exist == 1){
              getSeatNumActive = true
              return false
            }
          })
        })
        return getSeatNumActive
      },
      // 列号反转事件
      colIndexBtnEvent(){
        if(this.getSeatNum() == true){
          debugger
          let lsColNumArray = this.seatColNumArray
          this.seatColNumArray = this.colIndexBtnEventItem()
          let oldlsVal = ""
          let newlsVal = ""
          lsColNumArray.forEach((val,index,arr)=>{
            if(val.hasOwnProperty('col') && val.col > 0 ==true){
              debugger
              oldlsVal = arr[index].col
              newlsVal = this.seatColNumArray[index].col
              this.seatCellGrid.forEach((val,index,arr)=>{
                // alert(arr)
                val.forEach((val,index)=>{
                  debugger
                  // alert(val.col == oldlsVal)
                  if(val.col == oldlsVal){
                    debugger
                    val.col = newlsVal
                    val.ls = true
                  }
                })
              })
            }
          })
        }
          // lsColNumArray.forEach((val,index)=>{
          //   if(val.hasOwnProperty('col') && val.col > 0 ==true){
          //     debugger
          //     oldlsVal = val.col
          //     alert(oldlsVal)
          //     this.seatColNumArray.forEach((val,index)=>{
          //       if(val.hasOwnProperty('col') && val.col > 0 ==true){
          //         debugger
          //         newlsVal = val.col
          //         alert(newlsVal)
          //         lsCellGrid.forEach((val,index)=>{
          //           val.forEach((val,index)=>{
          //             debugger
          //             if(val.col == oldlsVal){
          //               val.col = newlsVal
          //             }
          //           })
          //         })
          //       }
          //     })
          //   }
            // debugger
            // oldlsVal = val.col
            // this.seatColNumArray.forEach((val,index)=>{
            //   // debugger
            //   newlsVal = val.col
            //   console.log(lsCellGrid[index])
            //   lsCellGrid[index].forEach((val,index,arr)=>{
            //     // debugger
            //     if(val.col == oldlsVal){
            //       val.col = newlsVal
            //     }
            //   })
            // })
          // })
          // lsCellGrid.forEach((val,index,arr)=>{
          //   val.forEach((val,index,arr)=>{
              
          //   })
          // })
        // }
      },
      // 列号反转方法
      colIndexBtnEventItem(a,b){
        let oldArr = this.seatColNumArray
        let tempArr = [...oldArr].reverse()
        let llArr = []
        tempArr.forEach((val,index)=>{
          if(val.hasOwnProperty("col")){
            llArr.push(val)
          }
        })
        oldArr.forEach((val,index)=>{
          if(val.col == undefined){
            llArr.splice(index, 0, "{}")
          }
        })
        return llArr
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
            if(val.seatType == 4 && val.status ==1){
              childrenSeat++
            }
            if(val.seatType == 5 && val.status ==1){
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
      console.log(this.$route.query.cinemaUid)
      this.params = this.$route.query;
      this.linkToHallList = '/CTM/cinemawall/list?cinemaUid=' + this.params.cinemaUid;

      let data = {
          hallUid:this.$route.query.hallUid
          // hallUid:"0be5d90b-6ac5-4483-b673-b5c53bdc2619"
          } ;
      this.$api.ciseatMap(data).then( data => {
        let _self = this
          if (data && data.code === 200) {
            let newdata = data.data
            _self.testData = newdata
            _self.maxrowsize = newdata.hallSeatX
            _self.maxcolsize = newdata.hallSeatY
            _self.seatAreaGrid = newdata.regionArray
            _self.seatCellGrid = newdata.seatArray
            _self.hallName = newdata.hallName
            // _self.drawSaleArea = newdata.regionList
            _self.messageRow = newdata.hallBlankAreaX < 1 ? 1 : newdata.hallBlankAreaX
            _self.messageCol = newdata.hallBlankAreaY < 2 ? 2 : newdata.hallBlankAreaY
            _self.generateSeatData()
            _self.sgCode = _self.getMaxSgCode(newdata.seatArray)
            // _self.countSeat = _self.countSeatEvent(newdata.seatArray)
          } else {
          }
          }).catch( err => {
            console.log(err,1111)
          })
    },
    mounted: function () {
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
          "name":"合并选中座",
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
        {num:9},
        {num:10}
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
      //查询当前影厅座位图

      //初始化数据
      // this.maxrowsize = 0;
      // this.maxcolsize = 0;

      // 初始化座位区域数据
      // this.seatAreaGrid = [];
      // for (let i = 0; i < this.maxrowsize; i++) {
      //   let colArray = [];
      //   for (let j = 0; j < this.maxcolsize; j++) {
      //     let cell = {};
      //     // if(i >= 7 && i <= 9 && j >= 3 && j <= 6){
      //     //     cell.color = '#F8ECAB';
      //     // }
      //     if(i >= 1 && i <= 5 && j >= 7 && j <= 12){
      //         cell.color = '#CAE3AE';
      //     }
      //     colArray.push(cell);
      //   }
      //   this.seatAreaGrid.push(colArray);
      // }
      //初始化座位数据
      // this.seatCellGrid = [];
      // for (let i = 0; i < this.maxrowsize; i++) {
      //   let colArray = [];
      //   for (let j = 0; j < this.maxcolsize; j++) {
      //     let cell = {};
      //     cell.x = i + 1;
      //     cell.y = j + 1;
      //     if(i >= 2 && i <= 5 && j >= 1 && j <= 6){
      //       cell.row = i - 1;
      //       cell.col = j - 4;
      //       cell.icon = 'iconfont-seaticon-single-normal';
      //     }
      //     colArray.push(cell);
      //   }
      //   this.seatCellGrid.push(colArray);
      // }

      //生成座位数据
      // this.generateSeatData();
      
      
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
    margin: 20px 0;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /**面包屑导航样式**/
  .el-breadcrumb {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .edit-seat .el-breadcrumb__inner{
      color: #3B74FF !important;
  }

  /**银幕样式**/
  .screen {
    height: 30px;
    background-color: #FFF;
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
  }

  ;
  /**座位区域样式**/
  .tdseatarea td {
    text-align: center;
    vertical-align: middle;
    opacity: 0.7;
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
    left:0px;
    bottom:0px;
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
    padding-top:30px;
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
</style>


