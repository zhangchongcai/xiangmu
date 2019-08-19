<template>
  <div>
    <el-select
      popper-class="rpt-select"
      v-model="queryData.queryColValue"
      @change="getData"
    >
      <el-option label="全部" value></el-option>
      <el-option
        v-for="item in options"
        :key="`dic_${item.code}`"
        :label="item.name"
        :value="item.code"
      ></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props: {
    resetStatus: Boolean,
    queryData: Object
  },
  data() {
    return {
      options: [
        {
          code: 1,
          name: '销售'
        },{
          code: 2,
          name: '退票'
        }, {
          code: 3,
          name: '补登'
        }
      ]
    };
  },
  methods: {
    getData(val) {
      this.queryData.queryColValue = val;
    }
  },
  watch: {
    resetStatus(newVal) {
      if (newVal) {
        this.queryData.queryColValue = "";
      }
    }
  }
};
</script>