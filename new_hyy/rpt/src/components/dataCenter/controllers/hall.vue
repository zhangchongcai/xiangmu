<template>
  <controller :idKey="idKey" :valueKey="valueKey" :vModelKey="vModelKey" :queryData="queryData" :resetStatus="resetStatus" :controllerObj="controllerObj" :controllerTitle="controllerTitle" :controllerVisible="controllerVisible" :controllerTablerHeader="controllerTablerHeader" :controllerTableData="controllerTableData" :controllerPagination="controllerPagination" :controllerTableLoading="controllerTableLoading" @handleControllerDialogOpen="handleControllerDialogOpen" @handleControllerDialogClose="handleControllerDialogClose" @handleSearchClick="handleSearchClick" @handleCurrentPageChange="handleCurrentPageChange">
    <div slot="controller-query">
      <div style="position:relative">
        <el-form-item label="影厅名称：">
          <el-input v-model="name" style="width:184px"></el-input>
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
      name: '',
      cinemaUids: '',
      controllerTableLoading: false,
      controllerTablerHeader: [
        {
          label: '影厅名称',
          property: 'name',
          width: 196
        },
        {
          label: '影厅编码',
          property: 'code',
          width: 196
        },
        {
          label: '影厅类型',
          property: 'type',
          width: 196
        }
      ]
    };
  },
  methods: {
    handleControllerDialogOpen (data) {
      if (this.cinemaUid.split(',').length == 1 && this.cinemaUid.split(',')[0] !== '') {
        this.getData(1, 10, this.cinemaUid, this.name);
        this.controllerVisible = true;
      } else if (this.cinemaUid.split(',').length > 1) {
        this.$message({
          message: '只能选择一个影院',
          iconClass: 'iconfont icon-danchuang-jingtanhao',
          customClass: 'rpt-alert-message',
          center: 'true'
        });
      } else {
        this.$message({
          message: '请先选择影院',
          iconClass: 'iconfont icon-danchuang-jingtanhao',
          customClass: 'rpt-alert-message',
          center: 'true'
        });
      }
    },
    handleSearchClick () {
      this.getData(1, 10, this.cinemaUid, this.name);
    },
    handleCurrentPageChange (data) {
      this.getData(data, 10, this.cinemaUid, this.name);
    },
    handleControllerDialogClose () {
      this.controllerVisible = false;
    },
    async getData (page, pageSize, cinemaUid, name) {
      this.controllerTableLoading = true;
      let res = await this.$rptList.gitHallData(page, pageSize, cinemaUid, name);
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
