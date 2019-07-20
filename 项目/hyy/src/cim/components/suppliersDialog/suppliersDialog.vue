<template>
  <el-dialog class="suppliers-dialog" width="500" :title="title" :visible.sync="supplierDialog" @open="openCallBack">
    <el-form
      :inline="true"
      :model="queryData"
      label-position="left"
      label-width="80px"
      label-suffix=":"
    >
      <el-form-item label="供应商编码">
        <el-input v-model="queryData.supplierCode" placeholder="请输入供应商编码"></el-input>
      </el-form-item>
      <el-form-item label="供应商名称">
        <el-input v-model="queryData.supplierName" placeholder="请输入供应商名称"></el-input>
      </el-form-item>
      <el-button @click="onQuery" type="primary" class="query-btn">搜索</el-button>
    </el-form>
    <div class="table-box">
      <el-table
        ref="supplierTable"
        :data="tableData"
        height="400"
        v-loading="tableLoding"
        row-key="supUid"
        @selection-change="handleSelectionsSupplier"
        stripe
      >
        <el-table-column type="selection" width="40" reserve-selection v-if="multiple"></el-table-column>
        <el-table-column width="40" v-else>
          <template slot-scope="scope">
            <el-radio
                    v-model="selectRadio"
                    :label="scope.row.uid"></el-radio>
          </template>
        </el-table-column>
        <el-table-column
          v-for="item in tableColumn"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          :formatter="item.formatter"
        ></el-table-column>
      </el-table>
      <div class="page-wrap">
        <el-pagination background
          :current-page="queryData.currentPage"
          :page-size="queryData.pageSize"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <span slot="footer">
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
      <el-button @click="handleDialog(false)">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    //标题
    title: {
      type: String,
      default: "选择供应商"
    },
    //门店id
    cinemaUid: {
      type: [String, Number],
      default: ""
    },
    //是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 回选数据
    dialogFeedbackData: {
      type: [Array],
      default: () => []
    },
  },
  data() {
    return {
      selectRadio:"",
      supplierDialog: false,
      //供应商弹窗查询数据
      queryData: {
        cinemaUid:"",
        supplierCode: "",
        supplierName: "",
        status: "1",
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
      tableData: [],
      tableLoding: false
    };
  },
  mounted() {

  },
  methods: {
    openCallBack() {
      this.init();
    },
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
      this.tableLoding =true;
      this.$cimList.procurement.supplierAdminQueryList(param).then(resData => {
        if (resData.code == 200) {
          // if (this.dialogFeedbackData.length > 0) {
          //   this.dialogFeedbackData.forEach(row => {
          //     this.$refs.supplierTable.toggleRowSelection(row, true);
          //   });
          // }
          this.tableData = resData.data.list.map(item => {
            item.supUid = item.uid;
            return item;
          })
          this.total = resData.data.total;
        }
        this.tableLoding =false;
      }).catch(err => {
        this.tableLoding = false;
      });
    },
    handleDialog(flag) {
      this.supplierDialog = flag;
    },
    handleSubmit() {
      if(!this.multiple) {
        this.supplierTableSelection = this.tableData.filter(item => {
          return item.uid == this.selectRadio
        });
      }
      this.$emit("onSumit", this.supplierTableSelection);
      this.handleDialog(false);
    },
    //选中供应商
    handleSelectionsSupplier(rows) {
      console.log(rows);
      this.supplierTableSelection = rows;
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
    },
  }
};
</script>

<style lang="scss">
.suppliers-dialog {
  .el-radio__label{
    display: none;
  }
  .el-button {
    margin-top: 5px;
  }
}
</style>