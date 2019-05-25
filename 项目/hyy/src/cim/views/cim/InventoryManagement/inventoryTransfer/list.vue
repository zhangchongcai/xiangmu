<template>
  <div>
    <div class="common-header">
        {{this.queryData}}
      <el-form
        :inline="true"
        :model="queryData"
        label-position="right"
        label-width="100px"
        label-suffix=":"
      >
        <el-form-item label="转移门店" class="select-input">
          <el-input v-model="queryData.cinemaName" placeholder="请选择门店"></el-input>
          <el-button @click="selectCinemalDialog">选择</el-button>
        </el-form-item>
        <el-form-item label="单据号">
          <el-input
            v-model="queryData.billCode"
            placeholder="请输内容"
            prefix-icon="el-icon-search"
          ></el-input>
        </el-form-item>
        <el-form-item label="制单日期">
          <el-date-picker
            v-model="queryData.billTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="单据状态">
          <el-select v-model="queryData.status">
            <el-option label="全部" value></el-option>
            <el-option label="未提交" value="1"></el-option>
            <el-option label="已提交" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="query-btn-box">
          <el-button type="primary" @click="onQuery()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div class="common-new-built">
        <el-button type="primary" size="small" plain @click="addinvent()">新建</el-button>
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
            <template slot-scope="{row}" v-if="row.status == 1">
              <el-button type="text" size="small" @click.stop="handleOperateEvent('1', row)">查看</el-button>
              <el-button type="text" size="small" @click.stop="handleOperateEvent('2', row)">修改</el-button>
              <el-button type="text" size="small" @click.stop="handleOperateEvent('3', row)">提交</el-button>
              <el-button type="text" size="small" @click.stop="handleOperateEvent('4', row)">删除</el-button>
            </template>
            <template slot-scope="{row}" v-if="row.status == 2">
              <el-button type="text" size="small" @click.stop="handleOperateEvent('1', row)">查看</el-button>
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
    <suppliers-dialog ref="mySuppliersDialog"></suppliers-dialog>
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
      selData:{},
      //查询数据
      queryData: {
        billCode: "",
        billTime: "",
        billUserUid: "",
        cinemaUid: "",
        cinemaName:"",
        status: "",
        pageSize: 10,
        page: 1
      },
      total: 0,
      // 表格表头
      tableColumn: [
        {
          label: "单据号",
          key: "billCode"
        },
        {
          label: "转移门店",
          key: "cinemaName"
        },
        {
          label: "转出仓库",
          key: "outStorehouseName"
        },
        {
          label: "转入仓库",
          key: "inStorehouseName"
        },
        {
          label: "制单员",
          key: "billUserName"
        },
        {
          label: "制单时间",
          key: "billTime"
        },
        {
          label: "单据状态",
          key: "status",
          formatter(row, column, cellValue) {
            let result = "";
            switch (row.status) {
              case 2:
                result = "已提交";
                break;
              case 1:
                result = "未提交";
                break;
            }
            return result;
          }
        }
      ],
      // 表格数据
      tableData: [
        {
          supplierCode: "CG201904010001",
          supplierName: "中影德金影城客村丽影店",
          areaName: "美联经营部"
        }
      ],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      this.goodsDataQueryGoodsList()
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
      console.log(val);
    },
    // 查询
    onQuery() {
      this.goodsDataQueryGoodsList()
      console.log(this.queryData);
    },
    // 新增库存转移
    addinvent(){
      this.resMoveBillFindMoveDetailInfo()
      this.handleNewPurchaseNote({
        type:"1",
        data:JSON.stringify(this.selData)
      })
    },
    // 跳转库存转移
    handleNewPurchaseNote(param) {
      this.$router.push({
        path: "common",
        query: param
      });
    },

    handleOperateEvent(type, row) {
      switch (type) {
        case "1":
          // 查看
          break;
        case "2":
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
    // 转移管理查询接口
    goodsDataQueryGoodsList(){
      let val = {
        billCode: this.queryData.billCode,
        billTime: this.queryData.billTime,
        billUserUid:this.queryData.billUserUid,
        cinemaUid: this.queryData.cinemaUid,
        status: this.queryData.status,
        pageSize: 10,
        page: 1
      }
      this.$cimList.inventoryTransfer
        .moveBillFindMoveList(val)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data.list
            console.log(res)
            debugger
          } else {
            this.error(res.msg);
            this.$message(res.msg);
          }
        })
    },
    // 转移管理查询接口
    resMoveBillFindMoveDetailInfo(row){
      let val = {
        uid:row == undefined ? "":row
      }
      this.$cimList.inventoryTransfer
        .moveBillFindMoveDetailInfo(val)
        .then(res => {
          if (res.code === 200) {
            this.selData = res.data
            console.log(res)
            debugger
          } else {
            this.error(res.msg);
            this.$message(res.msg);
          }
        })
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