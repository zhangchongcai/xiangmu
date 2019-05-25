<template>
    <div>
        <el-dialog :title="windowType"  append-to-body :visible.sync="dialogVisible" @close="close">
            <el-table :data="gridData" @row-click="selectItemHandler" >
                <el-table-column property="assigneeName" label="姓名" width="250"></el-table-column>
            </el-table>

            <div class="select-info" >
                <span class="select-info-item" v-for="(item,index) in selectData" :key="index">
                    {{item.assigneeName}}
                </span>
            </div>
            <el-button type="success" @click="clearSelectHandler">清除选择</el-button>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sumbitRes">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
  export default {
    props:{
        showSelectWindow:Boolean,//弹窗状态
        windowType:String//弹窗类型
    },
    data() {
      return {
        selectData:[],//选中数据
        gridData: [],//列表数据
        dialogVisible: this.showSelectWindow,//弹窗状态
      };
    },
    methods:{
        //关闭弹窗
        close(){
            this.dialogVisible = false
            this.$emit("closeSelcetWindow",false)
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
                    if(this.selectData[i].assigneeName==row.assigneeName){
                        flag=false
                        break;
                    }
                }
                if(flag){
                    this.selectData.push({
                        assigneeId:row.assigneeId,
                        assigneeName:row.assigneeName,
                    })
                }
            }else{
                this.selectData.push({
                    assigneeId:row.assigneeId,
                    assigneeName:row.assigneeName,
                })
            }
            
        },
        //清除选择框
        clearSelectHandler(){
            this.selectData=[]
        },
        //获取用户
        getUserInfo(){
            let params={
                tenantId:805852,
                pageNo:1
            }
            this.$cwfList.getUserInfo(params).then(data => {
                if (data && data.code === 200) {
                    this.gridData=data.data
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
        },
        //获取角色
        getRoleInfo(){
            let params={
                tenantId:805852,
                pageNo:1
            }
            this.$cwfList.getRoleInfo(params).then(data => {
                if (data && data.code === 200) {
                    this.gridData=data.data
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
        }
       
    },
    created(){
        if(this.windowType=="选择用户"){
            this.getUserInfo()
        }
        if(this.windowType=="选择角色"){
            this.getRoleInfo()
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
