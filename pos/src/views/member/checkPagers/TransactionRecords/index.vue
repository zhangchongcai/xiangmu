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
                        <el-button type="primary" @click="onSubmit(3)" class="common-btn">近三个月</el-button>
                    </el-form-item>
                </div>
                <!-- 操作 -->
                <el-table-column
                    slot='append'
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button size="mini" round @click="handleCheck(scope.$index, scope.row)">查看</el-button>
                    </template>
                </el-table-column>
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
            titleText:'交易记录',
            dataList:[],
            totalData:0,
            startTime:'',
            endTime:'',
            pageNo:1,
            chooseMonth:{
                transactionTime:''
            },
        }
    },
    mounted(){
        if(!!sessionStorage['recordPageNo']){
            this.getOrderList(sessionStorage['recordPageNo']*1)
        }else{
            this.getOrderList(1)
        }
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
        'member.getOrderList'(val){
            this.dataList = val.records;
            this.totalData = val.total;
        }
    },
    beforeRouteEnter (to, from, next) {
        if(from.name !== 'recordDetail'){
            sessionStorage.removeItem('recordPageNo')
        }
        next()
    },
    methods:{
        onSubmit(query){
            if(query === 0){
                this.getOrderList(1);
                this.pageNo = 1;
            }else{
                this.chooseMonth['transactionTime'] = [this.startTime,this.endTime] = futureDate(query)
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
                    current:vo,
                    size:8,
                    startTime:this.startTime+' 00:00:00',
                    endTime:this.endTime+' 23:59:59',
                    tenantId:this.tenantId
                };
            }else{
                paramsObj = {
                    current:vo,
                    size:8,
                    tenantId:this.tenantId
                };
            }
            this.$route.query.type === 'phone' ? paramsObj['memberId'] = sessionStorage['memberId'] : paramsObj['cardNo'] = this.$route.query.phoneOrCard;
            paramsObj['fromChargeOff'] = false;
            let params = {
                url: memeberApi.queryTradeRecord["url"],
                params: paramsObj
            }
            this.$store.dispatch('getOrderList',params)
        },
        handleCheck(index,item){
            this.$router.push({name:'recordDetail',query:{flowNo:item.flowNo}})
        },
        currentPage(vo){
            this.getOrderList(vo);
            sessionStorage['recordPageNo'] = vo;
        },
        getDate(vo){
            if(!!vo.transactionTime){
                this.startTime = vo.transactionTime[0];
                this.endTime = vo.transactionTime[1];
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
