<template>
  <controller
    :idKey="idKey"
    :valueKey="valueKey"
    :vModelKey="vModelKey"
    :queryData="queryData"
    :resetStatus="resetStatus"
    :controllerObj="controllerObj"
    :controllerTitle="controllerTitle"
    :controllerVisible="controllerVisible"
    :controllerTablerHeader="controllerTablerHeader"
    :controllerTableData="controllerTableData"
    :controllerPagination="controllerPagination"
    :controllerTableLoading="controllerTableLoading"
    @handleControllerDialogOpen="handleControllerDialogOpen"
    @handleControllerDialogClose="handleControllerDialogClose"
    @handleSearchClick="handleSearchClick"
    @handleCurrentPageChange="handleCurrentPageChange"
  >
    <div slot="controller-query">
      <div style="position:relative">
        <el-form-item label="影片编码：">
          <el-input v-model="filmCode" style="width:184px"></el-input>
        </el-form-item>
        <el-form-item label="影片名称：">
          <el-input v-model="filmName" style="width:184px"></el-input>
        </el-form-item>
      </div>
    </div>
  </controller>
</template>

<script>
import Controller from "./controller";
export default {
  props: {
    resetStatus: Boolean,
    queryData: Object,
    controllerObj: Object
  },
  components: {
    Controller
  },
  data() {
    return {
      idKey: "id",
      valueKey: "filmName",
      vModelKey: "filmName",
      controllerTitle: this.queryData.queryName,
      controllerVisible: false,
      controllerTableData: [],
      controllerPagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      filmCode: "",
      filmName: "",
      controllerTableLoading: false,
      controllerTablerHeader: [
        {
          label: "影片编码",
          property: "code",
          width: 294
        },{
          label: "影片全称",
          property: "filmName",
          width: 294
        }
      ]
    };
  },
  methods: {
    handleControllerDialogOpen(data) {
      this.getData(1, 10, "", "");
      this.controllerVisible = true;
    },
    handleSearchClick() {
      this.getData("1", 10, this.filmName, this.filmCode);
    },
    handleCurrentPageChange(data) {
      this.getData(data, "10", this.filmName, this.filmCode);
    },
    handleControllerDialogClose() {
      this.controllerVisible = false;
    },
    async getData(pageNum, pageSize, filmName, filmCode) {
      this.controllerTableLoading = true;
      let res = await this.$rptList.getFilmData(pageNum, pageSize, filmName, filmCode);
      this.controllerTableData = res.rows;
      this.controllerPagination = res;
      this.controllerTableLoading = false;
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
