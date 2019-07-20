<template>
  <div class="input">
    <el-input v-model="inputData" placeholder="请输入内容" clearable @change="inputChange"></el-input>
  </div>
</template>

<script>
import mixins from "src/frame_cpm/mixins/cacheMixin.js";
export default {
  mixins: [mixins.cacheMixin],
  props: {
    inputValue: {
      type: null | Object,
      default: "",
      require: true
    },
    resetStatus: Boolean,
    queryName: String
  },
  data() {
    return {
      cacheField: [
        "inputData",
      ],
      subComName: "dataInput",
      inputData: ""
    };
  },
  methods: {
    inputChange() {
      let newInputValue = JSON.parse(JSON.stringify(this.inputValue));
      newInputValue.queryColValue = this.inputData;
      this.$emit("inputValueChange", newInputValue, this.queryName);
    }
  },
  watch: {
    resetStatus(newVal) {
      if (newVal) {
        this.inputData = "";
      }
    }
  }
};
</script>