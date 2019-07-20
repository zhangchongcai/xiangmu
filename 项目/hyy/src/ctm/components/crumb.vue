<template>
  <div class="curmbs">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        v-for="(item, index) in address"
        :key="index"
        :class="{'isActive':item.active}"
      >{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    address: {
      type: Array,
      default: function () {
        return [];
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.curmbs {
  margin: 20px 0;
}
/deep/ .isActive > span {
  color: #3b74ff !important;
}
</style>
