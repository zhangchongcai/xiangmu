<template>
  <div class="activity"  :class="{'on':checkVal||tipstate}" @mouseleave="tipstate=false">
    <div class="tipLayer" v-if="tipstate">
      <!-- 打发大群二二群二群的正常正常咋得到切尔奇二群大大 -->
     {{infoText}}
    </div>
    <div class="content">
      <label class="title">
        {{label}}
        <input type="checkbox"  :checked="checkVal" @change="chnage" :value="value">
      </label>
      <div @click="tipstate=true"><i class="selectIcon iconfont iconyuanxingxialajiantou"></i></div>
    </div>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'modelVal',
    event: 'change'
  },
  props: {
    value: {
      type: String,
    },
    modelVal:{
      default:false
    },
    label:{
      default:''
    },
    infoText:{
      default:''
    }
  },
  data(){
    return{
      tipstate:false
    }
  },
  computed:{
    checkVal() {
      // 判断是一个还是多个 checkbox
      if (this.modelVal instanceof Array) {
        return this.modelVal.includes(this.value)
      }
      return this.modelVal === this.value
    }
  },
  mounted(){
    
  },

  methods:{
    test(){
      console.log(1234)
    },
    chnage($event){
       const isChecked = event.target.checked
      if (this.modelVal instanceof Array) {
        const newVal = [...this.modelVal]
        if (isChecked) {
          newVal.push(this.value)
        } else {
          newVal.splice(newVal.indexOf(this.value), 1)
        }
        this.$emit('change', newVal)
      } else {
        this.$emit('change', isChecked ? this.value : '')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.activity{
  position: relative;
  padding: 0 1.3vw;
  border:1px solid;
  @include bd-color-and-font-color();
  display: inline-block;
  min-width: 20vw;
  border-radius: 4px;
  & + .activity{
    margin-left: 1vw;
  }
  .content{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title{
      display: block;
      font-size: 1.3vw;
      color:$font-color3;
      position: relative;
      flex: 1;
      overflow: hidden;
      padding: 0.9vh 0;
      cursor: pointer;
      input{
        position: absolute;
        left: -9999999px;
      }
    }
    .iconfont{
      cursor: pointer;
      font-size: 22px;
      padding: 0.9vh 0;
    }
  }
  .tipLayer{
    padding: 10px;
    font-size: $font-size12;
    color:$font-color3;
    background: #E8EEFF;
    min-height: 112px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -133px;;
    z-index: 100;
  }
}
.on{
  @include bg_color($font-color-blue);
  .content{
    .title{
      color:#fff;
    }
    .iconfont{
      color:#fff;
    }
  }
}
</style>

