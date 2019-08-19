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
            v-model="queryData.merName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input
            v-model="queryData.merCode"
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
        <el-form-item label="库存状态">
          <el-select v-model="queryData.storeType">
            <el-option label="全部" value></el-option>
            <el-option label="正常" value="0"></el-option>
            <el-option label="不足" value="1"></el-option>
            <el-option label="积压" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button type="primary" @click="onQuery()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div>
        <el-table :data="tableData" stripe :height="this.defaultTableHeight">
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
      cacheField:["queryData"],
      newstoreHouseCodeList:[],
      newRackCodeList:[],
      // 仓库列表
      storeHouseTableData:"",
      // 货架列表
      goodsNameTableData:"",
      //查询数据
      storeHouseName:"",
      goodsName:"",
      queryData: {
        cinemaUid:"",
        cinemaName:"",
        merCode:"",
        merName:"",
        shorthandCode:"",
        skuCode:"",
        storeType:"",
        pageSize:10,
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
          key: "merName",
          width:''
        },
        {
          label: "商品编码",
          key: "merCode",
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
          label: "安全库存下限",
          key: "storeDownLimit",
          width:''
        },
        {
          label: "安全库存上限",
          key: "storeUpLimit",
          width:''
        },
        {
          label: "现库存数量",
          key: "storeCount",
          width:''
        },
        {
          label: "库存状态",
          key: "storeType",
          width:'',
          formatter(row, column, cellValue) {
            let result = "";
            switch (row.storeType) {
              case "0":
                result = "正常";
                break;
              case "1":
                result = "不足";
                break;
              case "2":
                result = "积压";
                break;   
            }
            return result;
          }
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
    goodsDataQueryGoodsList(val) {
      this.$cimList.storeInventoryAnalysis
        .cinemaMerStockQueryStock(val)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data.list;
            this.total = res.data.total;
          } else {
            this.error(res.msg);
          }
        })
    },
  },
  components: {
    cinemalDialog
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