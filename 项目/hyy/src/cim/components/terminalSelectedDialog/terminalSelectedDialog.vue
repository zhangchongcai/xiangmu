<template>
  <div>
    <el-dialog class="good-select-dialog" width="70%" :title="title" :visible.sync="visibleDialog">
      <div>
        <el-row>
          <el-col :span="6">
            <el-tree
              :data="categoryTrees"
              show-checkbox
              default-expand-all
              :props="defaultProps"
              @node-click="handleaCtegoryTrees"
            ></el-tree>
          </el-col>
          <el-col :span="18">
            <div>
              <el-form :inline="true" label-position="right" label-width="100px" label-suffix=":">
                <el-form-item label="商品设置">
                  <el-button @click="addBlankBlock">添加空白块</el-button>
                  <el-button @click="handleDialogEvent('refGoodSelectedDialog')">添加常用商品</el-button>
                  <el-button>保存</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div>
              <div class="draggable-box">
                <draggable-goods v-model="userGoodlist"></draggable-goods>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer">
        <el-button @click="handleDialog(false)">取 消</el-button>
        <el-button type="primary" @click="handleModificationSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 选择商品弹窗 -->
    <good-selected-dialog ref="refGoodSelectedDialog"></good-selected-dialog>
  </div>
</template>

<script>
import goodSelectedDialog from "cim/dialogs/cimSelectedGoods/index.vue";
import draggableGoods from "cim/components/draggableGoods/draggableGoods.vue";
export default {
  props: {
    title: {
      type: String,
      default: "选择商品"
    }
  },
  data() {
    return {
        userGoodlist: [
        {
          name: "可口可乐",
          price: "¥15.00",
          color: "red",
          id: Math.random()
        },
        {
          name: "雪碧",
          price: "¥12.00",
          color: "blue",
          id: Math.random()
        },
        {
          id: Math.random()
        },
        {
          name: "辣条",
          price: "¥15.00",
          color: "yellow",
          id: Math.random()
        },
        {
          name: "鸡蛋",
          price: "¥15.00",
          id: Math.random()
        },
        {
          name: "薯条",
          price: "¥19.00",
          color: "#67393E",
          id: Math.random()
        },
        {
          name: "咪咪",
          price: "¥11.00",
          id: Math.random()
        }
      ],
      visibleDialog: false,
      // 原材料查询数据
      queryData: {
        mercatUid: "", //商品分类id
        name: "",
        code: "",
        shorthandCode: "",
        skuCode: "",
        page: 1,
        pageSize: 10
      },
      categoryTrees: [
        {
          name: "全选终端",
          children: [
            {
              name: "100011[1-1]"
            },
            {
              name: "100012[1-2]"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "name"
      },
      total: 12,
      // 表头
      tableColumn: [
        {
          label: "商品名称",
          key: "name"
        },
        {
          label: "商品编码",
          key: "code"
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
          key: "attrValue"
        },
        {
          label: "基本单位",
          key: "unitName"
        }
      ],
      tableData: [
        {
          name: "测试名字1",
          code: "qwqa123",
          skuCode: "3221"
        },
        {
          name: "测试名字2",
          code: "qwqa123",
          skuCode: "3221"
        },
        {
          name: "测试名字3",
          code: "qwqa123",
          skuCode: "3221"
        }
      ],
      selectedgoods: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getCategoryTrees({});
    },
    handleDialog(flag) {
      this.visibleDialog = flag;
    },
    //添加空白块
    addBlankBlock() {
      this.userGoodlist.push({
        id: Math.random()
      });
    },
    // 查询
    onQuery() {
      console.log(this.queryData);
    },
    // 获取分类列表
    getCategoryTrees(param) {
      this.$cimList.headquartersGoods
        .setmeaLoadCategoies(param)
        .then(resData => {
          if (resData.code == 200) {
            // this.categoryTrees = resData.data.children;
          }
        });
    },
    // 查询树
    handleaCtegoryTrees(data) {
      this.queryData.mercatUid = data.uid;
      // this.findSemifinishedMater(this.queryData);
    },
    // 选择添加商品
    handleSelectionMaterial(value) {
      this.selectedgoods = value;
      console.log(value);
    },
    // 删除单个选择的原材料
    handleDelMaterial(row) {
      this.selectedgoods = this.selectedgoods.filter(item => {
        return item.skuCode != row.skuCode;
      });
      let tempArr = this.tableData.filter(item => {
        return item.skuCode == row.skuCode;
      });
      this.$refs.materialTable.toggleRowSelection(row);
    },
    handleModificationSubmit() {
      this.visibleDialog = false;
    },
    // 清空选择的原材料
    handleEmptyMaterials() {
      this.selectedMaterials = [];
      this.$refs.materialTable.clearSelection();
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.onQuery();
    },
    handleDialogEvent(name) {
      this.$refs[name].handleDialog(true);
    }
  },
  computed: {},
  components: {
    goodSelectedDialog,
    draggableGoods
  },
  watch: {}
};
</script>


<style lang="scss" scoped>
@import "../../assets/css/common.scss";
@import "../../assets/css/element-common.scss";
.good-select-dialog {
  .el-form-item__content {
    // width: 200px;
  }
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