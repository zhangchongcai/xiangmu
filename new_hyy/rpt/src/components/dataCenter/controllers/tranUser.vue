<template>
  <controller :idKey="idKey" :valueKey="valueKey" :vModelKey="vModelKey" :queryData="queryData" :resetStatus="resetStatus" :controllerObj="controllerObj" :controllerTitle="controllerTitle" :controllerVisible="controllerVisible" :controllerTablerHeader="controllerTablerHeader" :controllerTableData="controllerTableData" :controllerPagination="controllerPagination" :controllerTableLoading="controllerTableLoading" @handleControllerDialogOpen="handleControllerDialogOpen" @handleControllerDialogClose="handleControllerDialogClose" @handleSearchClick="handleSearchClick" @handleCurrentPageChange="handleCurrentPageChange">
    <div slot="controller-query">
      <div style="position:relative">
        <el-form-item label="收银员/授权人">
          <el-input v-model="fullName" style="width:184px"></el-input>
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
      idKey: 'id',
      valueKey: 'uid',
      vModelKey: 'fullName',
      controllerTitle: this.queryData.queryName,
      controllerVisible: false,
      controllerTableData: [],
      controllerPagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      fullName: '',
      controllerTableLoading: false,
      controllerTablerHeader: [
        {
          label: '账号',
          property: 'loginName',
          width: 294
        },
        {
          label: '收银员/授权人',
          property: 'fullName',
          width: 294
        }
      ]
    };
  },
  methods: {
    handleControllerDialogOpen (data) {
      this.controllerVisible = true;
      this.getData(1, 10, '');
    },
    handleSearchClick () {
      this.getData(1, 10, this.fullName);
    },
    handleCurrentPageChange (data) {
      this.getData(data, 10, this.fullName);
    },
    handleControllerDialogClose () {
      this.controllerVisible = false;
    },
    async getData (pageNum, pageSize, fullName) {
      this.controllerTableLoading = true;
      let res = await this.$rptList.getUser(pageNum, pageSize, fullName);
      this.controllerTableData = JSON.parse(JSON.stringify(res.rows));
      this.controllerPagination = res;
      this.controllerTableLoading = false;
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
