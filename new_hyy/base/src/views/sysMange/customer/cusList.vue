<template>
  <div class="content-wrapper">
    <div class="list-wrapper">
      <div class="form">
        <el-form :inline="true" :model="formInline" size="mini" label-width="100px">
          <el-form-item label="客户编码：" prop="code">
            <el-input v-model.trim="formInline.code"></el-input>
          </el-form-item>
          <el-form-item label="客户全称：" prop="name">
            <el-input v-model.trim="formInline.name"></el-input>
          </el-form-item>
          <el-form-item label="客户类型：" prop="type">
            <el-select v-model="formInline.type" placeholder="请选择">
              <el-option v-for="item in typeArr" :key="item.propertyCode" :label="item.propertyName" :value="item.propertyCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select v-model="formInline.status" placeholder="请选择">
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="create-wrapper">
        <el-button type="primary" @click="toCreate" v-auth="'system_buyer_add'">新建</el-button>
      </div>
      <div class="table">
        <el-table :data="cusList" style="width: 100%">
          <el-table-column prop="code" label="客户编码" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="fullName" label="客户全称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="type" label="客户类型" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.type | typeFilter}}</template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">{{scope.row.status==1?'启用':'禁用'}}</template>
          </el-table-column>
          <el-table-column prop="operateUserName" label="操作人" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="updateTime" label="操作时间" width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.updateTime | renderTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button v-auth="'system_buyer_see'" class="table-btn-mini" @click="toDetail(scope.row)" type="text">查看</el-button>
              <el-button v-auth="'system_buyer_update'" class="table-btn-mini" @click="editCus(scope.row)" type="text">编辑</el-button>
              <el-button v-auth="'system_buyer_enableDisabling'" class="table-btn-mini" @click="changeStatus(scope.row)" type="text">{{scope.row.status==1?'禁用':'启用'}}</el-button>
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
import { cusList, changeStatu, typeList } from 'baseSrc/http/interface.js';
import mixins from '../../../mixins/cacheMixin.js';
export default {
  name: 'cusList',
  mixins: [mixins.cacheMixin],
  data () {
    return {
      cacheField: ['cusList', 'currentPage', 'pageSize', 'formInline'],
      statusArr: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '启用'
      }, {
        value: '2',
        label: '禁用'
      }],
      typeArr: [],
      // 总数
      total: 1,
      // 当前页
      currentPage: 1,
      // 当前页数大小
      pageSize: 10,
      formInline: {
        name: '',
        code: '',
        type: '全部',
        status: ''
      },
      cusList: [],
      status: ''
    };
  },
  activated () {
    this.getCusList();
  },
  filters: {
    renderTime (date) {
      let dateee = new Date(date).toJSON();
      return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
    },
    typeFilter (value) {
      if (!value) {
        return '';
      } else {
        let arr = JSON.parse(sessionStorage.getItem('cusType'));
        if (arr) {
          return arr.map(item => {
            if (item.propertyCode == value) {
              return item.propertyName;
            }
          }).join().replace(/,/g, '');
        }
      }
    }
  },
  created () {
    this.getType();
    this.getCusList();
  },
  methods: {
    getType () {
      typeList()
        .then(ret => {
          // console.log(ret)
          if (ret && ret.code == 200) {
            if (ret.data) {
              sessionStorage.setItem('cusType', JSON.stringify(ret.data));
            }
            this.typeArr = ret.data;
            this.typeArr.unshift({ 'propertyName': '全部', 'propertyCode': '' });
          } else {
            this.$message({
              message: ret.msg,
              type: 'info'
            });
          }
        })
        .catch(() => {
          this.$message('网络繁忙，请稍后再试');
        });
    },
    toCreate () {
      this.$router.push({ path: 'newCus', query: { type: 1 } });
    },
    editCus (val) {
      this.$router.push({ path: 'editCus', query: { type: 2, code: val.code, id: val.id, consumerId: val.consumerId } });
    },
    toDetail (val) {
      this.$router.push({ path: 'seeCus', query: { type: 3, code: val.code } });
    },
    getCusList () {
      let _this = this;
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        name: this.formInline.name,
        code: this.formInline.code,
        status: this.formInline.status,
        type: this.formInline.type == '全部' ? '' : this.formInline.type
      };
      cusList(params)
        .then(ret => {
          if (ret && ret.code == 200) {
            _this.pageNum = ret.data.pageNum;
            _this.pageSize = ret.data.pageSize;
            _this.total = ret.data.total;
            _this.cusList = ret.data.rows;
          } else {
            _this.$message({
              message: ret.msg,
              type: 'info'
            });
          }
        })
        .catch(() => {
          _this.error('网络繁忙，请稍后再试');
        });
    },
    onSubmit () {
      this.getCusList();
    },
    changeStatus (val) {
      if (val.status == 1) {
        this.$confirm(
          `确认禁用后将不可用，是否继续禁用?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '再想想',
            type: 'warning'
          }
        ).then(() => {
          let data = {
            status: 2,
            consumerId: val.consumerId,
            id: val.id
          };
          changeStatu(data)
            .then(ret => {
              if (ret && ret.code == 200) {
                this.success('禁用成功');
                this.$nextTick(() => {
                  this.getCusList();
                });
              }
            })
            .catch(() => {
              this.error('失败');
            });
        });
      } else {
        let data = {
          status: 1,
          consumerId: val.consumerId,
          id: val.id
        };
        changeStatu(data)
          .then(ret => {
            if (ret && ret.code == 200) {
              this.success('启用成功');
              this.$nextTick(() => {
                this.getCusList();
              });
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
      this.getCusList();
    },
    // 当前页数数目改变e
    handleSizeChange (value) {
      this.pageSize = value;
      this.getCusList();
    }
  }
};
</script>
<style lang="scss" scoped>
.content-wrapper {
  .list-wrapper {
    .form {
      background: #f5f5f5;
      padding: 20px 0 0;
      .el-input {
        width: 192px;
      }
      .el-select {
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
