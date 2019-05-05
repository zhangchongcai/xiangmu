<template>
  <div class="jointNameCard-merchant-list">
    <!-- 面包屑 -->
    <div class="crumbs-wrap">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>会员</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡</el-breadcrumb-item>
        <el-breadcrumb-item>联名商户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="searchData" ref="searchData" class="search-data-wrap">
      <el-form-item label="商户编号" prop="merchantNum" :rules="[{ max: 20, message: '长度不可超过20个字符', trigger: 'blur' }]">
        <el-input v-model="searchData.merchantNum" @blur="()=>{searchData.merchantNum = searchData.merchantNum.trim()}"
          placeholder="请输入商户编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="商户名称" prop="merchantName" :rules="[{ max: 30, message: '长度不可超过30个字符', trigger: 'blur' }]">
        <el-input v-model="searchData.merchantName" @blur="()=>{searchData.merchantName = searchData.merchantName.trim()}"
          placeholder="请输入商户名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select v-model="searchData.status" placeholder="全部状态" clearable>
          <el-option v-for="item in merchantStatusOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="btn-wrap">
        <el-button type="primary" @click="handleSearch" class="el-btn-custom">搜索</el-button>
        <el-button @click="resetForm('searchData')" class="el-btn-custom">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="add-btn">
      <el-button type="primary" class="add-button-custom" @click="handleAddMerchant">新建</el-button>
    </div>
    <div class="entity-card-list-table _m-member-table-custom">
      <el-table :data="tableDataList" stripe style="width: 100%" :empty-text="tipMessage">
        <el-table-column prop="merchantNum" label="商户编号" min-width="140" :formatter="formateEmpty"
          show-overflow-tooltip></el-table-column>
        <el-table-column prop="merchantName" label="商户名称" min-width="140" :formatter="formateEmpty"
          show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="状态" min-width="120">
          <template slot-scope="scope">
            <span :class="scope.row.status== 1?'start-sale':'stop-sale'" style="fontSize:12px;">{{scope.row.status |
              judegStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="120" :formatter="formateEmpty" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="140">
          <template slot-scope="scope">
            <el-button @click="handleCardDetail(scope.row)" type="text" size="small" class="operation-button">查看</el-button>
            <el-button @click="handleStopSale(scope.row)" type="text" size="small" class="operation-button" v-if="scope.row.status== 1?true:false">停售</el-button>
            <el-button @click="handleStartSale(scope.row)" type="text" size="small" class="operation-button" v-if="scope.row.status== 0?true:false">开售</el-button>
            <el-button @click="handleEmitCard(scope.row)" type="text" size="small" class="operation-button" v-if="scope.row.status== 1?true:false">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 start -->
    <div class="page-wrap">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchData.current"
        :page-size="searchData.size" layout="prev, pager, next, jumper, sizes" :page-sizes="[20 , 50 , 100]" :total="total-0"></el-pagination>
    </div>
    <!-- 分页 end -->
  </div>
</template>
<script>
export default {
  name: "jointNameCardMerchantList",
  data() {
    return {
      tipMessage: "",
      total: 400,
      tableDataList: [],
      searchData: {
        merchantNum: "", //商户编号
        merchantName: "", // 商户名称
        status: "all", //状态
        current: 1,
        size: 20,
        tenantId: this.$store.state.loginUser.consumerId
      },
      merchantStatusOptions: [
        {
          code: "all",
          desc: "全部"
        },
        {
          code: "1",
          desc: "已开售"
        },
        {
          code: "0",
          desc: "已停售"
        }
      ]
    };
  },
  created() {
    this.search();
  },
  filters: {
    judegStatus: function(value) {
      if (value == 1) {
        return "已开售";
      } else if (value == 0) {
        return "已停售";
      } else {
        return "-";
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
    search() {
      let params = JSON.parse(JSON.stringify(this.searchData));
      this.tipMessage = "数据加载中...";
      this.$crmList
        .getjointNameCardList(params)
        .then(data => {
          if (data.total == 0) {
            this.tipMessage = "暂无数据";
          }
          this.tableDataList = data.records;
          this.searchData.size = data.size;
          this.total = data.total;
        })
        .catch(err => {
          this.tipMessage = err.message;
          console.log("errrrrrr", err.message);
        });
    },
    // 搜索
    handleSearch() {
      this.searchData.current = 1;
      this.search();
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 新建卡政策
    handleAddMerchant() {
      this.$router.push({ path: "/member/jointNameCard/addJointNameCardMerchant" });
    },
    handleEmitCard(scope) {
      this.$router.push({
        path: "/member/jointNameCard/addJointNameCardMerchant",
        query: { merchantId: scope.merchantId }
      });
    },
    // 查看详情
    handleCardDetail(scope) {
      this.$router.push({
        path: "/member/jointNameCard/detail",
        query: { merchantId: scope.merchantId }
      });
    },
    // 修改开停售信息
    editCardInfo(scope, status) {
      let _this = this;
      _this
        .$confirm(
          `确定要${status == 1 ? "开售" : "停售"} ${scope.merchantName} 吗？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
        .then(() => {
          let data = {
            compactId: scope.compactId,
            cooperationEnd: scope.cooperationEnd,
            cooperationStart: scope.cooperationStart,
            memo: scope.memo,
            merchantId: scope.merchantId,
            merchantName: scope.merchantName,
            status: status,
            tenantId: this.$store.state.loginUser.consumerId
          };
          _this.$crmList
            .editjointNameCardInfo(data)
            .then(() => {
              _this.search();
              if (status == 1) {
                _this.$message.success("已开售");
              } else {
                _this.$message.success("已停售");
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: `已取消${status == 1 ? "开售" : "停售"}`
          });
        });
    },
    // 停售
    handleStopSale(scope) {
      this.editCardInfo(scope, 0);
    },
    // 开售
    handleStartSale(scope) {
      this.editCardInfo(scope, 1);
    },
    /* 分页相关 start */
    handleSizeChange(val) {
      this.searchData.size = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.searchData.current = val;
      this.search();
    },
    /* 分页相关 end */
    formateEmpty(row, column, cellValue, index) {
      return cellValue != null ? cellValue : "-";
    }
  }
};
</script>
<style lang="scss">
.jointNameCard-merchant-list {
  .crumbs-wrap {
    padding: 0 0 20px 0;
  }
  .search-data-wrap {
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
      font-size: 12px;
    }
    .el-date-editor .el-range-separator {
      font-size: 12px;
    }
    // .el-date-editor--daterange.el-input__inner {
    //   width: 210px;
    //   color: #717171;
    //   font-size: 12px;
    // }
    .el-input--suffix .el-input__inner {
      width: 163px;
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
      width: 96px;
      padding: 5px 20px;
    }
  }
  // 表格样式
  .entity-card-list-table {
    .start-sale {
      color: #80d91e;
    }
    .stop-sale {
      color: #ff3d00;
    }
    .operation-button span {
      font-size: 12px;
    }
  }
}
</style>


