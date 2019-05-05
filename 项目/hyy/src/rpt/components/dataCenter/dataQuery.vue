<template>
  <div ref="queryWrapper" class="data-query">
    <div class="datacenter-query clearfix" v-if="isHighShow">
      <ul class="datacenter-query-ul clearfix">
        <template v-for="(item,index) in baseQueryArr">
          <li v-if="item.controlType == 'TREE_SING'" :key="index" class="ui-item">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208"></div>
          </li>
          <li v-if="item.controlType == 'TREE_MUL'" :key="`TREE_MUL${index}`">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <cinema-tree :selectValue="item"></cinema-tree>
            </div>
          </li>
          <li v-if="item.controlType == 'SELECT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <el-select>
                <common-conditions :selectValue="item"></common-conditions>
              </el-select>
            </div>
          </li>
          <li v-if="item.controlType == 'DATE'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <rangedate-timeselet :selectValue="item"></rangedate-timeselet>
          </li>
          <li v-if="item.controlType == 'CHECK_SING'" :key="index">
            <el-checkbox v-model="paydetails" name="paydetails1">{{item.queryName}}</el-checkbox>
          </li>
          <li v-if="item.controlType == 'TEXT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <data-input1 :baseInputValue="item" @baseInputValueChange="baseInputValueChange"></data-input1>
            </div>
          </li>
        </template>
        <li class="more">
          <!-- <el-checkbox v-model="paydetails" name="paydetails1">展示支付明细</el-checkbox> -->
          <button class="search-button" @click="getTableValue">查询</button>
          <span class="GJBtn DC666" @click="conditionShow">
            <span>高级筛选</span>
            <i class="el-icon-arrow-down DC-icon-left"></i>
          </span>
        </li>
      </ul>
    </div>
    <div class="datacenter-query clearfix" v-else>
      <!-- 基本条件筛选排列区 -->
      <ul class="datacenter-query-ul clearfix">
        <template v-for="(item,index) in baseQueryArr">
          <li v-if="item.controlType == 'TREE_SING'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <el-select v-model="value2" placeholder="请选择">
                <el-option
                  v-for="option in options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li v-if="item.controlType == 'TREE_MUL'" :key="`TREE_MUL${index}`">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <cinema-tree :selectValue="item"></cinema-tree>
            </div>
          </li>
          <li v-if="item.controlType == 'SELECT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <el-select>
                <common-conditions :selectValue="item"></common-conditions>
              </el-select>
            </div>
          </li>
          <li v-if="item.controlType == 'DATE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <rangedate-timeselet :selectValue="item"></rangedate-timeselet>
          </li>
          <li v-if="item.controlType == 'TEXT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <data-input1 :baseInputValue="item" @baseInputValueChange="baseInputValueChange"></data-input1>
            </div>
          </li>
        </template>
        <li class="more">
          <span class="GJBtn DC666" @click="conditionDide">
            收起
            <i class="el-icon-arrow-up DC-icon-left"></i>
          </span>
        </li>
      </ul>

      <!-- 拓展条件筛选框排列区 -->
      <ul class="datacenter-query-ul datacenter-query-ul--active">
        <template v-for="(item,index) in styleExtQueryArr">
          <li v-if="item.controlType == 'TREE_SING'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li v-if="item.controlType == 'SELECT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <common-conditions :selectValue="item"></common-conditions>
            </div>
          </li>
          <li v-if="item.controlType == 'CHECKBOX'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <check-select :selectValue="item" @changeSelectData="changeSelectData"></check-select>
            </div>
          </li>
          <li v-if="item.controlType == 'DATE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <rangedate-timeselet :selectValue="item"></rangedate-timeselet>
          </li>
          <li v-if="item.controlType == 'CHECK_SING'" :key="index">
            <check-sing :selectValue="item"></check-sing>
          </li>
          <li v-if="item.controlType == 'TEXT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <data-input2 :etxInputValue="item" @etxInputValueChange="etxInputValueChange"></data-input2>
            </div>
          </li>
        </template>
      </ul>

      <!-- 按钮排列区 -->
      <ul class="datacenter-query-ul">
        <li class="more">
          <!-- <el-checkbox v-model="checked">展示支付明细</el-checkbox> -->
          <button class="search-button" @click="getTableValue">查询</button>
          <button class="normal-button" @click="setCommonBtn">设置通用条件</button>
        </li>
      </ul>
    </div>

    <!-- 常用条件弹框区域 -->
    <my-dialog
      :title="'自定义条件'"
      :isShow="isDialogShow"
      :dialogWidth="616"
      :dialogHeight="394"
      @handleBtnComfirmClick="setQdBtn"
      @handleBtnCancelClick="setDeBtn"
      @close="closeCCDialog"
    >
      <div slot="dialog-content">
        <div class="common-box">
          <div class="commonbox-query-tips">拖动排序筛选顺序</div>
          <ul class="common-box-query">
            <draggable
              v-model="showQueryArr"
              :options="{group:'people'}"
              @start="drag=true"
              @end="drag=false"
              :move="dragMove"
            >
              <li
                class="commonbox-query-coment"
                v-for="(element,index) in showQueryArr"
                :key="index"
              >{{ element.queryName }}</li>
            </draggable>
          </ul>
          <div class="commonbox-query-tips">选择通用条件</div>
          <ul class="common-box-query">
            <draggable
              v-model="hideQueryArr"
              :options="{group:'people'}"
              @start="drag=true"
              @end="drag=false"
            >
              <li
                class="commonbox-query-coment"
                v-for="(element, index) in hideQueryArr"
                :key="index"
              >{{ element.queryName }}</li>
            </draggable>
          </ul>
        </div>
      </div>
    </my-dialog>

    <!-- <el-dialog :visible.sync="isDialogShow" width="610" @close="closeCCDialog" :lock-scroll="false">
      <div class="common-box">
        <div class="commonbox-query-tips">拖动排序筛选顺序</div>
        <ul class="common-box-query">
          <draggable
            v-model="showQueryArr"
            :options="{group:'people'}"
            @start="drag=true"
            @end="drag=false"
            :move="dragMove"
          >
            <li
              class="commonbox-query-coment"
              v-for="(element,index) in showQueryArr"
              :key="index"
            >{{ element.queryName }}</li>
          </draggable>
        </ul>
        <div class="commonbox-query-tips">选择通用条件</div>
        <ul class="common-box-query">
          <draggable
            v-model="hideQueryArr"
            :options="{group:'people'}"
            @start="drag=true"
            @end="drag=false"
          >
            <li
              class="commonbox-query-coment"
              v-for="(element, index) in hideQueryArr"
              :key="index"
            >{{ element.queryName }}</li>
          </draggable>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDeBtn">取 消</el-button>
        <el-button type="primary new-style-btn" @click="setQdBtn">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script type="text/javascript">
import draggable from "vuedraggable";
import rangedateTimeselet from "./dataCommon/rangeDateTimeSelet.vue";
import commonConditions from "./dataCommon/commonConditions.vue";
import checkSing from "./dataCommon/checkSing.vue";
import cinemaTree from "./dataCommon/cinemaTree.vue";
import checkSelect from "./dataCommon/checkSelect.vue";
import cinemaTree2 from "./dataCommon/cinemaTree2.vue";
import datacenterBus from "../../assets/datacenterBus.js";
import dataInput1 from "./dataCommon/dataInput1.vue";
import dataInput2 from "./dataCommon/dataInput2.vue";
import MyDialog from "./dataCommon/myDialog.vue";
function app(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].seq = i + 1;
  }
  return arr;
}
export default {
  props: {
    //报表名称
    reportName: String,
    //
    tableName: String,
    // 基础查询
    baseQueryArr: Array,
    // 扩展查询
    extQueryArr: Array,
    styleExtQueryArr: Array,
    //表头
    colArr: Array,
    styleColArr: Array,
    groupArr: Array,
    styleGroupArr: Array,
    reportCode: String,
    Pagination: Object
  },
  components: {
    rangedateTimeselet,
    commonConditions,
    draggable,
    cinemaTree,
    cinemaTree2,
    checkSelect,
    checkSing,
    dataInput1,
    dataInput2,
    //是否查询表格数据
    getDataStatus: false,
    MyDialog
  },
  data() {
    return {
      isDialogShow: false, //是否显示自定义扩展条件
      isHighShow: true, //是否显示高级筛选
      showQueryArr: [], //设置条件窗口中要显示的条件
      hideQueryArr: [], //设置条件窗口中不显示的条件
      tempShowQueryArr: [], //临时存放，要显示的扩展条件
      tempHideQueryArr: [], //临时存放，不显示的扩展条件
      searchData: [] //存储表格筛选条件
    };
  },
  mounted() {
    var self = this;
    //对外暴露查询按钮点击事件
    datacenterBus.$on("searchButtonClick", function(data) {
      self.getTableValue(data);
    });
  },
  methods: {
    baseInputValueChange(val) {
      this.baseQueryArr.forEach(element => {
        if (element.queryName === val.queryName) {
          element.queryColValue = val.queryColValue;
        }
      });
    },
    etxInputValueChange(val) {
      this.styleExtQueryArr.forEach(element => {
        if (element.queryName === val.queryName) {
          element.queryColValue = val.queryColValue;
        }
      });
    },
    inputChange(val) {
      let textArr = this.styleExtQueryArr.filter(element => {
        return element.controlType == "CHECKBOX";
      });
    },
    changeSelectData(data) {
      console.log(data);
      for (let i = 0; i < this.styleExtQueryArr.length; i++) {
        if (this.styleExtQueryArr[i].queryName == data.queryName) {
          console.log(data)
          this.styleExtQueryArr[i] = JSON.parse(JSON.stringify(data));
        }
      }
      this.$forceUpdate();
    },
    dragMove(evt) {},
    conditionShow: function() {
      this.isHighShow = false;
    },
    conditionDide: function() {
      this.isHighShow = true;
    },
    //关闭自定义查询条件窗口事件
    closeCCDialog: function() {
      //还原条件
      this.showQueryArr = this.tempShowQueryArr;
      this.hideQueryArr = this.tempHideQueryArr;
    },
    //确定按钮触发事件
    setQdBtn: function() {
      //向父级传值
      console.log("拖动后的showQueryArr", this.showQueryArr);
      console.log("拖动后的hideQueryArr", this.hideQueryArr);
      datacenterBus.$emit(
        "CcArrEvent",
        app(this.showQueryArr),
        app(this.hideQueryArr)
      );
      //修改临时存放的值
      this.tempShowQueryArr = this.showQueryArr;
      this.tempHideQueryArr = this.hideQueryArr;
      //改变窗口显示状态
      this.isDialogShow = false;
      // this.showQueryArr
    },
    //取消按钮触发事件
    setDeBtn: function() {
      this.isDialogShow = false;
    },
    //点击设置常用条件按钮触发事件
    setCommonBtn: function() {
      //初始化窗口中显示和不显示的扩展条件数组
      this.showQueryArr = this.styleExtQueryArr;
      this.hideQueryArr = this.extQueryArr;
      //保存原始值
      this.tempShowQueryArr = this.showQueryArr;
      this.tempHideQueryArr = this.hideQueryArr;
      //改变窗口显示状态
      this.isDialogShow = true;
      console.log(this.showQueryArr, this.hideQueryArr)
      console.log("设置常用条件的styleExtQueryArr", this.styleExtQueryArr);
      console.log("设置常用条件的extQueryArr", this.extQueryArr);
    },
    //获取表格内容
    getTableValue: function(value) {
      datacenterBus.$emit("visibleEvent", false);
      datacenterBus.$emit("tableLoading");
      this.getDataStatus = true;
      //拼接基础查询和扩展查询

      if (this.searchData.lenght != 0) {
        value = JSON.parse(JSON.stringify(this.searchData));
      }
      let queryArr;
      if (value.length > 0) {
        queryArr = value;
      } else {
        queryArr = this.baseQueryArr;
      }
      console.log(this.styleGroupArr);
      if (this.styleExtQueryArr != null) {
        queryArr = queryArr.concat(this.styleExtQueryArr);
      }

      //如果没有分组，就是明细查询
      if (this.styleGroupArr.length === 0) {
        //声明参数
        let param = {
          summaryFlag: 1,
          reportTableInfo: {
            reportCode: this.reportCode,
            queryArr: queryArr,
            tableName: this.tableName,
            colArr: this.styleColArr
          },
          pagingInfo: {
            startIndex: 1,
            rows: this.Pagination.pagesize
          }
        };
        //调用api，展示表格内容
        console.log(param);
        this.$rptList
          .showReportData(param)
          .then(data => {
            const tableData = JSON.parse(data.data);
            console.log(tableData);
            datacenterBus.$emit("tableDataArrEventNoGroup", tableData);
          })
          .catch(msg => {
            console.log(msg);
          });
      } else {
        //有分组，分组查询
        //声明参数
        let param = {
          summaryFlag: 1,
          groupFlag: 1,
          firstQueryFlag: 1,
          reportTableInfo: {
            reportCode: this.reportCode,
            queryArr: queryArr,
            tableName: this.tableName,
            colArr: this.styleColArr,
            groupArr: this.styleGroupArr
          }
        };
        //调用api，展示表格内容
        this.$rptList
          .showReportData(param)
          .then(data => {
            const tableData = JSON.parse(data.data);
            console.log(tableData);

            datacenterBus.$emit("tableDataArrEventYesGroup", tableData);
          })
          .catch(msg => {
            console.log(msg);
          });
      }
    }
  },
  watch: {
    styleExtQueryArr: function(newVal, oldVal) {
      this.styleExtQueryArr = newVal;
    },
    //通过监听styleGroupArr的变化，同步模板切换时表格的数据
    styleGroupArr(newVal, oldVal) {
      if (newVal.length !== 0 && this.getDataStatus === true) {
        this.getTableValue("");
      }
      if (newVal.length === 0 && this.getDataStatus === true) {
        this.getTableValue("");
      }
    }
  },
  created() {
    //监听表格搜索
    datacenterBus.$on("sendSearchData", data => {
      data.forEach(element => {
        if (element.queryColValue === "空白") {
          element.operation = " is";
          element.queryColValue = "null";
        }
        if (element.queryColValue === "无空白") {
          element.operation = " is not";
          element.queryColValue = "null";
        }
      });
      let inputData = JSON.parse(JSON.stringify(this.baseQueryArr));
      data.forEach(element => {
        inputData.push(element);
      });

      this.searchData = JSON.parse(JSON.stringify(inputData));
      this.getTableValue(inputData);
      datacenterBus.$emit("sendSearch", this.searchData);
    });
    //监听切换模板样式时获取表格数据的事件
    datacenterBus.$on("getTableData", () => {
      this.getTableValue("");
    });
    //监听分组查询表格排序
    datacenterBus.$on();
  }
};
</script>
<style lang="scss" scoped>
@import url("../../assets/style/dataQuery.css");
</style>