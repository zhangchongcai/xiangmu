<template>
  <div class="input">
    <el-input v-model="queryData.queryColValue" placeholder="请输入内容" clearable @change="inputChange"></el-input>
  </div>
</template>

<script>
export default {
  props: {
    resetStatus: Boolean,
    queryName: String,
    queryData: Object
  },
  data() {
    return {};
  },
  methods: {
    inputChange() {
      this.$emit("inputValueChange", this.queryData.queryColValue, this.queryName);
    }
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