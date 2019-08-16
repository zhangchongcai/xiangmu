<template>
    <div class="cinemaList">
		<div class="searchAdition">
			<el-form :inline="true"  class=" search-form" size="small">
				<div class="search-warp">
					<span>内部管理编号:</span>
					<el-input v-model="searchAdition.mgCode"></el-input>
				</div>

				<div class="search-warp">
					<span>影院编码:</span>
					<el-input v-model="searchAdition.code"></el-input>
				</div>
				<div class="search-warp">
					<span>影院名称:</span>
					<el-input v-model="searchAdition.name"></el-input>
				</div>
				<div class="search-warp">
					<span>影院联系人:</span>
					<el-input v-model="searchAdition.contactMan"></el-input>
				</div>
				<div class="search-warp">
					<span>手机号码:</span>
					<el-input v-model="searchAdition.mphone"></el-input>
				</div>
				<div class="search-warp">
					<span>状态:</span>
					<el-select v-model="searchAdition.status">
						<el-option label="全部" value=""> <span style="font-size:12px">全部</span> </el-option>
						<el-option label="营业" value="1"> <span style="font-size:12px">营业</span> </el-option>
						<el-option label="测试" value="2"> <span style="font-size:12px">测试</span> </el-option>
					</el-select>
				</div>
				<el-button type="primary" @click="search" style="float:right;width:80px;height:32px;font-size:12px"  >查询</el-button>
			</el-form>
		</div>
		<div class="content">			
			<el-row>
				<el-table
				:data="tableData"
				stripe
				>
					<el-table-column
					prop="mgCode"
					label="内部管理编号"
					show-overflow-tooltip
					>
					</el-table-column>
					<el-table-column
					prop="code"
					label="影院编码"
					show-overflow-tooltip
					>
					</el-table-column>
					<el-table-column
					prop="name"
					label="影院名称"
					show-overflow-tooltip
					>
					</el-table-column>
					<el-table-column
					prop="areaName"
					label="所在城市"
					show-overflow-tooltip
					>
					</el-table-column>
					<el-table-column
					prop="contactMan"
					label="联系人"
					show-overflow-tooltip
					>
					</el-table-column>
                    <el-table-column
					prop="mphone"
					label="手机号码"
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
							<el-button  type="text" size="small"  @click="cinema_search(scope.row.uid)">查看</el-button>
							<el-button  type="text" size="small"  @click="cinema_edit(scope.row.uid)">编辑</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-row>
			
			<div class="page-wrap">
				<span v-if="total<15" style="color:#666;font-size:14px">共{{tableData.length}}条</span>
				<el-pagination
					v-if="total>15"
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
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
import minxins from 'frame_cpm/mixins/cacheMixin.js'
	export default {
		mixins: [minxins.cacheMixin],
		components:{},
		data(){
			return {
				// /* 缓存数据 */
				cacheField: ["total","current","pageSize","tableData","searchAdition"],
				subComName:['cinema'],
					//总数
					total:1,
					//当前页
					current:1,
					//当前页数大小
					pageSize:10,
					//列表
					tableData: [],
					//查询条件
					searchAdition: {
						mgCode:"",
						name:"",
						code:"",
						contactMan:"",
						mphone:"",
						status:"",
					}
			}
        } ,
		methods : {
			//修改
			cinema_search(uid){
				this.$router.push({
					path:'search',
					query:{
						uid:uid
					}
				})
			},
			//查看
			cinema_edit(uid){
				this.$router.push({
					path:'edit',
					query:{
						uid:uid
					}
				})
			},
			//状态
			stateFormat(row, column) {
				if (row.status == 1) {
				return '营业'
				} else if (row.status == 2) {
				return '测试'
				}
			},
			//查询
			search(){
				this.getList();
			},
			//获取列表数据
				getList(){
					let limit = {
						'page': this.current,
						'pageSize':this.pageSize 
					}
					let addition = this.searchAdition;
					this.$ctmList.cinemaList(limit,addition).then( data => {
						if (data && data.code === 200) {
							this.tableData = data.data.list;
							this.total = data.data.total;
							this.currPage = data.current;
						} else {
						}
					}).catch( err => {
						console.log(err)
					})
				
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
				console.log(this.current);
				this.getList();
			},
		},
		
		created() {
			this.getList();
		},
	}
	
	
</script>
<style  lang="scss">
	.cinemaList {
		box-sizing: border-box;
		width: 100%;
		.search-form{
			background: #F5F5F5;
			padding: 24px 24px 24px 24px;
			margin-bottom: 10px;
			.search-warp{
				display: inline-block;
				height: 32px;
				line-height: 32px;
				color: #666;
				margin-bottom: 8px;
				margin-right: 28px;
				font-size: 0px;
				&> span{font-size: 12px;display: inline-block;width: 80px;}
				.el-input{
					font-size: 12px;
					display: inline-block;
					width: 200px;
					margin-left: 16px;
					color: #666;
				}
			}
		}
		
	}

	.cinemaList .el-pagination{
		text-align: center;
	}
	
</style>