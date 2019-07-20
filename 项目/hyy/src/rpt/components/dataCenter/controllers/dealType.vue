<template>
  <div>
    <!-- 交易类型(含会员) -->
    <el-select
      v-model="dealTypeValue"
      placeholder="请选择"
      popper-class="rpt-select"
      @focus="getdealType('POS_SALE_BILL_BILL_TYPE_HAS_MEMBER',0)"
    >
      <el-option label="全部" value></el-option>
      <el-option
        v-for="(item,index) in options[0]"
        :key="index"
        :label="item.keyName"
        :value="item.keyName"
      ></el-option>
    </el-select>
    <!-- 交易类型(不包含会员) -->
    <!-- <el-select
      v-model="dealTypeValue"
      placeholder="请选择"
      popper-class="rpt-select"
      @focus="getdealType('POS_SALE_BILL_BILL_TYPE_NO_MEMBER',1)"
    >
      <el-option label="全部" value></el-option>
      <el-option
        v-for="(item,index) in options[1]"
        :key="1+index"
        :label="item.keyName"
        :value="item.id"
      ></el-option>
    </el-select>-->
  </div>
</template>


<script>
import mixins from "src/frame_cpm/mixins/cacheMixin.js";
export default {
  mixins: [mixins.cacheMixin],
  props: {
    resetStatus: Boolean
  },
  data() {
    return {
      cacheField: ["dealTypeValue"],
      subComName: "dealType",
      dealTypeValue: "",
      options: [[]]
    };
  },
  methods: {
    getdealType(name, index) {
      this.$rptList.getMoudelData("1", 100, name).then(data => {
        if (data && data.code === 200) {
          // 创建二维数组 添加数据
          this.$set(this.options, index, data.data.list);
        }
      });
    }
  },
  watch: {
    dealTypeValue(val) {
      this.$emit("selectDealTypeData", this.dealTypeValue);
    },
    resetStatus(newVal) {
      if (newVal) {
        this.dealTypeValue = "";
      }
    }
  }
};
</script>

<style lang="sass" scoped>

</style>
