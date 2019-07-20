<template>
  <div class="mer-class-wrapper">
    <my-dialog
      title="商品类别"
      :isShow="dialogVisible"
      :dialogWidth="448"
      :dialogHeight="576"
      :dialogContentHeight="473"
      @handleBtnComfirmClick="confirmTreeBtn"
      @handleBtnCancelClick="cancelTreeBtn"
      @close="handleClose"
      :close-on-click-modal="false"
    >
      <div slot="dialog-content">
        <div class="search-content">
          <el-form>
            <el-form-item label="商品类别:" >
              <el-select v-model="merClass" style="width:184px">
                <el-option label="全部" value>全部</el-option>
                <div v-if="this.merClassArr.length > 0">
                  <div v-for="(item, index) in merClassArr[0].children" :key="index">
                    <el-option :label="item.name" :value="item.uid">{{item.name}}</el-option>
                  </div>
                </div>
                <div v-if="this.merClassArr.length === 0">
                  <div v-for="(item, index) in merClassArr" :key="index">
                    <el-option :label="item.name" :value="item.uid">{{item.name}}</el-option>
                  </div>
                </div>
              </el-select>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="searchClick">查询</el-button>
        </div>
        <div class="tree-content">
          <el-tree
            :data="merClassArr"
            show-checkbox
            default-expand-all
            node-key="seq"
            ref="tree"
            highlight-current
            :props="defaultProps"
            icon-class="iconfont icon-neiye-zhankaijiantou"
          ></el-tree>
        </div>
      </div>
    </my-dialog>
  </div>
</template>

<script>
import MyDialog from "./myDialog";
export default {
  components: {
    MyDialog
  },
  data() {
    return {
      merClass: "",
      merClassSearchValue: "",
      dialogVisible: false,
      merClassArr: [],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  methods: {
    selectMerClass(uid) {
      let proClass = { uid: uid };
      this.$cimList.getCategoryTrees(proClass)
        .then(res => {
          if (res.code === 200) {
            let merClassData = [];
            merClassData.push(res.data);
            this.merClassArr = JSON.parse(JSON.stringify(merClassData));
            console.log(this.merClassArr);
          } else {
            this.error(res.msg);
          }
        })
        .catch(err => {});
    },
    openMerClassTree() {
      this.dialogVisible = true;
      this.selectMerClass("");
    },
    confirmTreeBtn() {
      let checkedData = this.$refs.tree.getCheckedNodes();
      let valueArr = [];
      let textArr = [];
      checkedData.forEach(element => {
          valueArr.push(element.uid);
          textArr.push(element.name);
      });
      let data = {
        whereUse:'',
        valueArr,
        textArr
      }
      this.$emit('selectMerClassCallBack', data);
      this.$emit('sameMerClassCallBack',data)
      this.$emit('maiPingMerClassCallBack',data)
    },
    cancelTreeBtn() {},
    handleClose() {
      this.dialogVisible = false;
    },
    searchClick() {
      this.selectMerClass(this.merClass);
    }
  },
  mounted() {
  }
};
</script>

<style lang="scss" scoped>
.mer-class-wrapper {
  .search-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 54px;

    .el-form {
      height: 54px;

      /deep/ .el-form-item__label {
        line-height: 54px;
      }

      /deep/ .el-form-item__content {
        display: inline-block;
        line-height: 54px;
      }
    }

    .el-button {
      width: 80px;
      height: 32px;
    }
  }

  .tree-content {
    height: 419px;
    overflow: auto;
  }
}
</style>
