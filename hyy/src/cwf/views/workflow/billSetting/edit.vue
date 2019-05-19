<template>
    <div class="settingDetail">
    <el-dialog  width="80%"  :title="contentText" :visible.sync="dialogVisible" :modal-append-to-body="false" @close="close">
            <div class="detail">
                <div class="cinema-item">
                    指定商户:
                    <el-tree
                        :data="treeArr"
                        show-checkbox
                        default-expand-all
                        node-key="id"
                        ref="tree"
                        highlight-current
                        :props="defaultProps"
                    >
                    </el-tree>

                </div>
                <div class="box-item">
                    <el-row :gutter="20">
                        <el-col :span="12" >
                            <div class="grid-content bg-purple">
                                <div class="item-title">票券销售申请单：审批流程</div>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="grid-content bg-purple-light">
                                <div>
                                    <el-select v-model="value" placeholder="请选择">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>    
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
        dataInfo:Object,
        showType:String,
        dialogFormVisible:Boolean
    },
    data () {
      return {
        contentText:"查看",
        radio:"",
        textarea:"",
        showCheck:false,
        showEdit:false,
        showAdd:false,
      
        dialogVisible: this.dialogFormVisible,
        itemOption:[
           
        ],
        defaultProps: {
            children: 'subtree',
            label: 'menuName'
        },
        treeData:{},
        treeArr:[]
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
            }
        },
         commitApproval(){
            let params={
                "id":1342,
                "status":"2",
                "abId":805,
                "auditAppoint":"审批通过"
            }
            this.$cwfList.commitApproval(params).then(data => {
                if (data && data.code === 200) {
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
        close(){
            this.dialogVisible = false
            this.showCheck=false
            this.showEdit=false
            this.showAdd=false
            this.$emit("close")
        },
        closeBack(){
            this.dialogVisible = false
        },
        showTreeData(){
            let params ={
                consumerId:805852
            }
            this.$cwfList.getOrgTree(params).then(data => {
                if (data && data.code === 200) {
                    this.treeData=data.data
                    this.getCinemaStree(this.treeData)
                    this.treeArr.push(this.treeData)
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
        getCinemaStree(obj){
            this.resetTreeData(obj)
            // let arr =[]
            // arr.push(obj)
            // this.treeData = arr
            // console.log(obj)
            
        },
        resetTreeData(obj){
            if(obj.subtree){
                if(obj.cinemas){
                    // obj.cinemas.forEach(item =>{
                    //     let data = {
                    //         applicableobj:item.first,
                    //         menuName:item.second
                    //     }
                    //     obj.subtree.push(data)
                    // })

                    for(let i = 0; i < obj.cinemas.length; i++){
                        let items = obj.cinemas[i];
                        let data = {
                            menuName:items,
                            subtree:[]
                        }
                        obj.subtree.push(data)
                    }


                }
                for(let j = 0; j < obj.subtree.length; j++){
                    let item = obj.subtree[j];
                    if(item.subtree){
                        this.resetTreeData(item)
                    }
                }
            }
        },
    },
    created(){
        this.showpageType()
        this.showTreeData()
        // this.getCinemaStree()
        console.log(this.dataInfo)
        console.log(this.showType)
    }
  
}
</script>

<style lang="scss" scoped>
.settingDetail{
    .detail{
        width: 100%;  
        overflow:hidden;  
        .box-item{
            width: 50%;
            float: right;
        }
        .cinema-item{
            width: 50%;
            float: left;
        }
    }
       
        
   
}
.el-row{
    margin-bottom: 20px;
}


</style>
