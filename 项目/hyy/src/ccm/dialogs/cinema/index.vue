<template>
    <div class="single-dialgo">
        <el-dialog
        title="选择影院"
        :visible.sync="framedialogVisible"
        :show-close="false"
        width="62%"
        :close-on-click-modal="false"
        >
        <div>
            <el-form :inline="true" ref="ruleForm" label-width="85px" size="small" class="film-search">
                <el-form-item label="影院编码：">
					<el-input v-model="searchAdition.code"></el-input>
				</el-form-item>
                <el-form-item label="影院全称：">
					<el-input v-model="searchAdition.fullName"></el-input>
				</el-form-item>
                <el-button type="primary" @click="searchFunc" icon="el-icon-search" style="margin-top: 1px;margin-left:8px;">搜索</el-button>
            </el-form>
        </div>
        <div class="single-dialog-body">
                <el-table :data="filmList" @row-click= "showRow"  height="308px" ref="filmListRef" highlight-current-row>
                    <el-table-column label="选择" width="50" align="center">
                        <template slot-scope="scope">
                            <el-radio class="radio"  v-model="selectedId" :label="scope.row.id">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
					<el-table-column prop="code" label="影院编码" show-overflow-tooltip></el-table-column>
					<el-table-column prop="name" label="影院全称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cityName" label="城市地区" show-overflow-tooltip>
                    </el-table-column>
				</el-table>
                <div class="page-wrap">
                    <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[10, 25, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                    </el-pagination>
                </div>
        </div>
        <div  class="dialog-footer">
            <el-button @click="closeDialog(false)">取 消</el-button>
            <el-button type="primary" @click="confirmData()">确 定</el-button>
        </div>
        
    </el-dialog>
    </div>
</template>

<script>
// import {authQueryUserCinemas} from 'frame_cpm/http/interface.js'
import {getCinemaList} from "cmm/http/interface.js"
export default {
    props: {
        innerData:{
            type:Object,
            default:()=>{},
            required: false
        }
    },
    data(){
        return {
            framedialogVisible:false,
            searchAdition:{
                code:'',
                fullName:'',
                provinceCode:'',
                cityName:'',
                regionName:'',
                userUid:JSON.parse(localStorage.getItem('user')).uid,
            },
            multipleSelection: [],
            filmList:[],
            provs:[],
            citys:[],
            areas:[],
            rules:{},
            total:0,
            pageSize:10,
            pageNum:1,
            selectedId: '',
		    selectedRows:null
        }
    },
    created(){
    },
    methods:{

        openDialog() {
            this.framedialogVisible = true
            this.listAuthCommCinemas()
        },
        closeDialog() {
            this.framedialogVisible = false

        },
        showRow(row){
            //赋值给radio
            let _this = this;
            let selectedRowsIndex = this.filmList.indexOf(row);
            this.selectedRows = row;
            _this.$nextTick(function () { 
                if(selectedRowsIndex != -1){
                    this.selectedId = row.id
                }
            })
        },
        confirmData(){
            let _this = this;
            let rowData = !!this.selectedRows?this.selectedRows:{}
            // console.log(cinemaIdss)
            _this.$emit('cinemaSingleCallBack',rowData) 
            this.framedialogVisible =false
        },
        //查询
        searchFunc(){
            this.listAuthCommCinemas();
        },
        selectable(row) {
            return row.approveStatus === 'WAIT_APPROVE'
        },

            listAuthCommCinemas(){
                let _this =this
                let postObj = {
                    name: this.searchAdition.fullName,
                    code: this.searchAdition.code,
                    userUid:this.searchAdition.userUid,
                    pageSize: this.pageSize,
                    pageNum: this.pageNum
                }
                getCinemaList(postObj).then( ret => {
                    if (ret && ret.code === 200) {
                        _this.total = ret.data.total
                        _this.filmList = ret.data.rows
                    } else {
                    }
                }).catch( err => {
                    console.log(err)
                })
            },
            //当前页数数目改变
			handleSizeChange(valua) {
				this.pageSize = valua;
				this.listAuthCommCinemas();
			},
				//当前页改变
			handleCurrentChange(valua) {
				this.pageNum = valua;
				this.listAuthCommCinemas();
			},
            submitForm(formName) {
                
            },

    }
}
</script>

<style lang="scss">
.single-dialgo{
    
    .el-dialog {
        .el-dialog__body,{
            padding: 20px 20px 10px 20px;
        }
        .el-dialog__header{
            border-bottom: 1px solid #f5f5f5;
        }
    }
}
</style>
<style lang="scss" scoped>
    .single-dialog-body{
        border: 1px solid #E5E5E5;
        .selected-ul{
            .li-item{
                width: 100%;
                clear: both;
                display: block;
            }
        }
    }
    .dialog-footer{
        margin-top:10px;
        text-align: center
    }
</style>
