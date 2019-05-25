<template>
  <div class="month-select">
    <el-date-picker
      v-model="monthStartValue"
      type="month"
      @change="monthStartValChange"
      value-format="yyyy-MM"
    ></el-date-picker>
    <span>至</span>
    <el-date-picker
      v-model="monthEndValue"
      type="month"
      @change="monthEndValChange"
      value-format="yyyy-MM"
    ></el-date-picker>
  </div>
</template>

<script>
export default {
  data() {
    return {
      monthStartValue: "",
      monthEndValue: "",
      mothValue: ""
    };
  },
  methods: {
    monthStartValChange() {
      if (this.monthStartValue === null) {
        this.monthStartValue = "";
      }
      console.log(this.monthStartValue);
      this.$emit("selectMonthStartData", this.monthStartValue);
    },
    monthEndValChange() {
      if (this.monthEndValue === null) {
        this.monthEndValue = "";
      }
      console.log(this.monthEndValue);
      this.$emit("selectMonthEndData", this.monthEndValue);
    }
  }
};
</script>

<style lang="scss" scoped>
.month-select {
  display: inline-block;
}
</style>
