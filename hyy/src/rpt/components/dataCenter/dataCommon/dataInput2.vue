<template>
  <div class="input">
    <el-input v-model="etxInputData" placeholder="请输入内容" clearable @change="inputChange"></el-input>
  </div>
</template>

<script>
export default {
  props: {
    etxInputValue: {
      type: null | Object,
      default: "",
      require: true
    }
  },
  data() {
    return {
      etxInputData: ""
    };
  },
  methods: {
    inputChange() {
      let newInputValue = JSON.parse(JSON.stringify(this.etxInputValue));
      newInputValue.queryColValue = this.etxInputData;
      this.$emit('etxInputValueChange', newInputValue);
    }
  }
};
</script>

