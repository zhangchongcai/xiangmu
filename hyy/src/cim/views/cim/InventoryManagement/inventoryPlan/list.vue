<template>
  <div>
    <!-- {{ this.queryData}} -->
    <div class="common-header">
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
        <el-form-item class="query-btn-box">
          <el-button type="primary query-btn" @click="onQuery()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div class="common-new-built">
        <el-button type="primary" size="small" plain @click="addinvent()">新建</el-button>
      </div>
      <div>
        <el-table :data="tableData" stripe :height="this.defaultTableHeight">
          <el-table-column
            v-for="item in tableColumn"
            :key="item.key"
            :prop="item.key"
            :label="item.label"
            :formatter="item.formatter"
          ></el-table-column>
          <el-table-column label="操作" style="width:180px;">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click.stop="handleOperateEvent('1', row)">查看</el-button>
              <el-button type="text" size="small" @click.stop="handleOperateEvent('2', row)">编辑</el-button>
              <el-button type="text" size="small" @click.stop="handleOperateEvent('4', row)">删除</el-button>
            </template>
          </el-table-column>
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
            :total="this.total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 选择影院弹窗 -->
    <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit" :dialogFeedbackData="[{cinemaUid:queryData.cinemaUid,cinemaName:queryData.cinemaName}]"></cinemal-dialog>
    <!-- 选择供应商弹窗 -->
    <suppliers-dialog ref="mySuppliersDialog"></suppliers-dialog>

  </div>
</template>

<script>
import qs from "qs";
import mixin from "cim/mixins/cim/paginationConfig.js";
import cinemalDialog from "cim/components/cinemalDialog/cinemaDialog.vue";
import suppliersDialog from "cim/dialogs/cimSelectedGoods/index.vue";
import mixins from "frame_cpm/mixins/cacheMixin";
export default {
  mixins: [mixin,mixins.cacheMixin],
  data() {
    return {
      cacheField:["queryData"],
      returnType:false,
      list:{},
      //查询数据
      queryData: {
        cinemaName:"",
        cinemaUid:"",
        pageSize: 15,
        page: 1
      },
      total: 0,
      // 表格表头
      tableColumn: [
        {
          label: "门店名称",
          key: "cinemaName"
        },
        {
          label: "方案名称",
          key: "name"
        },
        {
          label: "方案描述",
          key: "remarks"
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
      this.$nextTick(() => {
        this.returnType = this.$route.query.returnType
        if(this.returnType === true){
          this.queryData.cinemaUid = JSON.parse(this.$route.query.cinema).cinemaUid
          this.queryData.cinemaName = JSON.parse(this.$route.query.cinema).cinemaName
        }
        if(this.queryData.cinemaUid == "" || this.queryData.cinemaUid == null){
        }else{
          this.goodsDataQueryGoodsList(this.queryData)
        }
      })
      
    },
    // 查询
    onQuery() {
      if(this.queryData.cinemaUid == "" || this.queryData.cinemaUid == null){
        this.$message("请选择门店");
      }else{
        this.goodsDataQueryGoodsList(this.queryData)
      }
      console.log(this.queryData);
    },
    // 新建按钮
    // handleNewPurchaseNote() {
    //   console.log("新建");
    //   this.$router.push({
    //     path: "common",
    //     query: {}
    //   });
    // },
    // 跳转库存转移
    handleNewPurchaseNote(param = {}) {
      let router = '';
      switch (param.type) {
        case "1":
          // 新增
          router = 'add';
          break;
        case "2":
          // 编辑
          router = 'edit';
          break;
        case "3":
          // 查看
          router = 'details';
          break;
      }
      this.$router.push({
        path: router,
        query: param
      });
    },

    handleOperateEvent(type, row) {
      switch (type) {
        case "1":
        this.seetable(row)
          // 查看
          break;
        case "2":
        this.eaittable(row)
          //编辑
          break;
        case "3":
          //提交
          break;
        case "4":
          //删除
          this.handleeDlete(row);
          break;
      }
    },
    // 删除操作
    handleeDlete(row) {
      this.$confirm("确认删除吗, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
      })
      .then(() => {
        this.resCheckSolutionDelete(row)
      })
      .catch(() => {});
      
    },
    // 新增操作
    addinvent(row){
      this.handleNewPurchaseNote({
        type:"1",
        data:JSON.stringify(row)
      })
    },
    // 查看操作
    seetable(row){
      this.handleNewPurchaseNote({
          type:"3",
          data:JSON.stringify(row.uid),
          cinemaName:JSON.stringify(row.cinemaName)
        })
      // this.resCheckSolutionToPage(row,"3")
    },
    // 修改操作
    eaittable(row){
      this.handleNewPurchaseNote({
          type:"2",
          data:JSON.stringify(row.uid),
          cinemaName:JSON.stringify(row.cinemaName)
        })
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
      console.log(val);
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
      this.$refs.myCinemalDialog.handleDialog(true);
    },
    selectSuppliersDialog() {
      this.$refs.mySuppliersDialog.handleDialog(true);
    },
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.goodsDataQueryGoodsList(this.queryData);
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.goodsDataQueryGoodsList(this.queryData);
      console.log(`当前页: ${val}`);
    },
    // 盘点方案查询请求
    goodsDataQueryGoodsList(val){
      // let val = {
      //   cinemaUid:this.queryData.cinemaUid,
      //   page:"1",
      //   pageSize:"10"
      // }
      this.$cimList.inventoryPlan
        .checkSolutionQuery(val)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data.list
            this.total = res.data.total
          } else {
            this.$message(res.msg);
          }
        })
    },
    // 盘点方案删除请求
    resCheckSolutionDelete(row){
      let val = {
        uid:row.uid
      }
      this.$cimList.inventoryPlan
        .checkSolutionDelete(val)
        .then(res => {
          if (res.code === 200) {
            this.goodsDataQueryGoodsList(this.queryData)
            this.$message("删除成功");
          } else {
            this.$message(res.msg);
            this.error(res.msg);
          }
        })
        .catch(err => {});

    },
    // // 跳转修改页面/取消修改/查询盘点方案商品清单
    resCheckSolutionToPage(row,type){
      let val = {
        uid:row.uid
      }
      this.$cimList.inventoryPlan
        .checkSolutionToPage(val)
        .then(res => {
          if (res.code === 200) {
            this.handleNewPurchaseNote({
              type:type,
              data:JSON.stringify(res.data)
            })
          } else {
            this.$message(res.msg);
            this.error(res.msg);
          }
        })
        .catch(err => {});
    },
  },
  components: {
    cinemalDialog,
    suppliersDialog
  }
};
</script>

<style lang="scss">
@import "../../../../assets/css/common.scss";
@import "../../../../assets/css/element-common.scss";

.select-input {
  .el-input {
    width: 70%;
  }
}

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
</style>