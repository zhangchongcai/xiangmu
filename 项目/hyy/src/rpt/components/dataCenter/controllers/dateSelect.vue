<template>
  <div style="display:inline-block;">
    <el-date-picker
      unlink-panels
      v-model="dateTime"
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
      subComName: "dateSelect",
      dateTime: []
    };
  },
  methods: {
    dateTimeChange() {
      this.getStrTime();
    },
    getStrTime() {
      if (this.dateTime === null) {
        this.$emit("selectDateData", "", this.queryName);
      } else if (this.dateTime.length !== 0) {
        this.$emit("selectDateData", this.dateTime.join(","), this.queryName);
      } else {
        this.$emit("selectDateData", "", this.queryName);
      }
    },
    init() {
      let yesterday = Moment(new Date())
        .add(-1, "days")
        .format("YYYY-MM-DD");
      let today = Moment().format("YYYY-MM-DD");
      this.dateTime = [yesterday, today];
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
