<template>
    <div class="check">
        <el-dialog  width="80%"  :close-on-click-modal="false" :title="contentText" :visible.sync="dialogVisible" :modal-append-to-body="false" @close="close">
            <!-- 审批数据 -->
            <el-form v-if="checkInfo">
                <el-form-item  :label-width="formLabelWidth">
                    <div class="check-item">
                        <span>单据名称：</span>
                        <span>{{checkInfo.bizName || ""}}</span>
                    </div>
                    <div class="check-item-first">
                        <span>创建时间：</span>
                        <span>{{checkInfo.createTime}}</span>
                    </div>
                </el-form-item>
                <el-form-item  :label-width="formLabelWidth">
                    <div class="check-item">
                        <span>审批状态：</span>
                        <span  v-if="checkInfo.statusRespons==1">待审批</span>
                        <span  v-if="checkInfo.statusRespons==2">审批通过</span>
                        <span  v-if="checkInfo.statusRespons==3">驳回审批</span>
                        <span  v-if="checkInfo.statusRespons==4">未审批</span>
                    </div>
                    <div class="check-item">
                        <span>单据类型：</span>
                        <span>{{checkInfo.bizTypeName}}</span>
                    </div>
                </el-form-item>
                <el-form-item  :label-width="formLabelWidth">
                    <div class="check-item">
                        <span>申请人：</span>
                        <span>{{checkInfo.applyUserName}}</span>
                    </div>
                    <div class="check-item">
                        <span>申请人单位：</span>
                        <span>{{checkInfo.applyGroupName}}</span>
                    </div>
                </el-form-item>
                <el-form-item  :label-width="formLabelWidth">
                    <div class="check-item">
                        <span>业务单据号：</span>
                        <span>{{checkInfo.bizNo}}</span>
                    </div>
                    <!-- <div class="check-item">
                        <span>任务编号：</span>
                        <span>{{checkInfo.atId}}</span>
                    </div> -->
                </el-form-item>
            </el-form>
            <!-- 审批记录 -->
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span>审批记录</span>
                    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                </div>
                <el-table
                    :data="tableData"
                    style="width: 100%"
                >
                    <el-table-column prop="workflowNoteNum" label="审批节点"></el-table-column>
                    <el-table-column prop="atId" label="任务编号"></el-table-column>
                    <el-table-column prop="auditTime" label="审批时间"></el-table-column>
                    <el-table-column prop="auditUserName" label="审批人"></el-table-column>
                    <el-table-column prop="auditResult" label="审批结果">
                        <template slot-scope="scope">
                            {{ scope.row.auditResult==1?"待审批":""}}
                            {{ scope.row.auditResult==2?"审批通过":""}}
                            {{ scope.row.auditResult==3?"驳回审批":""}}
                            {{ scope.row.auditResult==4?"未审批":""}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="auditOpinion" label="审批意见"></el-table-column>
                </el-table>
            </el-card>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeBack" >取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
  export default {
    props:{
        checkInfo:Object, //查看审批数据
        dialogFormVisible:Boolean //查看弹窗状态
    },
    data () {
      return {
        workflowNoteNum:"",//审批流程节点
        contentText:"查看", //标题内容
        tableData:[],//审批记录渲染数据
        formLabelWidth: '120px',//审批信息宽度
        dialogVisible: this.dialogFormVisible,//显示弹窗状态
      }
    },
    computed:{
        
    },
    methods:{
        //获取审批记录
        getApprovalrecordList(){
            let params={
                atId:this.checkInfo.atId
            }
            this.$cwfList.getApprovalrecord(params).then(data => {
                if (data && data.code === 200 &&data.flag==1) {
                    this.tableData=data.data
                } else {
                    this.$message({
                        message: data.msg,
                        type: "warning",
                        duration: 1000
                    });
                }
            }).catch(err => {
                console.log(err)
            })
            // this.dialogFormVisible = false
        },
        //关闭弹窗
        close(){
            this.dialogVisible = false
            this.$emit("close")
            
        },
        //关闭弹窗回掉函数
        closeBack(){
            this.dialogVisible = false
        }
    },
    mounted(){
        // console.log(this.checkInfo)
        if(this.checkInfo){
            this.getApprovalrecordList()
        }
    }
  
}
</script>

<style lang="scss" scoped>
.check{
    .check-item{
        width: 50%;    
        float: left
    }
    .check-item-first{
        width: 50%;  
        float: right
    }
    .el-form-item{
        margin-bottom:0 ;
    }
    .box-card{
        margin-bottom: 15px;
    }
   
}
.el-row{
    margin-bottom: 20px;
}


</style>
