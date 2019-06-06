<template>
  <div>
    <memberInfoAndCard
      @isShow="isShow"
      @submit="submit"
      :memberTitle="memberTitle"
      :ruleFormData="ruleForm"
      :cardOperation='true'
      :cardStatus='cardStatus'
      :isshow='isshow'
    >
      <div slot="addBlock" v-show="isshow">
        <el-form
          @submit.native.prevent
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <div style="position:relative;margin-top:-22px">
            <div class="recharge-info-title">验证身份</div>
            <!-- <el-form-item label="短信验证码" prop="validationCode" v-if="member.numberType === 'phone'">
              <el-input v-model="ruleForm.validationCode" class="psd-inp"></el-input>
              <el-button class="start-btn">获取验证码</el-button>
            </el-form-item> v-else-->
            <el-form-item label="输入密码" prop="passwd" >
              <el-input type="password" v-model="ruleForm.passwd" class="psd-inp"></el-input>
              <el-button class="start-btn" @click="secKeyBoard">启动密码输入</el-button>
            </el-form-item>
          </div>
          <!--  v-show="ruleForm.validationCode || ruleForm.passwd" -->
          <div
            style="position:relative;margin-top:22px">
            <div class="recharge-info-title">解冻会员卡</div>
            <el-form-item label="手续费" prop="cost">
              <el-input v-model="ruleForm.cost" class="psd-inp" style="width:15vw"></el-input> 元
            </el-form-item>
            <el-form-item label="支付方式" prop="payWayCode" v-if="ruleForm.cost!=0">
              <el-radio-group v-model="ruleForm.payWayCode">
                <el-radio label="alimicropay">支付宝</el-radio>
                <el-radio label="wxmicropay">微信</el-radio>
                <el-radio label="cash">现金</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </memberInfoAndCard>

    <pay-loading v-model="ruleForm.barCode" :visible.sync="centerDialogVisible"></pay-loading>
  </div>
</template>

<script>
import memberInfoAndCard from "./components/memberInfoAndCard";
import { mapState, mapGetters } from "vuex";
import { MemberAjax, memeberApi } from "src/http/memberApi";
import { readCard ,secKeyBoard ,cardStatusCN ,statusDeter ,stopPay ,payPolling} from './util/utils';
import payMixins from './mixins/payMixins'
export default {
  mixins:[payMixins],
  data() {
    return {
      memberTitle: "解冻",
      isshow: false,
      editMoney:true,
      cardStatus:['frozen'],
      ruleForm: {
        passwd: "",
        validationCode: "",
        cost:0, //手续费
        payWayCode:"",
        barCode:''
      },
      rules: {
        passwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        validationCode: [
          { required: true, message: "请输入验证码", trigger: "change" }
        ],
        payWayCode:[{ required: true, message: "请选择支付方式", trigger: "change" }],
        cost:[{ required: true, message: "请输入手续费，无手续费请填0", trigger: "change" }]
      }
    };
  },
  computed: {
    ...mapState([ "member","config"]),
    ...mapGetters(['tenantId','operator'])
  },
  watch: {
    "member.numberType": function(newVal, oldVal) {
      this.member["numberType"] = newVal;
    }
  },
  methods: {
    isShow(data) {
      this.isshow = statusDeter.call(this,data,'frozen',`该卡状态为${cardStatusCN(this.member.cardState)},不能解冻`);
      if(this.isshow)this.$refs['ruleForm'].resetFields();
    },
    handleSubmit() {
      var data = Object.assign({},this.ruleForm, {
        tenantId: this.tenantId,
        cardNo: this.member.cardNo,
        operator: this.operator,
        actionType:'ACTIVE'
      },JSON.parse(sessionStorage['payParams']));
      if(!!data.passwd) {
        data.passwd = this.$md5(data.passwd);
      }
      return {
        url: memeberApi.payAndAct["url"],
        data: data,
        router: this.$router
      };
    },
    handleEdit(){
        this.editMoney = false;
    },
    secKeyBoard(){
      if(JSON.parse(localStorage['globalAppState'])){
        this.member.show = true;
      }
      secKeyBoard(this.config.configData).then(re=>{
        this.ruleForm.passwd = re;
        this.member.show = false;
      }).catch(err=>{
        this.member.show = false;
      }) 
    }
  },
  components: {
    memberInfoAndCard
  }
};
</script>