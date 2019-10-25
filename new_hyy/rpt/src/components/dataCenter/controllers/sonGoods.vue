<template>
  <controller :idKey="idKey" :valueKey="valueKey" :vModelKey="vModelKey" :queryData="queryData" :resetStatus="resetStatus" :controllerObj="controllerObj" :controllerTitle="controllerTitle" :controllerVisible="controllerVisible" :controllerTablerHeader="controllerTablerHeader" :controllerTableData="controllerTableData" :controllerPagination="controllerPagination" :controllerTableLoading="controllerTableLoading" @handleControllerDialogOpen="handleControllerDialogOpen" @handleControllerDialogClose="handleControllerDialogClose" @handleSearchClick="handleSearchClick" @handleCurrentPageChange="handleCurrentPageChange">
    <div slot="controller-query">
      <div style="position:relative">
        <el-form-item label="套餐子商品名称">
          <el-input v-model="merName" style="width:184px"></el-input>
        </el-form-item>
        <el-form-item label="套餐子商品编码">
          <el-input v-model="merCode" style="width:184px"></el-input>
        </el-form-item>
      </div>
    </div>
  </controller>
</template>

<script>
import Controller from './controller';
export default {
  props: {
    resetStatus: Boolean,
    queryData: Object,
    controllerObj: Object
  },
  components: {
    Controller
  },
  data () {
    return {
      idKey: 'merCode',
      valueKey: 'merCode',
      vModelKey: 'merName',
      controllerTitle: this.queryData.queryName,
      controllerVisible: false,
      controllerTableData: [],
      controllerPagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      merName: '',
      merCode: '',
      controllerTableLoading: false,
      controllerTablerHeader: [
        {
          label: '套餐子商品名称',
          property: 'merName',
          width: 294
        }, {
          label: '套餐子商品编码',
          property: 'merCode',
          width: 294
        }
      ]
    };
  },
  methods: {
    handleControllerDialogOpen (data) {
      let params = {
        page: 1,
        pageSize: 10
      };
      this.getData(params);
      this.controllerVisible = true;
    },
    handleSearchClick () {
      let params = {
        page: 1,
        pageSize: 10,
        merCode: this.merCode,
        merName: this.merName
      };
      this.getData(params);
    },
    handleCurrentPageChange (data) {
      let params = {
        page: data,
        pageSize: 10,
        merCode: this.merCode,
        merName: this.merName
      };
      this.getData(params);
    },
    handleControllerDialogClose () {
      this.controllerVisible = false;
    },
    async getData (params) {
      this.controllerTableLoading = true;
      let res = await this.$rptList.gitComboGoodsData(params);
      this.controllerTableData = res.data.list;
      this.controllerPagination = res.data;
      this.controllerTableLoading = false;
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
