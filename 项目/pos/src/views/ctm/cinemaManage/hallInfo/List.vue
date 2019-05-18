<template>
    <div class="cinemaWall_list">
		<div class="content">
			<div class="title">
				<span style="color:#333;font-size:14px">影厅信息</span>	
				<el-button type="primary" plain  size="mini" @click="wall_build">新建</el-button>
			</div>
		
			<el-table
			stripe
			:data="tableData"
			>
				<el-table-column
				prop="name"
				label="影厅名称"
				show-overflow-tooltip
				>
				</el-table-column>
				<el-table-column
				prop="aliases"
				label="影厅别名"
				show-overflow-tooltip
				>
				</el-table-column>
				<el-table-column
				prop="code"
				label="影厅编码"
				show-overflow-tooltip
				>
				</el-table-column>
				<el-table-column
				prop="seatnum"
				label="座位数"
				show-overflow-tooltip
				>
				</el-table-column>
				<el-table-column
				prop="type"
				label="影厅类型"
				:formatter = "typeFormat"
				show-overflow-tooltip
				>
				</el-table-column>
				<el-table-column
				prop="status"
				label="状态"
				:formatter = "stateFormat"
				show-overflow-tooltip
				>
				</el-table-column>
				<el-table-column
				label="操作"
				show-overflow-tooltip
				>
					<template slot-scope="scope">
						<span class="icon-color"  @click="wall_modify(scope.row.uid)">修改</span>
						<span class="icon-color" @click="wall_comfirm(scope.row.uid)">删除</span>
						<span class="icon-color" @click="seatDesign(scope.row.uid)" >座位图设计</span>
					</template>
				</el-table-column>
			</el-table>
			
			<!-- <div class="page-wrap">
				<el-pagination
					background
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="current"
					:page-sizes="[10, 20, 30]"
					:page-size="pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total"
				>
				</el-pagination>
			</div> -->
		</div>
		
	</div>
</template>
<script type="text/javascript">
import qs from 'qs';
	export default{
		props:{
			cinemaUid:{
				type:String
			}
		},
		
		data(){
			return {
					//总数
					total:1,
					//当前页
					current:1,
					//当前页数大小
					pageSize:100,
					//列表
					tableData: [],
			}
		},
		created() {
			this.getList();
		},
		methods: {
			//新建
			wall_build(){
				this.$router.push({
					path:'/ctm/cinemawall/addAndnew',
					query:{
						cinemaUid:this.cinemaUid
					}
				})
				
			},
			//修改
			wall_modify(uid){
				this.$router.push({
					path:'/ctm/cinemawall/addAndnew',
					query:{
						uid:uid,
						cinemaUid:this.cinemaUid,
					}
				})
			},
			//删除
			wall_comfirm(hallUid){
				let datas = {"hallUid":hallUid}
				this.$confirm(`您确定要删除此记录吗?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
				}).then(() => {
					this.$api.deleteCiHall(datas).then( data => {
						console.log(data,'ffffffhhh')
						if (data && data.code === 200) {
							this.$message({
								message: '操作成功',
								type: 'success',
								duration: 1500,
								onClose: () => {
									this.getList()
								}
							})
						} else {
							this.$message({message:data.msg,type:'error'})
						}

					}).catch( err => {
						console.log(err,'错误请求')
					})
				}).catch(() => {})
			},
			//跳转座位编辑
			seatDesign(uid) {
				this.$router.push({
					path: '/ctm/cinemawall/seatdesign',
					query:{
						hallUid:uid,
						cinemaUid:this.cinemaUid
					}
				});
			},
			handleCurrentChange(valua){
				this.current = valua;
				console.log(valua)
			},
			//获取列表数据
			getList() {
				console.log(this.cinemaUid,'当前影院uid')
				let data = {
						cinemaUid:this.cinemaUid,
						page:this.current,
						pageSize:this.pageSize,
					}
				this.$api.cinemagetList(data).then( data => {
					if (data && data.code === 200) {
						this.tableData = data.data.list 
						this.total = data.data.total
						console.log(data.data)
					} else {
					}
					}).catch( err => {
						console.log(err,1111)
					})
			},
			//状态转换
			stateFormat(row, column) {
				if (row.status === 0) {
					return '无效'
				} else if (row.status === 1) {
					return '有效'
				}
			},
			//影厅类型转换
			typeFormat(row,column) {
				if (row.type == "3D") {
					return '3D影厅'
				} else if (row.type == "MAX") {
					return '巨幕影厅'
				}else if (row.type == "MAX3D") {
					return '3D巨幕影厅'
				}else if (row.type == "Normal") {
					return '普通影厅'
				}else{
					return row.type
				}
			},
			//当前页数数目改变
			handleSizeChange(valua) {
				this.pageSize = valua;
				this.getList();
			},
			//当前页改变
			handleCurrentChange(valua) {
				this.current = valua;
				this.getList();
			},
		}
	}
	
	
</script>
<style  lang="scss">
	.cinemaWall_list {
		box-sizing: border-box;
		padding-right: 20px;

		.el-breadcrumb  {
			margin: 30px 0 20px 30px;
		}
		.title{
			display: flex;
			line-height: 32px;
			justify-content: space-between;
			padding:5px 0 8px 0;
		}
	}
	
	
	.cinemaWall_list .erRow{
		margin-top: 24px;
	}

	.cinemaWall_list .icon-color{
		color: #3B74FF;
		cursor: pointer;
		margin-right: 6px;
	}
	
	
</style>