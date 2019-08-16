<template>
    <div class="ccm_dialog">
        <el-dialog
        title="选择打印票版"
        :visible.sync="framedialogVisible"
        :show-close="false"
        width="32%"
        :close-on-click-modal="false"
        append-to-body
        >
        <!-- <div>
            <el-form :inline="true" ref="ruleForm" label-width="85px" size="small" class="film-search">
                <el-form-item label="影院编码：">
					<el-input v-model="pageConfig.code"></el-input>
				</el-form-item>
                <el-form-item label="影院全称：">
					<el-input v-model="pageConfig.fullName"></el-input>
				</el-form-item>
                <el-button type="primary" @click="searchFunc" icon="el-icon-search" style="margin-top: 1px;margin-left:8px;">搜索</el-button>
            </el-form>
        </div> -->
        <div class="single-dialog-body">
                <el-table :data="tableList.data" @row-click= "showRow"  height="308px" ref="tableListRef" highlight-current-row>
                    <el-table-column label="选择" width="50" align="center">
                        <template slot-scope="scope">
                            <el-radio class="radio"  v-model="selectedId" :label="scope.row.id">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <template v-for="(item,index) in tableList.title" >
                        <el-table-column :prop="item.prop" :label="item.lable" :key="index" show-overflow-tooltip>{{item.label}}</el-table-column>
                    </template>
				</el-table>
                <div class="page-wrap">
                    <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageConfig.pageNum"
                    :page-sizes="[10, 25, 50, 100]"
                    :page-size="pageConfig.pageSize"
                    layout="prev, pager, next, jumper"
                    :total="pageConfig.total">
                    </el-pagination>
                </div>
        </div>
        <div  class="dialog-footer">
            <el-button type="primary" @click="confirmData()">确 定</el-button>
            <el-button @click="closeDialog(false)">取 消</el-button>
        </div>
        
    </el-dialog>
    </div>
</template>

<script>
import {getPrintModel} from "cmm/http/interface.js"
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
            pageConfig:{
                total:0,
                pageSize:10,
                pageNum:1,
            },
            tableList:{
                data:[],
                title:[{
                    lable:'票版名称',
                    prop:'name'
                }]
            },
            selectedId: '',
		    selectedRows:null
        }
    },
    created(){
    },
    methods:{

        openDialog() {
            this.framedialogVisible = true
            this.searchData()
        },
        closeDialog() {
            this.framedialogVisible = false

        },
        showRow(row){
            //赋值给radio
            let _this = this;
            this.selectedRows = row;
            _this.$nextTick(function () { 
                this.selectedId = row.id
            })
        },
        confirmData(){
            let _this = this;
            if(!this.selectedRows){
                return this.$message({
                    type:'warning',
                    message:'请选择一个票版！'
                })
            }
            _this.$emit('selecteTemplateCallBack',this.selectedRows) 
            this.framedialogVisible =false
        },
        //查询
        searchFunc(){
            this.searchData();
        },
        selectable(row) {
            return row.approveStatus === 'WAIT_APPROVE'
        },

        searchData(){
            let _this = this 
            let params = {
                pageNo : this.pageConfig.pageNo,
                pageSize : this.pageConfig.pageSize
            }
            this.$ccmList.selectmodel(params).then(ret => {
                if (ret && ret.code === 200) {
                    _this.total = ret.data.total
                    _this.tableList.data = ret.data.list
                } else {
                }
            }).catch( err => {
                console.log(err)
            })
        },
        //当前页数数目改变
        handleSizeChange(valua) {
            this.pageSize = valua;
            this.searchData();
        },
            //当前页改变
        handleCurrentChange(valua) {
            this.pageNum = valua;
            this.searchData();
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
@import '../../assets/css/dialogs.scss'
</style>
