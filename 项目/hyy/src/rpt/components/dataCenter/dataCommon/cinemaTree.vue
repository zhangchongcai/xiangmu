<template>
  <div>
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
        <el-tree
        @node-click="nodeClick"
        :data="newselectValue"
        show-checkbox
        default-expand-all
        :node-key="String(Math.random())"
        ref="tree"
        highlight-current
        v-loading="this.loading"
        :props="defaultProps"
        icon-class="iconfont icon-neiye-zhankaijiantou"
      ></el-tree>
      </div>
    </my-dialog>


    <!-- <el-dialog
      title="影院选择"
      :visible.sync="selectTreeValue"
      width="576px"
      :before-close="handleClose"
      :lock-scroll="false"
    >
      <el-tree
        @node-click="nodeClick"
        :data="newselectValue"
        show-checkbox
        default-expand-all
        node-key="cinemaUID"
        ref="tree"
        highlight-current
        v-loading="this.loading"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelTreeBtn">取 消</el-button>
        <el-button type="primary" @click="confirmTreeBtn">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
import datacenterBus from "../../../assets/datacenterBus.js";
import MyDialog from "./myDialog.vue"
export default {
  components: {
    MyDialog
  },
  props: {
    selectValue: {
      type: null | Object,
      default: "",
      require: true
    }
  },
  data() {
    return {
      cinemaValue: this.selectValue.defVALUE,
      newselectValue: [],
      propSselectValue: this.selectValue,
      selectTreeValue: false,
      filterText: "",
      defaultProps: {
        children: "children",
        label: "orgName"
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
      let value = this.$refs.tree.getCheckedNodes();
      let cinemaUIDnewArray = [];
      let cinemaUID = [];
      let orgNameArray = [];
      let orgName = [];

      value.forEach(function(val) {
        if (val.cinemaUID != null) {
          cinemaUIDnewArray.push(val.cinemaUID);
          orgNameArray.push(val.orgName);
        }
      });
      var cinemaUIDstring = cinemaUIDnewArray.join(",");
      var orgNameString = orgNameArray.join(",");
      this.propSselectValue.queryColValue = cinemaUIDstring;
      this.cinemaValue = orgNameString;
      datacenterBus.$emit("cinemaValueEvent", orgNameString);
      this.selectTreeValue = false;
      console.log(orgNameString);
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
        //加载旋转圈圈
        this.loading = true;

        //调用api，展示影院树
        this.$rptList
          .getCinemaByParam()
          .then(data => {
            const treeValue = data.data;
            self.newselectValue = changeTreeJson(treeValue.result);
            Vue.nextTick(function() {
              self.loading = false;
            });
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
    }
  }
};

//转换后台json结构为element可用的结构
function changeTreeJson(valArr) {
  let newValArr = [];
  valArr.forEach(function(val) {
    let treeNode = {};
    treeNode.cinemaUID = val.cinemaUID;
    treeNode.orgName =
      val.children != null
        ? val.orgName
        : val.cinemaName != null
        ? val.cinemaName
        : val.orgName;
    if (val.children != null) {
      let childrenArr = changeTreeJson(val.children);
      treeNode.children = childrenArr;
    }
    newValArr.push(treeNode);
  });
  return newValArr;
}
</script>

<style>

</style>