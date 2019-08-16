<template>
  <div class="_member-home">
    <div class="member-home-title">修改资料</div>
    <div style="position:relative">
      <CardReading 
        @queryData="queryData" 
        :isApply="false" 
        :cardReadingTitle="cardReadingTitle"
        :validateText='true'/>
      <div v-show="searchError.cardName && member.cardNoOrphoneNumState" class="cardNoNameStyle">
        <span v-text="searchError.cardType"></span>
        <span style="margin-left:2vw" v-text="'卡政策：'+searchError.cardName"></span>
      </div>
    </div>
    <div class="modifyContent" v-if="member.isshow && member.cardNoOrphoneNumState">
      <div class="member-info-title">会员资料</div>
      <el-form
        :model="modifyData"
        ref="ruleForm"
        :rules="rules"
        class="from-style">
        <!-- 手机号 -->
        <el-form-item
          class="from-item-syle"
          label="手机号:"
          prop="phoneNumber">
          <el-input v-model="modifyData['phoneNumber']" class="item-inp"></el-input>
        </el-form-item>
        <!-- 姓名 -->
        <el-form-item
          class="from-item-syle"
          label="姓名:"
          v-if="modifyData['userName'] != null" 
          prop="userName">
          <el-input
            v-model="modifyData['userName'] " 
            class="item-inp"></el-input>
        </el-form-item>
        <!-- 性别 -->
        <el-form-item
          class="from-item-syle"
          label="性别:"
          v-if="modifyData['gender'] != null"
          prop="gender">
          <el-radio-group 
            v-model="modifyData['gender']">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 生日 -->
        <el-form-item
          class="from-item-syle"
          label="生日:"
          v-if="modifyData['birthday'] != null" 
          prop="birthday">
          <el-date-picker
            v-model="modifyData['birthday']" 
            type="date" 
            placeholder="选择日期" 
            value-format='yyyy-MM-dd'
            style="width: 20vw;" 
            :clearable='false'></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="foot-buttom-layer" v-if="!member.isshow">
      <el-button @click="back()" class="common-btn">返回</el-button>
    </div>
    <div class="bottom-btn-warp" v-else-if="member.isshow && member.cardNoOrphoneNumState">
      <el-button @click="back()" class="common-btn">取消</el-button>
      <el-button @click="clearRuleForm('ruleForm')" class="common-btn">清空</el-button>
      <el-button class="common-btn" @click="submit" type="primary">确定</el-button>
    </div>

    <!-- dialog pc-->
    <el-dialog 
      :title="title" 
      :visible.sync="dialogFormVisible" 
      width='40%'
      :close-on-click-modal='false'>
      <div class="row-line-center">
        <el-input 
          v-model="modifyData.password" 
          :type="inpType"
          style="width:60%"></el-input>
        <el-button
          style="margin-left:.5vw"
          class="common-btn" 
          @click="getVilidate" 
          :disabled="disable"
          v-if="member.numberType === 'phone'"
          v-text="validataText"></el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" class="common-btn">取 消</el-button>
        <el-button type="primary" @click="validatorInp" class="common-btn">确 定</el-button>
      </div>
    </el-dialog>
 
  </div>
</template>
<script>
import CardReading from "./components/cardReading";
import { mapState, mapGetters } from "vuex";
import { toFormModel , secKeyBoard } from "./util/utils";
import { creditNum, num10_999float2 ,customPasswordReg ,validateMobile,validateEmail , validateName} from "./util/validate.js";
import { memeberApi } from "src/http/memberApi";
import App from 'http/app'
import getVilidateCode from './mixins/getVilidateCode'
export default {
  mixins:[getVilidateCode],
  data() {
    return {
      modelVal:'password',
      title:'输入密码',
      cardReadingTitle: "会员卡/手机号",
      searchError: {
        cardName: "",
        cardType: ""
      },
      modifyData: {
        password:'',
        userName:'',
        gender:'',
        birthday:'',
        creditNum:'',
        email:''
      },
      oldPhoneNum:'',
      dialogFormVisible:false,
      inpType:'password',
      cardInfo:null,
      // ruleForm: [
        // { label: "身份证号", prop: "creditNum" },
        // { label: "邮箱", prop: "email" }
      // ],
      rules: {
        phoneNumber: [
          { required: true, message: "请输入电话号码", trigger: "change" },
          { validator: validateMobile,trigger:"change"}
        ],
        userName: [{ required: true, message: "请输入姓名", trigger: "change" },
         { validator: validateName,trigger:"change"}],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        birthday: [
          { required: true, message: "请填写生日", trigger: "change" },
        ],
        // creditNum: [
        //   { required: true, message: "请输入身份证号", trigger: "change" },
        //   { validator:creditNum,trigger:"change"}
        // ],
        // email: [
        //   { required: true, message: "请输入邮箱", trigger: "change" },
        //   { type: 'email',message:'请输入正确邮箱格式',trigger: ["blur",'change']}
        // ]
      }
    }
  },
  mounted() {
    this.member.isshow = false;
    if (!!this.$route.query.type) {
      this.queryData(this.$route.query);
    }
  },
  watch: {
    "member.memberCardInfo":async function(newVal, oldVal) {
      if(newVal.cardTypeCode === 'gift_card'){
          Vue.prototype.$message.warning(`${newVal.cardType}不可此操作`);
          this.member.isshow = false;
          return;
      }
      await this.$nextTick();
      this.modifyData = Object.assign({},this.modifyData,newVal)
      this.modifyData.gender = !!newVal["sex"] ? (newVal["sex"]+'').toLowerCase() : !!newVal["gender"] ? newVal["gender"] === '男' ? 'male' : 'female' : newVal["gender"] || null;
      this.modifyData.phoneNumber = newVal["mobileNum"] || newVal["phoneNumber"] || null;
      this.modifyData.userName = newVal["userName"] || newVal["name"] || null;
      this.modifyData.birthday = newVal["birthday"] || null;
      this.oldPhoneNum = JSON.parse(JSON.stringify(this.modifyData.phoneNumber))
    }
  },
  computed: {
    ...mapState(["user", "member","config"]),
    ...mapGetters(['tenantId','operator'])
  },
  methods: {
    back() {
        this.$router.go(-1);
    },
    queryData(data) {
        this.cardInfo = data;
      if(JSON.parse(localStorage['globalAppState']) && data.type === 'card'){
        this.member.show = true;
        secKeyBoard(this.config.configData).then((e)=>{
          this.modifyData.password = e;
          this.member.show = false;
          if(/^[0-9]+$/.test(e.toString().replace(/\s/g, ""))){
            this.validatorInp()
          }
        }).catch(err=>{
         this.member.show = false;
        })
      }else{
        this.open(data);
      }
    },
    open(data) {
      this.modifyData.password = '';
      if(data.type === 'phone'){
         this.title = '输入验证码';
         this.inpType = '';
      }else{
        this.title = '输入密码';
        this.inpType = 'password';
      }
      this.dialogFormVisible = true;
    },
    validatorInp(){
        if(!this.modifyData.password){
            this.$message.warning(`请${this.title}`);return
        }
        this.dialogFormVisible = false;
        let queryList;
        if(this.cardInfo.type === 'card'){
          queryList = {
            url: memeberApi.getCardInfoByNo["url"],
            params: { cardNo: this.cardInfo.phoneOrCard, tenantId: this.tenantId ,password:this.$md5(this.modifyData.password),verifyPassword:true}
          };
        }else{
          queryList = {
            url: memeberApi.getInfoByPhone["url"],
            params: { mobileNum: this.cardInfo.phoneOrCard, tenantId: this.tenantId ,validateCode:this.modifyData.password, verifyCode:true}
          };
        }
        this.member.pageLoading = true;
        this.$store.dispatch("getInfo", queryList);
    },
    submit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.$store.dispatch("handleHttp", this.handleSubmit());
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSubmit() {
      let fullData = this.modifyData;
      let data =Object.assign({},{
        mobileNum: this.oldPhoneNum,
        name: fullData.userName,
        sex: fullData.gender,
        birthday: fullData.birthday,
        creditNum: fullData.creditNum,
        email: fullData.email,
        id:this.member.numberType === 'phone' ? fullData.id : fullData.memberId,
        tenantId: this.tenantId,
        operator:this.operator
      },JSON.parse(sessionStorage['payParams'])) ;
      //修改手机号处理
      if(this.oldPhoneNum !== fullData.phoneNumber){
        data = Object.assign({},data,{
          mobileNumNew:fullData.phoneNumber
        })
      }
      return {
        url: memeberApi.modifyMemberInfo["url"],
        data: data,
        router: this.$router
      };
    },
    clearRuleForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  components: {
    CardReading
  }
};
</script>
<style lang='scss' scoped>
.from-style {
  display: flex;
  flex-wrap: wrap;
}
.from-item-syle {
  display:flex;
  align-items:center;
  width: 30vw;
  margin-top: 3vh;
  margin-bottom:0;
 }
.item-inp {
  width: 20vw;
}

</style>

