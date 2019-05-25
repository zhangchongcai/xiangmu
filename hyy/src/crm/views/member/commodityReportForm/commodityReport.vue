<template>
  <div class="commodityList">
    <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap">
      <el-form-item label="商品ID：" prop="goodsNo">
        <el-input v-model="formData.goodsNo" placeholder="商品ID" clearable maxlength="20" style="width:120px"></el-input>
      </el-form-item>
      <el-form-item label="商品名称：" prop="goodsName">
        <el-input v-model="formData.goodsName" placeholder="商品名称" clearable maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="商家名称：" prop="merchantName">
        <el-input v-model="formData.merchantName" placeholder="商家名称" clearable maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="商品属性：" prop="goodsAttribute">
        <el-select v-model="formData.goodsAttribute" placeholder="请选择商品属性" clearable>
          <el-option v-for="item in goodsAttributeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品类型：" prop="goodsType">
        <el-select v-model="formData.goodsType" placeholder="请选择商品类型" clearable>
          <el-option v-for="item in goodsTypeList" :key="item.commodityTypeNo" :label="item.commodityTypeName" :value="item.commodityTypeNo"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="btn-wrap">
        <el-button type="primary" @click="handleSearch" class="el-btn-custom">搜索</el-button>
        <el-button @click="resetForm('formData')" class="el-btn-custom">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="add-btn">
      <el-button class="add-button-custom" @click="goGoodsDetail">商品明细数据</el-button>
      <el-button class="add-button-custom" @click="exportExcel">导出Excel</el-button>
    </div>
    <div class="member-list-table _m-member-table-custom">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="goodsNo" :formatter="emptyShow" label="商品ID" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goodsName" :formatter="emptyShow" label="商品名称" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="merchantName" :formatter="emptyShow" label="商家名称" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goodsAttribute" :formatter="goodsAttribute" label="商品属性" min-width="120"
          show-overflow-tooltip></el-table-column>
        <el-table-column prop="goodsTypeName" :formatter="emptyShow" label="商品类型" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="totalAmount" :formatter="emptyShow" label="总量" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="inventoryNum" :formatter="emptyShow" label="剩余" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="saleVolume" :formatter="emptyShow" label="发售量" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="writeOffNum" :formatter="emptyShow" label="已核销" min-width="120" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <!-- 分页 start -->
    <div class="page-wrap">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-size="formData.size" layout="prev, pager, next, jumper, sizes" :page-sizes="[20 , 50 , 100]" :total="total-0"></el-pagination>
    </div>
    <!-- 分页 end -->
  </div>
</template>

<script>
import formData from "../../../util/formatDate.js";
export default {
  name: "CardList",
  data() {
    return {
      tableData: [],
      currentPage: 1,
      total: 20,
      formData: {
        goodsAttribute: "", //编号
        goodsName: "", //名称
        goodsNo: "", //创建人
        goodsType: "",
        merchantName: "",
        current: 1,
        size: 20,
        tenantId: this.$store.state.loginUser.consumerId //租户id
      },
      goodsAttributeList: [
        { code: "", name: "全部" },
        { code: "electronic_coupons", name: "电子优惠券" },
        { code: "virtual_card", name: "虚拟卡" },
        { code: "physical_commodity", name: "实物商品" }
      ],
      goodsTypeList: [{ commodityTypeName: "全部", commodityTypeNo: "" }]
    };
  },
  created() {
    this.getdiffCommodityTypeList();
    this.search();
  },
  mounted() {},
  filters: {
    judegStatus: function(value) {
      if (value == "unstart") {
        return "未启用";
      } else if (value == "start") {
        return "已启用";
      } else {
        return "已停用";
      }
    },
    formatCreateTime: function(value) {
      if (value) {
        return new Date(value.replace(/-/g, "/")).formatDate("yyyy-MM-dd");
      } else {
        return "-";
      }
    }
  },
  methods: {
    getdiffCommodityTypeList() {
      let params = { tenantId: this.formData.tenantId };
      this.$crmList.diffCommodityTypeList(params).then(res => {
        this.$set(
          this,
          "goodsTypeList",
          this.goodsTypeList.concat(res.records)
        );
      });
    },
    search() {
      let params = this.formData;
      this.$crmList
        .diffGoodsList(params)
        .then(data => {
          this.tableData = data.records;
          this.total = data.total;
          // this.loading = false;
        })
        .catch(err => {
          // this.loading = false;
        });
    },
    //数据为空格式化
    emptyShow(row, column, cellValue, index) {
      return cellValue ? cellValue : "-";
    },
    goodsAttribute(row, column, cellValue, index) {
      if (cellValue == "electronic_coupons") {
        return "电子优惠券";
      } else if (cellValue == "virtual_card") {
        return "虚拟卡";
      } else if (cellValue == "physical_commodity") {
        return "实物商品";
      } else {
        return "-";
      }
    },
    // 搜索
    handleSearch() {
      this.formData.current = 1;
      this.search();
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSizeChange(val) {
      this.formData.size = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.formData.current = val;
      this.search();
    },
    // 新建异业商品类型
    goGoodsDetail() {
      this.$router.push({
        path: "/member/commodityReportForm/commodityReportDetail"
      });
    },
    exportExcel() {
      let url =
        this.$store.state.crm.domain +
        "/diff/goods/export/goods/list?tenantId=" +
        this.$store.state.loginUser.consumerId +
        "&merchantName=" +
        this.formData.merchantName+
        "&goodsAttribute=" +
        this.formData.goodsAttribute+
        "&goodsName=" +
        this.formData.goodsName+
        "&goodsNo=" +
        this.formData.goodsNo+
        "&goodsType=" +
        this.formData.goodsType
      window.open(url, "_blank");
    }
  },
  watch: {}
};
</script>

<style lang='scss'>
.commodityList {
  // padding: 20px;
  .heightBug input {
    height: 32px !important;
  }
  .crumbs-wrap {
    padding: 0 0 20px 0;
  }
  .form-data-wrap {
    padding: 15px 20px 0;
    background: #f5f5f5;
    .el-form-item {
      margin-bottom: 15px;
    }
    .el-form-item__label {
      font-size: 12px;
      color: #717171;
      padding: 0 6px 0 0;
    }
    .el-date-editor .el-range-input {
      // color: #717171;
      font-size: 12px;
    }
    .el-date-editor .el-range-separator {
      font-size: 12px;
    }
    .el-date-editor--daterange.el-input__inner {
      width: 210px;
      color: #717171;
      font-size: 12px;
    }
    .el-input--suffix .el-input__inner {
      width: 125px;
      color: #717171;
      font-size: 12px;
      padding-right: 0;
    }
  }
  .add-btn {
    font-size: 12px;
    padding: 6px 0;
    text-align: right;
    .add-button-custom {
      font-size: 12px;
      padding: 5px 20px;
      border: none;
      color: #0099ff;
    }
  }
  .member-list-table {
    .unstart {
      color: #0099ff;
    }
    .start {
      color: #80d91e;
    }
    .stop {
      color: #ff3d00;
    }
    .operation-button span {
      font-size: 12px;
    }
  }
}
</style>
