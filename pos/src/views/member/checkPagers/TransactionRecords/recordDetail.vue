<template>
    <div style="height:100vh">
        <div class="member-home-title">查看</div>
        <div class="detail-info" v-if="show">
            <div class="comm-title">交易详情</div>
            <div class="info-list">
                <p>交易单号：{{tradingInfo.flowNo}}</p>
                <p>交易类型：{{tradingInfo.businessName}}</p>
                <p>会员卡号：{{tradingInfo.cardNo}}</p>
                <p>交易时间：{{tradingInfo.transactionTime}}</p>
                <p>交易终端：{{tradingInfo.posNo}}</p>
                <p>交易金额：{{tradingInfo.amount || 0}}</p>
                <p>交易方式：{{getPayMethodName(tradingInfo.payMethodCode)}}</p>
                <p>交易影院：{{tradingInfo.cinemaName}}</p>
                <p>交易渠道：{{tradingInfo.channelName}}</p>
                <!-- <p>操作人：1234567</p> -->
            </div>
        </div>
        <div class="back">
            <el-button @click="$router.go(-1)" class="common-btn">返回</el-button>
        </div>
    </div>
</template>
<script>
import { MemberAjax } from 'http/memberApi';
import  { mapState, mapGetters } from 'vuex'
import { getPayMethodName } from '../../util/utils'
export default {
    data(){
        return {
            show:false,
            tradingInfo:'',
            timer:null,
        }
    },
    computed:{
        ...mapGetters(['tenantId'])
    },
    created(){
        this.getInfo()
    },
    methods:{
        getPayMethodName(value){
            return getPayMethodName(value)
        },
        getInfo(){
            let params = {
                flowNo:this.$route.query.flowNo,
                tenantId:this.tenantId,
            }
            MemberAjax.getTradeDetail(params).then(res=>{
                if(res.code === 200){
                    this.show = true;
                    this.tradingInfo = res.data;
                }else{
                    this.$message.warning(res.msg)
                    this.timer = setTimeout(()=>{
                        this.$router.go(-1)
                    },3000)
                }
            }).catch(error => {
                // this.$message.warning(error)
                this.timer = setTimeout(()=>{
                    this.$router.go(-1)
                },3000)
            })
        }
    },
    beforeDestroy(){
        clearTimeout(this.timer)
    }
}
</script>
<style scoped lang='scss'>
.comm-title{
    font-size:$font-size16;
    padding:2vh 0 2vh 3vw;
    font-weight:bold
}
.info-list{
    display:flex;
    flex-wrap:wrap;
    padding-left:3vw;
    p{
        font-size:$font-size16;
        width: 24vw;
        margin-bottom:2.5vh;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
}
.back {
  position:absolute;
  bottom:4vh;
  right:3vw;
}
</style>

