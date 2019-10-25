<template>
  <el-container class="Header-Top">
    <el-header style="text-align: right; font-size: 12px">
    </el-header>
  </el-container>
</template>

<script>
export default {
  name: 'Header'
};
</script>

<style lang="scss" scoped>
//header区域
.el-header {
  background-color: #eee;
  box-shadow: 0 2px 7px 0 rgba(102, 102, 102, 0.1);
  color: #333;
  position: fixed;
  top: 0;
  left: 0;
  height: 56px;
  width: 100%;
  line-height: 56px;
  z-index: 90;
}
</style>
