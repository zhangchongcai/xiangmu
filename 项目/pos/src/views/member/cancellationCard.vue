<template>
  <div>
    <memberInfoAndCard
      @isShow="isShow"
      @submit="submit"
      :memberTitle="memberTitle"
      :ruleFormData="ruleForm"
      :cardStatus="cardStatus"
      :isshow='isshow'>
      <div slot="addBlock" v-show="isshow && member.cardNoOrphoneNumState">
        <el-form
          @submit.native.prevent
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
          style="width:52vw"
          class="demo-ruleForm"
        >
          <div style="position:relative;margin-top:-22px">
            <div class="recharge-info-title">验证身份</div>
            <!-- <el-form-item label="短信验证码" prop="validationCode" v-if="member.numberType === 'phone'">
              <el-input v-model="ruleForm.validationCode" class="psd-inp" @focus="keyboard"></el-input>
              <el-button class="start-btn" @click="getVilidate" v-text="validataText" :disabled="disable"></el-button>
            </el-form-item> -->
            <el-form-item label="输入密码" prop="passwd">
              <el-input type="password" v-model="ruleForm.passwd" class="psd-inp"></el-input>
              <el-button class="start-btn" @click="secKeyBoard" v-text="startKeyBorad"></el-button>
            </el-form-item>
          </div>
          <div
            style="position:relative;margin-top:22px"
            v-show="ruleForm.validationCode || ruleForm.passwd"
          >
            <div class="recharge-info-title">注销会员卡</div>
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
            <el-form-item label="退还金额" prop="refundSum">
              <el-input v-model="ruleForm.refundSum" class="psd-inp" style="width:15vw"></el-input> 元
            </el-form-item>
            <el-form-item label="支付方式" prop="payWayCode">
              <el-radio-group v-model="ruleForm.payWayCode">
                <el-radio label="ali">支付宝</el-radio>
                <el-radio label="wx">微信</el-radio>
              </el-radio-group>
            </el-form-item>
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
              <el-button type="primary" @click="cancelCard" :loading="payLoading">{{payLoadingText}}</el-button>
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
import { readCard ,secKeyBoard ,getValidation ,statusDeter ,cardStatusCN ,submit,stopPay} from './util/utils'
export default {
  data() {
    return {
      payTimer:null,
      centerDialogVisible:false,
      payLoading:false,
      payLoadingText:'支 付',
      memberTitle: "注销",
      isshow: false,
      editMoney:true,
      cardStatus:['normal'],
      iskeyboard:false,
      validataText:"获取验证码",
      disable:false,
      startKeyBorad:'启动密码输入',
      ruleForm: {
        passwd: "",
        refundSum:0, //退还金额
        poundage:'',
        payWayCode:''
      },
      rules: {
        passwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        validationCode: [
          { required: true, message: "请输入验证码", trigger: "change" }
        ],
        payWayCode:{ required: true, message: "请选择支付方式", trigger: "change" }
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
    //触发确定
    submit(vo) {
      if (vo) {
        if (!this.member.cardNo && this.member.numberType === "phone") {
          this.$message.warning("请选择一张储卡");
          return;
        }
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            this.centerDialogVisible = true;
            // this.$store.dispatch("handleHttp", this.handleSubmit()).catch(err=>{
            //   this.$refs['ruleForm'].resetFields();
            // });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    cancelCard(){
      submit.bind(this)()
      // this.$store.dispatch("handleHttp", this.handleSubmit()).then(res=>{
      //     if(res.code === '601'){
      //       this.payLoadingText = '支付中...';
      //       this.payTimer = setInterval(()=>{
      //         payPolling.call(this,res.data)
      //       },2000)
      //     }else{
      //       this.$message.error(res.msg);
      //       stopPay.bind(this)();
      //     }
      //   }).catch(err=>{
      //     stopPay.bind(this)();
      //     this.$refs['ruleForm'].resetFields();
      //   })
    },
    handleSubmit() {
      var data = Object.assign(this.ruleForm, {
        tenantId: this.tenantId,
        cardNo: this.member.cardNo,
        operator: this.operator,
        // phoneNum: this.member.phoneNum,
      },JSON.parse(sessionStorage['payParams']));
      if(!!data.passwd) {
        data.passwd = this.$md5(data.passwd);
      }
      return {
        url: memeberApi.cancelCard["url"],
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
    },
    getVilidate(){
      getValidation.bind(this)(()=>{
        return this.$store.dispatch('sendViladate',{phoneNumber:this.member.phoneNum,tenantId:this.tenantId})
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
          this.ruleForm.poundage = this.member.cancellationFees || 0;
          this.ruleForm.refundSum = res.data.backPrice || 0;
        })
      }
    }
  },
  components: {
    memberInfoAndCard
  }
};
</script>