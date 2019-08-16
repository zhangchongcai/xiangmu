<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    >
    <div class="pwdLayer">
      <span class="info">{{info}}</span>
      <ul class="pawdItems">
        <li class="item" v-for="(item,index) in pwdmax" :key="index"><i v-if="value.length > index" class="iconfont iconxinghao"></i></li>
      </ul>
      <el-input  v-show="false" :maxlength="pwdmax"  :value="value" @input="input" type="password"></el-input>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props:{
    value:{
      type:String,
      default:''
    },
    state:{
      type:Boolean,
      default:false,
    },
    title:{
      type:String,
      default:'启动密码输入',
    },
    width:{
      type:String,
      default:'42.7%'
    },
    info:{
      type:String,
      default:'请输入密码......'
    },
    pwdmax:{
      type:Number,
      default:6
    }
  },
  data(){
    return{
      visible:false,
      
    }
  },
  mounted() {
    
  },
  beforeDestroy(){
    
  },
  methods:{
    show(){
      this.visible = true;
    },
    close(){
      this.visible = false;
    },
    input(val){
      this.$emit('input',val);
    },
    keydown(key){
      console.log(key)
      switch(key.keyCode){
        case 8 :
          if(this.value.length){
            this.input(this.value.substring(0,this.value.length-1))
          }
          break;
        case 13 : 
          return;
        default:
          if(this.value.length == this.pwdmax) return
          this.input(this.value+key.key)
          break;
      }
    }
  },
  watch:{
    visible(val){
      if(val){
        window.addEventListener('keydown',this.keydown)
      }else{
        window.removeEventListener('keydown',this.keydown)
      }
    },
    value(val){
      if(val.length == this.pwdmax){
        this.$emit('confirm',val)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.pwdLayer {
  text-align: center;
  .info{
    font-size: $font-size13;
    color:$font-color6;
  }
  .pawdItems {
    padding: 2.6vh 4%;
    display: flex;
    justify-content: space-between;
    .item{
      width: 4.5vw;
      height: 6vh;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: $font-size22;
      color:$font-color3;
      border:1px solid #A7B8E4;
      border-radius: 2px;
    }
  }
}
</style>

