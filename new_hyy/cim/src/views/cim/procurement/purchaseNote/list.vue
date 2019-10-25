<template>
  <div class="purchase-note-list">
    <div class="common-header">
      <el-form :inline="true" :model="queryData" label-position="left" label-suffix="：">
        <el-form-item label="采购单号">
          <el-input v-model="queryData.billCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="采购门店" class="select-input">
          <el-input v-model="queryData.cinemaName" clearable @clear="onCinemalSumit" @focus="selectCinemalDialog" placeholder="请选择门店"></el-input>
          <el-button @click="selectCinemalDialog" type="primary" plain>选择</el-button>
        </el-form-item>
        <el-form-item label="供应商名称" class="select-input">
          <el-input v-model="queryData.supName" clearable placeholder="请选择供应商" @clear="onSupplierSumit" @focus="selectSuppliersDialog"></el-input>
          <el-button @click="selectSuppliersDialog" type="primary" plain>选择</el-button>
        </el-form-item>
        <el-form-item label="制单日期">
          <el-date-picker class="basic-input" v-model="queryData.billTimeTotal" type="datetimerange" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="单据状态">
          <el-select v-model="queryData.status">
            <el-option label="全部" value></el-option>
            <el-option label="未提交" value="1"></el-option>
            <el-option label="已提交" value="2"></el-option>
            <el-option label="部分入库" value="3"></el-option>
            <el-option label="全部入库" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="queryData.approvalStatus">
            <el-option label="全部" value></el-option>
            <el-option label="未审核" value="0"></el-option>
            <el-option label="待审核" value="1"></el-option>
            <el-option label="审核通过" value="2"></el-option>
            <el-option label="审核不通过" value="3"></el-option>
            <!-- <el-option label="无需审核" value="4"></el-option> -->
          </el-select>
        </el-form-item>
        <el-button class="query-btn" type="primary" @click="onQuery()">查询</el-button>
      </el-form>
    </div>
    <div>
      <div class="common-new-built">
        <el-button type="primary" size="small" plain @click="handleNewBuilt">新建</el-button>
        <!-- <el-button type="primary" size="small" plain>批量导出</el-button> -->
      </div>
      <div>
        <el-table :data="tableData" stripe v-loading="tableLoding">
          <el-table-column v-for="item in tableColumn" :key="item.key" :prop="item.key" :label="item.label" :formatter="item.formatter"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click.stop="handleOperateEvent('1', row)">查看</el-button>
              <!--"审核状态", //,0：未审核，1：待审核，2：审核通过，3：审核不通过，4：无需审核'-->
              <el-button type="text" size="small" v-if="row.approvalStatus==0 || row.approvalStatus==3" @click.stop="handleOperateEvent('2', row)">编辑</el-button>
              <el-button type="text" size="small" v-if="row.approvalStatus==0 || row.approvalStatus==3" @click.stop="handleOperateEvent('3', row)">提交</el-button>
              <el-button type="text" size="small" v-if="row.approvalStatus==0 || row.approvalStatus==3" @click.stop="handleOperateEvent('4', row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrap">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryData.page" :page-sizes="pageSizes" :page-size.sync="queryData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </div>
    <!-- 选择影院弹窗 -->
    <cinemal-dialog ref="myCinemalDialog" title="选择门店" @onSumit="onCinemalSumit" :dialogFeedbackData="[{cinemaUid:queryData.cinemaUid,cinemaName:queryData.cinemaName}]"></cinemal-dialog>
    <!-- 选择供应商弹窗 -->
    <suppliers-dialog ref="mySuppliersDialog" @onSumit="onSupplierSumit"></suppliers-dialog>
  </div>
</template>

<script>
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
      // 查询数据
      queryData: {
        billCode: '', // 采购单号
        cinemaUid: '', // 门店id
        cinemaName: '', // 门店名称
        supName: '', // 供应商名称
        billTimeTotal: [],
        beginTime: '', // 制单开始时间
        endTime: '', // 制单结束时间
        status: '', // 单据状态
        conditions: [], // 单据状态
        approvalStatus: '', // 审核状态
        page: 1,
        pageSize: 15
      },
      total: 0,
      // 表格表头
      tableColumn: [
        {
          label: '采购单号',
          key: 'billCode'
        },
        {
          label: '采购门店',
          key: 'cinemaName'
        },
        {
          label: '供应商名称',
          key: 'supName'
        },
        {
          label: '制单日期',
          key: 'billVoTime'
        },
        {
          label: '制单员',
          key: 'billUserName'
        },
        {
          label: '单据状态', // 1：未提交，2：已提交，3：部分入库，4：全部入库
          key: 'status',
          formatter (row, column, cellValue) {
            let result = '';
            switch (row.status) {
              case 1:
                result = '未提交';
                break;
              case 2:
                result = '已提交';
                break;
              case 3:
                result = '部分入库';
                break;
              case 4:
                result = '全部入库';
                break;
            }
            return result;
          }
        },
        {
          label: '审核状态', //, 0：未审核，1：待审核，2：审核通过，3：审核不通过，4：无需审核'
          key: 'approvalStatus',
          formatter (row, column, cellValue) {
            let result = '';
            switch (row.approvalStatus) {
              case 0:
                result = '未审核';
                break;
              case 1:
                result = '待审核';
                break;
              case 2:
                result = '审核通过';
                break;
              case 3:
                result = '审核不通过';
                break;
              case 4:
                result = '无需审核';
                break;
            }
            return result;
          }
        }
      ],
      // 表格数据
      tableData: [],
      tableLoding: false
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    // 初始化
    init () {
      if (this.queryData.cinemaUid) {
        this.onQuery();
      }
    },
    // 查询
    onQuery () {
      // console.log(this.queryData);
      if (!this.queryData.cinemaUid) {
        this.$message({
          message: '请选择门店!'
        });
        return;
      }
      if (this.queryData.billTimeTotal) {
        this.queryData.beginTime = this.queryData.billTimeTotal[0];
        this.queryData.endTime = this.queryData.billTimeTotal[1];
      } else {
        this.queryData.beginTime = '';
        this.queryData.endTime = '';
      }
      if (this.queryData.status) {
        this.queryData.conditions = [this.queryData.status - 0];
      }
      this.getPurchaseList(this.queryData);
    },
    // 查询
    getPurchaseList (param) {
      this.tableLoding = true;
      this.$cimList.procurement.purchaseList(param).then(resData => {
        if (resData.code == 200) {
          this.tableData = resData.data.list;
          this.total = resData.data.total;
        }
        this.tableLoding = false;
      }).catch(() => {
        this.tableLoding = false;
      });
    },
    // 新建
    handleNewBuilt () {
      // console.log("新建");
      this.jumpPage({
        type: '1'
      });
    },
    jumpPage (param = {}) {
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
        path: '/retail/procurement/purchaseNote/' + router,
        query: param
      });
    },

    handleOperateEvent (type, row) {
      switch (type) {
        case '1':
          // 查看
          this.jumpPage({
            type: '3',
            data: JSON.stringify({ uid: row.uid, billCode: row.billCode })
          });
          break;
        case '2':
          // 编辑
          this.jumpPage({
            type: '2',
            data: JSON.stringify({ uid: row.uid, billCode: row.billCode })
          });
          break;
        case '3':
          // 提交
          this.purchaseSubmit({ billCode: row.billCode, isReview: 1 });
          break;
        case '4':
          // 删除
          this.$confirm("<i class='el-icon-circle-close'></i><span>确定删除吗?</span>", {
            customClass: 'retail-style',
            dangerouslyUseHTMLString: true,
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            center: true
          })
            .then(() => {
              // 删除
              this.handleeDlete({ billCode: row.billCode });
            })
            .catch(() => { });
          break;
      }
    },
    // 删除操作
    handleeDlete (param) {
      // console.log(param);
      this.$cimList.procurement
        .purchaseDelete(param)
        .then(resData => {
          if (resData.code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.onQuery();
          } else {
            this.$message({
              type: 'error',
              message: resData.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 提交操作
    purchaseSubmit (param) {
      this.$cimList.procurement
        .purchaseSubmit(param)
        .then(resData => {
          if (resData.code == 200) {
            this.$message({
              type: 'success',
              message: '提交成功!'
            });
            this.onQuery();
          } else {
            this.$message({
              type: 'error',
              message: resData.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    selectCinemalDialog () {
      this.$refs.myCinemalDialog.handleDialog(true);
    },
    selectSuppliersDialog () {
      this.$refs.mySuppliersDialog.handleDialog(true);
    },
    handleSizeChange (val) {
      this.queryData.pageSize = val;
      this.getPurchaseList(this.queryData);
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.queryData.page = val;
      this.getPurchaseList(this.queryData);
      // console.log(`当前页: ${val}`);
    },
    // 选泽门店回调
    onCinemalSumit (val = [], type) {
      // console.log(val," 选泽门店回调",type);
      if (val.length > 0) {
        if (type == 'default') {
          if (val.length == 1) {
            this.setCinema(val);
            this.onQuery();
          }
        } else {
          this.setCinema(val);
        }
      } else {
        this.setCinema();
      }
    },
    setCinema (val = []) {
      if (val.length > 0) {
        this.queryData.cinemaName = val[0].cinemaName || val[0].name;
        this.queryData.cinemaUid = val[0].cinemaUid || val[0].uid;
      } else {
        this.queryData.cinemaName = '';
        this.queryData.cinemaUid = '';
      }
    },
    // 选泽供应商回调
    onSupplierSumit (val = []) {
      if (val.length > 0) {
        this.queryData.supName = val[0].supplierName;
        // this.queryData.cinemaUid = val[0].cinemaUid;
      } else {
        this.queryData.supName = '';
        // this.queryData.cinemaUid = "";
      }
      // console.log(this.queryData);
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
.purchase-note-list {
}
</style>