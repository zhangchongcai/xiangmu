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
          label-width="100px"
          class="demo-ruleForm"
        >
          <div v-if='isshow && ruleFormFilter' style="position:relative;margin-top:-22px">
            <div class="recharge-info-title">修改密码</div>
            <el-form-item
              v-for="(item,index) in ruleFormFilter"
              :key="index"
              :label="item.label"
              :prop="item.prop"
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
import { num10_999float2 } from "./util/validate.js";
import { toFormModel ,readCard ,secKeyBoard ,statusDeter ,cardStatusCN} from "./util/utils";
import { MemberAjax,memeberApi } from "src/http/memberApi";
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
        passwd: [{ required: true, message: "请输入旧密码", trigger: "change" }],
        newPasswd: [
          { required: true, message: "请输入新密码", trigger: "change" }
        ],
        confirmPsd: [{ required: true, validator: checkPass, trigger: "change" }]
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
          this.$store.dispatch("handleHttp", this.handleSubmit()).catch(err=>{
              this.$refs['ruleForm'].resetFields();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSubmit() {
      var data = Object.assign(this.ruleFormData, {
        tenantId: this.tenantId,
        cardNo: this.member.cardNo,
        operator: this.operator
      });
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
  components: {
    memberInfoAndCard
  }
};
</script>
<style lang="scss">
._member-recharge {
  min-height: 93vh;
  padding-bottom: 7vh;
  position: relative;

  .member-recharge-content {
    padding: 0 2vw 2.6vh 2vw;
  }
  .recharge-info-title {
    font-size: $font-size14;
    color: #333;
    font-weight: bold;
    text-indent: 2vw;
    padding-bottom: 3vh;
  }
  .psd-inp {
    width: 65%;
  }
  .demo-ruleForm {
    margin-top: 4vh;
    width: 50vw;
  }
  .start-btn {
    margin-left: 1vw;
    border-color: #dcdfe6;
    border-radius: 0;
  }
}
</style>
