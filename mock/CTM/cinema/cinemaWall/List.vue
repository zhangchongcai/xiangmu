<template>
    <div class="cinemaWall_list">
		<div class="content">
			<el-row style="padding:5px;">
				<el-button type="primary" plain class="xinjian" @click="addAndupdata('')">新建</el-button>
			</el-row>
			<el-row>
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
							<span class="icon-color"  @click="addAndupdata(scope.row.uid)">修改</span>
							<span class="icon-color" @click="wall_comfirm(scope.row.uid)">删除</span>
							<!-- <el-button-group>
								<el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
								<el-button size="mini" color="red" type="primary" icon="el-icon-delete"></el-button>
							</el-button-group> -->
							<span class="icon-color" @click="seatDesign(scope.row.uid)" >座位图设计</span>
						</template>
					</el-table-column>
				</el-table>
			</el-row>
			<div class="page-wrap">
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
				<el-button type="primary" plain class="xinjian" @click="confirm">确定</el-button>
			</div>
		</div>
		
	</div>
</template>
<script type="text/javascript">
import qs from 'qs';
	export default{
		components: {},
		data(){
			return {
					//总数
					total:1,
					//当前页
					current:1,
					//当前页数大小
					pageSize:10,
					//列表
					tableData: [],
			}
		},
		created() {
			this.getList();
		},
		methods: {
			//新建
			//修改
			addAndupdata(uid){
				this.$router.push({
					path:'addAndnew',
					query:{
						uid:uid?uid:'',
						cinemaUid:this.$route.query.cinemaUid,
					}
				})
			},
			//删除
			wall_comfirm(uid){
				// console.log(uid)
				let datas = {"hallUid":uid}
				datas = qs.stringify(datas)
				console.log(datas)
				this.$confirm(`您确定要删除此记录吗?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
				}).then(() => {
				this.$api.deleteCiHall(datas).then( data => {
					console.log(data)
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
						this.$message.error({message:data.msg})
					}

				}).catch( err => {
					console.log(err)
				})
				}).catch(() => {})
			},
			//确定
			confirm() {
				this.$router.go(-1);
			},
			//跳转座位编辑
			seatDesign(uid) {
				this.$router.push({
					path: '/CTM/cinemawall/seatdesign',
          query:{
            hallUid:uid,
            cinemaUid:this.$route.query.cinemaUid
          }
				});
			},
			handleCurrentChange(valua){
				this.current = valua;
				console.log(valua)
			},
			//获取列表数据
			getList() {
				let data = {
					cinemaUid:this.$route.query.cinemaUid,
					page:this.current,
					pageSize:this.pageSize,
					} ;
				this.$api.cinemagetList(data).then( data => {
					if (data && data.code === 200) {
						this.tableData = data.data.records ;
						this.total = data.data.total;
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
			//当前页数数目改变
			handleSizeChange(valua) {
				this.pageSize = valua;
				console.log(this.current);
				this.getList();
			},
			//当前页改变
			handleCurrentChange(valua) {
				this.current = valua;
				console.log(this.current,'当前页');
				this.getList();
			},
		}
	}
	
	
</script>
<style  lang="scss">
	.cinemaWall_list {
		box-sizing: border-box;
		width: 100%;
		.el-breadcrumb  {
			margin: 30px 0 20px 30px;
		}
	}
	//表格样式
	.cinemaWall_list .has-gutter tr th{
		background: #F2F4FD;
		color: #333333;
		font-family: MicrosoftYaHei; 
	}
	//行高
	.cinemaWall_list .el-table th{
		padding: 7px 0 ;
	}
	.cinemaWall_list .el-table td{
		padding: 7px 0 ;
	}
	//分页器高度
	.cinemaWall_list .el-pagination{
		height: 24px;
		padding: 0px 5px;
		ul{height: 24px;li{height: 24px;};}
		button{height: 24px;;}
	}
	.cinemaWall_list .erRow{
		margin-top: 24px;
	}

	.cinemaWall_list .icon-color{
		color: #3B74FF;
		cursor: pointer;
		margin-right: 6px;
	}
	.cinemaWall_list .xinjian{
		float: right;
	}
	.cinemaWall_list .el-pagination{
		text-align: center;
	}
	.cinemaWall_list .el-table::before{display: none}
	
</style>