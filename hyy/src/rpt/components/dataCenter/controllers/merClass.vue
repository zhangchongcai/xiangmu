<template>
  <div class="mer-class-wrapper">
    <div class="input-button">
      <div @mouseenter="showIcon" @mouseleave="hideIcon">
        <el-input v-model="merClassObj.merClassValue" :disabled="true">
          <i
            v-if="isShowIcon"
            class="iconfont icon-neiye-danchuangquxiao"
            slot="suffix"
            @click="handleIconClick"
          ></i>
        </el-input>
      </div>
      <button class="edit-button" @click="openDialog">选择</button>
    </div>
    <my-dialog
      title="商品类别"
      :isShow="dialogVisible"
      :dialogWidth="448"
      :dialogHeight="576"
      :marginTop="1"
      :marginBottom="1"
      :dialogContentHeight="440"
      @handleBtnComfirmClick="confirmTreeBtn"
      @handleBtnCancelClick="cancelTreeBtn"
      @close="handleClose"
    >
      <div slot="dialog-content">
        <div class="search-content">
          <el-form>
            <el-form-item label="商品类别:">
              <el-select popper-class="rpt-select" v-model="merClass" style="width:184px">
                <div v-if="merClassObj.merClassArr.length > 0">
                  <div v-for="(item, index) in selectData" :key="index">
                    <el-option :label="item.name" :value="item.uid">{{item.name}}</el-option>
                  </div>
                </div>
                <div v-if="merClassObj.merClassArr.length === 0">
                  <div v-for="(item, index) in merClassObj.merClassArr" :key="index">
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
            :data="merClassObj.merClassArr"
            show-checkbox
            default-expand-all
            :node-key="String(Math.random())"
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
import MyDialog from "../dataCommon/myDialog";
export default {
  components: {
    MyDialog
  },
  props: {
    resetStatus: Boolean,
    merClassObj: Object
  },
  data() {
    return {
      merClass: "",
      isShowIcon: false,
      merClassSearchValue: "",
      dialogVisible: false,
      defaultProps: {
        children: "children",
        label: "name"
      },
      getDataTimes: 0,
      selectData: []
    };
  },
  methods: {
    handleIconClick() {
      this.merClassObj.merClassValue = "";
      this.$forceUpdate();
      this.$emit("selectMerClassData", this.merClassObj.merClassValue);
    },
    showIcon() {
      if (this.merClassObj.merClassValue !== "") this.isShowIcon = true;
    },
    hideIcon() {
      this.isShowIcon = false;
    },
    selectMerClass(uid) {
      let proClass = { uid: uid };
      this.$rptList
        .getMerClassData(proClass)
        .then(res => {
          if (res.code === 200) {
            let merClassData = [];
            merClassData.push(res.data);
            this.merClassObj.merClassArr = JSON.parse(
              JSON.stringify(merClassData)
            );
            if (this.getDataTimes === 0) {
              this.selectData = this.merClassObj.merClassArr[0].children;
              this.getDataTimes++;
            }
          } else {
            this.error(res.msg);
          }
        })
        .catch(err => {});
    },
    openDialog() {
      this.dialogVisible = true;
      this.selectMerClass("");
    },
    confirmTreeBtn() {
      let checkedData = this.$refs.tree.getCheckedNodes();
      let checkedMerClassUidArr = [];
      let checkedMerClassNameArr = [];
      checkedData.forEach(element => {
        checkedMerClassUidArr.push(element.uid);
        checkedMerClassNameArr.push(element.name);
      });
      this.merClassObj.merClassValue = checkedMerClassNameArr.join(",");
      this.$emit("selectMerClassData", checkedMerClassUidArr.join(","));
    },
    cancelTreeBtn() {},
    handleClose() {
      this.dialogVisible = false;
    },
    searchClick() {
      this.selectMerClass(this.merClass);
    }
  },
  watch: {
    resetStatus(newVal) {
      if (newVal) {
        this.merClassObj.merClassValue = "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.mer-class-wrapper {
  .select-button {
    font-family: "MicrosoftYaHei";
    font-size: 12px;
    color: #3b74ff;
    letter-spacing: 0;
    text-align: center;
    width: 80px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #3b74ff;
    border-radius: 4px;
    &:hover {
      cursor: pointer;
    }
  }

  /deep/ .input-button {
    display: flex;
    .el-input {
      margin-right: 8px;
      .el-input__inner {
        width: 192px;
        height: 32px;
        padding-left: 16px;
        padding-right: 26px;
        font-family: "MicrosoftYaHei";
        font-size: 12px;
        color: #666666;
        background: #ffffff;
        border: 1px solid #bcbcbc;
        border-radius: 4px;
        text-overflow: ellipsis;
      }
      .el-input__suffix {
        right: 15px;
      }
      .iconfont {
        font-size: 10px;
        line-height: 32px;
        color: #3b74ff;
        margin-right: 4px;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .edit-button {
      width: 80px;
      height: 32px;
      font-family: "MicrosoftYaHei";
      font-size: 12px;
      color: #3b74ff;
      background: #ffffff;
      border: 1px solid #3b74ff;
      border-radius: 4px;
      &:hover {
        cursor: pointer;
      }
      span {
        font-family: "MicrosoftYaHei";
        font-size: 12px;
      }
    }
  }
  .search-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 54px;

    .el-form {
      height: 54px;

      /deep/ .el-form-item__label {
        line-height: 54px;
        font-size: 12px;
      }

      /deep/ .el-form-item__content {
        display: inline-block;
        line-height: 54px;
        .el-input__inner {
          font-size: 12px;
          font-family: "MicrosoftYaHe";
        }
      }
    }
    /deep/ .el-button {
      width: 80px;
      height: 32px;
      span {
        font-size: 12px;
        font-family: "MicrosoftYaHei";
      }
    }
  }

  .tree-content {
    height: 390px;
    overflow: auto;
    /deep/ .el-tree {
      .el-tree-node__expand-icon {
        font-size: 10px;
        color: #666666;
      }
      .el-checkbox__inner {
        width: 12px;
        height: 12px;
      }
      .el-tree-node__label {
        font-size: 12px;
        margin-left: 4px;
      }
      .el-checkbox__inner::after {
        height: 5px;
        left: 3px;
      }
      .icon-neiye-zhankaijiantou:before {
        font-size: 8px;
      }
      .is-leaf {
        visibility: hidden;
      }

      .el-button {
        width: 80px;
        height: 32px;
      }
    }
  }
}
</style>
