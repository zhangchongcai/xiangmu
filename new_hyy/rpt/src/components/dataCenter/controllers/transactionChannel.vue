<template>
  <controller :valueKey="valueKey" :idKey="idKey" :vModelKey="vModelKey" :queryData="queryData" :resetStatus="resetStatus" :controllerObj="controllerObj" :controllerTitle="controllerTitle" :controllerVisible="controllerVisible" :controllerTablerHeader="controllerTablerHeader" :controllerTableData="controllerTableData" :controllerPagination="controllerPagination" :controllerTableLoading="controllerTableLoading" @handleControllerDialogOpen="handleControllerDialogOpen" @handleControllerDialogClose="handleControllerDialogClose" @handleSearchClick="handleSearchClick" @handleCurrentPageChange="handleCurrentPageChange">
    <div slot="controller-query">
      <div style="position:relative">
        <el-form-item label="渠道类型:">
          <el-select popper-class="rpt-select" v-model="dealType" style="width:184px">
            <el-option label="全部" value></el-option>
            <el-option label="第三方渠道" value="2">第三方渠道</el-option>
            <el-option label="自营渠道" value="1">自营渠道</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道名称">
          <el-input v-model="dealName" style="width:184px"></el-input>
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
    cinemaUid: String,
    queryData: Object,
    controllerObj: Object
  },
  components: {
    Controller
  },
  data () {
    return {
      idKey: 'uid',
      vModelKey: 'name',
      valueKey: 'name',
      controllerTitle: this.queryData.queryName,
      controllerVisible: false,
      controllerTableData: [],
      controllerPagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      dealType: '',
      dealName: '',
      controllerTableLoading: false,
      controllerTablerHeader: [
        {
          label: '渠道名称',
          property: 'agent',
          width: 294
        },
        {
          label: '渠道类型',
          property: 'type',
          width: 294
        }
      ]
    };
  },
  methods: {
    handleControllerDialogOpen (data) {
      this.controllerVisible = true;
      this.getData(1);
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
      const limit = {
        cinemaUid: this.cinemaUids,
        pageSize: 10,
        page,
        type,
        name
      };
      let res = await this.$rptList.getDitch(Object.assign({}, limit));
      res.data.list.forEach(element => {
        element.nature === 0 ? (element.type = '自营渠道') : null;
        element.nature === 1 ? (element.type = '自营渠道') : null;
        element.nature === 2 ? (element.type = '第三方渠道') : null;
      });
      this.controllerTableData = res.data.list;
      this.controllerPagination = res.data;
      this.controllerTableData.forEach(item => {
        item.deal = item.code;
        item.agent = item.name;
      });
      this.controllerTableLoading = false;
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
