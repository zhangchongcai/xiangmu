<template>
  <div class="_member-apply-card">
    <div class="member-home-title">开卡/激活</div>
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
      class="demo-ruleForm"
      v-show="member.cardNoOrphoneNumState"
      >
      <!-- v-loading="loading" -->
      <div v-show="ruleForm.cardProductId">
        <div class="member-info-title">会员资料</div>
        <div class="member-info-content">
          <el-row>
            <el-col :span="11" v-if="requireShow('user_name')">
              <el-form-item label="姓名：" prop="name" class="row-line-center">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" v-if="requireShow('sex')">
              <el-form-item label="性别：" prop="sex" class="row-line-center">
                <el-radio-group v-model="ruleForm.sex">
                  <el-radio label="male">男</el-radio>
                  <el-radio label="female">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="11" v-if="requireShow('phone_number')">
              <el-form-item label="手机号码：" prop="mobileNum" class="row-line-center">
                <el-input v-model="ruleForm.mobileNum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" v-if="requireShow('email')">
              <el-form-item label="电子邮箱：" prop="email" class="row-line-center"> 
                <el-input v-model="ruleForm.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" v-if="requireShow('id_card')">
              <el-form-item label="身份证号：" prop="creditNum" class="row-line-center">
                <el-input v-model="ruleForm.creditNum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" v-if="requireShow('birthday')">
              <el-form-item label="生日：" prop="birthday" class="row-line-center">
                <el-date-picker v-model="ruleForm.birthday" format="yyyy-MM-dd" type="date" placeholder="选择日期时间" :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <div class="grid-content bg-purple row-line-center" style="position:relative">
                <el-form-item label="消费密码：" prop="consumePassword" class="row-line-center">
                  <el-input type="password" v-model="ruleForm.consumePassword"></el-input>
                </el-form-item>
                  <div class="password">
                    <button @click="startKeyBorad" class="start-btn">启动密码输入</button>
                  </div>
              </div>
            </el-col>
            <el-col :span="11">
              <el-form-item label="ID物理卡号：" class="row-line-center">
                <el-input v-model="ruleForm.realCardNo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </div>
        <div v-if="chargeBlock">
          <div class="member-info-title">收费充值</div>
          <div class="member-info-content">
            <el-row 
              v-if="ruleForm.cardType != '联名卡' && ruleForm.cardType != '权益卡' && ruleForm.cardType != '次卡' "
              class="row-line-center">
              <el-col :span="7">
                <el-form-item label="充值金额：" prop="basicAmount" class="row-line-center">
                  <el-input v-model="ruleForm.basicAmount" @input="input(ruleForm.basicAmount)"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <div style="height:2.5vw;line-height:2.5vw;font-size:1.04vw">&nbsp;&nbsp;元</div>
              </el-col>
              <el-col :span="16">
                  <el-radio-group v-model="ruleForm.basicAmount" class="price-btn-group">
                    <div style="margin-left: 10px;" v-show="ruleForm.chargeMin && ruleForm.chargeMin < 100">
                      <el-radio-button :label="!!ruleForm.chargeMin ? ruleForm.chargeMin : 50"></el-radio-button>
                    </div>
                    <div style="margin-left: 10px;" v-if="!!ruleForm.chargeMax && (ruleForm.chargeMax >= 100)">
                      <el-radio-button label="100"></el-radio-button>
                    </div>
                    <div style="margin-left: 10px;" v-if="!!ruleForm.chargeMax && (ruleForm.chargeMax >= 200)">
                      <el-radio-button label="200"></el-radio-button>
                    </div>
                    <div style="margin-left: 10px;" v-if="!!ruleForm.chargeMax && (ruleForm.chargeMax >= 1000)">
                      <el-radio-button label="1000"></el-radio-button>
                    </div>
                    <div class="myfont">（单次充值限额:{{ruleForm.chargeMin | firstChargeMin}}元—{{ruleForm.chargeMax | firstChargeMx}}元）</div>
                  </el-radio-group>
              </el-col>
            </el-row>
            <el-row style="margin-top:1vw">
              <el-col :span="4">
                <div style="padding-left:3vw">
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
              :dataListAll="dataListAll"
              :openCard='true'/>
          </div>
          <div class="pay" v-if="allPrice != 0">
            <el-form-item label="支付方式：" prop="payWayCode">
              <el-radio-group v-model="ruleForm.payWayCode">
                <el-radio :label="item.label" v-for="(item,index) in payWayCode" :key="index">{{item.value}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
      <div class="bottom-btn-warp">
        <el-button @click="back()" v-text='ruleForm.cardProductId ? "取消" :"返回"' class="common-btn"></el-button>
        <el-button v-show="ruleForm.cardProductId" @click="clearRuleForm()" class="common-btn">清空</el-button>
        <el-button v-show="ruleForm.cardProductId" @click="submit" type="primary" class="common-btn">确定</el-button>
      </div>

    <pay-loading v-model="ruleForm.barCode" :visible.sync="centerDialogVisible" :payMethod='ruleForm.payWayCode'></pay-loading>
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
        couponAmount:"",//票券数量
        couponApplyCode:"",//票券编码
        couponApplyCodeLabel:"",//票券名称
        presentMoney:"",//赠送金额
        presentPoint:"",//赠送积分数
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
          { min:6,max:6, validator: customPasswordReg, trigger: "change",passwordkType:1}
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
      activeShow:true,//优惠活动组件显隐
      pickerOptions:{
        disabledDate(time){
            let _now = Date.now();
            return time.getTime() > _now;
　　　　　　　　　　　　　　//大于当前的禁止
        }
      },
      chargeBlock:true,//为礼品卡不展示收费区域
    };
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
        this.ruleForm = Object.assign({},this.ruleForm,data,{
          activityAmount:data.amount
        })
      } else {
        this.ruleForm.activityId = ""; //营销活动ID
        this.ruleForm.activityName = ""; //营销活动ID
        this.ruleForm.couponAmount="";//票券数量
        this.ruleForm.couponApplyCode="";//票券编码
        this.ruleForm.couponApplyCodeLabel="";//票券名称
        this.ruleForm.presentMoney="";//赠送金额
        this.ruleForm.presentPoint="";//赠送积分数
        // this.basicAmount = "";
      }
    },
    queryData(data) {
      this.$refs['ruleForm'].resetFields();
      this.ruleForm.cardNo = data.phoneOrCard;
    },
    getActivityList(cardTypeCode) {
      MemberAjax.getActivityList({cardNo:this.ruleForm.cardNo, tenantId: this.tenantId, action: "MEMBER_ACTIVE_CARD" ,channelNo:localStorage['channelNo'],cinemaId:localStorage['cinemaId'],cinemaCode:localStorage['cinemaCode'],cardProductId:this.ruleForm.cardProductId,cardTypeCode:cardTypeCode,levelId:'1'}).then(res => {
        var activeList = res.data || [];
        //过滤调非储值卡情况下 选取充值活动
        if(this.member.cardTypeCode != 'stored_card'){
          activeList = activeList.filter(item => {
            return !item.presentMoney;
          })
        }
        this.dataListAll = activeList;
        this.activeShow = false;
        this.$nextTick(()=>{this.activeShow = true;})
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
          var _res = res.data;
          //迁移卡开卡处理
          if(!_res.mustFill){
            this.$message.warning("未查询到卡信息");
            return;
          }
          if (_res.isBinding) {
            this.$message.warning("此卡已绑定");
            this.ruleForm.cardProductId = '';
          } else {
            if(_res.cardType === '联名卡' || _res.cardTypeCode === 'cobranded_card'){
              this.$message.warning('联名卡暂不支持开卡');
              return;
            }
            //判断此卡是否可以在柜台开卡
            let flag = _res.channelList.some((item,index)=>{
              if(item.channelNo == 0){
                return true;
              }
            })
            if(!flag){
              this.ruleForm.cardProductId = '';
              this.$message.warning('此卡政策柜台不可用');
              return;
            }
            if(_res.cardTypeCode === 'equity_card'){
              this.ruleForm.openPrice = _res.price;
            }else{
              this.ruleForm.openPrice = _res.openPrice; //开卡
            }
            this.member.cardTypeCode = _res.cardTypeCode;
            this.ruleForm.cardProductId = _res.id;
            this.ruleForm.cardName = _res.cardName;
            this.ruleForm.cardType = _res.cardType;
            this.ruleForm.chargeMax = _res.chargeMax;
            this.ruleForm.chargeMin = _res.firstChargeMin;
            this.mustFill = _res.mustFill;
            this.rules['consumePassword'][1].passwordkType = _res.weakPassword    //是否为若类型密码格式
            sessionStorage['chargeMin'] = _res.firstChargeMin;
            sessionStorage['chargeMax'] = _res.chargeMax;
            //礼品卡
            console.log(_res.cardTypeCode)
            if(_res.cardTypeCode === 'gift_card'){
              this.chargeBlock = false;
            } else {
              this.getActivityList(_res.cardTypeCode);
            } 
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
  position: relative;
  .el-form-item__content {
    margin-left: 0 !important;
  }
  .cardNoNameStyle {
    position: absolute;
    margin: 2.7vh;
    height:5vh;
    line-height:5vh;
    width: 39.4vw;
    right: 0px;
    top: 0px;
    text-indent: 18px;
    box-shadow: 0 0  1px  1px #BCBCBC inset;
    border-radius:2px;
    span {
      font-size: $font-size12;
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
    height:5vh;
    margin-left:.6vw;
    button {
      height: 5vh;
      cursor: pointer;
      font-size:$font-size12;
      border: none;
      background: #ffffff;
      border: 1px solid #3b74ff;
      border-radius: 2px;
      border-radius: 2px;
      color: #3b74ff;
    }
  }
  .member-info-content {
    padding: 1vw 0vw;
    .el-col-11{
      height:8vh;
      // margin-bottom:3vw;
    }
  }
  .pay {
    margin-top: 1%;
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
    font-size: $font-size12;
    height: 2.5vw;
    line-height: 2.5vw;
    color: #3b74ff;
    letter-spacing: 0;
    text-indent: 10px;
  }
  .lable-font {
    font-size: $font-size12;
    color: #666666;
    letter-spacing: 0;
  }
  .lable-font2 {
    font-size: $font-size12;
    color: #ff7b03;
    letter-spacing: 0;
  }
}
</style>