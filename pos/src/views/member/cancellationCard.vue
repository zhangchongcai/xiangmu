<template>
  <div>
    <memberInfoAndCard
      @isShow="isShow"
      @submit="submit"
      :memberTitle="memberTitle"
      :ruleFormData="ruleForm"
      :cardStatus="cardStatus"
      :isshow='isshow'>
      <div slot="addBlock" v-show="isshow && member.cardNoOrphoneNumState" style="margin-top: 1vw;">
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
              <el-button class="start-btn" @click="secKeyBoard" v-text="startKeyBorad"></el-button>
            </el-form-item>
          </div>
          <div
            style="position:relative;margin-top:22px">
            <div class="member-info-title">注销会员卡</div>
            <el-form-item
                label="手续费"
                class="row-line-center"
                style="margin-bottom:1vw">
                <el-input
                    v-show="!editMoney"
                    v-model.number="ruleForm.cost" 
                    ></el-input>
                <span v-show="editMoney" style="font-size:1.04vw">{{ruleForm.cost}}</span><em style="font-size:1.04vw">元</em>
                <el-button 
                    class="start-btn" 
                    @click="handleEdit">修改</el-button>
            </el-form-item>
            <el-form-item label="退还金额" prop="refundSum" class="row-line-center">
              <el-input v-model="ruleForm.refundSum" class="psd-inp" ></el-input> <em style="font-size:1.04vw">元</em>
            </el-form-item>
            <el-form-item label="支付方式" prop="payWayCode" v-if="ruleForm.cost!=0" class="row-line-center" style="margin-top: 1vw;">
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
import { readCard ,secKeyBoard  ,statusDeter ,cardStatusCN ,submit,stopPay } from './util/utils';
import getVilidateCode from './mixins/getVilidateCode';
import payMixins from './mixins/payMixins';
import { passwdReg} from "./util/validate.js";
export default {
  mixins:[getVilidateCode,payMixins],
  data() {
    return {
      memberTitle: "注销",
      isshow: false,
      editMoney:true,
      cardStatus:['normal'],
      iskeyboard:false,
      startKeyBorad:'启动密码输入',
      ruleForm: {
        passwd: "",
        refundSum:'0', //退还金额
        cost:'0',
        payWayCode:'',
        barCode:''
      },
      rules: {
        passwd: [{ validator:passwdReg,trigger:'change'}],
        validationCode: [
          { required: true, message: "请输入验证码", trigger: "change" }
        ],
        payWayCode:{ required: true, message: "请选择支付方式", trigger: "change" },
        refundSum:{ required: true, message: "请输入退还金额", trigger: "change" }
      }
    };
  },
  computed: {
    ...mapState(["member","config"]),
    ...mapGetters(['tenantId','operator'])
  },
  watch: {
    "member.numberType": function(newVal, oldVal) {
      this.member["numberType"] = newVal;
    }
  },
  methods: {
    isShow(data) {
      this.isshow = statusDeter.call(this,data,'normal',`该卡状态为${cardStatusCN(this.member.cardState)},不能注销`);
      if(this.isshow)this.$refs['ruleForm'].resetFields();
    },
    handleSubmit() {
      var data = Object.assign({},this.ruleForm, {
        actionType:'CANCEL',
        tenantId: this.tenantId,
        cardNo: this.member.cardNo,
        operator: this.operator,
        cardProductId:this.member.cardProductId
        // phoneNum: this.member.phoneNum,
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
    },
    keyboard(){
      this.iskeyboard = true;
    }
  },
  watch: {
    'member.cardNo'(newVal){
      if(newVal){
        this.$store.dispatch('cardPolicy',{cardNo:newVal,tenantId: this.tenantId}).then(res=>{
          this.ruleForm.cost = this.member.cancellationFees || 0;
        })
      }
    }
  },
  components: {
    memberInfoAndCard
  }
};
</script>
