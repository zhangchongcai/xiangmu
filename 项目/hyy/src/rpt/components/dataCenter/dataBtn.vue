<template>
  <div class="datacenter-btn">
    <div class="datacenter-btn-left">
      <span>
        报表页面数据按营业日（06:00:00-次日05:59:59）统计
        <span v-if="adsUpdateTime">，数据更新于{{adsUpdateTime}}</span>
      </span>
      <span class="group-content">
        <span v-if="isGroup === false">(无分组)</span>
        <span v-if="isGroup === true">
          (分组:
          <template v-for="(item, index) of groupColNameArr">
            <span :key="`groupItem_${index}`" ref="groupItem">{{ item.groupColName }}</span>
          </template>
          )
        </span>
      </span>
    </div>
    <div class="datacenter-btn-right">
      <div class="datacenter-btn-rightul">
        <button class="data-button" v-if="showStyleSave == true" @click="keepBtn">保存样式</button>
        <!-- 自定义模板下拉菜单 -->
        <el-dropdown v-if="showStyleList" trigger="click" @click.native="handleMuneBtnClick">
          <el-button type="primary">
            <span style="font-family: 'MicrosoftYaHei'; font-size: 12px;">样式</span>
            <i class="el-icon-arrow-down el-icon--right" style="font-size: 12px;"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown
              @visible-change="visibleChange"
              v-if="showStyleList"
              trigger="hover"
              placement="right-start"
            >
              <el-button type="primary">
                <el-dropdown-item>
                  <span>切换样式</span>
                  <span>
                    <i class="el-icon-arrow-right" style="margin-left: 0;"></i>
                  </span>
                </el-dropdown-item>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item ref="dropDefault" @click.native="setStyle('default')">默认模板</el-dropdown-item>
                <template v-for="(item,index) in styleNameList">
                  <el-dropdown-item
                    ref="dropItem"
                    @click.native="setStyle(item)"
                    :key="`dropItem_${index}`"
                  >{{item}}</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown-item
              v-if="styleNameData !== '默认模板'"
              ref="updateStyleItem"
              @click.native="handleUpdateClick"
            >更新样式</el-dropdown-item>
            <el-dropdown-item @click.native="handleSaveClick">保存为新样式</el-dropdown-item>
            <el-dropdown-item @click.native="handleDeleteClick">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <button class="data-button" @click="setCommonBtn">自定义表头</button>
        <button class="data-button" @click="setgroupView">分组查看</button>
        <button class="data-button" @click="printTable" v-if="this.rightGroupArr.length == 0">打印</button>
        <button class="data-button" @click="groupDatatable" v-if="this.rightGroupArr.length != 0">打印</button>
        <button
          class="data-button"
          ref="exportBtn"
          @click="pagesExport"
          :disabled="isdisable"
        >导出Excel</button>
      </div>
      <!-- 保存、更新模板定义样式名弹框 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="styleDialogVisible"
        :lock-scroll="false"
        :show-close="false"
        :close-on-click-modal="false"
        width="30%"
      >
        <span v-if="saveOrUpdate === 'save'">保存当前报表样式，请为该样式定义一个新名称。</span>
        <span v-if="saveOrUpdate === 'update'">更新当前报表样式，请为该样式定义一个新名称。</span>
        <el-input v-if="saveOrUpdate === 'save'" v-model="inputStyleName" placeholder="请输入您要保存的样式名"></el-input>
        <el-input
          v-if="saveOrUpdate === 'update'"
          v-model="inputStyleName"
          placeholder="请输入您要更新的样式名"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button
            v-if="saveOrUpdate === 'save'"
            type="primary"
            @click="comfirmSaveStyle('save')"
          >确 定</el-button>
          <el-button
            v-if="saveOrUpdate === 'update'"
            type="primary"
            @click="comfirmUpdateStyle('update')"
          >确 定</el-button>
          <el-button @click="cancleStyleNameDialog">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 自定义表头弹框 -->
      <my-dialog
        :title="'自定义表头'"
        :dialogWidth="1016"
        :dialogHeight="576"
        :dialogContentHeight="300"
        :isShow="colView"
        :marginBottom="1"
        @handleBtnComfirmClick="setQdBtn"
        @handleBtnCancelClick="setDeBtn"
        @close="handleClose('2')"
      >
        <div slot="dialog-content">
          <div class="common-box">
            <ul class="common-box-query1">
              <draggable
                v-model="nowColArr"
                :options="{group:'people', ghostClass: 'ghost-item'}"
                :move="moveCol"
                @start="dragStart"
              >
                <li
                  class="commonbox-query-coment"
                  v-for="(element,index) in nowColArr"
                  :key="`comment1_${index}`"
                >{{ element.label }}</li>
              </draggable>
            </ul>
            <div class="commonbox-query-tips">将不需要展示的表头拖到此处</div>
            <ul class="common-box-query2">
              <draggable
                v-model="nownoColArr"
                :options="{group:'people', ghostClass: 'ghost-item', dragClass: 'drag-item'}"
                :move="moveCol"
              >
                <li
                  class="commonbox-query-coment"
                  v-for="(element, idx) in nownoColArr"
                  :key="`comment2_${idx}`"
                >{{ element.label }}</li>
              </draggable>
            </ul>
          </div>
        </div>
      </my-dialog>
      <!-- 分组查看弹框 -->
      <my-dialog
        :title="'分组查看'"
        :dialogWidth="576"
        :dialogHeight="576"
        :dialogVisible="200"
        :isShow="groupView"
        :marginBottom="dialogHeaderMarginBottom"
        @handleBtnComfirmClick="QdGroupView"
        @handleBtnCancelClick="DeGroupView"
        @close="handleClose('3')"
      >
        <div slot="dialog-content">
          <div class="groupView-box">
            <div class="groupView-left">
              <div class="groupView-left-header">
                <el-checkbox
                  :indeterminate="leftGroupIndeterminate"
                  v-model="leftGroupsCheckAll"
                  @change="handleCheckAllChange"
                >全选</el-checkbox>
              </div>
              <div class="groupView-left-main">
                <el-checkbox-group v-model="leftGroupsChecked" @change="handleCheckedCitiesChange">
                  <el-checkbox
                    v-for="(city, index) in leftGroupsShow"
                    :label="city"
                    :key="`city${index}`"
                  >{{city.groupColName}}</el-checkbox>
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
                <el-checkbox
                  :indeterminate="rightGroupIndeterminate"
                  v-model="rightGroupsCheckAll"
                  @change="newhandleCheckAllChange"
                >全选</el-checkbox>
              </div>
              <div class="groupView-left-main">
                <el-checkbox-group
                  v-model="rightGroupsChecked"
                  @change="newhandleCheckedCitiesChange"
                >
                  <template v-for="city in rightGroupsShow">
                    <div class="right-show" :key="`rightShow${city.seq}`">
                      <el-checkbox class="checkbox" :label="city">{{city.groupColName}}</el-checkbox>
                      <div plain class="sequence-button sort-btn" @click="upClick">
                        <i class="iconfont icon-neiye-paixushangmoren" :id="city.seq"></i>
                      </div>
                      <div plain class="sequence-button sort-btn" @click="downClick">
                        <i class="iconfont icon-neiye-paixuxiaxuanzhong" :id="city.seq"></i>
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
import datacenterBus from "src/rpt/util/datacenterBus.js";
import draggable from "vuedraggable";
import Config from "../../../frame_cpm/http/config";
import MyDialog from "./dataCommon/myDialog.vue";
import FormatDate from "../../util/formatDate.js";
import store from "../../../frame_cpm/vuex/index";
import md5 from "js-md5";
import Qs from "qs";
import { mapState } from "vuex";
import mixins from "src/frame_cpm/mixins/cacheMixin.js";
// 数组取差值
function diff(arr1, arr2) {
  return arr1.concat(arr2).filter(function(arg) {
    return !(arr1.indexOf(arg) >= 0 && arr2.indexOf(arg) >= 0);
  });
}
// 数组去重
function removeRepeatByFilter(array) {
  return array.filter(function(item, index) {
    return array.indexOf(item) === index;
  });
}
// 按参数排序
function compare(property) {
  return function(a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  };
}
function app(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].seq = i + 1;
  }
  return arr;
}
function getElementPageLeft(element) {
  var actualLeft = element.offsetLeft;
  var parent = element.offsetParent;
  while (parent != null) {
    actualLeft +=
      parent.offsetLeft + (parent.offsetWidth - parent.clientWidth) / 2;
    parent = parent.offsetParent;
  }
  return actualLeft;
}

function getElementPageTop(element) {
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
  mixins: [mixins.cacheMixin],
  components: {
    draggable,
    MyDialog
  },
  props: {
    // 表头
    colArr: Array, //不显示的列
    styleColArr: Array, //显示的列
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
    getDataSucc: Boolean
  },
  data() {
    return {
      cacheField: [
        "leftGroupsShow",
        "rightGroupsShow",
        "nowColArr",
        "nownoColArr",
        "leftGroupArr",
        "rightGroupArr"
      ],
      subComName: "dataBtn",
      //======================自定义表头窗口元素===============================
      // 是否显示自定义表头窗口
      colView: false,

      nowColArr: [],
      nownoColArr: [],
      // 存放自定义表头数组
      cunNewArray: [],
      //存放自定义表头隐藏数组
      nocunNewArray: [],
      //表头是否移动，默认为否
      isColMove: false,

      //======================分组窗口元素========================
      // 是否显示分组查看窗口
      groupView: false,
      //左边分组数据
      leftGroupArr: [],
      //右边分组数据
      rightGroupArr: [],
      // 左边分组全选状态
      leftGroupsCheckAll: false,
      // 左边分组不是全选状态：-号显示
      leftGroupIndeterminate: false,
      // 选中的左边分组
      leftGroupsChecked: [],
      // 显示的左边的分组内容
      leftGroupsShow: [],
      // 左边分组的存放状态
      leftGroupsActive: [],

      // 右边分组全选状态
      rightGroupsCheckAll: false,
      // 右边分组不是全选状态：-号显示
      rightGroupIndeterminate: false,
      // 选中的右边分组
      rightGroupsChecked: [],
      // 显示的右边的分组内容
      rightGroupsShow: [],
      // 右边分组的存放状态
      rightGroupsActive: [],
      // 选择影院
      orgNameString: "",
      // 交易时间
      dataTime: "",
      // 导出按钮状态
      isdisable: false,
      //自定义的样式名
      inputStyleName: "",
      showStyleSelect: false,
      showStyleSave: true,
      showStyleList: false,
      //样式列表
      styleNameList: [],
      //弹框样式
      dialogTitle: "",
      //是否保存或更新模板样式
      saveOrUpdate: "",
      //是否调整了模板样式
      styleStatus: false,
      groupColNameArr: [],
      //是否分组
      isGroup: false,
      //点击添加分组的次数
      addCount: 0,
      //点击删除分组的次数
      delCount: 0,
      //是否点击确认分组
      isComfirmGroup: false,
      //有筛选条件的数据
      searchData: [],
      styleDialogVisible: false,
      dialogHeaderMarginBottom: 0,
      styleNameData: "",
      selectedStatus: false,
      setStyleStatus: false
    };
  },
  computed: mapState({
    adsUpdateTime: state => state.rpt.adsUpdateTime
  }),
  watch: {
    styleColArr: {
      handler(newVal, oldVal) {
        this.nowColArr = newVal;
      },
      deep: true
    },
    getDataSucc(newVal, oldVal) {
      if (this.styleArr != null && this.styleArr.length > 0) {
        this.showStyleSave = false;
        this.showStyleList = true;
      }
    },
    groupArr: {
      handler(newVal, oldVal) {
        this.leftGroupArr = newVal;
      },
      deep: true
    },
    styleGroupArr: {
      handler(newVal, oldVal) {
        this.rightGroupArr = newVal;
      },
      deep: true
    },
    styleName(newVal, oldVal) {
      this.styleNameData = newVal;
    }
  },
  mounted() {
    // datacenterBus.$on("cinemaValueEvent", val1 => {
    //   this.orgNameString = val1;
    // });
    // datacenterBus.$on("dataTime", val1 => {
    //   this.dataTime = val1;
    // });
    // datacenterBus.$on("sendSearch", data => {
    //   this.searchData = JSON.parse(JSON.stringify(data));
    // });
  },
  methods: {
    printTable() {
      this.$emit("printTable");
    },
    groupDatatable() {
      this.$emit("groupDatatable");
    },
    pagesExport() {
      let self = this;
      if (self.datatable.length == 0) {
      } else {
        self.isdisable = true;
      }

      let value, queryArr;
      if (this.searchData.lenght != 0) {
        value = JSON.parse(JSON.stringify(this.searchData));
      }
      if (value.length > 0) {
        queryArr = value;
      } else {
        queryArr = this.baseQueryArr;
      }
      if (this.styleExtQueryArr != null) {
        queryArr = queryArr.concat(this.styleExtQueryArr);
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
          colArr: self.styleColArr,
          groupArr: self.styleGroupArr,
          queryArr: queryArr
        }
      };
      let headers = {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: store.state.loginToken,
        timestamp: timestamp,
        sign: md5(store.state.loginToken + store.state.signKey + timestamp),
        "Cpm-User-Token": localStorage.getItem("token")
      };
      let $axios = axios.create({
        headers: headers,
        timeout: 10000, //设置超时时间
        withCredentials: false, //携带凭证
        responseType: "blob"
      });
      $axios
        .post(`${Config.baseURL}/report/report/exportExcel`, datapagesExport)
        .then(res => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], {
            // type: "application/vnd.ms-excel"
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          let num = "";
          for (let i = 0; i < 10; i++) {
            num += Math.ceil(Math.random() * 10);
          }
          link.setAttribute("download", `${this.reportName}.xlsx`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          Vue.nextTick(() => {
            this.$refs.exportBtn.style =
              "border: 1px solid #3B74FF; color: #3B74FF";
            self.isdisable = false;
            this.$message({
              message: "Excel导出完成",
              iconClass: "iconfont icon-danchuang-wancheng",
              customClass: "rpt-alert-message",
              center: "true"
            });
          });
        })
        .catch(msg => {
          this.$message({
            message: msg,
            iconClass: "iconfont icon-danchuang-jingtanhao",
            customClass: "rpt-alert-message",
            center: "true"
          });
          this.$refs.exportBtn.style =
            "border: 1px solid #3B74FF; color: #3B74FF";
          self.isdisable = false;
        });
      this.$refs.exportBtn.style = "border: 1px solid #cedcff; color: #cedcff";
      this.isdisable = true;
    },
    closeCommonDialog: function() {
      this.nowColArr = this.cunNewArray;
      this.nownoColArr = this.nocunNewArray;
    },
    setCommonBtn: function() {
      this.nowColArr = this.styleColArr;
      this.nownoColArr = this.colArr;
      this.cunNewArray = this.styleColArr;
      this.nocunNewArray = this.colArr;
      this.colView = true;
    },
    setQdBtn() {
      //传给表头展示的数据
      this.nowColArr = app(this.nowColArr);
      //表头不显示的数据
      this.nownoColArr = app(this.nownoColArr);

      this.$emit("setStyleColArr", this.nowColArr, this.nownoColArr);
      this.$store.commit("setColArr", this.nowColArr);
      this.colView = false;

      //如果移动了自定义列
      if (this.isColMove) {
        //右边分组移到左边
        let tempGroupArray = this.leftGroupArr.concat(this.rightGroupArr);
        //左边分组重新排序
        this.leftGroupArr = tempGroupArray.sort(compare("seq"));
        //右边分组清空
        this.rightGroupArr = [];
        // 向上级页面传值，渲染全部
        this.$emit("groupArrEvent", this.leftGroupArr, this.rightGroupArr);
        //暂存按钮点击操作，等待页面元素渲染完成再执行
        this.$nextTick(() => {
          //调用查询按钮点击事件
          // datacenterBus.$emit("searchButtonClick");
          this.$emit("searchButtonClick");
        });

        //重置自定义表头移动状态
        this.isColMove = false;
        this.styleStatus = true;
      }
    },
    setDeBtn: function() {
      this.colView = false;
    },
    closeGroupDialog: function() {
      this.leftGroupsShow = this.leftGroupsActive;
      this.rightGroupsShow = this.rightGroupsActive;
      this.leftGroupsChecked = [];
      this.rightGroupsChecked = [];
      this.leftGroupIndeterminate = false;
      this.rightGroupIndeterminate = false;
      this.leftGroupsCheckAll = false;
      this.rightGroupsCheckAll = false;
      this.groupView = false;
    },

    // 点击分组查询
    setgroupView: function() {
      this.dialogHeaderMarginBottom = 16;
      this.groupView = true;

      //这里不能直接将groupArr赋值给leftGroupsShow
      //因为我们要根据列是否有显示来决定列是否能分组，直接赋值，容易造成分组数组丢失内容
      //所以这里要声明一个空数组来存放东西
      this.leftGroupsShow = [];
      //循环整个不显示分组数组
      for (var i = 0; i < this.leftGroupArr.length; i++) {
        var isGroupShow = true; //该分组是否显示，默认为true,即显示
        //循环遍历不显示的列头数组
        for (var j = 0; j < this.colArr.length; j++) {
          //根据业务逻辑，如果不显示的列头中，有该分组的key，则该分组也不显示
          if (this.colArr[j].colKey == this.leftGroupArr[i].groupColKey) {
            isGroupShow = false;
          }
        }
        //如果该分组没在不显示的列头中，则保存到要显示的左边分组数组中
        if (isGroupShow) this.leftGroupsShow.push(this.leftGroupArr[i]);
      }

      this.rightGroupsShow = this.rightGroupArr;
      this.leftGroupsActive = this.leftGroupsShow;
      this.rightGroupsActive = this.rightGroupsShow;

      //循环遍历，如果没有选定列头，则不显示该分组
      for (var i = 0; i < this.colArr.length; i++) {
        for (var j = 0; j < this.leftGroupsShow.length; j++) {
          if (this.colArr[i].colKey == this.leftGroupsShow[j].groupColKey) {
            this.leftGroupsShow.splice(j, 1); // 将使后面的元素依次前移，数组长度减1
            j--; // 如果不减，将漏掉一个元素
          }
        }
      }
    },

    DeGroupView: function() {
      this.groupView = false;
    },
    QdGroupView: function() {
      this.isComfirmGroup = true;
      //分组详情展示
      this.groupColNameArr = JSON.parse(JSON.stringify(this.rightGroupsShow));
      if (this.groupColNameArr.length > 0) {
        this.isGroup = true;
      } else {
        this.isGroup = false;
      }
      for (let i = 0; i < this.groupColNameArr.length; i++) {
        if (i < this.groupColNameArr.length - 1) {
          this.groupColNameArr[i].groupColName += "、";
        }
      }

      //左边分组  右边分组排序
      this.leftGroupsShow = app(this.leftGroupsShow);
      this.rightGroupsShow = app(this.rightGroupsShow);

      //渲染分组到父页面
      this.$emit("groupArrEvent", this.leftGroupsShow, this.rightGroupsShow);
      //暂存按钮点击操作，等待页面元素渲染完成再执行
      Vue.nextTick(() => {
        //调用查询按钮点击事件
        // datacenterBus.$emit("searchButtonClick", []);
        this.$emit("searchButtonClick");
      });

      this.$emit("groupArrEvent", this.leftGroupsShow, this.rightGroupsShow);
      this.groupView = false;
      this.styleStatus = true;
    },
    handleCheckAllChange(val) {
      this.leftGroupsChecked = val ? this.leftGroupsShow : [];
      this.leftGroupIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.leftGroupsCheckAll = checkedCount === this.leftGroupsShow.length;
      this.leftGroupIndeterminate =
        checkedCount > 0 && checkedCount < this.leftGroupsShow.length;
    },
    addValue: function() {
      this.addCount++;
      if (this.rightGroupsShow == null) {
        this.rightGroupsShow = [];
      }

      if (this.rightGroupsShow.length + this.leftGroupsChecked.length > 3) {
        this.$message({
          message: "最多支持选择3个",
          iconClass: "iconfont icon-danchuang-jingtanhao",
          customClass: "rpt-alert-message",
          center: "true"
        });
        this.leftGroupsChecked = [];
        this.leftGroupIndeterminate = false;
        this.leftGroupsCheckAll = false;
      } else if (this.leftGroupsChecked.length == 0) {
        this.$message({
          message: "请勾选最少一个选项",
          iconClass: "iconfont icon-danchuang-jingtanhao",
          customClass: "rpt-alert-message",
          center: "true"
        });
      } else {
        this.rightGroupsShow = this.rightGroupsShow.concat(
          this.leftGroupsChecked
        );
        let newArray = diff(this.leftGroupsChecked, this.leftGroupsShow);
        this.leftGroupsShow = newArray;
        this.leftGroupIndeterminate = false;
        this.leftGroupsChecked = [];
      }
    },
    deValue: function() {
      this.delCount++;
      this.rightGroupsShow = diff(
        this.rightGroupsChecked,
        this.rightGroupsShow
      );
      let ValueArray = removeRepeatByFilter(
        this.leftGroupsShow.concat(this.rightGroupsChecked)
      );
      this.leftGroupsShow = ValueArray.sort(compare("seq"));
      this.rightGroupsChecked = [];
      this.rightGroupIndeterminate = false;
      if (this.rightGroupsShow.length === 0) {
        this.rightGroupIndeterminate = false;
        this.rightGroupsCheckAll = false;
      }
    },
    upClick(e) {
      let newRightGroupsShow = [];
      for (let i = 0; i < this.rightGroupsShow.length; i++) {
        if (e.target.id == this.rightGroupsShow[i].seq) {
          if (i > 0) {
            newRightGroupsShow[i - 1] = this.rightGroupsShow[i];
            newRightGroupsShow[i] = this.rightGroupsShow[i - 1];
          } else {
            newRightGroupsShow[i] = this.rightGroupsShow[i];
          }
        } else {
          newRightGroupsShow.push(this.rightGroupsShow[i]);
        }
      }
      this.rightGroupsShow = newRightGroupsShow;
    },
    downClick(e) {
      let newRightGroupsShow = [];
      let j;
      for (let i = 0; i < this.rightGroupsShow.length; i++) {
        if (e.target.id == this.rightGroupsShow[i].seq) {
          j = i;
          if (i < this.rightGroupsShow.length - 1) {
            newRightGroupsShow[i + 1] = this.rightGroupsShow[i];
            newRightGroupsShow[i] = this.rightGroupsShow[i + 1];
          } else {
            newRightGroupsShow[i] = this.rightGroupsShow[i];
          }
        } else {
          if (i != j && i != j + 1) {
            newRightGroupsShow[i] = this.rightGroupsShow[i];
          }
        }
      }
      this.rightGroupsShow = newRightGroupsShow;
    },
    newhandleCheckAllChange(val) {
      this.rightGroupsChecked = val ? this.rightGroupsShow : [];
      this.rightGroupIndeterminate = false;
    },
    newhandleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.rightGroupsCheckAll = checkedCount === this.rightGroupsShow.length;
      this.rightGroupIndeterminate =
        checkedCount > 0 && checkedCount < this.rightGroupsShow.length;
    },
    saveStyle(value) {
      // 组合参数
      let uId;
      if (value === "save") {
        uId = "";
      }
      if (value === "update") {
        uId = this.styleUid;
      }
      let param = {
        styleUid: uId,
        reportCode: this.reportCode,
        styleName: this.styleNameData,
        isDef: this.isDef,
        styleColArr: this.styleColArr,
        styleExtQueryArr: this.styleExtQueryArr,
        styleGroupArr: this.rightGroupArr
      };
      // 调用api， 保存样式接口
      this.$rptList
        .saveUserStyle(param)
        .then(data => {
          //弹框提示保存结果
          if (data.code == "0") {
            // datacenterBus.$emit("getAllStyles", data.data);

            this.$message({
              message: data.message,
              iconClass: "iconfont icon-danchuang-wancheng",
              customClass: "rpt-alert-message",
              center: "true",
              duration: 2
            });
          } else {
            this.$message({
              message: data.message,
              iconClass: "iconfont icon-danchuang-cuowu",
              customClass: "rpt-alert-message",
              center: "true"
            });
          }
        })
        .catch(msg => {
          console.log(msg);
        });
    },
    //保存个人样式
    keepBtn: function() {
      if (this.styleStatus === true) {
        this.styleDialogVisible = true;
        this.dialogTitle = "保存样式";
        this.saveOrUpdate = "save";
      } else {
        this.$message({
          message: "默认模板不需要保存",
          iconClass: "iconfont icon-danchuang-cuowu",
          customClass: "rpt-alert-message",
          center: "true"
        });
      }
    },
    cancleStyleNameDialog() {
      this.styleDialogVisible = false;
    },
    comfirmSaveStyle(value) {
      if (this.styleNameList.includes(this.inputStyleName)) {
        this.$message({
          message: "样式名已存在,请重新输入！",
          iconClass: "iconfont icon-danchuang-jingtanhao",
          customClass: "rpt-alert-message",
          center: "true"
        });
      } else {
        this.styleNameData = this.inputStyleName;
        this.styleNameList.push(this.inputStyleName);
        this.styleDialogVisible = false;
        this.selectedStatus = true;
        //发起请求保存样式
        this.saveStyle(value);
        this.showStyleList = true;
        this.showStyleSave = false;
        this.styleStatus = false;
      }
    },
    handleClose(value) {
      // if (value === "1") {
      //   this.styleDialogVisible = false;
      // }
      if (value === "2") {
        this.colView = false;
      }
      if (value === "3") {
        this.groupView = false;
      }
    },
    handleDragStart(event) {
      event.path[0].style.background = "#3b74ff";
      event.path[0].style.border = "none";
    },
    handleDragEnd(event) {
      event.path[0].style.background = "#ffffff";
      event.path[0].style.border = "1px solid #bcbcbc";
    },
    //移动表头响应事件
    moveCol: function(event) {
      this.isColMove = true;
    },
    dragStart(event) {
    },
    comfirmUpdateStyle(value) {
      this.styleDialogVisible = false;
      this.styleNameList.splice(
        this.styleNameList.findIndex(element => element === this.styleNameData),
        1
      );
      this.styleNameData = this.inputStyleName;
      this.selectedStatus = true;
      this.saveStyle(value);
    },
    handleUpdateClick() {
      let isSystem;
      this.inputStyleName = this.styleNameData;
      this.styleArr.forEach(element => {
        if (element.styleName === this.styleNameData) {
          isSystem = element.isSys;
        }
      });
      if (isSystem !== "true") {
        this.styleDialogVisible = true;
        this.dialogTitle = "更新样式";
        this.saveOrUpdate = "update";
      } else {
        this.$message({
          message: "不能更新系统样式！",
          iconClass: "iconfont icon-danchuang-jingtanhao",
          customClass: "rpt-alert-message",
          center: "true"
        });
      }
    },
    handleSaveClick() {
      this.styleDialogVisible = true;
      this.dialogTitle = "保存样式";
      this.inputStyleName = this.styleNameData;
      this.saveOrUpdate = "save";
      this.setStyleStatus = true;
    },
    handleDeleteClick() {
      let isSystem;
      this.styleArr.forEach(element => {
        if (element.styleName === this.styleNameData) {
          isSystem = element.isSys;
        }
      });
      if (isSystem === "true") {
        this.$message({
          message: "不能删除系统样式！",
          iconClass: "iconfont icon-danchuang-jingtanhao",
          customClass: "rpt-alert-message",
          center: "true"
        });
      } else if (this.styleNameData === "默认模板") {
        this.$message({
          message: "不能删除默认模板！",
          iconClass: "iconfont icon-danchuang-jingtanhao",
          customClass: "rpt-alert-message",
          center: "true"
        });
      } else {
        this.$confirm("此操作将删除该样式, 是否继续?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          lockScroll: false,
          showClose: false,
          iconClass: "iconfont icon-danchuang-jingtanhao"
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
                  this.styleNameList[i] === this.styleNameData &&
                  this.styleNameData != "默认主题"
                ) {
                  this.styleNameList.splice(i, 1);
                }
              }
              // datacenterBus.$emit("getStyle", this.styleArr[index].styleUid);
              this.$emit("getStyle", this.styleArr[index].styleUid);
              this.$message({
                message: "删除成功",
                iconClass: "iconfont icon-danchuang-wancheng",
                customClass: "rpt-alert-message",
                center: "true"
              });
            });
          })
          .catch(() => {
            this.$message({
              message: "已取消删除",
              iconClass: "iconfont icon-danchuang-jingtanhao",
              customClass: "rpt-alert-message",
              center: "true"
            });
          });
      }
    },
    setStyle(item) {
      let styleUid;
      if (item === "default") {
        styleUid = "-1";
      } else {
        this.styleArr.forEach(element => {
          if (element.styleName === item) {
            styleUid = element.styleUid;
          }
        });
      }

      // 切换模版时保存query区域的所有输入条件
      localStorage.setItem("baseData", JSON.stringify(this.baseQueryArr));
      localStorage.setItem("extendData", JSON.stringify(this.styleExtQueryArr));
      this.$emit("getStyle", styleUid);
    },
    //点击样式按钮获取以保存的样式名
    handleMuneBtnClick() {
      if (this.styleNameList.length === 0) {
        let nameArr = [];
        this.styleArr.forEach(element => {
          nameArr.push(element.styleName);
        });
        this.styleNameList = nameArr.reverse();
      } else {
        8;
        if (
          this.styleNameList.indexOf(this.styleNameData) < 0 &&
          this.styleNameData != "默认模板"
        ) {
          this.styleNameList.push(this.styleNameData);
        }
      }
    },
    visibleChange() {
      //切换分组菜单中当前模板的样式
      let dropItem = this.$refs.dropItem;
      let dropDefault = this.$refs.dropDefault;
      if (
        dropDefault.$el.innerHTML === this.styleName &&
        this.setStyleStatus === false
      ) {
        dropDefault.$el.style.background = "#ebf1ff";
        dropDefault.$el.style.color = "#7890ff";
        dropItem.forEach(element => {
          element.$el.style.background = "#ffffff";
          element.$el.style.color = "#606266";
        });
      } else {
        dropDefault.$el.style.background = "#ffffff";
        dropDefault.$el.style.color = "#606266";
        dropItem.forEach(element => {
          if (
            (element.$el.innerHTML === this.styleName &&
              this.setStyleStatus === false) ||
            (element.$el.innerHTML === this.styleNameData &&
              this.selectedStatus === true)
          ) {
            element.$el.style.background = "#ebf1ff";
            element.$el.style.color = "#7890ff";
          } else {
            element.$el.style.background = "#ffffff";
            element.$el.style.color = "#606266";
          }
        });
      }
    }
  }
};
</script>

<style lang="scss">
.datacenter-btn {
  display: flex;
  justify-content: space-between;
  height: 48px;
  line-height: 48px;
  color: #999999;
  overflow: hidden;
}

.el-dropdown-menu {
  overflow: visible !important;
}

.el-dropdown .el-button span li span,
.el-dropdown-menu__item,
.el-dropdown-menu__item i,
.el-checkbox__label,
.groupView-middle .el-button span {
  font-family: "MicrosoftYaHei";
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
  height: 30px;
  line-height: 30px;
}

.checkbox {
  display: inline-block !important;
  padding-right: 10px;
  width: 50px;
}

.groupView-right .el-checkbox {
  padding-right: 10px;
  box-sizing: border-box;
  width: 100px;
}

.sequence-button {
  display: inline-block;
  margin-left: 10px;
  padding: 0;
  width: 15px;
  height: 15px;
  font-size: 16px;
}

.sequence-button:hover {
  cursor: pointer;
  color: #0f55ff;
}

.sequence-button i {
  font-size: 16px;
}

.commonbox-query-tips {
  font-family: "MicrosoftYaHei";
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
  font-family: "MicrosoftYaHei";
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

/* 删除模板样式提示框 */
.el-message-box {
  position: relative;
  width: 320px;
  height: 164px;
  padding: 20px;
  box-sizing: border-box;
}

.el-message-box__header {
  display: none;
}

.el-message-box__content {
  margin-top: 20px;
  padding: 0;
}

.el-message-box__status {
  margin-left: 25px;
  line-height: 27px;
}

.el-message-box__status:before {
  font-size: 18px;
  margin-bottom: 10px;
  color: #ff8900;
}

.el-message-box__message {
  margin-left: 15px;
  text-align: center;
}

.el-message-box__message p {
  font-size: 14px;
}

.el-message-box__btns {
  margin-top: 40px;
}

.el-message-box__btns button {
  width: 80px;
  height: 32px;
}

.el-message-box__btns button:nth-child(1) {
  position: absolute;
  left: 175px;
  bottom: 24px;
}

.el-message-box__btns button:nth-child(2) {
  position: absolute;
  left: 63px;
  bottom: 24px;
  background: #3b74ff;
  border: none;
}

.el-message-box__btns button:nth-child(2):hover {
  border: none;
  background: #0f55ff;
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

