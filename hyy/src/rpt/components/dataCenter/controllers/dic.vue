<template>
  <div>
    <el-select
      popper-class="rpt-select"
      v-model="queryData.queryColValue"
      @change="getData"
      v-if="showAll"
    >
     <el-option label="全部" value></el-option>
      <el-option
        v-for="item in options"
        :key="`dic_${item.id}`"
        :label="item.dicName"
        :value="item.dicVal"
      ></el-option>
    </el-select>
    <el-select
      popper-class="rpt-select"
      v-model="queryData.queryColValue"
      @change="getData"
      v-if="!showAll"
    >
      <el-option
        v-for="item in options"
        :key="`dic_${item.id}`"
        :label="item.dicName"
        :value="item.dicVal"
      ></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props: {
    resetStatus: Boolean,
    queryData: Object,
  },
  data() {
    return {
      options: [],
      showAll: false
    };
  },
  methods: {
    //选择触发事件
    getData(selVal) {
      this.queryData.queryColValue = selVal;
    },
  },
  mounted() {
    this.$rptList.gitDicData(this.queryData.dicTag).then(res => {
      this.options = res;
      this.showAll = true;
      if (res[0].dicTag == 'status') {
        this.showAll = false;
        this.queryData.queryColValue = res[1].dicVal;
      }
      if (res[0].dicTag == 's04_type') {
        this.showAll = false;
        this.queryData.queryColValue = res[0].dicVal;
      }
    });
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