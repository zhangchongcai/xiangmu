<template>
  <div class="month-select">
    <el-date-picker
      v-model="monthValue"
      type="month"
      @change="monthValChange"
      value-format="yyyy-MM"
    ></el-date-picker>
  </div>
</template>

<script>
import Moment from "moment";
import mixins from "src/frame_cpm/mixins/cacheMixin.js";
export default {
  mixins: [mixins.cacheMixin],
  props: {
    resetStatus: Boolean,
    queryName: String
  },
  data() {
    return {
      cacheField: [
        "monthValue"
      ],
      subComName: "monthSelect",
      monthValue: ""
    };
  },
  methods: {
    monthValChange() {
      if (this.monthValue === null) {
        this.monthValue = "";
      }
      this.$emit("selectMonthData", this.monthValue, this.queryName);
    },
    init() {
      let currentMonth = Moment().format("YYYY-MM");
      this.monthValue = currentMonth;
      this.$emit("selectMonthData", currentMonth, this.queryName);
    }
  },
  mounted() {
    this.init();
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

<style lang="scss" scoped>
.month-select {
  display: inline-block;
}
</style>
