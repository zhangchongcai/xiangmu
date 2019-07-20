<template>
  <el-select
    popper-class="rpt-select"
    v-model="warehouseValue"
    placeholder="请选择"
    @focus="getWarehouseData"
  >
    <el-option v-for="item in warehouseData" :key="item.code" :label="item.name" :value="item.code"></el-option>
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
      cacheField: ["warehouseValue"],
      subComName: "wareHouse",
      warehouseValue: "",
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
      console.log(val);
      this.$emit("selectWarehouseData", val);
    },
    resetStatus(newVal) {
      if (newVal) {
        this.warehouseValue = "";
        this.usefulData = [];
        this.usefulObj = {};
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
