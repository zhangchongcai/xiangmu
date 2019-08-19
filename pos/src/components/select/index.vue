<template>
  <div class="selectLayer">
    <i @click="clickSlot" class="selectIcon iconfont iconyuanxingxialajiantou" :class="disabled?'disabled':''"></i>
    <slot></slot>
  </div>
</template>
<script>

export default {
  props:{
    disabled:{
      type:[Boolean],
      default:false,
    }
  },
  mounted(){
  },
  methods:{
    clickSlot(){
      this.$slots.default[0].elm.getElementsByTagName('input')[0].click()
    }
  }
}
</script>

<style lang="scss" scoped>
  .selectLayer{
    position: relative;
    display: inline-block;
    .selectIcon{
      position: absolute;
      z-index: 100;
      @include font_color($font-color-blue);
      font-size: 22px;
      background: #fff;
      right: 5px;
      top: 5px;
    }
    .disabled{
      background: #F5F7FA;
      color:#C0C4CC;
      border-color: #E4E7ED;
    }
  }
</style>

