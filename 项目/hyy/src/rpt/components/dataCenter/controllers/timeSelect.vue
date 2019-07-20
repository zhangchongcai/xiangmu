<template>
  <el-time-picker
    unlink-panels
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
        "time"
      ],
      subComName: "timeSelect",
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
        console.log(this.time);
        this.$emit("selectTimeData", currentTime.join(","), this.queryName);
      } else {
        this.$emit("selectTimeData", "", this.queryName);
      }
    }
  },
  mounted() { 
    this.time = ["00:00:00", "23:59:59"];
    this.getStrTime();
  },
  watch: {
    resetStatus(newVal) {
      if (newVal === true) {
        this.time = ["00:00:00", "23:59:59"];
        this.getStrTime();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>


