<template>
  <el-dialog class="suppliers-dialog" width="60%" title="选择供应商" :visible.sync="supplierDialog">
    <el-form
      :inline="true"
      :model="queryData"
      label-position="left"
      label-width="100px"
      label-suffix=":"
    >
      <el-form-item label="供应商编码">
        <el-input v-model="queryData.supplierCode" placeholder="请输入供应商编码"></el-input>
      </el-form-item>
      <el-form-item label="供应商名称">
        <el-input v-model="queryData.supplierName" placeholder="请输入供应商名称"></el-input>
      </el-form-item>
      <el-button @click="onQuery">搜索</el-button>
    </el-form>
    <div class="table-box">
      <el-table
        ref="supplierTable"
        :data="tableData"
        height="300"
        @selection-change="handleSelectionsSupplier"
        stripe
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column
          v-for="item in tableColumn"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          :formatter="item.formatter"
        ></el-table-column>
      </el-table>
      <div class="page-wrap">
        <el-pagination
          :current-page="queryData.currentPage"
          :page-size="queryData.pageSize"
          :total="total"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <span slot="footer">
      <el-button @click="handleDialog(false)">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      supplierDialog: false,
      //供应商弹窗查询数据
      queryData: {
        supplierCode: "",
        supplierName: "",
        page: 1,
        pageSize: 10
      },
      supplierDialog: false, //搜索条件选择供应商弹窗
      total: 0,
      supplierTableSelection: [],
      tableColumn: [
        {
          label: "供应商编码",
          key: "supplierCode"
        },
        {
          label: "供应商名称",
          key: "supplierName"
        },
        {
          label: "区域",
          key: "areaName"
        },
        {
          label: "联系人",
          key: "linkMan"
        },
        {
          label: "联系电话",
          key: "linkManTel"
        }
      ],
      tableData: []
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
      this.$cimList.procurement.supplierAdminQueryList(param).then(resData => {
        if (resData.code == 200) {
          this.tableData = resData.data.list;
          this.total = resData.data.total;
        }
      });
    },
    handleDialog(flag) {
      this.supplierDialog = flag;
    },
    handleSubmit() {
      this.$emit("onSumit", this.supplierTableSelection);
      this.handleDialog(false);
    },
    //选中供应商
    handleSelectionsSupplier(rows) {
      console.log(rows);
      this.supplierTableSelection = rows;
      if (this.supplierTableSelection.length > 1) {
        this.$refs.supplierTable.toggleRowSelection(
          this.supplierTableSelection[0]
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.suppliers-dialog {
  .el-form-item__content {
    width: 250px;
  }
  .el-button {
    margin-top: 5px;
  }
}
</style>