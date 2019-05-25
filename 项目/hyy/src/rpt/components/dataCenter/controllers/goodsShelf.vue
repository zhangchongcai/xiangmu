<template>
  <el-select v-model="goodsShelfValue" placeholder="请选择" @focus="getGoodsShelfData">
    <el-option label="全部" value></el-option>
    <el-option v-for="item in goodsShelfData" :key="item.code" :label="item.name" :value="item.code"></el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    cenimaUid: String
  },
  data() {
    return {
      goodsShelfValue: "",
      goodsShelfData: []
    };
  },
  methods: {
    getGoodsShelfData() {
      this.$rptList
        .checkBillStorageRack({ uid: this.cenimaUid })
        .then(res => {
          if (res.code === 200) {
            this.goodsShelfData = res.data;
            console.log(res);
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
        console.log(val)
      this.$emit("selectGoodsShelfData", val);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
