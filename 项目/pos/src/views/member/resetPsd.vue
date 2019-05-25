<template>
  <div>
    <memberInfoAndCard
      @isShow="isShow"
      @submit="submit"
      :memberTitle="memberTitle"
      :ruleFormData="ruleForm"
      :cardStatus='cardStatus'
      :isshow='isshow'
    >
      <div slot="addBlock" v-show="isshow && member.cardNoOrphoneNumState">
        <el-form
          @submit.native.prevent
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          style="width:54vw"
          class="demo-ruleForm"
        >
          <div style="position:relative;margin-top:-22px">
            <div class="recharge-info-title">验证身份</div>
            <el-form-item label="短信验证码" prop="validateCode">
              <el-input v-model="ruleForm.validateCode" class="psd-inp" @focus="keyboard"></el-input>
              <el-button class="start-btn" @click="getVilidate" v-text="validataText" :disabled="disable"></el-button>
            </el-form-item>
          </div>
          <div
            style="position:relative;margin-top:22px">
            <div class="recharge-info-title">重置密码</div>
            <el-form-item label="新消费密码" prop="passwd">
              <el-input type="password" v-model="ruleForm.passwd" class="psd-inp"></el-input>
              <el-button class="start-btn" @click="startKeyBorad">启动密码输入</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </memberInfoAndCard>
     <KeyBoard v-model="ruleForm.validateCode" @confirm="fillContent" ref="keyboard"></KeyBoard>
  </div>
</template>

<script>
import memberInfoAndCard from "./components/memberInfoAndCard";
import { mapState, mapGetters } from "vuex";
import { MemberAjax, memeberApi } from "src/http/memberApi";
import KeyBoard from 'components/keyboard'
import { readCard ,secKeyBoard ,getValidation ,statusDeter,cardStatusCN} from './util/utils'
export default {
  data() {
    return {
      memberTitle: "重置密码",
      cardReadingTitle: "会员卡/手机号：",
      isshow: false,
      cardStatus:['normal'],
      validataText:"获取验证码",
      timer:null,
      disable:false,
      ruleForm: {
        passwd: "",
        validateCode: ""
      },
      rules: {
        passwd: [{ required: true, message: "请输入密码", trigger: "change" }],
        validateCode: [
          { required: true, message: "请输入验证码", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    ...mapState(["member",'config']),
    ...mapGetters(['tenantId','operator'])
  },
  watch: {
    "member.numberType": function(newVal, oldVal) {
      this.member["numberType"] = newVal;
    }
  },
  methods: {
    keyboard(){
      this.$refs.keyboard.show()
    },
    fillContent(val){
      this.ruleForm.validateCode = val;
    },
    isShow(data) {
      this.isshow = statusDeter.call(this,data,'normal',`该卡状态为${cardStatusCN(this.member.cardState)},不能重置密码`);
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
            this.$store.dispatch("handleHttp", this.handleSubmit()).catch(err=>{
              this.$refs['ruleForm'].resetFields()
            });
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
        operator: this.operator,
        phoneNum:this.member.phoneNum
      });
      if(data.passwd){
        data.passwd = this.$md5(data.passwd);
      }
      return {
        url: memeberApi.resetPassword["url"],
        data: data,
        router: this.$router
      };
    },
    startKeyBorad(){
      if(JSON.parse(localStorage['globalAppState'])){
        this.member.show = true;
      }
      secKeyBoard(this.config.configData).then((re)=>{
        this.ruleForm.passwd = re;
        this.member.show = false;
      }).catch(err=>{
         this.member.show = false;
      })
    },
    getVilidate(){
      getValidation.bind(this)(()=>{
        return this.$store.dispatch('sendViladate',{phoneNumber:this.member.phoneNum,tenantId:this.tenantId})
      })
    }
  },
  components: {
    memberInfoAndCard,
    KeyBoard
  }
};
</script>

