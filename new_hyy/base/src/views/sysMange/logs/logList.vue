<template>
  <div class="content-wrapper">
    <div class="list-wrapper">
      <div class="form">
        <el-form sizi="mini" :inline="true" :model="listQuery" label-width="108px">
          <el-form-item label="操作时间：">
            <el-col :span="11">
              <el-form-item style="margin-right:0;">
                <el-date-picker style="width: 100%;" :picker-options="startDatePicker" value-format="yyyy-MM-dd HH:mm:ss" v-model="listQuery.startTime" type="datetime" default-time="00:00:00" placeholder="选择日期" @change="checkStartTime">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="1">-</el-col>
            <el-col :span="11">
              <el-form-item style="margin-right:0;">
                <el-date-picker style="width: 100%;" :picker-options="endDatePicker" value-format="yyyy-MM-dd HH:mm:ss" v-model="listQuery.endTime" type="datetime" placeholder="选择日期" default-time="23:59:59" @change="checkEndTime">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="操作名称：">
            <el-select v-model.trim="listQuery.opName" filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading">
              <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <!--<el-input v-model.trim="listQuery.opName" placeholder="请输入"></el-input>-->
          </el-form-item>
          <el-form-item label="操作描述：">
            <el-input v-model.trim="listQuery.opDesc" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="操作人名称：">
            <el-input v-model.trim="listQuery.opUserName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-button class='search-padding' style="margin-top: 6px" type="primary" @click="handleFilter">查询
          </el-button>
        </el-form>
      </div>
      <div class="table">
        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="拼命加载中..." highlight-current-row stripe>
          <el-table-column label="操作人名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.opUserName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.opName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作描述" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.opDesc }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作时间" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.opTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="IP" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.ip }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <span class="table-btn-mini" @click="toDetail(scope.row)">查看</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- footer 分页条 -->
        <div class="page-wrap">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNum" :page-sizes="[10, 25, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin: -10px;">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { oplogList, opNames } from 'baseSrc/http/interface.js';
import mixins from '../../../mixins/cacheMixin.js';

export default {
  name: 'log',
  mixins: [mixins.cacheMixin],
  data () {
    return {
      cacheField: ['listQuery', 'list'],
      time: '',
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        type: undefined,
        startTime: '',
        endTime: '',
        opName: null,
        opDesc: null,
        opUserName: null
      },
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      total: null,
      list: null,
      listLoading: true,
      tableKey: 0,
      options: [],
      opNameList: [],
      loading: false

    };
  },
  created () {
    this.getList();
  },
  methods: {
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.opNameList.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    beginDate () {
      const self = this;
      return {
        disabledDate (time) {
          if (self.listQuery.endTime) {  // 如果结束时间不为空，则小于结束时间
            return new Date(self.listQuery.endTime).getTime() < time.getTime();
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      };
    },
    processDate () {
      const self = this;
      return {
        disabledDate (time) {
          if (self.listQuery.startTime) {  // 如果开始时间不为空，则结束时间大于开始时间
            return new Date(self.listQuery.startTime).getTime() > time.getTime();
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      };
    },
    checkStartTime (time) {
      if (time && this.listQuery.endTime && new Date(this.listQuery.endTime).getTime() < new Date(time).getTime()) {
        this.error('开始时间必须小于结束时间')
        this.listQuery.startTime = ''
      } else {
        
      }
    },
    checkEndTime (time) {
      if (time && this.listQuery.startTime && new Date(this.listQuery.startTime).getTime() > new Date(time).getTime()) {
        this.error('结束时间必须大于开始时间')
        this.listQuery.endTime = ''
      } else {
        
      }
    },
    getList () {
      let _this = this;
      this.listLoading = false;
      let queryObj = this.listQuery;
      oplogList(queryObj)
        .then(ret => {
          if (ret.code == 200) {
            _this.list = ret.data.rows;
            _this.pageNum = ret.data.pageNum;
            _this.pageSize = ret.data.pageSize;
            _this.total = ret.data.total;
            _this.listLoading = false;
            this.getOpNameList();
          } else {
            _this.$message({
              message: ret.msg,
              type: 'info'
            });
          }
        }).catch(() => {
          _this.$message('网络繁忙，请稍后再试');
        });
    },
    getOpNameList () {
      let _this = this;
      opNames()
        .then(ret => {
          if (ret.code == 200) {
            _this.opNameList = ret.data.map(item => {
              return { value: item, label: item };
            });
          } else {
            _this.$message({
              message: ret.msg,
              type: 'info'
            });
          }
        }).catch(() => {
        });
    },
    handleSizeChange (val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange (val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    renderTime (date) {
      let dateee = new Date(date).toJSON();
      return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
    },
    handleFilter () {
      // this.listQuery.startTime = this.renderTime(this.time[0])
      // this.listQuery.endTime = this.renderTime(this.time[1])
      this.listQuery.pageNum = 1;
      this.getList(this.listQuery);
    },
    toDetail (val) {
      this.$router.push({ path: 'detail', query: { logNo: val.logNo } });
    }
  }
};
</script>

<style scoped lang="scss">
.content-wrapper {
  height: 100%;

  .form {
    background: #f5f5f5;
    padding: 20px 0 0;
    margin-bottom: 10px;
  }

  .el-table .el-button--primary {
    background: #3b74ff;
  }

  .el-table .el-button {
    color: #fff;
  }
  .el-col-1 {
    width: 8px;
    text-align: center;
  }
  .el-col-11 {
    width: 192px;
  }
}
</style>
