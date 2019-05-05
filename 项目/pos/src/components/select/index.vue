<template>
  <div class="selectLayer">
    <i class="selectIcon iconfont iconyuanxingxialajiantou"></i>
    <slot></slot>
  </div>
</template>
<script>
export default {
  
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
  }
</style>

