<template>
  <div>
    <el-select
      popper-class="rpt-select"
      v-model="dicValue"
      placeholder="请选择"
      @change="getData"
      @focus="focusBTn"
    >
      <el-option label="全部" value></el-option>
      <el-option
        v-for="item in options"
        :key="`dic_${item.id}`"
        :label="item.dicName"
        :value="item.dicVal"
      ></el-option>
    </el-select>
  </div>
</template>
<script>
import mixins from "src/frame_cpm/mixins/cacheMixin.js";
export default {
  mixins: [mixins.cacheMixin],
  props: {
    resetStatus: Boolean,
    dicTag: String,
    queryColKey: String
  },
  data() {
    return {
      cacheField: ["dicValue"],
      subComName: "dic",
      options: [],
      dicValue: ""
    };
  },
  methods: {
    //选择触发事件
    getData(selVal) {
      this.$emit("selectDicData", this.dicValue, this.queryColKey);
    },
    focusBTn() {
      this.$rptList.gitDicData(this.dicTag).then(res => {
        console.log(res);
        this.options = res;
      });
    }
  },
  watch: {
    resetStatus(newVal) {
      if (newVal) {
        this.dicValue = "";
      }
    }
  }
};
</script>