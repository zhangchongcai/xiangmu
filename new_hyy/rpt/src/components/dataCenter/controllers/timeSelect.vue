<template>
  <el-time-picker class="rpt-time-picker" unlink-panels is-range v-model="timeSelectObj.time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" value-format="HH:mm:ss" @change="dateTimeChange"></el-time-picker>
</template>

<script>
import Moment from 'moment';
export default {
  props: {
    resetStatus: Boolean,
    queryName: String,
    timeSelectObj: Object
  },
  data () {
    return {
    };
  },
  methods: {
    dateTimeChange () {
      this.getStrTime();
    },
    getStrTime () {
      let currentTime = this.timeSelectObj.time;
      if (currentTime != null) {
        this.$emit('selectTimeData', currentTime.join(','), this.queryName);
      } else {
        this.$emit('selectTimeData', '', this.queryName);
      }
    }
  },
  mounted () {
    this.timeSelectObj.time = ['00:00:00', '23:59:59'];
    this.getStrTime();
  },
  watch: {
    resetStatus (newVal) {
      if (newVal === true) {
        this.timeSelectObj.time = ['00:00:00', '23:59:59'];
        this.getStrTime();
      }
    }
  }
};
</script>

<style lang="scss">
.rpt-time-picker {
  width: 256px !important;
  .el-input__icon,
  .el-range-separator,
  .el-range-input {
    font-size: 12px;
  }
}
</style>


