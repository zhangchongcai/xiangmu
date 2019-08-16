<template>
  <div class="_member-index-wrap">
    <keep-alive>
      <router-view
        class="notselect"
        v-if="$route.meta.keepAlive"
      ></router-view>
    </keep-alive>
    <router-view
      class="notselect"
      v-if="!$route.meta.keepAlive"
    ></router-view>
    <pwd-loading :show='this.$store.state.member.show'></pwd-loading>
    <pageLoading :show="this.$store.state.member.pageLoading "></pageLoading>
  </div>
</template>

<script>
import loading from "./components/loading";
import pageLoading from "./components/pageLoading";
export default {
  data() {
    return {};
  },
  components: {
    "pwd-loading": loading,
    pageLoading
  }
};
</script>

<style lang='scss'>
@import './assets/css/common.scss';
</style>