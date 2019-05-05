<template>
  <div class="member-list">
    <!-- 面包屑 -->
    <div class="crumbs-wrap">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>会员</el-breadcrumb-item>
        <el-breadcrumb-item>权益</el-breadcrumb-item>
        <el-breadcrumb-item>自有权益库管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap">
      <el-form-item label="权益ID：" prop="equityNo">
        <el-input v-model="formData.equityNo" placeholder="填写权益ID" clearable maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="权益名称：" prop="equityName">
        <el-input v-model="formData.equityName" placeholder="填写权益名称" clearable maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="权益类型：" prop="equityType">
        <el-select v-model="formData.equityType" placeholder="全部" clearable>
          <el-option v-for="item in equityTypeList" :key="item.name" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权益类别：" prop="equityCategory">
        <el-select class="heightBug" v-model="formData.equityCategory" placeholder="全部" clearable :disabled="formData.equityType != 'consumer_type'">
          <el-option v-for="item in equityCategoryList" :key="item.name" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select v-model="formData.status" placeholder="全部" clearable>
          <el-option v-for="item in cardStatusOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
        </el-select>
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
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="equityNo" :formatter="emptyShow" label="权益ID" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="equityName" :formatter="emptyShow" label="权益名称" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="equityTypeName" :formatter="emptyShow" label="权益类型" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="equityCategoryName" :formatter="equityCategoryNameShow" label="权益类别" min-width="100" show-overflow-tooltip></el-table-column>
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
            <el-button @click="handleStartUse(scope.row)" type="text" size="small" class="operation-button" v-if="scope.row.status=='start'?true:false">停用</el-button>
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
      tableData:[],
      cardStatusOptions:[],
      currentPage: 1,
      total: 20,
      formData: {
        equityName: "", //权益名称
        equityType: "", //权益类型
        equityCategory: "", //权益类别
        status: "", //卡状态
        equityNo: "", //权益ID
        current: 1,
        size: 20,
        tenantId: this.$store.state.loginUser.consumerId //租户id
      },
      equityTypeList: [
        { name: "服务类", value: "service_type" },
        { name: "消费类", value: "consumer_type" },
        { name: "体验类", value: "experience_type" },
        { name: "身份类", value: "identity_type" }
      ], //权益类型列表
      equityCategoryList: [
        { name: "影票折扣", value: "movie" },
        { name: "卖品折扣", value: "goods" },
        { name: "生日赠券", value: "birthday" },
        { name: "代金卷", value: "voucher" }
      ] //权益类别列表
    };
  },
  created() {
     this.search();

  },
  mounted() {
    this.handleCardStatus();
  },
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
    search() {
      let params = JSON.parse(JSON.stringify(this.formData));
      this.$crmList
        .getEquityList(params)
        .then(data => {
          this.tableData = data.records;
          this.total = data.total;
          // this.loading = false;
        })
        .catch(err => {
          // this.loading = false;
        });
    },
    equityCategoryNameShow(row, column, cellValue, index){
      if(row.equityType != "consumer_type"){
        return "-"
      }else{
        return cellValue? cellValue:"-"
      }

        
    },
    //数据为空格式化
    emptyShow(row, column, cellValue, index){
        return cellValue? cellValue:"-"
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
    // 查看卡权益详情
    handleMemberDetail(scope) {
      this.$router.push({
        path: "/member/ownRights/seeOwnrightsCard",
        query: {
          equityId: scope.id,
          tenantId: this.$store.state.loginUser.consumerId
        }
      });
    },
    // 新建卡权益
    handleAddCardType() {
      this.$router.push({ path: "/member/ownRights/addOwnRights" });
    },
    // 编辑卡权益
    handleEmitCardType(scope) {
      this.$router.push({
        path: "/member/ownRights/addOwnRights",
        query: { cardId: scope.id }
      });
    },
    // 启用/停用
    handleStartUse(scope) {
      var equityName = scope.equityName
      let _this = this;
      let data = {
        status: scope.status == "start" ? "stop" : "start",
        id: scope.id, //会员id
        tenantId: this.$store.state.loginUser.consumerId //租户id
      };
      let alertStr = scope.status == "start" ? "停用" : "启用";
      this.$confirm(`确定要${alertStr}${equityName}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _this.$crmList
            .changeEquityCardStatus(data)
            .then(() => {
              _this.search();
              this.$message({
                type: "success",
                message: `${alertStr}${equityName}成功!`
              });
            })
            .catch(err => console.log(err));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: `已取消${alertStr}${equityName}`
          });
        });
    }
  },
  watch:{
    //监听权益类型 处理消费类型的消费类别选择
    "formData.equityType"(val){
        if(val != "consumer_type"){
          this.formData.equityCategory = ""
        }
    }
  }
};
</script>

<style lang='scss'>
.member-list {
  // padding: 20px;
  .heightBug input{
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