<template>
  <div class="datacenter-btn">
    <div class="datacenter-btn-left">
      <span>报表页面数据按营业日（06:00:00-次日05:59:59）统计，数据更新于{{currentTime}}</span>
      <span class="group-content">
        <span v-if="isGroup === false">(无分组)</span>
        <span v-if="isGroup === true">
          (分组:
          <template v-for="(item, index) of groupColNameArr">
            <span :key="index" ref="groupItem">{{ item.groupColName }}</span>
          </template>
          )
        </span>
      </span>
    </div>
    <div class="datacenter-btn-right">
      <div class="datacenter-btn-rightul">
        <button class="data-button" v-if="showStyleSave == true" @click="keepBtn">保存样式</button>
        <!-- 自定义模板下拉菜单 -->
        <el-dropdown v-if="showStyleList" trigger="click" @click.native="handleMuneBtnClick(data)">
          <el-button type="primary">
            <span>样式</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
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
                    :key="index"
                  >{{item}}</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown-item @click.native="handleUpdateClick">更新样式</el-dropdown-item>
            <el-dropdown-item @click.native="handleSaveClick">保存为新样式</el-dropdown-item>
            <el-dropdown-item @click.native="handleDeleteClick">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <button class="data-button" @click="setCommonBtn">自定义表头</button>
        <button class="data-button" @click="setgroupView">分组查看</button>
        <button class="data-button" @click="printTable" v-if="this.styleGroupArr.length == 0">打印</button>
        <button class="data-button" @click="groupDatatable" v-if="this.styleGroupArr.length != 0">打印</button>
        <button
          class="data-button"
          ref="exportBtn"
          @click="pagesExport"
          :disabled="isdisable"
        >导出Excel</button>
      </div>
      <!-- 自定义表头弹框 -->
      <my-dialog
        :title="'自定义表头'"
        :dialogWidth="616"
        :dialogHeight="394"
        :dialogContentHeight="300"
        :isShow="colView"
        @handleBtnComfirmClick="setQdBtn"
        @handleBtnCancelClick="setDeBtn"
        @close="handleClose('2')"
      >
        <div slot="dialog-content">
          <div class="commonbox-query-tips">标题调整</div>
          <div class="common-box">
            <ul class="common-box-query">
              <draggable v-model="nowColArr" :options="{group:'people'}" :move="moveCol">
                <li class="commonbox-query-coment" v-for="element in nowColArr">{{ element.label }}</li>
              </draggable>
            </ul>
            <div class="commonbox-query-tips">拖动排序筛选顺序</div>
            <ul class="common-box-query">
              <draggable v-model="nownoColArr" :options="{group:'people'}" :move="moveCol">
                <li
                  class="commonbox-query-coment"
                  v-for="element in nownoColArr"
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
        :dialogHeight="294"
        :dialogContentHeight="200"
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
                    v-for="city in leftGroupsShow"
                    :label="city"
                    :key="city"
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
                    <div class="right-show" :key="city.seq">
                      <el-checkbox class="checkbox" :label="city">{{city.groupColName}}</el-checkbox>
                      <el-button plain class="sequence-button sort-btn" @click="upClick">
                        <i class="el-icon-caret-top" :id="city.seq"></i>
                      </el-button>
                      <el-button plain class="sequence-button sort-btn" @click="downClick">
                        <i class="el-icon-caret-bottom" :id="city.seq"></i>
                      </el-button>
                    </div>
                  </template>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </div>
      </my-dialog>
    </div>

    <!-- 保存、更新模板定义样式名弹框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="styleDialogVisible"
      :before-close="handleClose('1')"
      :lock-scroll="false"
      width="30%"
    >
      <span v-if="saveOrUpdate === 'save'">保存当前报表的分组、标题样式，请为该样式定义一个新名称。</span>
      <span v-if="saveOrUpdate === 'update'">更新当前报表的分组、标题样式，请为该样式定义一个新名称。</span>
      <el-input v-model="inputStyleName" placeholder="请输入您要保存的样式名"></el-input>
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
  </div>
</template>
<script>
import datacenterBus from "../../assets/datacenterBus.js";
import draggable from "vuedraggable";
import Config from "../../http/config.js";
import MyDialog from "./dataCommon/myDialog.vue";
import FormatDate from "../../util/formatDate.js";
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

      //当前时间
      currentTime: FormatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
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
      dialogHeaderMarginBottom: 0
    };
  },
  watch: {
    styleColArr(newVal, oldVal) {
      this.nowColArr = newVal;
    },
    getDataSucc(newVal, oldVal) {
      console.log(typeof this.styleArr);
      if (this.styleArr != null && this.styleArr.length > 0) {
        this.showStyleSave = false;
        this.showStyleList = true;
      }
    }
  },
  mounted() {
    datacenterBus.$on("cinemaValueEvent", val1 => {
      this.orgNameString = val1;
    });
    datacenterBus.$on("dataTime", val1 => {
      this.dataTime = val1;
    });
    datacenterBus.$on("sendSearch", data => {
      this.searchData = JSON.parse(JSON.stringify(data));
    });
  },
  methods: {
    printTable: function() {
      // alert()
      this.$emit("printTable");
    },
    groupDatatable: function() {
      // alert()
      this.$emit("groupDatatable");
    },
    pagesExport() {
      this.$confirm(
        "<i class='iconfont icon-danchuang-jingtanhao'></i>此操作将把数据导出为Excel表格, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          lockScroll: false,
          showClose: false,
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          this.$message({
            message: "数据将被导出为Excel表格",
            iconClass: "iconfont icon-danchuang-wancheng",
            customClass: "alert-message",
            center: "true"
          });
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
          let naxios = axios.create({
            responseType: "blob"
          });
          naxios
            .post(`${Config.baseURL}report/exportExcel`, datapagesExport)
            .then(res => {
              var blob = new Blob([res.data], {
                type:
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
              }); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
              var downloadElement = document.createElement("a");
              var href = window.URL.createObjectURL(blob); //创建下载的链接
              downloadElement.href = href;
              downloadElement.download = self.reportName + ".xlsx"; //下载后文件名
              document.body.appendChild(downloadElement);
              downloadElement.click(); //点击下载
              document.body.removeChild(downloadElement); //下载完成移除元素
              window.URL.revokeObjectURL(href); //释放掉blob对象
              Vue.nextTick(() => {
                this.$refs.exportBtn.style =
                  "border: 1px solid #3B74FF; color: #3B74FF";
                self.isdisable = false;
                this.$message({
                  message: "Excel导出完成",
                  iconClass: "iconfont icon-danchuang-wancheng",
                  customClass: "alert-message",
                  center: "true"
                });
              });
            })
            .catch(msg => {
              this.$message({
                message: msg,
                iconClass: "iconfont icon-danchuang-jingtanhao",
                customClass: "alert-message",
                center: "true"
              });
            });
          this.$refs.exportBtn.style =
            "border: 1px solid #cedcff; color: #cedcff";
          this.isdisable = true;
        })
        .catch(() => {
          this.$message({
            iconClass: "iconfont icon-danchuang-jingtanhao",
            customClass: "alert-message",
            center: "true",
            message: "已取消将数据导出为Excel表格"
          });
        });
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
    setQdBtn: function() {
      //传给表头展示的数据
      this.nowColArr = app(this.nowColArr);
      //表头不显示的数据
      this.nownoColArr = app(this.nownoColArr);
      // if(this.nowColArr.length == this.cunNewArray.length){
      // 	this.leftGroupsShow = this.leftGroupsShow.conat(this.rightGroupsShow)
      // 	this.rightGroupsShow = []
      // }
      datacenterBus.$emit("styleColArr", this.nowColArr, this.nownoColArr);
      console.log(this.nowColArr, this.nownoColArr);
      this.colView = false;

      //如果移动了自定义列
      if (this.isColMove) {
        //右边分组移到左边
        console.log(this.styleGroupArr);
        let tempGroupArray = this.groupArr.concat(this.styleGroupArr);
        //左边分组重新排序
        this.groupArr = tempGroupArray.sort(compare("seq"));
        //右边分组清空
        this.styleGroupArr = [];
        // 向上级页面传值，渲染全部
        datacenterBus.$emit("GroupArrEvent", this.groupArr, this.styleGroupArr);
        console.log(this.groupArr, this.styleGroupArr);
        //暂存按钮点击操作，等待页面元素渲染完成再执行
        Vue.nextTick(function() {
          //调用查询按钮点击事件
          datacenterBus.$emit("searchButtonClick");
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
      console.log(this.groupArr);
      console.log(this.styleGroupArr);
      //循环整个不显示分组数组
      for (var i = 0; i < this.groupArr.length; i++) {
        var isGroupShow = true; //该分组是否显示，默认为true,即显示
        //循环遍历不显示的列头数组
        for (var j = 0; j < this.colArr.length; j++) {
          //根据业务逻辑，如果不显示的列头中，有该分组的key，则该分组也不显示
          if (this.colArr[j].colKey == this.groupArr[i].groupColKey) {
            isGroupShow = false;
          }
        }
        //如果该分组没在不显示的列头中，则保存到要显示的左边分组数组中
        if (isGroupShow) this.leftGroupsShow.push(this.groupArr[i]);
      }

      this.rightGroupsShow = this.styleGroupArr;
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
      console.log('1231231')
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
      datacenterBus.$emit(
        "GroupArrEvent",
        this.leftGroupsShow,
        this.rightGroupsShow
      );
      //暂存按钮点击操作，等待页面元素渲染完成再执行
      Vue.nextTick(function() {
        //调用查询按钮点击事件
        datacenterBus.$emit("searchButtonClick", []);
      });

      datacenterBus.$emit(
        "GroupArrEvent",
        this.leftGroupsShow,
        this.rightGroupsShow
      );
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
          customClass: "alert-message",
          center: "true"
        });
        this.leftGroupsChecked = [];
        this.leftGroupIndeterminate = false;
        this.leftGroupsCheckAll = false;
      } else if (this.leftGroupsChecked.length == 0) {
        this.$message({
          message: "请勾选最少一个选项",
          iconClass: "iconfont icon-danchuang-jingtanhao",
          customClass: "alert-message",
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
        styleName: this.styleName,
        isDef: this.isDef,
        styleColArr: this.styleColArr,
        styleExtQueryArr: this.styleExtQueryArr,
        styleGroupArr: this.styleGroupArr
      };
      // 调用api， 保存样式接口
      this.$rptList
        .saveUserStyle(param)
        .then(data => {
          //弹框提示保存结果
          if (data.code == "0") {
            console.log(this.styleNameList, this.styleName);
            // datacenterBus.$emit("getAllStyles", data.data);

            this.$message({
              message: data.message,
              iconClass: "iconfont icon-danchuang-wancheng",
              customClass: "alert-message",
              center: "true"
            });
          } else {
            this.$message({
              message: data.message,
              iconClass: "iconfont icon-danchuang-cuowu",
              customClass: "alert-message",
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
          customClass: "alert-message",
          center: "true"
        });
      }
    },
    cancleStyleNameDialog() {
      console.log("cancleDialog");
      this.styleDialogVisible = false;
    },
    comfirmSaveStyle(value) {
      if (this.styleNameList.includes(this.inputStyleName)) {
        this.$message({
          message: "样式名已存在,请重新输入！",
          iconClass: "iconfont icon-danchuang-jingtanhao",
          customClass: "alert-message",
          center: "true"
        });
      } else {
        this.styleName = this.inputStyleName;
        this.styleNameList.push(this.inputStyleName);
        this.styleDialogVisible = false;
        //发起请求保存样式
        this.saveStyle(value);
        this.showStyleList = true;
        this.showStyleSave = false;
        this.styleStatus = false;
      }
    },
    handleClose(value) {
      if (value === "1") {
        this.styleDialogVisible = false;
      }
      if (value === "2") {
        this.colView = false;
      }
      if (value === "3") {
        this.groupView = false;
      }
    },
    //移动表头响应事件
    moveCol: function(evt) {
      this.isColMove = true;
    },
    comfirmUpdateStyle(value) {
      this.styleDialogVisible = false;
      this.styleName = this.inputStyleName;
      this.saveStyle(value);
    },
    handleUpdateClick() {
      let isSystem;
      this.styleArr.forEach(element => {
        if (element.styleName === this.styleName) {
          isSystem = element.isSys;
        }
      });
      console.log(isSystem);
      if (isSystem !== "true") {
        console.log("121");
        this.styleDialogVisible = true;
        this.styleDialogVisible = true;
        this.dialogTitle = "更新样式";
        this.saveOrUpdate = "update";
      } else {
        this.$message({
          message: "不能更新系统样式！",
          iconClass: "iconfont icon-danchuang-jingtanhao",
          customClass: "alert-message",
          center: "true"
        });
      }
    },
    handleSaveClick() {
      this.styleDialogVisible = true;
      this.dialogTitle = "保存样式";
      this.saveOrUpdate = "save";
    },
    handleDeleteClick() {
      let isSystem;
      this.styleArr.forEach(element => {
        if (element.styleName === this.styleName) {
          isSystem = element.isSys;
        }
      });
      console.log(isSystem);
      if (isSystem === "true") {
        this.$message({
          message: "不能删除系统样式！",
          iconClass: "iconfont icon-danchuang-jingtanhao",
          customClass: "alert-message",
          center: "true"
        });
      } else if (this.styleName === "默认模板") {
        this.$message({
          message: "不能删除默认模板！",
          iconClass: "iconfont icon-danchuang-jingtanhao",
          customClass: "alert-message",
          center: "true"
        });
      } else {
        this.$confirm("此操作将删除该样式, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          lockScroll: false
        })
          .then(() => {
            this.$rptList.deleteUserStyle(this.styleUid).then(res => {
              let index;
              for (let i = 0; i < this.styleArr.length; i++) {
                if (this.styleArr[i].styleUid === this.styleUid) {
                  this.styleArr.splice(i, 1);
                  console.log(i);
                  index = i;
                }
              }
              for (let i = 0; i < this.styleNameList.length; i++) {
                if (
                  this.styleNameList[i] === this.styleName &&
                  this.styleName != "默认主题"
                ) {
                  this.styleNameList.splice(i, 1);
                }
              }
              datacenterBus.$emit("getStyle", this.styleArr[index].styleUid);
              this.$message({
                message: "删除成功",
                iconClass: "iconfont icon-danchuang-wancheng",
                customClass: "alert-message",
                center: "true"
              });
            });
          })
          .catch(() => {
            this.$message({
              message: "已取消删除",
              iconClass: "iconfont icon-danchuang-jingtanhao",
              customClass: "alert-message",
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
      datacenterBus.$emit("getStyle", styleUid);
    },
    //点击样式按钮获取以保存的样式名
    handleMuneBtnClick() {
      console.log(this.styleArr);
      if (this.styleNameList.length === 0) {
        let nameArr = [];
        this.styleArr.forEach(element => {
          nameArr.push(element.styleName);
        });
        this.styleNameList = nameArr.reverse();
      } else {
        if (
          this.styleNameList.indexOf(this.styleName) < 0 &&
          this.styleName != "默认模板"
        ) {
          this.styleNameList.push(this.styleName);
        }
      }
      console.log(this.styleNameList);
    },
    visibleChange() {
      //切换分组菜单中当前模板的样式
      let dropItem = this.$refs.dropItem;
      let dropDefault = this.$refs.dropDefault;
      if (dropDefault.$el.innerHTML === this.styleName) {
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
          if (element.$el.innerHTML === this.styleName) {
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
<style>
@import url("../../assets/style/dataBtn.css");
</style>