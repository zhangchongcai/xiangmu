<template>
  <div class="tag-printing-list">
    <div class="common-header">
      <el-form
        :inline="true"
        :model="queryData"
        label-position="right"
        label-width="90px"
        label-suffix="："
      >
        <el-form-item label="商品名称">
          <el-input
            v-model="queryData.supplierCode"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input
            v-model="queryData.supplierName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
          <el-form-item label="SKU编码">
          <el-input v-model="queryData.linkManTel" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="速记代码">
          <el-input v-model="queryData.linkMan" placeholder="请输入"></el-input>
        </el-form-item>
        <el-button  class="query-btn" type="primary" @click="onQuery()">查询</el-button>
      </el-form>
    </div>
    <div>
      <div class="common-new-built">
        <el-button type="primary" size="small" plain @click="handleAddGoodEvent">添加商品</el-button>
        <el-button type="primary" size="small" plain >批量删除</el-button>
      </div>
      <div>
        <el-table :data="tableData" stripe v-loading="tableLoding"   ref="goodsTable">
          <el-table-column
                  type="selection"
                  width="40"
                  reserve-selection
          ></el-table-column>
          <el-table-column
            v-for="item in tableColumn"
            :key="item.key"
            :prop="item.key"
            :label="item.label"
            :formatter="item.formatter"
          ></el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="{row}">
              <el-button  type="text" size="small" @click.stop="handleOperateEvent('4', row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrap">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryData.page"
            :page-sizes="[10,20,30]"
            :page-size="queryData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <selected-goods
            :dialogVisible.sync="selectedGoodsDialogVisible"
            @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"
    ></selected-goods>
  </div>
</template>

<script>
  import mixins from "frame_cpm/mixins/cacheMixin";
  import selectedGoods from "cim/dialogs/cimSelectedGoods/index.vue";
export default {
  mixins: [mixins.cacheMixin],
  data() {
    return {
      cacheField:["queryData"],
      //查询数据
      queryData: {
        supplierCode: "",
        supplierName: "",
        linkManTel: "",
        linkMan: "",
        status: "",
        page: 1,
        pageSize: 10
      },
      // 数据总数
      total: 0,
      tableLoding: false,
      // 表格表头
      tableColumn: [
        {
          label: "商品名称",
          key: "supplierCode"
        },
        {
          label: "商品编码",
          key: "supplierName"
        },
        {
          label: "SKU编码",
          key: "areaName"
        },
        {
          label: "速记代码",
          key: "linkMan"
        },
        {
          label: "商品规格",
          key: "linkManTel"
        },
        {
          label: "基本单位",
          key: "linkManTel1"
        },
      ],
      // 表格数据
      tableData: [],
      changeRules: {
      },
      selectedGoodsDialogVisible:false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      this.onQuery();
    },
    // 查询
    onQuery() {
      console.log(this.queryData);
      this.supplierAdminQueryList(this.queryData);
    },
    // 查询
    supplierAdminQueryList(param) {
      this.tableLoding = true;
      this.$cimList.procurement.supplierAdminQueryList(param).then(resData => {
        if (resData.code == 200) {
          this.tableData = resData.data.list;
          this.total = resData.data.total;
        }
        this.tableLoding = false;
      }) .catch(() => {
        this.tableLoding = false;
      });

    },
    // 禁用或者启用
    supplierAdminUpdateSupplierStatus(param) {
      this.$cimList.procurement
        .supplierAdminUpdateSupplierStatus(param)
        .then(resData => {
          if (resData.code == 200) {
            this.onQuery();
          }
        });
    },
    // 删除
    supplierAdminDeleteSupplier(param) {
      this.$cimList.procurement
        .supplierAdminDeleteSupplier(param)
        .then(resData => {
          if (resData.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.onQuery();
          }
        });
    },
    // 添加商品
    handleAddGoodEvent() {
      this.selectedGoodsDialogVisible =true;
    },
    selectedGoodsDialogCallBack(){},
   
    jumpPage(param = {}) {
      this.$router.push({
        path: "/retail/procurement/suppliers/common",
        query: param
      });
    },
    handleOperateEvent(type, row) {
      switch (type) {
        case "1":
          // 查看
          this.jumpPage({
            type: "3",
            data: JSON.stringify(row)
          });
          break;
        case "2":
          //编辑
          this.jumpPage({
            type: "2",
            data: JSON.stringify(row)
          });
          break;
        case "3":
          //启停
          this.supplierAdminUpdateSupplierStatus({
            uid: row.uid,
            status: row.status
          });
          break;
        case "4":
          //删除
          this.$confirm("<i class='el-icon-circle-close'></i><span>确定删除吗?</span>", {
            customClass: "retail-style",
            dangerouslyUseHTMLString: true,
            cancelButtonText: "取消",
            confirmButtonText: "确定",
            center: true,
          })
            .then(() => {
              this.supplierAdminDeleteSupplier({ uid: row.uid });
            })
            .catch(() => {});
          break;
      }
    },
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.onQuery();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.onQuery();
      console.log(`当前页: ${val}`);
    }
  },
  components: {
    selectedGoods
  }
};
</script>

<style lang="scss">
@import "../../../../assets/css/common.scss";
@import "../../../../assets/css/element-common.scss";
.tag-printing-list{

}

</style>