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
          class="demo-ruleForm"
        >
          <div style="position:relative">
            <div class="member-info-title">验证身份</div>
            <el-form-item label="输入密码" prop="passwd" class="row-line-center">
              <el-input type="password" v-model="ruleForm.passwd" class="psd-inp"></el-input>
              <el-button class="start-btn" @click="secKeyBoard">启动密码输入</el-button>
            </el-form-item>
          </div>
          <div
            style="position:relative;margin-top:22px">
            <div class="member-info-title">解冻会员卡</div>
            <el-form-item label="手续费" prop="cost" class="row-line-center">
              <el-input v-model="ruleForm.cost" class="psd-inp"></el-input> <em style="font-size:1.04vw;">元</em>
            </el-form-item>
            <el-form-item label="支付方式" prop="payWayCode" v-if="ruleForm.cost!=0">
              <el-radio-group v-model="ruleForm.payWayCode">
                <el-radio :label="item.label" v-for="(item,index) in payWayCode" :key="index">{{item.value}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </memberInfoAndCard>

    <pay-loading v-model="ruleForm.barCode" :visible.sync="centerDialogVisible" :payMethod='ruleForm.payWayCode'></pay-loading>
  </div>
</template>

<script>
import memberInfoAndCard from "./components/memberInfoAndCard";
import { mapState, mapGetters } from "vuex";
import { MemberAjax, memeberApi } from "src/http/memberApi";
import { readCard ,secKeyBoard ,cardStatusCN ,statusDeter ,stopPay ,payPolling ,routerJump} from './util/utils';
import payMixins from './mixins/payMixins';
import { passwdReg} from "./util/validate.js";
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
        passwd: [{ validator:passwdReg,trigger:'change'}],
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
      if(data && routerJump.call(this)){
        this.isshow = statusDeter.call(this,data,'frozen',`该卡状态为${cardStatusCN(this.member.cardState)},不能解冻`);
        if(this.isshow)this.$refs['ruleForm'].resetFields();
      }
    },
    handleSubmit() {
      var data = Object.assign({},this.ruleForm, {
        tenantId: this.tenantId,
        cardNo: this.member.cardNo,
        operator: this.operator,
        actionType:'ACTIVE',
        cardProductId:this.member.cardProductId
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
<style lang="scss" scoped>
  .row-line-center{
    margin-top:1vw
  }
</style>

