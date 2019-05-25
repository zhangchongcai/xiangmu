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
                        <el-button type="primary" @click="onSubmit(0)">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit(1)">近一个月</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit(3)">近三个月</el-button>
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
import { formatDate , futureDate} from '../../util/formatDate'
export default {
    data(){
        return {
            titleText:'变更记录',
            dataList:[],
            totalData:0,
            startTime:'',
            endTime:'',
            pageNo:1,
            chooseMonth:{
                operateTime:''
            },
        }
    },
    mounted(){
        this.getOrderList(1)
    },
    computed:{
        ...mapState(['user','member']),
        ...mapGetters(['tenantId']),
        searchData(){
            return Config.formateSearchData;
        },
        tableColumnData(){
            return Config.columnData
        }
    },
    watch:{
        'member.getOrderList'(val){
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
                this.chooseMonth['operateTime'] = [this.startTime,this.endTime] = futureDate(query)
                this.pageNo = 1;
                this.getOrderList(1);
            }
        },
        getOrderList(vo){
            this.member.loading = true;
            let paramsObj;
            if(this.startTime && this.endTime){
                paramsObj = {
                    memberId:sessionStorage['memberId'],
                    current:vo,
                    size:10,
                    startTime:this.startTime+" 00:00:00",
                    endTime:this.endTime+" 23:59:59",
                    tenantId:this.tenantId
                };
            }else{
                paramsObj = {
                    current:vo,
                    memberId:sessionStorage['memberId'],
                    size:10,
                    tenantId:this.tenantId
                };
            }
            let params = {
                url: memeberApi.getChangeRecord["url"],
                params: paramsObj,
            }
            this.$store.dispatch('getOrderList',params)
        },
        currentPage(vo){
            this.getOrderList(vo)
        },
        getDate(vo){
            if(!!vo.operateTime){
                this.startTime = vo.operateTime[0];
                this.endTime = vo.operateTime[1];
            }
        }
    },
    components:{
        'table-data':TabalData
    }
}
</script>
<style scoped>
.otherBtn{
    display:inline;
}
</style>
