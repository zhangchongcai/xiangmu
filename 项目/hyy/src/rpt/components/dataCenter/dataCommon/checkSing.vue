<template>
  <div class="checkSing">
    <el-checkbox
      v-model="checkValue"
      @change="handCheckEvent"
    >{{this.selectValue.queryName}}</el-checkbox>
  </div>
</template>
<script>
export default {
  props: {
    selectValue: {
      type: null | Object,
      default: "",
      require: true
    }
  },
  data() {
    return {
      newselectValue: this.selectValue,
      checkValue: Boolean(this.selectValue.queryColValue)
    };
  },
  watch: {},
  created(){
    console.log(this.checkValue);
  },
  methods: {
    handCheckEvent: function() {
      this.selectValue.queryColValue = this.checkValue.toString();
    }
  }
};
</script>

<style Scoped>
.checkSing {
  margin-left: 15px;
}
/*.el-dialog__body{
    height: 500px;
    overflow: hidden;
}*/
</style>