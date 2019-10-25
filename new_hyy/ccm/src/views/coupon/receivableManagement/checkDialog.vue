<template>
  <div class="my_dialog">
    <el-dialog title="查看收款记录" :close-on-click-modal="false" :visible.sync="Visible">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="销售申请单信息" name="baseInfo">
          <div class="base-info" v-if="formData">
            <div class="base-box">
              <div class="option">
                <label class="keyName">合同协议号:</label>
                <span class="keyValue">{{formData.contractCode}}</span>
              </div>
              <div class="option">
                <label class="keyName">销售申请人:</label>
                <span class="keyValue">{{formData.createUserName}}</span>
              </div>
              <div class="option">
                <label class="keyName">客户名称:</label>
                <span class="keyValue">{{formData.custName}}</span>
              </div>
              <div class="option">
                <label class="keyName">已收款金额:</label>
                <span class="keyValue">{{formData.receiptAmount}}</span>
              </div>
            </div>
            <div class="base-box">
              <div class="option">
                <label class="keyName">销售申请单号:</label>
                <span class="keyValue">{{formData.applyCode}}</span>
              </div>
              <div class="option">
                <label class="keyName">申请时间:</label>
                <span class="keyValue">{{formData.dateOfApplication}}</span>
              </div>
              <div class="option">
                <label class="keyName">合同总金额:</label>
                <span class="keyValue">{{formData.totalAmount}}</span>
              </div>
              <div class="option">
                <label class="keyName">未收款金额:</label>
                <span class="keyValue">{{formData.uncollectedAmount}}</span>
              </div>
            </div>
          </div>
          <div class="table">
            <el-table :data="tableData">
              <template v-for="(item,index) in tableConfig">
                <el-table-column :key="index" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
              </template>
            </el-table>
          </div>
          <!-- 分页 -->
          <section class="pagination-section flex-base flex-center pageStyle" v-if="pageConfig.total>10">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.pageNo" :page-sizes="pageConfig.pageSizes" :page-size="pageConfig.pageSize" background layout="total, prev, pager, next, jumper, sizes" :total="pageConfig.total">
            </el-pagination>
          </section>
        </el-collapse-item>
        <!-- <el-collapse-item title="本次收款情况" name="state"> -->

        <!-- </el-collapse-item> -->
      </el-collapse>
      <div style="text-align:center">
        <el-button plain @click="Visible=false">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    // 回选数据
    formData: {}
  },
  data () {
    return {
      tableConfig: [{
        label: '收款单编号',
        prop: 'receiptCode'
      }, {
        label: '收款金额（元）',
        prop: 'receiptAmount',
        width: '110'
      }, {
        label: '支付方式',
        prop: 'payTypeName'
      }, {
        label: '收款日期',
        prop: 'receiptDate'
      }, {
        label: '制单日期',
        prop: 'createTime'
      }, {
        label: '制单人',
        prop: 'createUserName'
      }, {
        label: '下次回款日期',
        prop: 'nextReceiptDate',
        hasTemplate: true
      }
      ],
      activeNames: ['baseInfo'],
      tableData: [],
      Visible: false,
      pageConfig: {
        pageNo: 1,
        pageSize: 10,
        total: null
      }
    };
  },
  created () { },
  methods: {
    search (id) {
      console.log('查询', this.formData);
      let params = {
        id: id || this.formData.receivableId ? this.formData.receivableId : '',
        pageNo: this.pageConfig.pageNo,
        pageSize: this.pageConfig.pageSize
      };
      this.$ccmList.receivableSelectItem(params).then(res => {
        console.log(res);
        this.tableData = res.data.list;
        this.pageConfig.total = res.data.pageNum;
      });
    },
    // 每页大小
    handleSizeChange (value) {
      this.pageConfig.pageSize = value;
      this.search();
    },
    // 跳转页码数
    handleCurrentChange (value) {
      this.pageConfig.pageNo = value;
      this.search();
    },
    openDialg (id) {
      this.Visible = true;
      this.search(id);
    }
  },
  mounted () { }
};
</script>

<style lang="scss" scoped>
.pagination-section {
  margin-top: 10px;
}
.option {
  height: 40px;
}
.base-info {
  display: flex;
  margin-left: 20px;
  .base-box {
    flex: 1;
    .keyName,
    .keyValue {
      color: #666;
      font-size: 12px;
    }
  }
}
/deep/ .el-collapse-item__header::after {
  display: none;
}
/deep/ .el-collapse-item__header {
  display: flex;
  justify-content: flex-end;
  flex-direction: row-reverse;
}
/deep/ .el-collapse-item__arrow {
  margin: 8px 8px 8px 0;
}
/deep/ .el-dialog__body {
  padding-top: 0px;
}
/deep/ .el-dialog__header::after {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  background: #e5e5e5;
}
/deep/ .el-collapse {
  padding-bottom: 0px;
}
/deep/ .el-collapse-item__wrap {
  padding-top: 0;
}
/deep/ .el-collapse-item:last-child {
  margin: 0;
}
</style>
