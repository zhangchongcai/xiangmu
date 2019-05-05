<template>
<div>
	<input type="text" @click="selectTreeEvent">
	  <el-dialog
	  title="影院选择"
	  :visible.sync="selectTreeValue"
	  width="576px"
	  :before-close="handleClose">
	  <el-input
	  placeholder="输入关键字进行过滤"
	  v-model="filterText">
	  </el-input>
      <el-tree
		class="filter-tree"
		:data="newselectValue"
		:props="defaultProps"
		default-expand-all
		:filter-node-method="filterNode"
    show-checkbox
		ref="tree2">
	  </el-tree>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="selectTreeValue = false">取 消</el-button>
	    <el-button type="primary" @click="selectTreeValue = false">确 定</el-button>
	  </span>
	</el-dialog>
</div>
</template>
<script>
  export default {
  	props: {
  		selectValue: {
				type : null | Object,
				default : "", 
				require : true 
			} 
  	},
    data() {
      return {
        newselectValue:[],
        selectTreeValue: false,
        filterText: '',
        data2: [
        {
          id: 1,
          orgName: '一级 1',
          children: [{
            id: 4,
            orgName: '二级 1-1',
            children: [{
              id: 9,
              orgName: '三级 1-1-1'
            }, {
              id: 10,
              orgName: '三级 1-1-2'
            }]
          }]
        },
        {
          id: 2,
          orgName: '一级 2',
          children: [{
            id: 5,
            orgName: '二级 2-1'
          }, {
            id: 6,
            orgName: '二级 2-2'
          }]
        },
        {
          id: 3,
          orgName: '一级 3',
          children: [{
            id: 7,
            orgName: '二级 3-1'
          }, {
            id: 8,
            orgName: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'orgName'
        }
      };
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      selectTreeEvent(){
        let self =this
      	axios.get("http://58.67.170.171:8088/condition/getCinemaByParam",{

	  	}).then(function(response){
	  		const treeValue = response.data.data
        self.newselectValue = treeValue.result
	       	// datacenterBus.$emit('tableDataArrEventNoGroup',tableData)
        }).catch(function (error){
		    console.log(error)
		})
      	this.selectTreeValue = true
      }
    }
  };
</script>

<style Scoped>
/*.el-dialog__body{
    height: 500px;
    overflow: hidden;
}*/
</style>