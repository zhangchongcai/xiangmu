<template>
  <div class="innerlayer">
    <div class="content">
      <img src="static/imgs/empower.png" :style="{width : '14.1vw'}" />
      <p>请刷卡授权…</p>
    </div>
    <div class="footButtomLayer">
      <el-button size="medium" @click="$router.go(-1)">返回</el-button>
    </div>
    <el-dialog title="操作提示" :visible.sync="visible" width="30%">
      <div class="dialogContent">
        <span class="iconLayer"><i class="iconfont " :class="dialogType"></i></span> 

        <span>这是一些文本信息这是一些文本信息这是一些文本信息这是</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
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
    p{
      font-size: 20px;
      color:#333;
      margin-top: 3vh;
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
.iconsuoji {
  line-height: 1.5;
  font-size: 24px;
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


 