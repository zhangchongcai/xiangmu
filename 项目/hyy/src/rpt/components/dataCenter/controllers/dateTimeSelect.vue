<template>
  <el-date-picker
    v-model="dateTime"
    type="datetimerange"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    value-format="yyyy-MM-dd HH:mm:ss"
    @change="dateTimeChange"
  ></el-date-picker>
</template>

<script>
import Moment from "moment";
export default {
  data() {
    return {
      dateTime: []
    };
  },
  methods: {
    dateTimeChange() {
      this.getStrTime();
    },
    getStrTime() {
      let time = this.dateTime;
      if (time != null) {
        let endTime = time[1].replace("00:00:00", "23:59:59");
        time[1] = endTime;
        this.$emit("selectDateTimeData", time.join(","));
      } else {
        this.$emit("selectDateTimeData", "");
      }
    }
  },
  mounted() {
    let nowTime = Moment().format("YYYY-MM_DD");
    this.dateTime = [`${nowTime} 00:00:00`, `${nowTime} 23:59:59`];
    this.getStrTime();
  }
};
</script>

<style lang="scss" scoped>
</style>


