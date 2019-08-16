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
          class="demo-ruleForm"
        >
          <div style="position:relative">
            <div class="member-info-title">验证身份</div>
            <el-form-item label="短信验证码" prop="validateCode" class="row-line-center">
              <el-input v-model="ruleForm.validateCode" class="psd-inp"></el-input>
              <el-button class="start-btn" @click="getVilidate" v-text="validataText" :disabled="disable"></el-button>
            </el-form-item>
          </div>
          <div
            style="position:relative;margin-top:22px">
            <div class="member-info-title">重置密码</div>
            <el-form-item label="新消费密码" prop="passwd" class="row-line-center">
              <el-input type="password" v-model="ruleForm.passwd" class="psd-inp"></el-input>
              <el-button class="start-btn" @click="startKeyBorad">启动密码输入</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </memberInfoAndCard>
  </div>
</template>

<script>
import memberInfoAndCard from "./components/memberInfoAndCard";
import { mapState, mapGetters } from "vuex";
import { MemberAjax, memeberApi } from "src/http/memberApi";
import { readCard ,secKeyBoard ,statusDeter,cardStatusCN ,routerJump} from './util/utils';
import { customPasswordReg } from "./util/validate";
import getVilidateCode from './mixins/getVilidateCode'
export default {
  mixins:[getVilidateCode],
  data() {
    return {
      memberTitle: "重置密码",
      cardReadingTitle: "会员卡/手机号：",
      isshow: false,
      cardStatus:['normal'],
      timer:null,
      ruleForm: {
        passwd: "",
        validateCode: ""
      },
      rules: {
        passwd:[
          { required: true, message: "请输入密码", trigger: "change" },
          { validator: customPasswordReg, trigger: "change",passwordkType:1}
        ],
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
    },
    'member.cardNo'(newVal){
      if(newVal){
        this.$store.dispatch('cardPolicy',{cardNo:newVal,tenantId: this.tenantId}).then(res=>{
          if(res.data){
            this.rules.passwd[1].passwordkType = res.data.weakPassword;
          }
        })
      }
    }
  },
  methods: {
    isShow(data) {
      if(routerJump.call(this))
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
            this.$store.dispatch("handleHttp", this.handleSubmit())
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    handleSubmit() {
      var data = Object.assign({},this.ruleForm, {
        tenantId: this.tenantId,
        cardNo: this.member.cardNo,
        operator: this.operator,
        phoneNum:this.member.phoneNum
      },JSON.parse(sessionStorage['payParams']));
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
    }
  },
  components: {
    memberInfoAndCard
  }
};
</script>


