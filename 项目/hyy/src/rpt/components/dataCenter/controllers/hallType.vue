<template>
  <el-select
    popper-class="rpt-select"
    v-model="hallTypeValue"
    placeholder="请选择"
    @focus="getHallType('CI_HALL_TYPE',2)"
  >
    <el-option label="全部" value></el-option>
    <el-option
      v-for="(item,index) in options[2]"
      :key="2+index"
      :label="item.keyName"
      :value="item.keyName"
    ></el-option>
  </el-select>
</template>

<script>
import mixins from "src/frame_cpm/mixins/cacheMixin.js";
export default {
  mixins: [mixins.cacheMixin],
  props: {
    resetStatus: Boolean
  },
  data() {
    return {
      cacheField: ["hallTypeValue"],
      subComName: "hallType",
      hallTypeValue: "",
      options: [[]]
    };
  },
  methods: {
    getHallType(name, index) {
      this.$rptList.getMoudelData("1", 100, name).then(data => {
        if (data && data.code === 200) {
          // 创建二维数组 添加数据
          this.$set(this.options, index, data.data.list);
        }
      });
    }
  },
  watch: {
    hallTypeValue(val) {
      this.$emit("selectHallTypeData", this.hallTypeValue);
    },
    resetStatus(newVal) {
      if (newVal) {
        this.hallTypeValue = "";
      }
    }
  }
};
</script>

<style lang="sass" scoped>

</style>


