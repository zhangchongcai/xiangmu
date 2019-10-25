<template>
  <div class="cinema-select">
    <el-button @click="dialogVisible = true">切换当前影院</el-button>

    <el-dialog title="选择影院" :visible.sync="dialogVisible">

      <el-tree :data="data" :props="defaultProps" default-expand-all @node-click="handleNodeClick">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span v-if="data.children.length">{{ node.label }}</span>
          <el-radio v-else v-model="label" :label="node.label" @click.native.stop @change="handleCheckChange(node, data)"></el-radio>
        </span>
      </el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'CinemaSelect',
  data () {
    return {
      label: '',
      dialogVisible: false,
      data: [],
      currentData: {},
      currentCinema: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      }

    };
  },

  methods: {

    handleCheckChange (node, data) {
      console.log(node, data);
      console.log(this.label);
      this.currentData = data;
    },

    confirm () {

    },

    handleNodeClick (data) {
      // this.currentData = data
    },

    getCinemaTree () {
      this.$api.getCinemaTree().then(res => {
        console.log(res);
        if (res.code === 200) {
          this.data = [res.data];
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  },
  mounted () {
    this.getCinemaTree();
  }

};
</script>

<style scoped>
</style>