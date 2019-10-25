<template>
  <section class="audit-overview">
    <el-form :inline="true" :model="formData" class="demo-form-inline search-form" size="small">
      <el-form-item label="影院名称：">
        <el-select v-model="formData.cinemaCode" filterable remote clearable reserve-keyword placeholder="请输入影院名称" :remote-method="remoteMethod" :loading="loading">
          <el-option v-for="item in cinemasOptions" :key="item.code" :label="item.fullName" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="放映日期：">
        <el-date-picker v-model="date" type="daterange" @change="dateChange" value-format="yyyy-MM-dd" clearable :editable="false" unlink-panelsclearable range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="formData.approveStatus" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in approveStatusOptions" :key="item.keyCode" :label="item.keyName" :value="item.keyCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button style="height: 32px; width: 80px" type="primary" @click="search">查询</el-button>
        <el-button class="normal-btn" @click="resetFields">重置条件</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" style="width: 100%; margin-top: 20px">
      <el-table-column prop="planDate" label="放映日期" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.planDate.split(' ')[0]}}
        </template>
      </el-table-column>
      <el-table-column prop="cinemaName" label="影院名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hallCount" label="总厅数" width="60" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="planCount" label="已排场次数" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="saleCount" label="已开售场次数" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="状态" width="60" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.approveStatus === 'WAIT_APPROVE'">待审批</span>
          <span v-if="scope.row.approveStatus === 'APPROVED'">已审批</span>
          <span v-if="scope.row.approveStatus === 'REJECT'">已驳回</span>
        </template>
      </el-table-column>
      <el-table-column prop="submitUserName" label="提交人" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="submitTime" label="提交时间" width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column v-if="formData.approveStatus !== 'WAIT_APPROVE'" prop="approveUserName" label="审批人" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column v-if="formData.approveStatus !== 'WAIT_APPROVE'" prop="approveTime" label="审批时间" width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column width="100" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button style="padding: 0" @click="toDetail(scope.row, true)" type="text" size="small">查看</el-button>
          <el-button v-if='scope.row.approveStatus === "WAIT_APPROVE"' style="padding: 0" @click="toDetail(scope.row, false)" type="text" size="small">审批</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page-wrap">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formData.current" :page-sizes="[20, 40, 60, 80]" :page-size="formData.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </section>
</template>

<script>
export default {
  name: 'AuditOverview',
  data () {
    return {
      date: '',
      searchCinemasForm: {
        cinemaName: '',
        type: 2,
        pageNum: 1,
        pageSize: 10

      },
      cinemasOptions: [],
      loading: false,
      formData: {
        cinemaCode: '',
        planDateStart: '',
        planDateEnd: '',
        approveStatus: 'WAIT_APPROVE',
        size: 20,
        current: 1
      },
      total: 0,
      tableData: [],
      approveStatusOptions: [{
        keyCode: 'WAIT_APPROVE',
        keyName: '待审批'
      }, {
        keyCode: 'APPROVED',
        keyName: '已审批'
      }, {
        keyCode: 'REJECT',
        keyName: '已驳回'
      }],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }

    };
  },
  methods: {
    toDetail (row, isView) {
      this.$emit('updateCurrentData', row);
      this.$emit('updateIsView', isView);
      this.$emit('updateShowType', 'moviePlan');
      this.$emit('updateCurrentComponent', 'auditContent');
    },
    remoteMethod (query) {
      if (query !== '') {
        this.searchCinemasForm.pageSize = 100;
      } else {
        this.searchCinemasForm.pageSize = 10;
      }
      this.searchCinemasForm.cinemaName = query;
      this.loading = true;
      this.authQueryUserCinemas();
    },

    resetFields () {
      this.date = '';
      this.dateChange(this.date);
      this.formData.approveStatus = 'WAIT_APPROVE';
      this.formData.cinemaCode = '';
    },

    dateChange (val) {
      console.log(val);
      if (val) {
        this.formData.planDateStart = val[0];
        this.formData.planDateEnd = val[1];
      } else {
        this.formData.planDateStart = '';
        this.formData.planDateEnd = '';
      }
    },

    search () {
      this.$ctmList.findSchApprove(this.formData).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.error(res.msg);
        }
      });
    },

    authQueryUserCinemas () {
      this.$ctmList.authQueryUserCinemas(this.searchCinemasForm).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.cinemasOptions = res.data.rows;
          this.loading = false;
        } else {
          this.error(res.msg);
        }
      });
    },

    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
      this.formData.size = val;
      this.search();
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
      this.formData.current = val;
      this.search();
    }

  },
  mounted () {
    this.authQueryUserCinemas();
    this.search();
  }
};
</script>

<style lang="scss">
.audit-overview {
  .normal-btn {
    min-width: 80px;
    height: 32px;
    border: 1px solid #3b74ff;
    border-radius: 4px;
    padding: 8px 16px;
    background: #fff;
    span {
      font-size: 12px;
      color: #3b74ff;
    }
  }
}
</style>