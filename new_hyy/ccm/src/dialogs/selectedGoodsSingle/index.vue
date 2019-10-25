<template>
  <div class="ccm-single-dialog">
    <el-dialog title="选择商品名称" :visible.sync="framedialogVisible" top='5vh' width="65%" :close-on-click-modal="false">
      <div class="main">
        <div class="aside">
          <el-tree :data="categoryTrees" :props="defaultProps" node-key="uid" default-expand-all @node-click="handleaCtegoryTrees" :highlight-current=true>
            <span style="padding:0px" slot-scope="{ node, data }">
              <el-radio v-model="customTree" :label="data.uid">
                {{ node.label }}
              </el-radio>
            </span>
          </el-tree>
        </div>

        <div class="section" style="width:700px">
          <div class="search-header">
            <el-form :inline="true" ref="ruleForm" size="small" label-width="75px" class="film-search">
              <el-form-item label="商品名称：">
                <el-input v-model="searchAdition.merName"></el-input>
              </el-form-item>
              <el-form-item label="店内码：" style="margin-left:8px">
                <el-input v-model="searchAdition.merCode"></el-input>
              </el-form-item>
              <el-form-item label="SKU编码：">
                <el-input v-model="searchAdition.skuCode"></el-input>
              </el-form-item>
              <el-form-item label="速记代码：" style="margin-left: 8px;">
                <el-input v-model="searchAdition.shorthandCode"></el-input>
              </el-form-item>
              <el-button type="primary" @click="searchFunc" class="search-btn">查询</el-button>
            </el-form>
          </div>
          <div class="ccm-dialog-body">
            <el-table :data="tableData" @row-click="showRow" height="350px" ref="filmListRef" highlight-current-row>
              <el-table-column label="选择" width="50">
                <template slot-scope="scope">
                  <el-radio v-model="selectedId" :label="scope.row.skuUid?scope.row.skuUid:scope.row.uid">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <template v-for="(item,index) in tableConfig">
                <el-table-column :key="index" v-if="item.hasTemplate" :prop="item.prop?item.prop:''" :label="item.label?item.label:''" :width="item.width?item.width:''">
                </el-table-column>
                <el-table-column :key="index" v-else :prop="item.prop?item.prop:''" :label="item.label?item.label:''" :width="item.width?item.width:''"></el-table-column> -->
              </template>

            </el-table>
            <div class="page-wraps">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchAdition.page" :page-sizes="[10, 25, 50, 100]" :page-size="searchAdition.pageSize" layout="prev, pager, next, jumper" :total="searchAdition.total">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="confirmData()">确 定</el-button>
        <el-button @click="closeDialog(false)">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      framedialogVisible: false,
      searchAdition: {
        pageSize: 10,
        size: 1,
        total: 0,
        merName: '',
        merCode: '',
        classUid: '',
        canSale: '',
        merType: '',
        shorthandCode: '',
        skuCode: ''
      },
      multipleSelection: [],
      rules: {},
      selectedId: '',
      selectedRow: null,
      tableData: [],
      tableConfig: [{
        prop: 'merName',
        label: '商品名称',
        width: '',
        hasTemplate: true
      }, {
        prop: 'merCode',
        label: '商品编码',
        width: ''
      }, {
        label: 'SKU编码',
        prop: 'skuCode'
      },
      {
        label: '速记代码',
        prop: 'shorthandCode'
      }, {
        label: '商品规格',
        prop: 'merSpec',
        width: 80
      }, {
        label: '基本单位',
        prop: 'unitName',
        width: 80
      }
      ],

      // 分类树
      categoryTrees: [], // 商品分类树
      customTree: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    };
  },
  created () { },
  methods: {
    // 查询树
    handleaCtegoryTrees (data, callBack = () => { }) {
      if (data.uid == '0') {
        this.searchAdition.classUid = '';
      } else {
        this.searchAdition.classUid = data.uid;
        this.customTree = data.uid;
      }
      this.search();
    },
    // 请求商品分类树接口
    selectProductClass () {
      this.$ccmList.getCategoryTrees({ uid: '' }).then(res => {
        if (res.code === 200) {
          this.categoryTrees = [res.data];
        } else {
          this.error(res.msg);
        }
      })
        .catch(err => { });
    },
    openDialog (flalg, innerData) {
      this.framedialogVisible = true;
      this.search();
      this.selectProductClass();
      this.selectedId = innerData;
      console.log('子组件数据已选择id,', innerData);
    },
    closeDialog () {
      this.framedialogVisible = false;
    },
    showRow (row) {
      // 赋值给radio
      let _this = this;
      this.selectedRow = row;
      _this.selectedId = row.skuUid ? row.skuUid : row.uid;
      console.log(row.skuUid ? row.skuUid : row.uid);
    },
    confirmData () {
      let _this = this;
      let rowData = this.selectedRow ? this.selectedRow : '';
      _this.$emit('selectedGoodsSingleCallBack', rowData);
      _this.$emit('favorablePriceCallBack', rowData);
      _this.$emit('zengSongGoodsCallBack', rowData);
      _this.$emit('singleGoodsCallBack', rowData);
      _this.$emit('packageSelectedGoodsCallBack', rowData);
      _this.framedialogVisible = false;
    },
    // 查询
    searchFunc () {
      this.searchAdition.page = 1;
      this.search();
    },
    search () {
      let postObj = this.searchAdition;
      this.$ccmList.goodsDataQueryGoodsList(postObj).then(res => {
        if (res && res.code === 200) {
          this.tableData = res.data.list.map(item => {
            // 单品
            if (item.merType == 1) {
              item.merName = item.skuName;
            }
            // 合成品
            if (item.merType == 2) {
              if (item.skuName) {
                item.merName = item.merName + '-' + item.skuName;
              }
            }
            return item;
          });
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
.ccm-single-dialog {
  /deep/ .el-dialog__title {
    padding-bottom: 5px;
    width: 100%;
    display: inline-block;
    border-bottom: 1px solid #e5e5e5;
  }
  /deep/ .el-dialog__body {
    padding: 10px 20px;
  }
  .search-header {
    margin-left: 10px;
  }
  .el-form {
    position: relative;
    .search-btn {
      position: absolute;
      bottom: 18px;
      right: 0px;
    }
  }
  .main {
    height: 500px;
    display: flex;
    .aside {
      background: #f5f5f5;
      min-width: 200px;
      max-width: 200px;
      overflow: auto;
      /deep/ .el-tree {
        background: #f5f5f5;
        min-width: 100%;
        font-size: 14px;
        display: inline-block;
      }
      /deep/ .el-radio__label {
        padding: 0;
      }
      /deep/ .tree {
        overflow-y: auto;
        overflow-x: scroll;
        height: 500px;
      }
    }
    .section {
      width: 100%;
      .ccm-dialog-body {
        margin-left: 5px;
        border: 1px solid #e5e5e5;
      }
      .page-wraps {
        box-sizing: border-box;
        text-align: center;
        .el-pagination {
          padding-top: 10px;
          padding-bottom: 5px;
        }
      }
    }

    .selected-ul {
      .li-item {
        clear: both;
        display: block;
      }
    }
  }
  /deep/ .el-form-item__label {
    padding-left: 0px !important;
  }
}
</style>
