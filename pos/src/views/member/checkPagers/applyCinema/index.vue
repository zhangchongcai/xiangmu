<template>
    <div>
        <table-data
            :titleText="titleText"
            :searchData="searchData"
            :tableColumnData="tableColumnData"
            :dataList='dataList'
            :totalData='totalData'
            :pageNo='pageNo'
            :customPageing='true'
            @currentPage='currentPage'
            @getDate='getDate'>
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
            titleText:'适用影院',
            dataList:null,
            sumCinemaList:null,
            totalData:0,
            pageNo:1
        }
    },
    mounted(){
        this.getOrderList(1);
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
        'member.getOrderList':{
            handler:function(val,oldVal){
                if(val){
                    this.sumCinemaList = this.formatDataList(val);
                    this.totalData = val.length;
                    this.dataList = this.spliceArr(1)
                }
            },
            immediate:true
        }
    },
    methods:{
        getOrderList(vo){
            this.member.loading = true;
            let paramsObj = {
                cardProductId:this.member.cardProductId,
                tenantId:this.tenantId
            };
            let params = {
                url: memeberApi.getFitCinema["url"],
                params: paramsObj,
            }
            this.$store.dispatch('getOrderList',params)
        },
        currentPage(vo){
            this.dataList = this.spliceArr(vo)
        },
        getDate(vo){
            
        },
        formatDataList(arr){
            let emptyArr = [];
            arr.forEach((item,index)=>{
                emptyArr.push({
                    'cinemaName':item
                })
            })
            return emptyArr
        },
        spliceArr(i){
           return this.sumCinemaList.slice((i-1)*8,8*i)
        }
    },
    components:{
        'table-data':TabalData
    }
}
</script>
