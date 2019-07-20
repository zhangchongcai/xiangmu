<template>
  <div class="checkSing">
    <el-checkbox v-model="checkValue" @change="handCheckEvent">{{ this.queryName }}</el-checkbox>
  </div>
</template>
<script>
import mixins from "src/frame_cpm/mixins/cacheMixin.js";
export default {
  mixins: [mixins.cacheMixin],
  props: {
    queryName: String
  },
  data() {
    return {
      cacheField: [
        "checkValue",
      ],
      subComName: "comboSonGoods",
      checkValue: false
    };
  },
  methods: {
    handCheckEvent(data) {
      console.log(data);
      let selectSonGoodsData = data === true ? "1" : "0";
      this.$emit("selectComboSonGoodsData", selectSonGoodsData, this.queryName);
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