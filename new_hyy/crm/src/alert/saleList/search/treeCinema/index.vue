<template>
  <div class="ccm-dialog">
    <el-dialog title="选择入账影院" :visible.sync="dialogVisible" width="576px" :close-on-click-modal="false">
      <div class="tree-content">
        <el-tree :data='orgArr' ref="tree" @node-click="handleNodeClick" node-key="id" default-expand-all :expand-on-click-node="false" :highlight-current="true" :props="defaultProps">
          <span style="padding:0px" slot-scope="{ node, data }">
            <el-radio v-model="customTree" :label="data.id">
              {{ node.label }}
            </el-radio>
          </span>
        </el-tree>
      </div>
      <div class="btn-area" slot="footer">
        <el-button type="primary" @click="chooseUser" style="margin-right:22px;">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import {orgList} from 'frame_cpm/http/interface.js'
export default {
  props: {
    customerType: {
      default: ''
    }
  },
  data () {
    return {
      customTree: '',
      innerData: '',
      dialogVisible: false,
      orgArr: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      selectItem: '',
      activeUid: '22'
    };
  },
  methods: {
    handleSelft (node, data, id) {
      let radioArr = document.querySelectorAll('.grounp-radio input');
      for (var i = 0; i < radioArr.length; i++) {
        radioArr[i].checked = false;
      }
      node.checked = true;
    },
    handleNodeClick (item) {
      this.selectItem = item;
      this.customTree = item.id;
    },
    // 确定选择
    chooseUser () {
      if (this.selectItem) {
        this.$emit('cinemaCallBack', this.selectItem);
      }
      this.dialogVisible = false;
    },
    // 打开弹窗
    openDialog (val, id) {
      this.innerData = id;
      this.dialogVisible = true;
      this.customTree = id;
      this.searchData();
    },
    // 查询JSON.parse(localStorage.getItem('user')).uid       ,
    searchData () {
      console.log('用户信息', this.$store.state.loginUser);
      let params = {
        userUid: this.$store.state.loginUser.uid // 商户id,
      };
      this.$crmList.getOrgTreeAndCinema(params).then(res => {
        if (res.code === 200) {
          this.orgArr = res.data;
        } else {
          this.error(res.msg);
        }
      })
        .catch(err => { });
    }

  }
};
</script>

<style lang="scss" scoped>
.ccm-dialog {
  .tree-content {
    height: 400px;
    overflow: auto;
  }
  /deep/ .el-dialog__header {
    .el-dialog__title {
      padding-bottom: 5px;
      width: 100%;
      display: inline-block;
      border-bottom: 1px solid #e5e5e5;
    }
  }
  /deep/ .el-dialog__body {
    padding: 0px 20px;
    border-bottom: 1px solid #e5e5e5;
  }
  /*被基础覆盖的样式，后期可去除*/
  /deep/
    .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background: #f0f7ff !important;
    color: #fff;
  }

  /deep/ .el-tree-node__content:hover {
    background-color: #eff4ff !important;
    color: #ffffff;
  }
}
</style>