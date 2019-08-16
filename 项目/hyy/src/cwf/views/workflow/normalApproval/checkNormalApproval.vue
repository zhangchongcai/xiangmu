<template>
    <div class="cwf_checkNormalApproval">
        <el-form >

        </el-form>
        <el-collapse v-model="activeNames" class="collapse-style">
            <!-- 审批基础信息 -->
            <el-collapse-item title="审批基础信息" name="1" style="margin-top: 17px; padding-bottom:0px;">
                <el-row class="checkNormalApproval-item">
                    <el-col :span="12" v-for="item in checkInfoList" :key="item.label" class="check-item-box">
                        <div class="check-item-lable">{{ item.label }}：</div>
                        <div class="check-item-content">{{ item.content || "-"}}</div>
                    </el-col>
                </el-row>
            </el-collapse-item>
            <!-- 各模块详情（暂时关闭等待开发联调） -->
            <el-collapse-item :title="orderDetailName" name="2" v-if="false">
              
            </el-collapse-item>
            <!-- 审批记录 -->
            <el-collapse-item title="审批记录" name="3">
                <div class="checkNormalApproval-item">
                    <el-table :data="tableData" style="width: 100%">
                        <el-table-column prop="workflowNoteNum" label="审批节点" :formatter="formateEmpty"></el-table-column>
                        <el-table-column prop="atId" label="任务编号" :formatter="formateEmpty"></el-table-column>
                        <el-table-column prop="auditTime" label="审批时间" :formatter="formateEmpty"></el-table-column>
                        <el-table-column prop="auditUserName" label="审批人" :formatter="formateEmpty"></el-table-column>
                        <el-table-column prop="auditResult" label="审批结果">
                            <template slot-scope="scope">
                                {{ scope.row.auditResult==1?"待审批":""}}
                                {{ scope.row.auditResult==2?"审批通过":""}}
                                {{ scope.row.auditResult==3?"驳回审批":""}}
                                {{ scope.row.auditResult==4?"未审批":""}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="auditOpinion" label="审批意见" :formatter="formateEmpty"></el-table-column>
                    </el-table>
                </div>
            </el-collapse-item>
            <!-- 审批任务 -->
            <el-collapse-item title="审批任务" name="4" v-if="type=='approval'">
                <div class="checkNormalApproval-item">
                    <div class="">
                        <el-row style="margin-bottom:16px;">
                            <label style="padding-right:20px;">审批结果：</label>
                            <el-radio v-model="formData.status" label="2">通过</el-radio>
                            <el-radio v-model="formData.status" label="3">驳回</el-radio>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <label style="display:inline-block;float:left;padding-right:20px;">审批意见：</label>
                                <div style="display:inline-block; float:left; width:360px;height:177px;">
                                    <el-input
                                        type="textarea"
                                        placeholder="请输入内容"
                                        v-model="formData.auditAppoint"
                                        maxlength="500"
                                        :show-word-limit="true"
                                    >
                                    </el-input>
                                </div >
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
        <div class="footer">
            <template v-if="type=='approval'">
                <el-button type="primary" @click="commitApproval">确 定</el-button>
                <el-button @click="closeBack">取 消</el-button>
            </template>
            <template v-if="type=='check'">
                <el-button @click="closeBack">返 回</el-button>
            </template>
           
        </div>
    </div>
</template>


<script>
  export default {
    data () {
      return {
        activeNames: ['1','2','3','4'],
        orderDetailName:"采购入库单",//各模块名称
        atId:this.$route.query.atId || "",//任务id
        type:this.$route.query.type || "", //编辑、查看
        // 审批任务数据
        formData:{
            id:this.$route.query.atId || "",//任务id
            abId:"",//abId
            status:"2",//审批任务选中
            auditAppoint:"",//审批意见
        },
        //审批基础信息渲染列表
        checkInfoList:[
            {
                label:"单据名称",
                name:"bizName",
                content:"",
            },
            {
                label:"创建时间",
                name:"createTime",
                content:"",
            },
            {
                label:"审批状态",
                name:"status",
                content:"",
            },
            {
                label:"单据类型",
                name:"businessName",
                content:"",
            },
            {
                label:"申请人",
                name:"applyUserName",
                content:"",
            },
            {
                label:"申请人单位",
                name:"applyGroupName",
                content:"",
            },
            {
                label:"业务单据号",
                name:"bizNo",
                content:"",
            },
        ],
        tableData:[],//审批记录渲染数据
      }
    },
    mounted(){
        this.findspAuditBillRecord()
        this.getApprovalrecordList()
    },
    methods:{
        //列表过滤空数据
        formateEmpty(row, column, cellValue, index) {
            return cellValue ? cellValue : "-";
        },
        //获取审批记录
        getApprovalrecordList(){
            let params={
                atId:this.atId
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
        },
        //审批任务
        commitApproval(){
            if(!this.formData.status){
                console.log("请审批任务")
                this.$message({
                    message: "请审批任务",
                    type: "warning",
                    duration: 1000
                });
                return
            }
            if(this.formData.status=="3" && !this.formData.auditAppoint){
                this.$message({
                    message: "审批驳回必须要写审批意见",
                    type: "warning",
                    duration: 1000
                });
                return
            }
            let params=this.formData
            console.log(params)
            this.$cwfList.commitApproval(params).then(data => {
                if (data && data.code === 200&&data.flag==1) {
                    this.$message({
                        message: "审批成功",
                        type: "success",
                        duration: 1000
                    });
                    this.$router.push({
                        path:"/workflow/normalApproval",
                    })
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
        },
        //根据任务id获取单据详情
        findspAuditBillRecord(){
            let params={
                id:this.atId
            }
            this.$cwfList.findspAuditBillRecord(params).then(data => {
                if (data && data.code === 200 &&data.flag==1) {
                    // this.tableData=data.data
                    let content = data.data
                    this.checkInfoList.forEach(item=>{
                        if(item.name=="status"){
                            switch (content[item.name]) {
                                case 1:
                                    item.content='待审批';
                                    break;
                                case 2:
                                    item.content='审核通过';
                                    break;
                                case 3:
                                    item.content='驳回审核';
                                    break;
                                case 4:
                                    item.content='未审批';
                                    break;
                                default:
                                    item.content='未知状态';
                                    break;
                            };
                        }else{
                            item.content=content[item.name]
                        }
                    })
                    console.log("checkInfoList",this.checkInfoList)
                    this.formData.abId=content.abId
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
        },
        //关闭
        closeBack(){
            this.$router.push({
                path:"/workflow/normalApproval"
            })
        }
    },
    
  
}
</script>

<style lang="scss" scoped>
.cwf_checkNormalApproval{
    .collapse-style{
        width: 100%;
        border: 0;
    }
    /deep/ .el-collapse-item__wrap{
        padding-top: 0 !important;
        .el-collapse-item__content {
            padding-bottom: 0px;
        }
    }
    .checkNormalApproval-item{
        padding:0 20px ;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
        .check-item-box{
            margin-bottom: 16px;
            .check-item-lable{
                float: left;
                width: 100px;
                font-family: MicrosoftYaHei;
                font-size: 12px;
                color: #666666;
                letter-spacing: 0;
            }
            .check-item-content{
                float: left;
                font-size: 12px;
            }
        }
    }
    .footer{
        text-align: center;
        margin: 24px 0;
         .el-button{
            width: 80px;
            height: 32px;
            padding: 0;
            margin: 0px;
            text-align: center;
            line-height: 32px;
            margin-right: 32px;
        }
    }
   
}


</style>
