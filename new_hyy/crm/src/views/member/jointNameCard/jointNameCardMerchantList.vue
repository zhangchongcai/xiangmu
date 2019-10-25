<template>
  <div class="jointNameCard-merchant-list">
    <el-form :inline="true" :model="searchData" ref="searchData" class="form-data-wrap _member-search-area-custom">
      <el-form-item label="商户编号：" prop="merchantNum" :rules="[{ max: 20, message: '长度不可超过20个字符', trigger: 'blur' }]">
        <el-input v-model="searchData.merchantNum" @blur="()=>{searchData.merchantNum = searchData.merchantNum.trim()}" placeholder="请输入商户编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="商户名称：" prop="merchantName" :rules="[{ max: 30, message: '长度不可超过30个字符', trigger: 'blur' }]">
        <el-input v-model="searchData.merchantName" @blur="()=>{searchData.merchantName = searchData.merchantName.trim()}" placeholder="请输入商户名称" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select v-model="searchData.status" placeholder="全部状态" clearable>
          <el-option v-for="item in merchantStatusOptions" :key="item.code" :label="item.desc" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="btn-wrap">
        <el-button type="primary" @click="handleSearch" class="_el-btn-custom">搜索</el-button>
        <el-button @click="resetForm('searchData')" plain class="_el-btn-custom _member-custom-ghost-button">重置
        </el-button>
      </el-form-item>
    </el-form>
    <div class="add-btn">
      <el-button plain class="_el-btn-custom _member-custom-ghost-button" @click="handleAddMerchant">新建</el-button>
    </div>
    <div class="entity-card-list-table _m-member-table-custom">
      <el-table :data="tableDataList" stripe style="width: 100%" :empty-text="tipMessage">
        <el-table-column prop="merchantNum" label="商户编号" min-width="140" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="merchantName" label="商户名称" min-width="140" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
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
            <el-button @click="handleCardDetail(scope.row)" type="text" size="small" class="operation-button">查看
            </el-button>
            <el-button @click="handleChangeStatus(0,scope.row)" type="text" size="small" class="operation-button" v-if="scope.row.status== 1?true:false">停售</el-button>
            <el-button @click="handleChangeStatus(1,scope.row)" type="text" size="small" class="operation-button" v-if="scope.row.status== 0?true:false">开售</el-button>
            <el-button @click="handleEmitCard(scope.row)" type="text" size="small" class="operation-button" v-if="scope.row.status== 1?true:false">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 start -->
    <div class="page-wrap">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchData.current-0" :page-size="searchData.size-0" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[20 , 50 , 100]" :total="total-0"></el-pagination>
    </div>
    <!-- 分页 end -->
    <!-- 开售、停售的dialog -->
    <el-dialog title="" :visible.sync="stopStartDialog" width="320px" :show-close="false" class="_member-tip-dialog-custom-style">
      <i class="iconfont icon-danchuang-tishi _member-tip-dialog-icon"></i>
      <span class="_member-tip-dialog-desc">确定要{{statusFlag == 1?'开售':'停售'}} {{stopStartInfo.merchantName}} 吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSureChangeStatus" class="_el-btn-custom _member-add-edit-save-btn">确定
        </el-button>
        <el-button @click="stopStartDialog = false" class="_el-btn-custom _member-add-edit-save-btn">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'jointNameCardMerchantList',
  data () {
    return {
      statusFlag: '',
      stopStartInfo: '',
      stopStartDialog: false,
      tipMessage: '',
      total: 400,
      tableDataList: [],
      searchData: {
        merchantNum: '', // 商户编号
        merchantName: '', // 商户名称
        status: 'all', // 状态
        current: 1,
        size: 20,
        tenantId: this.$store.state.loginUser.consumerId
      },
      merchantStatusOptions: [
        {
          code: 'all',
          desc: '全部'
        },
        {
          code: '1',
          desc: '已开售'
        },
        {
          code: '0',
          desc: '已停售'
        }
      ]
    };
  },
  created () {
    this.search();
  },
  // activated() {
  //   this.search();
  // },
  filters: {
    judegStatus: function (value) {
      if (value == 1) {
        return '已开售';
      } else if (value == 0) {
        return '已停售';
      } else {
        return '-';
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
      let params = JSON.parse(JSON.stringify(this.searchData));
      this.tipMessage = '数据加载中...';
      this.$crmList
        .getjointNameCardList(params)
        .then(data => {
          if (data.total == 0) {
            this.tipMessage = '暂无数据';
          }
          this.tableDataList = data.records;
          this.searchData.size = data.size;
          this.total = data.total;
        })
        .catch(err => {
          this.tipMessage = err.message;
          console.log('errrrrrr', err.message);
        });
    },
    // 搜索
    handleSearch () {
      this.searchData.current = 1;
      this.search();
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    // 新建卡政策
    handleAddMerchant () {
      this.$router.push({
        path: '/member/jointNameCard/addJointNameCardMerchant'
      });
    },
    handleEmitCard (scope) {
      this.$router.push({
        path: '/member/jointNameCard/addJointNameCardMerchant',
        query: { merchantId: scope.merchantId }
      });
    },
    // 查看详情
    handleCardDetail (scope) {
      this.$router.push({
        path: '/member/jointNameCard/detail',
        query: { merchantId: scope.merchantId }
      });
    },
    // 开售、停售
    handleChangeStatus (status, scope) {
      this.stopStartDialog = true;
      this.stopStartInfo = scope;
      this.statusFlag = status;
    },
    // 确定启用、停用
    handleSureChangeStatus () {
      this.stopStartDialog = false;
      let data = {
        compactId: this.stopStartInfo.compactId,
        cooperationEnd: this.stopStartInfo.cooperationEnd,
        cooperationStart: this.stopStartInfo.cooperationStart,
        memo: this.stopStartInfo.memo,
        merchantId: this.stopStartInfo.merchantId,
        merchantName: this.stopStartInfo.merchantName,
        status: this.statusFlag,
        tenantId: this.$store.state.loginUser.consumerId
      };
      this.$crmList
        .editjointNameCardInfo(data)
        .then(() => {
          this.search();
          if (this.statusFlag == 1) {
            this.$message.success('已开售');
          } else {
            this.$message.success('已停售');
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    /* 分页相关 start */
    handleSizeChange (val) {
      this.searchData.size = val;
      this.search();
    },
    handleCurrentChange (val) {
      this.searchData.current = val;
      this.search();
    },
    /* 分页相关 end */
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
<style lang="scss">
.jointNameCard-merchant-list {
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
      color: #2dbc2d;
    }
    .stop-sale {
      color: #f33430;
    }
    .operation-button span {
      font-size: 12px;
    }
  }
}
</style>


