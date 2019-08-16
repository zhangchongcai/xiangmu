<template>
  <div id="purchase-storage-dialog-id">
    <el-dialog class="purchase-storage-dialog" width="1000px" title="选择采购入库单" :visible.sync="supplierDialog"
               @open="openCallBack">
      <el-form
              :inline="true"
              :model="queryData"
              label-position="left"
              label-suffix=":"
      >
        <el-form-item label="采购单号">
          <el-input v-model="queryData.billCode" placeholder="请输入供应商编码"></el-input>
        </el-form-item>
        <el-form-item label="供应商名称">
          <el-input v-model="queryData.supName" placeholder="请输入供应商名称"></el-input>
        </el-form-item>
        <el-form-item label="制单日期">
          <el-date-picker
                  v-model="queryData.billTimeTotal"
                  type="daterange"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-button @click="onQuery" type="primary" class="query-btn">搜索</el-button>
      </el-form>
      <div class="table-box">
        <el-table
                ref="supplierTable"
                :data="tableData"
                row-key="billCode"
                height="400"
                v-loading="tableLoding"
                @selection-change="handleSelectionsSupplier"
                stripe
        >
          <el-table-column type="selection" width="40" reserve-selection v-if="multiple"></el-table-column>
          <el-table-column width="40" v-else>
            <template slot-scope="scope">
              <el-radio
                      v-model="selectRadio"
                      :label="scope.row.uid"></el-radio>
            </template>
          </el-table-column>
          <el-table-column
                  v-for="item in tableColumn"
                  :key="item.key"
                  :prop="item.key"
                  :label="item.label"
                  :formatter="item.formatter"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click.stop="handleOperateEvent('1', row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrap">
          <el-pagination background
                         @current-change="handleCurrentChange"
                         :current-page="queryData.currentPage"
                         :page-size="queryData.pageSize"
                         :total="total"
                         layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </div>
      <span slot="footer">
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
       <el-button @click="handleDialog(false)">取 消</el-button>
    </span>
    </el-dialog>
    <el-dialog
            class="purchase-storage-dialog"
            title="查看采购单"
            :visible.sync="checkPurchaseNoteDialog"
            width="1000px">
      <el-form
              :inline="true"
              ref="ruleForm"
              label-position="left"
              label-suffix="："
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="采购入库单号">
              <span>{{purchaseNoteDetail.billCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入库门店">
              <span>{{purchaseNoteDetail.cinemaName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商名称">
              <span>{{purchaseNoteDetail.supName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="入库类型">
              <span>{{billTypeText}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <span slot="label">
                <div>{{purchaseNoteDetail.storeType==1 ? '入库仓库：':'入库货架：'}}</div>
              </span>
              <span>{{purchaseNoteDetail.storehouseName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="制单日期">
              <span>{{purchaseNoteDetail.billTime}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="制单员">
              <span>{{purchaseNoteDetail.billUserName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单据状态">
              <span>{{formatStatus}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核状态">
              <span>{{approvalStart}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-table :data="purchaseNoteDetail.detailVoList" stripe>
          <el-table-column
                  v-for="item in purchaseNoteDetailTableColumn"
                  :key="item.key"
                  :prop="item.key"
                  :label="item.label"
                  :formatter="item.formatter"
          >
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="checkPurchaseNoteDialog = false">关 闭</el-button>
              </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  props: {
    //标题
    title: {
      type: String,
      default: "选择供应商"
    },
    //门店id
    cinemaUid: {
      type: [String, Number],
      default: ""
    },
    //门店name
    cinemaName: {
      type: [String, Number],
      default: ""
    },
    //是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    //审核状态
    approvalStatus: {
      type: [String, Number],
      default: ""
    },
    // 单据类型
    billTypeList: {
      type: [Array],
      default: () => []
    }, // 回选数据
    dialogFeedbackData: {
      type: [Array],
      default: () => []
    },
  },
  data() {
    return {
      selectRadio:'',
      supplierDialog: false,
      //供应商弹窗查询数据
      queryData: {
        billCode: "",
        supplierName: "",
        billTypeList:[1,2,3],
        billTimeTotal: [],
        cinemaUid:'',
        cinemaName: "",
        beginTime: "", //制单开始时间
        endTime: "", //制单结束时间
        page: 1,
        pageSize: 10
      },
      supplierDialog: false, //搜索条件选择供应商弹窗
      total: 0,
      tableSelection: [],
      tableColumn: [
        {
          label: "采购单号",
          key: "billCode"
        },
        {
          label: "供应商名称",
          key: "supName"
        },
        {
          label: "制单日期",
          key: "billTime"
        },
        {
          label: "制单员",
          key: "billUserName"
        }
      ],
      tableData: [],
      tableLoding: false,
      checkPurchaseNoteDialog: false,
      purchaseNoteDetail: {},
      purchaseNoteDetailTableColumn: [
        {
          label: "商品名称",
          key: "skuName"
        },
        {
          label: "SKU编码",
          key: "skuCode"
        },
        {
          label: "商品规格",
          key: "merSpec"
        },
        {
          label: "采购单位",
          key: "purUnitName",
        },
        {
          label: "入库数量",
          key: "storeinCount",
        },
        {
          label: "采购成本(元)",
          key: "purPrice"
        }
      ]
    };
  },
  mounted() {

  },
  methods: {
    openCallBack() {
      this.queryData.billTypeList =this.billTypeList;
      this.queryData.approvalStatus =this.approvalStatus;
      this.queryData.cinemaUid =this.cinemaUid;
      this.queryData.cinemaName =this.cinemaName;
      this.init();
    },
    // 初始化
    init() {
      this.onQuery();
      // if (!this.multiple) {
      //   setTimeout(() => {
      //     let ele = document.querySelector('.purchase-storage-dialog .has-gutter .cell');
      //     ele.style.display = "none"
      //   }, 100)
      // }
    },
    // 查询
    onQuery() {
      // console.log(this.queryData);
      if (this.queryData.billTimeTotal) {
        this.queryData.beginTime = this.queryData.billTimeTotal[0];
        this.queryData.endTime = this.queryData.billTimeTotal[1];
      } else {
        this.queryData.beginTime = "";
        this.queryData.endTime = "";
      }
      this.purchaseList(this.queryData);
    },
    // 查询
    purchaseList(param) {
      this.tableLoding =true;
      this.$cimList.procurement.storeBillQueryStoreIn(param).then(resData => {
        if (resData.code == 200) {
          if (this.dialogFeedbackData.length > 0) {
            this.dialogFeedbackData.forEach(row => {
              this.$refs.supplierTable.toggleRowSelection(row, true);
            });
          }
          this.tableData = resData.data.list;
          this.total = resData.data.total;
        }
        this.tableLoding =false;
      }).catch(err => {
        this.tableLoding = false;
      });
    },
    handleDialog(flag) {
      this.supplierDialog = flag;
    },
    handleSubmit() {
      if(!this.multiple) {
        this.tableSelection = this.tableData.filter(item => {
          return item.uid == this.selectRadio
        });
      }
      this.$emit("onSumit", this.tableSelection);
      this.handleDialog(false);
    },
    handleOperateEvent(type, row) {
      switch (type) {
        case "1":
          // 查看
          this.checkPurchaseNoteDialog = true;
          this.storeBillGetStoreIn({uid: row.uid});
          break;
      }
    },
    // 查看
    storeBillGetStoreIn(param) {
      this.$cimList.procurement.storeBillGetStoreIn(param).then(resData => {
        if (resData.code == 200) {
          this.purchaseNoteDetail = resData.data;
        }
      });
    },
    jumpPage(param = {}) {
      this.$router.push({
        path: "/retail/procurement/purchaseStorage/common",
        query: param,
      });
    },
    //选中供应商
    handleSelectionsSupplier(rows) {
      // console.log(rows);
      this.tableSelection = rows;
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.onQuery();
      // console.log(`当前页: ${val}`);
    }
  },
  computed: {
    billTypeText() {
      // debugger
      switch (this.purchaseNoteDetail.billType) {
        case 1:
          return "采购入库";
          break;
        case 2:
          return "赠送入库";
          break;
        case 3:
          return "直接入库";
          break;
      }
    },
    formatStatus() {
      let result = "";
      switch (this.purchaseNoteDetail.status) {
        case 1:
          result = "未提交";
          break;
        case 2:
          result = "已提交";
          break;
        case 3:
          result = "已入库";
          break;
      }
      return result;
    },

    approvalStart() {
      let result = "";
      switch (this.purchaseNoteDetail.approvalStatus) {
        case 0:
          result = "未审核";
          break;
        case 1:
          result = "待审核";
          break;
        case 2:
          result = "审核通过";
          break;
        case 3:
          result = "审核不通过";
          break;
        case 4:
          result = "无需审核";
          break;
      }
      return result;
    },
  }
};
</script>

<style lang="scss">
  #purchase-storage-dialog-id {
    .purchase-storage-dialog {
      .el-radio__label{
        display: none;
      }
      .query-btn {
        margin-top: 3px;
      }
      .el-dialog__body {
        .el-form-item {
          margin-bottom: 10px;
        }
        .el-range-editor.el-input__inner {
          width: 250px;
        }
      }
    }
  }

</style>