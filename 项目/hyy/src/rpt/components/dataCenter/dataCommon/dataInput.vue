<template>
  <div class="input">
    <el-input v-model="inputData" placeholder="请输入内容" clearable @change="inputChange"></el-input>
  </div>
</template>

<script>
export default {
  props: {
    inputValue: {
      type: null | Object,
      default: "",
      require: true
    }
  },
  data() {
    return {
      inputData: ""
    };
  },
  methods: {
    inputChange() {
      let newInputValue = JSON.parse(JSON.stringify(this.inputValue));
      newInputValue.queryColValue = this.inputData;
      this.$emit("inputValueChange", newInputValue);
    }
  }
};
</script>