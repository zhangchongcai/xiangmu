<template>
  <el-select
    popper-class="rpt-select"
    v-model="queryData.queryColValue"
    placeholder="请选择"
  >
    <el-option label="全部" value></el-option>
    <el-option
      v-for="item in activityData"
      :key="item.id"
      :label="item.cnName"
      :value="item.id"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    resetStatus: Boolean,
    queryData: Object
  },
  data() {
    return {
      activityData: []
    };
  },
  mounted() {
      this.$rptList
        .getActivityData()
        .then(res => {
          this.activityData = res;
        })
        .catch(err => {});
  },
  watch: {
    resetStatus(newVal) {
      if (newVal) {
        this.queryData.queryColValue = "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
