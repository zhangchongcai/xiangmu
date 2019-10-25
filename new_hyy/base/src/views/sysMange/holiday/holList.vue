<template>
  <div class="content-wrapper">
    <div class="list-wrapper">
      <div class="form">
        <el-form :inline="true" :model="formInline" size="mini" label-width="90px">
          <el-form-item label="假日编码：" prop="code">
            <el-input v-model.trim="formInline.code"></el-input>
          </el-form-item>
          <el-form-item label="假日名称：" prop="name">
            <el-input v-model.trim="formInline.name"></el-input>
          </el-form-item>
          <el-form-item label="年份：" prop="year">
            <el-date-picker value-format="yyyy" v-model="formInline.year" type="year" placeholder="选择年">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="create-wrapper">
        <el-button v-auth="'system_holiday_add'" type="primary" @click="toCreate">新建</el-button>
      </div>
      <div class="table">
        <el-table :data="holList" stripe style="width: 100%">
          <el-table-column prop="code" label="假日编码" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="name" label="假日名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="startTime" label="开始日期" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.startTime | timeFilter}}</template>
          </el-table-column>
          <el-table-column prop="endTime" label="结束日期" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.endTime | timeFilter}}</template>
          </el-table-column>
          <el-table-column prop="type" label="类型" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.type?'自定义':'法定'}}</template>
          </el-table-column>
          <el-table-column prop="isOpen" label="状态" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.isOpen?'启用':'禁用'}}</template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="scope.row.platform==2" v-auth="'system_holiday_update'" class="table-btn-mini" @click="editCus(scope.row)" type="text">编辑</el-button>
              <el-button v-if="scope.row.platform==2" v-auth="'system_holiday_enableDisabling'" class="table-btn-mini" @click="changeStatus(scope.row)" type="text">{{scope.row.isOpen?'禁用':'启用'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- footer 分页条 -->
        <div class="page-wrap">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { holList, changeHolStatus } from 'baseSrc/http/interface.js';
import mixins from '../../../mixins/cacheMixin.js';
export default {
  name: 'holList',
  mixins: [mixins.cacheMixin],
  data () {
    return {
      cacheField: ['holList', 'currentPage', 'pageSize', 'formInline'],
      // 总数
      total: 1,
      // 当前页
      currentPage: 1,
      // 当前页数大小
      pageSize: 10,
      formInline: {
        name: '',
        code: '',
        year: '2019'
      },
      holList: []
    };
  },
  filters: {
    timeFilter: function (value) {
      if (!value) {
        return '';
      } else {
        return value.slice(0, 10);
      }
    }
  },
  activated () {
    this.getHolList();
  },
  created () {
    this.getHolList();
  },
  methods: {
    toCreate () {
      this.$router.push('newHol');
    },
    editCus (val) {
      this.$router.push({ path: 'editHol', query: { id: val.id } });
    },
    getHolList () {
      let _this = this;
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        name: this.formInline.name,
        code: this.formInline.code,
        year: this.formInline.year
      };
      holList(params)
        .then(ret => {
          if (ret && ret.result) {
            _this.pageNum = ret.data.pageNum;
            _this.pageSize = ret.data.pageSize;
            _this.total = ret.data.total;
            _this.holList = ret.data.rows;
          } else {
            _this.$message({
              message: ret.msg,
              type: 'info'
            });
          }
        })
        .catch(() => {
          _this.$message('网络繁忙，请稍后再试');
        });
    },
    onSubmit () {
      this.getHolList();
    },
    changeStatus (val) {
      let data = {
        isOpen: !val.isOpen,
        id: val.id
      };
      if (val.isOpen) {
        this.$confirm(
          `确认禁用后将不可用，是否继续禁用?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '再想想',
            type: 'warning'
          }
        ).then(() => {
          changeHolStatus(data)
            .then(ret => {
              if (ret && ret.code == 200) {
                this.success('禁用成功');
                val.isOpen = false;
              }
            })
            .catch(() => {
              this.error('失败');
            });
        });
      } else {
        changeHolStatus(data)
          .then(ret => {
            if (ret && ret.code == 200) {
              this.success('启用成功');
              val.isOpen = true;
            }
          })
          .catch(() => {
            this.error('失败');
          });
      }
    },
    // 当前页改变
    handleCurrentChange (value) {
      this.currentPage = value;
      this.getHolList();
    },
    // 当前页数数目改变e
    handleSizeChange (value) {
      this.pageSize = value;
      this.getHolList();
    }
  }
};
</script>
<style lang="scss" scoped>
.content-wrapper {
  .list-wrapper {
    .form {
      background: #f5f5f5;
      padding: 10px 0;
      .el-input {
        width: 192px;
      }
    }
    .create-wrapper {
      width: 100%;
      height: 32px;
      margin: 10px 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>
