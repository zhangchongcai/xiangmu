<template>
<div>
	<!-- <input type="text" > -->
	  <el-dialog
	  title="影院选择"
	  :visible.sync="selectCinemaStatus"
	  width="576px"
	  :before-close="handleClose">
	  <el-input
	  placeholder="输入关键字进行过滤"
	  v-model="filterText">
	  </el-input>
      <el-tree
        class="filter-tree"
        :data="getCinemaTreeList"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        show-checkbox
        node-key="uid"
        ref="tree2">
	  </el-tree>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="selectCinemaStatusChange(false)">取 消</el-button>
	    <el-button type="primary" @click="selectedCinemaFun(false)">确 定</el-button>
	  </span>
	</el-dialog>
</div>
</template>
<script>
  export default {
    props: ['selectValue', 'selectCinemaStatus', 'getCinemaTreeList', 'getSelectedCinema', 'selectCinemaClose',
      'ciCinemaList'
    ],
    data() {
      return {
        newselectValue: [],
        // selectCinemaStatus: true,
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      };
    },
    watch: {

      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    methods: {
      handleClose() {
        let self = this
        this.$confirm('确认关闭？')
          .then(_ => {
            self.selectCinemaStatusChange(false)
          })
          .catch(_ => {});
      },
      initCheckedTreeNode(val) {

        console.log('执行了吗', val)
        this.$refs.tree2.setCheckedNodes(val);
      },
      selectCinemaStatusChange(val) {
        this.$emit("selectCinemaClose", val);
      },
      selectedCinemaFun(val) {
        let value = this.$refs.tree2.getCheckedNodes()
        this.$emit("getSelectedCinema", value);
        this.$emit("selectCinemaClose", val);
      },
      handleClose() {

      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
    }
  };
</script>

<style Scoped>
  /*.el-dialog__body{
    height: 500px;
    overflow: hidden;
}*/
</style>