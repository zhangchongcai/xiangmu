<template>
  <div>
    <div class="printContent" id="wrap" ref="print">
      <div>
        <p class="bigText pText">上班登记表</p>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="">
              <span>收银员：</span>
              <span> {{totalData.workerName}} </span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="">
              <span>班次起始时间</span>
              <span>{{totalData.workStartTime}}</span>
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
              <span>票纸编号：</span>
              <span> {{Number(totalData.preAmount).toFixed(2)}}元</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="">
              <span>状态：</span>
              <span>收银中</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="">
              <span>制单时间：</span>
              <span> {{totalData.createTime}}</span>
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
      <div class="nameSpan">
        <strong>收银员:</strong>
        <div class="line"></div>
        <strong>制单人:</strong>
        <div class="line"></div>
      </div>
    </div>
    <div class="bottom-handler-tool">
      <div class="btn-area">
        <!-- <el-button type="primary" v-if="$route.query.export" @click="exportThis">导出</el-button> -->
        <el-button type="primary" v-print="'#wrap'">打印</el-button>
        <el-button @click="$router.push('list')">取消</el-button>
      </div>
    </div>

  </div>
</template>

<script>
  import Print from './vue-print'
  Vue.use(Print); // 打印注册
  export default {
    data() {
      return {
        totalData: {
          saleBillPayFlowVo: {}
        },
        getThings: [],
        ticketCycles: [],  // 票券回收明细
        ticketSales: [],  // 票券销售明细
      }
    },
    methods: {
      cancelFun() {
        console.log(111)
      },
      // 班次详情
      clearDetail() {
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
      exportThis(){
        console.log(222)
      }
    },
    created() {
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
      .line{
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