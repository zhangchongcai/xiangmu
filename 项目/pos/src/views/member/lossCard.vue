<template>
  <div>
    <memberInfoAndCard
      @isShow="isShow"
      @submit="submit"
      :memberTitle="memberTitle"
      :ruleFormData="ruleFormData"
      :submitText="true"
      :cardOperation='true'
      :cardStatus='cardStatus'
      :isshow='isshow'>
    <div slot="addBlock" v-show="isshow">
      <el-form
        @submit.native.prevent
        :model="ruleFormData"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm">
        <div style="position:relative;margin-top:-22px">
          <div class="recharge-info-title">密码验证</div>
          <el-form-item
            label="输入密码"
            prop="passwd"
          >
            <el-input type="password" v-model="ruleFormData.passwd" class="psd-inp"></el-input>
            <el-button class="start-btn" @click="secKeyBoard">启动密码输入</el-button>
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
import { toFormModel ,readCard ,secKeyBoard, cardStatusCN, statusDeter} from "./util/utils";
import {MemberAjax,memeberApi} from "src/http/memberApi";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      memberTitle:"挂失/解挂",
      isshow: false,
      ruleFormData: {
        passwd:'',
        cardNo:''
      },
      cardStatus:['normal','loss'],
      rules: {
        passwd: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState(["member","config"]),
    ...mapGetters(['tenantId','operator'])
  },
  mounted() {
    if (this.$route.query.phoneOrCard) {
      this.queryData(this.$route.query);
    }
  },
  methods: {
    isShow(data) {
      this.isshow = statusDeter.call(this,data,'loss','normal',`该卡状态为${cardStatusCN(this.member.cardState)},不能挂失或解操作`);
      if(this.isshow)this.$refs['ruleForm'].resetFields();
    },
    submit(vo) {
      if(vo){
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
      }
    },
    handleSubmit() {
      var data = Object.assign(this.ruleFormData, {
        tenantId: this.tenantId,
        cardNo: this.member.cardNo,
        operator: this.operator,
        lossType:this.member.cardState === 'normal' ? 0 : 1
      });
      data.passwd = this.$md5(data.passwd);
      return {
        url: memeberApi.changeLoss["url"],
        data: data,
        router: this.$router
      }
    },
    secKeyBoard(){
      if(JSON.parse(localStorage['globalAppState'])){
        this.member.show = true;
      }
      secKeyBoard(this.config.configData).then((re)=>{
        this.ruleFormData.passwd = re;
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