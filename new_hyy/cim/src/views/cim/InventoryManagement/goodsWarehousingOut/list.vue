<template>
  <div class="goodsOut-style">
    <div class="common-header">
      <el-form :inline="true" :model="queryData" label-position="left" label-suffix="：">
        <el-form-item label="登记门店" class="select-input">
          <el-input v-model="queryData.cinemaName" clearable @clear="onCinemalSumit" @focus="selectCinemalDialog" placeholder="请选择门店"></el-input>
          <el-button @click="selectCinemalDialog" type="primary cinemaSel-btn" plain>选择</el-button>
        </el-form-item>
        <el-form-item label="单据号">
          <el-input v-model="queryData.billCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="制单日期">
          <el-date-picker class="basic-input" v-model="queryData.billTimeTotal" type="datetimerange" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="单据类型">
          <el-select v-model="queryData.billType" @change="billTypeEvent()">
            <el-option label="全部" value></el-option>
            <el-option label="报损出库" value="2"></el-option>
            <el-option label="领用出库" value="3"></el-option>
            <el-option label="调拨出库" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单据状态">
          <el-select v-model="queryData.status">
            <el-option label="全部" value></el-option>
            <el-option label="未提交" value="1"></el-option>
            <el-option label="已提交" value="2"></el-option>
            <el-option label="待出库" value="3"></el-option>
            <el-option label="已出库" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button type="primary query-btn" @click="onQuery()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div class="common-new-built">
        <el-dropdown @command="newAddhandleCommand">
          <el-button type="primary" plain>
            新建
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">领用出库</el-dropdown-item>
            <el-dropdown-item command="2">报损出库</el-dropdown-item>
            <el-dropdown-item command="3">调拨出库</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div>
        <el-table :data="tableData" stripe :height="this.defaultTableHeight">
          <el-table-column v-for="item in tableColumn" :key="item.key" :prop="item.key" :label="item.label" :formatter="item.formatter"></el-table-column>
          <el-table-column label="操作" width="200">
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
    <!-- 选择供应商弹窗 -->
    <suppliers-dialog ref="mySuppliersDialog"></suppliers-dialog>
  </div>
</template>

<script>
import qs from 'qs';
import mixin from 'cimSrc/mixins/cim/paginationConfig.js';
import eventBus from 'cimSrc/mixins/cim/eventBus.js';
import cinemalDialog from 'cimSrc/components/cinemalDialog/cinemaDialog.vue';
import suppliersDialog from 'cimSrc/components/suppliersDialog/suppliersDialog.vue';
// import mixins from "frame_cpm/mixins/cacheMixin";
const { cacheMixin } = requireModule('base');

export default {
  mixins: [mixin, cacheMixin.cacheMixin],
  data () {
    return {
      returnType: false,
      cacheField: ['queryData'],
      // 查询数据
      queryData: {
        billTypeList: ['2', '3', '4'],
        billTimeTotal: [],
        billCode: '',
        billType: '',
        cinemaUid: '',
        cinemaName: '',
        billTimeEnd: '',
        billTimeStart: '',
        billUserUid: '',
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
          label: '单据类型',
          key: 'billType',
          formatter (row, column, cellValue) {
            let result = '';
            switch (row.billType) {
              case 2:
                result = '报损出库';
                break;
              case 3:
                result = '领用出库';
                break;
              case 4:
                result = '调拨出库';
                break;
            }
            return result;
          }
        },
        {
          label: '登记门店',
          key: 'cinemaName'
        },
        {
          label: '制单员',
          key: 'billUserName'
        },
        {
          label: '制单日期',
          key: 'billTime'
        },
        {
          label: '单据状态',
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
                result = '待出库';
                break;
              case 4:
                result = '已出库';
                break;
            }
            return result;
          }
        }
        // {
        //   label: "审核状态",
        //   key: "approvalStatus",
        //   formatter(row, column, cellValue) {
        //     let result = "";
        //     switch (row.approvalStatus) {
        //       case 0:
        //         result = "未审核";
        //         break;
        //       case 1:
        //         result = "待审核";
        //         break;
        //       case 2:
        //         result = "审核通过";
        //         break;
        //       case 3:
        //         result = "审核不通过";
        //         break;
        //       case 4:
        //         result = "无需审核";
        //         break;
        //     }
        //     return result;
        //   }
        // }
      ],
      // 表格数据
      tableData: [
      ]
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
          this.resCheckBillToPage(this.queryData);
        }
      });
    },
    // 查询
    onQuery () {
      if (this.queryData.cinemaUid === '') {
        this.$message('请选择门店');
      } else {
        if (this.queryData.billTimeTotal) {
          this.queryData.createTimeStart = this.queryData.billTimeTotal[0];
          this.queryData.createTimeEnd = this.queryData.billTimeTotal[1];
        } else {
          this.queryData.createTimeStart = '';
          this.queryData.createTimeEnd = '';
        }
        this.resCheckBillToPage(this.queryData);
        console.log(this.queryData);
      }
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
    selectCinemalDialog () {
      this.$refs.myCinemalDialog.handleDialog(true);
    },
    // 新建按钮
    newAddhandleCommand (command) {
      switch (command) {
        // 领用退回入库
        case '1':
          return this.addReturn({
            type: '1' // 1新建，2修改，3查看
            // data: JSON.stringify(this.queryData)
          });
          break;
        // 盘点赔偿入库
        case '2':
          this.addInventory({
            type: '1'// 1新建，2修改，3查看
            // data: JSON.stringify(this.queryData)
          });
          break;
        // 调拨入库
        case '3':
          this.addWarehousing({
            type: '1', // 1新建，2修改，3查看
            data: ''
          });
          break;
      }
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
      if (row.billType == 3) {
        this.addReturn({
          type: '3', // 1新建，2修改，3查看
          data: JSON.stringify(row.uid)
          // cinema: JSON.stringify(this.queryData)
        });
      } else if (row.billType == 2) {
        this.addInventory({
          type: '3', // 1新建，2修改，3查看
          data: JSON.stringify(row.uid)
          // cinema: JSON.stringify(this.queryData)
        });
      } else if (row.billType == 4) {
        this.addWarehousing({
          type: '3', // 1新建，2修改，3查看
          data: JSON.stringify(row.uid)
          // cinema: JSON.stringify(this.queryData)
        });
      }
    },
    billTypeEvent () {
      if (this.queryData.billType == '') {
        this.queryData.billTypeList = ['2', '3', '4'];
      } else {
        this.queryData.billTypeList = [];
        this.queryData.billTypeList.push(this.queryData.billType);
      }
    },
    // 修改操作
    edirtable (row) {
      if (row.billType == 3) {
        this.addReturn({
          type: '2', // 1新建，2修改，3查看
          data: JSON.stringify(row.uid)
          // cinema: JSON.stringify(this.queryData)
        });
      } else if (row.billType == 2) {
        this.addInventory({
          type: '2', // 1新建，2修改，3查看
          data: JSON.stringify(row.uid)
          // cinema: JSON.stringify(this.queryData)
        });
      } else if (row.billType == 4) {
        this.addWarehousing({
          type: '2', // 1新建，2修改，3查看
          data: JSON.stringify(row.uid)
          // cinema: JSON.stringify(this.queryData)
        });
      }
    },
    // 提交操作
    tjtable (row) {
      this.resStoreInSubmit(row);
    },
    // 删除操作
    detable (row) {
      this.$confirm('确认删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.resStoreInDelete(row);
        })
        .catch(() => { });
    },
    // 跳转领用退回入库
    addReturn (param = {}) {
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
        path: 'return' + router,
        query: param
      });
    },
    // 跳转盘点赔偿入库
    addInventory (param = {}) {
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
        path: 'inventory' + router,
        query: param
      });
    },
    // 跳转调拨入库
    addWarehousing (param = {}) {
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
        path: 'warehousing' + router,
        query: param
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
      this.resCheckBillToPage(this.queryData);
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.queryData.page = val;
      this.resCheckBillToPage(this.queryData);
      console.log(`当前页: ${val}`);
    },
    // 商品入库页面请求
    resCheckBillToPage (row) {
      this.$cimList.goodsWarehousingOut
        .storeoutBillList(row)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data.list;
            this.total = res.data.total;
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => { });
    },
    // 删除商品入库请求
    resStoreInDelete (row) {
      let val = {
        uid: row.uid
      };
      this.$cimList.goodsWarehousingOut
        .storeoutBillDelete(val)
        .then(res => {
          if (res.code === 200) {
            if (this.queryData.cinemaUid == '' || this.queryData.cinemaUid == null) {
            } else {
              this.resCheckBillToPage(this.queryData);
            }
            this.$message('删除成功');
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => { });
    },
    // 提交商品入库请求
    resStoreInSubmit (row) {
      let val = {
        uid: row.uid
      };
      this.$cimList.goodsWarehousingOut
        .storeoutBillCommit(val)
        .then(res => {
          if (res.code === 200) {
            if (this.queryData.cinemaUid == '' || this.queryData.cinemaUid == null) {
            } else {
              this.resCheckBillToPage(this.queryData);
            }
            this.$message('提交成功');
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => { });
    },
    // 查看修改进入详情页请求
    resStoreInDetail (row, type) {
      let val = {
        uid: row.uid
      };
      this.$cimList.goodsWarehousingOut
        .storeInDetail(val)
        .then(res => {
          if (res.code === 200) {
            if (row.billType == '3') {
              this.addReturn({
                type: type, // 1新建，2修改，3查看
                data: JSON.stringify(res.data),
                cinema: JSON.stringify(this.queryData)
              });
            } else if (row.billType == '5') {
              this.addInventory({
                type: type, // 1新建，2修改，3查看
                data: JSON.stringify(res.data),
                cinema: JSON.stringify(this.queryData)
              });
            }
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => { });
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
.goodsOut-style {
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