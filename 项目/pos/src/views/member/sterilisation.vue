<template>
  <div>
      <!-- @submit="submit" -->
    <memberInfoAndCard
      @isShow="isShow"
      :memberTitle="memberTitle"
      :ruleFormData="ruleForm"
      :submitShow='true'
      :cardStatus="cardStatus"
      :cardJudge='true'
      :isshow='isshow'
    >
      <div slot="addBlock" v-show="isshow && member.cardNoOrphoneNumState">
        <el-form
          @submit.native.prevent
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          style="width:100%"
          class="demo-ruleForm"
        >
          <div style="position:relative;margin-top:-22px">
            <div class="recharge-info-title">验证身份</div>
            <el-form-item label="短信验证码" prop="validateCode" v-if="numberType === 'phone'">
              <el-input 
                v-model="ruleForm.validateCode" 
                class="psd-inp"
                @focus="keyboard"></el-input>
              <el-button class="start-btn" 
              @click="getVilidate" 
              v-text="validataText" 
              :disabled="disable"></el-button>
              <el-button class="start-btn" 
              icon="el-icon-search" circle
              @click="handleSearch">查询</el-button>
            </el-form-item>
            <el-form-item label="输入密码" prop="password" v-else>
              <el-input type="password" 
                v-model="ruleForm.password" 
                class="psd-inp" 
                @keyup.enter.native="handleSearch"></el-input>
              <el-button class="start-btn" @click="startKeyBorad" v-text="pwdText"></el-button>
              <el-button class="start-btn" 
              icon="el-icon-search" circle
              @click="handleSearch">查询</el-button>
            </el-form-item>
          </div>
          <div
            style="position:relative;margin-top:22px"
            v-if="orderList">
            <div class="recharge-info-title">订单列表</div>
          </div>  
            <el-table 
              stripe
              :data='orderList'
              v-if="orderList"
              :header-cell-style="tableHeaderColor"
              style="width:96%;margin:auto">
                <el-table-column
                  label="订单编号">
                  <template slot-scope="scope">
                      {{scope.row.outOrderNo | filterData}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="交易时间"
                  width="180">
                  <template slot-scope="scope">
                      {{scope.row.transactionTime | filterData}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="交易编号"
                  width="180">
                  <template slot-scope="scope">
                      {{scope.row.flowNo | filterData}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="充值金额">
                  <template slot-scope="scope">
                      {{scope.row.basicAmount | filterData}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="交易渠道">
                  <template slot-scope="scope">
                      {{scope.row.channelName | filterData}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="冲销状态">
                   <template slot-scope="scope">
                      {{scope.row.isCancel === 0 ? '未冲销' : '已冲销'}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                      <el-button @click="handleSter(scope.row)" type="text" size="small">冲销</el-button>
                  </template>
                </el-table-column>
            </el-table>
        </el-form>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="3"
          :current-page="pageNo"
          @current-change='handleCurrentChange'
          v-if="total != 0"
          class="pagination">
        </el-pagination>
      </div>
    </memberInfoAndCard>
     
    <KeyBoard v-model="ruleForm.validateCode" @confirm="fillContent" ref="keyboard"></KeyBoard>
  </div>
</template>

<script>
import KeyBoard from 'components/keyboard'
import memberInfoAndCard from "./components/memberInfoAndCard";
import { mapState, mapGetters } from "vuex";
import { MemberAjax, memeberApi } from "src/http/memberApi";
import { readCard ,secKeyBoard ,getValidation ,statusDeter , cardStatusCN} from './util/utils'
export default {
  data() {
    return {
      memberTitle: "冲销",
      cardReadingTitle: "会员卡/手机号：",
      isshow: false,
      tableShow:false,//输入密码后展示数据
      total:0,
      pageNo:1,
      cardStatus:['normal'],
      disable:false,
      validataText:'获取验证码',
      pwdText:"启动密码输入",
      cardTypeShowOrHide:true,
      ruleForm: {
        password: "",
        validateCode: ""
      },
      orderList:null,
      rules: {
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        validateCode: [
          { required: true, message: "请输入验证码", trigger: "change" }
        ]
      },
      swiperOption:{
        slidesPerView: 3,
        spaceBetween: 30
      }
    };
  },
  computed: {
    ...mapState(["member","config"]),
    ...mapGetters(['tenantId']),
    numberType(){
      return this.member.numberType;
    }
  },
  watch: {
    "member.getOrderList":function(val){
          this.orderList = val.records;
          this.total = Number(val.total)
      }
  },
  methods: {
    keyboard(){
      this.$refs.keyboard.show()
    },
    fillContent(val){
      this.ruleForm.validateCode = val;
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color:#e5eafd;color:#333;font-size:20px";
      }
    },
    isShow(data) {
      this.$refs['ruleForm'].resetFields();
      this.orderList = null;
      this.total = 0;
      this.ruleForm.password = '';
      this.ruleForm.validateCode = '';
      if(statusDeter.call(this,data,'normal',`该卡状态为${cardStatusCN(this.member.cardState)},不能冲销操作`)){
        if(this.member.cardTypeCode && this.member.cardTypeCode !== 'stored_card'){
          this.$message.warning(`${this.member.cardTypeCode === 'equity_card' ? '权益卡' : '联名卡'}不能冲销`);
          this.member.memberCardInfo = '';
          return;
        }
        this.isshow = data;
      }
    },
    getOrderList(pageNo){
      let paramsObj = {
          cardNo:this.member.cardNo,
          current:pageNo,
          memberId:this.member.memberCardInfo['memberId'],
          size:3,
          tenantId:this.tenantId,
          validateCode:this.ruleForm.validateCode,
          password:this.ruleForm.password ? this.$md5(this.ruleForm.password) : '',
          phoneNum:this.member.phoneNum
      };
      let params = {
        url: memeberApi.queryTradeRecord["url"],
        params: paramsObj,
      }
      this.$store.dispatch('getOrderList',params)
    },
    handleCurrentChange(val){
      this.pageNo = val;
      this.getOrderList(val)
    },
    handleSter(item){
      this.$confirm('确定冲销该订单么？', '冲销确认', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
        .then(() => {
          this.handleSubmit(item)
        })
        .catch(action => {
          
        });
    },
    handleSubmit(item){
      let data = {
        channelId:item.channelId,
        oldFlowNo:item.flowNo,
        tenantId:this.tenantId,
        cinemaName:localStorage['cinemaName']
      };
      MemberAjax.offset(data).then(res => {
        if(res.code === 200){
          this.$message({
              message:res.msg,
              type:'success'
          })
          this.handleCurrentChange(this.pageNo)
        }
      })
    },
    handleSearch(){
      if(!this.ruleForm.validateCode && this.member.numberType === 'phone'){
        this.$message.warning('请输入验证码');return;
      }else if(!this.ruleForm.password && this.member.numberType === 'card'){
        this.$message.warning('请输入密码');return;
      }else if(!this.member.cardNo){
        this.$message.warning('请选择一张卡');return;
      }
      this.getOrderList(1)
    },
    startKeyBorad(){
      if(JSON.parse(localStorage['globalAppState'])){
        this.member.show = true;
      }
      secKeyBoard(this.config.configData).then((re)=>{
        this.ruleForm.password = re;
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
  filters:{
    filterData(val){
      if(!val){
        return '--'
      }else{
        return val;
      }
    }
  },
  components: {
    memberInfoAndCard,
    KeyBoard
  }
};
</script>
<style scoped>
.psd-inp{
    width:20vw!important
}
.pagination{
  text-align:center;
  margin:4vh 0 0 ;
}
</style>


