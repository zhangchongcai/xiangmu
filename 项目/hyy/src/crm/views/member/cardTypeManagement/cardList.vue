<template>
  <div class="member-list">
    <!-- 面包屑 -->
    <div class="crumbs-wrap">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>会员</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡政策管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap">
      <el-form-item label="可售渠道：" prop="channelNo">
        <el-select v-model="formData.channelNo" placeholder="全部渠道" clearable>
          <el-option v-for="item in sourceOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡类型：" prop="cardType">
        <el-select v-model="formData.cardType" placeholder="全部类型" clearable>
          <el-option v-for="item in cardTypeOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡状态：" prop="status">
        <el-select v-model="formData.status" placeholder="全部状态" clearable>
          <el-option v-for="item in cardStatusOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="政策名称：" prop="cardProductName">
        <el-input v-model="formData.cardProductName" @blur="()=>{formData.cardProductName = formData.cardProductName.trim()}"
          placeholder="填写政策名称" clearable></el-input>
      </el-form-item>
      <el-form-item class="btn-wrap">
        <el-button type="primary" @click="handleSearch" class="el-btn-custom">搜索</el-button>
        <el-button @click="resetForm('formData')" class="el-btn-custom">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="add-btn">
      <el-button type="primary" class="add-button-custom" @click="handleAddCardType">新建</el-button>
    </div>
    <div class="member-list-table _m-member-table-custom">
      <el-table :data="tableData" stripe style="width: 100%" :empty-text="tipMessage">
        <el-table-column prop="productNo" label="政策编号" min-width="100" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="cardName" label="政策名称" min-width="120" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="cardTypeCode" label="卡类型" min-width="120" :formatter="formateEmpty"
          show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.cardTypeCode | formatCardTypeCode}}</template>
        </el-table-column>
        <el-table-column prop="channelType" label="可售渠道" min-width="100" :formatter="formateEmpty"
          show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="scope.row.status=='unstart'?'unstart':scope.row.status=='start'?'start':'stop'" style="fontSize:12px;">{{scope.row.status
              | judegStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button @click="handleMemberDetail(scope.row)" type="text" size="small" class="operation-button">查看</el-button>
            <el-button @click="handleEmitCardType(scope.row)" type="text" size="small" class="operation-button" v-if="scope.row.status=='unstart'?true:false">修改</el-button>
            <el-button @click="handleStartUse(scope.row)" type="text" size="small" class="operation-button" v-if="scope.row.status=='unstart'?true:false">启用</el-button>
            <el-button @click="handleStopUse(scope.row)" type="text" size="small" class="operation-button" v-if="scope.row.status=='start'?true:false">停用</el-button>
            <el-button @click="handleOperationLog(scope.row)" type="text" size="small" class="operation-button"
              disabled>操作日志</el-button>
          </template>
        </el-table-column>
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
export default {
  name: "CardList",
  data() {
    return {
      tipMessage: "",
      currentPage: 1,
      total: 0,
      formData: {
        cardProductName: "", //卡名称
        cardType: "", //卡类型
        channelNo: "", //适用影院（渠道id）
        status: "", //卡状态
        current: 1,
        size: 20,
        tenantId: this.$store.state.loginUser.consumerId //租户id
      },
      tableData: [],
      cardTypeOptions: [], //卡类型
      cardStatusOptions: [], //卡状态
      sourceOptions: [] //适用影院
    };
  },
  mounted() {
    this.search();
    this.handleChannelList();
    this.handleCardType();
    this.handleCardStatus();
  },
  filters: {
    judegStatus: function(value) {
      // console.log("status=", value);
      if (value == "unstart") {
        return "未启用";
      } else if (value == "start") {
        return "已启用";
      } else if (value == "stop") {
        return "已停用";
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
    },
    // 卡类型
    formatCardTypeCode(value) {
      switch (value) {
        case "stored_card":
          return "储值卡";
          break;
        case "equity_card":
          return "权益卡";
          break;
        case "cobranded_card":
          return "联名卡";
          break;
        default:
          return "-";
          break;
      }
    }
  },
  methods: {
    search() {
      let params = JSON.parse(JSON.stringify(this.formData));
      this.tipMessage = "数据加载中...";
      this.$crmList
        .getCardTypeList(params)
        .then(data => {
          if (data.total == 0) {
            this.tipMessage = "暂无数据";
          }
          this.tableData = data.records;
          this.total = data.total;
          // this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.tipMessage = err.message;
          // this.loading = false;
        });
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
    // 适用影院
    handleChannelList() {
      let params = { tenantId: this.$store.state.loginUser.consumerId };
      let _this = this;
      _this.$crmList.channelList(params).then(ret => {
        ret.unshift({ code: "front_desk", desc: "影城前台" });
        _this.sourceOptions = ret;
      });
    },
    // 卡类型
    handleCardType() {
      let params = { tenantId: this.$store.state.loginUser.consumerId };
      let _this = this;
      _this.$crmList.getCardType(params).then(ret => {
        _this.cardTypeOptions = ret;
      });
    },
    // 卡状态
    handleCardStatus() {
      let params = { tenantId: this.$store.state.loginUser.consumerId };
      let _this = this;
      _this.$crmList.getCardStatus(params).then(ret => {
        _this.cardStatusOptions = ret;
      });
    },
    handleSizeChange(val) {
      this.formData.size = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.formData.current = val;
      this.search();
    },
    // 查看卡政策详情
    handleMemberDetail(scope) {
      // console.log("scope==========", scope);
      this.$router.push({
        path: "/member/cardTypeManagement/detail",
        query: {
          cardProductId: scope.id,
          tenantId: this.$store.state.loginUser.consumerId
        }
      });
    },
    // 新建卡政策
    handleAddCardType() {
      this.$router.push({ path: "/member/cardTypeManagement/addCardType" });
    },
    // 编辑卡政策
    handleEmitCardType(scope) {
      this.$router.push({
        path: "/member/cardTypeManagement/editCardType",
        query: { cardId: scope.id }
      });
    },
    // 启用
    handleStartUse(scope) {
      let _this = this;
      _this
        .$confirm(`确定要启用 ${scope.cardName} 吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let data = {
            status: "start",
            id: scope.id, //会员id
            tenantId: this.$store.state.loginUser.consumerId //租户id
          };
          _this.$crmList
            .changeCardTypeStatus(data)
            .then(() => {
              _this.search();
              _this.$message({
                type: "success",
                message: "已启用!"
              });
            })
            .catch(err => console.log(err));
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消启用"
          });
        });
    },
    // 停用
    handleStopUse(scope) {
      // console.log("scope=", scope);
      let _this = this;
      _this
        .$confirm(`确定要停用 ${scope.cardName} 吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let data = {
            status: "stop",
            id: scope.id, //会员id
            tenantId: this.$store.state.loginUser.consumerId //租户id
          };
          _this.$crmList
            .changeCardTypeStatus(data)
            .then(() => {
              _this.search();
              _this.$message({
                type: "success",
                message: "已停用!"
              });
            })
            .catch(err => console.log(err));
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消停用"
          });
        });
    },
    // 操作日志
    handleOperationLog(scope) {
      console.log("scope=", scope);
    },
    formateEmpty(row, column, cellValue, index) {
      return cellValue != null ? cellValue : "-";
    }
  }
};
</script>

<style lang='scss'>
.member-list {
  // padding: 20px;
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
      width: 96px;
      padding: 5px 20px;
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