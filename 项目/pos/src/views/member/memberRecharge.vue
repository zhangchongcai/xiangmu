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
      label-width="100px"
      class="demo-ruleForm"
      style="width: 98vw;">
      <div class="require-cardNo">
        <el-form-item prop="cardNo"></el-form-item>
      </div>
      <div v-show="isshow" style="position:relative;margin-top:-22px">
        <div class="recharge-info-title">会员充值</div>
        <div class="select-warp-padding" v-if="activeShow">
          <moreSelectOne
            @selectData="selectData"
            ref="moreSelectOne"
            :dataListAll="dataListAll"
            model="coupon"
          />
        </div>

        <div class="price-warp">
          <div class="price-warp-title">不参与活动，其他充值金额：</div>
          <el-row style="margin-top:1.3vh">
            <el-col :span="5">
              <div class="price-warp-input">
                <el-form-item :prop="basicAmountProp">
                  <el-input style="width:17.6vw" :disabled="isinput" v-model="ruleForm.basicAmount" @input="input(ruleForm.basicAmount)"></el-input> 元
                  <!-- <span
                  class="span-price">元</span>-->
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-radio-group v-model="ruleForm.basicAmount" style="display:flex">
                  <div style="margin-left: 10px;" class="raido-border-none">
                    <el-radio-button :disabled="isinput" :label="!!chargeMin ? chargeMin : 50"></el-radio-button>
                  </div>
                  <div
                    style="margin-left: 10px;"
                    class="raido-border-none"
                    v-if="!chargeMax || (chargeMax >= 100)"
                  >
                    <el-radio-button :disabled="isinput" label="100"></el-radio-button>
                  </div>
                  <div
                    style="margin-left: 10px;"
                    class="raido-border-none"
                    v-if="!chargeMax || (chargeMax >= 200)"
                  >
                    <el-radio-button :disabled="isinput" label="200"></el-radio-button>
                  </div>
                  <div
                    class="myfont"
                  >（单次充值限额:{{chargeMin | firstChargeMin}}元—{{chargeMax | firstChargeMax}}元）</div>
                </el-radio-group>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="pay">
          <el-form-item label="支付方式：" prop="payWayCode">
            <el-radio-group v-model="ruleForm.payWayCode">
              <el-radio label="cash">现金</el-radio>
              <el-radio label="alimicropay">支付宝</el-radio>
              <el-radio label="wxmicropay">微信</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="pay-type">
          <el-row>
            <el-col :span="7" v-if="false">
              <el-form-item label="支付模式：" prop="payMode">
                <el-radio-group v-model="ruleForm.payMode">
                  <el-radio label="连线支付">连线支付</el-radio>
                  <el-radio label="离线支付">离线支付</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="10" v-if="false">
              <div class="zhifupingzheng">
                <el-form-item label="条码：" prop="barCode">
                  <el-radio-group>
                    <el-input
                      class="input"
                      v-model="ruleForm.barCode"
                      placeholder="请使用条码抢扫描顾客手机上的条码"
                      style="width:20vw"
                    ></el-input>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </div>
        <el-dialog
        title="支付凭证---测试时显示"
        :visible.sync="centerDialogVisible"
        width="50%"
        center>
        <el-form-item label="支付凭证：" prop="barCode">
          <el-input v-model="ruleForm.barCode" placeholder="请输入支付凭证---测试显示"></el-input>
        </el-form-item>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="cardCharge" :loading="payLoading">{{payLoadingText}}</el-button>
        </span>
      </el-dialog>
      </div>
    </el-form>
    <div class="bottom-btn-warp">
      <el-button @click="back()">返回</el-button>
      <el-button class="submit" v-show="isshow && member.cardNoOrphoneNumState" @click="submit">确定</el-button>
    </div>
  </div>
</template>

<script>
import CardReading from "./components/cardReading";
import MemberIofo from "./components/memberInfo";
import MemberCardIofo from "./components/memberCardInfo";
import HoldingCardList from "./components/holdingCardList";
import { num10_999float2 } from "./util/validate.js";
import moreSelectOne from "./components/moreSelectOne.vue";
import { MemberAjax } from "src/http/memberApi.js";
import { mapState, mapGetters } from "vuex";
import { back , cardStatusCN ,payPolling,stopPay} from './util/utils'
export default {
  data() {
    return {
      payTimer:null,
      centerDialogVisible:false,
      payLoading:false,
      payLoadingText:'支 付',
      isinput: false, //充值金额可否输入
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
      basicAmountProp: "basicAmount",
      cardstate:['normal'],
      ruleForm: {
        basicAmount: "", //充值金额
        payWayName: "", //支付方式
        payWayCode: "", //支付code  ali支付宝 wx 微信
        cardNo: "", //卡号
        payMode: "", //支付模式
        barCode: "", //支付条码
        activityId: "", //营销活动ID
        activityName: "", //营销活动ID
        activityStatus: "", //营销活动ID
        mobileNum: "", //手机号
        cardProductId: "", //卡id
        channelNo: "" //渠道id
      },
      rules: {
        basicAmount: [
          { required: true, validator: num10_999float2, trigger: "change" }
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
    ...mapState(["member"]),
    ...mapGetters(['tenantId'])
  },
  watch:{
    'ruleForm.payWayCode':function(newVal,oldVal){
          this.ruleForm.payWayName = newVal === "wx" ? "微信" : "支付宝";
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
      this.queryData(this.$route.query);
    }
  },
  created() {
    this.getActivityList();
  },
  methods: {
    input(amount){
      this.$nextTick(()=>{
        this.ruleForm.basicAmount = (amount.match(/^\d*(\.?\d{0,2})/g)[0]) || ''
      })
    },
    getActivityList() {
      MemberAjax.getActivityList({ tenantId: this.tenantId, action: "charge" }).then(
        res => {
          var activeList = res.data;
          this.dataListAll = activeList;
          this.activeShow = true;
        }
      );
    },
    // 选中持有卡
    selectedCard(data) {
      console.log("所选择的持有卡", data);
      this.ruleForm.cardNo = data.cardNo;
      this.ruleForm.cardProductId = data.cardProductId;
      this.chargeMax = data.chargeMax;
      this.chargeMin = data.chargeMin;
      this.ruleForm.channelNo = data.channelNo;
      sessionStorage["chargeMin"] = data.chargeMin;
      sessionStorage["chargeMax"] = data.chargeMax;
    },
    // 点击查询按钮或敲回车
    back() {
      back(this)
    },
    submit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (!this.ruleForm.cardNo) {
            this.$message.warning("请选择一张储卡");
            return;
          }
          // this.cardCharge();
          this.centerDialogVisible = true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cardCharge() {
      var data =Object.assign({},this.ruleForm,{
          tenantId : this.tenantId,
          mobileNum : this.member.phoneNum
      },JSON.parse(sessionStorage['payParams']));
      MemberAjax.cardCharge(data).then(res => {
        if(res.code === 601){
          this.payLoadingText = '支付中...';
          this.payTimer = setInterval(()=>{
            payPolling.call(this,res.data)
          },2000)
        }else if (res.code == 200 && res.msg === "操作成功") {
          this.$message({
            message: res.msg,
            type: "success",
            onClose: () => {
              this.$router.push({
                path: "/member"
              });
            }
          });
        } else {
          this.$message.error(res.msg);
          stopPay.bind(this)();
        }
      });
    },
    //权益卡数据过滤
    filterData(arr) {
      if (arr) {
        return arr.filter((item, index) => {
          return item.cardTypeCode == "stored_card";
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
      console.log(data);
      if (data) {
        this.isinput = true;
        this.ruleForm.basicAmount = "";
        this.basicAmountProp = "";
        this.ruleForm.activityId = data.activityId;
        this.ruleForm.activityName = data.acticityName;
        this.ruleForm.activityStatus = data.acticityStatus;
      } else {
        this.isinput = false;
        this.ruleForm.activityId = "";
        this.ruleForm.activityName = "";
        this.ruleForm.activityStatus = "";
      }
    },
    queryData(data) {
      this.$refs['ruleForm'].resetFields();
      this.dataType = data.type;
      this.member.pageLoading = true;
      if (data.type == "phone") {
        // TODO 请求会员详情
        let params = { mobileNum: data.phoneOrCard, tenantId: this.tenantId , verifyCode:false,validateCode:''};
        MemberAjax.getInfoByPhone(params)
          .then(data => {
            this.member.pageLoading = false;
            var memberdata = data.data;
            this.memberInfo = memberdata;
            if (!memberdata) {
              this.isshow = false;
              this.$message.warning(data.msg);
              return;
            }
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
      } else if (data.type == "card") {
        // TODO 请求会员卡详情
        let params = { cardNo: data.phoneOrCard, tenantId: this.tenantId,verifyPassword:false };
        MemberAjax.getCardInfoByNo(params)
          .then(data => {
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
              }
              this.isshow = true;
            } else {
              this.isshow = false;
              this.memberCardInfo = '';
              this.$message.warning(`该卡已${cardStatusCN(info.status)},不能充值`);
              return;
            }
            this.memberCardInfo = info;
            this.isshow = true;
            this.chargeMax = info.chargeMax;
            this.chargeMin = info.chargeMin;
            this.ruleForm.cardNo = info.cardNo;
            this.ruleForm.mobileNum = info.phoneNumber;
            this.ruleForm.cardProductId = info.cardProductId;
            this.ruleForm.channelNo = info.channelNo;
            sessionStorage["chargeMin"] = info.chargeMin;
            sessionStorage["chargeMax"] = info.chargeMax;
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
  beforeDestroy(){
      stopPay.bind(this)();
  },
  watch: {
    "centerDialogVisible"(newval){
      if(!newval){
        stopPay.bind(this)();
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
  padding-bottom: 7vh;
  position: relative;
  ._member-info {
    margin-bottom: 1vh !important;
  }
  .pay {
    padding-left: 2vw;
    .el-form-item__label {
      color: #333333;
      font-size: $font-size13;
      text-align: left !important;
      width: auto !important;
    }
    .el-radio__label {
      color: #333333;
      font-size: $font-size13;
    }
    .el-form-item__error {
      top: 26%;
      left: auto;
      right: 30vw;
    }
    .el-form-item {
      margin-bottom: 0px !important;
    }
    .zhifupingzheng {
      .el-form-item__label {
        font-family: MicrosoftYaHei;
        font-size: $font-size13 !important;
        color: #666666;
        letter-spacing: 0;
        text-align: left !important;
        width: auto !important;
      }
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
  .pay-type {
    padding-left: 2vw;
    .el-form-item__label {
      color: #333333;
      font-size: $font-size13;
      text-align: left !important;
      width: auto !important;
    }
    .el-radio__label {
      color: #333333;
      font-size: $font-size13;
    }
    .el-form-item {
      margin-bottom: 0px !important;
    }
    .zhifupingzheng {
      .el-form-item__label {
        font-family: MicrosoftYaHei;
        font-size: $font-size13 !important;
        color: #666666;
        letter-spacing: 0;
        text-align: left !important;
        width: auto !important;
      }
      .input {
        width: 17.6vw;
        height: 4.2vh;
        input {
          // width: 17.6vw;
          height: 4.2vh;
        }
      }
    }
  }
  .member-recharge-content {
    padding: 0 2vw 2.6vh 2vw;
  }
  .recharge-info-title {
    font-size: $font-size14;
    color: #333;
    font-weight: bold;
    text-indent: 2vw;
  }
  .select-warp-padding {
    padding-left: 2vw;
    padding-top: 1vw;
  }
  .myfont {
    font-size: $font-size13;
    height: 40px;
    line-height: 40px;
    font-family: MicrosoftYaHei;
    font-size: 13px;
    color: #3b74ff;
    letter-spacing: 0;
    text-indent: 10px;
  }
  .price-warp {
    position: relative;
    padding-left: 2vw;
    margin-top: 2.6vh;
    .raido-border-none {
      .el-radio-button {
        border: none !important;
        outline: none !important;
      }
    }
    input {
      width: 17.6vw;
      height: 4.2vh;
    }
    .price-warp-title {
      font-family: MicrosoftYaHei;
      font-size: $font-size13;
      color: #333333;
      letter-spacing: 0;
    }
    .el-radio-button__inner {
      height: 4.2vh;
      line-height: 4.2vh;
      padding-top: 0px;
      padding-bottom: 0px;
      margin-top: 5px;
    }
    .price-warp-input {
      .el-form-item__content {
        margin-left: 0 !important;
      }
      .span-price {
        height: 40px;
        line-height: 40px;
        margin-left: 10px;
        font-family: MicrosoftYaHei;
        font-size: $font-size12;
        color: #666666;
        letter-spacing: 0;
        text-align: center;
      }
    }
  }
}
</style>
