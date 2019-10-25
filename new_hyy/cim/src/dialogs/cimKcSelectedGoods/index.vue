<template>
  <el-dialog class="good-select-dialog" width="1016px" :title="title" :visible="dialogVisible" @close="closeCallBack" @open="openCallBack">
    <div>
      <el-row>
        <el-col :span="5">
          <div class="good-trees-box">
            <el-tree :data="categoryTrees" icon-class="iconfont icon-neiye-zhankaijiantou" :props="defaultProps" highlight-current node-key="uid" :default-expanded-keys="defaultExpanded" @node-click="handleaCtegoryTrees">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <el-radio v-model="customTree" :label="data.uid"></el-radio>
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
        </el-col>
        <el-col :span="19">
          <div class="query-box">
            <el-form :inline="true" :model="queryData" label-position="right" label-suffix=":">
              <div>
                <el-form-item label="商品名称">
                  <el-input placeholder class="change-dialog-inp" v-model="queryData.name"></el-input>
                </el-form-item>
                <el-form-item label="商品编码">
                  <el-input placeholder class="change-dialog-inp" v-model="queryData.code"></el-input>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="SKU编码">
                  <el-input placeholder class="change-dialog-inp" v-model="queryData.skuCode"></el-input>
                </el-form-item>
                <el-form-item label="速记代码">
                  <el-input placeholder class="change-dialog-inp" v-model="queryData.shorthandCode"></el-input>
                </el-form-item>
                <el-button class="search" type="primary" @click="onQuery">搜索</el-button>
              </div>
            </el-form>
          </div>
          <div>
            <el-row>
              <el-col :span="19">
                <div class="table-box">
                  <el-table ref="materialTable" :data="tableData" height="450" v-loading="tableLoding" :row-key="getRowKey" @selection-change="handleSelectionMaterial">
                    <el-table-column type="selection" width="40" reserve-selection :selectable="isDisabled" disabled="true"></el-table-column>
                    <el-table-column v-for="item in tableColumn" :key="item.key" :prop="item.key" :label="item.label" :formatter="item.formatter"></el-table-column>
                  </el-table>
                  <div class="page-wrap">
                    <el-pagination background @current-change="handleCurrentChange" :current-page="queryData.currentPage" :page-size="queryData.pageSize" layout="total, prev, pager, next,jumper" :total="this.total"></el-pagination>
                  </div>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="empty-box">
                  <div class="clearfix">
                    <span class="selected-content left">已选内容</span>
                    <el-button type="text" class="right empty-btn" @click="handleEmptyMaterials">清 空</el-button>
                  </div>
                  <ul class="empty-content">
                    <li v-for="(item) in selectedgoods" :key="item.skuUid || item.merUid || item.uid || item.merCode" class="clearfix">
                      <span class="left title">{{item.merName || item.name}}</span>
                      <i class="el-icon-close right" @click="deleteSelected(item,false)"></i>
                    </li>
                  </ul>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <span slot="footer">
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '选择商品'
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
    Qdata: {
      type: [Object],
      default: () => []
    },
    // 回选数据
    dialogFeedbackData: {
      type: [Array],
      default: () => []
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
          label: '商品名称',
          key: 'merName'
        },
        {
          label: '商品编码',
          key: 'merCode'
        },
        {
          label: 'SKU编码',
          key: 'skuCode'
        },
        {
          label: '速记代码',
          key: 'shorthandCode'
        },
        {
          label: '商品规格',
          key: 'attrValue'
        },
        {
          label: '基本单位',
          key: 'unitName'
        }
      ]
    }
  },
  data () {
    return {
      // 查询数据
      queryData: {
        cinemaUid: '',
        code: '',
        merClassUid: '',
        name: '',
        outStoreType: '',
        outStorehouseUid: '',
        shorthandCode: '',
        skuCode: '',
        page: 1,
        pageSize: 10
      },
      customTree: '',
      categoryTrees: [], // 商品分类树
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      tableData: [],
      tableLoding: false,
      selectedgoods: [],
      tempSelectedgoods: [],
      total: 0,
      isOpen: true
    };
  },
  mounted () {

  },

  methods: {
    // 弹窗打开回调
    openCallBack () {
      this.queryData.classUid = '';
      this.queryData.cinemaUid = this.Qdata.cinemaUid;
      this.queryData.outStoreType = this.Qdata.outStoreType;
      this.queryData.outStorehouseUid = this.Qdata.outStorehouseUid;
      this.init();
      this.onQuery('open');
      console.log(this.dialogFeedbackData, 'this.dialogFeedbackData');
    },
    init () {
      this.selectProductClass({ uid: '' });
    },
    // 查询
    onQuery (type) {
      this.queryData.merType = this.merType;
      if (this.cinemaUid) {
        this.queryData.cinemaUid = this.cinemaUid;
        this.goodsDataQueryCinemaGoodsList(this.queryData, type);
      } else {
        this.goodsDataQueryGoodsList(this.queryData, type);
      }
    },
    // 查询树
    handleaCtegoryTrees (data) {
      if (data.uid == '0') {
        this.queryData.classUid = '';
        this.queryData.merClassUid = '';
      } else {
        this.queryData.classUid = data.uid;
        this.queryData.merClassUid = data.uid;
      }

      if (this.cinemaUid) {
        this.queryData.cinemaUid = this.cinemaUid;
        this.goodsDataQueryCinemaGoodsList(this.queryData);
      } else {
        this.goodsDataQueryGoodsList(this.queryData);
      }
      this.customTree = data.uid;
    },
    // 请求商品分类树接口
    selectProductClass (param) {
      this.$cimList
        .getCategoryTrees(param)
        .then(res => {
          if (res.code === 200) {
            this.categoryTrees = [res.data];
          } else {
            this.error(res.msg);
          }
        })
        .catch(err => { });
    },
    // 根据商品分类查询总部商品信息
    goodsDataQueryGoodsList (param, type) {
      this.tableLoding = true;
      this.$cimList.inventoryTransfer
        .moveBillFindProductList(param)
        .then(res => {
          this.reqCallBack(res, type);
        })
        .catch(err => {
          this.tableLoding = false;
        });
    },
    // 根据商品分类查询门店商品信息
    goodsDataQueryCinemaGoodsList (param, type) {
      this.tableLoding = true;
      this.$cimList.inventoryTransfer
        .moveBillFindProductList(param)
        .then(res => {
          this.reqCallBack(res, type);
        })
        .catch(err => {
          this.tableLoding = false;
        });
    },
    reqCallBack (res, type) {
      if (res.code === 200) {
        if (type == 'open') {
          this.$refs.materialTable.clearSelection();
          if (this.dialogFeedbackData.length > 0) {
            this.dialogFeedbackData.forEach(row => {
              this.$refs.materialTable.toggleRowSelection(row, true);
            });
          }
        }
        this.tableData = res.data.list.map(item => {
          if (item.merType == 2) {
            if (item.skuName) {
              item.merName = item.merName + '--' + item.skuName;
            }
          }
          return item;
        });
        this.tableLoding = false;
        this.total = res.data.total;
      } else {
        this.error(res.msg);
      }
    },
    // 选择添加商品
    handleSelectionMaterial (value) {
      console.log('选择的商品', value);
      this.selectedgoods = value;
    },
    // 删除选择
    deleteSelected (row, flag) {
      console.log('删除', row);
      this.$refs.materialTable.toggleRowSelection(row, false);
      this.tableData.map(item => {
        if (row.skuUid && item.skuUid) {
          if (item.skuUid == row.skuUid) {
            this.$refs.materialTable.toggleRowSelection(item, false);
          }
        } else {
          if (item.uid == row.uid) {
            this.$refs.materialTable.toggleRowSelection(item, false);
          }
        }
      });
    },
    // 清空选择
    handleEmptyMaterials () {
      this.$refs.materialTable.clearSelection();
    },
    // 去重(根据uid相同，避免数据问题)
    unRepeat (arr) {
      let hash = {};
      return arr.reduce((item, next) => {
        if (!hash[next.skuUid]) {
          hash[next.skuUid] = true;
          item.push(next);
        }
        return item;
      }, []);
    },
    getRowKey (row) {
      // 套餐商品没有skuCode
      if (row.skuUid) {
        return row.skuUid;
      } else {
        return row.merUid || row.uid || row.merCode;
      }
    },

    handleCurrentChange (val) {
      this.queryData.page = val;
      this.onQuery();
    },
    isDisabled (row) {
      return !row.isDisabled;
    },
    // 取消弹窗
    closeCallBack () {
      this.$emit('update:dialogVisible', false);
    },
    // 取消弹窗
    handleCancel () {
      this.closeCallBack();
      this.$emit('cimSelectedGoodsDialogCallBack', {
        btnType: 0,
        data: this.selectedgoods
      });
    },
    // 确定
    handleSubmit () {
      this.$emit('cimSelectedGoodsDialogCallBack', {
        btnType: 1,
        data: this.selectedgoods
      });
      if (this.autoClose) {
        this.$emit('update:dialogVisible', false);
      }
    }
  },
  computed: {
    defaultExpanded () {
      return this.categoryTrees.map(item => {
        return item.uid;
      });
    }
  },
  watch: {}
};
</script>


<style lang="scss">
.good-select-dialog {
  .el-table {
    border-left: 1px solid #e5e5e5;
    th,
    td:first-of-type {
      border-left: none;
    }
    th,
    td:last-of-type {
      border-right: none !important;
    }
  }
  .page-wrap {
    border: 1px solid #e5e5e5;
    border-right: none;
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
    .empty-btn {
    }
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
}
</style>
