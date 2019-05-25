<template>
  <div class="my_dialog">
    <el-dialog :title="title" :visible.sync="mydialogTableVisible">
      <el-form label-width="60px" :inline="true">
        <div v-if="isTwo">
          <el-form-item label="用户姓名" class="two_search">
            <el-input v-model="userName" style="width:152px"></el-input>
          </el-form-item>
          <el-form-item label="用户账号" class="two_search">
            <el-input v-model="userUid" style="width:152px"></el-input>
          </el-form-item>
          <el-button type="primary" style="margin-top:4px">查询</el-button>
        </div>
        <div v-if="isOne">
          <el-form-item label="用户姓名" class="one_search">
            <el-input v-model="userName" style="width:184px;"></el-input>
          </el-form-item>
          <el-button type="primary">查询</el-button>
        </div>
      </el-form>

      <el-table :data="gridData" :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0}
        highlight-current-row @current-change="tableCurrentChange">

        <!-- <el-table-column property="date" label="用户姓名" width="240"></el-table-column>
        <el-table-column property="name" label="用户账号" width="240"></el-table-column> -->
        <!-- <div v-if="isTwo"> -->
        <el-table-column width="56">
          <template slot-scope="scope">
            <el-radio v-model="templateRadio" :label="scope.$index">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column v-if="isTwo" property="userName" label="用户姓名" width="240"></el-table-column>
        <el-table-column v-if="isTwo" property="userAccount" label="用户账号" width="240"></el-table-column>
        <!-- </div> -->
        <el-table-column v-if="isOne" property="userName" label="用户姓名" width="480"></el-table-column>
        <el-table-column v-if="isVip" property="vipLevelName" label="会员等级" width="480"></el-table-column>
        <el-table-column v-if="isOther" property="name" label="物品名称" width="480"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination @current-change="handleCurrentChange" background :current-page.sync="pageData.currentPage"
          :page-size="pageData.size" layout="prev, pager, next, jumper, total" :total="pageData.total">
        </el-pagination>
      </div>
      <div style="height:24px;background:transparent;"></div>
      <div class="btn-area">
        <el-button type="primary" @click="chooseUser">确定</el-button>
        <el-button @click="mydialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
  export default {
    props: {
      dialogTableVisible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: "父组件尚未传值"
      },
      isTwo: {
        type: Boolean,
        default: false
      },
      isOne: {
        type: Boolean,
        default: false
      },
      isVip: {
        type: Boolean,
        default: false
      },
      isOther: {
        type: Boolean,
        default: false
      },
      gridData: {
        type: Array,
        default: function () {
          return []
        }
      },
      target: {
        type: String,
        default: ""
      },
      pageData: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        userName: "",
        userUid: "",
        workerUid: "",
        templateRadio: '',
        mydialogTableVisible: this.dialogTableVisible,
        currentPage: 1
      }
    },
    methods: {
      tableCurrentChange(row) {
        if (row && row instanceof Object) {
          console.log(row)
          this.userName = row.userName || row.vipLevelName || row.name;
          this.userUid = this.isTwo && row.userAccount;
          this.workerUid = this.isTwo && row.userUid;
          console.log(this.workerUid)
          // vip和其它物品领用
          this.thingCode = this.isVip && row.vipLevelCode || this.isOther && row.code;
          this.templateRadio = this.gridData.indexOf(row);
        }
      },
      // 确定选择
      chooseUser() {
        // vip和其它物品领用
        if (this.isVip || this.isOther) {
          this.$emit("chooseuUserName", this.userName, this.thingCode);
        } else if (this.isTwo) {
          this.$emit("chooseuUserName", this.userName, this.userUid, this.workerUid);
        } else {
          this.$emit("chooseuUserName", this.userName);
        }
        this.mydialogTableVisible = false;
      },
      handleCurrentChange(val) {
        this.currentPage = val
      }
    },
    watch: {
      dialogTableVisible(val) {
        this.mydialogTableVisible = val;
        this.templateRadio = ''
        this.userName = ''
        this.userUid = ''
      },
     
      mydialogTableVisible(val) {
        this.$emit("changeDialogTableVisible", val)
      },
      currentPage(val) {
        this.$emit("changeCurrentPage", val)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-form-item__label,
  .el-form-item__content {
    font-size: 12px;
    line-height: 32px;
  }

  .my_dialog {
    /deep/ .el-dialog {
      width: 576px;
      height: 576px;
      .el-form-item__label{
        font-size: 12px;
      }
      .el-dialog__header::after {
        content: "";
        display: block;
        width: 536px;
        height: 1px;
        background: #e5e5e5;
      }

      .el-dialog__body {
        padding: 0 20px;


        .two_search {
          width: 214px;
          font-size: 12px;
        }

        .one_search {
          width: 268px;
        }



        .el-table {
          margin-top: 11px;
          height: 340px;

          .has-gutter tr th {
            padding: 0;
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

        .block {
          margin-top: 15px;

          .el-pagination {
            text-align: center;
          }
        }
      }

      .btn-area {
        display: flex;
        justify-content: center;
      }

      /deep/ .content .el-input {
        width: 50px;
      }
    }
  }
</style>