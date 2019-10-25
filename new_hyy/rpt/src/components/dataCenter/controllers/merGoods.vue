<template>
  <controller :idKey="idKey" :valueKey="valueKey" :vModelKey="vModelKey" :queryData="queryData" :resetStatus="resetStatus" :controllerObj="controllerObj" :controllerTitle="controllerTitle" :controllerVisible="controllerVisible" :controllerTablerHeader="controllerTablerHeader" :controllerTableData="controllerTableData" :controllerPagination="controllerPagination" :controllerTableLoading="controllerTableLoading" @handleControllerDialogOpen="handleControllerDialogOpen" @handleControllerDialogClose="handleControllerDialogClose" @handleSearchClick="handleSearchClick" @handleCurrentPageChange="handleCurrentPageChange">
    <div slot="controller-query">
      <div style="position:relative">
        <el-form-item label="商品名称">
          <el-input v-model="goodsName" style="width:184px"></el-input>
        </el-form-item>
        <el-form-item label="店内码">
          <el-input v-model="goodsNumber" style="width:184px"></el-input>
        </el-form-item>
      </div>
    </div>
  </controller>
</template>

<script>
import Controller from './controller';
export default {
  props: {
    merClassUid: String,
    resetStatus: Boolean,
    queryData: Object,
    controllerObj: Object
  },
  components: {
    Controller
  },
  data () {
    return {
      idKey: 'goodsId',
      valueKey: 'uid',
      vModelKey: 'merName',
      controllerTitle: this.queryData.queryName,
      controllerVisible: false,
      controllerTableData: [],
      controllerPagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      goodsName: '',
      goodsNumber: '',
      cinemaUids: '',
      controllerTableLoading: false,
      controllerTablerHeader: [
        {
          label: '商品名称',
          property: 'merName',
          width: 196
        }, {
          label: '店内码',
          property: 'shorthandCode',
          width: 196
        }, {
          label: '标准价(元)',
          property: 'price',
          width: 196
        }
      ]
    };
  },
  methods: {
    handleControllerDialogOpen (data) {
      const params = {
        pageSize: 10,
        page: 1,
        merName: '',
        merCode: '',
        classUid: '',
        canSale: '',
        merType: this.queryData.queryControlKey == 'mer_goods_1' ? '1,2,3,4,5' : '1,5',
        shorthandCode: '',
        skuCode: ''
      };
      this.getData(params);
      this.controllerVisible = true;
    },
    handleSearchClick () {
      const params = {
        pageSize: 10,
        page: 1,
        merName: this.goodsName,
        merCode: this.goodsNumber,
        classUid: '',
        canSale: '',
        merType: this.queryData.queryControlKey == 'mer_goods_1' ? '1,2,3,4,5' : '1,5',
        shorthandCode: '',
        skuCode: ''
      };
      this.getData(params);
    },
    handleCurrentPageChange (data) {
      const params = {
        pageSize: 10,
        page: data,
        merName: this.merName,
        merCode: this.merCode,
        classUid: '',
        canSale: '',
        merType: this.queryData.queryControlKey == 'mer_goods_1' ? '1,2,3,4,5' : '1,5',
        shorthandCode: '',
        skuCode: ''
      };
      this.getData(params);
    },
    handleControllerDialogClose () {
      this.controllerVisible = false;
    },
    async getData (params) {
      this.controllerTableLoading = true;
      let res = await this.$rptList.goodsDataQueryGoodsList(params);
      res.data.list.forEach(element => {
        element.goodsId = `${element.merCode}-${element.skuCode}`;
        if (element.merType == 2) {
          element.merName += `-${element.skuName}`;
        }
        if (element.merType == 1 || element.merType == 3 || element.merType == 5) {
          element.merName = element.skuName;
        }
      });
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
