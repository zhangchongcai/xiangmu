<template>
    <div class="ccm-single-dialog">
        <el-dialog
        title="选择品牌"
        :visible.sync="framedialogVisible"
        width="62%"
        :close-on-click-modal="false"
        >
        <div class="search-header">
            <el-form :inline="true" ref="ruleForm"  size="small" class="film-search">
                <el-form-item label="品牌编码:">
					<el-input v-model="searchAdition.brandCode"></el-input>
				</el-form-item>
                <el-form-item label="品牌名称：" style="margin-left:8px">
					<el-input v-model="searchAdition.brandName"></el-input>
				</el-form-item>
                <el-button type="primary" @click="searchFunc"  style="position:absolute;right:20px">查询</el-button>
            </el-form>
        </div>
        <div class="ccm-dialog-body">
                <el-table :data="tableData" @row-click= "showRow"   height="308px" ref="filmListRef" highlight-current-row>
                    <el-table-column label="选择" width="50">
                        <template slot-scope="scope">
                            <el-radio v-model="selectedId" :label="scope.row.id">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <template v-for="(item,index) in tableConfig" >
                        <el-table-column :key="index" v-if="item.hasTemplate" 
                        :prop="item.prop?item.prop:''" 
                        :label="item.label?item.label:''" 
                        :width="item.width?item.width:''" >
                            <div slot-scope="scope">
                                {{formatStatus(scope.row.stockStatus)}}
                            </div>
                        </el-table-column>
                        <el-table-column :key="index" v-else :prop="item.prop?item.prop:''" :label="item.label?item.label:''" :width="item.width?item.width:''"></el-table-column> -->
                    </template>
					
				</el-table>
                <div class="page-wrap">
                    <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="searchAdition.page"
                    :page-sizes="[10, 25, 50, 100]"
                    :page-size="searchAdition.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="searchAdition.total">
                    </el-pagination>
                </div>
        </div>
         <span slot="footer" class="dialog-footer">
              <slot name="footerId"></slot>
            <el-button @click="closeDialog(false)">取 消</el-button>
            <el-button type="primary" @click="confirmData()">确 定</el-button>
        </span>
        
    </el-dialog>
    </div>
</template>

<script>
import {findBrandList} from "cim/http/cim/basicSettings.js"

export default {
    data(){
        return {
            framedialogVisible:false,
            searchAdition:{
                pageSize: 10,
                size: 1,
                total: 0,
                brandCode:'',
                brandName:'',
            },
            multipleSelection: [],
            rules:{},
            selectedId: '',
            selectedRow:null,
            tableData:[],
            tableConfig:[
                {
                    prop:'code',
                    label:'品牌编码',
                    width:''
                },
                {
                    prop: 'name',
                    label: '品牌名称',
                    width: ''
                }
            ]
        }
    },
    created(){
    },
    methods:{
        //状态转换
        formatStatus(status) {},
        
        openDialog() {
            this.framedialogVisible = true
            this.search()
        },
        closeDialog() {
            this.framedialogVisible = false

        },
        showRow(row){
            //赋值给radio
            let _this = this;
            this.selectedRow = row;
            _this.selectedId = row.id
        },
        confirmData(){
            let _this = this;
            let cinemaIdss = !!this.selectedRow?this.selectedRow:{}
            _this.$emit('selectedBrandSingleCallBack',this.selectedRow) 
            this.framedialogVisible =false
        },
        //查询
        searchFunc(){
            this.searchAdition.page = 1 
            this.search();
        },
        search(){
            let postObj = this.searchAdition
            findBrandList(postObj).then( res => {
                if (res && res.code === 200) {
                   this.tableData = res.data.list
                   this.searchAdition.total = res.data.total
                } else {
                    this.$message.error("查询失败")
                }
            }).catch( err => {
                console.log(err)
            })
        },
        //当前页数数目改变
        handleSizeChange(valua) {
            this.searchAdition.pageSize = valua;
            this.search();
        },
            //当前页改变
        handleCurrentChange(valua) {
            this.searchAdition.page = valua;
            this.search();
        }

    }
}
</script>

<style lang="scss">
    .ccm-single-dialog{
        .film-top{
            margin-left:10px;
        }
        .el-dialog__header{
            .el-dialog__title{
                padding-bottom: 5px;
                width: 100%;
                display: inline-block;
                border-bottom: 1px solid #e5e5e5;
            }
        }
        .el-dialog {
            .el-dialog__body{
                padding: 20px;
            }
        }
        .ccm-dialog-body{
            border:1px solid #e5e5e5;
        }
    }

</style>
