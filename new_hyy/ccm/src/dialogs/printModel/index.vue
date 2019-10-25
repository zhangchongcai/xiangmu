<template>
  <div class="ccm_dialog">
    <el-dialog title="选择打印票版" :visible.sync="framedialogVisible" width="32%" :close-on-click-modal="false" append-to-body>
      <div class="choose-body">
        <el-table :data="tableList.data" @row-click="showRow" height="308px" ref="tableListRef" highlight-current-row>
          <el-table-column label="选择" width="50" align="center">
            <template slot-scope="scope">
              <el-radio class="radio" v-model="selectedId" :label="scope.row.id">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <template v-for="(item,index) in tableList.title">
            <el-table-column :prop="item.prop" :label="item.lable" :key="index" show-overflow-tooltip>{{item.label}}</el-table-column>
          </template>
        </el-table>
        <div class="page-wrap">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.pageNo" :page-sizes="[10, 25, 50, 100]" :page-size="pageConfig.pageSize" layout="prev, pager, next, jumper" :total="pageConfig.total">
          </el-pagination>
        </div>
      </div>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirmData()">确 定</el-button>
        <el-button @click="closeDialog(false)">取 消</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
// import {getPrintModel} from "cmm/http/interface.js"
export default {
  props: {
    innerData: {
      type: Object,
      default: () => { },
      required: false
    }
  },
  data () {
    return {
      framedialogVisible: false,
      pageConfig: {
        total: 0,
        pageSize: 10,
        pageNo: 1
      },
      tableList: {
        data: [],
        title: [{
          lable: '票版名称',
          prop: 'name'
        }]
      },
      selectedId: '',
      selectedRows: null
    };
  },
  created () {
  },
  methods: {

    openDialog (id) {
      this.framedialogVisible = true;
      this.selectedId = id;
      this.searchData();
    },
    closeDialog () {
      this.framedialogVisible = false;
    },
    showRow (row) {
      // 赋值给radio
      let _this = this;
      this.selectedRows = row;
      _this.$nextTick(function () {
        this.selectedId = row.id;
      });
    },
    confirmData () {
      let _this = this;
      if (!this.selectedRows) {
        return this.$message({
          type: 'warning',
          message: '请选择一个票版！'
        });
      }
      _this.$emit('selecteTemplateCallBack', this.selectedRows);
      this.framedialogVisible = false;
    },
    // 查询
    searchFunc () {
      this.searchData();
    },
    selectable (row) {
      return row.approveStatus === 'WAIT_APPROVE';
    },

    searchData () {
      let _this = this;
      let params = {
        pageNo: this.pageConfig.pageNo,
        pageSize: this.pageConfig.pageSize
      };
      this.$ccmList.selectmodel(params).then(ret => {
        if (ret && ret.code === 200) {
          _this.pageConfig.total = ret.data.pageNum;
          _this.tableList.data = ret.data.list;
        } else {
        }
      }).catch(err => {
        console.log(err);
      });
    },
    // 当前页数数目改变
    handleSizeChange (valua) {
      this.pageConfig.pageSize = valua;
      this.searchData();
    },
    // 当前页改变
    handleCurrentChange (valua) {
      this.pageConfig.pageNo = valua;
      this.searchData();
    },
    submitForm (formName) {

    }

  }
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
  margin-top: 10px;
}
.page-wrap {
  text-align: center;
  padding: 5px 0 10px 0;
}
.choose-body {
  margin-top: 11px;
  border: 1px solid #e5e5e5;
  overflow-y: auto;
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
</style>
