<template>
  <div class="other-rights-list">
    <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap _member-search-area-custom">
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
          <el-option v-for="item in equityCategoryList" :key="item.name" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select v-model="formData.status" placeholder="全部" clearable>
          <el-option v-for="item in cardStatusOptions" :key="item.code" :label="item.desc" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="btn-wrap">
        <el-button type="primary" @click="handleSearch" class="_el-btn-custom">搜索</el-button>
        <el-button @click="resetForm('formData')" plain class="_el-btn-custom _member-custom-ghost-button">重置
        </el-button>
      </el-form-item>
    </el-form>
    <div class="add-btn">
      <el-button plain class="_el-btn-custom _member-custom-ghost-button" @click="handleAddCardType">新建</el-button>
    </div>
    <div class="other-rights-list-table member-list-table _m-member-table-custom">
      <el-table :data="tableData" stripe style="width: 100%" :empty-text="tipMessage">
        <el-table-column prop="equityNo" :formatter="emptyShow" label="权益ID" min-width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="equityName" :formatter="emptyShow" label="权益名称" min-width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="equityTypeName" :formatter="emptyShow" label="权益类型" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="equityCategoryName" :formatter="equityCategoryNameShow" label="权益类别" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="状态" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="scope.row.status=='unstart'?'unstart':scope.row.status=='start'?'start':'stop'" style="fontSize:12px;">{{scope.row.status
              | judegStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button @click="handleMemberDetail(scope.row)" type="text" size="small" class="operation-button">查看
            </el-button>
            <el-button @click="handleEmitCardType(scope.row)" type="text" size="small" class="operation-button" v-if="scope.row.status=='unstart'?true:false">编辑</el-button>
            <el-button @click="handleStartUse(scope.row)" type="text" size="small" class="operation-button" v-if="scope.row.status=='unstart'?true:false">启用</el-button>
            <el-button @click="handleStartUse(scope.row)" type="text" size="small" class="operation-button" v-if="scope.row.status=='start'?true:false">停用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 启用、停用的dialog -->
    <el-dialog title="" :visible.sync="stopStartDialog" width="320px" :show-close="false" class="_member-tip-dialog-custom-style">
      <i class="iconfont icon-danchuang-tishi _member-tip-dialog-icon"></i>
      <span class="_member-tip-dialog-desc">确定要{{stopStartInfo.status == 'start'?'停用':'启用'}}
        {{stopStartInfo.equityName}} 吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSureChangeStatus" class="_el-btn-custom _member-add-edit-save-btn">确定
        </el-button>
        <el-button @click="stopStartDialog = false" class="_el-btn-custom _member-add-edit-save-btn">取消</el-button>
      </span>
    </el-dialog>
    <!-- 分页 start -->
    <div class="page-wrap">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formData.current-0" :page-size="formData.size-0" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[20 , 50 , 100]" :total="total-0"></el-pagination>
    </div>
    <!-- 分页 end -->
  </div>
</template>


<script>
export default {
  name: 'otherRightsList',
  data () {
    return {
      stopStartDialog: false,
      stopStartInfo: {},
      tipMessage: '',
      tableData: [],
      cardStatusOptions: [],
      total: 20,
      formData: {
        equityName: '', // 权益名称
        equityType: '', // 权益类型
        equityCategory: '', // 权益类别
        status: '', // 卡状态
        equityNo: '', // 权益ID
        current: 1,
        size: 20,
        tenantId: this.$store.state.loginUser.consumerId // 租户id
      },
      equityTypeList: [
        { name: '服务类', value: 'service_type' },
        { name: '消费类', value: 'consumer_type' },
        { name: '体验类', value: 'experience_type' },
        { name: '身份类', value: 'identity_type' }
      ], // 权益类型列表
      equityCategoryList: [{ name: '优惠券', value: 'coupons' }] // 权益类别列表
    };
  },
  created () {
    this.handleCardStatus();
    this.search();
  },
  // activated(){
  //   this.search();
  // },
  filters: {
    judegStatus: function (value) {
      if (value == 'unstart') {
        return '未启用';
      } else if (value == 'start') {
        return '已启用';
      } else {
        return '已停用';
      }
    },
    formatCreateTime: function (value) {
      if (value) {
        return new Date(value.replace(/-/g, '/')).formatDate('yyyy-MM-dd');
      } else {
        return '-';
      }
    }
  },
  methods: {
    search () {
      let params = JSON.parse(JSON.stringify(this.formData));
      this.tipMessage = '数据加载中...';
      this.$crmList
        .getdiffEquityList(params)
        .then(data => {
          this.tipMessage = '暂无数据';
          this.tableData = data.records;
          this.total = data.total;
          // this.loading = false;
        })
        .catch(err => {
          // this.loading = false;
        });
    },
    equityCategoryNameShow (row, column, cellValue, index) {
      if (row.equityType != 'consumer_type') {
        return '-';
      } else {
        if (cellValue == null || cellValue == undefined || cellValue === '') {
          return '-';
        } else {
          return cellValue;
        }
      }
    },
    // 数据为空格式化
    emptyShow (row, column, cellValue, index) {
      if (cellValue == null || cellValue == undefined || cellValue === '') {
        return '-';
      } else {
        return cellValue;
      }
    },
    // 搜索
    handleSearch () {
      this.formData.current = 1;
      this.search();
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    // 卡状态
    handleCardStatus () {
      let params = { tenantId: this.$store.state.loginUser.consumerId };
      let _this = this;
      _this.$crmList.getCardStatus(params).then(ret => {
        _this.cardStatusOptions = ret;
      });
    },
    handleSizeChange (val) {
      this.formData.size = val;
      this.search();
    },
    handleCurrentChange (val) {
      this.formData.current = val;
      this.search();
    },
    // 查看卡权益详情
    handleMemberDetail (scope) {
      this.$router.push({
        path: '/member/otherRights/otherRightsDetail',
        query: {
          equityId: scope.id,
          tenantId: this.$store.state.loginUser.consumerId
        }
      });
    },
    // 新建卡权益
    handleAddCardType () {
      this.$router.push({
        path: '/member/otherRights/addOtherRights'
      });
    },
    // 编辑卡权益
    handleEmitCardType (scope) {
      this.$router.push({
        path: '/member/otherRights/editOtherRights',
        query: {
          cardId: scope.id
        }
      });
    },
    handleSureChangeStatus () {
      this.stopStartDialog = false;
      var scope = this.stopStartInfo;
      let _this = this;
      let data = {
        status: scope.status == 'start' ? 'stop' : 'start',
        id: scope.id, // 会员id
        tenantId: this.$store.state.loginUser.consumerId // 租户id
      };
      _this.$crmList
        .diffEquityStatus(data)
        .then(() => {
          _this.search();
          this.$message({
            type: 'success',
            message: `${scope.status == 'start' ? '已停用' : '已启用'}`
          });
        })
        .catch(err => console.log(err));
    },
    // 启用/停用
    handleStartUse (scope) {
      this.stopStartInfo = scope;
      this.stopStartDialog = true;
    }
  },
  watch: {
    // 监听权益类型 处理消费类型的消费类别选择
    'formData.equityType' (val) {
      if (val != 'consumer_type') {
        this.formData.equityCategory = '';
      }
    }
  }
};
</script>

<style lang='scss'>
.other-rights-list {
  .heightBug input {
    height: 32px !important;
  }
  .add-btn {
    font-size: 12px;
    padding: 6px 0;
    text-align: right;
  }
  .other-rights-list-table {
    .unstart {
      color: #739bff;
    }
    .start {
      color: #2dbc2d;
    }
    .stop {
      color: #f33430;
    }
    .operation-button span {
      font-size: 12px;
    }
  }
}
</style>