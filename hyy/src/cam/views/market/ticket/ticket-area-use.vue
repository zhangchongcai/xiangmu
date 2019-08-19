
<template>
  <div class="sale-content-wrap">
    <div class="header-fixed">
        <!-- <bread-crumb  :dataList="naveList" :currentTime="currentTime"></bread-crumb> -->
        <section-search :orgName="orgName" :orgType="orgType" :ticketInfo="ticketInfo"  :time="time" @changeTime="changeTime" @search="search">
        </section-search>
    </div>
    <!-- 指标概览 -->
    <section-target 
        :targetArr="targetArr" 
        :timeType="timeType" 
        @showTargetSetting="showTargetSetting"
    ></section-target>
    <!-- 指标趋势 -->
    <section-trend :allData="allTrendData" @getOut="trendExport"></section-trend>
    <!-- 明细列表 -->
    <section-detail ref="detail" 
        :orgType="orgType"
        :tableData="tableData"  
        @getTableData="getTableData"
        @getOut="detailExport"
        @goDetail="goDetail"
        @showCompar="showCompar">
        <div class="reset-page">
            <el-pagination size="mini"  v-if="total > 15"
                layout="total,sizes,prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="sizes"
                :page-size="size"
                :total="total">
            </el-pagination>
            <span class="page-else" v-else-if="total > 0">共{{total}}条</span>
            <span class="page-else" v-else></span>
        </div>
    </section-detail>
    <!-- 指标设置弹窗 -->
    <target-new-dialog ref="targetDialog" :userId="userId" :targetList="targetList" @saveTarget="saveTarget"></target-new-dialog>
  </div>
</template>
<script>
import ticketUse from './common/ticket-use.js'
export default {
  mixins:[ticketUse],
};
</script>
