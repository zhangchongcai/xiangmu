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
        <el-form-item label="会员等级名称">
          <el-input v-model="cardName" style="width:184px"></el-input>
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
      valueKey: "id",
      vModelKey: "cardName",
      controllerTitle: this.queryData.queryName,
      controllerVisible: false,
      controllerTableData: [],
      controllerPagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      cardName: "",
      controllerTableLoading: false,
      controllerTablerHeader: [
        {
          label: "会员等级",
          property: "cardName",
          width: 294
        },{
          label: "卡类型",
          property: "cardType",
          width: 294
        }
      ]
    };
  },
  methods: {
    handleControllerDialogOpen(data) {
      this.getData(1, 10, "");
      this.controllerVisible = true;
    },
    handleSearchClick() {
      this.getData("1", 10, this.cardName);
    },
    handleCurrentPageChange(data) {
      this.getData(data, 10, this.cardName);
    },
    handleControllerDialogClose() {
      this.controllerVisible = false;
    },
    async getData(pageNum, pageSize, cardName) {
      this.controllerTableLoading = true;
      let res = await this.$rptList.selectCardProductList(pageNum, pageSize, cardName);
      this.controllerTableData = res.data.records;
      this.controllerPagination.pageNum = res.data.current;
      this.controllerPagination.pageSize = res.data.page;
      this.controllerPagination.total = res.data.total;
      this.controllerTableLoading = false;
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
