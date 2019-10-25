<template>
  <div class="my_dialog">
    <el-dialog title="查看销售地点" :visible.sync="dialogTableVisible">
      <el-form :inline="true">
        <div>
          <el-form-item label="门店名称：" class="two_search">
            <span class="show-text">
              {{showData.cinemaUid}}
            </span>
          </el-form-item>
          <el-form-item label="状态：" class="two_search">
            <span class="show-text">
              {{showData.status==1?"启用":"停用"}}
            </span>
          </el-form-item>
          <el-form-item label="销售地点名称：" class="two_search">
            <span class="show-text">
              {{showData.placeName}}
            </span>
          </el-form-item>
          <el-form-item label="销售地点编码：" class="two_search">
            <span class="show-text">
              {{showData.code}}
            </span>
          </el-form-item>
        </div>
      </el-form>
      <p class="div_title"><i class="el-icon-arrow-down">查看销售地点：</i></p>
      <!-- 领用明细 -->
      <el-table :data="gridData" border :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0} highlight-current-row>
        <el-table-column v-for="item in terminaltableColumn" :key="item.key" :prop="item.key" :label="item.label" :formatter="item.formatter"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block" v-if="parentDialog=='isDetail' ||parentDialog =='isAlipay'">
        <el-pagination @current-change="handleCurrentChange" background :current-page.sync="pageData.current" :page-size="pageData.size" layout="prev, pager, next, jumper, total" :total="pageData.total">
        </el-pagination>
      </div>
      <div style="height:24px;background:transparent;"></div>
      <div class="btn-area">
        <!-- <el-button type="primary" @click="chooseUser">确定</el-button> -->
        <el-button type="primary" @click="dialogTableVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "父组件尚未传值"
    },
    parentDialog: {
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
  data () {
    return {
      dialogTableVisible: false,
      currentPage: 1,
      gridData: [],  // 表格数据
      terminaltableColumn: [{
        label: "终端名称",
        // key: "machineName"
        key: "tername"
      },
      {
        label: "IP",
        key: "ip"
      },
      {
        label: "终端编号",
        key: "code"
      },
      {
        label: "终端类型",
        key: "type"
      },
      {
        label: "状态",
        key: "status",
        formatter (row, column, cellValue) {
          let result = "";
          switch (row.status) {
            case 0:
              result = "停用";
              break;
            case 1:
              result = "启用";
              break;
          }
          return result;
        }
      }
      ],
      showData: {}
    }
  },
  methods: {
    // 确定选择
    chooseUser () {
      this.mydialogTableVisible = false;
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },

    // 搜索项
    searchInfo () {
      this.$emit("searchInfo", this.search)
    }
  },
  watch: {
    dialogTableVisible (val) {
      this.mydialogTableVisible = val;
    },
    mydialogTableVisible (val) {
      this.search = {};
      this.$emit("changeDialogTableVisible", val)
    },
    currentPage (val) {
      this.$emit("changeCurrentPage", val)
    }
  },
  created () {
    console.log(this.pageData)
  }
}
</script>

<style lang="scss" scoped>
.two_search {
  width: 214px;
  font-size: 12px;
}
.div_title {
  // padding: 1em;
  // overflow: hidden;
  line-height: 32px;
  .title_btn {
    padding: 8px 12px;
    float: right;
    margin-right: 12px;
    height: 32px;
    color: #333;
    span {
      font-size: 12px;
      font-weight: 600;
    }
  }

  &::after {
    content: "";
    display: block;
    clear: both;
  }

  &::before {
    content: "";
    display: inline-block;
    width: 2px;
    height: 10px;
    background-color: rgb(25, 40, 80);
    margin-right: 10px;
  }

  // border-left: 2px rgb(25, 40, 80) solid;
  .el-icon-arrow-down:before {
    margin-right: 5px;
  }
}
.my_dialog {
  /deep/ .el-dialog {
    width: 576px;
    height: 576px;

    .el-dialog__header::after {
      content: "";
      display: block;
      width: 536px;
      height: 1px;
      background: #e5e5e5;
    }

    /deep/ .el-form-item {
      margin: 0;
    }

    .el-table th,
    .el-table td {
      padding: 0;
    }

    .el-dialog__body {
      padding: 0 20px;

      .el-form-item__label,
      .el-form-item__content {
        font-size: 12px;
        line-height: 24px;
        padding-right: 0px;
        letter-spacing: 0;
      }

      .el-form-item__label {
        width: 90px;
      }

      .el-table {
        margin-top: 11px;
        max-height: 300px;

        // height: 300px;
        .has-gutter tr th {
          padding: 0;
        }

        .cell {
          font-size: 12px;
          line-height: 30px;
          // float: left;
          // text-align: center;
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
      position: absolute;
      bottom: 20px;
      left: 228px;
    }

    /deep/ .content .el-input {
      width: 50px;
    }
  }
}
</style>