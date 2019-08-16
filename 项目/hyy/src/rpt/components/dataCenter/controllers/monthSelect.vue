<template>
  <div class="month-select">
    <el-date-picker
      class="rpt-month-picker"
      v-model="monthSelectObj.monthValue"
      type="month"
      @change="monthValChange"
      value-format="yyyy-MM"
    ></el-date-picker>
  </div>
</template>

<script>
import Moment from "moment";
export default {
  props: {
    resetStatus: Boolean,
    queryName: String,
    monthSelectObj: Object
  },
  data() {
    return {};
  },
  methods: {
    monthValChange() {
      if (this.monthSelectObj.monthValue === null) {
        this.monthSelectObj.monthValue = "";
      }
      this.$emit(
        "selectMonthData",
        this.monthSelectObj.monthValue,
        this.queryName
      );
    },
    init() {
      let currentMonth = Moment().format("YYYY-MM");
      this.monthSelectObj.monthValue = currentMonth;
      this.$emit("selectMonthData", currentMonth, this.queryName);
    }
  },
  mounted() {
    if (this.monthSelectObj.monthValue === "") this.init();
  },
  watch: {
    resetStatus(newVal) {
      if (newVal === true) {
        this.init();
      }
    }
  }
};
</script>

<style lang="scss">
.month-select {
  display: inline-block;
}
.rpt-month-picker {
  width: 256px !important;
    .el-input__icon,
    .el-range-separator,
    .el-range-input {
      font-size: 12px;
    }
}
</style>
