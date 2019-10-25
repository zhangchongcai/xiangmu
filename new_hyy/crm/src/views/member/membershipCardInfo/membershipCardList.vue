<template>
  <div class="member-list">
    <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap _member-search-area-custom">
      <el-form-item label="卡类型：" prop="cardType">
        <el-select v-model="formData.cardType" placeholder="全部类型" clearable>
          <el-option v-for="item in cardTypeOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡状态：" prop="status">
        <el-select v-model="formData.status" placeholder="全部状态" clearable>
          <el-option v-for="item in cardStatusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡政策：" prop="cardProductId">
        <el-select v-model="formData.cardProductId" placeholder="卡政策" filterable clearable>
          <el-option v-for="item in cardNameOptions" :key="item.id" :label="item.cardName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="会员卡号：" prop="cardNo">
        <el-input v-model="formData.cardNo" @blur="()=>{formData.cardNo = formData.cardNo.trim()}" placeholder="会员卡号" clearable></el-input>
      </el-form-item>
      <el-form-item label="会员姓名：" prop="userName">
        <el-input v-model="formData.userName" @blur="()=>{formData.userName = formData.userName.trim()}" placeholder="会员姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" class="_el-btn-custom">搜索</el-button>
        <el-button @click="resetForm('formData')" plain class="_el-btn-custom _member-custom-ghost-button">重置
        </el-button>
      </el-form-item>
    </el-form>
    <div class="result-title">为您查询到{{total}}个会员卡信息</div>
    <div class="member-list-table _m-member-table-custom">
      <el-table :data="tableDataList" stripe style="width: 100%;" :empty-text="tipMessage">
        <el-table-column prop="cardNo" label="会员卡号" width="140" show-overflow-tooltip :formatter="formateEmpty">
        </el-table-column>
        <el-table-column prop="userName" label="姓名" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="fontSize:12px;">{{scope.row.userName!=null?scope.row.userName:"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phoneNumber" label="手机号" min-width="100" show-overflow-tooltip :formatter="formateEmpty">
        </el-table-column>
        <el-table-column prop="cardProductName" label="卡政策" show-overflow-tooltip :formatter="formateEmpty">
        </el-table-column>
        <el-table-column prop="birthday" label="生日" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="fontSize:12px;">{{scope.row.birthday!=null?scope.row.birthday:"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cardType" label="卡类型" min-width="70" show-overflow-tooltip :formatter="formateEmpty">
        </el-table-column>
        <el-table-column label="状态" min-width="60" show-overflow-tooltip :formatter="formateEmpty">
          <template slot-scope="scope">
            <span v-if="scope.row.status=='normal'" style="fontSize:12px;">正常</span>
            <span v-if="scope.row.status=='expire'" style="fontSize:12px;">过期</span>
            <span v-if="scope.row.status=='frozen'" style="fontSize:12px;">冻结</span>
            <span v-if="scope.row.status=='cancel'" style="fontSize:12px;">注销</span>
            <span v-if="scope.row.status=='loss'" style="fontSize:12px;">挂失</span>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="fontSize:12px;">{{scope.row.createTime!=null?scope.row.createTime:"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="channelName" label="全部来源" show-overflow-tooltip :formatter="formateEmpty">
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120">
          <template slot-scope="scope">
            <span @click="handleChangeStatus(scope.row.cardNo,'frozen')" class="change-status-btn" v-if="scope.row.status=='normal'">冻结</span>
            <span @click="handleChangeStatus(scope.row.cardNo,'normal')" class="change-status-btn" v-if="scope.row.status=='frozen'">解冻</span>
            <span @click="handleMemberDetail(scope.row.cardNo)" class="detail-btn">详情</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 start -->
    <div class="page-wrap">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current-0" :page-sizes="[20 , 50 , 100]" :page-size="pageSize-0" layout="total, sizes, prev, pager, next, jumper" :total="total-0"></el-pagination>
    </div>
    <!-- 分页 end -->
    <!-- 冻结、解冻的dialog -->
    <el-dialog title="" :visible.sync="frozenDialog" width="320px" :show-close="false" class="_member-tip-dialog-custom-style">
      <i class="iconfont icon-danchuang-tishi _member-tip-dialog-icon"></i>
      <span class="_member-tip-dialog-desc">{{cardStatus=='frozen'?'冻结后此卡将无法正常使用，确定冻结吗？':'确定解冻此卡？'}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSureChange" class="_el-btn-custom _member-add-edit-save-btn">确定
        </el-button>
        <el-button @click="frozenDialog = false" class="_el-btn-custom _member-add-edit-save-btn">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MemberList',
  data () {
    return {
      cardStatus: 'frozen',
      cardNo: '',
      frozenDialog: false,
      tipMessage: '',
      current: 1,
      pageSize: 20,
      total: 0,
      tableDataList: [],
      cardTypeOptions: [],
      cardStatusOptions: [
        {
          label: '正常',
          value: 'normal'
        },
        {
          label: '冻结',
          value: 'frozen'
        },
        {
          label: '注销',
          value: 'cancel'
        },
        {
          label: '过期',
          value: 'expire'
        },
        {
          label: '挂失',
          value: 'loss'
        }
      ],
      cardNameOptions: [],
      formData: {
        cardType: '', // 卡类型
        status: '', // 卡状态
        cardName: '', // 卡名称
        cardNo: '', // 会员id或手机号
        userName: '' // 会员名称
      }
    };
  },
  created () {
    this.cardTypeList();
    this.getCardproductList();
    this.getMembercardList();
  },
  // activated() {
  //   this.cardTypeList();
  //   this.getCardproductList();
  //   this.getMembercardList();
  // },
  methods: {
    getCardproductList () {
      let _this = this;
      let param = {
        current: 1,
        size: 1000,
        tenantId: this.$store.state.loginUser.consumerId,
        status: 'start'
      };
      _this.$crmList.cardproductList(param).then(ret => {
        _this.cardNameOptions = ret.records;
      });
    },
    cardTypeList () {
      let _this = this;
      let param = {
        tenantId: this.$store.state.loginUser.consumerId
      };
      _this.$crmList.cardTypeList(param).then(ret => {
        // console.log(ret);
        _this.cardTypeOptions = ret;
      });
    },

    getMembercardList () {
      let _this = this;
      let param = {
        current: _this.current,
        size: _this.pageSize,
        status: _this.formData.status,
        userName: _this.formData.userName,
        cardTypeCode: _this.formData.cardType,
        cardNo: _this.formData.cardNo,
        cardProductId: _this.formData.cardProductId,
        tenantId: this.$store.state.loginUser.consumerId
      };
      _this.tipMessage = '数据加载中...';
      _this.$crmList
        .membercardList(param)
        .then(ret => {
          if (ret.total == 0) {
            _this.tipMessage = '暂无数据';
          }
          _this.tableDataList = ret.records;
          _this.total = ret.total;
          _this.current = ret.current; // 页码
          _this.pageSize = ret.size; // 每页数量
        })
        .catch(err => {
          _this.tipMessage = err.message;
          console.log(err);
        });
    },
    search () {
      this.current = 1;
      this.getMembercardList();
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    handleSizeChange (val) {
      let _this = this;
      // _this.current = 1;
      _this.pageSize = val;
      _this.getMembercardList();
    },
    handleCurrentChange (val) {
      let _this = this;
      _this.current = val;
      _this.getMembercardList();
    },
    // 修改状态
    handleChangeStatus (cardNo, status) {
      this.frozenDialog = true;
      this.cardStatus = status;
      this.cardNo = cardNo;
    },
    // 确定冻结、解冻
    handleSureChange () {
      this.frozenDialog = false;
      let param = {
        cardNo: this.cardNo,
        status: this.cardStatus,
        tenantId: this.$store.state.loginUser.consumerId
      };
      this.$crmList.rcardStatus(param).then(ret => {
        this.getMembercardList();
        this.$message({
          type: 'success',
          message: `${this.cardStatus == 'frozen' ? '冻结成功' : '解冻成功'}`
        });
      });
    },
    // 查看会员详情
    handleMemberDetail (cardNo) {
      this.$router.push({
        path: '/member/membershipCard/detail',
        query: { cardNo: cardNo }
      });
    },
    formateEmpty (row, column, cellValue, index) {
      if (cellValue == null || cellValue == undefined || cellValue === '') {
        return '-';
      } else {
        return cellValue;
      }
    }
  }
};
</script>

<style lang='scss' >
.member-list {
  padding-bottom: 20px;
  .result-title {
    font-size: 12px;
    color: #b1b1b1;
    padding: 8px 0;
  }
  .member-list-table {
    .detail-btn,
    .change-status-btn {
      font-size: 12px;
      color: #3b74ff;
      cursor: pointer;
      margin-right: 10px;
    }
  }
}
</style>