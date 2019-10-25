<template>
  <div class="purchase-note-list">
    <!-- {{this.queryData}} -->
    <div class="common-header">
      <el-form :inline="true" :model="queryData" label-position="left" label-suffix="：">
        <el-form-item label="调价单号">
          <el-input v-model="queryData.billCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="调整方式">
          <el-select v-model="queryData.billType">
            <el-option label="请选择" value></el-option>
            <el-option label="（指定门店）调整商品售价" value="1"></el-option>
            <el-option label="（指定商品）调整门店售价" value="2"></el-option>
            <!-- <el-option label="（指定商品）调整商品售价" value="3"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="制单日期">
          <el-date-picker class="basic-input" v-model="queryData.billTimeTotal" type="datetimerange" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="生效状态">
          <el-select v-model="queryData.status">
            <el-option label="全部" value></el-option>
            <el-option label="未生效" value="2"></el-option>
            <el-option label="已生效" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="queryData.approvalStatus">
            <el-option label="全部" value></el-option>
            <!-- <el-option label="未审核" value="0"></el-option> -->
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
      <!-- <el-button type="primary" size="small" plain @click="handleNewBuilt">新建</el-button> -->
      <!-- <el-button type="primary" size="small" plain>批量导出</el-button> -->
      <div class="common-new-built">
        <el-dropdown @command="newAddhandleCommand">
          <el-button type="primary" plain>
            新建
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">（指定门店）调整商品售价</el-dropdown-item>
            <el-dropdown-item command="2">（指定商品）调整门店售价</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div>
        <el-table :data="tableData" stripe v-loading="tableLoding">
          <el-table-column v-for="(item,index) in tableColumn" :key="index" :prop="item.key" :label="item.label" :formatter="item.formatter"></el-table-column>
          <el-table-column label="操作" style="width:180px;">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click.stop="handleOperateEvent('1', row)">查看</el-button>
              <!--"审核状态", //,0：未审核，1：待审核，2：审核通过，3：审核不通过，4：无需审核'-->
              <el-button type="text" size="small" v-if="row.approvalStatus==2 && row.status == 2" @click.stop="handleOperateEvent('2', row)">修订</el-button>
              <!-- <el-button
                      type="text"
                      size="small"
                      v-if="row.approvalStatus==0 || row.approvalStatus==3"
                      @click.stop="handleOperateEvent('3', row)"
              >提交</el-button>
              <el-button
                      type="text"
                      size="small"
                      v-if="row.approvalStatus==0 || row.approvalStatus==3"
                      @click.stop="handleOperateEvent('4', row)"
              >删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrap">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryData.page" :page-sizes="pageSizes" :page-size.sync="queryData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </div>
    <!-- 选择影院弹窗 -->
    <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit" :dialogFeedbackData="[{cinemaUid:queryData.cinemaUid,cinemaName:queryData.cinemaName}]"></cinemal-dialog>
    <!-- 选择供应商弹窗 -->
    <suppliers-dialog ref="mySuppliersDialog" @onSumit="onSupplierSumit"></suppliers-dialog>
  </div>
</template>

<script>
import mixin from 'cimSrc/mixins/cim/paginationConfig.js';
import cinemalDialog from 'cimSrc/components/cinemalDialog/cinemaDialog.vue';
import suppliersDialog from 'cimSrc/components/suppliersDialog/suppliersDialog.vue';
// import mixins from "frame_cpm/mixins/cacheMixin";
import { cacheMixin } from 'base';
export default {
  mixins: [mixin, cacheMixin.cacheMixin],
  data () {
    return {
      cacheField: ['queryData'],
      // 查询数据
      queryData: {
        billTimeTotal: [],
        billCode: '',
        approvalStatus: '',
        beginTime: '',
        endTime: '',
        billType: '',
        status: '',
        page: 1,
        pageSize: 15
      },
      total: 0,
      // 表格表头
      tableColumn: [
        {
          label: '调价单号',
          key: 'billCode'
        },
        {
          label: '调整方式',
          key: 'billType',
          formatter (row, column, cellValue) {
            let result = '';
            switch (row.billType) {
              case 1:
                result = '（指定门店）调整商品售价';
                break;
              case 2:
                result = '（指定商品）调整门店售价';
                break;
            }
            return result;
          }
        },
        {
          label: '生效日期',
          key: 'adjustTime'
        },
        {
          label: '生效状态',
          key: 'status',
          formatter (row, column, cellValue) {
            let result = '';
            switch (row.status) {
              case 1:
                result = '未生效';
                break;
              case 2:
                result = '未生效';
                break;
              case 3:
                result = '已生效';
                break;
            }
            return result;
          }
        },
        {
          label: '制单日期',
          key: 'billTime'
        },
        {
          label: '制单员',
          key: 'billUserName'
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
      // this.$store.commit('getLevel',this.$route.meta.title)
    },
    // 查询
    onQuery () {
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
    // 新建按钮
    newAddhandleCommand (command) {
      switch (command) {
        // （指定门店）调整商品售价
        case '1':
          return this.addStore({
            type: '1', // 1新建，2修改，3查看
            data: JSON.stringify(this.queryData)
          });
          break;
        // （指定商品）调整门店售价
        case '2':
          this.addCommodity({
            type: '1', // 1新建，2修改，3查看
            data: JSON.stringify(this.queryData)
          });
          break;
      }
    },
    // （指定门店）调整商品售价
    addStore (param = {}) {
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
        path: 'forGoods' + router,
        query: param
      });
    },
    // （指定商品）调整门店售价
    addCommodity (param = {}) {
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
        path: 'forCinema' + router,
        query: param
      });
    },
    // 查询
    getPurchaseList (param) {
      this.tableLoding = true;
      this.$cimList.priceBill.adjustBillQuery(param).then(resData => {
        if (resData.code == 200) {
          this.tableData = resData.data.list;
          this.total = resData.data.total;
        }
        this.tableLoding = false;
      }).catch(() => {
        this.tableLoding = false;
      });
    },
    handleOperateEvent (type, row) {
      switch (type) {
        case '1':
          // 查看
          if (row.billType == '1') {
            this.addStore({
              type: '3',
              data: JSON.stringify({ uid: row.uid, billCode: row.billCode })
            });
          } else if (row.billType == '2') {
            this.addCommodity({
              type: '3',
              data: JSON.stringify({ uid: row.uid, billCode: row.billCode })
            });
          }
          break;
        case '2':
          // 编辑
          if (row.billType == '1') {
            this.addStore({
              type: '2',
              data: JSON.stringify({ uid: row.uid, billCode: row.billCode })
            });
          } else if (row.billType == '2') {
            this.addCommodity({
              type: '2',
              data: JSON.stringify({ uid: row.uid, billCode: row.billCode })
            });
          }
          break;
      }
    },
    // 删除操作
    handleeDlete (param) {
      console.log(param);
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
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.queryData.page = val;
      this.getPurchaseList(this.queryData);
      console.log(`当前页: ${val}`);
    },
    // 选泽门店回调
    onCinemalSumit (val = [], type) {
      console.log(val, ' 选泽门店回调', type);
      if (val.length > 0) {
        if (type == 'default') {
          if (val.length == 1) {
            this.setCinema(val);
          }
          this.onQuery();
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
      console.log(this.queryData);
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