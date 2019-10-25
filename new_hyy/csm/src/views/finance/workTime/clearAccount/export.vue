<template>
  <div>
    <div class="printContent" id="wrap" ref="print">
      <div>
        <p class="bigText pText">清机登记表</p>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="">
              <span>班次起始及结束时间</span>
              <span>{{totalData.workStartTime}} - {{totalData.workEndTime	}}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="">
              <span>统计时间：</span>
              <span>{{totalData.workStartTime}} - {{totalData.workEndTime	}}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="">
              <span>收银员：</span>
              <span> {{totalData.workerName}} </span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="">
              <span>备用金：</span>
              <span> {{Number(totalData.preAmount).toFixed(2)}}元</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="">
              <span>制单人：</span>
              <span> {{totalData.createUserName}}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="">
              <span> 清机人：</span>
              <span> {{totalData.updateUserName}}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="">
              <span> 单据编号：</span>
              <span> {{totalData.timeCode}}</span>
            </div>
          </el-col>

        </el-row>
      </div>
      <div>
        <p class="middleText pText">班次收银统计</p>
        <strong>实收金额：</strong>
        <!-- <span>实收金额：</span> -->
        <el-row :gutter="20">
          <el-col :span="5">
            <div class="">
              <span>现金：</span>
              <span>{{Number(totalData.realXrmbAmount).toFixed(2)}}元</span>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="">
              <span>银行卡：</span>
              <span> {{Number(totalData.bandCardTotal).toFixed(2)}}元 </span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="">
              <span>其他支付：</span>
              <span>{{Number(totalData.amountWithoutXrmbAndBandCard).toFixed(2)}}元</span>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="">
              <span>资金收入调整：</span>
              <span>{{Number(totalData.fundChangeAmount).toFixed(2)}}元</span>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="">
              <span> 合计：</span>
              <span> {{Number(totalData.realAmount).toFixed(2)}}元</span>
            </div>
          </el-col>
        </el-row>
        <strong>应收金额：</strong>
        <!-- <span>应收金额：</span> -->
        <el-row :gutter="20">
          <el-col :span="5">
            <div class="">
              <span>现金：</span>
              <span>{{Number(totalData.saleBillPayFlowVo.xrmbAmount).toFixed(2)}}元</span>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="">
              <span>银行卡：</span>
              <span> {{Number(totalData.saleBillPayFlowVo.xunpAmount).toFixed(2)}}元 </span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="">
              <span>其他支付：</span>
              <span>{{Number(totalData.amountWithoutXrmbAndBandCard).toFixed(2)}}元</span>
            </div>
          </el-col>
          <el-col :span="5" :offset="5">
            <div class="">
              <span>合计：</span>
              <span>{{Number(totalData.shouldAmount).toFixed(2) }} 元</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="5" :offset="19">
            <div class="">
              <span style="color:red"> 差额：</span>
              <span style="color:red">{{Number(totalData.realAmount-Number(totalData.shouldAmount)).toFixed(2)}}
                元</span>
            </div>
          </el-col>
        </el-row>
        <strong>其中：</strong>
        <!-- <span>应收金额：</span> -->
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="">
              <span>票房收入合计金额：</span>
              <span>{{Number(totalData.movieTicketAmount).toFixed(2)}}元</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="">
              <span>合计数量：</span>
              <span> {{Number(totalData.movieTicketNum)}}张</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="">
              <span>卖品收入合计金额：</span>
              <span>{{Number(totalData.merAmount).toFixed(2)}}元</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="">
              <span>会员开卡卡费金额合计：</span>
              <span> {{Number(totalData.memberRegAmount).toFixed(2)}}元 </span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="">
              <span>会员充值金额合计：</span>
              <span>{{Number(totalData.memberAllRechangeAmount).toFixed(2)}}元</span>
            </div>
          </el-col>
        </el-row>
        <!-- <p>备注： SDGDSHG</p> -->
      </div>
      <div>
        <p class="middleText pText">领用记录</p>
        <el-table :data="getThings" style="width: 100%" :style="{'height':getThings.length?'auto':'100px'}">
          <el-table-column prop="thingName" label="领用物品" width="180">
          </el-table-column>
          <el-table-column prop="thingCount" label="领用数量" width="180">
          </el-table-column>
          <el-table-column prop="retThingCount" label="退还数量">
          </el-table-column>
          <el-table-column prop="sellCount" label="售出数量">
          </el-table-column>
          <el-table-column prop="remark" label="备注">
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="">
              <p class="middleText pText">票券回收明细</p>
              <el-table :data="ticketCycles" style="width: 100%" :style="{'height':ticketCycles.length?'auto':'100px'}">
                <el-table-column prop="getGoodsName" label="票券名称" width="180">
                </el-table-column>
                <el-table-column prop="getTotalNum" label="回收数量" width="180">
                </el-table-column>
                <el-table-column prop="getTotalAmount" label="抵用金额（元）">
                </el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="">
              <p class="middleText pText">票券销售明细</p>
              <el-table :data="ticketSales" style="width: 100%" :style="{'height':ticketSales.length?'auto':'100px'}">
                <el-table-column prop="getGoodsName" label="票券名称" width="180">
                </el-table-column>
                <el-table-column prop="getTotalNum" label="销售数量" width="180">
                </el-table-column>
                <el-table-column prop="getTotalAmount" label="销售金额（元）">
                </el-table-column>
              </el-table>
            </div>
          </el-col>

        </el-row>

      </div>
      <div class="nameSpan">
        <strong>收银员:</strong>
        <div class="line"></div>
        <strong>制单人:</strong>
        <div class="line"></div>
      </div>
    </div>
    <div class="bottom-handler-tool">
      <div class="btn-area">
        <el-button type="primary" @click="exportThis">导出</el-button>
        <el-button @click="$router.push('list')">取消</el-button>
      </div>
    </div>

  </div>
</template>

<script>
import Print from './vue-print'
// import config from 'frame_cpm/http/config.js';
import Axios from 'axios';
Vue.use(Print); // 打印注册
export default {
  data () {
    return {
      totalData: {
        saleBillPayFlowVo: {}
      },
      getThings: [],
      ticketCycles: [], // 票券回收明细
      ticketSales: [], // 票券销售明细
      baseURL: this.$store.state.default.apiConfig.baseURL,
    }
  },
  methods: {
    cancelFun () {
      console.log(111)
    },
    // 班次详情
    clearDetail () {
      let limit = {
        workTimeUid: this.$route.query.uid
      };
      this.$csmList.clearDetail(Object.assign({}, limit))
        .then(data => {
          if (data && data.code === 200) {
            this.totalData = data.data;
            //  this.totalData.saleBillPayFlowVo.xrmbAmount =22;
            console.log(this.totalData.saleBillPayFlowVo)
            this.totalData.saleBillPayFlowVo ? this.isCanSee = true : this.totalData.saleBillPayFlowVo = {}
            this.getThings = data.data.timeGetThings // 领用物品
            this.getThings.forEach(item => {
              // item.retThingCount = null 
              if (item.retThingCount === null) {
                item.sellCount = null
                return;
              }
              item.sellCount = Number(item.thingCount) - Number(item.retThingCount)
            })
          }
        })
    },
    exportThis () { // 倒出
      let limit = {
        uid: this.$route.query.uid
      };
      // let url = this.baseURL + "/trade/workTime/exportExcel?uid=" + this.$route.query.uid;
      let url = this.baseURL + "/trade/workTime/exportExcel"
      console.log(this.baseURL)
      // let store = this.$stroe
      let headers = {
        "Cpm-User-Token": sessionStorage.getItem("token")
      };
      // this.$ccmList.exportExcel({batchCode:param}).
      this.axios(url, {
        headers,
        method: "post",
        responseType: "blob",
        data: limit
      }).then(data => {
        console.log(data)
        let flag = data.headers;
        let message = data.msg ? data.msg : '班次收银导出失败！';
        let type = "warning";
        if (flag) {
          type = "success";
          message = '班次收银导出成功！';
          const blob = new Blob([data.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          });
          const fileName = this.totalData.timeCode;
          const elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        }
        this.$message({
          message
        });
      })
    }
  },
  created () {
    this.clearDetail();
  }
}
</script>
<style lang="scss" scoped>
.printContent {
  .pText {
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    margin-bottom: 16px;
  }

  .bigText {
    font-size: 24px;
    line-height: 48px;
  }

  .middleText {
    font-size: 16px;
    line-height: 32px;
    margin-top: 16px;
  }

  span {
    font-size: 12px;
    color: #666;
    line-height: 24px;
  }

  .nameSpan {
    margin-top: 80px;
    display: flex;
    justify-content: center;

    strong {
      margin: 0 1em;
    }

    .line {
      margin-top: 16px;
      display: block;
      width: 100px;
      height: 1px;
      // background-color: #333;
      border-bottom: 1px solid #333;
    }
  }
}

.btn-area {
  margin: 36px 0 0;
  display: flex;
  justify-content: center;

  .el-button {
    padding: 9px 27px;
  }
}
</style>