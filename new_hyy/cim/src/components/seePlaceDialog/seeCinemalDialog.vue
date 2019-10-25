<template>
  <div id="newselect">
    <el-dialog class="good-select-dialog" width="576px" :title="title" :visible="dialogVisible" @close="closeCallBack" @open="openCallBack">
      <div v-if="firstDialog ==true">
        <el-row>
          <el-col>
            <div class="query-box">
              <el-form :inline="true" :model="queryData" label-position="right" label-suffix=":">
                <div>
                  <el-form-item label="销售地点名称">
                    <el-input placeholder class="change-dialog-inp" v-model="queryData.name"></el-input>
                  </el-form-item>
                  <el-button class="search" type="primary" @click="onQuery">搜索</el-button>
                </div>
              </el-form>
            </div>
            <div>
              <el-row>
                <el-col>
                  <div class="table-box">
                    <el-table ref="materialTable" :data="this.tableData.slice((queryData.page-1)*queryData.pageSize,queryData.page*queryData.pageSize)" height="450" v-loading="tableLoding">
                      <el-table-column v-for="item in tableColumn" :key="item.key" :prop="item.key" :label="item.label" :formatter="item.formatter"></el-table-column>
                    </el-table>
                    <div class="page-wrap">
                      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryData.page" :page-size="queryData.pageSize" layout="total, prev, pager, next,jumper" :total="this.total"></el-pagination>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer">
        <el-button @click="handleCancel">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
// combBankGoodsDialog
// import combbankgoodsDialog from "cim/components/combBankGoodsDialog/cinemaDialog.vue";
export default {
  props: {
    title: {
      type: String,
      default: '查看销售地点'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 商品类型 1单品， 2合成品,3服务商品，4套餐，5原材料
    merType: {
      type: [String, Number],
      default: ''
    },
    // 门店id
    cinemaUid: {
      type: [String, Number],
      default: ''
    },
    // 回选数据
    dialogFeedbackData: {
      type: [Array],
      default: () => []
    },
    // needData: {
    //   type: [Object],
    //   default: () => {}
    // },
    needData: {
      type: [String, Number],
      default: ''
    },
    // 自动关闭
    autoClose: {
      type: Boolean,
      default: true
    },
    // 表头
    tableColumn: {
      type: [Array],
      default: () => [
        {
          label: '销售地点名称',
          key: 'placeName'
        },
        {
          label: '编码',
          key: 'placeCode'
        }
      ]
    }
  },
  data () {
    return {
      // 查找商品分类参数
      newrow: {},
      firstDialog: true,
      // 查询数据
      queryData: {
        pageSize: 10,
        page: 1,
        // 商品条码
        barCode: '',
        // 品牌
        brandName: '',
        // 类目code
        classCode: '',
        // 商品名称
        name: ''
      },
      customTree: '',
      categoryTrees: [], // 商品分类树
      defaultProps: {
        children: 'subTree',
        label: 'name'
      },
      tableData: [],
      newtableData: [],
      tableLoding: false,
      total: 0,
      isOpen: true
    };
  },
  mounted () {

  },

  methods: {
    // 弹窗打开回调
    openCallBack () {
      this.queryData.classCode = '';
      this.init();
      // this.onQuery("open");
    },
    init () {
      this.firstDialog = true;
      console.log(this.needData);
      this.queryData.name = '';
      this.tableData = JSON.parse(this.needData);
      this.total = JSON.parse(this.needData) == null ? 0 : JSON.parse(this.needData).length;
      // this.adjBillCinMerGet(this.needData)
    },
    selectCinemalDialog (row, index) {
      this.newrow = {};
      this.newrow = row;
      this.newrow.newrowId = index;
      this.$refs.myCinemalDialog.handleDialog(true);
    },
    // 查看调价单
    adjBillCinMerGet (param) {
      this.$cimList.priceBill.adjustBillQueryAdjustInfo(param).then(resData => {
        if (resData.code == 200) {
          this.tableData = resData.data.cinemaUids == null ? [] : resData.data.cinemaUids;
          // this.tableData = resData.data.cinemaUids.slice((queryData.page-1)*queryData.pagesize,queryData.page*queryData.pagesize);
          // console.log(this.tableData)
          // debugger
          this.total = resData.data.cinemaUids == null ? 0 : resData.data.cinemaUids.length;
        } else {
          this.$message({
            message: resData.msg
          });
        }
      }).catch(() => {

      });
    },
    // 查询
    onQuery (type) {
      if (this.queryData.name == '' || this.queryData.name == null) {
        this.tableData = JSON.parse(this.needData);
        this.total = JSON.parse(this.needData) == null ? 0 : JSON.parse(this.needData).length;
      } else {
        this.tableData = this.tableData == null ? [] : this.tableData;
        this.total = 1;
        let queryVal = this.queryData.name;
        let newArr = [];
        if (this.tableData.length > 0) {
          this.tableData.forEach((val, index, arr) => {
            if (val.placeName == queryVal) {
              newArr.push(val);
            }
          });
        }
        this.tableData = newArr;
      }
    },
    // 取消弹窗
    closeCallBack () {
      this.$emit('update:dialogVisible', false);
    },
    // 取消弹窗
    handleCancel () {
      this.closeCallBack();
    },
    // 分页
    handleSizeChange (val) {
      this.queryData.pageSize = val;
      // this.goodsDataQueryGoodsList();
      console.log(`每页 ${val} 条`);
    },
    // 分页
    handleCurrentChange (val) {
      this.queryData.page = val;
      // this.goodsDataQueryGoodsList();
      console.log(`当前页: ${val}`);
    }
  },
  computed: {

  },
  watch: {

  },
  components: {
    // combbankgoodsDialog
  }
};
</script>


<style lang="scss">
#newselect {
  .el-table {
    th,
    td:first-of-type {
      border-left: none;
    }
    th,
    td:last-of-type {
      border-right: none !important;
    }
  }
  .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
    .query-box {
      .el-input {
        width: 184px;
      }
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .table-box {
    margin-top: 10px;
  }
  .good-trees-box {
    overflow: scroll;
    .el-tree {
      height: 594px;
    }
    .el-radio {
      margin-right: 0;
    }
    .el-radio__label {
      display: none;
    }
  }

  .el-form-item__content {
    width: 184px;
  }
  .page-wrap {
    padding: 10px;
  }
  .search {
    margin-top: 5px;
    float: right;
  }

  .empty-box {
    padding: 0 10px 10px 10px;
    margin-top: 10px;
    border: 1px solid #e5e5e5;
    .selected-content {
      padding: 10px 0;
    }
    .el-icon-close {
      cursor: pointer;
      font-size: 12px;
    }
    .title {
      width: 85%;
      font-size: 12px;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*不换行*/
      text-overflow: ellipsis; /*超出部分文字以...显示*/
    }
    .el-button {
      padding-left: 0;
      padding-right: 0;
    }

    .empty-content {
      height: 458px;

      overflow-y: auto;
      border-top: 1px solid #f5f5f5;
      padding: 5px 0;
      li {
        padding: 6px 0;
      }
    }
  }
  .el-table .el-input__icon {
    line-height: 25px;
  }
}
</style>
