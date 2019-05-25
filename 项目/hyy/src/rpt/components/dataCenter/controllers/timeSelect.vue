<template>
  <!-- <el-date-picker
    v-model="dateTime"
    type="datetimerange"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    value-format="yyyy-MM-dd HH:mm:ss"
    @change="dateTimeChange"
  ></el-date-picker>-->
  <el-time-picker
    is-range
    v-model="time"
    range-separator="至"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    placeholder="选择时间范围"
    value-format="HH:mm:ss"
    @change="dateTimeChange"
  ></el-time-picker>
</template>

<script>
import Moment from "moment";
export default {
  data() {
    return {
      time: []
    };
  },
  methods: {
    dateTimeChange() {
      this.getStrTime();
    },
    getStrTime() {
      let currentTime = this.time;
      if (currentTime != null) {
        // let endTime = currentTime[1].replace("00:00:00", "23:59:59");
        // currentTime[1] = endTime;
        // console.log(currentTime.join(","))
        console.log(this.time)
        this.$emit("selectTimeData", currentTime.join(","));
      } else {
        this.$emit("selectTimeData", "");
      }
    }
  },
  mounted() {
    this.time = ['00:00:00', '23:59:59'];
    this.getStrTime();
  }
};
</script>

<style lang="scss" scoped>
</style>


