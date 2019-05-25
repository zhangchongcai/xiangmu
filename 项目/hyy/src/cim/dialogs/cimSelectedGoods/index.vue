<template>
  <el-dialog
    class="good-select-dialog"
    width="70%"
    :title="title"
    :visible="dialogVisible"
    @close="handleDialog"
  >
    <div>
      <el-row>
        <el-col :span="4">
          <el-tree
            :data="categoryTrees"
            :props="defaultProps"
            node-key="uid"
            :default-expanded-keys="defaultExpanded"
            @node-click="handleaCtegoryTrees"
          ></el-tree>
        </el-col>
        <el-col :span="20">
          <div>
            <el-form :inline="true" :model="queryData" label-position="right" label-suffix=":">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="商品名称">
                    <el-input placeholder class="change-dialog-inp" v-model="queryData.merName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="商品编码">
                    <el-input placeholder class="change-dialog-inp" v-model="queryData.merCode"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="速记代码">
                    <el-input
                      placeholder
                      class="change-dialog-inp"
                      v-model="queryData.shorthandCode"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="SKU编码">
                    <el-input placeholder class="change-dialog-inp" v-model="queryData.skuCode"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label>
                    <el-button icon="el-icon-search" type="primary" @click="onQuery">查询</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div>
            <el-row>
              <el-col :span="20">
                <div class="table-box">
                  <el-table
                    ref="materialTable"
                    :data="tableData"
                    max-height="500"
                    row-key="uid"
                    @selection-change="handleSelectionMaterial"
                  >
                    <el-table-column
                      type="selection"
                      width="40"
                      :selectable="isDisabled"
                      disabled="true"
                    ></el-table-column>
                    <el-table-column
                      v-for="item in tableColumn"
                      :key="item.key"
                      :prop="item.key"
                      :label="item.label"
                      :formatter="item.formatter"
                    ></el-table-column>
                  </el-table>
                  <div class="page-wrap">
                    <el-pagination
                      @current-change="handleCurrentChange"
                      :current-page="queryData.currentPage"
                      :page-size="queryData.pageSize"
                      layout="total, prev, pager, next,jumper"
                      :total="this.total"
                    ></el-pagination>
                  </div>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="empty-box">
                  <div class="clearfix">
                    <span class="selected-content left">已选内容</span>
                    <el-button type="text" class="right" @click="handleEmptyMaterials">清 空</el-button>
                  </div>
                  <hr>
                  <ul class="empty-content">
                    <li v-for="(item) in selectedgoods" :key="item.code">
                      <el-tag
                        size="small"
                        @close="toggleRowSelection(item,false)"
                        closable
                      >{{item.merName || item.name}}</el-tag>
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
      <el-button @click="handleaCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "选择商品"
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 回选数据
    dialogFeedbackData: {
      type: [Array],
      default: () => []
    },
    // 表头
    tableColumn: {
      type: [Array],
      default: () => [
        {
          label: "商品名称",
          key: "merName"
        },
        {
          label: "商品编码",
          key: "merCode"
        },
        {
          label: "SKU编码",
          key: "skuCode"
        },
        {
          label: "速记代码",
          key: "shorthandCode"
        },
        {
          label: "商品规格",
          key: "merSpec"
        },
        {
          label: "基本单位",
          key: "unitName"
        }
      ]
    }
  },
  data() {
    return {
      //查询数据
      queryData: {
        classUid: "",
        name: "",
        code: "",
        shorthandCode: "",
        skuCode: "",
        page: 1,
        pageSize: 10
      },
      categoryTrees: [], //商品分类树
      defaultProps: {
        children: "children",
        label: "name"
      },
      tableData: [],
      selectedgoods: this.dialogFeedbackData,
      total: 0
    };
  },
  mounted() {
    this.init();
  },
  updated() {},
  methods: {
    init() {
      this.selectProductClass({ uid: "" });
    },
    // 查询
    onQuery() {
      this.goodsDataQueryGoodsList(this.queryData);
    },
    // 查询树
    handleaCtegoryTrees(data) {
      if (data.uid == "0") {
      } else {
        this.queryData.classUid = data.uid;
        this.goodsDataQueryGoodsList(this.queryData);
      }
    },
    // 请求商品分类树接口
    selectProductClass(param) {
      this.$cimList.headquartersGoods
        .setmeaLoadCategoies(param)
        .then(res => {
          if (res.code === 200) {
            this.categoryTrees = res.data.children;
          } else {
            this.error(res.msg);
          }
        })
        .catch(err => {});
    },
    // 根据商品分类查询商品信息
    goodsDataQueryGoodsList(param) {
      this.$cimList.headquartersGoods
        .goodsDataQueryGoodsList(param)
        .then(res => {
          if (res.code === 200) {
            // 数组去重
            this.tableData = this.unRepeat(res.data.list);
            this.total = res.data.total;
          } else {
            this.error(res.msg);
          }
        })
        .catch(err => {});
    },
    //去重(根据uid相同，避免数据问题)
    unRepeat(arr) {
      let hash = {};
      return arr.reduce((item, next) => {
        if (!hash[next.uid]) {
          hash[next.uid] = true;
          item.push(next);
        }
        return item;
      }, []);
    },
    // 选择添加商品
    handleSelectionMaterial(value) {
      this.selectedgoods = value;
    },
    //切换状态
    toggleRowSelection(row, flag) {
      this.$refs.materialTable.toggleRowSelection(row, flag);
    },
    // 清空选择的原材料
    handleEmptyMaterials() {
      this.$refs.materialTable.clearSelection();
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.onQuery();
    },
    isDisabled(row) {
      return !row.isDisabled;
    },
    //取消弹窗
    handleDialog() {
      this.$emit("update:dialogVisible", false);
    },
    //取消弹窗
    handleaCancel() {
      this.handleDialog();
      this.$emit("cimSelectedGoodsDialogCallBack", {
        btnType: 0,
        data: this.selectedgoods
      });
    },
    //确定
    handleSubmit() {
      this.$emit("dialogFeedbackData", this.selectedgoods);
      this.$emit("cimSelectedGoodsDialogCallBack", {
        btnType: 1,
        data: this.selectedgoods
      });
      this.$emit("update:dialogVisible", false);
    }
  },
  computed: {
    defaultExpanded() {
      return this.categoryTrees.map(item => {
        return item.uid;
      });
    }
  },
  watch: {
    dialogVisible(value) {
      // 开启弹窗
      if (value) {
        //初始化数据
        this.$nextTick(() => {
          // console.log(this.dialogFeedbackData)
          if (this.dialogFeedbackData.length > 0) {
            this.selectedgoods = this.dialogFeedbackData;
            this.tableData = this.dialogFeedbackData;
            this.tableData.forEach(row => {
              this.toggleRowSelection(row, true);
            });
          } else {
            this.onQuery();
            this.handleEmptyMaterials();
          }
        });
        // 关闭
      } else {
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.good-select-dialog {
  .empty-box {
    padding: 10px;
    .selected-content {
      margin-top: 6px;
    }
    .el-button {
      padding-left: 0;
      padding-right: 0;
    }
    .empty-content {
      height: 300px;
      overflow-y: auto;
      li {
        margin-top: 5px;
      }
    }
    .el-tag {
      width: 100%;
    }
    .el-tag .el-icon-close {
      float: right;
      top: 4px;
    }
  }
}
</style>