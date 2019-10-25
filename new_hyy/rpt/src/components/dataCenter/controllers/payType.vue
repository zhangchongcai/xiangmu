<template>
  <controller :idKey="idKey" :valueKey="valueKey" :vModelKey="vModelKey" :queryData="queryData" :resetStatus="resetStatus" :controllerObj="controllerObj" :controllerTitle="controllerTitle" :controllerVisible="controllerVisible" :controllerTablerHeader="controllerTablerHeader" :controllerTableData="controllerTableData" :controllerPagination="controllerPagination" :controllerTableLoading="controllerTableLoading" @handleControllerDialogOpen="handleControllerDialogOpen" @handleControllerDialogClose="handleControllerDialogClose" @handleSearchClick="handleSearchClick" @handleCurrentPageChange="handleCurrentPageChange" @handlePayTypeValue="handlePayTypeValue">
    <div slot="controller-query">
      <div style="position:relative">
        <el-form-item label="支付方式名称：">
          <el-input v-model="payTypeName" placeholder="请输入"></el-input>
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
      valueKey: 'payTypeCode',
      vModelKey: 'payTypeName',
      controllerTitle: this.queryData.queryName,
      controllerVisible: false,
      controllerTableData: [],
      controllerPagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      payTypeName: '',
      cinemaUids: '',
      controllerTableLoading: false,
      controllerTablerHeader: [
        {
          label: '支付编号',
          property: 'payTypeCode',
          width: 294
        },
        {
          label: '支付方式',
          property: 'payTypeName',
          width: 294
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
        this.getData(this.cinemaUids, this.payTypeName, 1, 10);
        this.controllerVisible = true;
      }
    },
    handleSearchClick () {
      this.getData(this.cinemaUids, this.payTypeName, 1, 10);
    },
    handleCurrentPageChange (data) {
      this.getData(this.cinemaUids, this.payTypeName, data, 10);
    },
    handleControllerDialogClose () {
      this.controllerVisible = false;
      let key = `${this.queryData.controlType}-${this.queryData.queryColKey}`;
    },
    handlePayTypeValue (data) {
      let payTypeValueArr = data ? data.split('、') : [];
      this.$emit('handlePayTypeValue', payTypeValueArr);
    },
    async getData (cinemaUids, payTypeName, currentPage, pageSize) {
      this.controllerTableLoading = true;
      let res = await this.$rptList.getPayTypeData(
        cinemaUids,
        payTypeName,
        currentPage,
        pageSize
      );
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
