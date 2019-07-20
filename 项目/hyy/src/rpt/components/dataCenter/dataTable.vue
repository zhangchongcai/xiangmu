<template>
  <div class="datacenter-main">
    <!-- <div class="group-btn">
      <div class="group-btn-list">
        <div
          class="group-btn-item"
          v-for="(item, idx) in tableGroupArr"
          :key="`tableGroup_${idx}`"
        >{{ item }}</div>
      </div>
    </div>-->
    <el-table
      class="no-group-table table-wapper"
      stripe
      border
      row-key="id"
      v-if="styleGroupArr.length == 0"
      ref="datatable"
      @scroll.native="handleScroll"
      @cell-click="cellClick"
      v-loading="tableLoading"
      :data="noGroupTableData"
      :show-summary="true"
      :summary-method="getSummaries"
      :header-cell-style="{background: '#E7EBFF', height: '36px', lineHeight: '36px', boxSizing: 'border-box'}"
      :header-row-style="{background: '#E7EBFF', height: '36px', lineHeight: '36px', boxSizing: 'border-box'}"
    >
        <el-table-column
          v-for="(item, index) in tableStyleColArr"
          :key="`table_${index}`"
          :prop="noGroupStyleColArr[index].prop"
          :label="item.label"
          :width="item.width"
          :render-header="renderHeader"
        ></el-table-column>
    </el-table>
    <div
      class="group-table table-wrapper"
      v-if="styleGroupArr.length > 0"
      ref="groupDatatable"
      v-loading="tableLoading"
    >
      <div class="el-table__header-wrapper" :style="`width: ${widthTotal}px`">
        <table class="el-table" :style="`width: ${widthTotal}px`">
          <tr>
            <template v-for="(item,index) in tableStyleColArr">
              <th :width="item.width" :key="`groupTable1_${index}`">
                <div class="cell" :style="{width: `${item.width}px`}">
                  <div class="label">{{ item.label }}</div>
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
        </table>
      </div>

      <div class="el-table__body-wrapper" :style="`width: ${widthTotal}px`">
        <table v-if="this.datatable.length > 0" class="el-table" :style="`width: ${widthTotal}px`">
          <template v-for="(item,index) in datatable">
            <tr class="el-table__row trName" :dataIndex="index" :key="`groupTable2_${index}`">
              <td :style="`width: ${widthTotal}px`">
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
              <tr
                class="el-table__row trNamestyle1 trName1"
                :dataIndex="index+''+index1"
                :key="`groupTable3_${index1}`"
              >
                <template v-for="(el, idx) in children.rowData">
                  <td
                    class="el-table_13_column_55"
                    :width="el.colWidth"
                    :key="`groupTable4_${idx}`"
                  >
                    <div class="cell" :style="{width: `${el.colWidth}px` }">{{ el.colValue }}</div>
                  </td>
                </template>
              </tr>
            </template>

            <template
              v-for="(children,index1) in item.childrenDatas1"
              v-if="item.childGroupArr.length != 0 "
            >
              <tr
                class="el-table__row trName1"
                :dataIndex="index+''+index1"
                :key="`groupTable5_${index1}`"
              >
                <td :style="`width: ${widthTotal}px`">
                  <div class="cell trName1-cell">
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
                <tr class="el-table__row trNamestyle2 trName2" :key="`groupTable6_${index2}`">
                  <template
                    v-for="(el,idx) in children1.rowData"
                    :dataIndex="index+''+index1+''+index2"
                  >
                    <td
                      class="el-table_13_column_55"
                      :width="el.colWidth"
                      :key="`groupTable7_${idx}`"
                    >
                      <div class="cell" :style="{width: `${el.colWidth}px` }">{{ el.colValue }}</div>
                    </td>
                  </template>
                </tr>
              </template>
              <template
                v-for="(children1,index2) in children.childrenDatas1"
                v-if="children.childGroupArr.length != 0 "
              >
                <tr
                  class="el-table__row trName2"
                  :dataIndex="index+''+index1+''+index2"
                  :key="`groupTable8_${index2}`"
                >
                  <td :style="`width: ${widthTotal}px`">
                    <div class="cell trName2-cell">
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
                    :key="index3"
                  >
                    <template v-for="(el, idx) in children2.rowData">
                      <td
                        class="el-table_13_column_55"
                        :width="el.colWidth"
                        :key="`groupTable9_${idx}`"
                      >
                        <div class="cell" :style="{width: `${el.colWidth}px` }">{{ el.colValue }}</div>
                      </td>
                    </template>
                  </tr>
                </template>
                <tr
                  class="el-table__row new-sunColor trNamestyle2 trName2"
                  :dataIndex="index+''+index1+''+index2"
                  :key="`groupTable10_${index2}`"
                >
                  <template v-for="(el, index) in children1.rowData">
                    <td
                      class="el-table_13_column_55"
                      :width="el.colWidth"
                      :key="`groupTable11_${index}`"
                    >
                      <div class="cell" :style="{width: `${el.colWidth}px` }">{{ el.colValue }}</div>
                    </td>
                  </template>
                </tr>
              </template>
              <tr
                class="el-table__row new-sunColor trNamestyle1 trName1"
                :dataIndex="index+''+index1"
                :key="`groupTable12_${index1}`"
              >
                <template v-for="(el, itemIndex) in children.rowData">
                  <td
                    class="el-table_13_column_55"
                    :width="el.colWidth"
                    :key="`groupTable13_${itemIndex}`"
                  >
                    <div class="cell" :style="{width: `${el.colWidth}px` }">{{ el.colValue }}</div>
                  </td>
                </template>
              </tr>
            </template>
            <tr
              class="el-table__row new-sunColor trNamestyle trName"
              :dataIndex="index"
              :key="`groupTable14_${index}`"
            >
              <template v-for="(el,idx) in item.rowData">
                <td class="el-table_13_column_55" :width="el.colWidth" :key="`groupTable15_${idx}`">
                  <div class="cell" :style="{width: `${el.colWidth}px` }">{{ el.colValue }}</div>
                </td>
              </template>
            </tr>
          </template>
        </table>
      </div>

      <div class="el-table__footer-wrapper" :style="`width: ${widthTotal}px`">
        <table class="el-table" :style="`width: ${widthTotal}px`">
          <tr>
            <td
              class="el-table_13_column_55"
              v-for="(summaryItem, idx) in this.summary"
              :width="summaryItem.colWidth"
              :key="`groupTable16_${idx}`"
            >
              <div
                class="cell"
                :style="{width: summaryItem.colWidth + 'px'}"
              >{{ summaryItem.colValue }}</div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div v-if="this.datatable.length === 0 && tableLoading === false" class="no-data">没有数据</div>
    <table-searcher
      :dialogVisible="dialogVisible"
      :colKey="colKey"
      :colData="colData"
      @sendSelectStatus="getSelectStatus"
      @sendDialog1Visible="getDialog1Visible"
      @sendAdvancedData="getAdvancedData"
    ></table-searcher>
    <table-filter
      :dialogVisible1="dialogVisible1"
      :searchData="searchData"
      :colKey="colKey"
      :tableName="tableName"
      :reportCode="reportCode"
      :advancedData="advancedData"
      @showDetailDialog="showDetailDialog"
      @sendSelectStatus="getSelectStatus"
    ></table-filter>
  </div>
</template>
<script>
import datacenterBus from "src/rpt/util/datacenterBus.js";
import TableSearcher from "./dataCommon/tableSearcher";
import TableFilter from "./dataCommon/tableFilter";
import Sortable from "sortablejs";
import { ascCompare, descCompare } from "../../util/complexSort.js";
import Print from "src/rpt/util/prints";
import Vue from "vue";
import ClipboardJS from "../../util/clipboard";
import mixins from "src/frame_cpm/mixins/cacheMixin.js";
import { mapState } from "vuex";
import Draggable from "vuedraggable";

let szArray = arr => {
  const m = arr.slice(1);
  const t = m.push({ operation: "=" });
  return t;
};

let getDom = className => {
  return document.getElementsByClassName(className);
};

export default {
  mixins: [mixins.cacheMixin],
  props: {
    Pagination: Object,
    colArr: Array,
    baseQueryArr: Array,
    styleExtQueryArr: Array,
    datatable: Array,
    groupArr: Array,
    styleGroupArr: Array,
    styleColArr: Array,
    tableStyleColArr: Array,
    tableName: String,
    reportCode: String,
    tableLoading: Boolean,
    colSummary: Object, //列汇总数据
    summary: Array //分组列汇总数据
  },
  data() {
    return {
      cacheField: [
        "searchData",
        "colData",
        "noGroupTableData",
        "noGroupStyleColArr",
        "advancedData",
        "widthArr",
        "widthTotal"
      ],
      subComName: "dataTable",
      childGroupArr: [],
      tableData2: [],
      cValue1: {},
      cValue2: {},
      cValue3: {},
      searchData: [],
      show: true,
      colKey: "",
      colValue: "",
      colData: [],
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
      advancedData: [],
      copys: "",
      tableGroupArr: [1, 2, 3]
    };
  },
  components: {
    TableSearcher,
    TableFilter,
    Draggable
  },
  computed: mapState({
    isFilted: state => state.rpt.isFilted
  }),
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
    tableStyleColArr: {
      handler(newVal, oldVal) {
        this.noGroupStyleColArr = JSON.parse(JSON.stringify(newVal));
      },
      deep: true
    },
    isFilted(newVal, oldVal) {
      if (newVal) {
        let nogroupSort, groupSort;
        if (this.styleGroupArr.length === 0) {
          nogroupSort = getDom("nogroup-sort");
          for (let i = 0; i < nogroupSort.length; i++) {
            nogroupSort[i].style.color = "#999999";
          }
        } else {
          groupSort = getDom("group-sort");
          for (let i = 0; i < groupSort.length; i++) {
            groupSort[i].style.color = "#999999";
          }
        }
      }
    }
  },
  methods: {
    //单击复制
    cellClick(row, column, cell, event) {
      let target = `target${Math.random() * 100000000}`.substring(0, 12);
      let trigger = `trigger${Math.random() * 10000000}`.substring(0, 12);
      cell.children[0].id = target;
      cell.className = trigger;
      cell.setAttribute("data-clipboard-action", "copy");
      cell.setAttribute("data-clipboard-target", `#${target}`);
      let clipboard = new ClipboardJS(`.${trigger}`);
    },
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
          colArr: this.tableStyleColArr,
          groupArr: a
        }
      };

      //调用api，展示表格内容
      this.$rptList
        .showReportData(param)
        .then(data => {
          let tableData2 = JSON.parse(data.data);
          this.$emit("newtableDataArrEvent", tableData2, d);
        })
        .catch(msg => {
          console.log(msg);
        });
    },
    closeChildTr: function(index) {
      this.$emit("closeNewtableDataArrEvent", index);
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
          colArr: this.tableStyleColArr,
          groupArr: a
        }
      };

      //调用api，展示表格内容
      this.$rptList
        .showReportData(param)
        .then(data => {
          let tableData2 = JSON.parse(data.data);
          this.$emit("newtableDataArrEvent1", tableData2, d, e);
        })
        .catch(msg => {
          console.log(msg);
        });
    },
    closeChildTr1: function(index1, index) {
      this.$emit("closeNewtableDataArrEvent1", index1, index);
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
          colArr: this.tableStyleColArr,
          groupArr: a
        }
      };

      //调用api，展示表格内容
      this.$rptList
        .showReportData(param)
        .then(data => {
          let tableData2 = JSON.parse(data.data);
          this.$emit("newtableDataArrEvent2", tableData2, d, e, f);
        })
        .catch(msg => {
          console.log(msg);
        });
    },
    closeChildTr2: function(index2, index1, index) {
      this.$emit("closeNewtableDataArrEvent2", index2, index1, index);
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
          colArr: this.tableStyleColArr,
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
      //重置isFilted状态
      this.$store.commit("setIsFilted", false);
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
      for (var i = 0; i < this.tableStyleColArr.length; i++) {
        let colKey = this.tableStyleColArr[i].colKey;
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
        <div class="icon" style="height: 38px; line-height: 38px;">
          <span>{column.label}</span>
          <span
            style="height: 38px; line-height: 38px;"
            class="select-icon"
            onClick={() => {
              this.handleSearchClick(column, $index);
            }}
          >
            <i
              id={`${$index}btn`}
              ref="search-icon"
              class="iconfont icon-baobiao-shaixuan"
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
      let queryArr = this.baseQueryArr.concat(this.styleExtQueryArr);
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
        .getTableSearchData(
          this.tableName,
          this.colKey,
          this.reportCode,
          queryArr
        )
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
      data.forEach(element => {
        if (element.isAdvanced === true) {
          this.advancedData.push(element);
        }
      });
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
      //重置isFilted状态
      this.$store.commit("setIsFilted", false);

      this.sortCompare(data.list, order, sortParam, colKey);

      tableData = {
        summary: data.summary,
        list: data.list
      };

      this.$emit("tableDataArrEventYesGroup", tableData);
    },
    //行拖拽
    // rowDrop() {
    //   const tbody = document.querySelector(".el-table__body-wrapper tbody");
    //   this.sortable = Sortable.create(tbody, {
    //     animation: 180,
    //     delay: 0,
    //     onEnd: evt => {
    //       const currentRow = this.noGroupTableData[evt.oldIndex];
    //       this.noGroupTableData.splice(evt.oldIndex, 1);
    //       this.noGroupTableData.splice(evt.newIndex, 0, currentRow);
    //     }
    //   });
    // },
    //列拖拽
    // columnDrop() {
    //   const wrapperTr = document.querySelector(".el-table__header-wrapper tr");
    //   this.sortable = Sortable.create(wrapperTr, {
    //     animation: 180,
    //     delay: 0,
    //     onEnd: evt => {
    //       const oldItem = this.noGroupStyleColArr[evt.oldIndex];
    //       const newItem = this.noGroupStyleColArr[evt.newIndex];
    //       this.noGroupStyleColArr.splice(evt.oldIndex, 1);
    //       this.noGroupStyleColArr.splice(evt.newIndex, 0, oldItem);
    //     }
    //   });
    // },
    handleMove(event) {
    },
    setTableStyle(tableHeader, tableBody, table) {
      tableHeader.style = "position: absolute; z-index: 100;";
      tableBody.style = "display: block; margin: 38px 0; ";
      table.style = "overflow: auto;";
    }
  },
  mounted() {
    // this.rowDrop();
    // this.columnDrop();
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
    let groupTable = getDom("group-table")[0];
    let noGroupTable = getDom("no-group-table")[0];
    let tableHeader = getDom("el-table__header-wrapper")[0];
    let tableBody = getDom("el-table__body-wrapper")[0];
    let tableFooter = getDom("el-table__footer-wrapper")[0];
    let widthSum = 0;

    this.widthArr = [];
    this.tableStyleColArr.forEach(element1 => {
      widthSum += element1.width;
    });
    this.widthTotal = widthSum;
    this.colspan = this.tableStyleColArr.length;

    //分组表格
    if (groupTable) {
      let scrollTop = groupTable ? groupTable.scrollTop : 0;
      groupTable.scrollTop = 0;
      groupTable.scrollLeft = 0;

      this.datatable.length !== 0
        ? (tableHeader.style = `width: ${widthSum}px; position: absolute; z-index: 100;`)
        : null;
      tableBody.style = `width: ${widthSum}px; margin: 38px 0;`;
      this.datatable.length > 15 || this.datatable.length === 15
        ? (tableFooter.style = `transform:translate(0, ${scrollTop}px); position: absolute; bottom: 0; z-index: 100;`)
        : (tableFooter.style = "position: absolute; bottom: 0; z-index: 100;");
      if (this.datatable.length === 0) {
        tableFooter.style = "display: none;";
        tableBody.style = "display: none;";
        tableHeader.style = "height: 38px;";
        groupTable.style = "overflow: hidden; height: auto;";
      } else {
        groupTable.style.overflow = "auto";
      }

      groupTable.addEventListener("scroll", () => {
        let scrollTop = groupTable.scrollTop;
        let headerStyleParams = `width: ${widthSum}px; transform:translate(0, ${scrollTop}px); position: absolute; z-index: 100;`;
        let footerStyleParams = `width: ${widthSum}px; transform:translate(0, ${scrollTop}px); position: absolute; bottom: 0; z-index: 100;`;
        tableHeader.style = headerStyleParams;
        tableBody.style = `width: ${widthSum}px; margin: 38px 0;`;
        this.datatable.length !== 0
          ? (tableFooter.style = footerStyleParams)
          : null;
      });
    }

    //未分组表格
    if (noGroupTable) {
      let scrollTop = noGroupTable ? noGroupTable.scrollTop : 0;
      let scrollLeft = noGroupTable ? noGroupTable.scrollLeft : 0;
      noGroupTable.scrollTop = 0;
      noGroupTable.scrollLeft = 0;

      if (this.datatable.length >= 15) {
        this.setTableStyle(tableHeader, tableBody, noGroupTable);
        tableFooter.style = `transform:translate(0, ${scrollTop}px); position: absolute; bottom: 0; z-index: 100;`;
      } else if (this.datatable.length == 0) {
        tableHeader.style.position = "static";
        tableFooter.style.display = "none";
        noGroupTable.style = "overflow: hidden;"
      } else {
        this.setTableStyle(tableHeader, tableBody, noGroupTable);
        tableFooter.style = "position: absolute; bottom: 0; z-index: 100;";
      }

      noGroupTable.addEventListener("scroll", () => {
        let scrollTop = noGroupTable.scrollTop;
        let headerStyleParams = `transform:translate(0, ${scrollTop}px); position: absolute; z-index: 100;`;
        let footerStyleParams = `transform:translate(0, ${scrollTop}px); position: absolute; bottom: 0; z-index: 100;`;
        tableHeader.style = headerStyleParams;
        tableBody.style = "margin: 38px 0;";
        this.datatable.length !== 0
          ? (tableFooter.style = footerStyleParams)
          : null;
      });
    }
  }
};
</script>

<style lang="scss">
.datacenter-main {
  .el-table {
    border: none !important;
  }
  // .group-btn {
  //   height: 50px;
  //   background: #f5f5f5;
  //   .group-btn-list div {
  //     margin-top: 9px;
  //     display: flex;
  //     align-items: center;
  //     .group-btn-item {
  //       display: flex;
  //       justify-content: center;
  //       align-items: center;
  //       margin-left: 8px;
  //       width: 80px;
  //       height: 32px;
  //       font-size: 12px;
  //       color: #666666;
  //       background: #ffffff;
  //       border: 1px solid #bcbcbc;
  //       border-radius: 4px;
  //       box-sizing: border-box;
  //       &:hover {
  //         cursor: pointer;
  //       }
  //     }
  //   }
  // }
  .no-data {
    margin-top: 20px;
    text-align: center;
    color: #bcbcbc;
    font-size: 12px;
    font-family: "MicrosoftYaHei";
  }
  .el-table--border::after,
  .el-table--group::after {
    display: none;
  }
  //未分组表格样式
  .no-group-table {
    //滚动条的位置
    .el-table {
      overflow: auto;
    }
    .el-table__header-wrapper,
    .el-table__body-wrapper,
    .el-table__footer-wrapper {
      overflow: visible;
    }
    .el-table::after {
      position: relative;
    }
    max-height: 654px;
    th {
      padding: 0;
    }
    .cell {
      height: 36px;
      line-height: 14px;
      display: flex;
      align-items: center;
      padding-left: 8px;
      padding-right: 8px;
      font-family: "MicrosoftYaHei";
      font-size: 12px;
      color: #333333;
      word-break: break-all;
      .icon {
        display: flex;
        align-items: center;
        padding-left: 0;
        width: 100%;
        span {
          display: inline-block;
          font-family: "MicrosoftYaHei";
        }
        .select-icon {
          i {
            font-size: 20px;
            color: #999999;
            &:hover {
              color: #333333;
              cursor: pointer;
            }
          }
        }
        .sort-icon {
          display: inline-flex;
          flex-direction: column;
          i {
            font-size: 12px;
            color: #999999;
            line-height: 10px;
            &:hover {
              color: #333333;
              cursor: pointer;
            }
          }
        }
      }
    }
    .el-table__header-wrapper {
      // position: absolute;
      // z-index: 100;
      box-sizing: border-box;
    }
    .el-table__body-wrapper {
      // margin: 38px 0;
      .el-table__empty-text {
        display: none;
      }
      margin-bottom: 38px;
      tbody {
        td {
          padding: 0;
        }
      }
    }
    .el-table__footer-wrapper {
      tbody {
        td {
          height: 38px;
          padding: 0;
        }
      }
    }
  }

  //分组表格样式
  .group-table {
    position: relative;
    max-height: 646px;
    overflow: auto;
    .el-table {
      display: grid;
    }
    .el-table__header-wrapper {
      .cell {
        display: flex;
        height: 38px;
        font-family: "MicrosoftYaHei";
        font-size: 12px;
        justify-content: start;
        align-items: center;
        padding: 0 8px;
        .label {
          padding: 0;
          line-height: 38px;
          height: 38px;
          font-family: "MicrosoftYaHei";
          font-size: 12px;
          color: #333333;
        }
        .sort-icon {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          i {
            font-size: 12px;
            color: #999999;
            line-height: 10px;
            &:hover {
              color: #333333;
              cursor: pointer;
            }
          }
        }
      }
    }
    .el-table__body-wrapper {
      margin-bottom: 38px;
      .cell {
        display: flex;
        align-items: center;
        line-height: 14px;
        font-family: "MicrosoftYaHei";
        font-size: 12px;
        word-break: break-all;
        .typestyle {
          margin-right: 4px;
          .new-icon {
            &:hover {
              cursor: pointer;
            }
          }
        }
      }
      .trName1 {
        .trName1-cell {
          margin-left: 8px;
        }
      }
      .trName2 {
        .trName2-cell {
          margin-left: 16px;
        }
      }
    }
    .el-table__footer-wrapper {
      td {
        background: #f2f4fd;
        .cell {
          font-family: "MicrosoftYaHei";
          font-size: 12px;
        }
      }
    }
  }
}
</style>
