<template>
  <div>
    <div class="common-header store-i-q-style">
      <el-form
        :inline="true"
        :model="queryData"
        label-position="left"
        label-suffix="："
      >
        <el-form-item label="门店名称" class="select-input">
            <el-input
                    v-model="queryData.cinemaName"
                    clearable
                    @clear="onCinemalSumit"
                    @focus="selectCinemalDialog"
                    placeholder="请选择门店"
            ></el-input>
            <el-button @click="selectCinemalDialog" type="primary cinemaSel-btn" plain>选择</el-button>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input
            v-model="queryData.name"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input
            v-model="queryData.code"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="SKU编码">
          <el-input
            v-model="queryData.skuCode"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="速记代码">
          <el-input
            v-model="queryData.shorthandCode"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="仓库名称" class="select-input">
          <el-input 
            v-model="storeHouseName" 
            clearable
            placeholder="请选择仓库"
            @clear="onStoreHouseSumit"
             @focus="selectStoreHouseDialog"
            >
          </el-input>
          <el-button @click="selectStoreHouseDialog" type="primary cinemaSel-btn" plain>选择</el-button>
        </el-form-item>
        <el-form-item label="货架名称" class="select-input">
          <el-input 
            v-model="goodsName"
            clearable
            placeholder="请选择货架"
            @clear="ongoodsSumit"
             @focus="selectdoodsDialog"
            >
          </el-input>
          <el-button @click="selectdoodsDialog" type="primary cinemaSel-btn" plain>选择</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checkIsFilterZeroInventory" @change="kcProBtn()">过滤无库存商品</el-checkbox>
        </el-form-item>

        <el-form-item class="query-btn-box">
          <el-button type="primary" @click="onQuery()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div>
        <el-table :data="tableData" stripe :height="this.defaultTableHeight" v-loading="tableLoding">
          <el-table-column
            v-for="item in tableColumn"
            :key="item.key"
            :prop="item.key"
            :label="item.label"
            :width="item.width"
            :formatter="item.formatter"
          ></el-table-column>
        </el-table>
        <div class="page-wrap">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryData.page"
            :page-sizes="this.pageSizes"
            :page-size="queryData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 选择影院弹窗 -->
    <cinemal-dialog ref="mycinemalDialog" @onSumit="onCinemalSumit" :dialogFeedbackData="[{cinemaUid:queryData.cinemaUid,cinemaName:queryData.cinemaName}]"></cinemal-dialog>
    <!-- 选择仓库弹窗 -->
    <storehouse-dialog 
    ref="myStoreHouseDialog"
     @onSumit="onStoreHouseSumit" 
     :cinemaUid="queryData" 
     multiple
     :dialogFeedbackData="newstoreHouseCodeList"
     ></storehouse-dialog>
     <!-- :dialogFeedbackData="[{code:queryData.code,name:selectedBranchName}]" -->
    <!-- 选择货架弹窗 -->
    <goodsName-dialog ref="mygoodsDialog" @onSumit="ongoodsSumit" :cinemaUid="queryData" multiple :dialogFeedbackData="newRackCodeList"></goodsName-dialog>
  </div>
</template>

<script>
import qs from "qs";
import mixin from "cim/mixins/cim/paginationConfig.js";
import cinemalDialog from "cim/components/cinemalDialog/cinemaDialog.vue";
import storehouseDialog from "cim/components/storehouseDialog/cinemaDialog.vue";
import goodsNameDialog from "cim/components/goodsNameDialog/cinemaDialog.vue";
import mixins from "frame_cpm/mixins/cacheMixin";
export default {
  mixins: [mixin,mixins.cacheMixin],
  data() {
    return {
      tableLoding:false,
      cacheField:["queryData","storeHouseName","goodsName","newstoreHouseCodeList","newRackCodeList","checkIsFilterZeroInventory"],
      newstoreHouseCodeList:[],
      newRackCodeList:[],
      // 仓库列表
      storeHouseTableData:[],
      // 货架列表
      goodsNameTableData:[],
      //查询数据
      storeHouseName:"",
      goodsName:"",
      checkIsFilterZeroInventory:false,
      queryData: {
        cinemaUid:"",
        cinemaName:"",
        code:"",
        isFilterZeroInventory:0,
        name:"",
        rackCodeList:[],
        shorthandCode:"",
        skuCode:"",
        storeHouseCodeList:[],
        pageSize:15,
        page:1
      },
      total: 0,
      // 表格表头
      tableColumn: [
        {
          label: "门店名称",
          key: "cinemaName",
          width:''
        },
        {
          label: "商品名称",
          key: "name",
          width:''
        },
        {
          label: "商品编码",
          key: "code",
          width:''
        },
        {
          label: "SKU编码",
          key: "skuCode",
          width:''
        },
        {
          label: "速记代码",
          key: "shorthandCode",
          width:''
        },
        {
          label: "商品规格",
          key: "merSpec",
          width:''
        },
        {
          label: "基本单位",
          key: "unitName",
          width:''
        },
        {
          label: "售价（元）",
          key: "price",
          width:''

        },
        {
          label: "成本单价（元）",
          key: "storeCostPrice",
          width:''
        },
        {
          label: "合计库存数量",
          key: "storeCount",
          width:''
        },
        {
          label: "合计库存金额",
          key: "storeCostAmount",
          width:''
        }
      ],
      // 表格数据
      tableData: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      this.queryData.pageSize = this.pageSize
      if(this.queryData.cinemaUid === "" || this.queryData.cinemaUid === null){

      }else{
        this.goodsDataQueryGoodsList(this.queryData)
      }
    },
    // 查询
    onQuery() {
      if(this.queryData.cinemaUid === "" || this.queryData.cinemaUid === null){
        this.$message("请先选择门店");
      }else{
        this.goodsDataQueryGoodsList(this.queryData)
      }
      
    },
    // 选泽门店回调
    setCinema(val = []) {
      if (val.length > 0) {
        this.queryData.cinemaName = val[0].name;
        this.queryData.cinemaUid = val[0].uid;
          let sval = {
            cinemaUid:this.queryData.cinemaUid
          }
          let sval1 = {
            cinameUid:this.queryData.cinemaUid
          }
        this.$cimList.inventoryManagement.checkBillStorehouse(sval).then(resData => {
              if (resData.code == 200) {
                this.storeHouseTableData = resData.data == null || resData.data == "" ? []:resData.data
              }
        })
        this.$cimList.inventoryManagement.checkBillStorageRack(sval1).then(resData => {
              if (resData.code == 200) {
                this.goodsNameTableData = resData.data == null || resData.data == "" ? []:resData.data
              }
        })
      } else {
        this.queryData.cinemaName = null;
        this.queryData.cinemaUid = null;
      }
    },
    // 选泽门店回调
    onCinemalSumit(val = [],type) {
      console.log(val," 选泽门店回调",type);
      if (val.length > 0) {
        if(type=="default"){
          if(val.length==1){
            this.setCinema(val)
          }
        }else{
          this.setCinema(val)
        }
      } else {
        this.setCinema()
      }
    },
    // 选泽仓库回调
    onStoreHouseSumit(val = []) {
      this.newstoreHouseCodeList = []
      if (val.length > 0) {
        let StoreUidArr = []
        let StoreNameArr = []
        let deStoreUidArr = []
        val.forEach((val1,index,arr)=>{
          let newObj = {}
          StoreUidArr.push(val1.code)
          StoreNameArr.push(val1.name)
          newObj.code = val1.code
          newObj.name = val1.name 
          deStoreUidArr.push(newObj)
        })
        this.storeHouseName = StoreNameArr.join(",")
        this.queryData.storeHouseCodeList = StoreUidArr
        this.newstoreHouseCodeList = deStoreUidArr
      } else {
        this.storeHouseName = ""
        this.queryData.storeHouseCodeList = []
      }
    },
    // 选泽货架回调
    ongoodsSumit(val = []) {
      this.newRackCodeList = []
      if (val.length > 0) {
        let StoreUidArr = []
        let StoreNameArr = []
        let deStoreUidArr = []
        val.forEach((val1,index,arr)=>{
          let newObj = {}
          StoreUidArr.push(val1.code)
          StoreNameArr.push(val1.name)
          newObj.code = val1.code
          newObj.name = val1.name 
          deStoreUidArr.push(newObj)
        })
        this.goodsName = StoreNameArr.join(",")
        this.queryData.rackCodeList = StoreUidArr
        this.newRackCodeList = deStoreUidArr
      } else {
        this.goodsName = ""
        this.queryData.rackCodeList = []
      }
    },
    selectStoreHouseDialog() {
      if(this.queryData.cinemaName == "" && this.queryData.cinemaUid == ""){
        this.$message("请先选择门店");
      }else{
        this.$refs.myStoreHouseDialog.handleDialog(true);
      }
    },
    selectdoodsDialog() {
      if(this.queryData.cinemaName == "" && this.queryData.cinemaUid == ""){
        this.$message("请先选择门店");
      }else{
        this.$refs.mygoodsDialog.handleDialog(true);
      }
    },
    selectCinemalDialog() {
      this.$refs.mycinemalDialog.handleDialog(true);
    },
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.goodsDataQueryGoodsList(this.queryData);
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.goodsDataQueryGoodsList(this.queryData);
      // console.log(`当前页: ${val}`);
    },
    kcProBtn(){
      this.queryData.isFilterZeroInventory = this.checkIsFilterZeroInventory == true ? 1:0
    },
    goodsDataQueryGoodsList(val) {
      // this.tableLoding = true;
      this.$cimList.storeInventoryQuery
        .cinemaMerStockQueryStock(val)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data.list;
            this.total = res.data.total;
            this.listDataHandle(this.tableData)
            // this.tableLoding = false;
          } else {
            this.error(res.msg);
            // this.tableLoding = false;
          }
        })
    },
    listDataHandle(data){
      this.getMerCinemaList(this.queryData)
    },
    // 获取仓库列表
    getMerCinemaList(param) {
      this.tableLoding = true;
        let thistableColumn = [
          {
            label: "门店名称",
            key: "cinemaName",
            width:''
          },
          {
            label: "商品名称",
            key: "name",
            width:''
          },
          {
            label: "商品编码",
            key: "code",
            width:''
          },
          {
            label: "SKU编码",
            key: "skuCode",
            width:''
          },
          {
            label: "速记代码",
            key: "shorthandCode",
            width:''
          },
          {
            label: "商品规格",
            key: "merSpec",
            width:''
          },
          {
            label: "基本单位",
            key: "unitName",
            width:''
          },
          {
            label: "售价（元）",
            key: "price",
            width:''

          },
          {
            label: "成本单价（元）",
            key: "storeCostPrice",
            width:''
          },
          {
            label: "合计库存数量",
            key: "storeCount",
            width:''
          },
          {
            label: "合计库存金额",
            key: "storeCostAmount",
            width:''
          }
        ]
      thistableColumn.forEach((tcval,tcindex)=>{
        tcval.width = "150"
        if(tcval.key == 'skuCode'){
          tcval.width = "170"
        }
      })
      let val = {
        cinemaUid:param.cinemaUid
      }
      let val1 = {
        cinameUid:param.cinemaUid
      }
      // 仓库条件为空，货架条件为空
      if(this.queryData.storeHouseCodeList.length === 0 && this.queryData.rackCodeList.length === 0){
        // this.$nextTick(() => {
          // this.$cimList.inventoryManagement.checkBillStorehouse(val).then(resData => {
          //   if (resData.code == 200) {
          //     this.storeHouseTableData = resData.data
              this.storeHouseTableData.forEach((storeval,storeindex,storearr)=>{
                let newObj = {}
                let newObj1 = {}
                newObj.label = storeval.name + "库存数"
                newObj.key = storeval.code + "storeCount"
                newObj.code = storeval.code
                newObj.width = '150'
                newObj1.label = storeval.name + "金额"
                newObj1.key = storeval.code + "storeHouseCostAmount"
                newObj1.code = storeval.code
                newObj1.width = '150'
                thistableColumn.splice(-2,0,newObj)
                thistableColumn.splice(-2,0,newObj1)
              })
          //   }
          // });
          this.tableData.forEach((zongval,zongindex,zongarr)=>{
            zongval.storeHouseList.forEach((newVal,newIndex,newArr)=>{
              let sx = newVal.storehouseCode + "storeCount"
              let sx1 = newVal.storehouseCode + "storeHouseCostAmount"
              this.$set(zongarr[zongindex],sx,newVal.storeCount)
              this.$set(zongarr[zongindex],sx1,newVal.storeHouseCostAmount)
            })
          })
          // this.$cimList.inventoryManagement.checkBillStorageRack(val1).then(resData => {
          //   if (resData.code == 200) {
          //     this.goodsNameTableData = resData.data
              this.goodsNameTableData.forEach((storeval,storeindex,storearr)=>{
                let newObj = {}
                let newObj1 = {}
                newObj.label = storeval.name + "库存数"
                newObj.key = storeval.code + "rackCount"
                newObj.code = storeval.code
                newObj.width = '150'
                newObj1.label = storeval.name + "金额"
                newObj1.key = storeval.code + "rackCostAmount"
                newObj1.code = storeval.code
                newObj1.width = '150'
                thistableColumn.splice(-2,0,newObj)
                thistableColumn.splice(-2,0,newObj1)
                console.log(this.tableColumn)
              })
          //   }
          // });
          this.tableData.forEach((zongval,zongindex,zongarr)=>{
            zongval.rackList.forEach((newVal,newIndex,newArr)=>{
              let sx = newVal.rackCode + "rackCount"
              let sx1 = newVal.rackCode + "rackCostAmount"
              this.$set(zongarr[zongindex],sx,newVal.storeCount)
              this.$set(zongarr[zongindex],sx1,newVal.rackCostAmount)
            })
          })
        // })
      }else if(this.queryData.storeHouseCodeList.length > 0 && this.queryData.rackCodeList.length === 0){
          this.newstoreHouseCodeList.forEach((storeval,storeindex,storearr)=>{
               let newObj = {}
                let newObj1 = {}
                newObj.label = storeval.name + "库存数"
                newObj.key = storeval.code + "storeCount"
                newObj.code = storeval.code
                newObj.width = '150'
                newObj1.label = storeval.name + "金额"
                newObj1.key = storeval.code + "storeHouseCostAmount"
                newObj1.code = storeval.code
                newObj1.width = '150'
                thistableColumn.splice(-2,0,newObj)
                thistableColumn.splice(-2,0,newObj1)
          })
          this.tableData.forEach((zongval,zongindex,zongarr)=>{
            zongval.storeHouseList.forEach((newVal,newIndex,newArr)=>{
              let sx = newVal.storehouseCode + "storeCount"
              let sx1 = newVal.storehouseCode + "storeHouseCostAmount"
              this.$set(zongarr[zongindex],sx,newVal.storeCount)
              this.$set(zongarr[zongindex],sx1,newVal.storeHouseCostAmount)
            })
          })
      }else if(this.queryData.storeHouseCodeList.length === 0 && this.queryData.rackCodeList.length > 0){
          this.newRackCodeList.forEach((storeval,storeindex,storearr)=>{
               let newObj = {}
                let newObj1 = {}
                newObj.label = storeval.name + "库存数"
                newObj.key = storeval.code + "rackCount"
                newObj.code = storeval.code
                newObj.width = '150'
                newObj1.label = storeval.name + "金额"
                newObj1.key = storeval.code + "rackCostAmount"
                newObj1.code = storeval.code
                newObj1.width = '150'
                thistableColumn.splice(-2,0,newObj)
                thistableColumn.splice(-2,0,newObj1)
          })
          this.tableData.forEach((zongval,zongindex,zongarr)=>{
            zongval.rackList.forEach((newVal,newIndex,newArr)=>{
              let sx = newVal.rackCode + "rackCount"
              let sx1 = newVal.rackCode + "rackCostAmount"
              this.$set(zongarr[zongindex],sx,newVal.storeCount)
              this.$set(zongarr[zongindex],sx1,newVal.rackCostAmount)
            })
          })
      }else if(this.queryData.storeHouseCodeList.length > 0 && this.queryData.rackCodeList.length > 0){
          this.newstoreHouseCodeList.forEach((storeval,storeindex,storearr)=>{
               let newObj = {}
                let newObj1 = {}
                newObj.label = storeval.name + "库存数"
                newObj.key = storeval.code + "storeCount"
                newObj.code = storeval.code
                newObj.width = '150'
                newObj1.label = storeval.name + "金额"
                newObj1.key = storeval.code + "storeHouseCostAmount"
                newObj1.code = storeval.code
                newObj1.width = '150'
                thistableColumn.splice(-2,0,newObj)
                thistableColumn.splice(-2,0,newObj1)
          })
          this.tableData.forEach((zongval,zongindex,zongarr)=>{
            zongval.storeHouseList.forEach((newVal,newIndex,newArr)=>{
              let sx = newVal.storehouseCode + "storeCount"
              let sx1 = newVal.storehouseCode + "storeHouseCostAmount"
              this.$set(zongarr[zongindex],sx,newVal.storeCount)
              this.$set(zongarr[zongindex],sx1,newVal.storeHouseCostAmount)
            })
          })
          this.newRackCodeList.forEach((storeval,storeindex,storearr)=>{
               let newObj = {}
                let newObj1 = {}
                newObj.label = storeval.name + "库存数"
                newObj.key = storeval.code + "rackCount"
                newObj.code = storeval.code
                newObj.width = '150'
                newObj1.label = storeval.name + "金额"
                newObj1.key = storeval.code + "rackCostAmount"
                newObj1.code = storeval.code
                newObj1.width = '150'
                thistableColumn.splice(-2,0,newObj)
                thistableColumn.splice(-2,0,newObj1)
          })
          this.tableData.forEach((zongval,zongindex,zongarr)=>{
            zongval.rackList.forEach((newVal,newIndex,newArr)=>{
              let sx = newVal.rackCode + "rackCount"
              let sx1 = newVal.rackCode + "rackCostAmount"
              this.$set(zongarr[zongindex],sx,newVal.storeCount)
              this.$set(zongarr[zongindex],sx1,newVal.rackCostAmount)
            })
          })
      }
      this.tableColumn = thistableColumn
      this.tableLoding = false;
      // this.tableData.forEach((sval)=>{
      //   sval.storeCostPrice = sval.storeCostPrice
      //   sval.storeCostAmount = sval.storeCostAmount
      // })
    },
  },
  components: {
    cinemalDialog,
    storehouseDialog,
    goodsNameDialog
  }
};
</script>

<style lang="scss">
@import "../../../../assets/css/common.scss";
@import "../../../../assets/css/element-common.scss";
.store-i-q-style{
  .newPro-box {
    .title {
      margin: 10px 0;
      font-size: 16px;
    }
    .selectName {
      font-size: 16px;
      margin: 10px 0;
    }
    .newProTree {
      height: 330px;
      overflow: auto;
    }
  }
}
</style>