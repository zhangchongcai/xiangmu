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
        label-width="100px"
        class="from-style"
      >
        <el-form-item
          class="from-item-syle"
          v-for="(item,index) in ruleForm"
          :label="item.label+':'"
          :key="index"
          v-if="!item.type && !!modifyData[item.prop]"
          :prop="item.prop"
        >
          <el-input v-model="modifyData[item.prop]" class="item-inp" @focus="keyboard(`${item.prop}`)"></el-input>
        </el-form-item>
        <el-form-item
          class="from-item-syle"
          v-else-if="item.type && item.type === 'radio' && !!modifyData[item.prop]"
          :label="item.label+':'"
          :prop="item.prop"
        >
          <el-radio-group v-model="modifyData[item.prop]">
            <el-radio v-for="(v,i) in item.option" :key="i" :label="v.label">{{v.value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          class="from-item-syle"
          v-else-if="item.type && item.type === 'date' && !!modifyData[item.prop]"
          :label="item.label+':'"
          :prop="item.prop"
        >
          <el-date-picker v-model="modifyData[item.prop]" type="date" placeholder="选择日期" value-format='yyyy-MM-dd'></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="foot-buttom-layer" v-if="!member.isshow">
      <el-button size="medium" @click="back()">返回</el-button>
    </div>
    <div class="bottom-btn-warp" v-else-if="member.isshow && member.cardNoOrphoneNumState">
      <el-button @click="back()">返回</el-button>
      <el-button @click="clearRuleForm('ruleForm')">清空</el-button>
      <el-button class="submit" @click="submit">确定</el-button>
    </div>

    <!-- dialog pc-->
    <el-dialog 
      :title="title" 
      :visible.sync="dialogFormVisible" 
      width='40%'>
      <div>
        <el-input 
          v-model="modifyData.password" 
          :type="inpType"
          @focus="keyboard('password')"
          style="width:60%"></el-input>
        <el-button 
          style="margin-left:5px" 
          @click="getVilidate" 
          :disabled="disable"
          v-if="member.numberType === 'phone'"
          v-text="validataText"></el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="validatorInp">确 定</el-button>
      </div>
    </el-dialog>
 
    <KeyBoard v-model="modifyData[modelVal]" @confirm="fillContent" ref="keyboard"></KeyBoard>
  </div>
</template>
<script>
//01000300000021
import CardReading from "./components/cardReading";
import { mapState, mapGetters } from "vuex";
import { toFormModel , secKeyBoard ,getValidation} from "./util/utils";
import { creditNum, num10_999float2 ,customPasswordReg ,validateMobile,validateEmail} from "./util/validate.js";
import { memeberApi } from "src/http/memberApi";
import App from 'http/app'
import KeyBoard from 'components/keyboard'
export default {
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
      },
      oldPhoneNum:'',
      dialogFormVisible:false,
      inpType:'password',
      cardInfo:null,
      ruleForm: [
        { label: "手机号", prop: "phoneNumber"},
        { label: "姓名", prop: "userName" },
        {
          label: "性别",
          prop: "gender",
          type: "radio",
          option: [
            { label: "male", value: "男" },
            { label: "female", value: "女" }
          ]
        },
        { label: "生日", prop: "birthday", type: "date" },
        { label: "身份证号", prop: "creditNum" },
        { label: "邮箱", prop: "email" }
      ],
      rules: {
        phoneNumber: [
          { required: true, message: "请输入电话号码", trigger: "change" },
          { validator: validateMobile,trigger:"blur"}
        ],
        userName: [{ required: true, message: "请输入姓名", trigger: "change" }],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        birthday: [
          { required: true, message: "请填写生日", trigger: "change" },
        ],
        creditNum: [
          { required: true, message: "请输入身份证号", trigger: "change" },
          { validator:creditNum,trigger:"blur"}
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "change" },
          { type: 'email',message:'请输入正确邮箱格式',trigger: ["blur",'change']}
        ]
      },
      disable:false,
      validataText:'获取验证码'
    };
  },
  created(){
    this.member.isshow = false;
  },
  mounted() {
    if (!!this.$route.query.type) {
      this.queryData(this.$route.query);
    }
  },
  watch: {
    "member.memberCardInfo": function(newVal, oldVal) {
      this.$nextTick(() => {
          this.modifyData = Object.assign({},newVal, {
            gender: !!newVal["sex"] ? (newVal["sex"]+'').toLowerCase() : (newVal["gender"]+'').toLowerCase(),
            phoneNumber: !!newVal["mobileNum"] ? newVal["mobileNum"] : newVal["phoneNumber"],
            userName: !!newVal["userName"] ? newVal["userName"] : newVal["name"],
          });
          this.oldPhoneNum = JSON.parse(JSON.stringify(this.modifyData.phoneNumber))
      });
    },
  },
  computed: {
    ...mapState(["user", "member","config"]),
    ...mapGetters(['tenantId','operator'])
  },
  methods: {
    keyboard(modelType){
      this.modelVal = modelType;
      this.$refs.keyboard.show()
    },
    fillContent(val){
      this.modifyData[this.modelVal] = val;
    },
    back() {
      if(this.$route.query.phoneOrCard){
        this.$router.push({
          name: "queryDetails",
          query:this.$route.query
        })
      }else{
        this.$router.go(-1);
      }
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
      console.log(this.member.numberType)
      let data = {
        mobileNum: this.oldPhoneNum,
        name: fullData.userName,
        sex: fullData.gender,
        birthday: fullData.birthday,
        creditNum: fullData.creditNum,
        email: fullData.email,
        id:this.member.numberType === 'phone' ? fullData.id : fullData.memberId,
        tenantId: this.tenantId,
        operator:this.operator
      };
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
    },
    getVilidate(){
      getValidation.bind(this)(()=>{
        return this.$store.dispatch('sendViladate',{phoneNumber:this.member.phoneNum,tenantId:this.tenantId})
      })
    }
  },
  components: {
    CardReading,
    KeyBoard
  }
};
</script>
<style lang='scss' scoped>
.member-info-title {
  font-size: 1.4vw;
  color: #333;
  font-weight: bold;
  text-indent: 2vw;
}
.from-style {
  display: flex;
  flex-wrap: wrap;
}
.from-item-syle {
  width: 30vw;
  margin-top: 3vh;
}
.item-inp {
  width: 20vw;
}
</style>

