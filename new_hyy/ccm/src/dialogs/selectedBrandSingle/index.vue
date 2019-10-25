<template>
  <div class="ccm_dialog">
    <el-dialog title="选择品牌" :visible.sync="framedialogVisible" width="640px" :close-on-click-modal="false">
      <div class="search-header">
        <el-form :inline="true" ref="ruleForm" size="small" class="film-search">
          <el-form-item label="品牌编码:">
            <el-input v-model="searchAdition.code"></el-input>
          </el-form-item>
          <el-form-item label="品牌名称：">
            <el-input v-model="searchAdition.name"></el-input>
          </el-form-item>
          <div style="text-align:right;padding-top:10px;">
            <el-button type="primary" @click="searchFunc">查询</el-button>

          </div>
        </el-form>
      </div>
      <div class="choose-body">
        <div class="ccm-table">
          <el-table :data="tableData" @row-click="showRow" ref="filmListRef" highlight-current-row>
            <el-table-column label="选择" width="50">
              <template slot-scope="scope">
                <el-radio v-model="selectedId" :label="scope.row.uid">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <template v-for="(item,index) in tableConfig">
              <el-table-column :key="index" v-if="item.hasTemplate" :prop="item.prop?item.prop:''" :label="item.label?item.label:''" :width="item.width?item.width:''">
                <div slot-scope="scope">
                  {{formatStatus(scope.row.stockStatus)}}
                </div>
              </el-table-column>
              <el-table-column :key="index" v-else :prop="item.prop?item.prop:''" :label="item.label?item.label:''" :width="item.width?item.width:''"></el-table-column> -->
            </template>
          </el-table>
        </div>
        <div class="page-wrap">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchAdition.page" :page-sizes="[10, 25, 50, 100]" :page-size="searchAdition.pageSize" layout="total,prev, pager, next, jumper" :total="searchAdition.total">
          </el-pagination>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="confirmData()" style="margin-right:17px;">确 定</el-button>
        <el-button @click="closeDialog(false)">取 消</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>

import { findBrandList } from 'ccmSrc/http/interface.js';

export default {
  data () {
    return {
      framedialogVisible: false,
      searchAdition: {
        pageSize: 10,
        size: 1,
        total: 0,
        code: '',
        name: ''
      },
      multipleSelection: [],
      rules: {},
      selectedId: '',
      selectedRow: null,
      tableData: [],
      tableConfig: [
        {
          prop: 'code',
          label: '品牌编码',
          width: ''
        },
        {
          prop: 'name',
          label: '品牌名称',
          width: ''
        }
      ]
    };
  },
  created () {
  },
  methods: {
    // 状态转换
    formatStatus (status) { },

    openDialog (flag, innerData) {
      this.framedialogVisible = true;
      this.selectedId = innerData;
      this.search();
    },
    closeDialog () {
      this.framedialogVisible = false;
    },
    showRow (row) {
      // 赋值给radio
      let _this = this;
      this.selectedRow = row;
      _this.selectedId = row.uid;
    },
    confirmData () {
      let _this = this;
      if (!this.selectedRow) {
        return this.framedialogVisible = false;
      }
      _this.$emit('selectedBrandSingleCallBack', this.selectedRow);
      this.framedialogVisible = false;
    },
    // 查询
    searchFunc () {
      this.searchAdition.page = 1;
      this.search();
    },
    search () {
      let postObj = this.searchAdition;
      findBrandList(postObj).then(res => {
        if (res && res.code === 200) {
          this.tableData = res.data.list;
          this.searchAdition.total = res.data.total;
        } else {
          this.$message.error('查询失败');
        }
      }).catch(err => {
        console.log(err);
      });
    },
    // 当前页数数目改变
    handleSizeChange (valua) {
      this.searchAdition.pageSize = valua;
      this.search();
    },
    // 当前页改变
    handleCurrentChange (valua) {
      this.searchAdition.page = valua;
      this.search();
    }

  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/dialogs.scss";
</style>
