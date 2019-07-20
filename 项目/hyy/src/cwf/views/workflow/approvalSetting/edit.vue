<template>
    <div class="settingDetail">
        <el-dialog  width="80%" :close-on-click-modal="false" :title="contentText" :visible.sync="dialogVisible" :modal-append-to-body="false" @close="close" >
            <div class="detail">
                <div class="detail-item">
                    <div class="detail-item-name">
                        <span class="red">*</span>
                        
                        审批流程名称：
                    </div>
                    <div class="detail-item-info">
                        <div v-if="showCheck">{{dataInfo.name}}</div>
                        <el-form :rules="editParamsRules" ref="ruleForm" :model="editParams" v-if="showEdit">
                            <el-form-item prop="name">
                                <el-input  v-model="editParams.name" placeholder="请输入内容" ></el-input>
                            </el-form-item>
                        </el-form>
                        <el-form :rules="rules" ref="ruleForm" :model="addParams" v-if="showAdd">
                            <el-form-item prop="name">
                                <el-input  v-model="addParams.name" placeholder="请输入内容" ></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="detail-item"> 
                    <div class="detail-item-name">
                        审批节点数：
                    </div>
                    <div class="detail-item-info">
                        <div v-if="showCheck">{{dataInfo.noteNum}}</div>
                        <div v-if="showEdit">{{dataInfo.noteNum}}</div>
                        <el-select v-if="showAdd" v-model="dataInfo.noteNum" placeholder="请选择" @change="changeNoteNum">
                            <el-option
                            v-for="(item) in 4"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="step-item">
                节点审批设置：
                <div class="step-item-left">
                    <el-steps class="step-item-icon" direction="vertical" space="100px" v-if="showEdit">
                        <el-step  title="审批人：" v-for="(item,index) in editParams.processList" :key="index"></el-step>
                    </el-steps>
                    <el-steps class="step-item-icon" direction="vertical" space="100px" v-if="showAdd">
                        <el-step  title="审批人：" v-for="(item,index) in addParams.processList" :key="index"></el-step>
                    </el-steps>
                    <el-steps class="step-item-icon" direction="vertical" space="100px" v-if="showCheck">
                        <el-step  title="审批人：" v-for="(item,index) in dataInfo.processList" :key="index"></el-step>
                    </el-steps>
                </div>
                <div class="step-item-right">
                    <div class="step-item-assignee"  v-for="(item,index) in dataInfo.processList" :key="index" v-if="!showAdd">
                        <div class="step-item-assignee-name" v-if="showCheck">{{dataInfo.processList[index].assigneeName}}</div>
                        <div class="step-item-assignee-name" v-if="showEdit" >{{editParams.processList[index].assigneeName}}</div>
                        <el-button v-if="!showCheck" plain @click="showUserHandler(index,$event)" >选择用户</el-button>
                        <el-button v-if="!showCheck" plain @click="showRoleHandler(index,$event)" >选择角色</el-button>
                        <span class="red" v-if="!showCheck">（同一审批节点，只能选择一种类型审批）</span>
                    </div>
                    <div class="step-item-assignee"  v-for="(item,index) in addParams.processList" :key="index" v-if="showAdd">
                        <div class="step-item-assignee-name" v-if="showAdd" >{{addParams.processList[index].assigneeName}}</div>
                        <el-button v-if="!showCheck" plain @click="showUserHandler(index,$event)" >选择用户</el-button>
                        <el-button v-if="!showCheck" plain @click="showRoleHandler(index,$event)" >选择角色</el-button>
                        <span class="red" v-if="!showCheck">（同一审批节点，只能选择一种类型审批）</span>
                    </div>
                </div>
                <userAndRoleDialog v-if="showSelectBox" :showSelectWindow="showSelectBox" @closeSelcetWindow="closeSelcetWindow" :windowType="windowType" @submitData="submitDataRes"></userAndRoleDialog>
                <!-- 选择创建人 -->
                <!-- <userDialog
                    :title="userDialog.title" 
                    :dialogTableVisible.sync="userDialog.userDialogVisible" 
                    ref="userDialog"
                    @callBack="handleUserCallBack"
                >
                </userDialog> -->
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeBack" >取 消</el-button>
                <el-button v-if="showEdit" type="primary" @click="commitApproval('ruleForm')">确 定</el-button>
                <el-button v-if="showAdd" type="primary" @click="commitApproval('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
         
    </div>
</template>


<script>
// 弹窗混入回调方法，注册弹窗和设置回调都在此处
// import alertHandle from '../../../mixins/marketing/alertHandle.js';
// import fixStepMixin from "../../../mixins/marketing/fixStepTool.js";

import userAndRoleDialog from "./userAndRoleDialog"
export default {
    components:{
        userAndRoleDialog
    },
    // mixins: [fixStepMixin,alertHandle],
    props:{
        dataInfo: Object,
        showType:String,
        dialogFormVisible:Boolean
    },
    data () {
        return {
            tenantId:JSON.parse(localStorage.getItem('user')).consumerId, //商户id
            currentItemIndex:0,
            windowType:"",
            showSelectBox:false,
            showSelectWindow:false,
            roleValue:"",
            userValue:"",
            valueOptions:{
                roleValue:{},
                userValue:{},
                assignee:{}
            },
            editParamsRules:{
                name:[
                    { 
                        required: true,
                        trigger: 'blur' ,
                        validator:(rule, value,callback)=>{
                            if(!value.trim()){
                                callback(new Error('请输入审批流程名称'))
                            }else{
                                callback()
                            }
                        }
                    },
                    { 
                        min: 0,
                        max: 15,
                        message: '长度在 0 到 15 个字符',
                        trigger: 'blur'
                    }
                ],
                
            },
            rules:{
                name:[
                    { 
                        required: true,
                        trigger: 'blur' ,
                        validator:(rule, value,callback)=>{
                            if(!value.trim()){
                                callback(new Error('请输入审批流程名称'))
                            }else{
                                callback()
                            }
                        }
                    },
                    { 
                        min: 0,
                        max: 15,
                        message: '长度在 0 到 15 个字符',
                        trigger: 'blur'
                    }
                ],
                
            },
            editParams:{
                name:"",
            },
            addParams:{
                name:"",
            },
            userOptions: [],
            roleOptions:[],
            contentText:"查看",
            showCheck:false,
            showEdit:false,
            showAdd:false,
            dialogVisible: this.dialogFormVisible
        }
    },
    computed:{
        
    },
    methods:{
        showpageType(){
            if(this.showType=="check"){
                this.contentText="查看"
                this.showCheck=true
            }
            if(this.showType=="edit"){
                this.contentText="编辑"
                this.showEdit=true
                if(this.dataInfo){
                    console.log(this.dataInfo)
                    this.editParams.id=this.dataInfo.id
                    this.editParams.name=this.dataInfo.name||""
                    this.editParams.processList=[]
                    this.editParams.tenantId=this.tenantId
                    this.dataInfo.processList.forEach(element => {
                        this.editParams.processList.push({
                            assigneeId:element.assigneeId,
                            assigneeName:element.assigneeName,
                            assigneeType:element.assigneeType,
                            processId:element.processId
                        })
                    });
            }
            }
            if(this.showType=="add"){
                console.log("add",this.dataInfo)
                this.contentText="新建"
                this.showAdd=true
                this.addParams.name=this.dataInfo.name || ""
                this.addParams.noteNum=this.dataInfo.noteNum
                this.addParams.tenantId=this.dataInfo.tenantId
                this.addParams.status=this.dataInfo.status
                this.addParams.processList=[]
                this.addParams.tenantId=this.tenantId
                this.dataInfo.processList.forEach(element => {
                    this.addParams.processList.push({
                        assigneeId:element.assigneeId,
                        assigneeName:element.assigneeName,
                        assigneeType:element.assigneeType,
                        nextNoteNum:element.nextNoteNum,
                        noteNum:element.noteNum,
                        tenantId:this.tenantId
                    })
                });

            }
               
        },
        // resetForm(formName) {
        //     this.$refs[formName].resetFields();
        // },
        commitApproval(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.showType=="add"){
                        this.addApprovalProcess(this.addParams)
                    }
                    if(this.showType=="edit"){
                        this.editApprovalProcess(this.editParams)
                    }
                } else {
                    return false;
                }
            });
        },
        addApprovalProcess(params){
            this.$cwfList.addApprovalProcess(params).then(data => {
                if (data && data.code === 200 &&data.flag==1) {
                    this.close("update")
                    this.$message({
                        message: "新增成功",
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
        },
        editApprovalProcess(params){
            console.log(JSON.stringify(params))
             this.$cwfList.editApprovalProcess(params).then(data => {
                if (data && data.code === 200 &&data.flag==1) {
                    this.close("update")
                    this.$message({
                        message: "编辑成功",
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
        },
        close(update){
            this.dialogVisible = false
            this.showCheck=false
            this.showEdit=false
            this.showAdd=false
            this.valueOptions={
                roleValue:{},
                userValue:{}
            }
            if(update){
                this.$emit("close",update)
            }else{
                this.$emit("close")
            }
        },
        closeBack(){
            this.dialogVisible = false
             this.valueOptions={
                roleValue:{},
                userValue:{}
            }
        },
        showUserHandler(index){
            console.log(index)
            this.currentItemIndex=index
            this.showSelectBox = true
            this.windowType='选择用户'
            if(this.showType=="edit"){
                this.editParams.processList[index].assigneeType=0
            }
            if(this.showType=="add"){
                this.addParams.processList[index].assigneeType=0
            }
        },
        showRoleHandler(index){
            console.log(index)
            this.currentItemIndex=index
            this.showSelectBox = true
            this.windowType='选择角色'
            if(this.showType=="edit"){
                this.editParams.processList[index].assigneeType=1
            }
            if(this.showType=="add"){
                this.addParams.processList[index].assigneeType=1
            }
        },
        closeSelcetWindow(){
            console.log("closeSelcetWindow")
            this.showSelectBox=false
        },
        submitDataRes(strdData){
            console.log("strdData",strdData)
            if(this.showType=="edit"){
                this.editParams.processList[this.currentItemIndex].assigneeId=strdData.assigneeId
                this.editParams.processList[this.currentItemIndex].assigneeName=strdData.assigneeName
            }
            if(this.showType=="add"){
                this.addParams.processList[this.currentItemIndex].assigneeId=strdData.assigneeId
                this.addParams.processList[this.currentItemIndex].assigneeName=strdData.assigneeName
            }
        },
        changeNoteNum(value){
            console.log(value)
             this.addParams.noteNum=value
            let list=[]
            let nextNoteNum=""
            for (var i=0;i<value;i++){
                if(value<=nextNoteNum){
                    nextNoteNum = null
                }else{
                    nextNoteNum=i+2
                }
                list.push({
                    assigneeId:"",
                    assigneeName:"",
                    assigneeType:0,
                    nextNoteNum:nextNoteNum,
                    noteNum:i+1,
                    tenantId:this.tenantId
               })
            }
            this.addParams.processList=list
            console.log(this.addParams)
            // this.dataInfo.processList=list
        },
        changeRoleValue(newVal,oldVal){
            // this.roleValue += ","+newVal
            console.log(newVal)
            
        },
        changeUserValue(newVal,oldVal){
            // this.userValue += ","+newVal
        }
    },
    created(){
        this.showpageType()
        console.log(this.dataInfo)
        console.log(this.showType)
        
        console.log("params",this.params)
        
    }
  
}
</script>

<style lang="scss" scoped>
.settingDetail{
    .detail{
        width: 100%;  
        overflow:hidden;  
        
    }
    .detail-item{
        width: 50%;    
        float: left;
        min-height: 80px;
        .detail-item-name{
            // width: 50%;    
            float: left;
            .red{
                color:red;
            }
        }
        .detail-item-info{
            width: 50%;  
              
            float: left
        }
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
.step-item{
    width:100%;
    height: 500px;
    position: relative;
    margin-bottom: 40px;
    margin-top:20px;
    .step-item-left{
        position: absolute;
        top: 30px;
        left: 0;
    }
    .step-item-right{
        position: absolute;
        top: 30px;
        left: 120px;
        .step-item-assignee{
            height: 100px;
            .step-item-assignee-name{
                display: inline-block;
                width: 300px;
                margin-right: 50px;
                float: left;
                height: 100px;
                line-height: 20px;
                word-wrap: break-word;
                word-break: normal;
                display: -webkit-box;
                overflow : hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 5;
                -webkit-box-orient: vertical;
            }
        }
    }
   
}


</style>
