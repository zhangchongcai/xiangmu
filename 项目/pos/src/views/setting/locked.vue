<template>
  <div class="innerlayer">
    <div class="content">
      <img src="/static/imgs/colorLogo.png" :style="{width : '14.1vw'}" />
      <div class="inputLayer">
        <el-input
          placeholder="输入登录密码解锁"
          v-model="password"
          type="password">
          <i slot="prefix" class="iconfont iconsuoji"></i>
        </el-input>
      </div>
    </div>
    <div class="footButtomLayer">
      <el-button size="medium" @click="password=''">清空</el-button>
      <el-button type="primary" size="medium"  @click="onPersonnelAuthorization">确定</el-button>
    </div>
    <!-- <el-dialog title="操作提示" :visible.sync="visible" width="30%">
      <div class="dialogContent">
        <span class="iconLayer"><i class="iconfont " :class="dialogType"></i></span> 

        <span>这是一些文本信息这是一些文本信息这是一些文本信息这是</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visible = false">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
import {  userCheckUserInfo} from 'http/apis'
export default {
 
  data(){
    return{
        password:'',
        dialogType:'',
        visible:false
    }
  },
  methods:{
    onkey(item){
      console.log(item)
    },
    dialogOpen(){
        this.dialogType='icontishigantanhao';
        this.visible=true
    },
    async onPersonnelAuthorization(){
      if(!this.password) return this.$message.warning('请输入登录密码！')
      const data = await userCheckUserInfo({ 
        passWord: this.password,
        userName: localStorage.getItem('userAccount')
      })
      if(data.code != 200) return this.$message.error(data.msg);
      // this.$message.success(data.msg)
      this.$router.go(-1)
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
    text-align: center;
  }
}
.content{
  flex: 1
}
.footButtomLayer{
  padding: 1.3vh 0;
  text-align: right;
}
.iconsuoji {
  line-height: 1.5;
  font-size: 24px;
}
.inputLayer{
  width: 29vw;
  margin: 4vh auto 0;
}
.dialogContent{
  padding: 0 15%;
  display: flex;
  span{
    display: block;
  }
  .iconLayer{
    
    .iconfont{
      @include font_color($font-color-blue);
      font-size: 2.4vw;
    }
  }
  
}
</style>


 