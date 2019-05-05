<template>
  <div class="seatpage">
    <el-breadcrumb separator=">" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/ctm/cinema/list">我的影院</el-breadcrumb-item>
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
            <td v-for="(cell, index) in seatColNumArray">
              <el-input class="seatcolheader" v-model="cell.col"/>
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
            <tr v-for="(cell, index) in seatRowNumArray">
              <td>
                <el-input class="seatrowheader" v-model="cell.row"/>
              </td>
              <td v-for="(cell, index) in seatColNumArray">
                <div></div>
              </td>
            </tr>
          </table>
          <!--座位区域-->
          <div class="seatarea" style="position: relative;"
               v-bind:style="{top: seatarea.top + 'px', left: seatarea.left + 'px', width: seatarea.width + 'px', height: seatarea.height + 'px'}">
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
               v-bind:style="{top: seatarea.top*2 + 'px', left: seatarea.left + 'px', width: seatarea.width + 'px', height: seatarea.height + 'px'}">
            <table class="tdseatarea">
              <tr v-for="seatcellrow in seatCellGrid">
                <td v-for="seatcellcol in seatcellrow">
                  <div class="iconfont-text" v-bind:class="[seatcellcol.icon]">{{seatcellcol.col}}</div>
                </td>
              </tr>
            </table>
          </div>
          <!--画框线-->
          <div class="drawline" v-if="drawline.drawing"
               v-bind:style="{left: drawline.left + 'px', top: drawline.top + 'px', width: drawline.width + 'px', height: drawline.height + 'px'}"></div>
        </div>
      </el-main>
      <!--右边区域-->
      <el-aside width="300px" style="background-color: #FFF; margin-left: 20px; padding-left: 20px">
        <div class="seat-area"><span>座位区域</span>
          <el-input class="area-row-col" v-model="maxrowsize" @change="maxrowsizeChangeHandler()"/>
          <span>行　X</span>
          <el-input class="area-row-col" v-model="maxcolsize" @change="maxcolsizeChangeHandler()"/>
          <span>列</span>
        </div>
        <div style="margin-top: 10px;">操作：
          <el-radio-group v-model="actionType">
            <el-radio :label="1">添加单人座</el-radio>
            <el-radio :label="2">删除座位</el-radio>
          </el-radio-group>
        </div>
      </el-aside>
    </el-container>
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

  export default {
    name: 'seatdesign',
    data() {
      const seatWidthHeight = 40, seatNonBorderWidthHeight = 41;//没有边框线座位单元格子的大小像素
      const defaultMaxRowSize = 20, defaultMaxColSize = 20;//初始化默认座位图最大行列数
      return {
        params: {
          cinemaUid: '',
          hallUid: ''
        },
        linkToHallList: '',
        minClientX: 41,
        minClientY: 115,//框选区域时，最少的X、Y坐标
        maxrowsize: defaultMaxRowSize,//最大行数，座位行号列表根据该行数进行生成
        maxcolsize: defaultMaxColSize,//最大列数，座位行号列表根据该列数进行生成
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
        }
      }
    },
    components: {},
    methods: {
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
            cell.x = i + 1;
            cell.y = j + 1;
            colArray.push(cell);
          }
          this.seatCellGrid.push(colArray);
        }
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
        console.log('this.drawline:');
        console.log(this.drawline);
        //根据当前框选的区域，计算出对应的单元格子
        this.drawline.selectedGrid = [];
        let scrollTop = $('#seatMain').scrollTop();//滚动条滚动的高度
        let scrollLeft = $('#seatMain').scrollLeft();//滚动条滚动的宽度
        //当前框选区域原点（左上角的点）计算对应单元格子公式：
        //当前行索引 = Math.floor((原点Y坐标 - 座位区域离顶边的距离 + Y滚动条滚动的高度) / 单元格子的高度)
        //当前列索引 = Math.floor((原点X坐标 - 座位区域离左边的距离 + X滚动条滚动的宽度) / 单元格子的宽度)
        let rowIndexStart = Math.floor((this.drawline.top - this.minClientY + scrollTop) / this.seatNonBorderWidthHeight);
        let rowIndexEnd = Math.floor((this.drawline.top + this.drawline.height - this.minClientY + scrollTop) / this.seatNonBorderWidthHeight);
        let colIndexStart = Math.floor((this.drawline.left - this.minClientX + scrollLeft) / this.seatNonBorderWidthHeight);
        let colIndexEnd = Math.floor((this.drawline.left + this.drawline.width - this.minClientX + scrollLeft) / this.seatNonBorderWidthHeight);
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
          }
          this.drawline.selectedGrid.push(row);
        }
        this.drawline.drawing = false;
        console.log('this.drawline.selectedGrid:');
        console.log(this.drawline.selectedGrid);
        //根据操作类型生成座位格子
        this.drawSeatCell();
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
            this.addSeat();
            break;
          case 2:
            this.delSeat();
            break;
          default:
            break;
        }
        //根据第三层座位，生成行号、列号
        this.generateRowColNum();
      },
      //添加座位
      addSeat() {
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
            let cell = this.seatCellGrid[selectedCol.y][selectedCol.x];
            cell.row = this.seatRowNumArray[selectedCol.y].row;
            cell.col = this.seatColNumArray[selectedCol.x].col;
            cell.icon = 'iconfont-seaticon-single-normal';
          }
        }
      },
      //删除座位
      delSeat() {
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
            let cell = this.seatCellGrid[selectedCol.y][selectedCol.x];
            cell.icon = '';
            cell.row = '';
            cell.col = '';
          }
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
            if (!$.isPlainObject(cell) || $.trim(cell.icon) == '') {
              continue;
            }
            if (!hasSeatRow) {
              hasSeatRow = true;
              row += 1;
            }
            col += 1;
            cell.row = row;
            cell.col = col;

            //把行、列索引放入到数组变量中，然后根据行、列索引自动生成行号、列号
            if ($.inArray(cell.x - 1, seatRowIndexArray) == -1) {
              seatRowIndexArray.push(cell.x - 1);
            }
            if ($.inArray(cell.y - 1, seatColIndexArray) == -1) {
              seatColIndexArray.push(cell.y - 1);
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
        this.maxrowsize = Number(this.maxrowsize);
        this.generateSeatData();
      },
      /**
       * 最大列数改变事件处理，将重新初始化座位数据
       */
      maxcolsizeChangeHandler() {
        this.maxcolsize = Number(this.maxcolsize);
        this.generateSeatData();
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
        //console.log('seatMouseupHandler...');
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
        if (event.clientX > this.drawline.left && event.clientY > this.drawline.top) {
        }
        //从左下往右上画框，左上角原点坐标往上移动
        else if (event.clientX > this.drawline.left && event.clientY < this.drawline.top) {
          this.drawline.top = this.drawline.srcTop - this.drawline.height;
        }
        //从右上往左下画框，左上角原点坐标往左移动
        else if (event.clientX < this.drawline.left && event.clientY > this.drawline.top) {
          this.drawline.left = this.drawline.srcLeft - this.drawline.width;
        }
        //从右下往左上画框，左上角原点坐标往左上移动
        else if (event.clientX < this.drawline.left && event.clientY < this.drawline.top) {
          this.drawline.top = this.drawline.srcTop - this.drawline.height;
          this.drawline.left = this.drawline.srcLeft - this.drawline.width;
        }
        // console.log(this.drawline);
      },
      /**
       * 查询当前影厅座位图
       */
      queryHallSeat(){

      }
    },
    created: function(){
      //接收参数，并进行路由跳转设置
      this.params = this.$route.query;
      this.linkToHallList = '/ctm/cinemawall/list?cinemaUid=' + this.params.cinemaUid;
    },
    mounted: function () {
      //查询当前影厅座位图


      //初始化数据
      this.maxrowsize = 15;
      this.maxcolsize = 20;

      //初始化座位区域数据
      this.seatAreaGrid = [];
      for (let i = 0; i < this.maxrowsize; i++) {
        let colArray = [];
        for (let j = 0; j < this.maxcolsize; j++) {
          let cell = {};
          if(i >= 7 && i <= 9 && j >= 3 && j <= 6){
              cell.color = '#F8ECAB';
          }
          if(i >= 1 && i <= 5 && j >= 7 && j <= 12){
              cell.color = '#CAE3AE';
          }
          colArray.push(cell);
        }
        this.seatAreaGrid.push(colArray);
      }

      //初始化座位数据
      this.seatCellGrid = [];
      for (let i = 0; i < this.maxrowsize; i++) {
        let colArray = [];
        for (let j = 0; j < this.maxcolsize; j++) {
          let cell = {};
          cell.x = i + 1;
          cell.y = j + 1;
          if(i >= 2 && i <= 5 && j >= 1 && j <= 6){
            cell.row = i - 1;
            cell.col = j - 4;
            cell.icon = 'iconfont-seaticon-single-normal';
          }
          colArray.push(cell);
        }
        this.seatCellGrid.push(colArray);
      }

      //生成座位数据
      this.generateSeatData();
    }
  };
</script>
<style lang='scss'>
  $seatWidthHeight: 40px; //座位宽度高度
  $seatNonBorderWidthHeight: 41px; //没有线框的座位宽度高度
  /**整个页面样式**/
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
    background-image: url("../../../../assets/images/seat/single-normal.png");
  }

  /**座位图标显示--电动按摩单人座**/
  .iconfont-seaticon-single-message {
    @extend .iconfont-seaticon;
    background-image: url("../../../../assets/images/seat/single-massage.png");
  }

</style>


