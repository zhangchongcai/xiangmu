<template>
  <div class="channel-content-wrap">
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
              format="yyyy/MM/dd"
              :dateType="dateType"
              :dateTypeActive="dateTypeActive"
              :dateTypeIndex="dateTypeIndex"
              @emitCalendarType="getTimeType"
              @change="changeTime"
            ></calendar-view>
          </label>
        </div>
        <div class="time-item">
          <el-button type="primary" @click="search">查询</el-button>
          <div class="member-type">
            <el-checkbox v-model="memberType" @change="changeMemberType">仅会员</el-checkbox>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        渠道趋势
      </div>
      <div class="section-select flex">
        <div class="unit" style="margin-left:30px"></div>
        <div>
          <target-label
            ref="targetLabel"
            :activeType="activeType"
            :targetLabel="targetLabel"
            :otherLabel="otherLabel"
            @getType="changeTrendType"
          ></target-label>
        </div>
        <div>
          <!-- <i
            class="iconfont icon-neiye-zhexiantu cursor"
            :class="[isNumber?'text-blue':'']"
            @click="isNumber = true"
          ></i>
          <i
            class="iconfont icon-neiye-biaoge cursor text-blue"
            @click="isNumber = false"
          ></i> -->
          <el-radio-group v-model="isNumber" size="mini" v-if="!isHistogram">
            <el-radio-button :label="true">数值</el-radio-button>
            <el-radio-button :label="false">占比</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="section-content trend-chart">
        <ve-histogram :data="chartData" :settings="chartSettings"></ve-histogram>
      </div>
    </div>
    <div class="section">
      <div class="section-title flex">
        <div class="flex-left">
          <i class="el-icon-arrow-up icon"></i>
          渠道明细
        </div>
        <el-button class="right" size="mini" @click="getChannelOut">导出</el-button>
      </div>
      <div class="section-content">
        <div class="reset-table">
          <el-table border :data="tableData" key="tableData" @sort-change="tableSortChange"
            default-expand-all
            :default-sort = "{prop: 'xse', order: 'descending'}"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column label="渠道名称" min-width="110" fixed key="area" prop="name">
              <template slot-scope="scope">
                <div class="cursor" @click="goDetail(scope.row.id)">
                  <span class="text-blue">{{scope.row.name}}</span>
                  <i class="ring quehuo"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="xse"
              label="销售额(元)"
              min-width="110"
              sortable="custom"
              key="xse"
            >
              <template slot-scope="scope">{{scope.row.xse | formatNum}}</template>
            </el-table-column>
            <el-table-column
              prop="audienceCount"
              label="销售额占比(%)"
              min-width="150"
              sortable="custom"
              key="audienceCount"
            >
              <template slot-scope="scope">{{scope.row.audienceCount | formatNum | formatFixed}}</template>
            </el-table-column>
            <el-table-column
              prop="planShowCount"
              label="销售单量"
              min-width="120"
              sortable="custom"
              v-if="memberTypeVal === 0"
              key="planShowCount"
            >
              <template slot-scope="scope">{{scope.row.planShowCount | formatNum | formatFixed}}</template>
            </el-table-column>
            <el-table-column
              prop="avgTicketPrice"
              label="销售数量"
              min-width="120"
              sortable="custom"
              key="avgTicketPrice"
            >
              <template slot-scope="scope">{{scope.row.avgTicketPrice}}</template>
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
              prop="attendanceRate"
              label="销售成本(元)"
              min-width="130"
              sortable="custom"
              v-if="memberTypeVal === 0"
              key="attendanceRate"
            ></el-table-column>
            <el-table-column
              prop="avgPlanShowCount"
              label="成本价(元)"
              min-width="130"
              sortable="custom"
              v-if="memberTypeVal === 0"
              key="avgPlanShowCount"
            >
              <template slot-scope="scope">{{scope.row.avgPlanShowCount | formatFixed}}</template>
            </el-table-column>
            <el-table-column
              prop="avgSeatPrice"
              label="销售毛利"
              min-width="100"
              sortable="custom"
              v-if="memberTypeVal === 0"
              key="avgSeatPrice"
            ></el-table-column>
            <el-table-column
              prop="memberBoxOfficePer"
              label="销售毛利率(%)"
              min-width="140"
              sortable="custom"
              key="memberBoxOfficePer"
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
              prop="abc"
              label="套餐消费占比(%)"
              min-width="140"
              sortable="custom"
              key="abc"
            ></el-table-column>
          </el-table>
        </div>
        <div class="reset-page" v-if="total>0">
          <el-pagination
            size="mini"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="sizes"
            :page-size="size"
            layout="sizes,total,prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Channel from "./channel.js";
export default {
  mixins: [Channel],
  data() {
    return {};
  }
};
</script>
<style>
  /* .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  } */
</style>
