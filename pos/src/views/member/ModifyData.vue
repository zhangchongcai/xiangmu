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
        @submit.native.prevent
        ref="ruleForm"
        :rules="rules"
        class="from-style">
        <!-- 手机号 -->
        <el-form-item
          class="from-item-syle"
          label="手机号"
          prop="phoneNumber">
          <el-input v-model="modifyData['phoneNumber']" class="item-inp"></el-input>
        </el-form-item>
        <!-- 其他 -->
        <!-- <template > -->
          <el-form-item
            v-for="(item,index) in ruleFormData"
            :key="index"
            class="from-item-syle"
            :label="item.label"
            :prop="item.required ? item.prop :''">
              <el-input
                v-model="modifyData[item.prop]"
                v-if="item.type === 'text'" 
                class="item-inp"></el-input>
              <el-radio-group
                  v-else-if="item.type === 'select'" 
                  v-model="modifyData[item.prop]">
                  <el-radio v-for="v in item.option" :label="v.label" :key="v.label">{{v.value}}</el-radio>
              </el-radio-group>
              <el-date-picker
                v-else-if="item.type === 'date'" 
                v-model="modifyData[item.prop]" 
                type="date" 
                placeholder="选择日期" 
                value-format='yyyy-MM-dd'
                style="width: 20vw;" 
                :clearable='false'></el-date-picker>
          </el-form-item>
        <!-- </template>        -->
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
          ref="tagInput" 
          :type="inpType"
          style="width:60%"></el-input>
        <el-button
          style="margin-left:.5vw"
          class="common-btn" 
          @click="cardInfo.type == 'phone' ? getVilidate() : _secKeyBoard()" 
          :disabled="disable"
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
      getUserData:{},
      oldPhoneNum:'',
      dialogFormVisible:false,
      inpType:'password',
      cardInfo:null,
      ruleFormData: [
        { prop: "userName", label: "姓名",type:'text',required:true}, 
        { prop: "gender", label: "性别", type: "select" ,option:[{label:'male',value:'男'},{label:'female',value:'女'}],required:true }, 
        { prop: "birthday", label: "生日", type: "date" ,required:true}, 
        { prop: "email",label:'邮箱',type:'text',required:false},
        { prop: "creditNum",label:'身份证',type:'text',required:false},
      ],
      rules: {
        phoneNumber: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: validateMobile,trigger:["change","blur"]}
        ],
        userName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { validator: validateName,trigger:"blur"}
        ],
        gender: [
          { required: true, message: "请选择性别", trigger: "change" }
        ],
        birthday: [
          { required: true, message: "请填写生日", trigger: "change" },
        ],
        email: [
          { validator : validateEmail , trigger: "change" },
        ],
        creditNum: [
          { validator : creditNum , trigger: "change" },
        ]
      }
    }
  },
  mounted() {
    this.member.isshow = false;
    this.modifyData = {...toFormModel(this.ruleFormData),password:''};
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
      this.modifyData = Object.assign({},newVal);
      this.modifyData.gender = !!newVal["sex"] ? (newVal["sex"]+'').toLowerCase() : !!newVal["gender"] ? newVal["gender"] === '男' ? 'male' : 'female' : newVal["gender"];
      this.modifyData.phoneNumber = newVal["mobileNum"] || newVal["phoneNumber"];
      this.modifyData.userName = newVal["userName"] || newVal["name"];
      this.oldPhoneNum = JSON.parse(JSON.stringify(this.modifyData.phoneNumber))
    }
  },
  computed: {
    ...mapState(["user", "member","config"]),
    ...mapGetters(['tenantId','operator']),
    modifyData:{
      get:function(){
        return this.getUserData;
      },
      set:function(value){
        this.getUserData = value;
      }
    }
  },
  methods: {
    back() {
        this.$router.go(-1);
    },
    queryData(data) {
        this.cardInfo = data;
        this.open(data);   
    },
    //启动密码输入
    _secKeyBoard(){
      this.$refs.tagInput.focus();
      if(JSON.parse(localStorage['globalAppState']))
      this.member.show = true;
      secKeyBoard(this.config.configData).then((e)=>{
        this.modifyData.password = e;
        this.member.show = false;
        this.validatorInp()
      }).catch(err=>{
        this.member.show = false;
      })
    },
    async open(data) {
      this.modifyData.password = '';
      if(data.type === 'phone'){
         this.title = '输入验证码';
         this.inpType = '';
         this.validataText = '获取验证码';
      }else{
        this.title = '输入密码';
        this.inpType = 'password';
        this.validataText = '启动密码输入';
      }
      this.dialogFormVisible = true;
      await this.$nextTick()
      this.$refs.tagInput.focus()
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
        cardNum:fullData.cardNo || '',
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
.row-line-center{
  justify-content: center;
}
</style>

