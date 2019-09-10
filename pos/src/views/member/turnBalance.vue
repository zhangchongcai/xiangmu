<template>
    <div class="_member-home">
        <div class="member-home-title">余额结转</div>
        <div class="trun-out-card">
            <div class="member-info-title">转出会员卡</div>
            <div style="position:relative">
                <CardReading @queryData="queryData" :cardReadingTitle="cardReadingTitle" :iskeyBoard="true"/>
                <div v-show="searchError.cardName" class="cardNoNameStyle">
                    <span v-text="searchError.cardType"></span>
                    <span style="margin-left:2vw" v-text="'卡政策：'+searchError.cardName"></span>
                </div>
            </div>
            <div class="first-card-info" v-if="firstCardShow">
                <div class='first-card-item'>
                    <label>姓名：</label>{{firstCardInfo.userName}}
                </div>
                <div class='first-card-item'>
                    <label>卡政策：</label>{{firstCardInfo.cardProductName}}
                </div>
                <div class='first-card-item'>
                    <label>开卡影城：</label>{{firstCardInfo.cinemaName}}
                </div>
                <div class='first-card-item' style="width:100%">
                    <label>卡内余额：</label>
                    {{firstCardInfo.totalBalance | formateMoney}} <em>(基本余额{{firstCardInfo.basicBalance | formateMoney}}元，赠送余额{{firstCardInfo.giveBalance | formateMoney}}元)</em>
                </div>
            </div>
        </div>
        <div class="trun-out-card">
            <div class="member-info-title">转入至会员卡</div>
            <div style="position:relative" class="_card-reading">
                <div class="query-phone-or-card">
                    <label class="lable" for="phoneOrCard">会员卡</label>
                    <input 
                        v-model="secondCardNum" 
                        @keyup.enter="validatorInp" 
                        placeholder="请输入会员卡号"
                        ref="turnInInp"
                        class="phoneOrCard"
                        @focus="(e)=>{e.target.style.borderColor = 'rgb(63, 118, 253)'}"
                        @blur="(e)=>{e.target.style.borderColor = '#bcbcbc'}">
                    <el-button class="common-btn" type="primary" @click="readCard">读卡</el-button>
                    <div v-show="secondCardError.cardName" class="cardNoNameStyle">
                        <span v-text="secondCardError.cardType"></span>
                        <span style="margin-left:2vw" v-text="'卡政策：'+secondCardError.cardName"></span>
                    </div>
                </div>
            </div>
            <div class="first-card-info" v-if="secondCardShow">
                <div class='first-card-item'>
                    <label>姓名：</label>
                    {{secondCardInfo.userName}}
                </div>
                <div class='first-card-item'>
                    <label>卡政策：</label>
                    {{secondCardInfo.cardProductName}}
                </div>
                <div class='first-card-item'>
                    <label>开卡影城：</label>
                    {{secondCardInfo.cinemaName}}
                </div>
            </div>
        </div>
        <div class="confirm-info" v-if="confirmCardShow">
            <div class="member-info-title">确认信息</div>
            <div class="info-content">
                <div class="before">
                    <span class="line-btn">转结前</span>
                    <span>账户余额：{{turnBalanceResult.beforeTotal | formateMoney}}元(基本余额：{{ turnBalanceResult.beforeBasic | formateMoney}}元,赠送余额：{{turnBalanceResult.beforeGive | formateMoney}}元)</span>
                </div>
                <div class="after">
                    <span class="line-btn">转结后</span>
                    <span>账户余额：{{turnBalanceResult.afterTotal | formateMoney}}元(基本余额：{{ turnBalanceResult.afterBasic | formateMoney}}元,赠送余额：{{ turnBalanceResult.afterGive | formateMoney}}元)</span>
                </div>
            </div>
        </div>
        <div class="bottom-btn-warp">
            <el-button @click="back()" class="common-btn">取消</el-button>
            <el-button class="common-btn" @click="submit" v-if="isshow && confirmCardShow" type="primary">确定</el-button>
        </div>

        <!-- dialog -->
        <el-dialog title="请输入密码" :visible.sync="dialogFormVisible" width='40%' :close-on-click-modal='false'>
            <div class="row-line-center">
                <el-input v-model="password" type="password" ref="tagInput"></el-input>
                <el-button
                style="margin-left:.5vw"
                class="common-btn" 
                @click="_secKeyBoard">启动密码输入</el-button>
            </div>
            <div slot="footer">
            <el-button @click="dialogFormVisible = false" class="common-btn">取 消</el-button>
            <el-button type="primary" @click="getInfo" class="common-btn">确 定</el-button>
            </div>
        </el-dialog>
    </div>
    
</template>
<script>
import CardReading from "./components/cardReading";
import { mapState, mapGetters  } from "vuex";
import { memeberApi , MemberAjax} from "src/http/memberApi";
import { secKeyBoard ,readCard ,routerJump , statusDeter, cardStatusCN} from './util/utils'
export default {
    data(){
        return {
            cardReadingTitle:'会员卡',
            searchError: {
                cardName: "",
                cardType: ""
            },
            secondCardError:{
                cardName: "",
                cardType: ""
            },
            isshow:false,
            password:'',//旧卡密码
            firstCardInfo:null,
            secondCardInfo:null,
            turnBalanceResult:null,//转出结果存放
            firstCardShow:false,//转出卡信息展示
            secondCardShow:false,//转入卡信息
            confirmCardShow:false,//确认信息
            secondCardNum:'',//第二张卡号
            dialogFormVisible:false,
            cardInfo:null,
        }
    },
    computed:{
        ...mapState(["member",'config']),
        ...mapGetters(['tenantId','operator'])
    },
    watch:{
        'member.memberCardInfo':{
            handler:function(val){
                if(val.cardTypeCode === 'times_card' || val.cardTypeCode === 'month_card' || val.cardTypeCode === 'gift_card'){
                    Vue.prototype.$message.warning(`${val.cardType}不可此操作`);
                    this.member.isshow = false;
                    return;
                }
                if(routerJump.call(this,val.cardNo,val.phoneNumber)){
                    if(statusDeter.call(this,true,'normal',`该卡状态为${cardStatusCN(this.member.cardState)},不许余额结转`)){
                        this.firstCardInfo = val;
                        this.firstCardShow = true;
                        this.trunBalance();
                    }
                }
            },  
            immediate:false
        }
    },
    filters:{
        formateMoney:function(val){
            return !!val ? Number(val).toFixed(2) : '0.00';
        }
    },
    methods:{
        queryData(data) {
            this.cardInfo = data;
            this.open(data);
        },
        //启动密码输入
        _secKeyBoard(){
            this.$refs.tagInput.focus();
            if(JSON.parse(localStorage['globalAppState']))
            this.member.show = true;
            secKeyBoard(this.config.configData).then((e)=>{
                this.password = e;
                this.member.show = false;
                this.getInfo()
            }).catch(err=>{
                this.member.show = false;
            })
        },
        async open(data) {
            this.password = '';
            this.dialogFormVisible = true;
            await this.$nextTick();
            this.$refs.tagInput.focus();
        },
        getInfo(){
            this.firstCardShow = false;
            this.firstCardInfo = '';
            this.confirmCardShow = false;
            var queryList = {
            url: memeberApi.getCardInfoByNo["url"],
            params: {   
                    cardNo: this.cardInfo.phoneOrCard, 
                    tenantId: this.tenantId,
                    password:this.$md5(this.password),       
                    verifyPassword:true
                    }
                };
            this.$store.dispatch("getInfo", queryList);
            this.dialogFormVisible = false;
        },
        trunBalance(){
            if(!!this.cardInfo && this.secondCardNum.trim() === this.cardInfo.phoneOrCard){
                this.$message.warning('不能与转出卡号一致，请更换一张卡');
                return;
            }
            if(this.firstCardInfo && this.secondCardInfo){
                var params = {
                    tenantId:this.tenantId,
                    newCardNo:this.secondCardInfo['cardNo'],
                    oldCardNo:this.firstCardInfo['cardNo']
                }
                MemberAjax.carryOverTrial(params).then(res=>{
                    if(res.code === 200){
                        this.turnBalanceResult = res.data;
                        this.confirmCardShow = true;
                        this.isshow = true;
                    }
                })
            }
        },
        submit(){
            let data =Object.assign({},{
                channel:this.firstCardInfo['channelName'],
                newCardNo:this.secondCardInfo['cardNo'],
                oldCardNo:this.firstCardInfo['cardNo'],
                operator:this.operator,
                passwd:this.$md5(this.password),//转出卡密
                tenantId:this.tenantId,
                turnIntegral:0//是否结转积分 1、是 0、否
            },JSON.parse(sessionStorage['payParams']))
            let queryList = {
                url:memeberApi.carryOver['url'],
                data:data,
                router: this.$router
            }
            this.$store.dispatch('handleHttp',queryList)
        },
        back(){
            this.$router.go(-1)
        },
        readCard(){
            readCard(this.config.configData).then(res =>{
                this.secondCardNum = res.replace(/\,| \，/g,'');
                this.validatorInp();
            })
        },
        validatorInp(){
            this.secondCardShow = false;
            this.secondCardInfo = '';
            this.confirmCardShow = false;
            let carNum = this.secondCardNum.trim()
            if(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(carNum)){
                this.$message.warning('请输入正确会员卡号')
                return;
            }
            var data = { cardNo: carNum, tenantId: this.tenantId ,verifyPassword: false}
            MemberAjax.getCardInfoByNo(data).then(res => {
                if(res.code === 200 && res.data){
                    if(res.data.status !== 'normal' || res.data.cardTypeCode !== 'stored_card'){
                        this.$message.warning('请检查卡是否正常或为储值卡');
                        return;
                    }
                    if(routerJump.call(this,res.data.cardNo,res.data.phoneNumber)){
                        this.secondCardInfo = res.data;
                        this.secondCardShow = true;
                        this.trunBalance();
                    }
                }else{
                    this.$message.warning(res.msg)
                }
                this.dialogFormVisible = false;
            }).catch((err)=>{
                // this.$message.warning(err.mag)
                this.dialogFormVisible = false;
            })
        }
    },
    components:{
        CardReading
    }
}
</script>
<style lang='scss' scoped>

.trun-out-card{
    padding-top:2vw;
    .first-card-info{
        display:flex;
        flex-wrap:wrap;
        padding-left:2vw;
        .first-card-item{
            width:30vw;
            margin-top: 2vh;
            font-size:$font-size12;
            label,em{
                font-size:$font-size12;
            }
        }
    }
}
.confirm-info{
    .info-content{
        padding-top:2vh;
        padding-left:2vw;
        .before{
            margin-bottom:2vh
        }
    }
    .line-btn{
        display:inline-block;
        width:10vw;
        height:6vh;
        font-size:$font-size12;
        border:1px dashed rgba(64, 120, 246, 1);
        line-height:6vh;
        text-align:center;
        color:rgba(64, 120, 246, 1);
        margin-right:1.5vw;
        +span{
            font-size:$font-size12
        }
    }
}
  .iskeyBoard{
    display:inline-block;
    margin-left:1vw;
}
.row-line-center{
    justify-content:center
}
</style>

