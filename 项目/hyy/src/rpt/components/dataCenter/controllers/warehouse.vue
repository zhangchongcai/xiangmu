<template>
  <el-select
    popper-class="rpt-select"
    v-model="warehouseObj.warehouseValue"
    placeholder="请选择"
    @focus="getWarehouseData"
  >
    <el-option v-for="(item,index) in warehouseData" :key="`${item.code}_${index}`" :label="item.name" :value="item.code"></el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    cenimaUid: String,
    resetStatus: Boolean,
    warehouseObj: Object
  },
  data() {
    return {
      warehouseData: []
    };
  },
  methods: {
    getWarehouseData() {
      this.$rptList
        .checkBillStorehouse({ cenimaUid: this.cenimaUid })
        .then(res => {
          if (res.code === 200) {
            this.warehouseData = res.data;
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
      this.$emit("selectWarehouseData", val);
    },
    resetStatus(newVal) {
      if (newVal) {
        this.warehouseData.warehouseValue = "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
