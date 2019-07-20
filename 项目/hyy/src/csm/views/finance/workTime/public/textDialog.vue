<template>
  <div class="my_dialog">
    <el-dialog :title="title" :visible.sync="dialogTableVisible">
      <el-form label-width="60px" :inline="true">
        <div>
          <el-form-item label="单号" class="two_search">
            {{billCode}}
          </el-form-item>
        </div> 
      </el-form>
      <div class="border_div">
        <el-table :data="gridData" :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0}
          highlight-current-row @current-change="tableCurrentChange" border>
          <el-table-column property="subjectName" label="资金项目"></el-table-column>
          <el-table-column property="payTypeCode" label="支付方式"></el-table-column>
          <el-table-column property="changeValue" label="调整值"></el-table-column>
          <el-table-column property="remarks" label="摘要说明"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <!-- <div class="block">
          <el-pagination @current-change="handleCurrentChange" background :current-page.sync="pageData.current"
            :page-size="pageData.pageSize" layout="total,prev, pager, next, jumper" :total="pageData.total"
            v-if="showWhich !=='terminal'">
          </el-pagination>
        </div> -->
      </div>
      <div class="btn-area">
        <el-button type="primary" @click="chooseUser">打印</el-button>
         <el-button type="primary" @click="dialogTableVisible = false">导出Excel</el-button>
        <el-button @click="dialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
  export default {
    data() {
      return {
        dialogTableVisible: false,
        title: "",
        showWhich: "",
        pageData: {}, // 分页信息
        gridData: [], // 表格数据
        userName: "",
        userUid: "",
        workerUid: "",
        current: "", // 页码
        templateRadio: "",
        selectObj: {},
        billCode:"" // 单号
      }
    },
    methods: {
      tableCurrentChange(row) {
        if (row && row instanceof Object) {
          this.selectObj = row;
          this.templateRadio = this.gridData.indexOf(row);
        }
      },
       //储存状态
      getRowKeys(row) {
        return row.id;
      },
      select(selection, row) {
        console.log(selection, row)
        if (selection && selection instanceof Array) {
          this.selectObj = selection;
        }
      },
      // 确定选择
      chooseUser() {
        this.$emit("callback", this.selectObj);
        //  this.templateRadio = this.gridData.indexOf(this.selectObj);
        this.dialogTableVisible = false;
      },
      // 搜索
      searchWorker() {
        if(this.showWhich =='terminal'){
           this.$emit("searchWorker", this.userName, this.userUid)
        }else{
          this.$emit("searchWorker", 1, this.userName, this.userUid)
        }
      },
      handleCurrentChange(val) {
        console.log(val)
        this.current = val
        this.$emit("searchWorker", this.current, this.userName, this.userUid)
      }
    },
    mounted() {
      
    }
  }
</script>

<style lang="scss" scoped>
  .my_dialog {
    // .el-button{
    //   width: 80px;
    // }
    /deep/ .el-dialog {
      width: 576px;
      height: 576px;

      .el-form-item__label,
      .el-form-item__content {
        font-size: 12px;
        line-height: 32px;
      }

      .el-form-item {
        margin: 0;
      }

      .el-dialog__headerbtn .el-dialog__close {
        color: #979797;
        font-size: 16px;
      }

      .el-dialog__header {
        padding: 16px 20px 12px;

        &::after {
          display: block;
          content: "";
          width: 536px;
          height: 1px;
          margin-top: 5px;
          background-color: #E5E5E5;
        }

        .el-dialog__close {
          font-size: 18px;
        }
      }

      .border_div {
        border: 1px solid #e5e5e5;
        margin-top: 11px;
        box-sizing: border-box;

        // flex-direction: column;
        .el-table {
          margin: 0;
          border: none;
          height: 410px;
          // overflow-y: scroll;
          width: 100%;

          .has-gutter tr th {
            padding: 0;
            height: 30px;
            line-height: 30px;
          }

          .cell {
            font-size: 12px;
            line-height: 30px;
          }

          .el-radio__label {
            padding: 0;
            display: none;
          }
        }
      }

      .el-dialog__body {
        padding: 0 20px;

        tr th,
        tr td {
          height: 30px;
          line-height: 30px;
        }

        .two_search {
          width: 214px;
          font-size: 12px;
        }

        .one_search {
          width: 268px;
        }

        .block {
          margin: 15px 0 12px;

          .el-pagination {
            text-align: center;
          }
        }
      }

      .btn-area {
        margin: 12px 0;
        display: flex;
        justify-content: center;
      }

      /deep/ .content .el-input {
        width: 50px;
      }
    }
  }
</style>