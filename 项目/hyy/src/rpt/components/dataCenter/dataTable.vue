<template>
  <div class="datacenter-main">
    <el-table
      class="table"
      stripe
      row-key="id"
      :border="true"
      :data="noGroupTableData"
      highlight-current-row
      :show-summary="true"
      :summary-method="getSummaries"
      v-if="styleGroupArr.length == 0"
      ref="datatable"
      :header-cell-style="{background:'#E7EBFF',height:'38px !important'}"
      @scroll.native="handleScroll"
      v-loading="tableLoading"
      :style="{width: `${widthTotal}px`, height: `616px`}"
    >
      <template v-for="(item, index) in styleColArr">
        <el-table-column
          :key="index"
          :prop="noGroupStyleColArr[index].prop"
          :label="item.label"
          :width="item.width"
          :render-header="renderHeader"
        ></el-table-column>
      </template>
    </el-table>
    <div
      class="el-table-newbox"
      v-if="styleGroupArr.length > 0"
      ref="groupDatatable"
      style="height: 662px;"
    >
      <table class="el-table" ref="tableWrapper" v-loading="tableLoading">
        <thead ref="groupThead">
          <tr>
            <template v-for="(item,index) in styleColArr">
              <th :width="item.width">
                <div class="cell">
                  <div>{{ item.label }}</div>
                  <div class="sort-icon">
                    <i
                      class="el-icon-caret-top group-ascsort group-sort"
                      @click="groupSortClick(item.colKey, 'ASC', index)"
                    ></i>
                    <i
                      class="el-icon-caret-bottom group-descsort group-sort"
                      @click="groupSortClick(item.colKey, 'DESC', index)"
                    ></i>
                  </div>
                </div>
              </th>
            </template>
          </tr>
        </thead>
        <tbody v-if="this.datatable.length > 0" class="group-tbody">
          <template v-for="(item,index) in datatable">
            <tr class="el-table__row trName" :dataIndex="index">
              <td :colspan="colspan">
                <div class="cell">
                  <div class="typestyle">
                    <i
                      class="el-icon-circle-plus-outline new-icon"
                      v-show="item.isShow == 'true'"
                      @click="showChildTr(item.childGroupArr, item.groupColKey, item.groupColValue,index)"
                    ></i>
                    <i
                      class="el-icon-remove-outline new-icon"
                      v-show="item.isShow  == 'false'"
                      @click="closeChildTr(index)"
                    ></i>
                  </div>
                  {{ item.groupColValue }}
                </div>
              </td>
            </tr>
            <template
              v-for="(children,index1) in item.childrenDatas1"
              v-if="item.childGroupArr.length == 0 "
            >
              <tr class="el-table__row trNamestyle1 trName1" :dataIndex="index+''+index1">
                <template v-for="el in children.rowData">
                  <td class="el-table_13_column_55" :width="el.colwitadh">
                    <div class="cell" :style="{width: el.colWidth - 1 + 'px'}">{{ el.colValue }}</div>
                  </td>
                </template>
              </tr>
            </template>

            <template
              v-for="(children,index1) in item.childrenDatas1"
              v-if="item.childGroupArr.length != 0 "
            >
              <tr class="el-table__row trName1" :dataIndex="index+''+index1">
                <td :colspan="colspan">
                  <div class="cell">
                    <div class="typestyle">
                      <i
                        class="el-icon-circle-plus-outline new-icon"
                        v-show="children.isShow == 'true'"
                        @click="showChildTr1(children.childGroupArr,children.groupColKey,children.groupColValue,index1,index)"
                      ></i>
                      <i
                        class="el-icon-remove-outline new-icon"
                        v-show="children.isShow == 'false'"
                        @click="closeChildTr1(index1,index)"
                      ></i>
                    </div>
                    {{ children.groupColValue }}
                  </div>
                </td>
              </tr>
              <template
                v-for="(children1,index2) in children.childrenDatas1"
                v-if="children.childGroupArr.length == 0 "
              >
                <tr class="el-table__row trNamestyle2 trName2">
                  <template v-for="el in children1.rowData" :dataIndex="index+''+index1+''+index2">
                    <td class="el-table_13_column_55">
                      <div class="cell" :style="{width: el.colWidth - 1 + 'px'}">{{ el.colValue }}</div>
                    </td>
                  </template>
                </tr>
              </template>
              <template
                v-for="(children1,index2) in children.childrenDatas1"
                v-if="children.childGroupArr.length != 0 "
              >
                <tr class="el-table__row trName2" :dataIndex="index+''+index1+''+index2">
                  <td :colspan="colspan">
                    <div class="cell">
                      <div class="typestyle">
                        <i
                          class="el-icon-circle-plus-outline new-icon"
                          v-show="children1.isShow == 'true'"
                          @click="showChildTr2(children1.childGroupArr,children1.groupColKey,children1.groupColValue,index2,index1,index)"
                        ></i>
                        <i
                          class="el-icon-remove-outline new-icon"
                          v-show="children1.isShow == 'false'"
                          @click="closeChildTr2(index2,index1,index)"
                        ></i>
                      </div>
                      {{ children1.groupColValue }}
                    </div>
                  </td>
                </tr>
                <template
                  v-for="(children2,index3) in children1.childrenDatas1"
                  v-if="children1.childGroupArr.length == 0 "
                >
                  <tr
                    class="el-table__row trNamestyle3 trName3"
                    :dataIndex="index+''+index1+''+index2+''+index3"
                  >
                    <template v-for="el in children2.rowData">
                      <td class="el-table_13_column_55">
                        <div class="cell" :style="{width: el.colWidth - 1 + 'px'}">{{ el.colValue }}</div>
                      </td>
                    </template>
                  </tr>
                </template>
                <tr
                  class="el-table__row new-sunColor trNamestyle2 trName2"
                  :dataIndex="index+''+index1+''+index2"
                >
                  <template v-for="el in children1.rowData">
                    <td class="el-table_13_column_55">
                      <div class="cell" :style="{width: el.colWidth - 1 + 'px'}">{{ el.colValue }}</div>
                    </td>
                  </template>
                </tr>
              </template>
              <tr
                class="el-table__row new-sunColor trNamestyle1 trName1"
                :dataIndex="index+''+index1"
              >
                <template v-for="el in children.rowData">
                  <td class="el-table_13_column_55">
                    <div class="cell" :style="{width: el.colWidth - 1 + 'px'}">{{ el.colValue }}</div>
                  </td>
                </template>
              </tr>
            </template>
            <tr class="el-table__row new-sunColor trNamestyle trName" :dataIndex="index">
              <template v-for="(el,idx) in item.rowData">
                <td class="el-table_13_column_55" :key="idx">
                  <div class="cell" :style="{width: el.colWidth - 1 + 'px'}">{{ el.colValue }}</div>
                </td>
              </template>
            </tr>
          </template>
        </tbody>
        <tfoot ref="summaryWrapper">
          <tr>
            <td class="el-table_13_column_55" v-for="(summaryItem, idx) in this.summary" :key="idx">
              <div
                class="cell"
                :style="{width: summaryItem.colWidth - 1 + 'px'}"
              >{{ summaryItem.colValue }}</div>
            </td>
          </tr>
        </tfoot>
        <tbody v-if="this.datatable.length == 0">
          <tr class="no-content" :style="{height: tableHeight2 + 'px'}">暂无数据</tr>
        </tbody>
      </table>
    </div>
    <table-dialog
      :dialogVisible="dialogVisible"
      :colKey="colKey"
      :colData="colData"
      @sendSelectStatus="getSelectStatus"
      @sendDialog1Visible="getDialog1Visible"
      @sendAdvancedData="getAdvancedData"
    ></table-dialog>
    <table-dialog1
      :dialogVisible1="dialogVisible1"
      :searchData="searchData"
      :colKey="colKey"
      :tableName="tableName"
      :reportCode="reportCode"
      :advancedData="advancedData"
      @showDetailDialog="showDetailDialog"
      @sendSelectStatus="getSelectStatus"
    ></table-dialog1>
  </div>
</template>
<script>
import datacenterBus from "../../assets/datacenterBus.js";
import TableDialog from "./dataCommon/tableDialog";
import TableDialog1 from "./dataCommon/tableDialog1";
import Sortable from "sortablejs";
import { ascCompare, descCompare } from "../../util/complexSort.js";
import Print from "../../assets/prints.js";
import Vue from "vue";

let szArray = arr => {
  const m = arr.slice(1);
  const t = m.push({ operation: "=" });
  return t;
};

let getDom = className => {
  return document.getElementsByClassName(className);
};

export default {
  props: {
    Pagination: Object,
    colArr: Array,
    baseQueryArr: Array,
    styleExtQueryArr: Array,
    datatable: Array,
    groupArr: Array,
    styleGroupArr: Array,
    styleColArr: Array,
    tableName: String,
    reportCode: String,
    tableLoading: Boolean,
    colSummary: Object, //列汇总数据
    summary: Array //分组列汇总数据
  },
  data() {
    return {
      newcolArr: this.styleColArr,
      dataSource: [],
      childGroupArr: [],
      tableData2: [],
      cValue1: {},
      cValue2: {},
      cValue3: {},
      tableHeight1: "",
      tableHeight2: "",
      bodyTable: [], //表体内容
      searchData: [],
      show: true,
      inputData: "",
      colKey: "",
      colValue: "",
      colData: [],
      queryData: [],
      dialogVisible: false,
      dialogVisible1: false,
      selectStatus: "",
      itemIndex: "",
      itemValue: "",
      count: 0,
      widthArr: [],
      widthTotal: "",
      colspan: "",
      noGroupTableData: [],
      noGroupStyleColArr: [],
      //高级筛选数据
      advancedData: []
    };
  },
  components: {
    TableDialog,
    TableDialog1
  },
  watch: {
    datatable: {
      handler(newVal, oldVal) {
        newVal.forEach((element, index) => {
          element.id = index;
        });
        this.noGroupTableData = JSON.parse(JSON.stringify(newVal));
      },
      deep: true
    },
    styleColArr: {
      handler(newVal, oldVal) {
        this.noGroupStyleColArr = JSON.parse(JSON.stringify(newVal));
      },
      deep: true
    }
  },
  methods: {
    handleScroll() {},
    showChildTr: function(a, b, c, d) {
      datacenterBus.$emit("tableLoading");
      this.cValue1 = { queryColKey: b, queryColValue: c, operation: "=" };
      let dValue = [];
      if (this.styleExtQueryArr != null) {
        dValue = JSON.parse(
          JSON.stringify(this.baseQueryArr.concat(this.styleExtQueryArr))
        );
      } else {
        dValue = JSON.parse(JSON.stringify(this.baseQueryArr));
      }
      dValue.push(this.cValue1);
      //声明参数
      let param = {
        summaryFlag: 1,
        groupFlag: 1,
        reportTableInfo: {
          reportCode: this.reportCode,
          queryArr: dValue,
          tableName: this.tableName,
          colArr: this.styleColArr,
          groupArr: a
        }
      };

      //调用api，展示表格内容
      this.$rptList
        .showReportData(param)
        .then(data => {
          let tableData2 = JSON.parse(data.data);
          datacenterBus.$emit("newtableDataArrEvent", tableData2, d);
        })
        .catch(msg => {
          console.log(msg);
        });
    },
    closeChildTr: function(index) {
      datacenterBus.$emit("closeNewtableDataArrEvent", index);
    },
    showChildTr1: function(a, b, c, d, e) {
      datacenterBus.$emit("tableLoading");
      this.cValue2 = { queryColKey: b, queryColValue: c, operation: "=" };
      const dValue = this.baseQueryArr.concat(this.styleExtQueryArr);
      dValue.push(this.cValue2, this.cValue1);

      //声明参数
      let param = {
        summaryFlag: 1,
        groupFlag: 1,
        reportTableInfo: {
          reportCode: this.reportCode,
          queryArr: dValue,
          tableName: this.tableName,
          colArr: this.styleColArr,
          groupArr: a
        }
      };

      //调用api，展示表格内容
      this.$rptList
        .showReportData(param)
        .then(data => {
          let tableData2 = JSON.parse(data.data);
          datacenterBus.$emit("newtableDataArrEvent1", tableData2, d, e);
        })
        .catch(msg => {
          console.log(msg);
        });
    },
    closeChildTr1: function(index1, index) {
      datacenterBus.$emit("closeNewtableDataArrEvent1", index1, index);
    },
    showChildTr2: function(a, b, c, d, e, f) {
      datacenterBus.$emit("tableLoading");
      this.cValue3 = { queryColKey: b, queryColValue: c, operation: "=" };
      const dValue = this.baseQueryArr.concat(this.styleExtQueryArr);
      dValue.push(this.cValue2, this.cValue1, this.cValue3);

      //声明参数
      let param = {
        summaryFlag: 1,
        groupFlag: 1,
        reportTableInfo: {
          reportCode: this.reportCode,
          queryArr: dValue,
          tableName: this.tableName,
          colArr: this.styleColArr,
          groupArr: a
        }
      };

      //调用api，展示表格内容
      this.$rptList
        .showReportData(param)
        .then(data => {
          let tableData2 = JSON.parse(data.data);
          datacenterBus.$emit("newtableDataArrEvent2", tableData2, d, e, f);
        })
        .catch(msg => {
          console.log(msg);
        });
    },
    closeChildTr2: function(index2, index1, index) {
      datacenterBus.$emit("closeNewtableDataArrEvent2", index2, index1, index);
    },
    //无分组表格数据全排序
    noGroupSortClick(colKey, order, index) {
      let nogroupSort = getDom("nogroup-sort");
      let asc = getDom("nogroup-ascsort")[index];
      let desc = getDom("nogroup-descsort")[index];
      let queryArr = this.baseQueryArr;
      let sortArray = [
        {
          colKey: colKey,
          orderDesc: order
        }
      ];
      if (this.styleExtQueryArr != null) {
        queryArr = queryArr.concat(this.styleExtQueryArr);
      }
      let param = {
        summaryFlag: 1,
        reportTableInfo: {
          reportCode: this.reportCode,
          queryArr: queryArr,
          tableName: this.tableName,
          colArr: this.styleColArr,
          orderArr: sortArray
        },
        pagingInfo: {
          startIndex: this.Pagination.currentPage,
          rows: this.Pagination.pagesize
        }
      };

      //点击排序的箭头效果
      for (let i = 0; i < nogroupSort.length; i++) {
        nogroupSort[i].style.color = "#999999";
      }
      if (order === "ASC") {
        asc.style.color = "#3b74ff";
      }
      if (order === "DESC") {
        desc.style.color = "#3b74ff";
      }

      this.$rptList
        .showReportData(param)
        .then(data => {
          var tableData = JSON.parse(data.data);
          this.$emit("tableDataArrEventNoGroup", tableData, sortArray);
        })
        .catch(msg => {
          console.log(msg);
        });
    },
    //获取汇总行
    getSummaries: function(param) {
      let sumArr = [];
      for (var i = 0; i < this.styleColArr.length; i++) {
        let colKey = this.styleColArr[i].colKey;
        if (i == 0) {
          sumArr.push("合计");
        } else {
          if (typeof this.colSummary[colKey] == "number") {
            sumArr.push(this.colSummary[colKey].toFixed(2));
          } else {
            sumArr.push(this.colSummary[colKey]);
          }
        }
      }
      return sumArr;
    },
    //清空排序
    clearSort: function() {
      this.$refs.datatable.clearSort();
    },
    printTable: function() {
      Vue.use(Print);
      this.$print(this.$refs.datatable);
    },
    groupDatatable: function() {
      Vue.use(Print);
      this.$print(this.$refs.groupDatatable);
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    //渲染筛选、排序图标
    renderHeader(h, { column, $index }) {
      return (
        <div class="icon">
          <span>{column.label}</span>
          <span
            style="height: 38px;"
            onClick={() => {
              this.handleSearchClick(column, $index);
            }}
          >
            <i
              id={$index + "btn"}
              ref="search-icon"
              class="iconfont icon-baobiao-shaixuan"
              style="color: #666666"
            />
          </span>
          <span class="sort-icon">
            <i
              class="el-icon-caret-top nogroup-ascsort nogroup-sort"
              onClick={() => {
                this.noGroupSortClick(column.property, "ASC", $index);
              }}
            />
            <i
              class="el-icon-caret-bottom nogroup-descsort nogroup-sort"
              onClick={() => {
                this.noGroupSortClick(column.property, "DESC", $index);
              }}
            />
          </span>
        </div>
      );
    },
    //点击筛选查询按钮
    handleSearchClick(data, index) {
      this.intemIndex = index;
      this.intemValue = data.property;
      let searchBtn = document.getElementById(index + "btn");
      if (
        this.selectStatus.status === true &&
        this.selectStatus.value === data.property
      ) {
        searchBtn.style.color = "#3b74ff";
      }
      this.colKey = data.property;
      this.colValue = data.label;
      this.$rptList
        .getTableSearchData(this.tableName, this.colKey, this.reportCode)
        .then(res => {
          this.searchData = res.data.result;
          this.searchData.unshift("空白", "无空白");
          this.dialogVisible1 = true;
          this.dialogVisible = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    showDetailDialog() {
      this.dialogVisible = true;
    },
    getDialog1Visible() {
      this.dialogVisible1 = false;
    },
    getAdvancedData(data) {
      console.log(data);
      data.forEach(element => {
        if (element.isAdvanced === true) {
          this.advancedData.push(element)
        }
      });
      console.log(this.advancedData);
    },
    //控制表格筛选查询按钮样式
    getSelectStatus(data) {
      this.selectStatus = data;
      let searchBtn = document.getElementById(this.intemIndex + "btn");
      if (this.selectStatus.select === true) {
        searchBtn.style.color = "#3b74ff";
      }
      if (this.selectStatus.select === false) {
        searchBtn.style.color = "rgb(102, 102, 102)";
        searchBtn.style.fontWeight = "normal";
      }
    },
    //排序方法
    sortCompare(data, order, sortParam, colKey) {
      //提取要排序的列数据放到数据结构的第一级
      data.forEach(element1 => {
        element1.rowData.forEach(element2 => {
          if (element2.colKey === colKey) {
            sortParam = element2.colValue;
            element1.sortParam = sortParam;
          }
        });
      });

      if (order === "ASC") {
        data.sort(ascCompare("sortParam"));
      }
      if (order === "DESC") {
        data.sort(descCompare("sortParam"));
      }
      data.forEach(element => {
        delete element.sortParam;
      });
    },
    //分组排序
    groupSortClick(colKey, order, index) {
      let sortParam, tableData;
      let groupSort = getDom("group-sort");
      let groupAsc = getDom("group-ascsort")[index];
      let groupDesc = getDom("group-descsort")[index];
      let data = JSON.parse(
        JSON.stringify({
          list: this.datatable,
          summary: this.summary
        })
      );

      for (let i = 0; i < groupSort.length; i++) {
        groupSort[i].style.color = "#999999";
      }
      if (order === "ASC") {
        groupAsc.style.color = "#3b74ff";
      }
      if (order === "DESC") {
        groupDesc.style.color = "#3b74ff";
      }

      this.sortCompare(data.list, order, sortParam, colKey);

      tableData = {
        summary: data.summary,
        list: data.list
      };

      datacenterBus.$emit("tableDataArrEventYesGroup", tableData);
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      this.sortable = Sortable.create(tbody, {
        animation: 180,
        delay: 0,
        onEnd: evt => {
          const currentRow = this.noGroupTableData[evt.oldIndex];
          this.noGroupTableData.splice(evt.oldIndex, 1);
          this.noGroupTableData.splice(evt.newIndex, 0, currentRow);
        }
      });
    },
    //列拖拽
    columnDrop() {
      const wrapperTr = document.querySelector(".el-table__header-wrapper tr");
      this.sortable = Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        onEnd: evt => {
          const oldItem = this.noGroupStyleColArr[evt.oldIndex];
          const newItem = this.noGroupStyleColArr[evt.newIndex];
          this.noGroupStyleColArr.splice(evt.oldIndex, 1);
          this.noGroupStyleColArr.splice(evt.newIndex, 0, oldItem);
        }
      });
    }
  },
  mounted() {
    this.rowDrop();
    this.columnDrop();
    datacenterBus.$on("visibleEvent", data => {
      this.dialogVisible = data;
      this.dialogVisible1 = data;
    });
    datacenterBus.$on("sendSearchData", data => {
      this.colData = data;
    });
    datacenterBus.$on("visibleStatus", data => {
      this.dialogVisible = false;
    });
  },
  updated() {
    let widthSum = 0;
    let dataCenterMain = getDom("datacenter-main");
    let newBox = getDom("el-table-newbox");
    this.widthArr = [];
    this.colspan = this.styleColArr.length;
    this.styleColArr.forEach(element1 => {
      widthSum += element1.width;
    });
    this.widthTotal = widthSum;

    dataCenterMain[0].scrollLeft = 0;
    //固定未分组查询表格表头和合计行
    dataCenterMain[0].addEventListener("scroll", () => {
      if (dataCenterMain.length != 0 && newBox.length == 0) {
        let tableHeader = getDom("el-table__header-wrapper");
        let tableFoot = getDom("el-table__footer-wrapper");
        let scrollTop = dataCenterMain[0].scrollTop;
        let styleParams =
          "transform:translate(0," +
          scrollTop +
          "px); position: absolute; z-index: 10;";
        tableHeader[0].style = styleParams;
        tableFoot[0].style = styleParams;
      }

      //固定分组查询表格表头和合计行
      if (newBox.length != 0) {
        this.count++;
        let scrollTop = dataCenterMain[0].scrollTop;
        let groupTbody = getDom("group-tbody");
        let clientHeight = dataCenterMain[0].clientHeight;
        let scrollHeight = dataCenterMain[0].scrollHeight;
        let styleParams =
          "transform:translate(0," +
          scrollTop +
          "px); position: absolute; z-index: 10; width: " +
          widthSum +
          "px;";
        if (scrollTop + clientHeight <= scrollHeight) {
          this.$refs.groupThead.style = styleParams;
          this.$refs.tableWrapper.style = `width:${widthSum}px`;
          this.$refs.summaryWrapper.style = styleParams;
          if (this.count === 1) {
            groupTbody[0].style = "position: absolute; top: 38px;";
            let newTr = document.createElement("tr");
            newTr.setAttribute("class", "el-table__row trName");
            groupTbody[0].appendChild(newTr);
          }
        }
      }
    });
  }
};
</script>

<style scoped>
@import url("../../assets/style/dataTable.css");
</style>
