<template>
  <div class="innerlayer">
    <div class="content">
      <div class="contentLeft">
        <el-form  label-width="169px" :model="formLabelAlign">
          <el-form-item label="抽钞金额：">
            <el-input v-model="formLabelAlign.amount" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="抽钞人授权：">
            <div class="adminName">张珊<span>已授权</span></div>
          </el-form-item>
          <el-form-item label="收银员授权：">
            <el-button size="medium" :style="{width:'100%'}">授权</el-button>
          </el-form-item>
          <el-form-item >
            <el-button size="medium" type="primary" :style="{width:'100%'}" @click="refor">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="contentRight">
        <number-key-board ref="keyBoard" class="keyboard"   :showPointer="true" @keynumber="onkey"></number-key-board>
      </div>
    </div>
    <div class="footButtomLayer">
      <el-button size="medium" @click="$router.go(-1)">返回</el-button>
      <el-button type="primary" size="medium" @click="reset" >重置</el-button>
    </div>
  </div>
</template>
<script>
import numberKeyBoard from 'src/components/numberKeyBoard/index.vue'
import { extractFund } from 'http/apis'
export default {
  components:{
    numberKeyBoard,
  },
  data(){
    return{
        formLabelAlign: {
          amount: '',
          region: '',
          type: ''
        }
    }
  },
  methods:{
    onkey(item){
      console.log(item)
      this.formLabelAlign.amount = item;
    },
    async refor(){
      const data = await extractFund({
        workTimeUid:'199be385-2b1f-4616-9792-fac6f7c191da',
        amount : this.formLabelAlign.amount,
        extractUserName: '测试名',
        terminalCode:'testcode',
      })
      console.log(data);
    },
    reset(){
      this.$refs.keyBoard.keyValue = '';
      this.formLabelAlign.amount = '';
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


 