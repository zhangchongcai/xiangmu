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
        <el-form-item label="供应商编码">
          <el-input
            v-model="queryData.supplierCode"
            placeholder="请输内容"
            prefix-icon="el-icon-search"
          ></el-input>
        </el-form-item>
        <el-form-item label="供应商名称">
          <el-input
            v-model="queryData.supplierName"
            placeholder="请输内容"
            prefix-icon="el-icon-search"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="queryData.linkManTel" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="queryData.linkMan" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="销售状态">
          <el-select v-model="queryData.status">
            <el-option label="全部" value></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button type="primary" @click="onQuery()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div class="common-new-built">
        <el-button type="primary" size="small" plain @click="handleNewSupplier">新建</el-button>
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
  </div>
</template>

<script>
import qs from "qs";

export default {
  data() {
    return {
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
      // 表格表头
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
        },
        {
          label: "状态",
          key: "status",
          formatter(row, column, cellValue) {
            let result = "";
            switch (row.status) {
              case 1:
                result = "启用";
                break;
              case 0:
                result = "停用";
                break;
            }
            return result;
          }
        }
      ],
      // 表格数据
      tableData: [],
      changeRules: {
        // cinemaUid: [{ required: true, message: "请输入门店名称", trigger: "blur" }],
        // code: [{ required: true, message: "请输入仓库编码", trigger: "blur" }],
        // name: [{ required: true, message: "请输入仓库名称", trigger: "blur" }]
      }
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
    // 新建
    handleNewSupplier() {
      console.log("新建");
      this.$router.push({
        path: "common",
        query: {}
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
            this.onQuery();
          }
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
          //启停
          this.supplierAdminUpdateSupplierStatus({
            uid: row.uid,
            status: 0
          });
          break;
        case "4":
          //删除
          this.supplierAdminDeleteSupplier({ uid: row.uid });
          break;
      }
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
    }
  },
  components: {
    // ComBank
  }
};
</script>

<style lang="scss">
@import "../../../../assets/css/common.scss";
@import "../../../../assets/css/element-common.scss";
.change-dialog {
  .el-form--inline .el-form-item {
    width: 100%;
  }
  .el-form-item__content {
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