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
            <calendar-view size="mini" v-model="time" format="yyyy-MM-dd" :dateType="dateType" :dateTypeActive="dateTypeActive" :dateTypeIndex="dateTypeIndex" @emitCalendarType="getTimeType" @change="changeTime"></calendar-view>
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
          <target-label ref="targetLabel" :activeType="activeType" :targetLabel="targetLabel" :otherLabel="otherLabel" @getType="changeTrendType"></target-label>
        </div>
        <div>
          <el-radio-group v-model="isNumber" size="mini" v-if="!isHistogram">
            <el-radio-button :label="0">数值</el-radio-button>
            <el-radio-button :label="1">占比</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="section-content trend-chart">
        <ve-histogram :data="chartData" :settings="chartSettings" :extend="chartExtend"></ve-histogram>
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
        <TreeGrid :columns="columns" :tree-structure="true" :default-expand-all="false" :default-sort="{prop: 'salesVolume', order: 'descending'}" @tableSortChange="tableSortChange" :data-source="dataSource">
        </TreeGrid>
        <div class="reset-page" v-show="false">
          <el-pagination v-if="total>15" size="mini" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="sizes" :page-size="size" layout="total,sizes,prev, pager, next, jumper" :total="total"></el-pagination>
          <span class="page-else" v-else-if="total>0">共{{total}}条</span>
          <span class="page-else" v-else></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Channel from './channel.js';
export default {
  mixins: [Channel],
  data () {
    return {};
  }
};
</script>
<style lang="scss" scoped>
</style>
