<template>
    <div class="check">
        <el-dialog  width="80%"  :title="contentText" :visible.sync="dialogVisible" :modal-append-to-body="false" @close="close">
            <el-form v-if="checkInfo">
                <el-form-item  :label-width="formLabelWidth">
                    <div class="check-item">
                        <span>任务编号：</span>
                        <span>{{checkInfo.atId}}</span>
                    </div>
                    <div class="check-item">
                        <span>创建时间：</span>
                        <span>{{checkInfo.createTime}}</span>
                    </div>
                </el-form-item>
                <el-form-item  :label-width="formLabelWidth">
                    <div class="check-item">
                        <span>审批状态：</span>
                        <span>{{checkInfo.statusRespons==1?"待审批":"审批通过"}}</span>
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
                    <div class="check-item">
                        <span>单据名称：</span>
                        <span>{{checkInfo.bizName}}</span>
                    </div>
                </el-form-item>
            </el-form>

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

            <el-card class="box-card" shadow="never" v-if="showpageType">
                <div slot="header" class="clearfix">
                    <span>审批</span>
                </div>
                <div class="text item">
                    <el-row>
                        <label for="">审批结果：</label>
                        <el-radio v-model="radio" label="1">审批通过</el-radio>
                        <el-radio v-model="radio" label="2">驳回申请</el-radio>
                    </el-row>
                    <el-row>
                        <el-col :span="3">
                            <label for="">审批意见：</label>
                        </el-col>
                        <el-col :span="21">
                            <el-input
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="textarea"
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
            </div>
        </el-dialog>
    </div>
</template>


<script>
  export default {
    props:{
        checkInfo:Object,
        dialogFormVisible:Boolean
    },
    data () {
      return {
        contentText:"查看",
        radio:"",
        textarea:"",
        tableData:[],
        formLabelWidth: '120px',
        form: {
            name: '',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
        },
        dialogVisible: this.dialogFormVisible,
      }
    },
    computed:{
        showpageType(){
            if(this.contentText=="查询"){
                return false
            }
            if(this.contentText=="审批"){
                return true
            }
        }
    },
    methods:{
        getApprovalrecordList(){
            let params={
                atId:1340
                // atId:this.checkInfo.atId
            }
            this.$cwfList.getApprovalrecord(params).then(data => {
                if (data && data.code === 200) {
                    this.tableData=data.data.spAuditOpinionVoS
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
        close(){
            this.dialogVisible = false
            this.$emit("close")
        },
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
