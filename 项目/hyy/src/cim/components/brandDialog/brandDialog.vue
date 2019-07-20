<template>
  <el-dialog class="brand-dialog" width="40%" :title="title" :visible.sync="cinemalDialog" @open="openCallBack">
    <el-form
      :inline="true"
      :model="queryData"
      label-position="left"
      label-width="80px"
      label-suffix=":"
    >
      <el-form-item label="商品品牌">
        <el-input v-model="queryData.name" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-button @click="handleCinemalDialogQuery" type="primary"  class="query-btn">搜索</el-button>
    </el-form>
    <div class="table-box">
      <el-table
              ref="cinemalTable"
              :data="tableData"
              height="300"
              row-key="brandUid"
              v-loading="tableLoding"
              @selection-change="handleSelectionCinemal"
              stripe
              empty-text="暂无记录"
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
          v-for="item in cinemalTableColumn"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          :formatter="item.formatter"
        ></el-table-column>
      </el-table>
      <div class="page-wrap">
        <el-pagination
          :current-page="queryData.page"
          :page-size="queryData.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="cinemalTotal"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <span slot="footer">
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
      <el-button @click="handleDialog(false)">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    //是否多选
    title: {
      type: String,
      default: "选择商品品牌"
    },
    catUid: {
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
      cinemalDialog: false,
      //品牌弹窗查询数据
      queryData: {
        name: "",
        catUid: "",
        page: 1,
        pageSize: 10
      },
       
      cinemalTotal: 0,
      cinemalTableSelection: [],
      cinemalTableColumn: [
        {
          label: "品牌名称",
          key: "name"
        },
        {
          label: "备注",
          key: "remark"
        },
      ],
      tableLoding:false,
      tableData: [],
    };
  },
  created() {

  },
  mounted() {},
  methods: {
    init() {
      this.queryData.catUid = this.catUid;
      this.getMerCinemaList(this.queryData,"open");
    },
    openCallBack() {
      this.init();
    },
    handleDialog(flag) {
      this.cinemalDialog = flag;
    },
    // 获取品牌列表
    getMerCinemaList(param = {},type) {
      this.tableLoding = true;
      this.$cimList.headquartersGoods.merBandList(param).then(resData => {
        if (resData.code == 200) {
          if (type == "open") {
            this.$nextTick(() => {
              this.$refs.cinemalTable.clearSelection();
              if (this.dialogFeedbackData.length > 0) {
                this.dialogFeedbackData.forEach(row => {
                  this.$refs.cinemalTable.toggleRowSelection(row, true);
                });
              }
            })
          }
          this.tableData = resData.data.list.map(item => {
            item.brandUid = item.uid;
            return item;
          })
          this.cinemalTotal = resData.data.total;
        }
        this.tableLoding = false;
      }).catch(err => {
        this.tableLoding = false;
      });
    },
    //影院弹窗搜索
    handleCinemalDialogQuery() {
      this.getMerCinemaList(this.queryData);
    },

    //影院弹窗选择确定
    handleSubmit() {
      if(!this.multiple) {
        this.cinemalTableSelection = this.tableData.filter(item => {
          return item.uid == this.selectRadio
        });
      }
      this.$emit("onSumit", this.cinemalTableSelection);
      this.handleDialog(false);
    },
    //选中影院
    handleSelectionCinemal(rows) {
      this.cinemalTableSelection = rows;
    },
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.getMerCinemaList(this.queryData);
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.getMerCinemaList(this.queryData);
      console.log(`当前页: ${val}`);
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.brand-dialog {
  /deep/ .el-radio__label{
    display: none;
  }
}
</style>