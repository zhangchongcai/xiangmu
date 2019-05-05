<template>
  <div class="innerlayer">
    <div class="content">
      <div class="contentLeft">
        <el-form  label-width="169px" :model="formLabelAlign">
          <el-form-item label="旧密码：">
            <el-input v-model="formLabelAlign.name" placeholder="请输入旧密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码：">
            <el-input v-model="formLabelAlign.region" placeholder="请输入新密码" ></el-input>
            <div class="inputTip">（不少于6位英文字母与数字混合）</div>
          </el-form-item>
          <el-form-item label="确认新密码：">
            <el-input v-model="formLabelAlign.type" placeholder="请再次输入新密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="contentRight">
        <number-key-board ref="keyBoard" class="keyboard"  @keynumber="onkey"></number-key-board>
      </div>
    </div>
    <div class="footButtomLayer">
      <el-button size="medium" @click="$router.go(-1)">返回</el-button>
      <el-button type="primary" size="medium" @click="show">确定</el-button>
    </div>
    <pwd-keyboard ref="pwd" v-model="testVal"></pwd-keyboard>
  </div>
</template>
<script>
import numberKeyBoard from 'components/numberKeyBoard/index.vue'
import pwdKeyboard from 'components/pwdKeyboard/index';
export default {
  components:{
    numberKeyBoard,
    pwdKeyboard,
  },
  data(){
    return{
        formLabelAlign: {
          name: '',
          region: '',
          type: '',
        },
        testVal:'321',
    }
  },
  methods:{
    onkey(item){
      console.log(item)
    },
    show(){
      this.$refs.pwd.show()
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


 