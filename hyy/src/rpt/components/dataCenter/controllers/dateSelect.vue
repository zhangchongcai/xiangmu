<template>
  <div style="display:inline-block;">
    <el-date-picker
      unlink-panels
      class="rpt-data-picker"
      v-model="dateSelectObj.dateTime"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
      @change="dateTimeChange"
    ></el-date-picker>
  </div>
</template>

<script>
import Moment from "moment";
export default {
  props: {
    resetStatus: Boolean,
    queryData: Object,
    dateSelectObj: Object
  },
  data() {
    return {};
  },
  methods: {
    dateTimeChange() {
      this.getStrTime();
    },
    getStrTime() {
      if (this.dateSelectObj.dateTime === null) {
        this.$emit("selectDateData", "", this.queryData.queryName);
      } else if (this.dateSelectObj.dateTime.length !== 0) {
        this.$emit(
          "selectDateData",
          this.dateSelectObj.dateTime.join(","),
          this.queryData.queryName
        );
      } else {
        this.$emit("selectDateData", "", this.queryData.queryName);
      }
    },
    handleTime(timeType) {
      return Moment(new Date())
        .add(-Number(this.queryData.defVALUE[0]), timeType)
        .format("YYYY-MM-DD");
    },
    init() {
      let oldTime;
      if (this.queryData.defVALUE === "" || this.queryData.defVALUE == null) {
        oldTime = Moment(new Date())
          .add(-1, "days")
          .format("YYYY-MM-DD");
      } else {
        if (this.queryData.defVALUE[1] == "Y") {
          oldTime = this.handleTime("years");
        } else if (this.queryData.defVALUE[1] == "M") {
          oldTime = this.handleTime("months");
        } else if (this.queryData.defVALUE[1] == "D") {
          oldTime = this.handleTime("days");
        }
      }
      let nowTime = Moment().format("YYYY-MM-DD");
      this.dateSelectObj.dateTime = [oldTime, nowTime];
    }
  },
  mounted() {
    if (this.dateSelectObj.dateTime.length === 0) this.init();
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
.rpt-data-picker {
  width: 256px !important;
  .el-input__icon,
  .el-range-separator,
  .el-range-input {
    font-size: 12px;
  }
}
</style>
