<template>
    <div class="datacenter-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">基础设置</el-breadcrumb-item>
		  <el-breadcrumb-item>{{ this.reportName }}</el-breadcrumb-item>
		</el-breadcrumb>
    </div>
</template>
<script>
	export default{
		props: {
			// 报表名字
			reportName:String
		},
		data(){
			return {
				
			}
		},
		methods: {
	      
	    }
	}
</script>
<style Scoped>
	.datacenter-header .el-breadcrumb{
		font-size:12px;
		width:100%;
		height:36px;
		line-height:36px;
		background:#FFFFFF;
	}
</style>