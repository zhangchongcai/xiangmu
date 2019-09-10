<template>
  <div>
    <memberInfoAndCard
      @isShow="isShow"
      @submit="submit"
      :memberTitle="memberTitle"
      :ruleFormData="ruleFormData"
      :cardStatus='cardStatus'
      :isshow='isshow'>
      <div slot="addBlock" v-show="isshow && member.cardNoOrphoneNumState">
        <el-form
          @submit.native.prevent
          :model="ruleFormData"
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
        >
          <div v-if='isshow && ruleFormFilter' style="position:relative">
            <div class="member-info-title">修改密码</div>
            <el-form-item
              v-for="(item,index) in ruleFormFilter"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              class="row-line-center"
              style="margin-top:1.5vw"
            >
              <el-input :type="item.type" v-model="ruleFormData[item.prop]" class="psd-inp"></el-input>
              <el-button class="start-btn" @click="startKeyBorad(`${item.prop}`)">启动密码输入</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </memberInfoAndCard>
  </div>
</template>

<script>
import memberInfoAndCard from "./components/memberInfoAndCard";
import { customPasswordReg ,passwdReg} from "./util/validate.js";
import { toFormModel ,readCard ,secKeyBoard ,statusDeter ,cardStatusCN ,routerJump} from "./util/utils";
import { MemberAjax, memeberApi } from "src/http/memberApi";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    var checkPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleFormData.newPasswd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      memberTitle: "修改密码",
      cardReadingTitle: "会员卡/手机号：",
      isApply: false,
      dataType: "phone",
      memberInfo: "",
      memberCardInfo: "",
      isshow: false,
      ruleFormData: {},
      cardStatus:['normal'],
      ruleForm: [
        { prop: "passwd", label: "旧密码", type: "password" }, //旧密码
        { prop: "newPasswd", label: "新密码", type: "password" }, //新密码
        { prop: "confirmPsd", label: "确认密码", type: "password" }, //确认密码
        { prop: "cardNo", show: true }
      ],
      rules: {
        passwd: [{ required: true, validator:passwdReg,trigger:["change","blur" ]}],
        newPasswd: [
          { required: true, min:6,max:6, validator: customPasswordReg, trigger: ["change","blur" ],passwordkType:1}
        ],
        confirmPsd: [{ required: true, validator: checkPass, trigger: ["change","blur" ] }]
      }
    };
  },
  computed: {
    ...mapState(["member","config"]),
    ...mapGetters(['tenantId','operator']),
    ruleFormFilter:function(){
      return this.ruleForm.filter(item=>{
        return !item.show;
      })
    }
  },
  mounted() {
    this.ruleFormData = toFormModel(this.ruleForm);
  },
  methods: {
    isShow(data) {
      if(routerJump.call(this))
      this.isshow = statusDeter.call(this,data,'normal',`该卡状态为${cardStatusCN(this.member.cardState)},不能修改密码`);
      if(this.isshow)this.$refs['ruleForm'].resetFields();
    },
    submit() {
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
    },
    handleSubmit() {
      var data = Object.assign({},this.ruleFormData, {
        tenantId: this.tenantId,
        cardNo: this.member.cardNo,
        operator: this.operator
      },JSON.parse(sessionStorage['payParams']));
      data.passwd = this.$md5(data.passwd);
      data.newPasswd = this.$md5(data.newPasswd);
      data.confirmPsd = this.$md5(data.confirmPsd);
      return {
        url: memeberApi.changePsd["url"],
        data: data,
        router: this.$router
      }
    },
    startKeyBorad(arg){
      if(JSON.parse(localStorage['globalAppState'])){
        this.member.show = true;
      }
      secKeyBoard(this.config.configData).then((e)=>{
        this.ruleFormData[arg] = e;
        this.member.show = false;
      }).catch(err=>{
         this.member.show = false;
        })  
    }
  },
  watch:{
    'member.cardNo'(newVal){
      if(newVal){
        this.$store.dispatch('cardPolicy',{cardNo:newVal,tenantId: this.tenantId}).then(res=>{
          if(res.data)this.rules.newPasswd[0].passwordkType = res.data.weakPassword;
        })
      }
    }
  },
  components: {
    memberInfoAndCard
  }
};
</script>
<style lang="scss" scoped>
._member-recharge {
  min-height: 93vh;
  position: relative;

  .member-recharge-content {
    padding: 0 2vw 0vh 2vw;
  }
}
</style>
