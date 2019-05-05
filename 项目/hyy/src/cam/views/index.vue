<template>
  <div class="app-container">
    <!-- <nav-menu></nav-menu>
    <Header></Header> -->
    <div class="content-wrap">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import '../assets/common.scss'
import '../assets/reset-element.scss' 
import '../assets/sale-total.scss'

// import NavMenu from "./views/partical/NavMenu";
// import Header from "./views/partical/Header";
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
//   padding-left: 136px;
//   padding-top: 60px;
}
</style>
