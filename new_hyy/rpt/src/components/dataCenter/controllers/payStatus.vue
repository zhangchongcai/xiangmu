<template>
  <div>
    <el-select popper-class="rpt-select" v-model="queryData.queryColValue" @change="getData">
      <el-option label="全部" value></el-option>
      <el-option v-for="item in options" :key="`dic_${item.code}`" :label="item.name" :value="item.name"></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props: {
    resetStatus: Boolean,
    queryData: Object
  },
  data () {
    return {
      options: [
        {
          code: 0,
          name: '支付中'
        },
        {
          code: 1,
          name: '成功'
        }, {
          code: 2,
          name: '失败'
        }
      ]
    };
  },
  methods: {
    getData (val) {
      this.queryData.queryColValue = val;
    }
  },
  watch: {
    resetStatus (newVal) {
      if (newVal) {
        this.queryData.queryColValue = '';
      }
    }
  }
};
</script>