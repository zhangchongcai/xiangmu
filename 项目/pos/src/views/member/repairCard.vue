<template>
  <div>
    <memberInfoAndCard
      @isShow="isShow"
      @submit="submit"
      :memberTitle="memberTitle"
      :ruleFormData="ruleForm"
      :lossOperation='true'
      :cardStatus='cardStatus'
      :isshow='isshow'>
      <div slot="addBlock" v-show="isshow && member.cardNoOrphoneNumState">
        <el-form
          @submit.native.prevent
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm">
          <div style="position:relative;margin-top:-22px">
            <div class="recharge-info-title">补发新卡</div>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="旧密码"
                  prop="passwd">
                  <el-input type="password" 
                    v-model="ruleForm.passwd" 
                    class="psd-inp"></el-input>
                  <el-button class="start-btn" @click="secKeyBoard(`passwd`)">启动密码输入</el-button>
                </el-form-item>
                <el-form-item
                  label="新会员卡"
                  prop="newCardNo">
                  <el-input  
                    v-model="ruleForm.newCardNo" 
                    class="psd-inp"
                    @keyup.enter.native="validatorInp"
                    ></el-input>
                  <el-button class="start-btn" @click="readCard">读卡</el-button>
                </el-form-item>
                <el-form-item
                  label="新密码"
                  prop="newPasswd">
                  <el-input type="password" v-model="ruleForm.newPasswd" class="psd-inp"></el-input>
                  <el-button class="start-btn" @click="secKeyBoard(`newPasswd`)">启动密码输入</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item
                    label="手续费">
                    <el-input
                      v-show="!editMoney"
                      v-model.number="ruleForm.cost" 
                      style="width:10vw"></el-input>
                    <span v-show="editMoney">{{ruleForm.cost}}</span>元
                    <el-button 
                      class="start-btn" 
                      @click="handleEdit">修改</el-button>
                  </el-form-item>
                  <el-form-item 
                  label="支付方式"
                  prop="payWay"
                  v-if="ruleForm.cost">
                    <el-radio-group v-model="ruleForm.payWay">
                      <el-radio  
                        v-for="(item,index) in apyType"
                        :label="item.label"
                        :key="index">{{item.value}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
              </el-col>
            </el-row>  
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
import { readCard ,secKeyBoard ,cardStatusCN , statusDeter ,cardPolicy} from "./util/utils";
import payMixins from './mixins/payMixins'
export default {
  mixins:[payMixins], //支付
  data() {
    return {
      memberTitle: "补卡",
      cardReadingTitle: "会员卡/手机号：",
      isshow: false,
      ruleFormData: {},
      editMoney:true,//默认显示手续费
      cardStatus:['loss'],
      ruleForm: {
        passwd:"",
        newCardNo:"",//新会员卡
        newPasswd:"",//新密码
        cost:0,//手续费
        payWay:"", //支付方式
        barCode:''
      },
      apyType:[{label:'wxmicropay',value:'微信'},{label:'alimicropay',value:'支付宝'},{label:'cash',value:'现金'}],
      rules: {
        passwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        newCardNo: [{ required: true, message: "请输入新会员卡", trigger: "blur" }],
        newPasswd: [{ required: true, message: "请输入新密码", trigger: "blur" }],
        cost: [{  message: "请输入手续费金额", trigger: "change" }],
        payWay:[{required: true, message: "请选择支付方式", trigger: "change"}]
      }
    };
  },
  computed: {
    ...mapState(["member","config"]),
    ...mapGetters(['tenantId','operator'])
  },
  methods: {
    isShow(data) {
      this.isshow = statusDeter.call(this,data,'loss',`该卡状态为${cardStatusCN(this.member.cardState)},不能补卡`);
      if(this.isshow)this.$refs['ruleForm'].resetFields();
    },
    handleSubmit() {
      var data = Object.assign({},this.ruleForm, {
        actionType:'REISSUE',
        tenantId: this.tenantId,
        cardNo: this.member.cardNo,
        operator: this.operator,
        passwd : this.$md5(this.ruleForm.passwd),
        newPasswd : this.$md5(this.ruleForm.newPasswd)
      },JSON.parse(sessionStorage['payParams']));
      return {
        url: memeberApi.payAndAct["url"],
        data: data,
        router: this.$router
      };
    },
    handleEdit(){
      this.editMoney = false;
    },
    secKeyBoard(arg){
      if(JSON.parse(localStorage['globalAppState'])){
        this.member.show = true;
      }
      secKeyBoard(this.config.configData).then(re=>{
        this.ruleForm[arg] = re;
        this.member.show = false;
      }).catch(err=>{
         this.member.show = false;
        })
    },
    readCard(){
      readCard(this.config.configData).then(re=>{
        this.ruleForm['newCardNo'] = re.replace(/\,| \，/g,'');
        this.validatorInp();
      })
    },
    validatorInp(){
        if(!/\d{14}/.test(this.ruleForm.newCardNo.trim())){
            this.$message.warning('请输入正确会员卡号/手机号')
            return;
        }
        var data = { cardNo: this.ruleForm.newCardNo.trim(), tenantId: this.tenantId ,verifyPassword: false}
        MemberAjax.getCardInfoByNo(data).then(res => {
            if(res.code === 200 && res.data){
                if(res.data.status !== 'normal' || res.data.cardTypeCode !== this.member.cardTypeCode){
                    this.$message.warning(`请检查卡是否正常或为${cardStatusCN(this.member.cardTypeCode)}`);
                    return;
                }
            }else{
                this.$message.warning(res.msg)
            }
        }).catch((err)=>{
            // this.$message.warning(err.mag)
        })
    }
  },
  watch: {
    'member.cardNo'(newVal){
      if(newVal){
        this.$store.dispatch('cardPolicy',{cardNo:newVal,tenantId: this.tenantId}).then(res=>{
          this.ruleForm.cost = this.member.makeUpPrice || 0;
        })
      }
    }
  },
  components: {
    memberInfoAndCard
  }
};
</script>
<style scoped>
._member-recharge .demo-ruleForm{
  width:100%!important;
}
</style>


