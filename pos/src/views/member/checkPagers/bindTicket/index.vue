<template>
    <div>
        <table-data
            :titleText="titleText"
            :searchData="searchData"
            :tableColumnData="tableColumnData"
            :dataList='dataList'
            :totalData='totalData'
            :pageNo='pageNo'
            :chooseMonth='chooseMonth'
            @currentPage='currentPage'
            @getDate='getDate'>
                <div slot='otherSubmitBtn' class="otherBtn">
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit(0)" class="common-btn">查询</el-button>
                        <el-button type="primary" @click="onSubmit(1)" class="common-btn">近一个月</el-button>
                    </el-form-item>
                </div>
        </table-data>
    </div>
</template>
<script>
import TabalData from '../tableComponent'
import Config from './config';
import { mapState, mapGetters } from 'vuex'
import { memeberApi } from 'http/memberApi'
import { formatDate ,futureDate } from '../../util/formatDate'
export default {
    data(){
        return {
            titleText:'绑定票券',
            dataList:[],
            totalData:0,
            startTime:'',
            endTime:'',
            pageNo:1,
            chooseMonth:{
                createTime:'',
                status:''
            },
        }
    },
    mounted(){
        this.getOrderList(1)
    },
    computed:{
        ...mapState(['member']),
        ...mapGetters(['tenantId']),
        searchData(){
            return Config.formateSearchData;
        },
        tableColumnData(){
            return Config.columnData
        }
    },
    watch:{
        'member.getOrderList'(val,oldVal){
            this.dataList = val.records;
            this.totalData = val.total;
        }
    },
    methods:{
        onSubmit(query){
            if(query === 0){
                this.getOrderList(1);
                this.pageNo = 1;
            }else{
                this.chooseMonth['createTime'] = [this.startTime,this.endTime] = futureDate(query)
                this.pageNo = 1;
                this.getOrderList(1);
            }
        },
        getOrderList(vo){
            this.member.loading = true;
            let paramsObj;
            this.pageNo = vo;
            if(this.startTime && this.endTime){
                paramsObj = {
                    memberId:sessionStorage['memberId'],
                    current:vo,
                    size:10,
                    startTime:this.startTime+" 00:00:00",
                    endTime:this.endTime+" 23:59:59",
                    tenantId:this.tenantId,
                    status:this.chooseMonth.status
                };
            }else{
                paramsObj = {
                    current:vo,
                    memberId:sessionStorage['memberId'],
                    size:10,
                    tenantId:this.tenantId,
                    status:this.chooseMonth.status
                };
            }
            let params = {
                url: memeberApi.queryBindingTicket["url"],
                params: paramsObj,
            }
            this.$store.dispatch('getOrderList',params)
        },
        currentPage(vo){
            this.getOrderList(vo)
        },
        getDate(vo){
            if(!!vo.createTime){
                this.startTime = vo.createTime[0];
                this.endTime = vo.createTime[1];
                this.chooseMonth = vo;
            }else{
                this.startTime = '';
                this.endTime = '';
            }
        }
    },
    components:{
        'table-data':TabalData
    }
}
</script>
