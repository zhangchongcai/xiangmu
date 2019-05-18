<template>
  <div class="app-container">
    <div class="content-wrap">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import '../assets/common.scss'
export default {
  name: "App",
  data() {
    return {};
  },
};
</script>
<style lang="scss">
html,
body,
.app-container {
  width: 100%;
  margin:0px;
}
.content-wrap {
  box-sizing: border-box;
  background: #eee;
  width: 100%;
}
</style>
