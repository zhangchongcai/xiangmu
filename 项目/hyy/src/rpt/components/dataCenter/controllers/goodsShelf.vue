<template>
  <el-select
    popper-class="rpt-select"
    v-model="goodsShelfValue"
    placeholder="请选择"
    @focus="getGoodsShelfData"
  >
    <el-option
      v-for="item in goodsShelfData"
      :key="item.code"
      :label="item.name"
      :value="item.code"
    ></el-option>
  </el-select>
</template>

<script>
import mixins from "src/frame_cpm/mixins/cacheMixin.js";
export default {
  mixins: [mixins.cacheMixin],
  props: {
    cenimaUid: String,
    resetStatus: Boolean
  },
  data() {
    return {
      cacheField: ["goodsShelfValue"],
      subComName: "goodsSelf",
      goodsShelfValue: "",
      goodsShelfData: []
    };
  },
  methods: {
    getGoodsShelfData() {
      this.$rptList
        .checkBillStorageRack({ cenimaUid: this.cenimaUid })
        .then(res => {
          if (res.code === 200) {
            this.goodsShelfData = res.data;
          } else {
            this.$message(res.msg);
            this.error(res.msg);
          }
        })
        .catch(err => {});
    }
  },
  watch: {
    goodsShelfValue(val) {
      this.$emit("selectGoodsShelfData", val);
    },
    resetStatus(newVal) {
      if (newVal) {
        this.goodsShelfValue = "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
