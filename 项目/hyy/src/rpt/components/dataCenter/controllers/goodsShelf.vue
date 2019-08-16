<template>
  <el-select
    popper-class="rpt-select"
    v-model="goodsShelfObj.goodsShelfValue"
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
export default {
  props: {
    cenimaUid: String,
    resetStatus: Boolean,
    goodsShelfObj: Object
  },
  data() {
    return {
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
        this.goodsShelfObj.goodsShelfValue = "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
