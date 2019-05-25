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
                      v-model.number="ruleForm.poundage" 
                      style="width:10vw"></el-input>
                    <span v-show="editMoney">{{ruleForm.poundage}}</span>元
                    <el-button 
                      class="start-btn" 
                      @click="handleEdit">修改</el-button>
                  </el-form-item>
                  <el-form-item 
                  label="支付方式"
                  prop="payWay">
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
              <el-button type="primary" @click="repairCardSubmit" :loading="payLoading">{{payLoadingText}}</el-button>
            </span>
          </el-dialog>
        </el-form>
      </div>
    </memberInfoAndCard>
  </div>
</template>

<script>
import memberInfoAndCard from "./components/memberInfoAndCard";
import { mapState, mapGetters } from "vuex";
import { MemberAjax, memeberApi } from "src/http/memberApi";
import { readCard ,secKeyBoard ,cardStatusCN , statusDeter ,stopPay ,payPolling, submit ,cardPolicy} from "./util/utils";
export default {
  data() {
    return {
      payTimer:null,
      centerDialogVisible:false,
      payLoading:false,
      payLoadingText:'支 付',
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
        poundage:0,//手续费
        payWay:"" //支付方式
      },
      apyType:[{label:'wxmicropay',value:'微信'},{label:'alimicropay',value:'支付宝'},{label:'cash',value:'现金'}],
      rules: {
        passwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        newCardNo: [{ required: true, message: "请输入新会员卡", trigger: "blur" }],
        newPasswd: [{ required: true, message: "请输入新密码", trigger: "blur" }],
        poundage: [{  message: "请输入手续费金额", trigger: "change" }],
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
    //触发确定
    submit(data) {
      if (data) {
        if (!this.member.cardNo) {
          this.$message.warning("请选择一张储卡");
          return;
        }
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
              this.centerDialogVisible = true;
            // this.$store.dispatch("handleHttp", this.handleSubmit());
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    handleSubmit() {
      var data = Object.assign(this.ruleForm, {
        tenantId: this.tenantId,
        cardNo: this.member.cardNo,
        operator: this.operator
      },JSON.parse(sessionStorage['payParams']));
      data.passwd = this.$md5(data.passwd);
      data.newPasswd = this.$md5(data.newPasswd);
      return {
        url: memeberApi.reissueCard["url"],
        data: data,
        router: this.$router
      };
    },
    repairCardSubmit(){
      submit.bind(this)()
        // this.$store.dispatch("handleHttp", this.handleSubmit()).then(res=>{
        //   if(res.code === '601'){
        //     this.payLoadingText = '支付中...';
        //     this.payTimer = setInterval(()=>{
        //       payPolling.call(this,res.data)
        //     },2000)
        //   }else{
        //     this.$message.error(res.msg);
        //     stopPay.bind(this)();
        //   }
        // }).catch(err=>{
        //   stopPay.bind(this)();
        //   this.$refs['ruleForm'].resetFields();
        // })
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
            this.$message.warning(err.mag)
        })
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
    },
    'member.cardNo'(newVal){
      if(newVal){
        this.$store.dispatch('cardPolicy',{cardNo:newVal,tenantId: this.tenantId}).then(res=>{
          this.ruleForm.poundage = this.member.makeUpPrice || 0;
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


