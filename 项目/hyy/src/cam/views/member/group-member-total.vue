
<template>
<!-- 会员概况 -->
  <div class="sale-content-wrap">
    <div class="header-fixed">
      <!-- <bread-crumb :dataList="naveList" :currentTime="currentTime"></bread-crumb> -->
      <div class="time-wrap">
        <div class="time-item">
          <authority-name :orgType="orgType" :orgName="orgName"></authority-name>
        </div>
        <div class="time-item">
            <label class="label-title">时间选择：
                <calendar-view size="mini"  v-model="time"
                :dateType="dateType"
                :dateTypeActive="timeType"
                @emitCalendarType="getTimeType"
                @change="changeTime"
                ></calendar-view>
            </label>
        </div>
        <!--  影院品牌 集团版本有/区域、影院没有 -->
        <div class="time-item">
          <label>
            <span class="label-title">影院品牌：</span>
            <el-select v-model="brandId" clearable>
              <el-option
                v-for="(item,index) in cinemaBrand"
                :key="index"
                :label="item.brandName"
                :value="item.brandCode"
              ></el-option>
            </el-select>
          </label>
          <el-button type="primary" size="mini" style="margin-left:30px" @click="search">查询</el-button>
        </div>
        <!-- 影院品牌 -->
      </div>
    </div>
    <!-- 指标 -->
    <section-target  ref="target"
        :showRatio="showRatio"
        :hiddenRound="hiddenRound"
        :hiddenSame="hiddenSame" 
        :type="ratioType"
        :selectedTarget="selectedTarget" 
        @showTargetSetting="showTargetView" >
    </section-target>
    <!-- 趋势 -->
    <section-trend 
        :targetLabel="trendTargetLabel" 
        :otherLabel="trendOtherLabel"
        :targetType="trendFirstLabel" 
        :timeType="timeType"
        :allData="allTrendData"  
        @getOut="trendExport">
    </section-trend>
    <!-- 类型和渠道 -->
    <section-type-channel 
        :type="orgType"
        :targetLabel="channelTargetLabel" 
        :otherLabel="channelOtherLabel" 
        :targetType="channelFirstLabel"
        :allData="allChannelData">
    </section-type-channel>
    <!-- 详情 -->
    <section-detail 
        :timeType="timeType"
        :type="orgType"
        :allData="detailData" 
        @getOut="detailExport"
        @getData="getDetail"
        @go="goDetail">
        <div class="reset-page">
            <el-pagination size="mini" v-if="total>15"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="sizes,total,prev, pager, next, jumper"
                :current-page="page"
                :page-size="size"
                :page-sizes="sizes"
                :total="total">
            </el-pagination>
            <span class="page-else" v-else-if="total>0">共{{total}}条</span>
            <span class="page-else" v-else></span>

        </div>
    </section-detail>
    <!-- 指标设置弹窗 -->
    <target-new-dialog ref="targetDailog" :userId="userId" :targetList="targetList" @saveTarget="saveTarget"></target-new-dialog>
  </div>
</template>
<script >
import member from './common/member-total.js'
export default {
  mixins:[member],
};
</script>
