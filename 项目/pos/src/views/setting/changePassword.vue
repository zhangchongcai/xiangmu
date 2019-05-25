<template>
  <div class="innerlayer">
    <div class="content">
      <div class="contentLeft">
        <el-form  label-width="169px" :model="formLabelAlign">
          <el-form-item label="旧密码：">
            <el-input v-model="formLabelAlign.oldPassword" type="password"  @focus="changKey('oldPassword')" placeholder="请输入旧密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码：">
            <el-input v-model="formLabelAlign.newPassword"  type="password" @focus="changKey('newPassword')" placeholder="请输入新密码" ></el-input>
            <div class="inputTip">（不少于6位英文字母与数字混合）</div>
          </el-form-item>
          <el-form-item label="确认新密码：">
            <el-input v-model="formLabelAlign.againNewPassword" type="password" @focus="changKey('againNewPassword')" placeholder="请再次输入新密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="contentRight">
        <number-key-board ref="keyBoard" class="keyboard"  @keynumber="onkey"></number-key-board>
      </div>
    </div>
    <div class="footButtomLayer">
      <el-button size="medium" @click="$router.go(-1)">返回</el-button>
      <el-button type="primary" size="medium" @click="onChangePassword">确定</el-button>
    </div>
    <!-- <pwd-keyboard ref="pwd" v-model="testVal"></pwd-keyboard> -->
  </div>
</template>
<script>
import numberKeyBoard from 'components/numberKeyBoard/index.vue'
// import pwdKeyboard from 'components/pwdKeyboard/index';
import {  changePassword,userLogout } from 'http/apis'
export default {
  components:{
    numberKeyBoard,
    // pwdKeyboard,
  },
  data(){
    return{
        formLabelAlign: {
          oldPassword: '',
          newPassword: '',
          againNewPassword: '',
        },
        valStr:'',
        testVal:'',
    }
  },
  methods:{
    onkey(item){
      if(!this.valStr) return
      this.formLabelAlign[this.valStr] = item
    },
    changKey(key){
      this.valStr = key;
      this.$refs.keyBoard.keyValue = this.formLabelAlign[this.valStr];
    },
    show(){
      this.$refs.pwd.show()
    },
    async onChangePassword(){
      const { oldPassword,newPassword,againNewPassword } = this.formLabelAlign;
      if(!oldPassword) return this.$message.warning('请输入旧密码!');
      if(!newPassword) return this.$message.warning('请输入新密码!');
      if(!againNewPassword) return this.$message.warning('请输入确认密码!');
      if(againNewPassword != newPassword) return this.$message.warning('新密码不一致，请重新输入！');
      const data = await changePassword({
        cinemaLicence: 'b931c317c9303855',
        user_name : localStorage.getItem('userName'),
        oldPassword,
        newPassword
      })
      if(data.code !=200) return  this.$message.error(data.msg);
      console.log(data);
      const outData = await userLogout()
      console.log(outData);
      if(outData.code !=200) return this.$message.error(outData.msg);
      this.$message.success(data.msg);
      localStorage.removeItem('token')
      this.$router.replace({name:'login'})

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
</style>


 