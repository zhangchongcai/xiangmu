<template>
  <div class="roomManage">
    <div class="cont_router">
      <router-view></router-view>
    </div>

  </div>
</template>
<script>
export default {
  name: 'cinema'
};
</script>
<style lang="scss">
.roomManage .tab {
  width: 100%;
  height: 80px;
  background: #3b74ff;
}

.cont_router {
  float: right;
  width: 100%;
}
</style>
