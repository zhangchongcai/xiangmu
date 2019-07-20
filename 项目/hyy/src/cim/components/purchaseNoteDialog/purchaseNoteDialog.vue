<template>
  <el-dialog class="purchase-note-dialog" width="600" title="选择采购单" :visible.sync="supplierDialog" @open="openCallBack">
    <el-form
      :inline="true"
      :model="queryData"
      label-position="left"
      label-width="100px"
      label-suffix=":"
    >
      <el-form-item label="采购单号">
        <el-input v-model="queryData.billCode" placeholder="请输入采购单编码"></el-input>
      </el-form-item>
      <el-form-item label="采购单名称">
        <el-input v-model="queryData.supName" placeholder="请输入采购单名称"></el-input>
      </el-form-item>
      <el-form-item label="制单日期">
        <el-date-picker
          class="basic-input"
          v-model="queryData.billTimeTotal"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-button @click="onQuery" type="primary" class="query-btn">搜索</el-button>
    </el-form>
    <div class="table-box">
      <el-table
        ref="supplierTable"
        :data="tableData"
        height="300"
        row-key="uid"
        v-loading="tableLoding"
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
        <el-pagination
          background
          :current-page="queryData.currentPage"
          :page-size="queryData.pageSize"
          :total="total"
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
      default: "选择采购单"
    },
    //门店id
    cinemaUid: {
      type: [String, Number],
      default: ""
    },
    //审核状态
    approvalStatus: {
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
      selectRadio:'',
      supplierDialog: false,
      //采购单弹窗查询数据
      queryData: {
        billCode: "",
        supplierName: "",
        billTimeTotal: [],
        beginTime: "", //制单开始时间
        endTime: "", //制单结束时间
        approvalStatus: "2", //审核状态
        conditions: [2,3], //单据状态
        page: 1,
        pageSize: 10
      },
      total: 0,
      tableSelection: [],
      tableColumn: [
        {
          label: "采购单号",
          key: "billCode"
        },
        {
          label: "采购单名称",
          key: "supName"
        },
        {
          label: "制单日期",
          key: "billTime"
        },
        {
          label: "制单员",
          key: "billUserName"
        }
      ],
      tableData: [],
      tableLoding:false
    };
  },
  mounted() {

  },
  methods: {
    // 初始化
    init() {
      this.onQuery();
    },
    //弹窗打开回调
    openCallBack() {
      this.init();
    },
    // 查询
    onQuery() {
      console.log(this.queryData);
      this.queryData.cinemaUid = this.cinemaUid;
      this.queryData.approvalStatus = this.approvalStatus;
      if (this.queryData.billTimeTotal) {
        this.queryData.beginTime = this.queryData.billTimeTotal[0];
        this.queryData.endTime = this.queryData.billTimeTotal[1];
      } else {
        this.queryData.beginTime = "";
        this.queryData.endTime = "";
      }
      this.purchaseList(this.queryData);
    },
    // 查询
    purchaseList(param) {
      this.tableLoding = true;
      this.$cimList.procurement.purchaseList(param).then(resData => {
        if (resData.code == 200) {
          this.tableData = resData.data.list;
          this.total = resData.data.total;
        }
        this.tableLoding = false;
      }).catch(err => {
        this.tableLoding = false;
      });
    },
    handleDialog(flag) {
      this.supplierDialog = flag;
    },
    handleSubmit() {
      if(!this.multiple) {
        this.tableSelection = this.tableData.filter(item => {
          return item.uid == this.selectRadio
        });
      }
      this.$emit("onSumit", this.tableSelection);
      this.handleDialog(false);
    },
    //选中采购单
    handleSelectionsSupplier(rows) {
      console.log(rows);
      this.tableSelection = rows;
    }
  }
};
</script>

<style lang="scss" scoped>
  .purchase-note-dialog {
    /deep/ .el-radio__label{
      display: none;
    }
}
</style>