<template>
  <el-date-picker
    unlink-panels
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
        "dateTime",
      ],
      subComName: "dateTimeSelect",
      dateTime: []
    };
  },
  methods: {
    dateTimeChange() {
      this.getStrTime();
    },
    getStrTime() {
      let time = this.dateTime;
      console.log(this.dateTime);
      if (time != null) {
        let endTime = time[1].replace("06:00:00", "06:00:00");
        time[1] = endTime;
        this.$emit("selectDateTimeData", time.join(","), this.queryName);
      } else {
        this.$emit("selectDateTimeData", "", this.queryName);
      }
    },
    init() {
      let yesterday = Moment(new Date())
        .add(-1, "days")
        .format("YYYY-MM-DD");
      let today = Moment().format("YYYY-MM-DD");
      this.dateTime = [`${yesterday} 06:00:00`, `${today} 06:00:00`];
    }
  },
  mounted() {
    this.init();
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

<style lang="scss" scoped>
</style>


