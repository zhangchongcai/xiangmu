<template>
  <div>
    <el-dialog class="purchase-note-dialog" width="1100px" title="选择采购单" :visible.sync="supplierDialog"
               @open="openCallBack">
      <el-form
              :inline="true"
              :model="queryData"
              label-position="left"
              label-suffix=":"
      >
        <el-form-item label="采购单号">
          <el-input v-model="queryData.billCode" placeholder="请输入采购单编码"></el-input>
        </el-form-item>
        <el-form-item label="采购单名称">
          <el-input v-model="queryData.supName" placeholder="请输入采购单名称"></el-input>
        </el-form-item>
        <el-form-item label="制单日期">
          <el-date-picker
                  class="basic-input"
                  v-model="queryData.billTimeTotal"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-button @click="onQuery" type="primary" class="query-btn">搜索</el-button>
      </el-form>
      <div class="table-box">
        <el-table
                ref="supplierTable"
                :data="tableData"
                height="300"
                row-key="uid"
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
          <el-pagination
                  background
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
            class="purchase-note-dialog"
            title="查看采购单"
            :visible.sync="checkPurchaseNoteDialog"
            width="1100px">
      <el-form
              :inline="true"
              ref="ruleForm"
              label-position="left"
              label-suffix="："
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="采购单号">
              <span>{{purchaseNoteDetail.billCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购门店">
              <span>{{purchaseNoteDetail.cinemaName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="协议名称">
              <span v-if="purchaseNoteDetail.agreementUid">
                {{purchaseNoteDetail.agreementName}}
              </span>
              <span v-else>
                未启用
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="供应商">
              <span>{{purchaseNoteDetail.supName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="制单日期">
              <span>{{purchaseNoteDetail.billTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="制单员">
              <span>{{purchaseNoteDetail.billUserName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
        <el-table :data="purchaseNoteDetail.purchaseBillDetailVoList" stripe>
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
      default: "选择采购单"
    },
    //门店id
    cinemaUid: {
      type: [String, Number],
      default: ""
    },
    //审核状态
    approvalStatus: {
      type: [String, Number],
      default: ""
    },
    //是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 回选数据
    dialogFeedbackData: {
      type: [Array],
      default: () => []
    },
  },
  data() {
    return {
      selectRadio:'',
      supplierDialog: false,
      //采购单弹窗查询数据
      queryData: {
        billCode: "",
        supplierName: "",
        billTimeTotal: [],
        beginTime: "", //制单开始时间
        endTime: "", //制单结束时间
        approvalStatus: "2", //审核状态
        conditions: [2,3], //单据状态
        page: 1,
        pageSize: 10
      },
      total: 0,
      tableSelection: [],
      tableColumn: [
        {
          label: "采购单号",
          key: "billCode"
        },
        {
          label: "采购单名称",
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
      checkPurchaseNoteDialog: [],
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
          label: "采购数量",
          key: "purCount",
        },
        {
          label: "采购成本(元)",
          key: "purPrice",
        },
        {
          label: "税率(%)",
          key: "taxRate",
        },
        {
          label: "含税金额(元)",
          key: "amount",
        },
        {
          label: "不含税采购成本(元)",
          key: "excludingTaxCost"
        },
        {
          label: "不含税金额(元)",
          key: "excludingTaxAmount"
        },
        {
          label: "税额(元)",
          key: "taxAmount"
        }
      ]
    };
  },
  mounted() {

  },
  methods: {
    // 初始化
    init() {
      this.onQuery();
    },
    //弹窗打开回调
    openCallBack() {
      this.init();
    },
    // 查询
    onQuery() {
      // console.log(this.queryData);
      this.queryData.cinemaUid = this.cinemaUid;
      this.queryData.approvalStatus = this.approvalStatus;
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
      this.tableLoding = true;
      this.$cimList.procurement.purchaseList(param).then(resData => {
        if (resData.code == 200) {
          this.tableData = resData.data.list;
          this.total = resData.data.total;
        }
        this.tableLoding = false;
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
    //选中采购单
    handleSelectionsSupplier(rows) {
      // console.log(rows);
      this.tableSelection = rows;
    },
    handleOperateEvent(type, row) {
      switch (type) {
        case "1":
          // 查看
          this.checkPurchaseNoteDialog = true;
          this.purchaseGet({billCode: row.billCode});
          break;
      }
    },
    // 查看采购单
    purchaseGet(param) {
      this.$cimList.procurement.purchaseGet(param).then(resData => {
        if (resData.code == 200) {
          this.purchaseNoteDetail = resData.data;
        } else {

        }
        this.isProceedUpdate = false;
      }).catch(() => {

      })
    },
    jumpPage(param = {}) {
      this.$router.push({
        path: "/retail/procurement/purchaseNote/common",
        query: param,
      });
    },

  },
  computed: {
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
          result = "部分入库";
          break;
        case 4:
          result = "全部入库";
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

<style lang="scss" scoped>
  .purchase-note-dialog {
    /deep/ .el-radio__label{
      display: none;
    }
   .query-btn{
     margin-top: 3px;
   }
    .el-dialog__body {
      .el-form-item {
        margin-bottom: 10px;
      }
    }
}
</style>