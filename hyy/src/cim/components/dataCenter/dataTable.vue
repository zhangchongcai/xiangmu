<template>
	<div class="datacenter-main">
    	<el-table
	      :data="datatable"
	      style="width: 100%">
	      <template v-for="item in colArr">
		      <el-table-column
		        :prop="item.prop"
		        :label="item.label"
		        sortable
		        width="180"
				v-if="item.width == true"
		        >
		      </el-table-column>
		      <el-table-column
		        :prop="item.prop"
		        :label="item.label"
		        sortable
				v-if="item.width == false"
		        >
		      </el-table-column>
		    </template>
	    </el-table>	 
    </div>


</template>
<script>
	export default{
		props: {
			datatable: {
				type: Array,
				default: function () {
			        return []
			    }
			},
			Pagination:Object,
			colArr:[]
		},
		data(){
			return {
				
			}
		}
	}
</script>
<style Scoped>
.el-table th, .el-table td {
    padding: 7px 0;
}
.el-table th{
	background: #F2F4FD;
	padding: 1px 0;
}
</style>