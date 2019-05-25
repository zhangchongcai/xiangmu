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
        <el-form-item label="盘点门店" class="select-input">
          <el-input v-model="queryData.cinemaName" placeholder="请选择门店"></el-input>
          <el-button @click="selectCinemalDialog">选择</el-button>
        </el-form-item>
        <el-form-item label="盘点单号">
          <el-input
            v-model="queryData.billCode"
            placeholder="请输内容"
            prefix-icon="el-icon-search"
          ></el-input>
        </el-form-item>
        <el-form-item label="制单时间">
          <el-date-picker
            class="basic-input"
            v-model="queryData.createTime"
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
            <el-option label="待差异确认" value="3"></el-option>
            <el-option label="盘点完成" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="queryData.approvalStatus">
            <el-option label="全部" value></el-option>
            <el-option label="未审核" value="0"></el-option>
            <el-option label="待审核" value="1"></el-option>
            <el-option label="审核通过" value="2"></el-option>
            <el-option label="审核不通过" value="3"></el-option>
            <el-option label="无需审核" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="盘点月份">
          <el-date-picker
            v-model="queryData.checkMonth"
            type="month"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>

        <el-form-item label=''>
          <el-select v-model="queryData.storeType">
            <!-- <el-option label="全部" value></el-option> -->
            <el-option label="盘点仓库" value="1"></el-option>
            <el-option label="盘点货架" value="2"></el-option>
          </el-select>
          <span>:</span>
          <el-select v-model="queryData.storehouseName" @focus="storeSelEvent()">
            <el-option 
              v-for = "item in storeData"
              :key="item.key"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button type="primary" @click="onQuery()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
        {{this.queryData}}
        <!-- {{this.queryData.storehouseName}} -->
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
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click.stop="handleOperateEvent('1', row)">查看</el-button>
              <el-button type="text" size="small" @click.stop="handleOperateEvent('2', row)">修改</el-button>
              <el-button type="text" size="small" @click.stop="handleOperateEvent('3', row)">提交</el-button>
<!--               <el-button
                type="text"
                size="small"
                @click.stop="handleOperateEvent('3', row)"
              >{{row.canSaleType == 1 ? "启用":"停用"}}</el-button> -->
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
    <cinemal-dialog ref="myCinemalDialog"></cinemal-dialog>
    <!-- 选择供应商弹窗 -->
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
      newBillCode:"",
      //查询数据
      queryData: {
        cinemaName: "",
        cinemaUid: "",
        billCode: "",
        createTime: "",
        status: "",
        approvalStatus: "",
        checkMonth: "",
        storeType: "1",
        storehouseCode: "",
        storehouseName: "",
        pageSize: 10,
        page: 1
      },
      storeData:[],
      total: 0,
      // 表格表头
      tableColumn: [
        {
          label: "盘点单号",
          key: "billCode"
        },
        {
          label: "盘点门店",
          key: "cinemaName"
        },
        {
          label: "盘点方案",
          key: "solutionName"
        },
        {
          label: "盘点月份",
          key: "checkMonth"
        },
        {
          label: "盘点仓库",
          key: "storehouseName"
        },
        {
          label: "制单员",
          key: "createUserName"
        },
        {
          label: "制单时间",
          key: "createTime"
        },
        {
          label: "单据状态",
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
                result = "待差异确认";
                break;
              case 4:
                result = "盘点完成";
                break;
            }
            return result;
          }
        },
        {
          label: "审核状态",
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
      tableData: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      this.resCheckBillQuery(this.queryData)
    },
    // 查询
    onQuery() {
      this.resCheckBillQuery(this.queryData)
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
    handleNewPurchaseNote(param) {
      this.$router.push({
        path: "common",
        query: param
      });
    },
    // 新建盘点单
    addinvent(row){
      this.handleNewPurchaseNote({
        type:"1",
        data:JSON.stringify(row)
      })
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
    storeSelEvent(){
      if(this.queryData.storeType == "1"){
        this.rescheckBillStorehouse("111111")
      }else if(this.queryData.storeType == "2"){
        this.resCheckBillStorageRack("111111")
      }
    },
    // 请求仓库列表
    rescheckBillStorehouse(row){
      let val = {
        cinemaUid:row.uid
      }
      this.$cimList.inventoryManagement
        .checkBillStorehouse(val)
        .then(res => {
          if (res.code === 200) {
            this.storeData = res.data
            console.log(res)
          } else {
            this.$message(res.msg);
            this.error(res.msg);
          }
        })
        .catch(err => {});
    },
    // 请求货架列表
    resCheckBillStorageRack(row){
      let val = {
        cinemaUid:row.uid
      }
      this.$cimList.inventoryManagement
        .checkBillStorageRack(val)
        .then(res => {
          if (res.code === 200) {
            this.storeData = res.data
            console.log(res)
          } else {
            this.$message(res.msg);
            this.error(res.msg);
          }
        })
        .catch(err => {});
    },
    // 请求盘点单首页查询
    resCheckBillQuery(row){
      let val = {
        cinemaUid:row
      }
      this.$cimList.inventoryManagement
        .checkBillQuery(row)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data.list
            console.log(res)
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