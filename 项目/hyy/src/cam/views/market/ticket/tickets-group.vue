<template>
    <div class="cam-tickets-wrap">
        <!-- <bread-crumb :dataList="naveList"></bread-crumb> -->
        <tickets-search 
            :orgType="orgType" 
            :orgName="orgName" 
            @search="search"
            @changeTime="changeTime"
            @changeType="changeType"
            @changeStatus="changeStatus"
            @changeName="changeName"            
            ></tickets-search>
        <tickets-detail :tableData="tableData" :orgType="orgType" @goDetail="goDetail"></tickets-detail>
        <div class="reset-page">
            <el-pagination size="mini" v-if="total>15"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="sizes"
                :page-size="size"
                layout="sizes,total,prev, pager, next, jumper"
                :total="total"></el-pagination>
            <span class="page-else" v-else-if="total>0">共{{total}}条</span>
            <span class="page-else" v-else></span>
        </div>
    </div>
</template>
<script>
import tickets from './common/tickets'
export default {
    mixins:[tickets],
};
</script>

