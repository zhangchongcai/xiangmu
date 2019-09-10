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
          class="demo-ruleForm">
          <div style="position:relative">
            <div class="member-info-title">补发新卡</div>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="旧密码"
                  prop="passwd"
                  class="row-line-center">
                  <el-input type="password" 
                    v-model="ruleForm.passwd" 
                    class="psd-inp"></el-input>
                  <el-button class="start-btn" @click="secKeyBoard(`passwd`)">启动密码输入</el-button>
                </el-form-item>
                <el-form-item
                  label="新会员卡"
                  prop="newCardNo"
                  class="row-line-center">
                  <el-input  
                    v-model="ruleForm.newCardNo" 
                    class="psd-inp"
                    @keyup.enter.native="validatorInp"
                    ></el-input>
                  <el-button class="start-btn" @click="readCard">读卡</el-button>
                </el-form-item>
                <el-form-item
                  label="新密码"
                  prop="newPasswd"
                  class="row-line-center">
                  <el-input type="password" v-model="ruleForm.newPasswd" class="psd-inp"></el-input>
                  <el-button class="start-btn" @click="secKeyBoard(`newPasswd`)">启动密码输入</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item
                    label="手续费"
                    class="row-line-center">
                    <el-input
                      v-show="!editMoney"
                      v-model.number="ruleForm.cost"></el-input>
                    <span v-show="editMoney" style="font-size:1.26vw">{{ruleForm.cost}}</span><em style="font-size:1.04vw">元</em> 
                    <el-button 
                      class="start-btn" 
                      @click="handleEdit">修改</el-button>
                  </el-form-item>
                  <el-form-item 
                  label="支付方式"
                  prop="payWayCode"
                  class="row-line-center"
                  v-if="ruleForm.cost">
                    <el-radio-group v-model="ruleForm.payWayCode">
                      <el-radio  
                        v-for="(item,index) in payWayCode"
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
    <pay-loading v-model="ruleForm.barCode" :visible.sync="centerDialogVisible" :payMethod='ruleForm.payWayCode'></pay-loading>
  </div>
</template>

<script>
import memberInfoAndCard from "./components/memberInfoAndCard";
import { mapState, mapGetters } from "vuex";
import { MemberAjax, memeberApi } from "src/http/memberApi";
import { readCard ,secKeyBoard ,cardStatusCN , statusDeter ,cardPolicy ,routerJump} from "./util/utils";
import { customPasswordReg , passwdReg} from "./util/validate.js";
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
        payWayCode:"", //支付方式
        barCode:''
      },
      rules: {
        passwd: [{ required: true, validator:passwdReg,trigger:["blur","change"]}],
        newCardNo: [{ required: true, message: "请输入新会员卡", trigger: ["blur","change"] }],
        newPasswd: [
          { required: true, message: "请输入新密码", trigger: ["blur"] },
          { validator: customPasswordReg, trigger: ["blur","change"],passwordkType:1}
          ],
        cost: [{  message: "请输入手续费金额", trigger: "change" }],
        payWayCode:[{required: true, message: "请选择支付方式", trigger: "change"}]
      }
    };
  },
  computed: {
    ...mapState(["member","config"]),
    ...mapGetters(['tenantId','operator'])
  },
  methods: {
    isShow(data) {
      if(routerJump.call(this))
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
        newPasswd : this.$md5(this.ruleForm.newPasswd),
        cardProductId:this.member.cardProductId
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
            this.$message.warning('请输入正确会员卡号')
            return;
        }
        var data = { cardNo: this.ruleForm.newCardNo.trim(), tenantId: this.tenantId ,verifyPassword: false}
        MemberAjax.getCardInfoByNo(data).then(res => {
            if(res.code === 200 && res.data){
              this.$message.warning('该卡已注册')
            }else if(res.code === 201){
              this.$store.dispatch('cardPolicy',{cardNo:this.ruleForm.newCardNo.trim(),tenantId: this.tenantId}).then(response=>{
                  if( response.data.cardTypeCode != this.member.cardTypeCode ){
                      this.$message.warning(`卡类型不一致，不能补发新卡`);
                      return;
                  };
                  //判断此卡是否可以在柜台开卡
                  let flag = response.data.channelList.some((item,index)=>{
                    if(item.channelNo == 0){
                      return true;
                    }
                  })
                  if(!flag){
                    this.$message.warning('此卡政策柜台不可用');
                    return;
                  }
                  this.rules['newPasswd'][1].passwordkType = response.data.weakPassword;
                })
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
<style scoped lang='scss'>
._member-recharge .demo-ruleForm{
  width:100%!important;
}
.row-line-center{
  margin-top:1.5vw
}
</style>


