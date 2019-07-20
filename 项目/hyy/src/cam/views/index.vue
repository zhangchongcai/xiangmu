<template>
    <div class="cam-content-wrap">
        <router-view></router-view>
    </div>
</template>
<script>
import 'v-charts/lib/style.css'
export default {
  // name: "App",
  data() {
    return {};
  },
};
</script>
<style lang="scss" scope>
@import "../assets/common.scss"; 
.cam-content-wrap{
    padding-left:14px;
    padding-right:14px;
    padding-top:10px;
}
</style>
    