<template>
    <div>
        <el-dialog :title="windowType"  append-to-body :visible.sync="dialogVisible" @close="close">
            <!-- 查询 -->
            <el-form label-width="" :inline="true">
                <div style="position:relative" v-if="windowType=='选择用户'">
                    <el-form-item label="用户账号" class="two_search">
                        <el-input v-model="searchUserParams.loginName" style="width:152px"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名称">
                        <el-input v-model="searchUserParams.fullName" style="width:184px"></el-input>
                    </el-form-item>
                    <el-button type="primary" style="position:absolute;right:0;top:5px;" @click="searchUser">查询</el-button>
                </div>
                <div style="position:relative" v-if="windowType=='选择角色'">
                    <el-form-item label="角色名称">
                        <el-input v-model="searchRoleParams.name" style="width:184px"></el-input>
                    </el-form-item>
                    <el-button type="primary" style="position:absolute;right:0;top:5px;" @click="searchRole">查询</el-button>
                </div>
                
            </el-form>
            <!-- 列表 -->
            <el-table :data="gridData" @row-click="selectItemHandler" v-if="windowType=='选择用户'" > 
                <el-table-column property="loginName" label="用户账号" width="240"></el-table-column>
                <el-table-column property="fullName" label="用户名称" width="240"></el-table-column>
                <el-table-column property="status" label="状态" width="65">
                    <template slot-scope="scope">
                        <div class="success">
                            {{scope.row.status==0?"启用":""}}
                        </div>
                        <div class="danger">
                            {{scope.row.status==1?"禁用":""}}
                        </div>
                        <div class="info">
                            {{scope.row.status==2?"离职":""}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column property="organization.name" label="所属组织" width="250"></el-table-column>
            </el-table>
           
            <el-table :data="gridData" @row-click="selectItemHandler" v-if="windowType=='选择角色'">
                <el-table-column property="name" label="姓名" width="550"></el-table-column>
                <el-table-column property="status" label="状态" width="245">
                    <template slot-scope="scope">
                        <div class="danger">
                            {{scope.row.status==0?"禁用":""}}
                        </div>
                        <div class="success">
                            {{scope.row.status==1?"启用":""}}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <section class="flex-base flex-center">
                <el-pagination 
                    @size-change="handleSizeChange" 
                    @current-change="handleCurrentChange" 
                    :current-page="pageConfig.currentPage" 
                    :page-sizes="pageConfig.pageSizes" 
                    :page-size="pageConfig.pageSize" 
                    layout="total, sizes, prev, pager, next, jumper" 
                    :total="pageConfig.total"
                >
                </el-pagination>
            </section>
            <!-- 选中 -->
            <div class="select-info" >
                <span class="select-info-item" v-for="(item,index) in selectData" :key="index">
                    {{item.assigneeName}}
                </span>
            </div>
            <el-button type="primary" @click="clearSelectHandler">清除选择</el-button>
            <!-- 提交 -->
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sumbitRes">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {getUser,roleList} from "frame_cpm/http/interface.js"
export default {
    props:{
        showSelectWindow:Boolean,//弹窗状态
        windowType:String//弹窗类型
    },
    data() {
      return {
        //用户查询数据
        searchUserParams:{
            fullName:"",
            loginName:"",
        },
        //角色查询数据
        searchRoleParams:{
            name:""
        },
        tenantId:JSON.parse(localStorage.getItem('user')).consumerId, //商户id
        selectData:[],//选中数据
        gridData: [],//列表数据
        dialogVisible: this.showSelectWindow,//弹窗状态
        //分页配置
        pageConfig: {
            start: 0,
            pageSize: 10,
            pageSizes: [10, 20, 30, 40],
            currentPage: 1,
            total: 0
        },
      };
    },
    methods:{
        //关闭弹窗
        close(){
            this.dialogVisible = false
            this.$emit("closeSelcetWindow",false)
        },
        //查询用户
        searchUser(){
            this.getUser()
        },
        //查询角色
        searchRole(){
            this.getRoleList()
        },
        //提交选中数据
        sumbitRes(){
            let submitData={
                assigneeId:"",
                assigneeName:""
            }
            console.log(this.selectData)
            this.selectData.forEach(item=>{

                if(!submitData.assigneeName){
                    submitData.assigneeName=item.assigneeName
                }else{
                    submitData.assigneeName += (","+item.assigneeName)
                }

                if(!submitData.assigneeId){
                    submitData.assigneeId=item.assigneeId
                }else{
                    submitData.assigneeId += (","+item.assigneeId)
                }
                
            })
            console.log(submitData)
            this.$emit("submitData",submitData)
            this.dialogVisible = false
        },
        //点击选中数据
        selectItemHandler(row){
            console.log(row)
            let arr=[]
            if(this.selectData.length!=0){
                let flag= true
                for(let i=0 ;i<this.selectData.length;i++){
                    if(this.selectData[i].assigneeId==row.uid){
                        flag=false
                        break;
                    }
                }
                if(flag){
                    if(this.windowType=="选择用户"){
                        this.selectData.push({
                            assigneeId:row.uid,
                            assigneeName:row.fullName,
                        })
                    }
                    if(this.windowType=="选择角色"){
                        this.selectData.push({
                            assigneeId:row.uid,
                            assigneeName:row.name,
                        })
                    }
                }
            }else{
               if(this.windowType=="选择用户"){
                    this.selectData.push({
                        assigneeId:row.uid,
                        assigneeName:row.fullName,
                    })
                }
                if(this.windowType=="选择角色"){
                    this.selectData.push({
                        assigneeId:row.uid,
                        assigneeName:row.name,
                    })
                }
            }
            
        },
        //清除选择框
        clearSelectHandler(){
            this.selectData=[]
        },
        //获取用户
        getUser(){
            let params={
                fullName:this.searchUserParams.fullName,
                loginName: this.searchUserParams.loginName,
                orgUid: "",
                pageNum:this.pageConfig.currentPage,
                pageSize:this.pageConfig.pageSize,
                status: "0"
            }
            getUser(params).then(data => {
                if (data && data.code === 200) {
                    this.gridData=data.data.rows
                    this.pageConfig.total=data.data.total
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
        //获取角色
        getRoleList(){
            let params={
                name: this.searchRoleParams.name,
                pageNum:this.pageConfig.currentPage,
                pageSize:this.pageConfig.pageSize,
                status: "1"
            }
            roleList(params).then(data => {
                if (data && data.code === 200) {
                    this.gridData=data.data.rows
                    this.pageConfig.total=data.data.total
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
          /**
         * @function handleSizeChange - 修改分页大小
         */
        handleSizeChange(pageSize) {
            this.pageConfig.pageSize = pageSize;
            this.pageConfig.currentPage = 1;
            if(this.windowType=="选择用户"){
                this.getUser()
            }
            if(this.windowType=="选择角色"){
                this.getRoleList()
            }
        },
        //页数变化
        handleCurrentChange(currentPage){
            this.pageConfig.currentPage = currentPage;
            if(this.windowType=="选择用户"){
                this.getUser()
            }
            if(this.windowType=="选择角色"){
                this.getRoleList()
            }
        }
       
    },
    created(){
        if(this.windowType=="选择用户"){
            this.getUser()
        }
        if(this.windowType=="选择角色"){
            this.getRoleList()
        }
       
    }
    
  };
</script>

<style lang="scss" scoped>
.select-info{
    width: 100%;
    overflow: hidden;
    background-color: #eee;
    padding: 10px;
    box-sizing: border-box;
    margin: 10px 0;
    min-height: 50px;
    .select-info-item{
        float: left;
        padding: 5px 10px;
        border-radius: 3px;
        border: 1px solid #000;
        margin-bottom: 5px;
        margin-right: 10px;
    }
}
</style>
