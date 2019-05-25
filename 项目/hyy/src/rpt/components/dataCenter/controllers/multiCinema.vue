<template>
  <div>
    <!-- <button class="select-button" @click="selectTreeEvent">选择</button> -->
    <!-- <div class="input-button">
      <el-input v-model="cinemaValue"></el-input>
      <button class="edit-button">编辑</button>
    </div>-->
    <el-input v-model="cinemaValue" v-on:click.native="selectTreeEvent"></el-input>
    <my-dialog
      title="影院选择"
      :isShow="selectTreeValue"
      :dialogWidth="448"
      :dialogHeight="576"
      :dialogContentHeight="473"
      @handleBtnComfirmClick="confirmTreeBtn"
      @handleBtnCancelClick="cancelTreeBtn"
      @close="handleClose"
    >
      <div slot="dialog-content">
        <div class="tree-content">
          <el-tree
            @node-click="nodeClick"
            :data="newselectValue"
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
  data() {
    return {
      cinemaValue: "",
      newselectValue: [],
      propSselectValue: this.selectValue,
      selectTreeValue: false,
      filterText: "",
      defaultProps: {
        children: "sonTree",
        label: "menuName"
      },
      loading: false
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  methods: {
    confirmTreeBtn() {
      let checkedData = this.$refs.tree.getCheckedNodes();
      let checkedArr = [];
      let checkedMenuName = [];
      let cinemaName = "";
      let checkedMenuId = [];
      let cinemaId = [];
      checkedData.forEach(element => {
        if (element.applicableobj) {
          checkedArr.push(element);
          checkedMenuName.push(element.menuName);
          checkedMenuId.push(element.applicableobj);
        }
      });
      this.cinemaValue = checkedMenuName.join(",");
      cinemaId = checkedMenuId.join(",");
      console.log(cinemaId);
      this.$emit("selectMultiCinemaData", cinemaId);
      // this.selectTreeValue = false;
    },
    cancelTreeBtn() {
      this.selectTreeValue = false;
    },
    handleNodeClick(data) {
      console.log(data);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    selectTreeEvent() {
      let self = this;
      //只请求一次数据
      if (self.newselectValue.length <= 0) {
        this.$rptList
          .systemGetUserMenuTree()
          .then(res => {
            console.log(res);
            let cinemaTree = [];
            let data = res.data;
            this.formData(data);
            cinemaTree.push(data);
            this.newselectValue = cinemaTree;
            console.log(this.newselectValue);
          })
          .catch(msg => {
            console.log(msg);
          });
      }

      this.selectTreeValue = true;
    },
    nodeClick(data) {
      console.log(data);
    },
    handleClose() {
      this.selectTreeValue = false;
    },
    //递归重组后台返回的菜单树
    formData(obj) {
      if (obj.sonTree) {
        if (obj.cinemas) {
          obj.cinemas.forEach(item => {
            let data = {
              applicableobj: item.first,
              menuName: item.second
            };
            obj.sonTree.push(data);
          });
        }
        for (let i = 0; i < obj.sonTree.length; i++) {
          let item = obj.sonTree[i];
          if (item.sonTree) {
            this.formData(item);
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tree-content {
  height: 473px;
  overflow: auto;
}
// $fontFamily: "MicrosoftYaHei";
// $fontSize: 12px;
// .select-button {
//   font-family: $fontFamily;
//   font-size: $fontSize;
//   color: #3b74ff;
//   letter-spacing: 0;
//   text-align: center;
//   width: 192px;
//   height: 32px;
//   background: #ffffff;
//   border: 1px solid #3b74ff;
//   border-radius: 4px;
// }
// .select-button:hover {
//   cursor: pointer;
// }

// .input-button {
//   display: flex;
//   .el-input {
//     margin-right: 8px;
//     width: 192px;
//     height: 32px;
//     .edit-button {
//       width: 80px;
//       height: 32px;
//       background: #ffffff;
//       border: 1px solid #3b74ff;
//       border-radius: 4px;
//     }
//   }
// }
</style>
