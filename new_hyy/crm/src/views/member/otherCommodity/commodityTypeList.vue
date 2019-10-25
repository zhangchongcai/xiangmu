<template>
  <div class="commodityList">
    <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap _member-search-area-custom">
      <el-form-item label="ID号：" prop="commodityTypeNo">
        <el-input v-model="formData.commodityTypeNo" placeholder="ID号" clearable maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="类型名称：" prop="commodityTypeName">
        <el-input v-model="formData.commodityTypeName" placeholder="类型名称" clearable maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="创建人：" prop="createBy">
        <el-input v-model="formData.createBy" placeholder="创建人" clearable maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="创建时间：" prop="equityType">
        <el-date-picker v-model="formData.timeStartToEnd" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" ref="picker"></el-date-picker>
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
    <div class="member-list-table _m-member-table-custom">
      <el-table :data="tableData" stripe style="width: 100%" :empty-text="tipMessage">
        <el-table-column prop="commodityTypeNo" :formatter="emptyShow" label="ID" min-width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="commodityTypeName" :formatter="emptyShow" label="类型名称" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goodsNum" :formatter="emptyShow" label="商品数量（个）" min-width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createTime" :formatter="emptyShow" label="创建时间" min-width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createBy" :formatter="emptyShow" label="创建人" min-width="120" show-overflow-tooltip>
        </el-table-column>

        <el-table-column fixed="right" label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button @click="handleMemberDetail(scope.row)" type="text" size="small" class="operation-button">查看
            </el-button>
            <el-button @click="handleMemberEdit(scope.row)" type="text" size="small" class="operation-button">编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 start -->
    <div class="page-wrap">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formData.current-0" :page-size="formData.size-0" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[20 , 50 , 100]" :total="total-0"></el-pagination>
    </div>
    <!-- 分页 end -->
  </div>
</template>

<script>
import formData from '../../../util/formatDate.js';
export default {
  name: 'CardList',
  data () {
    return {
      tipMessage: '',
      tableData: [],
      total: 20,
      formData: {
        commodityTypeNo: '', // 编号
        commodityTypeName: '', // 名称
        createBy: '', // 创建人
        endTime: '', // 结束时间
        startTime: '', // 开始时间
        current: 1,
        size: 20,
        tenantId: this.$store.state.loginUser.consumerId, // 租户id
        timeStartToEnd: ''
      }
    };
  },
  created () {
    this.search();
  },
  // activated() {
  //   this.search();
  // },
  mounted () { },
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
      if (
        this.formData.timeStartToEnd &&
        this.formData.timeStartToEnd[0].getTime()
      ) {
        this.formData.startTime = this.formData.timeStartToEnd[0].formatDate(
          'yyyy-MM-dd'
        );
      } else {
        this.formData.startTime = '';
      }
      if (
        this.formData.timeStartToEnd &&
        this.formData.timeStartToEnd[1].getTime()
      ) {
        this.formData.endTime = this.formData.timeStartToEnd[1].formatDate(
          'yyyy-MM-dd'
        );
      } else {
        this.formData.endTime = '';
      }
      let params = JSON.parse(JSON.stringify(this.formData));
      this.tipMessage = '数据加载中...';
      this.$crmList
        .diffCommodityTypeList(params)
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
      this.$refs['picker'].emitInput();
    },
    handleSizeChange (val) {
      this.formData.size = val;
      this.search();
    },
    handleCurrentChange (val) {
      this.formData.current = val;
      this.search();
    },
    // 新建异业商品类型
    handleAddCardType () {
      this.$router.push({ path: '/member/otherCommodity/creatCommodityType' });
    },
    // 编辑商品类型
    handleMemberEdit (scope) {
      this.$router.push({
        path: '/member/otherCommodity/editCommodityType',
        query: { typeId: scope.id }
      });
    },
    // 查看
    handleMemberDetail (scope) {
      this.$router.push({
        path: '/member/otherCommodity/CommodityTypeDetail',
        query: { typeId: scope.id }
      });
    }
  },
  watch: {}
};
</script>

<style lang='scss'>
.commodityList {
  .heightBug input {
    height: 32px !important;
  }
  .add-btn {
    font-size: 12px;
    padding: 6px 0;
    text-align: right;
  }
  .member-list-table {
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
