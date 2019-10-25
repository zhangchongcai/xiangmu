import { querySmsScene } from 'src/frame_cpm/http/interface';
<template>
  <div class="my_dialog">
    <el-dialog :title="title" :visible.sync="mydialogTableVisible">
      <el-form :inline="true">
        <!-- 电影票销售（4个搜索条件） -->
        <div v-if="parentDialog =='isboxOffice'">
          <el-form-item label="交易类型：">
            <el-select v-model="search.saleType" style="width:184px;">
              <el-option label="全部" value>全部</el-option>
              <el-option label="销售" value="1">销售</el-option>
              <el-option label="退票" value="2">退票</el-option>
              <el-option label="补登" value="3">补登</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="影票编号：">
            <el-input v-model="search.cinemaTicketCode" style="width:184px;"></el-input>
          </el-form-item>
          <el-form-item label="影片：">
            <el-input v-model="search.movieName" style="width:184px;"></el-input>
          </el-form-item>
           <el-form-item label="支付方式：">
            <el-input v-model="search.payTypeInfo" style="width:184px;"></el-input>
          </el-form-item>
          <el-button type="primary" @click="searchInfo">查询</el-button>
        </div>
         <!-- 银行卡收入（3个搜索条件） -->
        <div v-else-if="parentDialog =='isbankCard'">
          <el-form-item label="交易流水号：">
            <el-input v-model="search.saleType" style="width:148px;"></el-input>
          </el-form-item>
          <el-form-item label="交易类型：">
            <el-select v-model="search.saleType" style="width:148px;">
              <el-option label="全部" value>全部</el-option>
              <el-option label="电影票" value="1">电影票</el-option>
              <el-option label="卖品" value="2">卖品</el-option>
              <el-option label="电影票+卖品" value="3">电影票+卖品</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付凭证号：">
            <el-input v-model="search.saleType" style="width:148px;"></el-input>
          </el-form-item>
          <el-button type="primary">查询</el-button>
        </div>
        <!-- 卖品收入明细（5个搜索条件） -->
        <div v-else-if="parentDialog =='isGood'">
          <el-form-item label="交易类型：">
            <el-select v-model="search.saleType" style="width:184px;">
             <el-option label="全部" value>全部</el-option>
              <el-option label="销售" value="1">销售</el-option>
              <el-option label="退货" value="2">退货</el-option>
              <!-- <el-option label="补登" value="3">补登</el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="商品：">
            <el-input v-model="search.merName" style="width:184px;"></el-input>
          </el-form-item>
          <el-form-item label="店内码：">
            <el-input v-model="search.merCode" style="width:184px;"></el-input>
          </el-form-item>
          <el-form-item label="商品条码：">
            <el-input v-model="search.barCode" style="width:184px;"></el-input>
          </el-form-item>
           <el-form-item label="支付方式：">
            <el-input v-model="search.payTypeInfo" style="width:184px;"></el-input>
          </el-form-item>
          <el-button type="primary" @click="searchInfo">查询</el-button>
        </div>
        <!-- 会员开卡充值明细（4个搜索条件） -->
        <div v-else-if="parentDialog =='isvipDetail'">
          <el-form-item label="交易类型：">
            <el-select v-model="search.serviceType" style="width:184px;">
             <el-option label="全部" value>全部</el-option>
              <el-option v-for="(val,key) of vipsellType" :key="key" :label="val" :value="key">{{val}}</el-option>
              <!-- <el-option label="会员开卡" value="MEMBER_REG">会员开卡</el-option>
              <el-option label="会员充值" value="RECHARGE">会员充值</el-option>
              <el-option label="充值冲销" value="REVERSING">充值冲销</el-option>
               <el-option label="会员补卡" value="PATCH_CARD">会员补卡</el-option>
              <el-option label="升级换卡" value="CHANGE_CARD">升级换卡</el-option>
              <el-option label="会员注销" value="MEMBER_LOGOUT">会员注销</el-option>
              <el-option label="会员激活" value="ACTIVE_CARD">会员激活</el-option> -->
              
            </el-select>
          </el-form-item>
          <el-form-item label="会员卡：">
            <el-input v-model="search.memberCardCode" style="width:184px;"></el-input>
          </el-form-item>
          <el-form-item label="会员手机：">
            <el-input v-model="search.mphone" style="width:184px;"></el-input>
          </el-form-item>
           <el-form-item label="支付方式：">
            <el-input v-model="search.payTypeInfo" style="width:184px;"></el-input>
          </el-form-item>
          <el-button type="primary" @click="searchInfo">查询</el-button>
        </div>
        <!-- 票务销售明细（4个搜索条件） -->
        <div v-else-if="parentDialog =='isTicket'">
          <el-form-item label="交易类型：">
            <el-select v-model="search.saleType" style="width:184px;">
              <el-option label="全部" value>全部</el-option>
              <el-option label="销售" value="1">销售</el-option>
              <el-option label="退票" value="2">退票</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="票券名称：">
            <el-input v-model="search.ticketName" style="width:184px;"></el-input>
          </el-form-item>
          <el-form-item label="票券编号：">
            <el-input v-model="search.ticketCode" style="width:184px;"></el-input>
          </el-form-item>
           <el-form-item label="支付方式：">
            <el-input v-model="search.payTypeInfo" style="width:184px;"></el-input>
          </el-form-item>
          <el-button type="primary"  @click="searchInfo">查询</el-button>
        </div>
        <!-- 其他销售明细（3个搜索条件） -->
        <div v-else-if="parentDialog =='isOther'">
          <el-form-item label="交易类型：">
            <el-select v-model="search.saleType" style="width:148px;">
              <el-option label="全部" value>全部</el-option>
              <el-option label="销售" value="1">销售</el-option>
              <el-option label="退票" value="2">退票</el-option>
              <el-option label="补登" value="3">补登</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称：">
            <el-input v-model="search.goodsName" style="width:184px;"></el-input>
          </el-form-item>
           <el-form-item label="支付方式：">
            <el-input v-model="search.payTypeInfo" style="width:148px;"></el-input>
          </el-form-item>
          <el-button type="primary" @click="searchInfo">查询</el-button>
        </div>
      </el-form>
       <div class="choose_table">
       <!-- 票房收入明细 -->
      <el-table :data="gridData" :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0}
        highlight-current-row show-summary v-if="parentDialog=='isboxOffice'" :summary-method="getSummaries" :key=1>
        <el-table-column property="transactionCode" label="交易流水号" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column property="transactionTime" label="交易时间" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column property="saleType" label="交易类型" width="90"></el-table-column>
        <el-table-column property="ticketPrice" label="票房单价（元）" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column property="couponName" label="优惠匹配" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column property="cinemaTicketCode" label="影票编号" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column property="movieName" label="影片" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column property="filmTime" label="放映场次" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column property="position" label="座位编号" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column property="payTypeInfo" label="支付方式" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="getInfo" label="取票状态" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="80" fixed="right" :key=1>
          <template slot-scope="scope">
             <el-button size='small' type="text" @click="detail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 银行卡收入 -->
      <el-table :data="gridData" :cell-style={padding:0} :row-style={height:30} :header-cell-style="{padding:0}"
        highlight-current-row show-summary v-else-if="parentDialog=='isbankCard'" :summary-method="getSummaries" :key=6>
        <el-table-column property="transactionCode" label="交易流水号" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column property="transactionTime" label="交易时间" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="payTime" label="支付时间" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column property="payTypeName" label="支付方式" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="payAmount" label="金额（元）" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="returnCode" label="支付凭证号" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="transactionType" label="交易类型" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="80" fixed="right" :key=6>
          <template slot-scope="scope">
           <el-button size='small' type="text" @click="detail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 卖品收入明细 -->
      <el-table :data="gridData" :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0}
        highlight-current-row show-summary v-else-if="parentDialog=='isGood'" :summary-method="getSummaries" :key=2>
        <el-table-column property="transactionCode" label="交易流水号" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column property="transactionTime" label="交易时间" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="saleType" label="交易类型" width="120"></el-table-column>
        <el-table-column property="merName" label="商品名称" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="salePrice" label="单价（元）" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="saleNum" label="销售数量" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="numPrice" label="金额（元）" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="couponName" label="优惠匹配" width="120"></el-table-column>
        <el-table-column property="unitName" label="单位" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="merCode" label="店内码" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="payTypeInfo" label="支付方式" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="getInfo" label="取货状态" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="80" fixed="right" :key=2>
          <template slot-scope="scope" >
            <el-button size='small' type="text" @click="detail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 会员开卡充值明细 -->
      <el-table :data="gridData" :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0}
        highlight-current-row show-summary v-else-if="parentDialog=='isvipDetail'" :summary-method="getSummaries" :key=3>
        <el-table-column property="transactionCode" label="交易流水号" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column property="transactionTime" label="交易时间" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="sellType" label="交易类型" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column property="memberCardCode" label="会员卡号" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="mphone" label="会员手机" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="bookCost" label="工本费" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="rebackCost" label="充值/退还" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="couponName" label="优惠匹配" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="payTypeInfo" label="支付方式" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="80" fixed="right" :key=3>
          <template slot-scope="scope">
            <el-button size='small' type="text" @click="detail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 票券销售明细 -->
      <el-table :data="gridData" :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0}
        highlight-current-row show-summary v-else-if="parentDialog=='isTicket'" :summary-method="getSummaries" :key=4>
        <el-table-column property="transactionCode" label="交易流水号" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column property="transactionTime" label="交易时间" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="saleType" label="交易类型" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column property="ticketName" label="票券名称" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="payPrice" label="单价" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="saleNum" label="数量" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="numPrice" label="金额" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="ticketCode" label="票券编号" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="payTypeInfo" label="支付方式" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="80" fixed="right" :key=4>
          <template slot-scope="scope">
            <el-button size='small' type="text" @click="detail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
       <!-- 其他收入明细 -->
      <el-table :data="gridData" :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0}
        highlight-current-row show-summary v-else-if="parentDialog=='isOther'" :summary-method="getSummaries" :key=5>
        <el-table-column property="transactionCode" label="交易流水号" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column property="transactionTime" label="交易时间" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="saleType" label="交易类型" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column property="goodsName" label="商品名称" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="salePrice" label="单价（元）" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="saleNum" label="销售数量" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="numPrice" label="金额（元）" width="96" show-overflow-tooltip></el-table-column>
        <el-table-column property="couponName" label="优惠匹配" width="120"></el-table-column>
        <el-table-column property="payTypeInfo" label="支付方式" width="96" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column property="createTime" label="取货状态" width="96" show-overflow-tooltip></el-table-column> -->
        <el-table-column label="操作" show-overflow-tooltip width="80" fixed="right" :key=5>
          <template slot-scope="scope">
           <el-button size='small' type="text" @click="detail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <p v-show="tipsword" class="tipsword">支付方式合计：{{tipsword}}</p>
      <!-- 分页 -->
      <!-- v-show="parentDialog=='isDetail' || parentDialog=='isboxOffice'" -->
      <div class="block">
        <el-pagination @current-change="handleCurrentChange" background :current-page.sync="pageData.current || 1"
          :page-size="pageData.size" layout="total,prev, pager, next, jumper" :total="pageData.total">
        </el-pagination>
      </div>
      </div>
      <!-- <div style="height:32px;background:transparent;"></div> -->
      <div class="btn-area">
        <div>
          <el-button type="primary" @click="mydialogTableVisible = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>

</template>
<script>  
  export default {
    props: {
      dialogTableVisible2: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: "父组件尚未传值"
      },
      tipsword: {
        type: String,
        default: ""
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
          return {}
        }
      }
    },
    data() {
      return {
        mydialogTableVisible: this.dialogTableVisible2,
        currentPage: 1,
        search:{ }, // 搜索
        vipsellType:{
          MEMBER_REG:"会员开卡",
          RECHARGE:"会员充值",
          REVERSING:"充值冲销",
          PATCH_CARD:"会员补卡",
          CHANGE_CARD:"升级换卡",
          MEMBER_LOGOUT:"会员注销",
          ACTIVE_CARD:"会员激活"
        },
        totalAmount:'',
        totalNum:''
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.currentPage = val
      },
      // 合计项
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        let totalNum = this.totalNum,
            totalAmount = this.totalAmount
        console.log(columns,data)
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：';
            return;
          }
          const values = data.map(item => item[column.property]);
          switch (column.property) {
            case "saleNum":
              sums[index] = totalNum
              break;
            case "numPrice":
              sums[index] = totalAmount
              break;
            case "ticketPrice":
              sums[index] = totalAmount
              break;
            // case "bookCost":
            //   sums[index] = totalAmount
            //   break;
            case "rebackCost":
            
              sums[index] = totalAmount
              break;
            default:
              sums[index] = '';
              break;
          }
          // if (column.property =="ticketPrice" || column.property =="saleNum"
          // || column.property =="numPrice" || column.property =="bookCost" 
          // || column.property =="rebackCost") {
          //   sums[index] = values.reduce((prev, curr) => {
          //     const value = Number(curr)
          //     if (!isNaN(value)) {
          //       return prev + value;
          //     } else {
          //       return prev;
          //     }
          //   },0);
          //   sums[index] = sums[index].toFixed(2)
          //   // sums[index] += ' 元';
          // } else {
          //   sums[index] = '';
          // }
        });

        return sums;
      },
      searchInfo(){
        this.$emit("searchInfo", this.search)
      },
      detail(row){  // 查看详情
        this.$router.push({
          path:"../trandingRecord/detail",                             
          query:{
            saleBillFlowUid:row.transactionCode,  
            cinemaUid:row.cinemaUid
          }
        })
      }
    },
    watch: {
      dialogTableVisible2(val) {
        this.mydialogTableVisible = val;
      },
      mydialogTableVisible(val) {
        this.search = {};
        this.$emit("changeDialogTableVisible2", val)
      },
      currentPage(val) {
        this.$emit("changeCurrentPage", val)
      }
    },
    created() {
      // console.log(this.parentDialog=='isDetail' ||'isboxOffice')
    }
  }
</script>

<style lang="scss" scoped>
  .my_dialog {
    /deep/ .el-dialog {
      .choose_table{
        margin-top: 11px;
        border-left: 1px solid #E5E5E5;
        border-bottom: 1px solid #E5E5E5;
      }
      .el-button--primary{
        width: 80px;
        padding: 8px;
        margin: 8px 20px;
      }
      width: 896px;
      // height: 576px;
      .el-form-item{
        margin: 8px 0; 
      }
      .el-dialog__header::after {
        content: "";
        display: block;
        width: 856px;
        height: 1px;
        background: #e5e5e5;
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
          line-height: 32px;
          padding-right: 0px;
          letter-spacing: 0;
        }
        .el-form-item__label{
          width: 80px;
        }
        .el-table {
          margin-top: 11px;
          // max-height: 300px;
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
          margin: 15px;

          .el-pagination {
            text-align: center;

          }
        }
      }

      .btn-area {
        // position: absolute;
        // bottom: 20px;
        // width: 100%;
        // margin: 20px;
        div{
          width: 100%;
          display: flex;
          justify-content: center;
        }
      }

      /deep/ .content .el-input {
        width: 50px;
      }
      .tipsword{
        padding:0 10px;
        line-height: 30px;
        font-size: 14px;
        font-weight: 600;
        border-top: 1px solid #e5e5e5;
        border-bottom: 1px solid #e5e5e5;
      }
    }
  }
</style>