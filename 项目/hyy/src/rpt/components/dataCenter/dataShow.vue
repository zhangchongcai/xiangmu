<template>
  <div class="datacenter-pagination">
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
      v-if="Pagination.total > 0"
    ></el-pagination>
  </div>
</template>
<script>
import datacenterBus from "src/rpt/util/datacenterBus.js";
export default {
  props: {
    datatable: Array,
    styleColArr: Array,
    Pagination: Object,
    tableName: String,
    colArr: Array,
    reportCode: String,
    sortArray: Array,
    // 基础查询
    baseQueryArr: Array,
    // 扩展查询
    styleExtQueryArr: Array,
    //基础查询和表格筛选查询的拼接数据
    searchData: {
      type: Array,
      default: []
    },
    orderCol: String,
    tableStyleColArr: Array
  },
  data() {
    return {};
  },
  methods: {
    //请求页面参数
    askForPage(value) {
      datacenterBus.$emit("tableLoading");
      let styleColList = [];
      let colDataArr = [];
      colDataArr.length == 0
        ? this.$emit("sendStyleColArr", this.tableStyleColArr)
        : styleColList;
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
      if (this.styleExtQueryArr != null) {
        queryArr = queryArr.concat(this.styleExtQueryArr);
      }
      let orderArr;

      if (this.sortArray.length === 0) {
        orderArr = [
          {
            colKey: this.orderCol === "" ? null : this.orderCol,
            orderDesc: "DESC"
          }
        ];
      } else {
        orderArr = this.sortArray;
      }

      //声明参数
      let param = {
        reportTableInfo: {
          reportCode: this.reportCode,
          tableName: this.tableName,
          colArr: colDataArr.length == 0 ? this.tableStyleColArr : colDataArr,
          orderArr: orderArr,
          queryArr: queryArr
        },
        pagingInfo: {
          startIndex: this.Pagination.currentPage,
          rows: this.Pagination.pagesize
        }
      };
      //调用api，展示表格内容
      this.$rptList
        .showReportData(param)
        .then(data => {
          const tableData = JSON.parse(data.data);
          datacenterBus.$emit("pagesDataArrEvent", tableData);
        })
        .catch(msg => {
          console.log(msg);
        });
    },
    //改变显示行数
    handleSizeChange: function(size) {
      this.Pagination.pagesize = size;
      this.askForPage();
    },
    //翻页
    handleCurrentChange: function(currentPage) {
      this.Pagination.currentPage = currentPage;
      this.askForPage();
    }
  }
};
</script>
<style lang="scss">
.datacenter-pagination {
  display: flex;
  justify-content: center;
  .el-table th,
  .el-table td {
    padding: 7px 0;
  }
  .el-table th {
    background: #f2f4fd;
    padding: 1px 0;
  }

  .el-pagination .el-select .el-input .el-input__inner {
    padding-right: 25px;
    border-radius: 3px;
    height: 28px;
  }

  .el-pagination span:not([class*="suffix"]),
  .el-pagination button {
    margin-top: 10px;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    vertical-align: top;
    box-sizing: border-box;
  }

  .el-pagination.is-background .btn-prev:disabled,
  .el-pagination.is-background .btn-next:disabled {
    color: #666666;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #3b74ff;
    color: #fff;
    border: none;
  }

  .el-pagination .el-pagination__total,
  .el-pagination .el-pagination__jump {
    font-family: "MicrosoftYaHei";
  }

  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .el-pager li {
    margin: 10px 5px;
    background-color: white;
    color: #666666;
    min-width: 30px;
    border-radius: 5px;
    border: 1px solid #bcbcbc;
  }

  .el-pagination__sizes {
    margin-left: 24px;
  }
}
</style>