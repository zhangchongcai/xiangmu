<template>
  <el-date-picker
    class="rpt-showtime-picker"
    unlink-panels
    v-model="showTimeObj.dateTime"
    type="datetimerange"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    value-format="yyyy-MM-dd HH:mm:ss"
    :default-time="['06:00:00', '05:59:59']"
    @change="dateTimeChange"
  ></el-date-picker>
</template>

<script>
import Moment from "moment";
export default {
  props: {
    resetStatus: Boolean,
    queryName: String,
    reportCode: String,
    showTimeObj: Object
  },
  data() {
    return {};
  },
  methods: {
    dateTimeChange() {
      this.getStrTime();
    },
    getStrTime() {
      let time = this.showTimeObj.dateTime;
      if (time != null) {
        let endTime = time[1].replace("06:00:00", "05:59:59");
        time[1] = endTime;
        this.$emit("selectShowTimeData", time.join(","), this.queryName);
      } else {
        this.$emit("selectShowTimeData", "", this.queryName);
      }
    },
    init() {
      let yesterday = Moment(new Date())
        .add(-1, "days")
        .format("YYYY-MM-DD");
      let today = Moment().format("YYYY-MM-DD");
      this.showTimeObj.dateTime = [
        `${yesterday} 06:00:00`,
        `${today} 05:59:59`
      ];
    }
  },
  mounted() {
    if (this.showTimeObj.dateTime.length === 0) this.init();
    this.getStrTime();
  },
  watch: {
    resetStatus(newVal) {
      if (newVal === true) {
        this.init();
        this.getStrTime();
      }
    }
  }
};
</script>

<style lang="scss">
.rpt-showtime-picker {
  width: 356px !important;
    .el-input__icon,
    .el-range-separator,
    .el-range-input {
      font-size: 12px;
    }
}
</style>