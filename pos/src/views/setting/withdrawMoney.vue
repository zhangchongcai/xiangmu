<template>
  <div class="innerlayer">
    <div class="content">
      <div class="contentLeft">
        <el-form  label-width="169px" :model="formLabelAlign">
          <el-form-item label="抽钞金额：">
            <el-input v-model="formLabelAlign.amount" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="抽钞人授权：">
            <div class="adminName" v-if="adminAuthorization">{{adminAuthorizationData.fullName}}<span>已授权</span></div>
            <el-button size="medium" @click="onAdminAuthorization" :style="{width:'100%'}" v-else>授权</el-button>
            
          </el-form-item>
          <el-form-item label="收银员授权：">
            <div class="adminName" v-if="personnelAuthorization">{{userName}}<span>已授权</span></div>
            <el-button v-else size="medium" @click="show = true" :style="{width:'100%'}">授权</el-button>
          </el-form-item>
          <el-form-item >
            <el-button size="medium" type="primary" :style="{width:'100%'}" 
            @click="refor"
            :loading="reforLoading"
            :disabled="adminAuthorization && personnelAuthorization ? false : true">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="contentRight">
        <number-key-board ref="keyBoard" class="keyboard"  v-model="formLabelAlign.amount" :showPointer="true" @keynumber="onkey"></number-key-board>
      </div>
    </div>
    <div class="footButtomLayer">
      <!-- <el-button @click="test">打印</el-button> -->
      <el-button size="medium" @click="$router.go(-1)">返回</el-button>
      <el-button type="primary" size="medium" @click="reset" >重置</el-button>
    </div>
    <el-dialog title="操作提示" :visible.sync="show" @close="password = ''" width="50%">
      <div class="dialogContent">
        <div class="formlayer" >
          <el-form ref="form" label-width="120px" >
            <el-form-item label="登录密码：">
              <el-input  type="password"  v-model="password"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="onPersonnelAuthorization">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import numberKeyBoard from 'src/components/numberKeyBoard/index.vue'
import { extractFund ,userCheckUserInfo,posticketreprint} from 'http/apis'
import { EMPOWER_SET_SHOW } from 'types'
import   authorizeTypes   from 'types/authorizeTypes'
import {  VM_AUTHORIZATION_CALLBACK} from 'types/vmOnType'
import { mapMutations,mapState } from 'vuex'
import app from 'http/app'
import printing from 'http/printing'
export default {
  components:{
    numberKeyBoard,
  },
  data(){
    return{
        formLabelAlign: {
          amount: '',
          region: '',
          type: '',
        },
        show:false,
        password:'',
        reforLoading:false,
        adminAuthorization:false,
        personnelAuthorization:false,
        adminAuthorizationData:{},
    }
  },
  mounted(){
    this.$vm.$on(VM_AUTHORIZATION_CALLBACK,(data)=>{
      // console.log(data)
      if(data.code !=200) return
      this.adminAuthorization = true;
      this.adminAuthorizationData = data.data;
    })
  },
  beforeDestroy(){
    this.$vm.$off(VM_AUTHORIZATION_CALLBACK)
  },
  computed:{
    ...mapState({
      userName : state => state.global.userName,
      terminalId: state => state.global.terminalId,
      config : state => state.config.configData
    })
  },
  methods:{
    test(){
      let data = new printing()
      let bb = data.couponVoucher();
      // console.log(bb )
      app.printTicket('bill_print',bb,this.config,()=>{
        // console.log(123)
      })
    },
    ...mapMutations({
      EMPOWER_SET_SHOW
    }),
    onkey(item){
      // console.log(item)
      this.formLabelAlign.amount = item;
    },
    async refor(){
      if(!this.formLabelAlign.amount) return this.$message.warning('请输入金额！');
      if(!this.adminAuthorization) return this.$message.warning('请先抽钞人授权！');
      if(!this.personnelAuthorization) return this.$message.warning('请先收银员授权！');
      this.reforLoading = true;
      const data = await extractFund({
        entity:{
          workTimeUid:localStorage.getItem('workTimeUid'),
          amount : this.formLabelAlign.amount,
          extractUserName: this.adminAuthorizationData.fullName,
          extractUserUid:this.adminAuthorizationData.uid,
          terminalCode:this.terminalId,
        },
        recodeUid : this.adminAuthorizationData.recodeUid,
      })
      this.reforLoading = false
      // console.log(data);
      if(data.code !=200) return this.$message.error(data.msg);
      this.$message.success(data.msg)
      this.reset()
    },
    reset(){
      this.$refs.keyBoard.keyValue = '';
      this.formLabelAlign.amount = '';
      this.adminAuthorization = false;
      this.personnelAuthorization = false;
      this.adminAuthorizationData = {};
    },
    onAdminAuthorization(){
      this[EMPOWER_SET_SHOW]({
        show:true,
        type:authorizeTypes.TimeExtractFund,
      })
    },
    async onPersonnelAuthorization(){
      const data = await userCheckUserInfo({ 
        passWord: this.password,
        userName: localStorage.getItem('userAccount')
      })
      // const data = await posticketreprint({ 
      //   passWord: this.password,
      //   userName: localStorage.getItem('userAccount')
      // })
      // console.log(data);
      if(data.code != 200) return this.$message.error(data.msg);
      this.$message.success(data.msg)
      this.personnelAuthorization = true;
      this.show = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.innerlayer{
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  padding-top: 20vh;
  flex: 1;
  .content{
    display: flex;
    .contentLeft{
      flex: 1;
    }
    .contentRight{
      flex:1;
      text-align: center;
      .keyboard{
        font-size: 30px;
        width: 32vw;
        margin: 0 auto;
      }
    }
  }
}
.content{
  flex: 1
}
.footButtomLayer{
  padding: 1.3vh 0;
  text-align: right;
}
.inputTip{
  font-size: 12px;
  color:#999;
  position: absolute;
  bottom: -32px;
}
.adminName{
  font-size: 15px;
  span{
    border:1px solid #FF7900;
    color:#FF7900 ;
    border-radius: 20px;
    padding: 0 3px;
    margin-left: 10px;
    font-size: 12px;
  }
}
</style>


 