<template>
  <div class="input">
    <el-input v-model="baseInputData" placeholder="请输入内容" clearable @change="inputChange"></el-input>
  </div>
</template>

<script>
export default {
  props: {
    baseInputValue: {
      type: null | Object,
      default: "",
      require: true
    }
  },
  data() {
    return {
      baseInputData: ""
    };
  },
  methods: {
    inputChange() {
      let newInputValue = JSON.parse(JSON.stringify(this.baseInputValue));
      newInputValue.queryColValue = this.baseInputData;
      this.$emit('baseInputValueChange', newInputValue);

    }
  }
};
</script>