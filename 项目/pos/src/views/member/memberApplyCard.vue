<template>
  <div class="_member-apply-card">
    <div class="member-home-title">开卡</div>
    <div style="position:relative">
      <CardReading @queryData="queryData"/>
      <div v-show="ruleForm.cardName && member.cardNoOrphoneNumState" class="cardNoNameStyle">
        <span v-text="ruleForm.cardType"></span>
        <span style="margin-left:2vw" v-text="'卡政策：'+ruleForm.cardName"></span>
      </div>
    </div>
    <el-form 
      @submit.native.prevent 
      :model="ruleForm" 
      :rules="rules" 
      ref="ruleForm" 
      label-width="100px" 
      class="demo-ruleForm"
      v-show="member.cardNoOrphoneNumState"
      >
      <!-- v-loading="loading" -->
      <div v-show="ruleForm.cardProductId">
        <div class="member-info-title">会员资料</div>
        <div class="member-info-content">
          <el-row>
            <el-col :span="11" v-if="requireShow('user_name')">
              <div class="grid-content bg-purple">
                <el-form-item label="姓名：" prop="name">
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="11" v-if="requireShow('sex')">
              <div class="grid-content bg-purple-light el-radio-group-style">
                <el-form-item label="性别：" prop="sex">
                  <el-radio-group v-model="ruleForm.sex">
                    <el-radio label="male">男</el-radio>
                    <el-radio label="female">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="11" v-if="requireShow('phone_number')">
              <div class="grid-content bg-purple">
                <el-form-item label="手机号码：" prop="mobileNum">
                  <el-input v-model="ruleForm.mobileNum"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="11" v-if="requireShow('email')">
              <div class="grid-content bg-purple-light">
                <el-form-item label="电子邮箱：" prop="email">
                  <el-input v-model="ruleForm.email"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="11" v-if="requireShow('id_card')">
              <div class="grid-content bg-purple">
                <el-form-item label="身份证号：" prop="creditNum">
                  <el-input v-model="ruleForm.creditNum"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="11" v-if="requireShow('birthday')">
              <div class="grid-content bg-purple-light applcard_time">
                <el-form-item label="生日：" prop="birthday">
                  <el-date-picker v-model="ruleForm.birthday" format="yyyy-MM-dd" type="date" placeholder="选择日期时间" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="11">
              <div class="grid-content bg-purple" style="position:relative">
                <el-form-item label="消费密码：" prop="consumePassword">
                  <el-input type="password" v-model="ruleForm.consumePassword"></el-input>
                </el-form-item>
                <div class="password">
                  <button @click="startKeyBorad">启动密码输入</button>
                </div>
              </div>
            </el-col>
            <el-col :span="11">
              <div class="grid-content bg-purple-light">
                <el-form-item label="ID物理卡号：">
                  <el-input v-model="ruleForm.realCardNo"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

        </div>
        <div class="member-info-title">收费充值</div>
        <div class="member-info-content">
          <el-row v-if="ruleForm.cardType != '联名卡' && ruleForm.cardType != '权益卡'">
            <el-col :span="7">
              <div class="grid-content bg-purple-light">
                  <el-form-item label="充值金额：" prop="basicAmount">
                  <el-input v-model="ruleForm.basicAmount" @input="input(ruleForm.basicAmount)"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="1">
              <div style="height:40px;line-height: 40px;">元</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-radio-group v-model="ruleForm.basicAmount" style="display:flex">
                  <div style="margin-left: 10px;">
                    <el-radio-button :label="!!ruleForm.chargeMin ? ruleForm.chargeMin : 50"></el-radio-button>
                  </div>
                  <div style="margin-left: 10px;" v-if="!ruleForm.chargeMax && (ruleForm.chargeMax >= 100)">
                    <el-radio-button label="100"></el-radio-button>
                  </div>
                  <div style="margin-left: 10px;" v-if="!ruleForm.chargeMax && (ruleForm.chargeMax >= 200)">
                    <el-radio-button label="200"></el-radio-button>
                  </div>
                  <div style="margin-left: 10px;" v-if="!ruleForm.chargeMax && (ruleForm.chargeMax >= 1000)">
                    <el-radio-button label="1000"></el-radio-button>
                  </div>
                  <div class="myfont">（单次充值限额:{{ruleForm.chargeMin | firstChargeMin}}元—{{ruleForm.chargeMax | firstChargeMx}}元）</div>
                </el-radio-group>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <div style="padding-left:2vw">
                <span class="lable-font">{{member.cardTypeCode === 'equity_card' ? '权益卡售价':'开卡手续费'}}：</span><span class="lable-font2">{{ruleForm.openPrice | empty_Price}}元</span>
              </div>

            </el-col>
            <el-col :span="6">
              <span class="lable-font">应收金额：</span><span class="lable-font2">{{allPrice | empty_Price}}元</span>
            </el-col>
          </el-row>
        </div>
        <div class="select-warp-padding" v-if="activeShow">
          <moreSelectOne 
            @selectData="selectData"
            ref="moreSelectOne" 
            :dataListAll="dataListAll"/>
        </div>
        <div class="pay" v-if="allPrice != 0">
          <el-form-item label="支付方式：" prop="payWayCode">
            <el-radio-group v-model="ruleForm.payWayCode">
              <el-radio label="cash">现金</el-radio>
              <el-radio label="alimicropay">支付宝</el-radio>
              <el-radio label="wxmicropay">微信</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
    </el-form>
      <div class="bottom-btn-warp">
        <el-button @click="back()" class="button">返回</el-button>
        <el-button v-show="ruleForm.cardProductId" @click="clearRuleForm()">清空</el-button>
        <el-button v-show="ruleForm.cardProductId" @click="submit" type="primary">确定</el-button>
      </div>

    <pay-loading v-model="ruleForm.barCode" :visible.sync="centerDialogVisible"></pay-loading>
  </div>
</template>

<script>
import moreSelectOne from "./components/moreSelectOne.vue";
import CardReading from "./components/cardReading";
import { formatDate } from "./util/formatDate.js";
import { MemberAjax, memeberApi} from "http/memberApi";
import { creditNum, num10_999float2 ,customPasswordReg ,validateMobile,validateEmail ,validateName} from "./util/validate.js";
import {mapState, mapGetters} from 'vuex'
import { readCard ,secKeyBoard } from './util/utils';
import payMixins from './mixins/payMixins'
export default {
  mixins:[payMixins], //支付
  components: {
    moreSelectOne,
    CardReading
  },
  data() {
    return {
      mustFill: [], //开卡必填项
      ruleForm: {
        name: "", //姓名
        mobileNum: "", //手机号
        email: "", //邮箱
        creditNum: "", //身份号
        consumePassword: "", //密码
        cardNo: "", //会员卡号
        basicAmount: "", //充值金额
        realCardNo: "", //物理卡号
        activityId: "", //营销活动ID
        activityName: "", //营销活动ID
        activityStatus: "", //营销活动ID
        sex: "", //性别
        payWayCode: "", //支付方式名称
        cardType: "", //会员卡类型
        cardProductId: "", //卡政策ID
        cardName: "", //卡政策
        birthday: "", //生日yyyy-MM-dd,
        openPrice: "", //开卡手续费,
        chargeMax: "", //充值最大值
        chargeMin: "", //充值最小值
        price:"" ,//权益卡开卡金额
        barCode:''
      },
      rules: {
        name: [
          { required: true, message: "姓名必填", trigger: "change" },
          { validator: validateName, trigger: 'change' }
        ],
        mobileNum: [
          { required: true, message: "手机号必填", trigger: "change" },
          { max: 11, validator: validateMobile, trigger: 'change' }
        ],
        email: [
          { required: true, message: "邮箱必填", trigger: "change" },
          {validator: validateEmail, trigger: "change"}
        ],
        creditNum: [
          { required: true, validator: creditNum, trigger: "change" }
        ],
        consumePassword: [
          { required: true, message: '密码不能为空，请输入密码', trigger: "change" },
          { min:6,max:6, validator: customPasswordReg, trigger: "change",passwordkType:''}
        ],
        basicAmount: [
          { required: true, validator: num10_999float2, trigger: "change" }
        ],
        realCardNo: [
          { required: true, message: "物理卡号必填", trigger: "change" }
        ],
        sex: [
          { required: true, message: "性别必填", trigger: "change" }
        ],
        payWayCode: [
          { required: true, message: "支付方式必填", trigger: "change" }
        ],
        birthday: [{ required: true, message: "生日必填", trigger: "change" }],
        barCode: [{ required: true, message: "支付凭证必填", trigger: "blur" }]
      },
      dataListAll:[],//获取优惠信息列表
      activeShow:false,//优惠活动组件显隐
      pickerOptions:{
            disabledDate(time){
                let _now = Date.now();
                return time.getTime() > _now;
　　　　　　　　　　　　　　//大于当前的禁止
            }
        }
    };
  },
  created() {
    this.getActivityList();
  },
  filters: {
    empty_Price: function(price) {
      var val = price ? price  : 0;
      return val.toFixed(2);
    },
    firstChargeMin(min){
      return !!min ? min.toFixed(2) : '10.00'
    },
    firstChargeMx(max){
      return !!max ? max.toFixed(2) : '999.00'
    }
  },
  computed: {
    ...mapState(['member','config']),
    ...mapGetters(['tenantId']),
    allPrice() {
      var allPrice =
        this.ruleForm.openPrice - 0 + (this.ruleForm.basicAmount - 0);
      return allPrice;
    }
  },
  methods: {
    input(amount){
      this.$nextTick(()=>{
        this.ruleForm.basicAmount = (amount.match(/^\d*(\.?\d{0,2})/g)[0]) || ''
      })
    },
    clearRuleForm() {
      this.$refs["ruleForm"].resetFields();
      this.$refs["moreSelectOne"].reset();
    },
    back() {
      this.$router.go(-1);
    },
    requireShow(name) {
      return this.mustFill.indexOf(name) != -1;
    },
    handleSubmit() {
      var data = Object.assign({},this.ruleForm,{
        tenantId:this.tenantId,
        birthday:!!this.ruleForm.birthday ? new Date(this.ruleForm.birthday).formatDate('yyyy-MM-dd') : '',
        consumePassword:this.$md5(this.ruleForm.consumePassword),
      },JSON.parse(sessionStorage['payParams']));
      return {
        url: memeberApi.bindCardAndCharge["url"],
        data: data,
        router: this.$router
      }
    },    
    selectData(data) {
      console.log(data, "返回值");
      if (data) {
        this.ruleForm.activityName = data.acticityName;
        this.ruleForm.activityId = data.activityId;
        this.ruleForm.activityStatus = data.acticityStatus;
      } else {
        this.ruleForm.activityName = "";
        this.ruleForm.activityId = "";
        this.ruleForm.activityStatus = "";
      }
    },
    queryData(data) {
      this.$refs['ruleForm'].resetFields();
      this.ruleForm.cardNo = data.phoneOrCard;
    },
    getActivityList() {
      MemberAjax.getActivityList({ tenantId: this.tenantId, action: "MEMBER_ACTIVE_CARD" ,channelNo:localStorage['channelNo'],cinemaId:localStorage['cinemaId']}).then(res => {
        var activeList = res.data;
        this.dataListAll = activeList;
        this.activeShow = true;
      });
    },
    applyCardNoInfo(cardNo) {
      this.member.pageLoading = true;
      MemberAjax.applyCardNoInfo({ cardNo: cardNo, tenantId: this.tenantId }).then(res => {
        this.member.pageLoading = false;
        if (!res.data) {
          this.ruleForm.cardName = "查询无结果";
          this.ruleForm.cardType = "查询无结果";
          this.ruleForm.cardProductId = '';
          this.$message.error(res.msg)
        } else {
          var res = res.data;
          if (res.isBinding) {
            this.$message.warning("此卡已绑定");
            this.ruleForm.cardProductId = '';
          } else {
            if(res.cardType === '联名卡' || res.cardTypeCode === 'cobranded_card'){
              this.$message.warning('联名卡暂不支持开卡');
              return;
            }
            if(res.cardTypeCode === 'equity_card'){
              this.ruleForm.openPrice = res.price;
            }else{
              this.ruleForm.openPrice = res.openPrice; //开卡
            }
            this.member.cardTypeCode = res.cardTypeCode;
            this.ruleForm.cardProductId = res.id;
            this.ruleForm.cardName = res.cardName;
            this.ruleForm.cardType = res.cardType;
            this.ruleForm.chargeMax = res.chargeMax;
            this.ruleForm.chargeMin = res.firstChargeMin;
            this.mustFill = res.mustFill;
            this.rules['consumePassword'][1]['passwordkType'] = res.weakPassword    //是否为若类型密码格式
            sessionStorage['chargeMin'] = res.firstChargeMin;
            sessionStorage['chargeMax'] = res.chargeMax;
          }
        }
      }).catch(err => {
        this.member.pageLoading = false;
      });
    },
    startKeyBorad(){
      if(JSON.parse(localStorage['globalAppState'])){
        this.member.show = true;
      }
      secKeyBoard(this.config.configData).then((re)=>{
        this.ruleForm.consumePassword = re;
        this.member.show = false;
      }).catch(err=>{
         this.member.show = false;
      })
    }
  },
  watch: {
    "ruleForm.cardNo"(newval, oldval) {
      this.applyCardNoInfo(newval);
    },
  }
};
</script>

<style lang="scss" scope>
._member-apply-card {
  min-width: 1024px;
  position: relative;
  .el-form-item__label {
    width: 11vw !important;
  }
  .el-form-item__content {
    margin-left: 11vw !important;
  }
  .cardNoNameStyle {
    position: absolute;
    padding: 2.7vh 2vw;
    width: 39.4vw;
    right: 0px;
    top: 0px;
    height: 40px;
    line-height: 40px;
    span {
      font-family: MicrosoftYaHei;
      font-size: $font-size13;
      color: #666666;
      letter-spacing: 0;
    }
  }
  .el-radio-group-style {
    .el-radio-group {
      height: 40px;
      line-height: 44px;
    }
    .el-form-item__error {
      top: 50%;
      left: 12vw;
      transform: translateY(-80%);
    }
  }
  .password {
    position: absolute;
    right: 4vw;
    top: 0;
    height: 40px;
    width: 11.7vw;
    button {
      height: 40px;
      width: 11.7vw;
      cursor: pointer;
      line-height: 40px;
      border: none;
      background: #ffffff;
      border: 1px solid #3b74ff;
      border-radius: 2px;
      border-radius: 2px;
      color: #3b74ff;
    }
  }
  .member-info-title {
    font-size: $font-size14;
    color: #333;
    font-weight: bold;
    text-indent: 2vw;
  }
  .member-info-content {
    padding: 2vw 0vw;
    .el-input {
      width: 17.6vw;
    }
    .el-input__inner {
      width: 17.6vw;
    }
  }

  .el-form-item__label {
    font-size: $font-size13;
    color: #666666;
  }
  .pay {
    margin-top: 1%;
    .el-form-item__label {
      color: #333333;
    }
    .el-form-item__error {
      top: 26%;
      left: auto;
      right: 30vw;
    }
  }
  .select-warp-padding {
    padding-left: 2vw;
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
  .lable-font {
    font-family: MicrosoftYaHei;
    font-size: $font-size13;
    color: #666666;
    letter-spacing: 0;
  }
  .lable-font2 {
    font-family: Arial-BoldMT;
    font-size: $font-size13;
    color: #ff7b03;
    letter-spacing: 0;
  }
}
</style>