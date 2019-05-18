<template>
    <div>
        <el-dialog :title="windowType"  append-to-body :visible.sync="dialogVisible" @close="close">
            <el-table :data="gridData" @row-click="selectItemHandler" >
                <el-table-column property="assigneeName" label="姓名" width="250"></el-table-column>
            </el-table>

            <div class="select-info" >
                <span class="select-info-item" v-for="(item,index) in selectData" :key="index">
                    {{item}}
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
        showSelectWindow:Boolean,
        windowType:String
    },
    data() {
      return {
        selectData:[],
        gridData: [],
        dialogVisible: this.showSelectWindow,
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
        formLabelWidth: '120px'
      };
    },
    methods:{
        close(){
            this.dialogVisible = false
            this.$emit("closeSelcetWindow",false)
        },
        sumbitRes(){
            this.$emit("submitData",this.selectData.join("，"))
            this.dialogVisible = false
        },
        selectItemHandler(row){
            console.log(row)
            let arr=[]
            if(this.selectData.length!=0){
                let flag= true
                for(let i=0 ;i<this.selectData.length;i++){
                    if(this.selectData[i]==row.assigneeName){
                        flag=false
                        break;
                    }
                }
                if(flag){
                    this.selectData.push(row.assigneeName)
                }
            }else{
                this.selectData.push(row.assigneeName)
            }
            
        },
        clearSelectHandler(){
            this.selectData=[]
        },
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
