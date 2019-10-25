<template>
  <div class="grTR-style">
    <!-- {{this.queryData}} -->
    <div class="common-header">
      <el-form :inline="true" :model="queryData" label-position="left" label-suffix="：">
        <el-form-item label="转移门店" class="select-input">
          <el-input v-model="queryData.cinemaName" clearable @clear="onCinemalSumit" @focus="selectCinemalDialog" placeholder="请选择门店"></el-input>
          <el-button @click="selectCinemalDialog" type="primary cinemaSel-btn" plain>选择</el-button>
        </el-form-item>
        <el-form-item label="单据号">
          <el-input v-model="queryData.billCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="制单日期">
          <el-date-picker v-model="queryData.billTime" type="date" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="单据状态">
          <el-select v-model="queryData.status">
            <el-option label="全部" value></el-option>
            <el-option label="未提交" value="1"></el-option>
            <el-option label="已提交" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="query-btn-box">
          <el-button type="primary query-btn" @click="onQuery()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div class="common-new-built">
        <el-button type="primary" size="small" plain @click="addinvent()">新建</el-button>
      </div>
      <div>
        <el-table :data="tableData" stripe :height="this.defaultTableHeight">
          <el-table-column v-for="item in tableColumn" :key="item.key" :prop="item.key" :label="item.label" :formatter="item.formatter"></el-table-column>
          <el-table-column label="操作" style="width:180px;">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click.stop="handleOperateEvent('1', row)">查看</el-button>
              <el-button type="text" size="small" @click.stop="handleOperateEvent('2', row)" v-if="row.status == 1">编辑</el-button>
              <el-button type="text" size="small" @click.stop="handleOperateEvent('3', row)" v-if="row.status == 1">提交</el-button>
              <el-button type="text" size="small" @click.stop="handleOperateEvent('4', row)" v-if="row.status == 1">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrap">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryData.page" :page-sizes="this.pageSizes" :page-size="queryData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="this.total"></el-pagination>
        </div>
      </div>
    </div>
    <!-- 选择影院弹窗 -->
    <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit" :dialogFeedbackData="[{cinemaUid:queryData.cinemaUid,cinemaName:queryData.cinemaName}]"></cinemal-dialog>
    <suppliers-dialog ref="mySuppliersDialog"></suppliers-dialog>
  </div>
</template>

<script>
import qs from 'qs';
import mixin from 'cimSrc/mixins/cim/paginationConfig.js';
import cinemalDialog from 'cimSrc/components/cinemalDialog/cinemaDialog.vue';
import suppliersDialog from 'cimSrc/components/suppliersDialog/suppliersDialog.vue';
// import mixins from "frame_cpm/mixins/cacheMixin";
const { cacheMixin } = requireModule('base');
export default {
  mixins: [mixin, cacheMixin.cacheMixin],
  data () {
    return {
      cacheField: ['queryData'],
      selData: {},
      // 查询数据
      queryData: {
        billCode: '',
        billTime: '',
        billUserUid: '',
        cinemaUid: '',
        cinemaName: '',
        status: '',
        pageSize: 15,
        page: 1
      },
      total: 0,
      // 表格表头
      tableColumn: [
        {
          label: '单据号',
          key: 'billCode'
        },
        {
          label: '转移门店',
          key: 'cinemaName'
        },
        {
          label: '转出仓库',
          key: 'outStorehouseName'
        },
        {
          label: '转入仓库',
          key: 'inStorehouseName'
        },
        {
          label: '制单员',
          key: 'billUserName'
        },
        {
          label: '制单时间',
          key: 'billTime'
        },
        {
          label: '单据状态',
          key: 'status',
          formatter (row, column, cellValue) {
            let result = '';
            switch (row.status) {
              case 2:
                result = '已提交';
                break;
              case 1:
                result = '未提交';
                break;
            }
            return result;
          }
        }
      ],
      // 表格数据
      tableData: []
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    // 初始化
    init () {
      this.queryData.pageSize = this.pageSize;
      this.$nextTick(() => {
        this.returnType = this.$route.query.returnType;
        if (this.returnType === true) {
          this.queryData.cinemaUid = JSON.parse(this.$route.query.cinema).cinemaUid;
          this.queryData.cinemaName = JSON.parse(this.$route.query.cinema).cinemaName;
        }
        if (this.queryData.cinemaUid == '' || this.queryData.cinemaUid == null) {
        } else {
          this.goodsDataQueryGoodsList();
        }
      });
    },
    // 选泽门店回调
    setCinema (val = []) {
      if (val.length > 0) {
        this.queryData.cinemaName = val[0].name;
        this.queryData.cinemaUid = val[0].uid;
      } else {
        this.queryData.cinemaName = '';
        this.queryData.cinemaUid = '';
      }
      console.log(val);
    },
    // 选泽门店回调
    onCinemalSumit (val = [], type) {
      console.log(val, ' 选泽门店回调', type);
      if (val.length > 0) {
        if (type == 'default') {
          if (val.length == 1) {
            this.setCinema(val);
          }
        } else {
          this.setCinema(val);
        }
      } else {
        this.setCinema();
      }
    },
    // 查询
    onQuery () {
      if (this.queryData.cinemaUid == '' || this.queryData.cinemaUid == '') {
        this.$message('请选择门店');
      } else {
        this.goodsDataQueryGoodsList();
        console.log(this.queryData);
      }
    },
    // 新增库存转移
    addinvent () {
      this.resMoveBillFindMoveDetailInfo();
      this.handleNewPurchaseNote({
        type: '1',
        data: JSON.stringify(this.selData)
      });
    },
    // 跳转库存转移
    handleNewPurchaseNote (param) {
      let router = '';
      switch (param.type) {
        case '1':
          // 新增
          router = 'add';
          break;
        case '2':
          // 编辑
          router = 'edit';
          break;
        case '3':
          // 查看
          router = 'details';
          break;
      }
      this.$router.push({
        path: router,
        query: param
      });
    },

    handleOperateEvent (type, row) {
      switch (type) {
        case '1':
          // 查看
          this.seetable(row);
          break;
        case '2':
          // 编辑
          this.edirtable(row);
          break;
        case '3':
          // 提交
          this.tjtable(row);
          break;
        case '4':
          // 删除
          this.detable(row);
          break;
      }
    },
    // 查看操作
    seetable (row) {
      this.handleNewPurchaseNote({
        type: '3',
        data: JSON.stringify(row.uid)
      });
      // this.resMoveBillFindMoveDetailInfo(row,"3")
    },
    // 修改操作
    edirtable (row) {
      this.handleNewPurchaseNote({
        type: '2',
        data: JSON.stringify(row.uid)
      });
      // this.resMoveBillFindMoveDetailInfo(row,"2")
    },
    // 提交操作
    tjtable (row) {
      this.resMoveBillSubmitMoveBillInfo(row);
    },
    // 删除操作
    detable (row) {
      this.resMoveBillDelMoveBillInfo(row);
    },
    selectCinemalDialog () {
      this.$refs.myCinemalDialog.handleDialog(true);
    },
    selectSuppliersDialog () {
      this.$refs.mySuppliersDialog.handleDialog(true);
    },
    handleSizeChange (val) {
      this.queryData.pageSize = val;
      this.goodsDataQueryGoodsList();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.queryData.page = val;
      this.goodsDataQueryGoodsList();
      console.log(`当前页: ${val}`);
    },
    // 转移管理查询接口
    goodsDataQueryGoodsList () {
      let val = {
        billCode: this.queryData.billCode,
        submitTime: this.queryData.billTime,
        billUserUid: this.queryData.billUserUid,
        cinemaUid: this.queryData.cinemaUid,
        status: this.queryData.status,
        pageSize: this.queryData.pageSize,
        page: this.queryData.page
      };
      this.$cimList.inventoryTransfer
        .moveBillFindMoveList(val)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data.list;
            this.total = res.data.total;
            console.log(res);
          } else {
            this.$message(res.msg);
          }
        });
    },
    // 转移管理查询接口
    resMoveBillFindMoveDetailInfo (row, type) {
      let val = {
        uid: row == undefined ? '' : row.uid
      };
      this.$cimList.inventoryTransfer
        .moveBillFindMoveDetailInfo(val)
        .then(res => {
          if (res.code === 200) {
            this.selData = res.data;
            if (type == '3' || type == '2') {
              this.handleNewPurchaseNote({
                type: type,
                data: JSON.stringify(res.data)
              });
            }
          } else {
            this.error(res.msg);
            this.$message(res.msg);
          }
        });
    },
    // 转移提交请求
    resMoveBillSubmitMoveBillInfo (row) {
      let val = {
        billCode: row.billCode
      };
      this.$cimList.inventoryTransfer
        .moveBillSubmitMoveBillInfo(val)
        .then(res => {
          if (res.code == 200) {
            this.$message('提交成功');
            this.goodsDataQueryGoodsList();
            // this.queryData.billCode = res.data.billCode
            console.log(res);
          } else {
            this.$message(res.message);
            this.$message(res.msg);
          }
        });
    },
    // 转移删除请求
    resMoveBillDelMoveBillInfo (row) {
      this.$confirm('确认删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除
          let val = {
            billCode: row.billCode
          };
          this.$cimList.inventoryTransfer
            .moveBillDelMoveBillInfo(val)
            .then(res => {
              if (res.code == 200) {
                this.onQuery();
                this.$message('删除成功');
              }
            });
        })
        .catch(() => { });
    }
  },
  components: {
    cinemalDialog,
    suppliersDialog
  }
};
</script>

<style lang="scss">
@import "../../../../assets/css/common.scss";
@import "../../../../assets/css/element-common.scss";
.grTR-style {
  .newPro-box {
    .title {
      margin: 10px 0;
      font-size: 16px;
    }
    .selectName {
      font-size: 16px;
      margin: 10px 0;
    }
    .newProTree {
      height: 330px;
      overflow: auto;
    }
  }
}
</style>