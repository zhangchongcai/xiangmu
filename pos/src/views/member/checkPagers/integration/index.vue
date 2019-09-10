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
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit(1)" class="common-btn">近一个月</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit(3)" class="common-btn">近三个月</el-button>
                    </el-form-item>
                </div>
        </table-data>
    </div>
</template>
<script>
import TabalData from '../tableComponent'
import Config from './config';
import { mapState, mapGetters } from 'vuex'
import { memeberApi ,MemberAjax} from 'http/memberApi'
import { formatDate , futureDate} from '../../util/formatDate'
export default {
    data(){
        return {
            titleText:'积分记录',
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
            paramsObj = {
                current:vo,
                size:10,
                startTime: !!this.startTime ?  this.startTime +' 00:00:00' : '',
                endTime: !!this.startTime ? this.endTime+' 23:59:59' : '',
                tenantId: this.tenantId,
                memberId:sessionStorage['memberId']
            };
            let params = {
                url: memeberApi.getPageList["url"],
                params: paramsObj
            }
            MemberAjax.getPageList(paramsObj).then(res=>{
                this.member.loading = false;
                if(res.code === 200){
                    this.dataList = res.data.records;
                    this.totalData = res.data.total;
                }
            }).catch(err=>{

            })
        },
        currentPage(vo){
            this.getOrderList(vo);
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
<style scoped>
.otherBtn{
    display:inline;
}
</style>
