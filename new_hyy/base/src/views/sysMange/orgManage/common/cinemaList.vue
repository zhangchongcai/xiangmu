<template>
  <div class="unbind-cinema-list">
    <div class="modal-search">
      <div class="search-wrap plian">
        <span>组织名称：</span>
        <span>{{orgName}}</span>
      </div>
      <div class="search-wrap plian2">
        <span>影院名称：</span>
        <el-input v-model.trim="cinemaName" clearable></el-input>
      </div>
      <div class="search-wrap plian2">
        <span>影院编码：</span>
        <el-input v-model.trim="cinemaCode" clearable></el-input>
      </div>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="role-list-content">
      <div class="modal-table">
        <div class="role-list-table">
          <el-table height="350" :data="cinemaList" style="width: 100%" :row-class-name="tableRowClassName" size="mini" stripe @selection-change="handleSelectionChange" :header-cell-style='{"background":"#E7EBFF"}'>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="code" label="影院编码" align="center" width="150" :show-overflow-tooltip='true'></el-table-column>
            <el-table-column prop="name" label="影院名称" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="role-detail-footer">
      <div class="page-position">
        <el-pagination background :pager-count="5" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total,prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
    <div class="divider"></div>
    <div class="confirm-cancel">
      <el-button type="primary" @click="addRelationFun()">确 定</el-button>
      <el-button @click="cancel(false)">取 消</el-button>
    </div>
  </div>
</template>
<script>
import { listCinemaUnBind, organizationList, listOrganizationCinema, cinemaBinding } from 'baseSrc/http/interface.js';

export default {
  name: 'cinemaList',
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      status: '',
      cinemaIds: [],
      tenantLicense: '',
      cinemaName: '',
      cinemaCode: '',
      tableData: [],
      cinemaList: [],
      total: 1
    };
  },
  props: ['orgUid', 'getListOrganizationCinema', 'addRelationOpen', 'orgName'],
  created () {
    this.search();
  },
  methods: {
    // 获取影院列表
    search () {
      let self = this;
      let data = {
        code: this.cinemaCode,
        name: this.cinemaName,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
      listCinemaUnBind(data)
        .then(ret => {
          if (ret && ret.code == 200) {
            self.currentPage = ret.data.pageNum;
            self.total = ret.data.total;
            self.cinemaList = ret.data.rows;
          } else {
            self.$message(ret.msg);
          }
        })
        .catch(() => {
          self.$message('服务器繁忙，稍后再试');
        });
    },
    cancel (val) {
      this.cinemaName = this.cinemaCode = '';
      this.$emit('cancel', val);
    },
    handleSelectionChange (val) {
      this.tableData = val;
      let itemArr = val;
      let resultArr = [];
      resultArr = itemArr.map((item, index) => {
        return item.id;
      });
      this.cinemaIds = resultArr;
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 == 1) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
      return '';
    },
    // 绑定影院
    addRelationFun () {
      let self = this;
      let data = {
        uid: this.orgUid,
        cinemaIds: this.cinemaIds
      };
      cinemaBinding(data)
        .then(ret => {
          if (ret.code == 200) {
            self.$message({
              message: '绑定成功',
              type: 'success'
            });
            self.$emit('getListOrganizationCinema', {});
            self.$emit('addRelationOpen');
            self.$emit('cancel', false);
          } else {
            self.error(ret.msg);
            self.$emit('cancel', false);
          }
        })
        .catch(() => {
          this.error('网络错误，请稍后再试');
        });
    },
    handleSizeChange (val) {
      let self = this;
      self.pageSize = val;
      self.search();
    },
    handleCurrentChange (val) {
      let self = this;
      self.currentPage = val;
      self.search();
    }
    // getDatas(val) {
    //   let self = this;
    //   if (val == 1) {
    //     self.currentPage = val*1;
    //   }
    //   let item = {};
    //   item.current = self.currentPage;
    //   item.size = self.size;
    //   // this.$emit("getListOrganizationCinema", item);
    // },
  }
};
</script>
<style lang='scss' scoped>
.unbind-cinema-list {
  /*<!--margin-top:-30px;-->*/
  .modal-title-wrap {
    padding: 15px 30px;
    border-bottom: 2px solid #ff9f37;

    .modal-title {
      font-size: 18px;
      font-weight: bold;
      color: #808080;
    }

    .modal-close {
      float: right;
      font-size: 16px;
      // font-weight: bold;
      color: #808080;
      line-height: 27px;
      cursor: pointer;
    }
  }

  .modal-search {
    padding: 20px 0px 5px;

    .search-wrap {
      display: inline-block;
      height: 32px;

      .el-input {
        width: 122px;
      }

      span {
        color: #666666;
        font-size: 12px;
      }
    }

    .plian {
      padding-right: 30px;
    }

    .plian2 {
      padding-right: 20px;
    }
  }

  .role-list-content {
    margin-top: -30px;
    // 表格区域样式
    .role-list-table {
      margin-top: 30px;
      border-radius: 5px;

      .el-table .warning-row {
        background: #f5f5f5;
      }

      .el-table .success-row {
        background: #ffffff;
      }

      // .el-table tr {
      //   background: #f2f4fd;
      // }
      .short-name-item,
      .cinema-number-item {
        font-size: 12px;
        color: #fca132;
        cursor: pointer;
      }

      .short-name-item {
        padding: 5px;
      }

      .cinema-number-item {
        padding: 10px;
      }

      .el-table--fit {
        border-radius: 5px;
      }

      .has-gutter {
        .cell {
          color: #808080;
          font-weight: bold;
        }
      }

      .cell {
        font-size: 12px;
      }

      .operation-btn-wrap {
        display: flex;
        justify-content: space-around;

        .stop-use-btn {
          color: #ff3d00;
          cursor: pointer;
        }

        .start-use-btn {
          color: #80d91e;
          cursor: pointer;
        }

        .add-cinema {
          color: #fca132;
          cursor: pointer;
        }
      }
    }

    // 分页
    .merchant-pages {
      margin-top: 30px;
      text-align: center;
    }
  }

  // footer样式
  .role-detail-footer {
    text-align: center;
    margin: 10px auto;
  }

  .confirm-cancel {
    width: 100%;
    text-align: center;
    margin-top: 10px;
    .el-button--default {
      display: inline-block;
      border: 1px solid #bcbcbc;
      color: #666666;
    }
  }
}
</style>
