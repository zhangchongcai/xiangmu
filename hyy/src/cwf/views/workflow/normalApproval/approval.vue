<template>
    <div class="approval">
        <el-dialog  width="80%" :title="contentText" :visible.sync="dialogVisible" :modal-append-to-body="false" @close="close">
            <!-- 审批数据 -->
            <el-form v-if="approvalInfo">
                <el-form-item  :label-width="formLabelWidth">
                    <div class="approval-item">
                        <span>任务编号：</span>
                        <span>{{approvalInfo.atId}}</span>
                    </div>
                    <div class="approval-item">
                        <span>创建时间：</span>
                        <span>{{approvalInfo.createTime}}</span>
                    </div>
                </el-form-item>
                <el-form-item  :label-width="formLabelWidth">
                    <div class="approval-item">
                        <span>审批状态：</span>
                        <span>{{approvalInfo.statusRespons==1?"待审批":"审批通过"}}</span>
                    </div>
                    <div class="approval-item">
                        <span>单据类型：</span>
                        <span>{{approvalInfo.bizTypeName}}</span>
                    </div>
                </el-form-item>
                <el-form-item  :label-width="formLabelWidth">
                    <div class="approval-item">
                        <span>申请人：</span>
                        <span>{{approvalInfo.applyUserName}}</span>
                    </div>
                    <div class="approval-item">
                        <span>申请人单位：</span>
                        <span>{{approvalInfo.applyGroupName}}</span>
                    </div>
                </el-form-item>
                <el-form-item  :label-width="formLabelWidth">
                    <div class="approval-item">
                        <span>业务单据号：</span>
                        <span>{{approvalInfo.bizNo}}</span>
                    </div>
                    <div class="approval-item">
                        <span>单据名称：</span>
                        <span>{{approvalInfo.bizName}}</span>
                    </div>
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
                     <el-table-column prop="atId" label="审批节点"></el-table-column>
                    <el-table-column prop="auditTime" label="审批时间"></el-table-column>
                    <el-table-column prop="tenantId" label="审批人"></el-table-column>
                    <el-table-column prop="auditOpinion" label="审批结果"></el-table-column>
                    <el-table-column prop="advice" label="审批意见"></el-table-column>
                </el-table>
            </el-card>
            <!-- 审批 -->
            <el-card class="box-card" shadow="never" >
                <div slot="header" class="clearfix">
                    <span>审批</span>
                </div>
                <div class="text item">
                    <el-row>
                        <label for="">审批结果：</label>
                        <el-radio v-model="approvalValue" label="1">审批通过</el-radio>
                        <el-radio v-model="approvalValue" label="2">驳回申请</el-radio>
                    </el-row>
                    <el-row>
                        <el-col :span="3">
                            <label for="">审批意见：</label>
                        </el-col>
                        <el-col :span="21">
                            <el-input
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="approvalAdvice"
                                maxlength="30"
                                show-word-limit
                            >
                            </el-input>
                        </el-col>
                    </el-row>
                    
                </div>
            </el-card>

            <div slot="footer" class="dialog-footer">
                <el-button @click="closeBack" >取 消</el-button>
                <el-button type="primary" @click="commitApproval">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
  export default {
    props:{
        approvalInfo:Object,//审批数据
        dialogFormVisible:Boolean//审批弹窗状态
    },
    data () {
      return {
        approvalValue:0,//审批结果
        contentText:"审批",//内容显示
        approvalAdvice:"",//审批意见
        tableData:[],//审批记录数据
        formLabelWidth: '120px',//审批信息宽度
        dialogVisible: this.dialogFormVisible,//显示弹窗状态
      }
    },
    computed:{
       
    },
    methods:{
        //设置参数处理
        setParam(){
            let param={}
                param.id=this.approvalInfo.atId
                param.abId=this.approvalInfo.abId
                param.status=this.approvalValue
                param.auditAppoint=this.approvalAdvice
            return param
        },
        //审批任务
        commitApproval(){
            if(!this.approvalValue){
                console.log("请审批任务")
                this.$message({
                    message: "请审批任务",
                    type: "warning",
                    duration: 1000
                });
                return
            }
            if(this.approvalValue=="2" && !this.approvalAdvice){
                this.$message({
                    message: "审批驳回必须要写审批意见",
                    type: "warning",
                    duration: 1000
                });
                return
            }
            let params=this.setParam()
            console.log(params)
            this.$cwfList.commitApproval(params).then(data => {
                if (data && data.code === 200) {
                    this.$message({
                        message: "审批成功",
                        type: "success",
                        duration: 1000
                    });
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
        //获取审批记录列表
        getApprovalrecordList(){
            let params={
                atId:1340
                // atId:this.approvalInfo.atId
            }
            this.$cwfList.getApprovalrecord(params).then(data => {
                if (data && data.code === 200) {
                    this.tableData=data.data.spAuditOpinionVoS
                    this.close("update")
                    this.$message({
                        message: "查询成功",
                        type: "success",
                        duration: 1000
                    });
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
        close(update){
            this.dialogVisible = false
            this.$emit("close")
             if(update){
                this.$emit("close",update)
            }else{
                this.$emit("close")
            }
        },
        //关闭弹窗回调函数
        closeBack(){
            this.dialogVisible = false
        }
    },
    created(){
        if(this.approvalInfo){
            this.getApprovalrecordList()
        }
        
        console.log(this.approvalInfo)
    }
  
}
</script>

<style lang="scss" scoped>
.approval{
    .approval-item{
        width: 50%;    
        float: left
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

