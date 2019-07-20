<template>
  <div class="member-list">
    <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap _member-search-area-custom">
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
          <el-option v-for="item in cardStatusOptions" :key="item.code" :label="item.desc" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="政策名称：" prop="cardProductName">
        <el-input v-model="formData.cardProductName"
          @blur="()=>{formData.cardProductName = formData.cardProductName.trim()}" placeholder="填写政策名称" clearable>
        </el-input>
      </el-form-item>
      <el-form-item class="btn-wrap">
        <el-button type="primary" @click="handleSearch" class="_el-btn-custom">搜索</el-button>
        <el-button @click="resetForm('formData')" plain class="_el-btn-custom _member-custom-ghost-button">重置
        </el-button>
      </el-form-item>
    </el-form>
    <div class="add-btn">
      <el-button :plain="true" class="_el-btn-custom _member-custom-ghost-button" @click="handleAddCardType">新建
      </el-button>
    </div>
    <div class="member-list-table _m-member-table-custom">
      <el-table :data="tableData" stripe style="width: 100%" :empty-text="tipMessage">
        <el-table-column prop="productNo" label="政策编号" min-width="120" :formatter="formateEmpty" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="cardName" label="政策名称" min-width="120" :formatter="formateEmpty" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="cardTypeCode" label="卡类型" min-width="100" :formatter="formateEmpty"
          show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.cardTypeCode | formatCardTypeCode}}</template>
        </el-table-column>
        <el-table-column prop="channelType" label="可售渠道" min-width="120" :formatter="formateEmpty"
          show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="scope.row.status=='unstart'?'unstart':scope.row.status=='start'?'start':'stop'"
              style="fontSize:12px;">{{scope.row.status
              | judegStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="defaultCard" label="默认政策" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.defaultCard | formatdefaultCard}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="165">
          <template slot-scope="scope">
            <el-button @click="handleMemberDetail(scope.row)" type="text" size="small" class="operation-button">查看
            </el-button>
            <el-button @click="handleEmitCardType(scope.row)" type="text" size="small" class="operation-button"
              v-if="scope.row.status=='unstart'?true:false">编辑</el-button>
            <el-button @click="handleChangeStatus('start',scope.row)" type="text" size="small" class="operation-button"
              v-if="scope.row.status=='unstart'?true:false">启用</el-button>
            <el-button @click="handleChangeStatus('stop',scope.row)" type="text" size="small" class="operation-button"
              v-if="scope.row.status=='start'?true:false">停用</el-button>
            <el-button @click="handleSetDefault(scope.row)" type="text" size="small" class="operation-button"
              v-if="scope.row.cardTypeCode == 'stored_card' && scope.row.status=='start' && scope.row.defaultCard == 0?true:false">
              设为默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 start -->
    <div class="page-wrap">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="formData.current-0" :page-size="formData.size-0" layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[20 , 50 , 100]" :total="total-0"></el-pagination>
    </div>
    <!-- 分页 end -->
    <!-- 启用、停用的dialog -->
    <el-dialog title="" :visible.sync="stopStartDialog" width="320px" :show-close="false"
      class="_member-tip-dialog-custom-style">
      <i class="iconfont icon-danchuang-tishi _member-tip-dialog-icon"></i>
      <span class="_member-tip-dialog-desc">确定要{{statusFlag == 'start'?'启用':'停用'}} {{stopStartInfo.cardName}} 吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSureChangeStatus" class="_el-btn-custom _member-add-edit-save-btn">确定
        </el-button>
        <el-button @click="stopStartDialog = false" class="_el-btn-custom _member-add-edit-save-btn">取消</el-button>
      </span>
    </el-dialog>
    <!-- 设置默认的dialog -->
    <el-dialog title="" :visible.sync="setDefaultDialog" width="320px" :show-close="false"
      class="_member-tip-dialog-custom-style">
      <i class="iconfont icon-danchuang-tishi _member-tip-dialog-icon"></i>
      <span class="_member-tip-dialog-desc">是否取消之前的默认政策设置，将此条政策设为默认？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSureSetDefault" class="_el-btn-custom _member-add-edit-save-btn">确定
        </el-button>
        <el-button @click="setDefaultDialog = false" class="_el-btn-custom _member-add-edit-save-btn">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "CardList",
  data() {
    return {
      setDefaultDialog: false, //设置默认的dialog
      setDefaultInfo: "", //设置默认的信息
      stopStartDialog: false, //启停用dialog
      statusFlag: "", //启停用flag
      stopStartInfo: "", //启停用信息
      tipMessage: "",
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
  // activated() {
  //   this.search();
  //   this.handleChannelList();
  //   this.handleCardType();
  //   this.handleCardStatus();
  // },
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
    // 默认政策
    formatdefaultCard(value) {
      if (value == 0) {
        return "否";
      } else if (value == 1) {
        return "是";
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
        case "times_card":
          return "次卡";
          break;
        case "gift_card":
          return "礼品卡";
          break;
        case "month_card":
          return "包月卡";
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
        })
        .catch(err => {
          console.log(err);
          if (err && err.msg) {
            this.tipMessage = err.msg;
          } else {
            this.tipMessage = "系统繁忙，请稍后重试！";
          }
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
    // 启用、停用
    handleChangeStatus(flag, scope) {
      this.stopStartDialog = true;
      this.statusFlag = flag;
      this.stopStartInfo = scope;
    },
    // 确定启用、停用
    handleSureChangeStatus() {
      this.stopStartDialog = false;
      let data = {
        status: this.statusFlag == "start" ? "start" : "stop",
        id: this.stopStartInfo.id, //会员id
        tenantId: this.$store.state.loginUser.consumerId //租户id
      };
      this.$crmList
        .changeCardTypeStatus(data)
        .then(() => {
          this.search();
          this.$message({
            type: "success",
            message: `${this.statusFlag == "start" ? "已启用" : "已停用"}`
          });
        })
        .catch(err => console.log(err));
    },
    // 设置默认
    handleSetDefault(scope) {
      this.setDefaultDialog = true;
      this.setDefaultInfo = scope;
    },
    // 确定设置默认
    handleSureSetDefault() {
      this.setDefaultDialog = false;
      let params = {
        tenantId: this.$store.state.loginUser.consumerId, //租户id
        id: this.setDefaultInfo.id
      };
      this.$crmList
        .setDefaultCard(params)
        .then(() => {
          this.search();
          this.$message.success("设置成功");
        })
        .catch(err => {
          console.log(err);
          this.$message.error("设置失败，请重试");
        });
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
      color: #739BFF;
    }
    .start {
      color: #2dbc2d;
    }
    .stop {
      color: #F33430;
    }
    .operation-button span {
      font-size: 12px;
    }
  }
}
</style>