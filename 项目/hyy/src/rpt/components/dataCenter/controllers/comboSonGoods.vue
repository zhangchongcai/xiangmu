<template>
  <div class="checkSing">
    <el-checkbox v-model="comboSonGoodsObj.checkValue" @change="handCheckEvent">{{ this.queryName }}</el-checkbox>
  </div>
</template>
<script>
export default {
  props: {
    queryName: String,
    comboSonGoodsObj: Object
  },
  data() {
    return {};
  },
  methods: {
    handCheckEvent(data) {
      let selectSonGoodsData = data === true ? "1" : "0";
      this.$emit("selectComboSonGoodsData", selectSonGoodsData, this.queryName);
    }
  }
};
</script>

<style lang="scss" scoped>
.checkSing {
  margin-left: 15px;
  height: 32px;
  line-height: 32px;
  /deep/ .el-checkbox {
    .el-checkbox__label {
      font-weight: normal;
      font-size: 12px;
    }
  }
}
</style>
