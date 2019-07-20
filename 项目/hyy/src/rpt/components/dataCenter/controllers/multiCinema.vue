<template>
  <div class="query-dialog-wrapper">
    <div class="input-button">
      <div @mouseenter="showIcon" @mouseleave="hideIcon">
        <el-input v-model="cinemaValue" :disabled="true">
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
      title="影院选择"
      :isShow="selectTreeValue"
      :dialogWidth="700"
      :dialogHeight="576"
      :dialogContentHeight="473"
      :marginTop="1"
      :marginBottom="1"
      @handleBtnComfirmClick="confirmTreeBtn"
      @handleBtnCancelClick="cancelTreeBtn"
      @close="handleClose"
    >
      <div slot="dialog-content">
        <div class="search-content">
          <el-form>
            <el-form-item label="影院名称">
              <el-input v-model="cinemaName" style="width:184px"></el-input>
            </el-form-item>
            <el-form-item label="影院编码">
              <el-input v-model="cinemaCode" style="width:184px"></el-input>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="searchClick">查询</el-button>
        </div>
        <div class="tree-content">
          <el-tree
            @node-click="nodeClick"
            :data="newselectValue"
            show-checkbox
            default-expand-all
            node-key="applicableobj"
            ref="tree"
            highlight-current
            :props="defaultProps"
            icon-class="iconfont icon-neiye-zhankaijiantou"
            :default-checked-keys="selectedCinemaUidArr"
          ></el-tree>
        </div>
      </div>
    </my-dialog>
  </div>
</template>
<script>
import MyDialog from "../dataCommon/myDialog";
import mixins from "src/frame_cpm/mixins/cacheMixin.js";
export default {
  mixins: [mixins.cacheMixin],
  props: {
    resetStatus: Boolean
  },
  components: {
    MyDialog
  },
  data() {
    return {
      cacheField: [
        "cinemaValue",
        "newselectValue"
      ],
      subComName: "multiCinema",
      cinemaValue: "",
      cinemaName: "",
      cinemaCode: "",
      isShowIcon: false,
      newselectValue: [],
      selectedCinemaUidArr: [],
      selectTreeValue: false,
      filterText: "",
      defaultProps: {
        children: "subtree",
        label: "menuName"
      },
      loading: false
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    },
    resetStatus(newVal) {
      if (newVal) {
        this.cinemaValue = "";
        this.selectedCinemaUidArr = [];
        this.$emit("selectMultiCinemaData", "");
      }
    }
  },
  methods: {
    handleIconClick() {
      this.cinemaValue = "";
      this.selectedCinemaUidArr = [];
      this.$emit("selectMultiCinemaData", this.cinemaValue);
    },
    showIcon() {
      if (this.cinemaValue !== "") this.isShowIcon = true;
    },
    hideIcon() {
      this.isShowIcon = false;
    },
    confirmTreeBtn() {
      let checkedData = this.$refs.tree.getCheckedNodes(true, false);
      let checkedArr = [];
      let checkedMenuName = [];
      let cinemaName = "";
      let checkedMenuId = [];
      checkedData.forEach(element => {
        if (element.applicableobj) {
          checkedArr.push(element);
          checkedMenuName.push(element.menuName);
          checkedMenuId.push(element.applicableobj);
        }
      });
      this.cinemaValue = checkedMenuName.join(",");
      this.selectedCinemaUidArr = JSON.parse(JSON.stringify(checkedMenuId));
      this.$emit("selectMultiCinemaData", checkedMenuId.join(","));
      // this.selectTreeValue = false;
    },
    cancelTreeBtn() {
      this.selectTreeValue = false;
    },
    handleNodeClick(data) {},
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    openDialog() {
      let self = this;
      //只请求一次数据
      if (self.newselectValue.length <= 0) this.getData("", "");
      this.selectTreeValue = true;
    },
    searchClick() {
      this.getData(this.cinemaName, this.cinemaCode);
    },
    getData(cinemaName, cinemaCode) {
      this.$rptList
        .getCinemaTree(cinemaName, cinemaCode)
        .then(res => {
          let cinemaTree = [];
          this.formData(res);
          cinemaTree.push(res);
          this.newselectValue = cinemaTree;
        })
        .catch(msg => {
          console.log(msg);
        });
    },
    nodeClick(data) {},
    handleClose() {
      this.selectTreeValue = false;
    },
    //递归重组后台返回的菜单树
    formData(obj) {
      if (obj.subtree) {
        if (obj.cinemas) {
          obj.cinemas.forEach(item => {
            let data = {
              applicableobj: item.id,
              menuName: item.name
            };
            obj.subtree.push(data);
          });
        }
        for (let i = 0; i < obj.subtree.length; i++) {
          let item = obj.subtree[i];
          if (item.subtree) {
            this.formData(item);
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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
      background: #f5f5f5;
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
  }
}

.search-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 54px;

  .el-form {
    display: flex;
    height: 54px;

    .el-form-item:nth-child(2) {
      margin-left: 20px;
    }

    /deep/ .el-form-item__label {
      line-height: 54px;
      font-size: 12px;
      color: #666666;
    }

    /deep/ .el-form-item__content {
      display: inline-block;
      line-height: 54px;
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
  margin-top: 10px;
  height: 370px;
  overflow: auto;
  /deep/ .el-tree {
    .el-tree-node__label {
      font-size: 12px;
      color: #666666;
      margin-left: 4px;
    }
    .el-tree-node__expand-icon {
      font-size: 10px;
      color: #666666;
    }
    .el-checkbox__inner {
      width: 12px;
      height: 12px;
    }
    .el-checkbox__inner::after {
      height: 5px;
      left: 3px;
    }
    .icon-neiye-zhankaijiantou:before {
      font-size: 8px;
    }
  }
}
</style>
