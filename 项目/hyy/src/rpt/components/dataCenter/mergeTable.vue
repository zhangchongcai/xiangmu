<template>
  <div class="merge-table-wrapper" v-if="mergeTableObj.isMerged">
    <el-table
      border
      :stripe="false"
      :data="mergeTableObj.mergeTableBodyData"
      :span-method="mergeSpan"
      :show-summary="true"
      :summary-method="handleSummary"
      :style="{width: `${mergeTableObj.totalWidth + 8}px`}"
      class="merge-table"
      v-loading="mergeTableLoading"
    >
      <el-table-column
        v-for="(item, index) in mergeTableObj.mergeTableHeaderData"
        :key="`merge_table_${index}`"
        :property="item.colKey"
        :label="item.colName"
        :width="item.colWidth"
        class="rpt-table"
      ></el-table-column>
    </el-table>
    <div class="merge-table-pagenation" v-if="mergeTableObj.isMerged && Pagination.total != 0">
      <el-pagination
        class="rpt-pagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Pagination.currentPage"
        :page-sizes="Pagination.page_sizes"
        :page-size="Pagination.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="Pagination.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import datacenterBus from "src/rpt/util/datacenterBus.js";
export default {
  props: {
    reportCode: String,
    tableName: String,
    styleGroupArr: Array,
    baseQueryArr: Array,
    styleExtQueryArr: Array,
    styleColArr: Array,
    tableLoading: Boolean,
    Pagination: Object,
    mergeTableObj: Object,
    mergeTableLoading: Boolean
  },
  data() {
    return {};
  },
  computed: mapState({
    isGotData: state => state.rpt.isGotData
  }),
  watch: {
    isGotData(newVal, oldVal) {
      if (newVal) {
        this.handleTableData();
        this.$store.commit("getMergeTableData", false);
      }
    }
  },
  mounted() {
    datacenterBus.$on("setMergeTable", data => {
      if (data) {
        this.handleTableData();
      }
    });
    let mergeTable = this.getDom("merge-table")[0];
    if (mergeTable) {
      let tableHeader = mergeTable.children[1];
      let tableBody = mergeTable.children[2];
      let tableFooter = mergeTable.children[3];
      this.setStyle(mergeTable, tableHeader, tableBody, tableFooter);
    }
  },
  destroyed() {
    datacenterBus.$off("setMergeTable");
  },
  methods: {
    //获取汇总行
    handleSummary() {
      let sumArr = [];
      for (let i = 0; i < this.mergeTableObj.mergeTableHeaderData.length; i++) {
        let colKey = this.mergeTableObj.mergeTableHeaderData[i].colKey;
        if (i == 0) {
          sumArr.push("合计");
        } else if (0 < i && i < this.mergeTableObj.groupCount) {
          sumArr.push('');
        } else {
          if (typeof this.mergeTableObj.summary[colKey] == "number") {
            sumArr.push(this.mergeTableObj.summary[colKey]);
          } else {
            sumArr.push(this.mergeTableObj.summary[colKey]);
          }
        }
      }
      return sumArr;
    },
    handleTableData() {
      this.mergeTableObj.groupCount = this.styleGroupArr.length;
      try {
        this.getData();
      } catch (error) {
        console.log(error);
      }
    },
    handleMergeData(resTitle, resList) {
      this.mergeTableObj.oneSpanArr = [];
      this.mergeTableObj.onePosition = 0;

      this.mergeTableObj.twoSpanArr = [];
      this.mergeTableObj.twoPosition = 0;

      this.mergeTableObj.threeSpanArr = [];
      this.mergeTableObj.threePosition = 0;

      this.mergeTableObj.fourSpanArr = [];
      this.mergeTableObj.fourPosition = 0;

      this.mergeTableObj.fiveSpanArr = [];
      this.mergeTableObj.fivePosition = 0;

      this.mergeTableObj.sixSpanArr = [];
      this.mergeTableObj.sixPosition = 0;

      this.mergeTableObj.sevenSpanArr = [];
      this.mergeTableObj.sevenPosition = 0;
      for (var i = 0; i < resList.length; i++) {
        if (i === 0) {
          this.mergeTableObj.oneSpanArr.push(1);
          this.mergeTableObj.onePosition = 0;

          this.mergeTableObj.twoSpanArr.push(1);
          this.mergeTableObj.twoPosition = 0;

          this.mergeTableObj.threeSpanArr.push(1);
          this.mergeTableObj.threePosition = 0;

          this.mergeTableObj.fourSpanArr.push(1);
          this.mergeTableObj.fourPosition = 0;

          this.mergeTableObj.fiveSpanArr.push(1);
          this.mergeTableObj.fivePosition = 0;

          this.mergeTableObj.sixSpanArr.push(1);
          this.mergeTableObj.sixPosition = 0;

          this.mergeTableObj.sevenSpanArr.push(1);
          this.mergeTableObj.sevenPosition = 0;
        } else {
          if (
            resTitle.length >= 1 && resList[i][`${resTitle[0].colKey}`] ===
            resList[i - 1][`${resTitle[0].colKey}`]
          ) {
            this.mergeTableObj.oneSpanArr[
              this.mergeTableObj.onePosition
            ] += 1;
            this.mergeTableObj.oneSpanArr.push(0);
          } else {
            this.mergeTableObj.oneSpanArr.push(1);
            this.mergeTableObj.onePosition = i;
          }

          if (
            resTitle.length >= 2 && resList[i][`${resTitle[1].colKey}`] ===
            resList[i - 1][`${resTitle[1].colKey}`]
          ) {
            this.mergeTableObj.twoSpanArr[
              this.mergeTableObj.twoPosition
            ] += 1;
            this.mergeTableObj.twoSpanArr.push(0);
          } else {
            this.mergeTableObj.twoSpanArr.push(1);
            this.mergeTableObj.twoPosition = i;
          }

          if (
            resTitle.length >= 3 && resList[i][`${resTitle[2].colKey}`] ===
            resList[i - 1][`${resTitle[2].colKey}`]
          ) {
            this.mergeTableObj.threeSpanArr[
              this.mergeTableObj.threePosition
            ] += 1;
            this.mergeTableObj.threeSpanArr.push(0);
          } else {
            this.mergeTableObj.threeSpanArr.push(1);
            this.mergeTableObj.threePosition = i;
          }

          if (
            resTitle.length >= 4 && resList[i][`${resTitle[3].colKey}`] ===
            resList[i - 1][`${resTitle[3].colKey}`]
          ) {
            this.mergeTableObj.fourSpanArr[
              this.mergeTableObj.fourPosition
            ] += 1;
            this.mergeTableObj.fourSpanArr.push(0);
          } else {
            this.mergeTableObj.fourSpanArr.push(1);
            this.mergeTableObj.fourPosition = i;
          }

          if (
            resTitle.length >= 5 && resList[i][`${resTitle[4].colKey}`] ===
            resList[i - 1][`${resTitle[4].colKey}`]
          ) {
            this.mergeTableObj.fiveSpanArr[
              this.mergeTableObj.fivePosition
            ] += 1;
            this.mergeTableObj.fiveSpanArr.push(0);
          } else {
            this.mergeTableObj.fiveSpanArr.push(1);
            this.mergeTableObj.fivePosition = i;
          }

          if (
            resTitle.length >= 6 && resList[i][`${resTitle[5].colKey}`] ===
            resList[i - 1][`${resTitle[5].colKey}`]
          ) {
            this.mergeTableObj.sixSpanArr[
              this.mergeTableObj.sixPosition
            ] += 1;
            this.mergeTableObj.sixSpanArr.push(0);
          } else {
            this.mergeTableObj.sixSpanArr.push(1);
            this.mergeTableObj.sixPosition = i;
          }

          if (
            resTitle.length >= 7 && resList[i][`${resTitle[6].colKey}`] ===
            resList[i - 1][`${resTitle[6].colKey}`]
          ) {
            this.mergeTableObj.sevenSpanArr[
              this.mergeTableObj.sevenPosition
            ] += 1;
            this.mergeTableObj.sevenSpanArr.push(0);
          } else {
            this.mergeTableObj.sevenSpanArr.push(1);
            this.mergeTableObj.sevenPosition = i;
          }
        }
      }
      if (this.mergeTableObj.groupCount == 2) this.handleColspanData(this.mergeTableObj.oneSpanArr, this.mergeTableObj.twoSpanArr);
      if (this.mergeTableObj.groupCount == 3) {
        this.handleColspanData(this.mergeTableObj.oneSpanArr, this.mergeTableObj.twoSpanArr);
        this.handleColspanData(this.mergeTableObj.twoSpanArr, this.mergeTableObj.threeSpanArr);
      }
      if (this.mergeTableObj.groupCount == 4) {
        this.handleColspanData(this.mergeTableObj.oneSpanArr, this.mergeTableObj.twoSpanArr);
        this.handleColspanData(this.mergeTableObj.twoSpanArr, this.mergeTableObj.threeSpanArr);
        this.handleColspanData(this.mergeTableObj.threeSpanArr, this.mergeTableObj.fourSpanArr);
      }
      if (this.mergeTableObj.groupCount == 5) {
        this.handleColspanData(this.mergeTableObj.oneSpanArr, this.mergeTableObj.twoSpanArr);
        this.handleColspanData(this.mergeTableObj.twoSpanArr, this.mergeTableObj.threeSpanArr);
        this.handleColspanData(this.mergeTableObj.threeSpanArr, this.mergeTableObj.fourSpanArr);
        this.handleColspanData(this.mergeTableObj.fourSpanArr, this.mergeTableObj.fiveSpanArr);
      }
      if (this.mergeTableObj.groupCount == 6) {
        this.handleColspanData(this.mergeTableObj.oneSpanArr, this.mergeTableObj.twoSpanArr);
        this.handleColspanData(this.mergeTableObj.twoSpanArr, this.mergeTableObj.threeSpanArr);
        this.handleColspanData(this.mergeTableObj.threeSpanArr, this.mergeTableObj.fourSpanArr);
        this.handleColspanData(this.mergeTableObj.fourSpanArr, this.mergeTableObj.fiveSpanArr);
        this.handleColspanData(this.mergeTableObj.fiveSpanArr, this.mergeTableObj.sixSpanArr);
      }
      if (this.mergeTableObj.groupCount == 7) {
        this.handleColspanData(this.mergeTableObj.oneSpanArr, this.mergeTableObj.twoSpanArr);
        this.handleColspanData(this.mergeTableObj.twoSpanArr, this.mergeTableObj.threeSpanArr);
        this.handleColspanData(this.mergeTableObj.threeSpanArr, this.mergeTableObj.fourSpanArr);
        this.handleColspanData(this.mergeTableObj.fourSpanArr, this.mergeTableObj.fiveSpanArr);
        this.handleColspanData(this.mergeTableObj.fiveSpanArr, this.mergeTableObj.sixSpanArr);
        this.handleColspanData(this.mergeTableObj.sixSpanArr, this.mergeTableObj.sevenSpanArr);
      }
    },
    handleColspanData(array1, array2) {
      for (let i = 0; i < array1.length; i++) {
        if (array1[i] > 1) {
          let total = 0;
          total = array2.slice(i, i + array1[i]).reduce((total, item) => total + item);
          if (total > array1[i]) {
            if (array2[i + array1[i] - 1] > 1) {
              array2[i + array1[i]] = array2[i + array1[i] - 1] - 1;
              array2[i + array1[i] - 1] = 1;
            }
            if (array2[i + array1[i] - 1] == 0) {
              let index = i + array1[i] - 1;
              if (array2[index] < 1) {
                for (let j = index; j >= 0; j--) {
                  if (array2[j] > 1) {
                    array2[index+1] = array2[j] - (index - j + 1);
                    array2[j] = index - j + 1;
                    break;
                  }
                }
              }
              if (array2[index] > 1) {
                for (let j = index; j > 0; j--) {
                  if (array2[j] > 1) {
                    array2[i + array1[i]] = array2[j] - (index - j + 1);
                    array2[j] = index - j + 1;
                    break;
                  }
                }
              }
            }
          }
          if (total < array1[i]) {
            if (array2[i] < 1) {
              let index = i;
              let initIndex;
              let count = 0;
              for (let j = index; j >= 0; j--) {
                if (array2[j] > 1) {
                  initIndex = j;
                  count++;
                  break;
                }
              }
              let lastIndex = i + array1[i] - 1;
              for (let j = lastIndex; j >= initIndex; j--) {
                array2[j] = array1[j];
              }
              array2[lastIndex+1] = array2[initIndex] - count;
            }
          }
        }
        if (array1[i] == 1) {
          if (array2[i] > 1) {
            array2[i+1] = array2[i] - 1;
            array2[i] = 1;
          }
        }
      }
    },
    async getData() {
      this.$emit("setMergeTableLoading", true);
      const params = {
        summaryFlag: 1,
        groupFlag: 1,
        firstQueryFlag: 1,
        reportTableInfo: {
          reportCode: this.reportCode,
          queryArr: [...this.baseQueryArr, ...this.styleExtQueryArr],
          tableName: this.tableName,
          colArr: this.styleColArr,
          groupArr: this.styleGroupArr
        },
        pagingInfo: {
          startIndex: this.Pagination.currentPage,
          rows: this.Pagination.pagesize
        }
      };
      let res = await this.$rptList.showGroupMergeData(params);
      let resList = JSON.parse(res.data).list;
      let resTitle = JSON.parse(res.data).title;
      let totalNum = JSON.parse(res.data).totalNum;
      this.mergeTableObj.summary = JSON.parse(res.data).summary;
      let total = 0;
      resTitle.forEach(element => {
        total += element.colWidth;
      });
      this.mergeTableObj.totalWidth = total;
      this.handleMergeData(resTitle, resList);
      this.mergeTableObj.mergeTableHeaderData = resTitle;
      this.mergeTableObj.mergeTableBodyData = resList;
      this.Pagination.total = totalNum;
      this.$emit("setMergeTableLoading", false);
    },
    mergeSpan({ row, column, rowIndex, columnIndex }) {
      if (this.mergeTableObj.groupCount === 1) {
        if (columnIndex === 0) {
          return this.handleTableCell(
            this.mergeTableObj.oneSpanArr[rowIndex]
          );
        }
      }

      if (this.mergeTableObj.groupCount === 2) {
        if (columnIndex === 0) {
          return this.handleTableCell(
            this.mergeTableObj.oneSpanArr[rowIndex]
          );
        } else if (columnIndex === 1) {
          return this.handleTableCell(
            this.mergeTableObj.twoSpanArr[rowIndex]
          );
        }
      }

      if (this.mergeTableObj.groupCount === 3) {
        if (columnIndex === 0) {
          return this.handleTableCell(
            this.mergeTableObj.oneSpanArr[rowIndex]
          );
        } else if (columnIndex === 1) {
          return this.handleTableCell(
            this.mergeTableObj.twoSpanArr[rowIndex]
          );
        } else if (columnIndex === 2) {
          return this.handleTableCell(
            this.mergeTableObj.threeSpanArr[rowIndex]
          );
        }
      }

      if (this.mergeTableObj.groupCount === 4) {
        if (columnIndex === 0) {
          return this.handleTableCell(
            this.mergeTableObj.oneSpanArr[rowIndex]
          );
        } else if (columnIndex === 1) {
          return this.handleTableCell(
            this.mergeTableObj.twoSpanArr[rowIndex]
          );
        } else if (columnIndex === 2) {
          return this.handleTableCell(
            this.mergeTableObj.threeSpanArr[rowIndex]
          );
        } else if (columnIndex === 3) {
          return this.handleTableCell(
            this.mergeTableObj.fourSpanArr[rowIndex]
          );
        }
      }
      if (this.mergeTableObj.groupCount === 5) {
        if (columnIndex === 0) {
          return this.handleTableCell(
            this.mergeTableObj.oneSpanArr[rowIndex]
          );
        } else if (columnIndex === 1) {
          return this.handleTableCell(
            this.mergeTableObj.twoSpanArr[rowIndex]
          );
        } else if (columnIndex === 2) {
          return this.handleTableCell(
            this.mergeTableObj.threeSpanArr[rowIndex]
          );
        } else if (columnIndex === 3) {
          return this.handleTableCell(
            this.mergeTableObj.fourSpanArr[rowIndex]
          );
        } else if (columnIndex === 4) {
          return this.handleTableCell(
            this.mergeTableObj.fiveSpanArr[rowIndex]
          );
        }
      }
      if (this.mergeTableObj.groupCount === 6) {
        if (columnIndex === 0) {
          return this.handleTableCell(
            this.mergeTableObj.oneSpanArr[rowIndex]
          );
        } else if (columnIndex === 1) {
          return this.handleTableCell(
            this.mergeTableObj.twoSpanArr[rowIndex]
          );
        } else if (columnIndex === 2) {
          return this.handleTableCell(
            this.mergeTableObj.threeSpanArr[rowIndex]
          );
        } else if (columnIndex === 3) {
          return this.handleTableCell(
            this.mergeTableObj.fourSpanArr[rowIndex]
          );
        } else if (columnIndex === 4) {
          return this.handleTableCell(
            this.mergeTableObj.fiveSpanArr[rowIndex]
          );
        } else if (columnIndex === 5) {
          return this.handleTableCell(
            this.mergeTableObj.sixSpanArr[rowIndex]
          );
        }
      }
      if (this.mergeTableObj.groupCount === 7) {
        if (columnIndex === 0) {
          return this.handleTableCell(
            this.mergeTableObj.oneSpanArr[rowIndex]
          );
        } else if (columnIndex === 1) {
          return this.handleTableCell(
            this.mergeTableObj.twoSpanArr[rowIndex]
          );
        } else if (columnIndex === 2) {
          return this.handleTableCell(
            this.mergeTableObj.threeSpanArr[rowIndex]
          );
        } else if (columnIndex === 3) {
          return this.handleTableCell(
            this.mergeTableObj.fourSpanArr[rowIndex]
          );
        } else if (columnIndex === 4) {
          return this.handleTableCell(
            this.mergeTableObj.fiveSpanArr[rowIndex]
          );
        } else if (columnIndex === 5) {
          return this.handleTableCell(
            this.mergeTableObj.sixSpanArr[rowIndex]
          );
        } else if (columnIndex === 6) {
          return this.handleTableCell(
            this.mergeTableObj.sevenSpanArr[rowIndex]
          );
        }
      }
    },
    handleTableCell(spanArrItem) {
      const _row = spanArrItem;
      const _col = _row > 0 ? 1 : 0;
      return {
        rowspan: _row,
        colspan: _col
      };
    },
    handleSizeChange(size) {
      this.Pagination.pagesize = size;
      this.handleTableData();
    },
    handleCurrentChange(currentPage) {
      this.Pagination.currentPage = currentPage;
      this.handleTableData();
    },
    getDom(className) {
      return document.getElementsByClassName(className);
    },
    setTableStyle(tableHeader, tableBody, table) {
      tableHeader.style = "position: absolute; z-index: 100;";
      tableBody.style = "display: block; margin: 38px 0; ";
      table.style = `overflow: auto; width: ${this.mergeTableObj.totalWidth +
        8}px;`;
    },
    setStyle(mergeTable, tableHeader, tableBody, tableFooter) {
      if (mergeTable) {
        let scrollTop = mergeTable ? mergeTable.scrollTop : 0;
        let scrollLeft = mergeTable ? mergeTable.scrollLeft : 0;
        mergeTable.scrollTop = 0;
        mergeTable.scrollLeft = 0;
        if (this.mergeTableObj.mergeTableBodyData.length >= 15) {
          this.setTableStyle(tableHeader, tableBody, mergeTable);
          tableFooter.style = `transform:translate(0, ${scrollTop}px); position: absolute; bottom: 0; z-index: 100;`;
        } else if (this.mergeTableObj.mergeTableBodyData.length == 0) {
          tableHeader.style.position = "static";
          tableFooter.style.display = "none";
          mergeTable.style = this.mergeTableObj.totalWidth.indexOf('%') > -1 ? `overflow: hidden; width: ${this.mergeTableObj
            .totalWidth};` : `overflow: hidden; width: ${this.mergeTableObj.totalWidth + 8}px;`;
        } else {
          this.setTableStyle(tableHeader, tableBody, mergeTable);
          tableFooter.style = "position: absolute; bottom: 0; z-index: 100;";
        }

        mergeTable.addEventListener("scroll", () => {
          let scrollTop = mergeTable.scrollTop;
          let headerStyleParams = `transform:translate(0, ${scrollTop}px); position: absolute; z-index: 100;`;
          let footerStyleParams = `transform:translate(0, ${scrollTop}px); position: absolute; bottom: 0; z-index: 100;`;
          tableHeader.style = headerStyleParams;
          tableBody.style = "margin: 38px 0;";
          this.mergeTableObj.mergeTableBodyData.length !== 0
            ? (tableFooter.style = footerStyleParams)
            : null;
        });
      }
    }
  },
  updated() {
    let mergeTable = this.getDom("merge-table")[0];
    if (mergeTable) {
      let tableHeader = mergeTable.children[1];
      let tableBody = mergeTable.children[2];
      let tableFooter = mergeTable.children[3];
      this.setStyle(mergeTable, tableHeader, tableBody, tableFooter);
    }
  }
};
</script>

<style lang="scss">
.merge-table-wrapper {
  .el-table {
    max-height: 654px;
    overflow: auto;
    .el-table__header-wrapper,
    .el-table__body-wrapper,
    .el-table__footer-wrapper {
      overflow: visible;
    }
    &::after {
      position: relative;
    }
    td {
      border-bottom: 1px solid #ebeef5;
      background: white;
    }
  }
  .merge-table-pagenation {
    margin: 10px 0;
    display: flex;
    justify-content: center;
  }
}
</style>
