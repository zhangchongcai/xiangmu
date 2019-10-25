<template>
  <div class="ticket-type">
    <div v-if="!dialogShow">
      <!-- 查询块 -->
      <header class="headers">
        <div class="item-warp">
          <span class="title">适用影院:</span>
          <el-input v-model="cinemaName" @focus="cinemaDialogShow" :readonly="true" class="popup-input">
            <i slot="suffix" class="el-icon-close popup-close" @click="clearCinema()" v-if="cinemaName"></i>
          </el-input>
        </div>
        <div class="search-Btn">
          <el-button type="primary" @click="searchCinema" readonly style="width:80px;height:32px">查询</el-button>
        </div>
      </header>
      <div style="text-align:right;padding:12px 0;">
        <el-button type="primary" plain @click="addOrUpdateHandle()" class="btn-80-32">新建</el-button>
      </div>
      <!-- 内容块 -->
      <div class="table-warp" ref="warp">
        <el-table :data='dataList' v-loading="dataListLoading" stripe :header-cell-style="{background:'#E7EBFF',height:'38px!important'}" style='width: 100%;'>
          <el-table-column type="index" label='序号' header-align="center" align="center" width="80">
          </el-table-column>
          <el-table-column prop='name' label='票类名称'>
          </el-table-column>
          <el-table-column label='是否为标准票类'>
            <template slot-scope='scope'>
              <span v-if='scope.row.baseFlag === 1'>否</span>
              <span v-else>是</span>
            </template>
          </el-table-column>
          <el-table-column label='适用影院'>
            <template slot-scope='scope'>
              {{scope.row.cinemaNames.join(",")}}
            </template>
          </el-table-column>
          <el-table-column label='是否允许打折'>
            <template slot-scope='scope'>
              <span v-if='scope.row.isDiscount === 1'>否</span>
              <span v-else>是</span>
            </template>
          </el-table-column>
          <el-table-column prop='seq' label='票类顺序'>
          </el-table-column>
          <el-table-column width='200' label='操作'>
            <template slot-scope='scope'>
              <el-button size='small' type="text" @click='addOrUpdateHandle(scope.row)'>编辑</el-button>
              <el-button size='small' v-if="scope.row.name!='成人票'&&scope.row.name!='团体票'&&scope.row.name!='学生票'" type="text" @click='deleteHandle(scope.row.uid)'>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination background @size-change='sizeChangeHandle' @current-change='currentChangeHandle' :current-page='pageIndex' :page-sizes='[10, 15, 20 , 25 , 30]' :page-size='pageSize' :total='totalCount' layout='total, sizes, prev, pager, next, jumper'>
      </el-pagination>
    </div>
    <ticket-type v-else ref="addOrUpdate" @refreshDataList="getDataList"></ticket-type>
    <!-- 影院复选框 -->
    <GroupMultiSelectCinema :reviewData="huixianData" :dialogVisible.sync="dialogVisible" @frameCinemaDialogCallBack="handleCinemaDialogCallBack" :disabledData=[] :innerCinemaMultiData='innerData'>
    </GroupMultiSelectCinema>
  </div>
</template>
<script>
import TicketType from './ticketType-add-or-update';
import { cacheMixin, multiCinema2 } from 'base';
import SirTable from './sirTable';
import qs from 'qs';
let getDom = className => {
  return document.getElementsByClassName(className);
};
export default {
  components: {
    TicketType,
    SirTable,
    GroupMultiSelectCinema: multiCinema2
  },
  mixins: [cacheMixin.cacheMixin],
  data () {
    return {
      cacheField: ['cinemaName', 'cinemaUids', 'dataList', 'pageIndex', 'pageSize', 'totalCount'],
      // 添加/编辑数据
      dialogShow: false,
      dataForm: {},
      // 回调数据
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      dataListLoading: false,
      // 影院复选
      cinemaName: null,
      cinemaUids: [],
      dialogVisible: false,
      innerData: {
        type: 2
      },
      huixianData: []
    };
  },
  created () {
    this.getDataList();
  },
  mounted () {
    let tableWarp = getDom('table-warp')[0];
    let header = getDom('el-table__header-wrapper')[0];
    // console.log(tableWarp)
    let table = getDom('el-table')[0];
    // console.log(table)
    tableWarp.addEventListener('scroll', () => {
      // console.log(tableWarp.scrollTop)
      if (tableWarp.scrollTop <= 0) {
        header.style.transform = 'translateY(0)';
        header.style.position = 'static';
        return;
      }
      header.style.position = 'absolute';
      header.style.top = 0;
      header.style.zIndex = 999;
      header.style.borderTop = '1px #f0f0f0 solid';
      header.style.height = '38px';
      header.style.transform = `translateY(${tableWarp.scrollTop - 1}px)`;
    });
  },
  updata () {

  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true;
      this.dialogShow = false;
      let limit = {
        'page': this.pageIndex,
        'pageSize': this.pageSize
      };
      let cinemaUids = { cinemaUids: this.cinemaUids };
      // console.log(limit)
      this.$ctmList.tickettypeList(limit, cinemaUids).then(data => {
        console.log(data);
        if (data && data.code === 200) {
          this.dataList = data.data.list;
          this.totalCount = data.data.total;
          // this.pageIndex = data.data.current
          // this.pageSize = data.data.size
        } else {
          this.dataList = [];
          this.totalCount = 0;
        }
        this.dataListLoading = false;
      }).catch(err => {
        console.log(err);
      });
    },
    // 每页数
    sizeChangeHandle (val) {
      // console.log(val)
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle (val) {
      // console.log(val)
      this.pageIndex = val;
      this.getDataList();
    },
    addOrUpdateHandle (row) {
      this.dialogShow = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row);
      });
    },
    // 删除
    deleteHandle (id) {
      // console.log(id)
      this.$confirm(`您确定要删除此记录吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ctmList.tickettypeDel(id).then(data => {
          // console.log(data)
          if (data && data.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList();
              }
            });
          } else {
            this.$message.error(data.msg);
          }
        }).catch(err => {
          console.log(err);
        });
      }).catch(() => { });
    },
    getDom (className) {
      let getDom = className => {
        return document.getElementsByClassName(className);
      };
    },
    // 弹窗方法
    handleCinemaDialogCallBack (data) {
      data = data.data;
      console.log(data);
      this.cinemaDialogVisible = false;
      let text = [];
      this.cinemaUids = [];
      data.forEach(item => {
        text.push(item.name);
        this.cinemaUids.push(item.id);
        this.huixianData = data;
      });
      this.cinemaName = text.join(',');
    },
    // 弹窗开启
    cinemaDialogShow () {
      this.dialogVisible = true;
    },
    // 清除input框
    clearCinema () {
      this.cinemaName = '';
      this.cinemaUids = [];
      this.huixianData = [];
    },
    // 查询
    searchCinema () {
      this.getDataList(this.cinemaUid);
    }
  }
};
</script>

<style lang="scss">
.ticket-type {
  /deep/ .el-input__inner {
    text-overflow: ellipsis;
  }
  .demo-ruleForm {
    padding-right: 50px;
    padding-top: 20px;
    float: right;
  }
  .headers {
    background: #f5f5f5;
    padding: 24px 12px;
    display: flex;
    .item-warp {
      display: inline-flex;
      .el-input {
        display: inline-block;
      }
      .title {
        display: inline-block;
        width: 80px;
        font-size: 12px;
        line-height: 32px;
        color: #666;
      }
      .el-input__inner {
        background: #f5f5f5;
      }
    }
    .search-Btn {
      margin-left: 14px;
    }
  }
  .el-button {
    font-size: 12px;
  }
  .el-pagination {
    margin-top: 20px;
    text-align: center;
    height: 24px;
    line-height: 24px;
    padding: 0px 5px;
    ul {
      height: 24px;
      li {
        height: 24px;
      }
    }
    .el-input__inner {
      height: 24px;
      line-height: 24px;
    }
    .el-input__icon {
      line-height: 24px;
    }
    .el-pagination__editor.el-input .el-input__inner {
      height: 24px;
    }
  }

  .table-warp {
    max-height: 609px;
    overflow: auto;
    position: relative;
    .el-table__header-wrapper,
    .has-gutter tr th {
      height: 38px;
      box-sizing: border-box;
    }
    .el-table {
      border-left: #f0f0f0 1px solid;
      border-top: #f0f0f0 1px solid;
    }
    .el-table th,
    .el-table td {
      border-right: 1px solid #e5e5e5 !important;
      border-bottom: 1px solid #e5e5e5 !important;
    }
    .el-table--striped .el-table__body tr.el-table__row--striped td {
      background: #f0f0f0;
    }
  }
}
</style>
<style lang="scss" scoped>
/deep/ .popup-input {
  width: 200px;
  input {
    text-overflow: ellipsis;
    background: #f5f5f5;
    border: 1px solid #bcbcbc !important;
  }
}
.popup-input:hover .popup-close {
  display: inline-block;
}
/deep/ .popup-close {
  cursor: pointer;
  color: #3b74ff;
  font-size: 16px;
  font-weight: 500;
  font-weight: 700;
  margin-top: 9px;
  display: none;
}
.btn-80-32 {
  width: 80px;
  height: 32px;
}
</style>