<template>
  <div class="commodity-content-wrap">
    <div class="header-fixed" ref="headerFixed">
      <div class="time-wrap">
        <div class="time-item">
          <Authority-Name :orgType="orgType" :orgName="orgName"></Authority-Name>
        </div>
        <div class="time-item">
          <label class="label-title">
            时间选择：
            <calendar-view
              size="mini"
              v-model="time"
              format="yyyy-MM-dd"
              :dateType="dateType"
              :dateTypeActive="dateTypeActive"
              :dateTypeIndex="dateTypeIndex"
              @emitCalendarType="getTimeType"
              @change="changeTime"
            ></calendar-view>
          </label>
        </div>
        <div class="time-item">
          <div class="member-type">
            <!-- <el-checkbox v-model="memberType" @change="changeMemberType">仅会员</el-checkbox> -->
            	<span class="label-title">会员属性：</span>
              <el-radio-group class="reset-radios-group" v-model="memberType">
                  <el-radio :label="0">全部</el-radio>
                  <el-radio :label="1">仅会员</el-radio>
              </el-radio-group>
          </div>
          <el-button type="primary" style="margin-left:30px" @click="search">查询</el-button>
        </div>
      </div>
    </div>
    <div class="section" ref="targetRef">
      <div class="section-title flex">
        <div class="flex-left">
          <i class="el-icon-arrow-up icon"></i>
          指标概览
        </div>
        <div>
          <el-radio-group v-model="ratioType" @change="changeRadio">
            <el-radio :label="1" :disabled="disabledChain">环比</el-radio>
            <el-radio :label="2" :disabled="disabledSame">同比</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="section-content" v-if="targetArr">
        <div class="target-flex">
          <div class="target-block" v-for="(item,index) in targetArr" :key="index" v-show="isShowTarget(item.code)">
            <div class="target-title">{{item.indicatorName}}</div>
            <div class="money">
              <i class="iconfont" :class="icons[index]" :style="{color:iconColors[index]}"></i>
              <span class="money-num">{{item.value| formatMoney(item.indicatorCode)}}</span>
              <span class="unit">{{item.indicatorCode|formatTargetUnit(item.value*1)}}</span>
            </div>
            <div class="ratio" v-if="ratioType == 1 && !disabledChain">
              环比
              <span
                class="ratio-num"
                :class="item.roundPeriodValue*1 > 0 ? 'text-green':'text-red' "
              >
                <i
                  class="iconfont"
                  :class="[item.roundPeriodValue > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"
                ></i>
                {{item.roundPeriodValue == '-9999'?'--':(item.roundPeriodValue*1 >0?item.roundPeriodValue*1:item.roundPeriodValue*(-1))}}%
              </span>
            </div>
            <div class="ratio" v-if="ratioType == 2 && !disabledSame">
              同比
              <span class="ratio-num" :class="item.samePeriodValue*1 >0?'text-green':'text-red'">
                <i
                  class="iconfont"
                  :class="[item.samePeriodValue > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"
                ></i>
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
        趋势图
      </div>
      <div class="section-select flex">
        <div class="unit" style="margin-left:30px"></div>
        <div>
          <target-label
            ref="targetLabel"
            :activeType="activeType"
            :targetLabel="targetLabel"
            :otherLabel="[]"
            @getType="changeTrendType"
            class="target-label__fixed"
          ></target-label>
        </div>
        <div>
          <i class="iconfont icon-neiye-zhexiantu cursor text-blue"  @click="isLine = true"></i>
          <i class="iconfont icon-neiye-biaoge cursor text-blue" @click="isLine = false"></i>
        </div>
      </div>
      <div class="section-content">
        <ve-line
          v-if="isLine"
          :data="boxLineData"
          :legend-visible="false"
          :settings="lineSettings"
          :extend="lineExtend"
          :data-empty="lineChartEmpty"
        ></ve-line>
        <div class="reset-table" v-else>
          <div style="overflow:hidden;zoom:1;margin:10px 0" class="reset-button">
            <el-button class="right" size="mini" @click="getTrendOut">导出</el-button>
          </div>
          <el-table border :data="boxTableData" height="380" class="mt10">
            <el-table-column prop="dateKey" label="日期" min-width="100" fixed  key="dateKey"></el-table-column>
            <el-table-column prop="boxOffice" label="在售SKU数量" min-width="110" fixed key="boxOffice">
              <template slot-scope="scope">{{scope.row.boxOffice | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="audienceCount" label="动销SKU数量" min-width="110" fixed  key="audienceCount">
              <template slot-scope="scope">{{scope.row.audienceCount | formatNum | formatFixed}}</template>
            </el-table-column>
            <el-table-column prop="planShowCount" label="动销率(%)" min-width="100" fixed v-if="memberTypeVal === 0" key="planShowCount">
              <template slot-scope="scope">{{scope.row.planShowCount | formatNum | formatFixed}}</template>
            </el-table-column>
            <el-table-column prop="avgTicketPrice" label="套餐数量" min-width="100" key="avgTicketPrice">
              <template slot-scope="scope">{{scope.row.avgTicketPrice | formatNull}}</template>
            </el-table-column>
            <el-table-column prop="servicePrice" label="套餐销售额(元)" min-width="130" key="servicePrice">
              <template slot-scope="scope">{{scope.row.servicePrice | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="hallServicePrice" label="套餐消费占比(%)" min-width="130" key="hallServicePrice">
              <template slot-scope="scope">{{scope.row.hallServicePrice | formatNum}}</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title flex">
        <div class="flex-left">
          <i class="el-icon-arrow-up icon"></i>
          明细列表
        </div>
      </div>
      <div class="section-content">
          <div class="flex">
            <div class="reset-tab flex-left">
              <el-tabs  v-model="authorType" type="card" size="mini" @tab-click="changeAuthorType">
                  <el-tab-pane type="primary" v-for="(item,index) in [{label:'套餐明细',name:'1'},{label:'单品明细',name:'2'}]"  :key="index" :label="item.label" :name="item.name" >
                  </el-tab-pane>
              </el-tabs>
            </div>
            <el-button class="right" size="mini" @click="getCommodityOut">导出</el-button>
          </div>
        <div class="reset-table" v-show="authorType == '1'">
          <el-table border :data="tableData" key="tableData" @sort-change="tableSortChange"
            :default-sort = "{prop: 'xse', order: 'descending'}"
          >
            <el-table-column
              prop="abc"
              label="SKU编码"
              min-width="100"
              key="abc"
              fixed
            >
            </el-table-column>
            <el-table-column label="套餐名称" min-width="110" fixed key="area" prop="name">
              <template slot-scope="scope">
                <div class="cursor" @click="goDetail(scope.row.id)">
                  <span class="text-blue">{{scope.row.name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="xse"
              label="销售额(元)"
              min-width="110"
              sortable="custom"
              key="xse"
              fixed
            >
              <template slot-scope="scope">{{scope.row.xse | formatNum}}</template>
            </el-table-column>
            <el-table-column
              prop="audienceCount"
              label="销售单量"
              min-width="150"
              sortable="custom"
              key="audienceCount"
            >
              <template slot-scope="scope">{{scope.row.audienceCount | formatNum | formatFixed}}</template>
            </el-table-column>
            <el-table-column
              prop="planShowCount"
              label="销售数量"
              min-width="120"
              sortable="custom"
              v-if="memberTypeVal === 0"
              key="planShowCount"
            >
              <template slot-scope="scope">{{scope.row.planShowCount | formatNum | formatFixed}}</template>
            </el-table-column>
            <el-table-column
              prop="servicePrice"
              label="客单价(元)"
              min-width="120"
              sortable="custom"
              key="servicePrice"
            >
              <template slot-scope="scope">{{scope.row.servicePrice | formatNum}}</template>
            </el-table-column>
            <el-table-column
              prop="hallServicePrice"
              label="件单价(元)"
              min-width="120"
              sortable="custom"
              key="hallServicePrice"
            >
              <template slot-scope="scope">{{scope.row.hallServicePrice | formatNum}}</template>
            </el-table-column>
            <el-table-column
              prop="payBoxOffice"
              label="客单量"
              min-width="90"
              sortable="custom"
              key="payBoxOffice"
            >
              <template slot-scope="scope">{{scope.row.payBoxOffice | formatNum}}</template>
            </el-table-column>
            <el-table-column
              prop="payBoxOffice"
              label="销售毛利"
              min-width="90"
              sortable="custom"
              key="payBoxOffice"
            >
              <template slot-scope="scope">{{scope.row.payBoxOffice | formatNum}}</template>
            </el-table-column>
            <el-table-column
              prop="payBoxOffice"
              label="销售毛利率(%)"
              min-width="90"
              sortable="custom"
              key="payBoxOffice"
            >
              <template slot-scope="scope">{{scope.row.payBoxOffice | formatNum}}</template>
            </el-table-column>
            <el-table-column
              prop="payBoxOffice"
              label="销售成本(元)"
              min-width="90"
              sortable="custom"
              key="payBoxOffice"
            >
              <template slot-scope="scope">{{scope.row.payBoxOffice | formatNum}}</template>
            </el-table-column>
            <el-table-column
              prop="payBoxOffice"
              label="成本价(元)"
              min-width="90"
              sortable="custom"
              key="payBoxOffice"
            >
              <template slot-scope="scope">{{scope.row.payBoxOffice | formatNum}}</template>
            </el-table-column>
            <el-table-column
              prop="splitBoxOffice"
              label="购买率(%)"
              min-width="120"
              sortable="custom"
              key="splitBoxOffice"
            >
              <template slot-scope="scope">{{scope.row.splitBoxOffice | formatNum}}</template>
            </el-table-column>
            <el-table-column
              prop="unShowCountRate"
              label="人均卖品金额(元)"
              min-width="150"
              sortable="custom"
              v-if="memberTypeVal === 0"
              key="unShowCountRate"
            ></el-table-column>
            <el-table-column
              prop="marketShare"
              label="会员消费占比(%)"
              min-width="150"
              sortable="custom"
              v-if="memberTypeVal === 0"
              key="marketShare"
            >
              <template slot-scope="scope">{{scope.row.marketShare || '--'}}</template>
            </el-table-column>
          </el-table>
        </div>
        <div class="reset-table" v-show="authorType == '2'">
          <el-table border :data="tableData" key="tableData" @sort-change="tableSortChange"
            :default-sort = "{prop: 'xse', order: 'descending'}"
          >
            <el-table-column
              prop="abc"
              label="SKU编码"
              min-width="100"
              key="abc"
              fixed
            >
            </el-table-column>
            <el-table-column label="商品名称" min-width="110" fixed key="area" prop="name">
              <template slot-scope="scope">
                <div class="cursor" @click="goDetail(scope.row.id)">
                  <span class="text-blue">{{scope.row.name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="one"
              label="一级品类"
              min-width="100"
              key="one"
              fixed
            />
            <el-table-column
              prop="two"
              label="二级品类"
              min-width="100"
              key="two"
              fixed
            />
            <el-table-column
              prop="xse"
              label="销售额(元)"
              min-width="110"
              sortable="custom"
              key="xse"
              fixed
            >
              <template slot-scope="scope">{{scope.row.xse | formatNum}}</template>
            </el-table-column>
            <el-table-column
              prop="audienceCount"
              label="销售单量"
              min-width="150"
              sortable="custom"
              key="audienceCount"
            >
              <template slot-scope="scope">{{scope.row.audienceCount | formatNum | formatFixed}}</template>
            </el-table-column>
            <el-table-column
              prop="planShowCount"
              label="销售数量"
              min-width="120"
              sortable="custom"
              v-if="memberTypeVal === 0"
              key="planShowCount"
            >
              <template slot-scope="scope">{{scope.row.planShowCount | formatNum | formatFixed}}</template>
            </el-table-column>
            <el-table-column
              prop="servicePrice"
              label="客单价(元)"
              min-width="120"
              sortable="custom"
              key="servicePrice"
            >
              <template slot-scope="scope">{{scope.row.servicePrice | formatNum}}</template>
            </el-table-column>
            <el-table-column
              prop="hallServicePrice"
              label="件单价(元)"
              min-width="120"
              sortable="custom"
              key="hallServicePrice"
            >
              <template slot-scope="scope">{{scope.row.hallServicePrice | formatNum}}</template>
            </el-table-column>
            <el-table-column
              prop="payBoxOffice"
              label="客单量"
              min-width="90"
              sortable="custom"
              key="payBoxOffice"
            >
              <template slot-scope="scope">{{scope.row.payBoxOffice | formatNum}}</template>
            </el-table-column>
            <el-table-column
              prop="payBoxOffice"
              label="销售毛利"
              min-width="90"
              sortable="custom"
              key="payBoxOffice"
            >
              <template slot-scope="scope">{{scope.row.payBoxOffice | formatNum}}</template>
            </el-table-column>
            <el-table-column
              prop="payBoxOffice"
              label="销售毛利率(%)"
              min-width="90"
              sortable="custom"
              key="payBoxOffice"
            >
              <template slot-scope="scope">{{scope.row.payBoxOffice | formatNum}}</template>
            </el-table-column>
            <el-table-column
              prop="payBoxOffice"
              label="销售成本(元)"
              min-width="90"
              sortable="custom"
              key="payBoxOffice"
            >
              <template slot-scope="scope">{{scope.row.payBoxOffice | formatNum}}</template>
            </el-table-column>
            <el-table-column
              prop="payBoxOffice"
              label="成本价(元)"
              min-width="90"
              sortable="custom"
              key="payBoxOffice"
            >
              <template slot-scope="scope">{{scope.row.payBoxOffice | formatNum}}</template>
            </el-table-column>
            <el-table-column
              prop="splitBoxOffice"
              label="购买率(%)"
              min-width="120"
              sortable="custom"
              key="splitBoxOffice"
            >
              <template slot-scope="scope">{{scope.row.splitBoxOffice | formatNum}}</template>
            </el-table-column>
            <el-table-column
              prop="unShowCountRate"
              label="人均卖品金额(元)"
              min-width="150"
              sortable="custom"
              v-if="memberTypeVal === 0"
              key="unShowCountRate"
            ></el-table-column>
            <el-table-column
              prop="marketShare"
              label="会员消费占比(%)"
              min-width="150"
              sortable="custom"
              v-if="memberTypeVal === 0"
              key="marketShare"
            >
              <template slot-scope="scope">{{scope.row.marketShare || '--'}}</template>
            </el-table-column>
            <el-table-column
              prop="unShowCountRate"
              label="套餐消费占比(%)"
              min-width="150"
              sortable="custom"
              v-if="memberTypeVal === 0"
              key="unShowCountRate"
            ></el-table-column>
          </el-table>
        </div>
        <div class="reset-page">
          <el-pagination v-if="total>15"
            size="mini"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="sizes"
            :page-size="size"
            layout="total,sizes,prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
          <span class="page-else" v-else-if="total>0">共{{total}}条</span>
          <span class="page-else" v-else></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Commodity from "./commodity.js";
export default {
  mixins: [Commodity],
  data() {
    return {};
  }
};
</script>
