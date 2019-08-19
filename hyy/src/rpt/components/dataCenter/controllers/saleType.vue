<template>
  <!-- 销售类型 -->
  <el-select
    popper-class="rpt-select"
    v-model="saleTypeObj.saleTypeValue"
    placeholder="请选择"
    @focus="getSaleType('POS_SALE_TYPE',4)"
  >
    <el-option label="全部" value></el-option>
    <el-option
      v-for="(item,index) in options[4]"
      :key="4+index"
      :label="item.keyName"
      :value="item.keyName"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    resetStatus: Boolean,
    saleTypeObj: Object
  },
  data() {
    return {
      options: [[]]
    };
  },
  methods: {
    getSaleType(name, index) {
      this.$rptList.getMoudelData("1", 100, name).then(data => {
        if (data && data.code === 200) {
          // 创建二维数组 添加数据
          this.$set(this.options, index, data.data.list);
        }
      });
    }
  },
  watch: {
    saleTypeValue(val) {
      this.$emit("selectSaleTypeData", this.saleTypeObj.saleTypeValue);
    }
  },
  resetStatus(newVal) {
    if (newVal) {
      this.saleTypeObj.saleTypeValue = "";
    }
  }
};
</script>

<style lang="sass" scoped>

</style>

