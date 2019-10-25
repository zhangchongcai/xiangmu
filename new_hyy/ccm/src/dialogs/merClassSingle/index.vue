<template>
  <div class="tree-ccm-dialog">
    <el-dialog title="选择商品分类" :visible.sync="dialogVisible" width="576px" :close-on-click-modal="false">
      <div class="tree-content">
        <el-tree :data="merClassArr" default-expand-all node-key="seq" ref="tree" :props="defaultProps" @node-click="handleNodeClick" :close-on-click-modal="false">
          <span style="padding:0px" slot-scope="{ node, data }">
            <el-radio v-model="customTree" :label="data.uid">
              {{ node.label }}
            </el-radio>
          </span>
        </el-tree>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="chooseUser" style="margin-right:17px;">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
// import { cusList } from 'frame_cpm/http/interface.js';
import { baseInterface } from 'base';
const { cusList } = baseInterface;

export default {
  props: {
    customerType: {
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: false,
      customTree: '',
      merClassArr: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selectItem: '',
      activeUid: '22'
    };
  },
  methods: {
    // 树的重新构建
    handleNodeClick (item) {
      console.log(item);
      this.selectItem = item;
      this.customTree = item.uid;
    },
    // 确定选择
    chooseUser () {
      this.$emit('merClassSingleCallBack', this.selectItem);
      this.dialogVisible = false;
    },
    // 打开弹窗
    openDialog (val, uid) {
      this.dialogVisible = val;
      this.customTree = uid;
      this.searchData();
    },
    // 查询
    searchData () {
      this.$cimList.getCategoryTrees({}).then(res => {
        if (res.code === 200) {
          let merClassData = [];
          merClassData.push(res.data);
          this.merClassArr = JSON.parse(JSON.stringify(merClassData));
        } else {
          this.error(res.msg);
        }
      })
        .catch(err => { });
    }

  }
};
</script>

<style lang="scss">
.tree-ccm-dialog {
  .el-dialog__title {
    display: inline-block;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
  }
  .el-dialog {
    .el-dialog__body {
      margin: auto;
    }
  }
  .tree-content {
    height: 380px;
    overflow: auto;
  }
  .pagation,
  .btn-area {
    padding-top: 10px;
    text-align: center;
  }
  .el-dialog__body {
    padding: 0px 20px;
    border-bottom: 1px solid #e5e5e5;
  }
  .el-radio__label {
    padding: 0;
  }
}
</style>