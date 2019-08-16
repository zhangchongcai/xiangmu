<template>
  <el-dialog
    class="cim-good-classify-dialog"
    width="500px"
    :title="title"
    :visible="dialogVisible"
    @close="closeCallBack"
    @open="openCallBack"
  >
    <div>
      <el-row>
        <el-col :span="24">
          <div class="good-trees-box">
            <el-tree
                    :data="categoryTrees"
                    ref="refCategoryTrees"
                    icon-class="iconfont icon-neiye-zhankaijiantou"
                    :props="defaultProps"
                    highlight-current
                    check-on-click-node
                    check-strictly
                    node-key="code"
                    show-checkbox
                    v-loading="categoryTableLoding"
                    :default-expanded-keys="defaultExpanded"
                    @node-click="handleaCtegoryTrees"
            >
            </el-tree>
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
      default: "选择商品分类"
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    //是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    //商品类型 1单品， 2合成品,3服务商品，4套餐，5原材料
    merType: {
      type: [String, Number],
      default: ""
    },
    //门店id
    cinemaUid: {
      type: [String, Number],
      default: ""
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
  },
  data() {
    return {
      //查询数据
      queryData: {
        canSale: "1", //可销售商品
        merType: "", //商品类型
        classUid: "",
        name: "",
        code: "",
        shorthandCode: "",
        skuCode: "",
        page: 1,
        pageSize: 10
      },
      customTree:'',
      categoryTrees: [], //商品分类树
      defaultProps: {
        children: "children",
        label: "name",
        disabled: (data, node) => {
          if (data.uid == "0") {
            return true
          } else {
            return false
          }
        }
      },
      categoryTableLoding: false,
      isOpen: true,
    };
  },
  mounted() {

  },

  methods: {
    //弹窗打开回调
    openCallBack() {
      this.queryData.classUid = "";
      this.init();
      // console.log(this.dialogFeedbackData, "this.dialogFeedbackData");
    },
    init() {
      this.selectProductClass({ uid: "" });
    },
    // 查询树
    handleaCtegoryTrees(data) {
      // console.log(data)
      if (data.uid == "0") {
        this.queryData.classUid = "";
      } else {
        this.queryData.classUid = data.uid;
      }
      this.customTree = data.uid;
    },
    // 请求商品分类树接口
    selectProductClass(param) {
      this.categoryTableLoding = true;
      this.$cimList
        .getCategoryTrees(param)
        .then(res => {
          if (res.code === 200) {
            this.$refs.refCategoryTrees.setCheckedKeys(this.selectedGoodsCheckedKeys, true);
            this.categoryTrees =  [res.data];
            // setTimeout(()=>{
            //   if(this.selectedGoodsCheckedKeys){
            //
            //   }else{
            //     this.$refs.refCategoryTrees.setCheckedKeys(this.selectedGoodsCheckedKeys,false);
            //   }
            // })
          } else {
            this.error(res.msg);
          }
          this.categoryTableLoding = false;
        })
              .catch(err => {
                this.categoryTableLoding = false;
              });
    },
    isDisabled(row) {
      return !row.isDisabled;
    },
    //取消弹窗
    closeCallBack() {
      this.$emit("update:dialogVisible", false);
    },
    //取消弹窗
    handleCancel() {
      this.closeCallBack();
    },
    //确定
    handleSubmit() {
      let categoryNodes = this.$refs.refCategoryTrees.getCheckedNodes();
      // console.log(categoryNodes)
      this.$emit("cimCategoryDialogCallBack", {
        btnType: 1,
        data: categoryNodes
      });
      if (this.autoClose) {
        this.$emit("update:dialogVisible", false);
      }
    }
  },
  computed: {
    selectedGoodsCheckedKeys(){
      if (this.dialogFeedbackData) {
        let tempArr = this.dialogFeedbackData.map(item => {
          return item.code;
        })
        return tempArr
      }else{
        return [];
      }

    },
    defaultExpanded() {
      return this.categoryTrees.map(item => {
        if(!item.code){
          item.code = "0"
        }
        if(item.code){
          return item.code;
        }
      });
    }
  },
  watch: {}
};
</script>


<style lang="scss">
  @import "../../assets/css/common.scss";
  @import "../../assets/css/element-common.scss";
.cim-good-classify-dialog {
  .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
  }
  .good-trees-box {
    overflow: scroll;
    .el-tree {
      height: 400px;
    }
    .el-radio{
      margin-right: 0;
    }
    .el-radio__label{
      display: none;
    }
  }
}
</style>
