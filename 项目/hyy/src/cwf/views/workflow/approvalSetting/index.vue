<template>
<div class="cwf_approvalSetting">
    <div>
        <!-- 搜索栏 -->
        <!-- <section>
        </section> -->

        <!-- 按钮组 -->
        <section class="flex-base flex-end">
            <el-row>
                <el-button  class="add" type="primary" plain @click="addDetail">新建</el-button>
            </el-row>
        </section>
        <!-- 表格 -->
        <section>
            <commonTable :tableData="tableData" :tableLabels="tableLabels" :tableOptions="tableOptions" @handleButton="handleButton"></commonTable>
        </section>
        <!-- 分页 -->
        <section class="flex-base flex-center pageStyle" v-if="tableData.length != 0">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background :current-page="pageConfig.currentPage" :page-sizes="pageConfig.pageSizes" :page-size="pageConfig.pageSize" layout="total, prev, pager, next, jumper, sizes" :total="pageConfig.total">
            </el-pagination>
        </section>
    </div>
    <!-- 删除弹窗 -->
    <el-dialog :visible.sync="deleteDialogTableVisible" class="delete-dialog" width="25%">
        <div class="dialog-content">
            <p><i class="el-icon-warning"></i>当前操作不可逆？您确定</p>
            <p style="padding-left:73px;">要继续吗？</p>
        </div>
        <div class="dialog-btn">
            <el-button type="primary" @click="deleteCommit" style="margin-right:29px;">继续</el-button>
            <el-button @click="deleteDialogTableVisible = false" style="margin-left:0px;">取消</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import commonTable from '../../../components/Table/commonTable.vue';
import minxins from 'frame_cpm/mixins/cacheMixin.js'

export default {
    components: {
        commonTable,
    },
    mixins: [minxins.cacheMixin],
    data() {
        return {
            cacheField: ["pageConfig"],//缓存对象数据
            subComName:"approvalSetting",//缓存数据唯一标识
            deleteDialogTableVisible:false,//删除弹窗显示
            commitDeteleData:{},//删除对象
            tenantId:JSON.parse(localStorage.getItem('user')).consumerId, //商户id
            //分页配置
            pageConfig: {
                start: 0,
                pageSize: 10,
                pageSizes: [10, 20, 30, 40],
                currentPage: 1,
                total: 0
            },
            //列表数据
            tableData: [],
            //列表显示项
            tableLabels: [{
                    prop: 'name',
                    label: '流程名称',
                    // width: '200',
                },
                {
                    prop: 'processList',
                    label: '流程示意图',
                    width: '500',
                    hasTemplate: true,
                    formatRole: (scope)=> {
                        
                    }
                },
                {
                    prop: 'updateTime',
                    label: '更新时间',
                    // width: '200',
                },
              
            ],
            //列表操作项
            tableOptions: {
                label: "操作",
                fixed: "right",
                width: '200',
                options: [{
                        text: "查看",
                        method: "checkDetail",
                        condition: (scope) => {
                            return true;
                        }
                    },
                    {
                        text: "编辑",
                        method: "editDetail",
                        condition: (scope) => {
                            return (scope.row.id != 2 && scope.row.name !="无需审批") && (scope.row.id != 1 && scope.row.name !="admin审批")
                        }
                    },
                    {
                        text: "删除",
                        method: "delDetail",
                        condition: (scope) => {
                            return (scope.row.id != 2 && scope.row.name !="无需审批") && (scope.row.id != 1 && scope.row.name !="admin审批")
                        }
                    }
                ]
            },
        }
    },
    created() {
        this.getDataList();
    },
    methods: {
        //搜索
        search() {
            this.pageConfig.currentPage=1
            this.getDataList();
        },
        //获取数据列表
        getDataList() {
            let params = {
                pageNo:this.pageConfig.currentPage,
                pageSize:this.pageConfig.pageSize,
                tenantId:this.tenantId
            };
            this.$cwfList.selectApprovalProcess(params).then(data => {
                if (data && data.code == 200 &&data.flag==1) {
                    this.tableData = data.data.list || [];
                    this.pageConfig.total = data.data.total || 0;
                } else {
                    this.tableData = [];
                    this.pageConfig.total = 0;
                    this.$message({
                        message: data.msg,
                        type: "warning",
                        duration: 1000
                    });
                }
            }).catch(err => {
                console.log(err)
            })
        },
        //操作列回调
        handleButton(data) {
            this[`${data.method}`](data.scope);
        },
        //查看
        checkDetail(scope){
            this.$router.push({
                path:"/workflow/checkApprovalSetting",
                query:{
                    type:"check",
                    spId:scope.row.id
                }
            })
        },
        //编辑
        editDetail(scope){
            this.$router.push({
                path:"/workflow/editApprovalSetting",
                query:{
                    type:"edit",
                    spId:scope.row.id
                }
            })
        },
        //增加
        addDetail(){
            this.$router.push({
                path:"/workflow/editApprovalSetting",
                query:{
                    type:"add",
                }
            })
        },
        //点击删除按钮
        delDetail(scope){
            this.openDeleteDialog(scope)
        },
        //打开删除弹窗
        openDeleteDialog(scope){
            if(scope){
                this.commitDeteleData=scope.row
            }else{
                this.commitDeteleData={}
            }
            console.log(this.commitDeteleData)
            this.deleteDialogTableVisible=true
        },
        //删除
        deleteCommit(){
            if(this.deleteDialogTableVisible && JSON.stringify(this.commitDeteleData) != "{}"){
                let params= {
                    id:this.commitDeteleData.id,
                    tenantId:this.tenantId
                }
                this.$cwfList.deleteApprovalProcess(params).then(data => {
                if (data && data.code === 200&& data.flag==1) {
                    this.deleteDialogTableVisible=false
                    this.commitDeteleData={}
                    this.search()
                    this.$message({
                        message: "删除成功",
                        type: "success",
                        duration: 1000
                    });
                } else {
                    this.deleteDialogTableVisible=false
                    this.commitDeteleData={}
                    this.$message({
                        message: data.msg,
                        type: "warning",
                        duration: 1000
                    });
                }
                }).catch(err => {
                    this.deleteDialogTableVisible=false
                    this.commitDeteleData={}
                    console.log(err)
                })
            }
        },
        //修改分页大小
        handleSizeChange(pageSize) {
            this.pageConfig.pageSize = pageSize;
            this.pageConfig.currentPage = 1;
            this.getDataList();
        },
        //页数变化
        handleCurrentChange(currentPage){
            this.pageConfig.currentPage = currentPage;
            this.getDataList();
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/comList.scss";
.cwf_approvalSetting{
    section {
        margin-bottom: 15px;
    }
    .add{
        float: right;
        width: 80px;
        height: 32px;
        line-height: 32px;
        font-size: 12px;
        text-align: center;
        padding: 0;
    }
    .el-pagination{
        text-align: center;
    }
    /deep/ .el-step__icon.is-text {
        margin-bottom: 5px;
    }
    //删除弹窗样式
    .delete-dialog{
        .dialog-content{
            padding: 0 20px 20px 20px;
            p{
                padding: 0 40px;
                text-align: left;
                font-size: 14px;
                color: #666666;
            }
            .el-icon-warning{
                font-size: 18px;
                color: #FF8900;
                margin-right: 15px;
            }
        }
        .dialog-btn{
            text-align: center;
            .el-button{
                width:80px;
                height: 32px;
                line-height: 32px;
                text-align: center;
                vertical-align: middle;
                padding: 0;
            }
        }
        /deep/ .el-dialog__body{
            padding: 20px;
        }
    }
    
}

</style>
