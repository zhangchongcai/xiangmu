<template>
  <!-- 销售类型 -->
  <el-select v-model="saleTypeValue" placeholder="请选择" @focus="getSaleType('POS_SALE_TYPE',4)">
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
  data() {
    return {
      saleTypeValue: "",
      options: [[]]
    };
  },
  methods: {
    getSaleType(name, index) {
      this.$rptList.getMoudelData("1", 100, name).then(data => {
        console.log(data, index);
        if (data && data.code === 200) {
          // 创建二维数组 添加数据
          this.$set(this.options, index, data.data.list);
        }
      });
    }
  },
  watch: {
    saleTypeValue(val) {
      console.log(this.options);
      this.$emit("selectSaleTypeData", this.saleTypeValue);
    }
  }
};
</script>

<style lang="sass" scoped>

</style>

