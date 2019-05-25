<template>
    <div class="_member-index-wrap">
        <router-view class="notselect"></router-view>
        <pwd-loading :show='this.$store.state.member.show'></pwd-loading> 
        <pageLoading :show="this.$store.state.member.pageLoading"></pageLoading>
    </div>
</template>

<script>
import loading from './components/loading'
import pageLoading from './components/pageLoading'
export default {
    data(){
      return {}
    },
    components:{
      "pwd-loading":loading,
      pageLoading
    }
  }
</script>

<style lang="scss">
._member-index-wrap{
  // 会员页面title样式
  .member-home-title {
    font-size: $font-size16;
    @include bg_color($background-color-theme);
    padding: 1.3vh 3vw;
    color: $font-color-white;
  }
  // 底部返回按钮样式
  .foot-buttom-layer {
    position: fixed;
    left: 2vw;
    right: 2vw;
    bottom: 2.6vh;
    text-align: right;
  }
}

.bottom-btn-warp {
    position: fixed;
    right: 2vw;
    bottom: 2.6vh;
    text-align: right;
    width:50vw;
    button {
      cursor: pointer;
      text-align: center;
      margin-left: 1.5vw;
    }
  }
.notselect {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>