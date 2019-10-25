<template>
  <div class="datacenter-btn">
    <div class="datacenter-btn-left">
      <span>
        报表页面数据按营业日（06:00:00-次日05:59:59）统计
        <span v-if="adsUpdateTime">，数据更新于{{adsUpdateTime}}</span>
      </span>
      <span class="group-content">
        <span v-if="dataBtnObj.isGroup === false">(无分组)</span>
        <span v-if="dataBtnObj.isGroup === true">
          (分组:
          <template v-for="(item, index) of dataBtnObj.groupColNameArr">
            <span :key="`groupItem_${index}`" ref="groupItem">{{ item.groupColName }}</span>
          </template>
          )
        </span>
      </span>
    </div>
    <div class="datacenter-btn-right">
      <div class="datacenter-btn-rightul">
        <button class="data-button" v-if="dataBtnObj.rightGroupArr.length != 0 || dataBtnObj.rightGroupsShow.length != 0" @click="handleMergeTable">切换表格</button>
        <!-- 自定义模板下拉菜单 -->
        <el-dropdown v-if="dataBtnObj.showStyleList" trigger="click" @click.native="handleMuneBtnClick" class="style-dropdown">
          <el-button type="primary">
            <span style="font-family: 'MicrosoftYaHei'; font-size: 12px;">样式</span>
            <i class="el-icon-arrow-down el-icon--right" style="font-size: 12px;"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown @visible-change="handleVisibleChange" v-if="dataBtnObj.showStyleList" trigger="hover" placement="right-start">
              <el-button type="primary">
                <el-dropdown-item style="color:#606266!important;" @mouseenter.native="handleMouseEnter" @mouseleave.native="handleMouseLeave">
                  <span>切换样式</span>
                  <span>
                    <i class="el-icon-arrow-right" style="margin-left: 0;"></i>
                  </span>
                </el-dropdown-item>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item ref="dropDefault" @mouseenter.native="handleMouseEnter" @mouseleave.native="handleMouseLeave" @click.native="setStyle('default')"><span>默认模板</span></el-dropdown-item>
                <template v-for="(item,index) in styleNameList">
                  <el-dropdown-item @mouseenter.native="handleMouseEnter" @mouseleave.native="handleMouseLeave" ref="dropItem" @click.native="setStyle(item)" :key="`dropItem_${index}`"><span>{{item}}</span></el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown-item style="color:#606266!important;" @mouseenter.native="handleMouseEnter" @mouseleave.native="handleMouseLeave" v-if="dataBtnObj.styleNameData !== '默认模板'" ref="updateStyleItem" @click.native="handleUpdateClick">更新样式</el-dropdown-item>
            <el-dropdown-item style="color:#606266!important;" @mouseenter.native="handleMouseEnter" @mouseleave.native="handleMouseLeave" @click.native="handleSaveClick">保存为新样式</el-dropdown-item>
            <el-dropdown-item style="color:#606266!important;" @mouseenter.native="handleMouseEnter" @mouseleave.native="handleMouseLeave" @click.native="handleDeleteClick">删除</el-dropdown-item>
            <!-- <el-dropdown-item
              v-if="dataBtnObj.rightGroupArr.length != 0 || dataBtnObj.rightGroupsShow.length != 0"
              @click.native="handleMergeTable"
            >切换表格</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
        <button class="data-button" @click="setCommonBtn">自定义表头</button>
        <button class="data-button" @click="setgroupView">分组查看</button>
        <!-- <button
          class="data-button"
          @click="printTable"
          v-if="dataBtnObj.rightGroupArr.length == 0"
        >打印</button>
        <button
          class="data-button"
          @click="groupDatatable"
          v-if="dataBtnObj.rightGroupArr.length != 0"
        >打印</button> -->
        <!-- <button
          class="data-button"
          ref="exportBtn"
          @click="pagesExport"
          :disabled="isdisable"
        >导出Excel</button> -->
        <el-dropdown trigger="click" class="print-export-dropdown">
          <el-button class="print-export-button">导出打印<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown" class="print-export-dropmenu">
            <el-dropdown-item style="color:#606266!important;" @mouseenter.native="handleMouseEnter" @mouseleave.native="handleMouseLeave" @click.native="pagesExport">导出</el-dropdown-item>
            <el-dropdown-item style="color:#606266!important;" @mouseenter.native="handleMouseEnter" @mouseleave.native="handleMouseLeave" @click.native="printTable" v-if="dataBtnObj.rightGroupArr.length == 0">打印</el-dropdown-item>
            <el-dropdown-item style="color:#606266!important;" @mouseenter.native="handleMouseEnter" @mouseleave.native="handleMouseLeave" @click.native="groupDatatable" v-if="dataBtnObj.rightGroupArr.length != 0 && mergeTableObj.isMerged === false">打印</el-dropdown-item>
            <el-dropdown-item style="color:#606266!important;" @mouseenter.native="handleMouseEnter" @mouseleave.native="handleMouseLeave" @click.native="handleMergeTablePrint" v-if="dataBtnObj.rightGroupArr.length != 0 && mergeTableObj.isMerged === true">打印</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- 保存、更新模板定义样式名弹框 -->
      <el-dialog :title="dialogTitle" :visible.sync="styleDialogVisible" :lock-scroll="false" :show-close="false" :close-on-click-modal="false" width="30%">
        <span v-if="saveOrUpdate === 'save'">保存当前报表样式，请为该样式定义一个新名称。</span>
        <span v-if="saveOrUpdate === 'update'">更新当前报表样式，请为该样式定义一个新名称。</span>
        <el-input v-if="saveOrUpdate === 'save'" v-model="inputStyleName" placeholder="请输入您要保存的样式名"></el-input>
        <el-input v-if="saveOrUpdate === 'update'" v-model="inputStyleName" placeholder="请输入您要更新的样式名"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="saveOrUpdate === 'save'" type="primary" @click="comfirmSaveStyle('save')">确 定</el-button>
          <el-button v-if="saveOrUpdate === 'update'" type="primary" @click="comfirmUpdateStyle('update')">确 定</el-button>
          <el-button @click="cancleStyleNameDialog">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 自定义表头弹框 -->
      <my-dialog :title="'自定义表头'" :dialogWidth="1016" :dialogHeight="576" :dialogContentHeight="300" :isShow="colView" :marginBottom="1" @handleBtnComfirmClick="setQdBtn" @handleBtnCancelClick="setDeBtn" @close="handleClose('2')">
        <div slot="dialog-content">
          <div class="common-box">
            <ul class="common-box-query1">
              <draggable v-model="dataBtnObj.nowColArr" :options="{group:'people', ghostClass: 'ghost-item'}" :move="moveCol" @start="dragStart">
                <li class="commonbox-query-coment" v-for="(element,index) in dataBtnObj.nowColArr" :key="`comment1_${index}`">{{ element.label }}</li>
              </draggable>
            </ul>
            <div class="commonbox-query-tips">将不需要展示的表头拖到此处</div>
            <ul class="common-box-query2">
              <draggable v-model="dataBtnObj.nownoColArr" :options="{group:'people', ghostClass: 'ghost-item', dragClass: 'drag-item'}" :move="moveCol">
                <li class="commonbox-query-coment" v-for="(element, idx) in dataBtnObj.nownoColArr" :key="`comment2_${idx}`">{{ element.label }}</li>
              </draggable>
            </ul>
          </div>
        </div>
      </my-dialog>
      <!-- 分组查看弹框 -->
      <my-dialog :title="'分组查看'" :dialogWidth="576" :dialogHeight="576" :dialogVisible="200" :isShow="groupView" :marginBottom="dialogHeaderMarginBottom" @handleBtnComfirmClick="QdGroupView" @handleBtnCancelClick="DeGroupView" @close="handleClose('3')">
        <div slot="dialog-content">
          <div class="groupView-box">
            <div class="groupView-left">
              <div class="groupView-left-header">
                <el-checkbox :indeterminate="leftGroupIndeterminate" v-model="leftGroupsCheckAll" @change="handleCheckAllChange">全选</el-checkbox>
              </div>
              <div class="groupView-left-main">
                <el-checkbox-group v-model="leftGroupsChecked" @change="handleCheckedCitiesChange">
                  <el-checkbox v-for="(city, index) in dataBtnObj.leftGroupsShow" :label="city" :key="`city${index}`">{{city.groupColName}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="groupView-middle">
              <div class="groupView-middle-box positioncenter">
                <el-button plain @click="addValue">
                  添加
                  <i class="el-icon-arrow-right"></i>
                </el-button>
                <el-button plain @click="deValue">
                  <i class="el-icon-arrow-left"></i>删除
                </el-button>
              </div>
            </div>
            <div class="groupView-right">
              <div class="groupView-left-header">
                <el-checkbox :indeterminate="rightGroupIndeterminate" v-model="rightGroupsCheckAll" @change="newhandleCheckAllChange">全选</el-checkbox>
              </div>
              <div class="groupView-left-main">
                <el-checkbox-group v-model="rightGroupsChecked" @change="newhandleCheckedCitiesChange">
                  <template v-for="(city,index) in dataBtnObj.rightGroupsShow">
                    <div class="right-show" :key="`rightShow${city.seq}${index}`">
                      <div class="checkbox-wrapper">
                        <el-checkbox class="checkbox" :label="city">{{city.groupColName}}</el-checkbox>
                      </div>
                      <div class="sequence-button-wrapper">
                        <i class="iconfont icon-neiye-paixushangmoren" :id="city.seq" @click="upClick"></i>
                        <i class="iconfont icon-neiye-paixuxiaxuanzhong" :id="city.seq" @click="downClick"></i>
                      </div>
                    </div>
                  </template>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </div>
      </my-dialog>
    </div>
  </div>
</template>
<script>
import datacenterBus from 'rptSrc/util/datacenterBus.js';
import draggable from 'vuedraggable';
// import Config from "../../../frame_cpm/http/config";
import MyDialog from './dataCommon/myDialog.vue';
import FormatDate from '../../util/formatDate.js';
// import store from "../../../frame_cpm/vuex/index";
import md5 from 'js-md5';
import Qs from 'qs';
import { mapState } from 'vuex';
import { messageAlertFunc } from 'rptSrc/util/commonFunc.js';
// 数组取差值
function diff (arr1, arr2) {
  return arr1.concat(arr2).filter(function (arg) {
    return !(arr1.indexOf(arg) >= 0 && arr2.indexOf(arg) >= 0);
  });
}
// 数组去重
function removeRepeatByFilter (array) {
  return array.filter(function (item, index) {
    return array.indexOf(item) === index;
  });
}
// 按参数排序
function compare (property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  };
}
function app (arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].seq = i + 1;
  }
  return arr;
}
function getElementPageLeft (element) {
  var actualLeft = element.offsetLeft;
  var parent = element.offsetParent;
  while (parent != null) {
    actualLeft +=
      parent.offsetLeft + (parent.offsetWidth - parent.clientWidth) / 2;
    parent = parent.offsetParent;
  }
  return actualLeft;
}

function getElementPageTop (element) {
  var actualTop = element.offsetTop;
  var parent = element.offsetParent;
  while (parent != null) {
    actualTop +=
      parent.offsetTop + (parent.offsetHeight - parent.clientHeight) / 2;
    parent = parent.offsetParent;
  }
  return actualTop;
}

export default {
  components: {
    draggable,
    MyDialog
  },
  props: {
    // 表头
    colArr: Array, // 不显示的列
    styleColArr: Array, // 显示的列
    datatable: Array,

    // 分组左边
    groupArr: Array,
    // 分组右边
    styleGroupArr: Array,
    Pagination: Object,
    styleUid: String,
    styleArr: Array,
    reportCode: String,
    isDef: {
      type: [Number, String]
    },
    tableName: String,
    styleExtQueryArr: Array,
    styleName: String,
    reportName: String,
    baseQueryArr: Array,
    getDataSucc: Boolean,
    dataBtnObj: Object,
    mergeTableObj: Object,
    isSearched: Boolean,
    cinemaUid: String
  },
  data () {
    return {
      // ======================自定义表头窗口元素===============================
      // 是否显示自定义表头窗口
      colView: false,
      // 存放自定义表头数组
      cunNewArray: [],
      // 存放自定义表头隐藏数组
      nocunNewArray: [],
      // 表头是否移动，默认为否
      isColMove: false,

      // ======================分组窗口元素========================
      // 是否显示分组查看窗口
      groupView: false,
      // 左边分组全选状态
      leftGroupsCheckAll: false,
      // 左边分组不是全选状态：-号显示
      leftGroupIndeterminate: false,
      // 选中的左边分组
      leftGroupsChecked: [],
      leftGroupsShow: [],
      // 左边分组的存放状态
      leftGroupsActive: [],

      // 右边分组全选状态
      rightGroupsCheckAll: false,
      // 右边分组不是全选状态：-号显示
      rightGroupIndeterminate: false,
      // 选中的右边分组
      rightGroupsChecked: [],
      // 右边分组的存放状态
      rightGroupsActive: [],
      // 选择影院
      orgNameString: '',
      // 交易时间
      dataTime: '',
      // // 导出按钮状态
      // isdisable: false,
      // 自定义的样式名
      inputStyleName: '',
      showStyleSelect: false,
      // 样式列表
      styleNameList: [],
      // 弹框样式
      dialogTitle: '',
      // 是否保存或更新模板样式
      saveOrUpdate: '',
      // 是否调整了模板样式
      styleStatus: false,
      // 点击添加分组的次数
      addCount: 0,
      // 点击删除分组的次数
      delCount: 0,
      // 是否点击确认分组
      isComfirmGroup: false,
      // 有筛选条件的数据
      searchData: [],
      styleDialogVisible: false,
      dialogHeaderMarginBottom: 0,
      selectedStatus: false,
      setStyleStatus: false
    };
  },
  computed: mapState({
    adsUpdateTime: state => state.rpt.adsUpdateTime
  }),
  watch: {
    styleColArr: {
      handler (newVal, oldVal) {
        this.dataBtnObj.nowColArr = newVal;
      },
      deep: true
    },
    getDataSucc (newVal, oldVal) {
      if (this.styleArr != null && this.styleArr.length > 0) {
        // this.dataBtnObj.showStyleSave = false;
        this.dataBtnObj.showStyleList = true;
      }
    },
    groupArr: {
      handler (newVal, oldVal) {
        this.dataBtnObj.leftGroupArr = newVal;
      },
      deep: true
    },
    styleGroupArr: {
      handler (newVal, oldVal) {
        this.dataBtnObj.rightGroupArr = newVal;
      },
      deep: true
    },
    styleName (newVal, oldVal) {
      this.dataBtnObj.styleNameData = newVal;
    }
  },
  methods: {
    handleMergeTable () {
      if (this.mergeTableObj.isMerged) {
        datacenterBus.$emit('setMergeTable', false);
        this.$emit('searchButtonClick');
        this.$emit(
          'groupArrEvent',
          this.dataBtnObj.leftGroupArr,
          this.dataBtnObj.rightGroupArr
        );
      } else {
        datacenterBus.$emit('setMergeTable', true);
      }
    },
    printTable () {
      this.$emit('printTable');
    },
    groupDatatable () {
      this.$emit('groupDatatable');
    },
    handleMergeTablePrint () {
      this.$emit('handleMergeTablePrint');
    },
    pagesExport () {
      if (this.isSearched == false) {
        const message = '请先执行查询后再进行导出！';
        this.$message({
          message: message,
          iconClass: 'iconfont icon-danchuang-jingtanhao',
          customClass: 'rpt-alert-message',
          center: 'true'
        });
        throw message;
      }
      let self = this;

      // let value, queryArr;
      // if (this.searchData.lenght != 0) {
      //   value = JSON.parse(JSON.stringify(this.searchData));
      // }
      // if (value.length > 0) {
      //   queryArr = value;
      // } else {
      //   queryArr = this.baseQueryArr;
      // }
      // if (this.styleExtQueryArr != null) {
      //   queryArr = queryArr.concat(this.styleExtQueryArr);
      // }

      // messageAlertFunc(this, queryArr);
      messageAlertFunc(this, this.dataBtnObj.queryStoreData);

      let tableHeaderArray = JSON.parse(JSON.stringify(this.styleColArr));

      if (this.reportCode == 'T05') {
        let tableHeaderArray = JSON.parse(JSON.stringify(this.styleColArr));
        let temArray = tableHeaderArray.filter(element => element.colKey == 'pay_type_price');
        let deleteIndex = tableHeaderArray.findIndex(element => element.colKey == 'pay_type_price');
        tableHeaderArray.splice(deleteIndex, 1);
        temArray[0].children && temArray[0].children.forEach(element => tableHeaderArray.splice(deleteIndex, 0, element));
      }

      let timestamp = new Date().getTime();
      let datapagesExport = {
        cinemaName: self.orgNameString,
        startTime: self.dataTime,
        summaryFlag: 1,
        reportTableInfo: {
          reportName: self.reportName,
          reportCode: self.reportCode,
          tableName: self.tableName,
          colArr: tableHeaderArray,
          groupArr: self.styleGroupArr,
          queryArr: this.dataBtnObj.queryStoreData
        }
      };
      let headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: this.$store.state.loginToken,
        timestamp: timestamp,
        sign: md5(this.$store.state.loginToken + this.$store.state.signKey + timestamp),
        'Cpm-User-Token': sessionStorage.getItem('token')
      };
      let $axios = axios.create({
        headers: headers,
        timeout: 10000, // 设置超时时间
        withCredentials: false, // 携带凭证
        responseType: 'blob'
      });
      $axios
        .post(this.$store.state.default.apiConfig.baseURL + `/report/report/exportExcel`, datapagesExport)
        .then(res => {
          const link = document.createElement('a');
          let blob = new Blob([res.data], {
            // type: "application/vnd.ms-excel"
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
          });
          link.style.display = 'none';
          link.href = URL.createObjectURL(blob);
          let num = '';
          for (let i = 0; i < 10; i++) {
            num += Math.ceil(Math.random() * 10);
          }
          link.setAttribute('download', `${this.reportName}.xlsx`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          Vue.nextTick(() => {
            // this.$refs.exportBtn.style =
            //   "border: 1px solid #3B74FF; color: #3B74FF";
            // self.isdisable = false;
            this.$message({
              message: 'Excel导出完成',
              iconClass: 'iconfont icon-danchuang-wancheng',
              customClass: 'rpt-alert-message',
              center: 'true'
            });
          });
        })
        .catch(msg => {
          this.$message({
            message: msg,
            iconClass: 'iconfont icon-danchuang-jingtanhao',
            customClass: 'rpt-alert-message',
            center: 'true'
          });
          // this.$refs.exportBtn.style =
          //   "border: 1px solid #3B74FF; color: #3B74FF";
          // self.isdisable = false;
        });
      // this.$refs.exportBtn.style = "border: 1px solid #cedcff; color: #cedcff";
      // this.isdisable = true;
    },
    closeCommonDialog: function () {
      this.dataBtnObj.nowColArr = this.cunNewArray;
      this.dataBtnObj.nownoColArr = this.nocunNewArray;
    },
    setCommonBtn: function () {
      this.dataBtnObj.nowColArr = this.styleColArr;
      this.dataBtnObj.nownoColArr = this.colArr;
      this.cunNewArray = this.styleColArr;
      this.nocunNewArray = this.colArr;
      this.colView = true;
    },
    setQdBtn () {
      // 传给表头展示的数据
      this.dataBtnObj.nowColArr = app(this.dataBtnObj.nowColArr);
      // 表头不显示的数据
      this.dataBtnObj.nownoColArr = app(this.dataBtnObj.nownoColArr);
      this.$emit(
        'setStyleColArr',
        this.dataBtnObj.nowColArr,
        this.dataBtnObj.nownoColArr
      );
      this.$store.commit('setColArr', this.dataBtnObj.nowColArr);
      this.colView = false;

      // 如果移动了自定义列
      if (this.isColMove) {
        // 右边分组移到左边
        let tempGroupArray = this.dataBtnObj.leftGroupArr.concat(
          this.dataBtnObj.rightGroupArr
        );
        // 左边分组重新排序
        this.dataBtnObj.leftGroupArr = tempGroupArray.sort(compare('seq'));
        // 右边分组清空
        this.dataBtnObj.rightGroupArr = [];
        // 向上级页面传值，渲染全部
        this.$emit(
          'groupArrEvent',
          this.dataBtnObj.leftGroupArr,
          this.dataBtnObj.rightGroupArr
        );
        // 暂存按钮点击操作，等待页面元素渲染完成再执行
        this.$nextTick(() => {
          // 调用查询按钮点击事件
          // datacenterBus.$emit("searchButtonClick");
          this.$emit('searchButtonClick');
        });

        // 重置自定义表头移动状态
        this.isColMove = false;
        this.styleStatus = true;
      }
    },
    setDeBtn: function () {
      this.colView = false;
    },
    closeGroupDialog: function () {
      this.dataBtnObj.leftGroupsShow = this.leftGroupsActive;
      this.dataBtnObj.rightGroupsShow = this.rightGroupsActive;
      this.leftGroupsChecked = [];
      this.rightGroupsChecked = [];
      this.leftGroupIndeterminate = false;
      this.rightGroupIndeterminate = false;
      this.leftGroupsCheckAll = false;
      this.rightGroupsCheckAll = false;
      this.groupView = false;
    },

    // 点击分组查询
    setgroupView: function () {
      this.dialogHeaderMarginBottom = 16;
      this.groupView = true;

      // 这里不能直接将groupArr赋值给leftGroupsShow
      // 因为我们要根据列是否有显示来决定列是否能分组，直接赋值，容易造成分组数组丢失内容
      // 所以这里要声明一个空数组来存放东西
      this.dataBtnObj.leftGroupsShow = [];
      // 循环整个不显示分组数组
      for (var i = 0; i < this.dataBtnObj.leftGroupArr.length; i++) {
        var isGroupShow = true; // 该分组是否显示，默认为true,即显示
        // 循环遍历不显示的列头数组
        for (var j = 0; j < this.colArr.length; j++) {
          // 根据业务逻辑，如果不显示的列头中，有该分组的key，则该分组也不显示
          if (
            this.colArr[j].colKey == this.dataBtnObj.leftGroupArr[i].groupColKey
          ) {
            isGroupShow = false;
          }
        }
        // 如果该分组没在不显示的列头中，则保存到要显示的左边分组数组中
        if (isGroupShow) { this.dataBtnObj.leftGroupsShow.push(this.dataBtnObj.leftGroupArr[i]); }
      }

      this.dataBtnObj.rightGroupsShow = this.dataBtnObj.rightGroupArr;
      this.leftGroupsActive = this.dataBtnObj.leftGroupsShow;
      this.rightGroupsActive = this.dataBtnObj.rightGroupsShow;

      // 循环遍历，如果没有选定列头，则不显示该分组
      for (var i = 0; i < this.colArr.length; i++) {
        for (var j = 0; j < this.dataBtnObj.leftGroupsShow.length; j++) {
          if (
            this.colArr[i].colKey ==
            this.dataBtnObj.leftGroupsShow[j].groupColKey
          ) {
            this.dataBtnObj.leftGroupsShow.splice(j, 1); // 将使后面的元素依次前移，数组长度减1
            j--; // 如果不减，将漏掉一个元素
          }
        }
      }
      this.dataBtnObj.isOpenedGroupDialog = true;
    },

    DeGroupView: function () {
      this.groupView = false;
    },
    QdGroupView: function () {
      if (this.cinemaUid === '') {
        this.$message({
          message: '请先选择影院',
          iconClass: 'iconfont icon-danchuang-jingtanhao',
          customClass: 'rpt-alert-message',
          center: 'true'
        });
      } else {
        this.isComfirmGroup = true;
        // 分组详情展示
        this.dataBtnObj.groupColNameArr = JSON.parse(
          JSON.stringify(this.dataBtnObj.rightGroupsShow)
        );
        if (this.dataBtnObj.groupColNameArr.length > 0) {
          this.dataBtnObj.isGroup = true;
        } else {
          this.dataBtnObj.isGroup = false;
        }
        for (let i = 0; i < this.dataBtnObj.groupColNameArr.length; i++) {
          if (i < this.dataBtnObj.groupColNameArr.length - 1) {
            this.dataBtnObj.groupColNameArr[i].groupColName += '、';
          }
        }

        // 左边分组  右边分组排序
        this.dataBtnObj.leftGroupsShow = app(this.dataBtnObj.leftGroupsShow);
        this.dataBtnObj.rightGroupsShow = app(this.dataBtnObj.rightGroupsShow);

        // 渲染分组到父页面
        this.$emit(
          'groupArrEvent',
          this.dataBtnObj.leftGroupsShow,
          this.dataBtnObj.rightGroupsShow
        );
        // 暂存按钮点击操作，等待页面元素渲染完成再执行
        Vue.nextTick(() => {
          // 调用查询按钮点击事件
          // this.$emit("searchButtonClick");
          !this.mergeTableObj.isMerged && this.styleGroupArr.length > 0
            ? datacenterBus.$emit('setMergeTable', true)
            : this.$emit('searchButtonClick');
        });

        this.$emit(
          'groupArrEvent',
          this.dataBtnObj.leftGroupsShow,
          this.dataBtnObj.rightGroupsShow
        );
        this.groupView = false;
        this.styleStatus = true;
        if (this.dataBtnObj.rightGroupsShow.length === 0) { datacenterBus.$emit('setMergeTable', false); }
      }
    },
    handleCheckAllChange (val) {
      this.leftGroupsChecked = val ? this.dataBtnObj.leftGroupsShow : [];
      this.leftGroupIndeterminate = false;
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length;
      this.leftGroupsCheckAll =
        checkedCount === this.dataBtnObj.leftGroupsShow.length;
      this.leftGroupIndeterminate =
        checkedCount > 0 &&
        checkedCount < this.dataBtnObj.leftGroupsShow.length;
    },
    addValue: function () {
      this.addCount++;
      if (this.dataBtnObj.rightGroupsShow == null) {
        this.dataBtnObj.rightGroupsShow = [];
      }

      if (
        this.dataBtnObj.rightGroupsShow.length + this.leftGroupsChecked.length >
        7
      ) {
        this.$message({
          message: '最多支持选择7个',
          iconClass: 'iconfont icon-danchuang-jingtanhao',
          customClass: 'rpt-alert-message',
          center: 'true'
        });
        this.leftGroupsChecked = [];
        this.leftGroupIndeterminate = false;
        this.leftGroupsCheckAll = false;
      } else if (this.leftGroupsChecked.length == 0) {
        this.$message({
          message: '请勾选最少一个选项',
          iconClass: 'iconfont icon-danchuang-jingtanhao',
          customClass: 'rpt-alert-message',
          center: 'true'
        });
      } else {
        this.dataBtnObj.rightGroupsShow = this.dataBtnObj.rightGroupsShow.concat(
          this.leftGroupsChecked
        );
        let newArray = diff(
          this.leftGroupsChecked,
          this.dataBtnObj.leftGroupsShow
        );
        this.dataBtnObj.leftGroupsShow = newArray;
        this.leftGroupIndeterminate = false;
        this.leftGroupsChecked = [];
      }
    },
    deValue: function () {
      this.delCount++;
      this.dataBtnObj.rightGroupsShow = diff(
        this.rightGroupsChecked,
        this.dataBtnObj.rightGroupsShow
      );
      let ValueArray = removeRepeatByFilter(
        this.dataBtnObj.leftGroupsShow.concat(this.rightGroupsChecked)
      );
      this.dataBtnObj.leftGroupsShow = ValueArray.sort(compare('seq'));
      this.rightGroupsChecked = [];
      this.rightGroupIndeterminate = false;
      if (this.dataBtnObj.rightGroupsShow.length === 0) {
        this.rightGroupIndeterminate = false;
        this.rightGroupsCheckAll = false;
      }
    },
    upClick (e) {
      let newRightGroupsShow = [];
      for (let i = 0; i < this.dataBtnObj.rightGroupsShow.length; i++) {
        if (e.target.id == this.dataBtnObj.rightGroupsShow[i].seq) {
          if (i > 0) {
            newRightGroupsShow[i - 1] = this.dataBtnObj.rightGroupsShow[i];
            newRightGroupsShow[i] = this.dataBtnObj.rightGroupsShow[i - 1];
          } else {
            newRightGroupsShow[i] = this.dataBtnObj.rightGroupsShow[i];
          }
        } else {
          newRightGroupsShow.push(this.dataBtnObj.rightGroupsShow[i]);
        }
      }
      this.dataBtnObj.rightGroupsShow = newRightGroupsShow;
    },
    downClick (e) {
      let newRightGroupsShow = [];
      let j;
      for (let i = 0; i < this.dataBtnObj.rightGroupsShow.length; i++) {
        if (e.target.id == this.dataBtnObj.rightGroupsShow[i].seq) {
          j = i;
          if (i < this.dataBtnObj.rightGroupsShow.length - 1) {
            newRightGroupsShow[i + 1] = this.dataBtnObj.rightGroupsShow[i];
            newRightGroupsShow[i] = this.dataBtnObj.rightGroupsShow[i + 1];
          } else {
            newRightGroupsShow[i] = this.dataBtnObj.rightGroupsShow[i];
          }
        } else {
          if (i != j && i != j + 1) {
            newRightGroupsShow[i] = this.dataBtnObj.rightGroupsShow[i];
          }
        }
      }
      this.dataBtnObj.rightGroupsShow = newRightGroupsShow;
    },
    newhandleCheckAllChange (val) {
      this.rightGroupsChecked = val ? this.dataBtnObj.rightGroupsShow : [];
      this.rightGroupIndeterminate = false;
    },
    newhandleCheckedCitiesChange (value) {
      let checkedCount = value.length;
      this.rightGroupsCheckAll =
        checkedCount === this.dataBtnObj.rightGroupsShow.length;
      this.rightGroupIndeterminate =
        checkedCount > 0 &&
        checkedCount < this.dataBtnObj.rightGroupsShow.length;
    },
    saveStyle (value) {
      // 组合参数
      let uId;
      if (value === 'save') {
        uId = '';
      }
      if (value === 'update') {
        uId = this.styleUid;
      }
      let param = {
        styleUid: uId,
        reportCode: this.reportCode,
        styleName: this.dataBtnObj.styleNameData,
        isDef: this.isDef,
        styleColArr: this.styleColArr,
        styleExtQueryArr: this.styleExtQueryArr,
        styleGroupArr: this.dataBtnObj.rightGroupArr
      };
      // 调用api， 保存样式接口
      this.$rptList
        .saveUserStyle(param)
        .then(data => {
          // 弹框提示保存结果
          if (data.code == '0') {
            datacenterBus.$emit('getAllStyles', data.data);

            this.$message({
              message: data.message,
              iconClass: 'iconfont icon-danchuang-wancheng',
              customClass: 'rpt-alert-message',
              center: 'true',
              duration: 2
            });
          } else {
            this.$message({
              message: data.message,
              iconClass: 'iconfont icon-danchuang-cuowu',
              customClass: 'rpt-alert-message',
              center: 'true'
            });
          }
        })
        .catch(msg => {
          console.log(msg);
        });
    },
    // 保存个人样式
    keepBtn: function () {
      if (this.styleStatus === true) {
        this.styleDialogVisible = true;
        this.dialogTitle = '保存样式';
        this.saveOrUpdate = 'save';
      } else {
        this.$message({
          message: '默认模板不需要保存',
          iconClass: 'iconfont icon-danchuang-cuowu',
          customClass: 'rpt-alert-message',
          center: 'true'
        });
      }
    },
    cancleStyleNameDialog () {
      this.styleDialogVisible = false;
    },
    comfirmSaveStyle (value) {
      if (
        /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(this.inputStyleName) &&
        this.inputStyleName.length <= 20
      ) {
        if (this.styleNameList.includes(this.inputStyleName)) {
          this.$message({
            message: '样式名已存在,请重新输入！',
            iconClass: 'iconfont icon-danchuang-jingtanhao',
            customClass: 'rpt-alert-message',
            center: 'true'
          });
        } else {
          this.dataBtnObj.styleNameData = this.inputStyleName;
          this.styleNameList.push(this.inputStyleName);
          this.styleDialogVisible = false;
          this.selectedStatus = true;
          // 发起请求保存样式
          this.saveStyle(value);
          this.dataBtnObj.showStyleList = true;
          // this.dataBtnObj.showStyleSave = false;
          this.styleStatus = false;
        }
      } else {
        this.$message({
          message: '只能输入字母、下划线、数字等常规字符，并且不能超过20个！',
          iconClass: 'iconfont icon-danchuang-jingtanhao',
          customClass: 'rpt-alert-message',
          center: 'true'
        });
      }
    },
    handleClose (value) {
      // if (value === "1") {
      //   this.styleDialogVisible = false;
      // }
      if (value === '2') {
        this.colView = false;
      }
      if (value === '3') {
        this.groupView = false;
      }
    },
    handleDragStart (event) {
      event.path[0].style.background = '#3b74ff';
      event.path[0].style.border = 'none';
    },
    handleDragEnd (event) {
      event.path[0].style.background = '#ffffff';
      event.path[0].style.border = '1px solid #bcbcbc';
    },
    // 移动表头响应事件
    moveCol: function (event) {
      this.isColMove = true;
    },
    dragStart (event) { },
    comfirmUpdateStyle (value) {
      if (
        /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(this.inputStyleName) &&
        this.inputStyleName.length <= 20
      ) {
        this.styleDialogVisible = false;
        this.styleNameList.splice(
          this.styleNameList.findIndex(
            element => element === this.dataBtnObj.styleNameData
          ),
          1
        );
        this.dataBtnObj.styleNameData = this.inputStyleName;
        this.selectedStatus = true;
        this.saveStyle(value);
      } else {
        this.$message({
          message: '只能输入字母、下划线、数字等常规字符，并且不能超过20个！',
          iconClass: 'iconfont icon-danchuang-jingtanhao',
          customClass: 'rpt-alert-message',
          center: 'true'
        });
      }
    },
    handleUpdateClick () {
      let isSystem;
      this.inputStyleName = this.dataBtnObj.styleNameData;
      this.styleArr.forEach(element => {
        if (element.styleName === this.dataBtnObj.styleNameData) {
          isSystem = element.isSys;
        }
      });
      if (isSystem !== 'true') {
        this.styleDialogVisible = true;
        this.dialogTitle = '更新样式';
        this.saveOrUpdate = 'update';
      } else {
        this.$message({
          message: '不能更新系统样式！',
          iconClass: 'iconfont icon-danchuang-jingtanhao',
          customClass: 'rpt-alert-message',
          center: 'true'
        });
      }
    },
    handleSaveClick () {
      this.styleDialogVisible = true;
      this.dialogTitle = '保存样式';
      this.inputStyleName = this.dataBtnObj.styleNameData;
      this.saveOrUpdate = 'save';
      this.setStyleStatus = true;
    },
    handleDeleteClick () {
      let isSystem;
      this.styleArr.forEach(element => {
        if (element.styleName === this.dataBtnObj.styleNameData) {
          isSystem = element.isSys;
        }
      });
      if (isSystem === 'true') {
        this.$message({
          message: '不能删除系统样式！',
          iconClass: 'iconfont icon-danchuang-jingtanhao',
          customClass: 'rpt-alert-message',
          center: 'true'
        });
      } else if (this.dataBtnObj.styleNameData === '默认模板') {
        this.$message({
          message: '不能删除默认模板！',
          iconClass: 'iconfont icon-danchuang-jingtanhao',
          customClass: 'rpt-alert-message',
          center: 'true'
        });
      } else {
        this.$confirm('此操作将删除该样式, 是否继续?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          lockScroll: false,
          showClose: false,
          customClass: 'rpt-alert-confirm',
          iconClass: 'iconfont icon-danchuang-jingtanhao'
        })
          .then(() => {
            this.$rptList.deleteUserStyle(this.styleUid).then(res => {
              let index;
              for (let i = 0; i < this.styleArr.length; i++) {
                if (this.styleArr[i].styleUid === this.styleUid) {
                  this.styleArr.splice(i, 1);
                  index = i;
                }
              }
              for (let i = 0; i < this.styleNameList.length; i++) {
                if (
                  this.styleNameList[i] === this.dataBtnObj.styleNameData &&
                  this.dataBtnObj.styleNameData != '默认主题'
                ) {
                  this.styleNameList.splice(i, 1);
                }
              }
              // datacenterBus.$emit("getStyle", this.styleArr[index].styleUid);
              console.log(this.styleArr);

              localStorage.setItem('baseData', JSON.stringify(this.baseQueryArr));
              localStorage.setItem('extendData', JSON.stringify(this.styleExtQueryArr));
              this.$emit('getStyle', this.styleArr.length == 0 ? '-1' : this.styleArr[index].styleUid);
              this.$message({
                message: '删除成功',
                iconClass: 'iconfont icon-danchuang-wancheng',
                customClass: 'rpt-alert-message',
                center: 'true'
              });
            });
          })
          .catch(() => {
            this.$message({
              message: '已取消删除',
              iconClass: 'iconfont icon-danchuang-jingtanhao',
              customClass: 'rpt-alert-message',
              center: 'true'
            });
          });
      }
    },
    setStyle (item) {
      let styleUid;
      if (item === 'default') {
        styleUid = '-1';
      } else {
        this.styleArr.forEach(element => {
          if (element.styleName === item) {
            styleUid = element.styleUid;
          }
        });
      }

      // 切换模版时保存query区域的所有输入条件
      localStorage.setItem('baseData', JSON.stringify(this.baseQueryArr));
      localStorage.setItem('extendData', JSON.stringify(this.styleExtQueryArr));
      this.$emit('getStyle', styleUid);
    },
    // 点击样式按钮获取以保存的样式名
    handleMuneBtnClick () {
      if (this.styleNameList.length === 0) {
        let nameArr = [];
        this.styleArr.forEach(element => {
          nameArr.push(element.styleName);
        });
        this.styleNameList = nameArr.reverse();
      } else {
        8;
        if (
          this.styleNameList.indexOf(this.dataBtnObj.styleNameData) < 0 &&
          this.dataBtnObj.styleNameData != '默认模板'
        ) {
          this.styleNameList.push(this.dataBtnObj.styleNameData);
        }
      }
    },
    handleVisibleChange () {
      // 切换分组菜单中当前模板的样式
      let dropItem = this.$refs.dropItem;
      let dropDefault = this.$refs.dropDefault;
      if (
        dropDefault.$el.children[0].innerText === this.styleName &&
        this.setStyleStatus === false
      ) {
        dropDefault.$el.style.color = '#7890ff';
        if (dropItem) {
          dropItem.forEach(element => {
            element.$el.style.color = '#606266';
          });
        }
      } else {
        dropDefault.$el.style.color = '#606266';
        if (dropItem) {
          dropItem.forEach(element => {
            let item = element.$el.children[0].innerText;
            if (
              (item === this.styleName &&
                this.setStyleStatus === false) ||
              (item === this.dataBtnObj.styleNameData &&
                this.selectedStatus === true)
            ) {
              element.$el.style.color = '#7890ff';
            } else {
              element.$el.style.color = '#606266';
            }
          });
        }
      }
    },
    handleMouseEnter (event) {
      event.target.style.background = '#f2f4fd';
    },
    handleMouseLeave (event) {
      event.target.style.background = 'white';
    }
  }
};
</script>

<style lang="scss" scoped>
.datacenter-btn {
  display: flex;
  justify-content: space-between;
  height: 48px;
  line-height: 48px;
  color: #999999;
  overflow: hidden;
  /deep/ .el-dialog {
    .el-dialog__body {
      padding: 0 20px;
    }
  }
  .datacenter-btn-rightul {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    .print-export-dropdown {
      margin-right: 0;
      .print-export-button {
        display: flex;
        justify-content: center;
        color: #3b74ff;
        border: 1px solid #3b74ff;
        background: white;
        font-weight: normal;
      }
    }
    .style-dropdown {
      line-height: 32px;
      font-size: 12px !important;
    }
  }
}

.el-dropdown-menu {
  overflow: visible !important;
}

.el-dropdown .el-button span li span,
.el-dropdown-menu__item,
.el-dropdown-menu__item i,
.el-checkbox__label,
.groupView-middle .el-button span {
  // font-family: "MicrosoftYaHei";
  font-size: 12px;
}

.el-checkbox__inner {
  width: 12px;
  height: 12px;
}

.el-checkbox__inner::after {
  height: 5px;
  left: 3px;
}

.groupView-box {
  width: 100%;
  margin-top: 10px;
  position: relative;
  height: 196px;
  .el-checkbox__label {
    color: #666666;
  }
}

.groupView-left {
  width: 204px;
  height: 440px;
  border: 1px solid #e4e4e4;
  border-radius: 2px;
  box-sizing: border-box;
  background: #ffffff;
  padding: 0px 16px;
  position: absolute;
  left: 0;
  top: 0;
}

.groupView-middle {
  box-sizing: border-box;
  position: absolute;
  left: 200px;
  right: 200px;
  width: auto;
  height: 440px;
}

.groupView-right {
  width: 204px;
  height: 440px;
  border: 1px solid #e4e4e4;
  border-radius: 2px;
  box-sizing: border-box;
  background: #ffffff;
  padding: 0px 16px;
  position: absolute;
  right: 0;
  top: 0;
}

.datacenter-btn-right .el-icon--right {
  margin-left: 0 !important;
}

.groupView-right .el-checkbox {
  padding-right: 44px;
  box-sizing: border-box;
  width: 166px;
}

.groupView-right .el-checkbox-group {
  position: relative;
}

.groupView-right-icon {
  position: absolute;
  right: 0;
  top: 6px;
}

.groupView-right-icon span {
  display: inline-block;
  width: 18px;
  height: 18px;
  text-align: center;
  vertical-align: middle;
  border: 1px solid #3b74ff;
  border-radius: 2px;
}

.groupView-left-header {
  height: 48px;
  border-bottom: 1px solid #f2f2f2;
}

.groupView-left-main {
  height: 370px;
  overflow: auto;
}

.groupView-left-main .el-checkbox-group {
  height: 370px;
  overflow: scroll;
  /deep/ .el-checkbox {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
    span {
      line-height: 15px;
    }
    .el-checkbox__label {
      font-size: 12px;
    }
  }
}

.groupView-middle-box .el-button {
  margin-bottom: 12px;
}

.el-checkbox {
  margin-right: 0 !important;
}

.el-checkbox-group label {
  display: block;
  height: 30px;
  line-height: 30px;
}

.el-checkbox + .el-checkbox {
  margin-left: 0px;
}

.positioncenter {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.right-show {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 30px;
  .checkbox-wrapper {
    width: 130px;
    /deep/ .el-checkbox {
      width: 130px;
      padding-right: 0;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      white-space: normal;
      word-break: break-all;
      word-wrap: break-word;
      .el-checkbox__input {
        margin-top: 2px;
        line-height: 15px;
      }
      .el-checkbox__label {
        font-size: 12px !important;
        line-height: 15px;
      }
    }
  }
  .sequence-button-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 30px;
    .icon-neiye-paixushangmoren {
      margin-right: 4px;
    }
  }
}

.sequence-button-wrapper i:hover {
  cursor: pointer;
  color: #0f55ff;
}

.sequence-button-wrapper i {
  font-size: 14px;
  line-height: 30px;
}

.commonbox-query-tips {
  // font-family: "MicrosoftYaHei";
  font-size: 14px;
}

.common-box-query div {
  height: 100px;
  overflow: auto;
  zoom: 1;
}

.common-box-query {
  padding: 0;
}

// 拖拽样式
.ghost-item {
  background: red;
}

/* 按钮样式 */
.datacenter-btn .data-button {
  margin: 0;
  padding: 0;
}

.datacenter-btn .data-button {
  margin-right: 8px;
  width: 80px;
  height: 32px;
  line-height: 32px;
  text-align: 32px;
  font-size: 12px;
  // font-family: "MicrosoftYaHei";
  color: #3b74ff;
  border: 1px solid #3b74ff;
  border-radius: 4px;
  background: #ffffff;
}

.datacenter-btn .data-button:last-child {
  margin-right: 0;
}

.datacenter-btn .data-button:hover {
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #0f55ff;
}

.datacenter-btn .data-button:disabled {
  cursor: wait;
}

.datacenter-btn .groupView-left-main .sort-btn {
  height: 15px;
}

/* 点击保存下拉菜单样式 */
.datacenter-btn .el-dropdown {
  margin-right: 8px;
}

.datacenter-btn .el-dropdown .el-button {
  width: 80px;
  height: 32px;
}

.datacenter-btn .el-dropdown .el-button--primary {
  color: #3b74ff;
  border: 1px solid #3b74ff;
  background: white;
  font-weight: normal;
}

.el-dropdown-menu {
  margin: 0;
  padding: 0;
}

.el-dropdown-menu li {
  margin-top: 0 !important;
  padding-top: 0;
  padding-bottom: 0;
}

.el-popper .el-button--primary {
  width: 124px;
  text-align: left;
  color: #3b74ff;
  border: 1px solid #3b74ff;
  background: white;
  border: none;
  padding: 0;
  font-weight: normal;
}

.el-popper .el-button--primary li {
  display: flex;
  justify-content: space-between;
}

/* 分页弹框按钮样式 */
.groupView-middle-box .el-button {
  width: 80px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #bcbcbc;
  border-radius: 4px;
}

.groupView-middle-box .el-button + .el-button {
  margin-left: 0;
}

/* 切换模板弹框样式 */
.datacenter-btn .bigBox .el-dialog .el-dialog__header {
  padding: 16px 20px 0 20px;
  line-height: 30px;
}

.datacenter-btn .bigBox .el-dialog .el-dialog__body span {
  font-size: 12px;
}

.datacenter-btn .el-dialog__footer {
  padding: 20px 20px 12px 20px;
}

/* 错误提示框样式 */
.icon-danchuang-cuowu {
  color: white;
  margin-right: 10px;
}

.datacenter-btn .my-dialog .common-box-query1 div {
  margin-top: 10px;
  height: 272px;
  overflow-y: scroll;
}

.datacenter-btn .my-dialog .common-box-query1 div li {
  float: left;
  display: flex;
  margin-top: 4px;
  margin-right: 4px;
  padding: 6px 10px;
  width: 94px;
  height: 40px;
  line-height: 14px;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 12px;
  color: #666666;
  background: #ffffff;
  border: 1px solid #bcbcbc;
  border-radius: 4px;
  box-sizing: border-box;
}

.datacenter-btn .my-dialog .common-box-query1 div .ghost-item,
.datacenter-btn .my-dialog .common-box-query2 div .ghost-item,
.datacenter-btn .my-dialog .common-box-query1 div .sortable-chosen,
.datacenter-btn .my-dialog .common-box-query2 div .sortable-chosen {
  background: #3b74ff;
  color: #ffffff;
  border: none;
}

.datacenter-btn .my-dialog .common-box-query1 div li:nth-child(10n) {
  margin-right: 0;
}

.datacenter-btn .my-dialog .common-box-query1 div li:hover {
  cursor: pointer;
}

.datacenter-btn .my-dialog .commonbox-query-tips {
  margin-top: 12px;
  font-size: 14px;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
}

.datacenter-btn .my-dialog .common-box-query2 div {
  margin-top: 8px;
  height: 134px;
  overflow-y: scroll;
}

.datacenter-btn .my-dialog .common-box-query2 div li {
  float: left;
  display: flex;
  margin-top: 4px;
  margin-right: 4px;
  padding: 6px 10px;
  width: 96px;
  height: 40px;
  line-height: 14px;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 12px;
  color: #666666;
  background: #ffffff;
  border: 1px solid #bcbcbc;
  border-radius: 4px;
  box-sizing: border-box;
}

.datacenter-btn .my-dialog .common-box-query2 div li:hover {
  cursor: pointer;
}
</style>
