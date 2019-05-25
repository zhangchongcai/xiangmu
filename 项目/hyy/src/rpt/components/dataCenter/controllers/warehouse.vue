<template>
  <el-select v-model="warehouseValue" placeholder="请选择" @focus="getWarehouseData">
    <el-option label="全部" value></el-option>
    <el-option v-for="item in warehouseData" :key="item.code" :label="item.name" :value="item.code"></el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    cenimaUid: String
  },
  data() {
    return {
      warehouseValue: "",
      warehouseData: []
    };
  },
  methods: {
    getWarehouseData() {
      this.$rptList
        .checkBillStorehouse({ uid: this.cenimaUid })
        .then(res => {
          if (res.code === 200) {
            this.warehouseData = res.data;
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
    warehouseValue(val) {
        console.log(val)
      this.$emit("selectWarehouseData", val);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
