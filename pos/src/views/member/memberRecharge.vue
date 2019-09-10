<template>
  <div class="_member-recharge">
    <div class="member-home-title">充值</div>
    <CardReading @queryData="queryData" :cardReadingTitle="cardReadingTitle" :isApply="isApply"/>
    <div class="member-recharge-content" v-if="memberInfo && dataType == 'phone' && member.cardNoOrphoneNumState">
      <MemberIofo :memberInfo="memberInfo" :isSingleQuery="false"/>
      <HoldingCardList
        @selectedCard="selectedCard"
        :memberCardList="memberInfo.memberCardList"
        :isSelected='true'
      />
      <!-- :isSelected="true" -->
    </div>
    <div class="member-recharge-content" v-if="memberCardInfo && dataType == 'card' && member.cardNoOrphoneNumState">
      <MemberCardIofo :memberCardInfo="memberCardInfo" :isSingleQuery="false"/>
    </div>
    <el-form
      v-show="member.cardNoOrphoneNumState"
      @submit.native.prevent
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
      style="width: 98vw;">
      <div v-show="isshow" style="position:relative">
        <div class="member-info-title">会员充值</div>
        <div class="price-warp">
          <div class="price-warp-title">充值金额：</div>
          <el-row style="margin-top:1vh" class="row-line-center">
            <el-col :span="9">
              <div class="price-warp-input">
                <el-form-item prop="basicAmount">
                  <el-input v-model="ruleForm.basicAmount" @input="input(ruleForm.basicAmount)"></el-input> 元
                  <el-button 
                  class="common-btn" 
                  style="margin-left:1vw"
                  @click="getActive" 
                  :loading="isGetActiveList"
                  :disabled="isGetActiveBtn">获取活动</el-button>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <el-radio-group v-model="ruleForm.basicAmount" class="price-btn-group">
                <div style="margin-left: 10px;" class="raido-border-none" v-show="chargeMin && chargeMin < 100">
                  <el-radio-button :label="!!chargeMin ? chargeMin : 50"></el-radio-button>
                </div>
                <div
                  style="margin-left: 10px;"
                  class="raido-border-none"
                  v-if="!!chargeMax && (chargeMax >= 100)"
                >
                  <el-radio-button label="100"></el-radio-button>
                </div>
                <div
                  style="margin-left: 10px;"
                  class="raido-border-none"
                  v-if="!!chargeMax && (chargeMax >= 200)"
                >
                  <el-radio-button label="200"></el-radio-button>
                </div>
                <div class="myfont">（单次充值限额:{{chargeMin | firstChargeMin}}元—{{chargeMax | firstChargeMax}}元）</div>
              </el-radio-group>
            </el-col>
          </el-row>
        </div>
        <div class="select-warp-padding" v-if="activeShow">
          <div class="price-warp-title">可参与活动：</div>
          <moreSelectOne
            @selectData="selectData"
            ref="moreSelectOne"
            :dataListAll="dataListAll"
            model="coupon"/>
        </div>
        <div class="pay">
          <el-form-item label="支付方式：" prop="payWayCode">
            <el-radio-group v-model="ruleForm.payWayCode">
              <el-radio :label="item.label" v-for="(item,index) in payWayCode" :key="index">{{item.value}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="bottom-btn-warp">
      <el-button class="common-btn" @click="back()" v-text="isshow && member.cardNoOrphoneNumState ? '取消' : '返回'"></el-button>
      <el-button class="common-btn" v-show="isshow && member.cardNoOrphoneNumState" @click="submit" type="primary">确定</el-button>
    </div>

    <pay-loading 
      v-model="ruleForm.barCode" 
      :visible.sync="centerDialogVisible" 
      :payMethod='ruleForm.payWayCode'></pay-loading>
  </div>
</template>

<script>
import CardReading from "./components/cardReading";
import MemberIofo from "./components/memberInfo";
import MemberCardIofo from "./components/memberCardInfo";
import HoldingCardList from "./components/holdingCardList";
import { num10_999float2 } from "./util/validate.js";
import moreSelectOne from "./components/moreSelectOne.vue";
import { MemberAjax ,memeberApi} from "src/http/memberApi.js";
import { mapState, mapGetters } from "vuex";
import { back , cardStatusCN ,GenNonDuplicateID ,routerJump } from './util/utils';
import payMixins from './mixins/payMixins';
export default {
  mixins:[payMixins],
  data() {
    return {
      cardReadingTitle: "会员卡/手机号：",
      isApply: false,
      dataType: "phone",
      memberInfo: "",
      memberCardInfo: "",
      isshow: false,
      chargeMax: "", //充值对大金额
      chargeMin: "", //充值对小金额
      dataListAll: [], //获取优惠信息列表
      activeShow: false, //优惠活动组件显隐
      cardstate:['normal'],
      levelId:'',//等级id
      isGetActiveList:false,
      isReset:false,//重置金额取消选中活动
      isGetActiveBtn:true,
      ruleForm: {
        basicAmount: "", //充值金额
        payWayName: "", //支付方式
        payWayCode: "", //支付code 
        cardNo: "", //卡号
        payMode: "", //支付模式
        barCode: "", //支付条码
        activityId: "", //营销活动ID
        activityName: "", //营销活动ID
        couponAmount:"",//数量
        couponApplyCode:"",
        presentMoney:'',
        presentPoint:'',
        couponApplyCodeLabel:"",
        mobileNum: "", //手机号
        cardProductId: "", //卡id
      },
      rules: {
        basicAmount: [
          { required: true, message: "充值金额必填", trigger: "change" },
          { validator: num10_999float2, trigger: "change" }
        ],
        payWayCode: [
          { required: true, message: "支付方式必填", trigger: "change" }
        ],
        payMode: [
          { required: true, message: "支付模式必填", trigger: "change" }
        ],
        barCode: [{ required: false, message: "请输入条码", trigger: "change" }],
        cardNo: [{ required: true, message: "储蓄卡必选", trigger: "change" }]
      }
    };
  },
  computed: {
    ...mapState(["member","config"]),
    ...mapGetters(['tenantId'])
  },
  watch:{
    'ruleForm.payWayCode':function(newVal,oldVal){
      switch(newVal){
        case 'WXPAY':
          this.ruleForm.payWayName = '微信支付码付款';
          break;
        case 'ALIPAY':
          this.ruleForm.payWayName = '支付宝支付码付款';
          break;
        default :
          this.ruleForm.payWayName = '现金';
      }
    },
    'ruleForm.basicAmount':function(value){
          this.activeShow = false;
          this.isReset = true;
          this.isGetActiveBtn = !(this.chargeMin <= value &&  value <= this.chargeMax);
          this.resetActive()
      }
  },
  filters:{
    firstChargeMin(min){
      return !!min ? min.toFixed(2) : '10.00'
    },
    firstChargeMax(max){
      return !!max ? max.toFixed(2) : '999.00'
    }
  },
  mounted() {
    if (this.$route.query.phoneOrCard) {
      let query = Object.assign({},{type:'card'},this.$route.query);
      this.member.numberType = query.type;
      this.member.cardNo = query.phoneOrCard;
      this.member.cardNoOrphoneNumState = true;
      this.queryData(query);
    }
  },
  methods: {
    input(amount){
      this.$nextTick(()=>{
        this.ruleForm.basicAmount = (amount.match(/^\d*(\.?\d{0,2})/g)[0]) || ''
      })
    },
    //获取营销列表
    getActivityList() {
      this.isGetActiveList = true;
      let params = {
          cardNo:this.member.cardNo,
          tenantId: this.tenantId,
          action: "MEMBER_ADD_AMOUNT",
          channelNo:localStorage['channelNo'],
          cinemaId:localStorage['cinemaId'],
          cinemaCode:localStorage['cinemaCode'],
          cardProductId:this.ruleForm.cardProductId,
          cardTypeCode:this.member.cardTypeCode,
          levelId:this.levelId,
          chargeAmount:this.ruleForm.basicAmount,
          birthday:this.memberCardInfo.birthday && this.memberCardInfo.birthday.split(' ')[0] || '',
          totalChargeAmount:this.memberCardInfo.totalChargeAmount || '',
          createTime:this.memberCardInfo.createTime && this.memberCardInfo.createTime.split(' ')[0] || '',
          totalConsumeAmount:this.memberCardInfo.totalConsumeAmount || ''
      }
      MemberAjax.getActivityList(params).then(
        res => {
          var activeList = res.data || [];
          this.dataListAll = activeList;
          this.activeShow = true;
          this.isGetActiveList = false;
        }
      ).catch(err => {
        this.isGetActiveList = false;
      });
    },
    // 选中持有卡
    selectedCard(data) {
      if(data.cardNo !== this.member.cardNo){
        this.activeShow = false;
      }
      console.log("所选择的持有卡", data);
      this.ruleForm.cardNo = data.cardNo;
      this.ruleForm.cardProductId = data.cardProductId;
      this.chargeMax = data.chargeMax;
      this.chargeMin = data.chargeMin;
      sessionStorage["chargeMin"] = data.chargeMin;
      sessionStorage["chargeMax"] = data.chargeMax;
      this.member.cardNo = data.cardNo;
      this.member.cardState = data.status;
      this.member.cardTypeCode = data.cardTypeCode;
      this.memberCardInfo = data; 
    },
    // 点击查询按钮或敲回车
    back() { back(this) },
    handleSubmit() {
       var data =Object.assign({},this.ruleForm,{
          tenantId : this.tenantId,
          basicAmount: this.ruleForm.basicAmount,
          outFlowNo:GenNonDuplicateID(6)
      },JSON.parse(sessionStorage['payParams']));
      return {
        url: memeberApi.cardCharge["url"],
        data: data,
        router: this.$router
      }
    }, 
    //权益卡数据过滤
    filterData(arr) {
      if (arr) {
        return arr.filter((item, index) => {
          return item.cardTypeCode == "stored_card" && item.canCharge == 1;
        });
      } else {
        return [];
      }
    },
    _cardStatus(arr){
        //正常卡状态筛选
        if(!!this.cardstate && arr){
          let cardArr = [];
          (this.cardstate).forEach((v,i)=>{
            (this.filterData(arr)).filter((val,index) => {
              if(val.status === v){
                  cardArr.push(val) 
              } 
            })
          })
          return cardArr;
        }else{
          return this.filterData(arr)
        }
    },
    //活动选择数据暴露
    selectData(data) {
      if (data) {
        this.ruleForm = Object.assign({},this.ruleForm,data)
      } else {
        this.resetActive()
      }
    },
    //重置活动选择
    resetActive(){
        delete this.ruleForm.activityId; //营销活动ID
        delete this.ruleForm.activityName; //营销活动ID
        delete this.ruleForm.couponAmount;//票券数量
        delete this.ruleForm.couponApplyCode;//票券编码
        delete this.ruleForm.couponApplyCodeLabel;//票券名称
        delete this.ruleForm.presentMoney;//赠送金额
        delete this.ruleForm.presentPoint;//赠送积分数
        delete this.ruleForm.amount;
    },
    getActive(){
       if(!this.ruleForm.basicAmount){this.$message.warning('请先输入充值金额！');return;}
       this.getActivityList();  
    },
    queryData(query) {
      this.$refs['ruleForm'].resetFields();
      this.dataType = query.type;
      this.member.pageLoading = true;
      this.activeShow = false;
      if (query.type == "phone") {
        // TODO 请求会员详情
        let params = { mobileNum: query.phoneOrCard, tenantId: this.tenantId , verifyCode:false,validateCode:''};
        MemberAjax.getInfoByPhone(params)
          .then(data => {
            this.member.cardNo = '';
            this.member.pageLoading = false;
            var memberdata = data.data;
            this.memberInfo = memberdata;
            if (!memberdata) {
              this.isshow = false;
              this.$message.warning(data.msg);
              return;
            }
            this.levelId = memberdata.levelId;
            this.ruleForm.mobileNum = memberdata.mobileNum;
            memberdata.memberCardList = this._cardStatus(
              data.data.memberCardList
            );
            if (memberdata.memberCardList.length == 0) {
              this.isshow = false;
            } else {
              this.isshow = true;
            }
          })
          .catch(err => {
            this.isshow = false;
            this.member.pageLoading = false;
            console.log(err);
          });
      } else if (query.type == "card") {
        // TODO 请求会员卡详情
        let params = { cardNo: query.phoneOrCard, tenantId: this.tenantId,verifyPassword:false };
        MemberAjax.getCardInfoByNo(params)
          .then(data => {
            this.memberCardInfo = '';
            this.isshow = false;
            this.member.pageLoading = false;
            let info = data.data;
            if (!info) {
              this.$message.warning(data.msg);
              return;
            }
            if (info.status == "normal") {
              if(info.cardTypeCode !== 'stored_card'){
                this.$message.warning(info.cardType+'不能充值');
                return;
              }else if(info.canCharge == 0){
                this.memberCardInfo = info;
                this.$message.warning('该储值卡政策不可充值');
                return false;
              }
            } else {
              this.isshow = false;
              this.memberCardInfo = '';
              this.$message.warning(`该卡已${cardStatusCN(info.status)},不能充值`);
              return;
            }
            if(routerJump.call(this,info.cardNo,info.phoneNumber)){
              this.memberCardInfo = info;
              this.isshow = true;
              this.chargeMax = info.chargeMax;
              this.chargeMin = info.chargeMin;
              this.ruleForm.cardNo = info.cardNo;
              this.ruleForm.mobileNum = info.phoneNumber;
              this.ruleForm.cardProductId = info.cardProductId;
              this.member.cardTypeCode = info.cardTypeCode
              sessionStorage["chargeMin"] = info.chargeMin;
              sessionStorage["chargeMax"] = info.chargeMax;
              this.levelId = info.levelId;
            }
          })
          .catch(err => {
            this.isshow = false;
            this.member.pageLoading = false;
            this.memberCardInfo = '';
            console.log(err);
          });
      }
    }
  },
  components: {
    CardReading,
    MemberIofo,
    HoldingCardList,
    MemberCardIofo,
    moreSelectOne
  }
};
</script>
<style lang="scss">
._member-recharge {
  min-height: 93vh;
  position: relative;
  .pay {
    margin-top:1vh;
    .el-form-item__error {
      top: 26%;
      left: auto;
      right: 30vw;
    }
    .zhifupingzheng {
      .input {
        width: 17.6vw;
        height: 4.2vh;
        input {
          // width: 17.6vw;
          width: 100% !important;
          height: 4.2vh;
        }
      }
    }
  }
  .member-recharge-content {
    padding: 0 2vw 0vh 2vw;
  }
  .select-warp-padding {
    padding-left: 2vw;
    margin-top: 2.5vh;
  }
  .price-warp-title {
      font-size: $font-size12;
      color: #333;
      letter-spacing: 0;
    }
  .myfont {
    font-size: $font-size12;
    line-height: 4.2vh;
    color: #3b74ff;
    letter-spacing: 0;
    text-indent: 10px;
  }
  .price-warp {
    position: relative;
    padding-left: 2vw;
    margin-top: 1.5vh;
    .raido-border-none {
      .el-radio-button {
        border: none !important;
        outline: none !important;
      }
    }
    .price-warp-input {
      .el-form-item__content {
        margin-left: 0 !important;
        font-size:$font-size12;
      }
      .span-price {
        height: 40px;
        line-height: 40px;
        margin-left: 10px;
        font-size: $font-size12;
        color: #666666;
        letter-spacing: 0;
        text-align: center;
      }
    }
  }
  .el-form-item{
    margin-bottom:0
  }
}
</style>
