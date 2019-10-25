<template>
  <controller :idKey="idKey" :valueKey="valueKey" :vModelKey="vModelKey" :queryData="queryData" :resetStatus="resetStatus" :controllerObj="controllerObj" :controllerTitle="controllerTitle" :controllerVisible="controllerVisible" :controllerTablerHeader="controllerTablerHeader" :controllerTableData="controllerTableData" :controllerPagination="controllerPagination" :controllerTableLoading="controllerTableLoading" @handleControllerDialogOpen="handleControllerDialogOpen" @handleControllerDialogClose="handleControllerDialogClose" @handleSearchClick="handleSearchClick" @handleCurrentPageChange="handleCurrentPageChange">
    <div slot="controller-query">
      <div style="position:relative">
        <el-form-item label="代理商名称">
          <el-input v-model="dealName"></el-input>
        </el-form-item>
      </div>
    </div>
  </controller>
</template>

<script>
import Controller from './controller';
export default {
  props: {
    cinemaUid: String,
    resetStatus: Boolean,
    queryData: Object,
    controllerObj: Object
  },
  components: {
    Controller
  },
  data () {
    return {
      idKey: 'uid',
      valueKey: 'uid',
      vModelKey: 'name',
      controllerTitle: this.queryData.queryName,
      controllerVisible: false,
      controllerTableData: [],
      controllerPagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      dealName: '',
      dealType: '',
      cinemaUids: '',
      controllerTableLoading: false,
      controllerTablerHeader: [
        {
          label: '代理商名称',
          property: 'name',
          width: 588
        }
      ]
    };
  },
  methods: {
    handleControllerDialogOpen (data) {
      this.cinemaUids = this.cinemaUid.indexOf(',') > -1 ? this.cinemaUid.split(',') : [this.cinemaUid];
      this.getData(1);
      this.controllerVisible = true;
    },
    handleSearchClick () {
      let httpDealType = (this.dealType && this.dealType.split(',')) || null;
      this.getData(1, httpDealType, this.dealName);
    },
    handleCurrentPageChange (data) {
      let httpDealType = (this.dealType && this.dealType.split(',')) || null;
      this.getData(data, httpDealType, this.dealName);
    },
    handleControllerDialogClose () {
      this.controllerVisible = false;
    },
    async getData (page, type, name) {
      this.controllerTableLoading = true;
      const limit = { cinemaUid: this.cinemaUids, pageSize: 10, page, type, name };
      let res = await this.$rptList.getDitch(Object.assign({}, limit));
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
