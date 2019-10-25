<template>
  <controller :idKey="idKey" :valueKey="valueKey" :vModelKey="vModelKey" :queryData="queryData" :resetStatus="resetStatus" :controllerObj="controllerObj" :controllerTitle="controllerTitle" :controllerVisible="controllerVisible" :controllerTablerHeader="controllerTablerHeader" :controllerTableData="controllerTableData" :controllerPagination="controllerPagination" :controllerTableLoading="controllerTableLoading" @handleControllerDialogOpen="handleControllerDialogOpen" @handleControllerDialogClose="handleControllerDialogClose" @handleSearchClick="handleSearchClick" @handleCurrentPageChange="handleCurrentPageChange">
    <div slot="controller-query">
      <div style="position:relative">
        <el-form-item label="票类名称">
          <el-input v-model="ticketName" style="width:184px"></el-input>
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
      idKey: 'id',
      valueKey: 'name',
      vModelKey: 'name',
      controllerTitle: this.queryData.queryName,
      controllerVisible: false,
      controllerTableData: [],
      controllerPagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      ticketName: '',
      cinemaUids: '',
      controllerTableLoading: false,
      controllerTablerHeader: [
        {
          label: '票类名称',
          property: 'name',
          width: 588
        }
      ]
    };
  },
  methods: {
    handleControllerDialogOpen (data) {
      this.cinemaUids = this.cinemaUid.indexOf(',') > -1 ? this.cinemaUid.split(',') : [this.cinemaUid];
      if (this.cinemaUids.length === 1 && this.cinemaUids[0] === '') {
        this.$message({
          message: '请先选择影院',
          iconClass: 'iconfont icon-danchuang-jingtanhao',
          customClass: 'rpt-alert-message',
          center: 'true'
        });
      } else {
        this.getData(1, 10, this.cinemaUids, '');
        this.controllerVisible = true;
      }
    },
    handleSearchClick () {
      this.getData(1, 10, this.cinemaUids, this.ticketName);
    },
    handleCurrentPageChange (data) {
      this.getData(data, 10, this.cinemaUids, this.ticketName);
    },
    handleControllerDialogClose () {
      this.controllerVisible = false;
    },
    async getData (currentPage, pageSize, cinemaUid, ticketTypeName) {
      this.controllerTableLoading = true;
      let res = await this.$rptList.gitTicketData(currentPage, pageSize, cinemaUid, ticketTypeName);
      this.controllerTableData = res.data.records;
      this.controllerPagination = res.data;
      this.controllerTableLoading = false;
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
