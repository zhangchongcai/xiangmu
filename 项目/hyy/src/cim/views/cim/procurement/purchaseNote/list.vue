<template>
  <div>
    <div class="common-header">
      <el-form
        :inline="true"
        :model="queryData"
        label-position="right"
        label-width="100px"
        label-suffix=":"
      >
        <el-form-item label="采购单号">
          <el-input v-model="queryData.billCode" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="采购门店" class="select-input">
          <el-input
            v-model="queryData.cinemaName"
            clearable
            @clear="onCinemalSumit()"
            placeholder="请选择门店"
          ></el-input>
          <el-button @click="selectCinemalDialog">选择</el-button>
        </el-form-item>
        <el-form-item label="供应商名称" class="select-input">
          <el-input v-model="queryData.supName" clearable placeholder="请选择供应商"></el-input>
          <el-button @click="selectSuppliersDialog">选择</el-button>
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
        <el-form-item label="单据状态">
          <el-select v-model="queryData.status">
            <el-option label="全部" value></el-option>
            <el-option label="未提交" value="1"></el-option>
            <el-option label="已提交" value="2"></el-option>
            <el-option label="部分入库" value="3"></el-option>
            <el-option label="全部入库" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="queryData.approvalStatus">
            <el-option label="全部" value></el-option>
            <el-option label="未审核" value="0"></el-option>
            <el-option label="待审核" value="1"></el-option>
            <el-option label="审核通过" value="2"></el-option>
            <el-option label="审核不通过" value="3"></el-option>
            <!-- <el-option label="无需审核" value="4"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button type="primary" @click="onQuery()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div class="common-new-built">
        <el-button type="primary" size="small" plain @click="handleNewPurchaseNote">新建</el-button>
        <!-- <el-button type="primary" size="small" plain>批量导出</el-button> -->
      </div>
      <div>
        <el-table :data="tableData" stripe>
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
              <el-button type="text" size="small" @click.stop="handleOperateEvent('2', row)">修改</el-button>
              <el-button
                type="text"
                size="small"
                @click.stop="handleOperateEvent('3', row)"
              >{{row.canSaleType == 1 ? "启用":"停用"}}</el-button>
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
            :page-sizes="[10,20,30]"
            :page-size="queryData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 选择影院弹窗 -->
    <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit"></cinemal-dialog>
    <!-- 选择供应商弹窗 -->
    <suppliers-dialog ref="mySuppliersDialog" @onSumit="onSupplierSumit"></suppliers-dialog>
  </div>
</template>

<script>
import qs from "qs";
import mixin from "cim/mixins/cim/paginationConfig.js";
import cinemalDialog from "cim/components/cinemalDialog/cinemaDialog.vue";
import suppliersDialog from "cim/components/suppliersDialog/suppliersDialog.vue";
export default {
  mixins: [mixin],
  data() {
    return {
      //查询数据
      queryData: {
        billCode: "", //采购单号
        cinemaUid: "", //门店id
        cinemaName: "", //门店名称
        supName: "", //供应商名称
        billTimeTotal: [],
        beginTime: "", //制单开始时间
        endTime: "", //制单结束时间
        page: 1,
        pageSize: 10
      },
      total: 0,
      // 表格表头
      tableColumn: [
        {
          label: "采购单号",
          key: "billCode"
        },
        {
          label: "采购门店",
          key: "cinemaName"
        },
        {
          label: "供应商名称",
          key: "supName"
        },
        {
          label: "制单日期",
          key: "billTime"
        },
        {
          label: "制单员",
          key: "billUserName"
        },
        {
          label: "单据状态", //1：未提交，2：已提交，3：部分入库，4：全部入库
          key: "status",
          formatter(row, column, cellValue) {
            let result = "";
            switch (row.status) {
              case 1:
                result = "未提交";
                break;
              case 2:
                result = "已提交";
                break;
              case 3:
                result = "部分入库";
                break;
              case 4:
                result = "全部入库";
                break;
            }
            return result;
          }
        },
        {
          label: "审核状态", //,0：未审核，1：待审核，2：审核通过，3：审核不通过，4：无需审核'
          key: "approvalStatus",
          formatter(row, column, cellValue) {
            let result = "";
            switch (row.approvalStatus) {
              case 0:
                result = "未审核";
                break;
              case 1:
                result = "待审核";
                break;
              case 2:
                result = "审核通过";
                break;
              case 3:
                result = "审核不通过";
                break;
              case 4:
                result = "无需审核";
                break;
            }
            return result;
          }
        }
      ],
      // 表格数据
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
      if (this.queryData.billTimeTotal) {
        this.queryData.beginTime = this.queryData.billTimeTotal[0];
        this.queryData.endTime = this.queryData.billTimeTotal[1];
      } else {
        this.queryData.beginTime = "";
        this.queryData.endTime = "";
      }
      this.getPurchaseList(this.queryData);
    },
    // 查询
    getPurchaseList(param) {
      this.$cimList.procurement.purchaseList(param).then(resData => {
        if (resData.code == 200) {
          this.tableData = resData.data.list;
          this.total = resData.data.total;
        }
      });
    },
    // 新建
    handleNewPurchaseNote() {
      console.log("新建");
      this.jumpPage({
        type: "1"
      });
    },
    jumpPage(param = {}) {
      this.$router.push({
        path: "common",
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

          break;
        case "3":
          //启停
          break;
        case "4":
          //删除
          this.handleeDlete(row);
          break;
      }
    },
    // 删除操作
    handleeDlete(row) {
      this.$api
        .delStorehouse(row.id)
        .then(data => {})
        .catch(err => {
          console.log(err);
        });
    },
    selectCinemalDialog() {
      this.$refs.myCinemalDialog.handleDialog(true);
    },
    selectSuppliersDialog() {
      this.$refs.mySuppliersDialog.handleDialog(true);
    },
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.goodsDataQueryGoodsList();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.goodsDataQueryGoodsList();
      console.log(`当前页: ${val}`);
    },
    // 选泽门店回调
    onCinemalSumit(val = []) {
      if (val.length > 0) {
        this.queryData.cinemaName = val[0].name;
        this.queryData.cinemaUid = val[0].cinemaUid;
      } else {
        this.queryData.cinemaName = "";
        this.queryData.cinemaUid = "";
      }
      console.log(this.queryData);
    },
    // 选泽供应商回调
    onSupplierSumit(val = []) {
      if (val.length > 0) {
        this.queryData.supName = val[0].supplierName;
        // this.queryData.cinemaUid = val[0].cinemaUid;
      } else {
        this.queryData.supName = "";
        // this.queryData.cinemaUid = "";
      }
      console.log(this.queryData);
    }
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