<template>
  <div>
    <el-dialog class="purchase-note-dialog" width="600" title="选择调拨申请单" :visible.sync="supplierDialog" @open="openCallBack">
      <el-form :inline="true" :model="queryData" label-position="left" label-width="100px" label-suffix=":">
        <el-form-item label="调拨单号">
          <el-input v-model="queryData.billCode" placeholder="请输入调拨单号"></el-input>
        </el-form-item>
        <el-button @click="onQuery" type="primary" class="query-btn">搜索</el-button>
      </el-form>
      <div class="table-box">
        <el-table ref="supplierTable" :data="tableData" height="300" row-key="uid" v-loading="tableLoding" @selection-change="handleSelectionsSupplier" stripe>
          <el-table-column type="selection" width="40" reserve-selection v-if="multiple"></el-table-column>
          <el-table-column width="40" v-else>
            <template slot-scope="scope">
              <el-radio v-model="selectRadio" :label="scope.row.uid"></el-radio>
            </template>
          </el-table-column>
          <el-table-column v-for="item in tableColumn" :key="item.key" :prop="item.key" :label="item.label" :width="item.width" :formatter="item.formatter"></el-table-column>
          <el-table-column label="操作" style="width:180px;">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click.stop="seeMore(row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrap">
          <el-pagination background :current-page="queryData.currentPage" :page-size="queryData.pageSize" :total="total" layout="total, prev, pager, next, jumper"></el-pagination>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="handleDialog(false)">取 消</el-button>
      </span>
    </el-dialog>
    <allocation-dialogsee :dialogVisible.sync="dialogVisibleseecinema" :needData="allUid"></allocation-dialogsee>
  </div>
</template>

<script>
import allocationDialogsee from 'cimSrc/components/allocationDialogsee/allocationDialog.vue';
export default {
  props: {
    // 标题
    title: {
      type: String,
      default: '选择调拨申请单'
    },
    // 门店id
    inCinemaUid: {
      type: [String, Number],
      default: ''
    },
    // 门店id
    outCinemaUid: {
      type: [String, Number],
      default: ''
    },
    // 状态
    status: {
      type: [String, Number],
      default: ''
    },
    // 审核状态
    approvalStatus: {
      type: [String, Number],
      default: ''
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 回选数据
    dialogFeedbackData: {
      type: [Array],
      default: () => []
    }
  },
  data () {
    return {
      allUid: '',
      dialogVisibleseecinema: false,
      selectRadio: '',
      supplierDialog: false,
      // 采购单弹窗查询数据
      queryData: {
        status: '',
        approvalStatus: '',
        beginTime: '',
        billCode: '',
        billTimeTotal: null,
        endTime: '',
        inCinemaName: '',
        inCinemaUid: '',
        outCinemaName: '',
        outCinemaUid: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      tableSelection: [],
      tableColumn: [
        {
          label: '调拨单号',
          key: 'billCode',
          width: '170'

        },
        {
          label: '调入门店',
          key: 'inCinemaName'
        },
        {
          label: '调出门店',
          key: 'outCinemaName'
        },
        {
          label: '制单日期',
          key: 'billTime',
          width: '150'
        },
        {
          label: '制单员',
          key: 'billUserName'
        }
      ],
      tableData: [],
      tableLoding: false
    };
  },
  mounted () {

  },
  components: {
    allocationDialogsee
  },
  methods: {
    // 初始化
    init () {
      this.onQuery();
    },
    // 弹窗打开回调
    openCallBack () {
      this.init();
    },
    // 查询
    onQuery () {
      this.queryData.inCinemaUid = this.inCinemaUid;
      this.queryData.outCinemaUid = this.outCinemaUid;
      this.queryData.status = this.status;
      this.queryData.approvalStatus = this.approvalStatus;
      if (this.queryData.billTimeTotal) {
        this.queryData.beginTime = this.queryData.billTimeTotal[0];
        this.queryData.endTime = this.queryData.billTimeTotal[1];
      } else {
        this.queryData.beginTime = '';
        this.queryData.endTime = '';
      }
      this.purchaseList(this.queryData);
    },
    // 查询
    purchaseList (param) {
      this.tableLoding = true;
      this.$cimList.goodsWarehousingApply
        .allotBillList(param).then(resData => {
          if (resData.code == 200) {
            this.tableData = resData.data.list;
            this.total = resData.data.total;
          }
          this.tableLoding = false;
        }).catch(err => {
          this.tableLoding = false;
        });
    },
    handleDialog (flag) {
      this.supplierDialog = flag;
    },
    handleSubmit () {
      if (!this.multiple) {
        this.tableSelection = this.tableData.filter(item => {
          return item.uid == this.selectRadio;
        });
      }
      this.$emit('onSumit', this.tableSelection);
      this.handleDialog(false);
    },
    // 查看调拨单
    seeMore (row) {
      this.allUid = row.uid;
      this.dialogVisibleseecinema = true;
    },
    // 选中采购单
    handleSelectionsSupplier (rows) {
      console.log(rows);
      this.tableSelection = rows;
    }
  }
};
</script>

<style lang="scss" scoped>
.purchase-note-dialog {
  /deep/ .el-radio__label {
    display: none;
  }
}
</style>