<template>
  <div class="my_dialog">
    <el-dialog :title="title" :visible.sync="mydialogTableVisible">
      <el-form :inline="true">
        <!-- 现金收入 -->
        <div v-if="parentDialog=='isCash'"></div>
        <!-- 领用明细 -->
        <div v-else-if="parentDialog =='isDetail'">
          <el-form-item label="单据编号：" class="two_search">
            <span class="show-text">
              {{showData.timeCode}}
            </span>
          </el-form-item>
          <el-form-item label="收银员：" class="two_search">
            <span class="show-text">
              {{showData.workerName}}
            </span>
          </el-form-item>
          <el-form-item label="班次起始时间：" class="two_search">
            <span class="show-text">
              {{showData.workStartTime}}
            </span>
          </el-form-item>
        </div>

        <!-- 支付宝支付（2个搜索条件）-->
        <div v-else-if="parentDialog =='isAlipay'">
          <el-form-item label="交易流水号：">
            <el-input v-model="search.transactionCode" style="width:128px;"></el-input>
          </el-form-item>
          <el-form-item label="交易类型：">
            <el-select v-model="search.transactionType" style="width:120px;">
              <el-option label="全部" value>全部</el-option>
              <el-option v-for="(val,key) of transactionType" :key="key" :label="val" :value="key">{{val}}</el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="searchInfo">查询</el-button>
        </div>
      </el-form>
      <div class="border_div2" v-if="parentDialog=='isCash'"> 
         <!-- 现金收入 -->
        <el-table :data="gridData" border :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0}
          highlight-current-row show-summary :summary-method="getSummaries" >
          <el-table-column property="operateType" label="业务类型"  width="160" show-overflow-tooltip></el-table-column>
          <el-table-column property="operateTime" label="交易时间" width="160" show-overflow-tooltip></el-table-column>
          <el-table-column property="amount" label="发生金额（元）" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column property="operatorName" label="经手人" width="96" show-overflow-tooltip></el-table-column>
          <el-table-column property="terminalCode" label="终端编号" width="96" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <div class="border_div" v-else>
        <!-- 领用明细 -->
        <el-table :data="gridData" border :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0}
          highlight-current-row v-if="parentDialog=='isDetail'">
          <el-table-column property="thingName" label="领用科目" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column property="thingCount" label="领用数量" width="96"></el-table-column>
          <el-table-column property="amount" label="领用金额" width="96"></el-table-column>
          <el-table-column property="createTime" label="领用时间" width="96" show-overflow-tooltip></el-table-column>
          <el-table-column property="provideUserName" label="发送人" width="96" show-overflow-tooltip></el-table-column>
        </el-table>
        <!-- 支付宝 -->
        <el-table :data="gridData" border :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0}
          highlight-current-row show-summary v-else-if="parentDialog=='isAlipay'" :summary-method="getSummaries">
          <el-table-column property="transactionCode" label="交易流水号" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column property="transactionTime" label="交易时间" width="96" show-overflow-tooltip></el-table-column>
          <el-table-column property="payTime" label="支付时间" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column property="payTypeName" label="支付方式" width="96" show-overflow-tooltip></el-table-column>
          <el-table-column property="payAmount" label="金额（元）" width="96" show-overflow-tooltip></el-table-column>
          <el-table-column property="returnCode" label="支付凭证号" width="96" show-overflow-tooltip></el-table-column>
          <el-table-column property="transactionType" label="交易类型" width="96" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" show-overflow-tooltip width="80">
            <template slot-scope="scope">
              <el-button size='small' type="text" @click="detail(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
         <!-- 分页 -->
        <div class="block" v-if="parentDialog=='isDetail' ||parentDialog =='isAlipay'">
          <el-pagination @current-change="handleCurrentChange" background :current-page.sync="pageData.current"
            :page-size="pageData.size" layout="total,prev, pager, next, jumper" :total="pageData.total">
          </el-pagination>
        </div>
      </div>
     
      <div class="btn-area">
        <!-- <el-button type="primary" @click="chooseUser">确定</el-button> -->
        <el-button type="primary" @click="mydialogTableVisible = false">关闭</el-button>
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
      showData: {
        type: Object,
        default: function () {
          return {}
        }
      },
      parentDialog: {
        type: String,
        default: ""
      },
      gridData: {
        type: Array,
        default: function () {
          return []
        }
      },
      pageData: {
        type: Object,
        default: function () {
          return {
            current:1,
            size:10,
            total:0
          }
        }
      }
    },
    data() {
      return {
        mydialogTableVisible: this.dialogTableVisible,
        currentPage: 1,
        search: {}, //搜索
        transactionType: {
          0: "退货",
          1: "商品销售",
          2: "会员服务",
          3: "赠送",
          4: "报损",
          5: "留座",
          6: "影票补登",
          21: "会员开卡",
          22: "会员充值",
          23: "会员补卡",
          24: "会员注销",
          25: "升级换卡",
          26: "充值冲销",
          27: "会员激活",
        }
      }
    },
    methods: {
      // 确定选择
      chooseUser() {
        this.mydialogTableVisible = false;
      },
      handleCurrentChange(val) {
        console.log(val, 1111)
        this.currentPage = val
      },
      // 合计项
      getSummaries(param) {
        const {
          columns,
          data
        } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：';
            return;
          }
          const values = data.map(item => item[column.property]);
          if (column.property == "payAmount" || column.property == "amount") {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + value;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = sums[index].toFixed(2)
            // sums[index] += ' 元';
          } else {
            sums[index] = '';
          }
        });

        return sums;
      },
      // 搜索项
      searchInfo() {
        this.$emit("searchInfo", this.search)
      },
      detail(row){  // 查看详情
        this.$router.push({
          path:"../trandingRecord/detail",                             
          query:{
            saleBillFlowUid:row.uid,
            cinemaUid:row.cinemaUid
          }
        })
      }
    },
    watch: {
      dialogTableVisible(val) {
        this.mydialogTableVisible = val;
        // if(!val)this.$refs.borderDiv.style.height = "410px"
        // console.log(this.$refs.borderDiv,val)
      },
      mydialogTableVisible(val) {
        this.search = {};
        this.$emit("changeDialogTableVisible", val)
      },
      currentPage(val) {
        this.$emit("changeCurrentPage", val)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .my_dialog {
    /deep/ .el-dialog {
      width: 576px;
      // height: 576px;
      .el-button--primary{
        width: 80px;
      }
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
        height: 30px;
        line-height: 30px;
      }
      .border_div2{
        border: 1px solid #e5e5e5;
        margin-top: 11px;
        box-sizing: border-box;
        .el-table {
          margin: 0;
          border: none;
          height: 450px;
          overflow-y: hidden;
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
        }
      }
      .border_div {
        border: 1px solid #e5e5e5;
        margin-top: 11px;
        box-sizing: border-box;
        .el-table {
          margin: 0;
          border: none;
          // border-bottom: 1px solid #e5e5e5;
          height: 350px;
          overflow-y: hidden;
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

        .el-form-item__label,
        .el-form-item__content {
          font-size: 12px;
          line-height: 32px;
          padding-right: 0px;
          letter-spacing: 0;
        }

        .el-form-item__label {
          width: 90px;
        }

        .block {
          margin: 15px 0;

          .el-pagination {
            text-align: center;
          }
        }
      }
      .btn-area {
        padding: 12px 0;
        display: flex;
        justify-content: center;
        .el-button--primary{
          width: 80px;
        }
      }
      /deep/ .content .el-input {
        width: 50px;
      }
    }
  }
</style>