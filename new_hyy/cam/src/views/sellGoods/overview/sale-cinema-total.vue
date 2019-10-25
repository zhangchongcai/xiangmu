<template>
  <!-- 影院版 -->
  <div class="sale-content-wrap">
    <div class="header-fixed">
      <!-- <bread-crumb  :currentTime="currentTime" :dataList="dataList"></bread-crumb> -->
      <div class="time-wrap">
        <div class="time-item">
          <Authority-Name :orgType="orgType" :orgName="orgName"></Authority-Name>
        </div>
        <div class="time-item">
          <span class="label-title">时间选择:</span>
          <calendar-view size="mini" v-model="time" :dateType="dateType" :dateTypeActive='dateTypeActive' @emitCalendarType="getTimeType" @change="changeTime"></calendar-view>
        </div>
        <div class="time-item">
          <el-button type="primary" size="mini" @click="search">查询</el-button>
          <el-checkbox v-model="memberType" @change="changeMemberType" style="margin-left:16px;">仅会员</el-checkbox>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        指标概览
        <div class="reset-radios-group right">
          <el-radio-group v-model="ratioType" @change="changeRadio">
            <el-radio :label="1" :disabled="disabledChain">环比</el-radio>
            <el-radio :label="2" :disabled="disabledSame">同比</el-radio>
          </el-radio-group>
          <el-button size="mini" style="margin-left:20px" @click="showTargetSetting">指标设置</el-button>
        </div>
      </div>
      <div class="section-content" v-if="targetArr">
        <div class="target-flex">
          <div class="target-block" v-for="(item,index) in targetArr" :key="index">
            <div class="target-title">{{item.indicatorName}}</div>
            <div class="money">
              <i class="iconfont" :class="icons[item.indicatorCode].icon" :style="{color:iconColors[index]}"></i>
              <span class="money-num">{{item.value |formatMoney(item.indicatorCode)}}</span>
              <span class="unit">{{item.indicatorCode|formatTargetUnit(item.value*1)}}</span>
            </div>
            <div class="ratio" v-if="ratioType == 1 && !disabledChain">
              环比
              <span class="ratio-num" :class="item.roundPeriodValue*1 > 0 ? 'text-green':'text-red' ">
                <i class="iconfont" :class="[item.roundPeriodValue > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']">
                </i>
                {{item.roundPeriodValue == '-9999'?'--':(item.roundPeriodValue*1 >0?item.roundPeriodValue*1:item.roundPeriodValue*(-1))}}%
              </span>
            </div>
            <div class="ratio" v-if="ratioType == 2 && !disabledSame">
              同比
              <span class="ratio-num" :class="item.samePeriodValue*1 >0?'text-green':'text-red'">
                <i class="iconfont" :class="[item.samePeriodValue > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']">
                </i>
                {{item.samePeriodValue == '-9999'?'--':(item.samePeriodValue*1 >0 ?item.samePeriodValue:item.samePeriodValue*(-1))}}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        卖品指标趋势
      </div>
      <div class="section-select flex">
        <div class="unit" style="margin-left:30px"></div>
        <div>
          <target-label activeType="xse" :targetLabel="targetLabel" :otherLabel="otherLabel" @getType="changeSaleType">
          </target-label>
        </div>
        <div>
          <i class="iconfont icon-neiye-zhexiantu cursor text-blue" @click="isLine = true"></i>
          <i class="iconfont icon-neiye-biaoge cursor text-blue" @click="isLine = false"></i>
        </div>
      </div>
      <div class="section-content">
        <ve-line v-if="isLine" :data="saleLineData" :legend-visible="false" :settings="lineSettings" :extend="lineExtend">
        </ve-line>
        <div class="reset-table" v-else>
          <div style="overflow:hidden;zoom:1;margin:10px 0" class="reset-button">
            <el-button class="right" size="mini" @click="getSaleOut">导出</el-button>
          </div>
          <el-table border :data="saleTableData" height="380" class="mt10">
            <el-table-column prop="dateKey" label="日期" min-width="100" fixed></el-table-column>
            <el-table-column prop="salesVolume" label="销售额(元)" min-width="140" fixed>
              <template slot-scope="scope">
                {{scope.row.salesVolume | formatNum}}
              </template>
            </el-table-column>
            <el-table-column prop="salesOrders" label="销售单量(单)" min-width="100" fixed>
              <template slot-scope="scope">
                {{scope.row.salesOrders | formatNum(0)}}
              </template>
            </el-table-column>
            <el-table-column prop="salesCount" label="销售数量(件)" min-width="100" fixed>
              <template slot-scope="scope">
                {{scope.row.salesCount | formatNum(0)}}
              </template>
            </el-table-column>
            <el-table-column prop="unitPrice" label="客单价(元)" min-width="100">
              <template slot-scope="scope">
                {{scope.row.unitPrice|formatNum}}
              </template>
            </el-table-column>
            <el-table-column prop="piecePrice" label="件单价(元)" min-width="100">
              <template slot-scope="scope">
                {{scope.row.piecePrice|formatNum}}
              </template>
            </el-table-column>
            <el-table-column prop="unitCount" label="客单量(件/单)" min-width="100">
              <template slot-scope="scope">
                {{scope.row.unitCount|formatNum}}
              </template>
            </el-table-column>
            <el-table-column prop="buyRate" label="购买率(%)" min-width="100">
            </el-table-column>
            <el-table-column prop="sppPrice" label="人均卖品金额(元)" min-width="120">
              <template slot-scope="scope">
                {{scope.row.sppPrice | formatNum}}
              </template>
            </el-table-column>
            <el-table-column prop="sellingCost" label="销售成本(元)" min-width="100">
              <template slot-scope="scope">
                {{scope.row.sellingCost | formatNum}}
              </template>
            </el-table-column>
            <el-table-column prop="salesGrossProfit" label="销售毛利(元)" min-width="100">
              <template slot-scope="scope">
                {{scope.row.salesGrossProfit | formatNum}}
              </template>
            </el-table-column>
            <el-table-column prop="salesGrossProfitRate" label="销售毛利率(%)" min-width="100"></el-table-column>
            <el-table-column prop="memberSalesVolumePercent" label="会员消费占比(%)" min-width="100"></el-table-column>
            <el-table-column prop="setmealSalesVolumePercent" label="套餐消费占比(%)" min-width="100"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        渠道及品类分布
      </div>
      <div class="section-select center">
        <target-label activeType="xse" :targetLabel="targetLabel" :otherLabel="otherLabel1" @getType="changeChannelType"></target-label>
      </div>
      <!-- 饼图 -->
      <div class="section-content flex" v-if="showPie">
        <div style="width:50%;">
          <ve-ring :data-empty="channelDataEmpty" :title="channelTitle" :data="channelData" :extend="pieExtend" :colors="colors"></ve-ring>
        </div>
        <div style="width:50%;">
          <ve-ring :data-empty="categoryDataEmpty" :title="categoryTitle" :data="categoryData" :settings="categorySettings" :extend="pieExtend" :colors="colors"></ve-ring>
        </div>
      </div>
      <!-- 柱状图 -->
      <div class="section-content flex" v-else>
        <div style="width:50%">
          <ve-histogram :data-empty="channelDataEmpty" :title="channelTitle" :data="channelBarData" :extend="barExtend" :legend-visible="false">
          </ve-histogram>
        </div>
        <div style="width:50%;">
          <ve-histogram :data-empty="categoryDataEmpty" :title="categoryTitle" :data="categoryData" :extend="barExtend" :legend-visible="false">
          </ve-histogram>
        </div>
      </div>
    </div>
    <!-- 指标设置弹窗 -->
    <target-dialog ref="targetDialog" :userId="userId"></target-dialog>
  </div>
</template>
<script>
import SaleJs from './sale-total.js';
export default {
  mixins: [SaleJs],
  watch: {
    '$route': function (to, from) {
      if (to.name == from.name && to.path.endsWith('cinema/sale/total')) {
        this.getCurrentTime();
        this.initData();
      }
    }
  }
};
</script>
