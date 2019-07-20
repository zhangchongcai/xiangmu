<template>
    <div class="settingDetail">
        <el-dialog  width="80%"  :close-on-click-modal="false" :title="contentText" :visible.sync="dialogVisible" :modal-append-to-body="false" @close="close">
            <div class="detail">
                <div class="cinema-item">
                    指定组织:
                    <el-tree
                        :data="treeArr"
                        show-checkbox
                        default-expand-all
                        node-key="id"
                        ref="tree"
                        highlight-current
                        :props="defaultProps"
                        :check-strictly="true"
                        :default-checked-keys="defaultCheckedKeys"
                    >
                    </el-tree>

                </div>
                <div class="box-item" v-for="(item,index) in resetRenderData" :key="item.id" v-if="resetRenderData.length">
                    <el-row :gutter="10">
                        <el-col :span="8" >
                            <div class="grid-content bg-purple">
                                <div class="item-title">{{item.businessName}}</div>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div class="grid-content bg-purple-light">
                                <div>
                                    <el-select v-model="optionsValue[`${item.businessNo}`]" placeholder="请选择" @change="change()">
                                        <el-option
                                            v-for="items in item.list"
                                            :key="items.id"
                                            :label="items.name"
                                            :value="items.id"
                                        >
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>    
            <div slot="footer" class="dialog-footer">
                <el-button @click="close" >取 消</el-button>
                <el-button type="primary" v-if="showAdd" @click="addPersonalSetting">确 定</el-button>
                <el-button type="primary" v-if="showEdit" @click="editPersonalSetting">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
import {organizationList} from "frame_cpm/http/interface.js"
  export default {
    props:{
        dataInfo:Object,//传入参数
        showType:String,//弹窗类型
        dialogFormVisible:Boolean//弹窗显示状态
    },
    data () {
      return {
        tenantId:  JSON.parse(localStorage.getItem('user')).consumerId, //商户id
        // userUid:  "c30b100b-2e84-4d9e-bfc5-4821677d31fe", //用户组织uid
        userUid:  JSON.parse(localStorage.getItem('user')).uid, //用户组织uid
        contentText:"",//弹窗显示类型
        showEdit:false,//弹窗编辑状态
        showAdd:false,//弹窗新建状态
        dialogVisible: this.dialogFormVisible,//弹窗显示状态
        //新建的提交参数
        addParams:{
            list:[
                {
                    businessTypeCode:"01",// 业务类型编码
                    global:1,
                    orginizationId:0,//组织结构id
                    orginizationName:"dsf" ,//组织结构名称
                    tenantId: JSON.parse(localStorage.getItem('user')).consumerId, //商户id
                    workflowBusinessId:"0",//流程方案id
                }
            ]
        },
        //编辑的提交参数
        editParams:{},
        //默认渲染属性
        // defaultProps: {
        //     children: 'subtree',
        //     label: 'menuName'
        // },
        defaultProps: {
            children: 'subtree',
            label: 'menuName'
        },
        treeData:{},//组织结构数据
        treeArr:[],//组织结构数组

        options: [],//下拉选项
        optionsValue:{},//下拉的选项值集合
        tableData:[],//渲染数据
        resetRenderData:[],//重组渲染数据
        defaultCheckedKeys:[]//默认选中树状图项
      }
    },
    computed:{
       
    },
    methods:{
        //弹窗类型显示
        showpageType(){
            if(this.showType=="add"){
                this.contentText="新建"
                this.showAdd=true

            }
            if(this.showType=="edit"){
                this.contentText="编辑"
                this.showEdit=true
            }
        },
        //监听下拉事件
        change(){
            this.$forceUpdate()
        },
        //打印组织结构树选中数据
        getCheckedNodes(){   
            console.log(this.$refs.tree.getCheckedNodes())
        },
        //关闭弹窗
        close(update){
            this.dialogVisible = false
            this.showEdit=false
            this.showAdd=false
            this.$emit("close")
            if(update){
                this.$emit("close",update)
            }else{
                this.$emit("close")
            }
        },
        //获取组织结构树
        showTreeData(list){
            let params ={
                // consumerId:805852
                userUid:this.userUid
            }
            this.$cwfList.getOrgTreeAndCinema(params).then(data => {
            // organizationList(params).then(data => {
                if (data && data.code === 200) {
                    this.treeData=data.data
                    this.resetTreeData(this.treeData,list)
                    this.treeArr.push(this.treeData)
                    // this.treeArr=data.data
                    console.log("treeArr",this.treeArr)
                    if(this.showType=="edit"){
                      this.editInitTreeData()
                    }
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
        //编辑初始化树状图
        editInitTreeData(){
            let _this=this
            setTimeout(()=>{
                _this.defaultCheckedKeys=_this.dataInfo.merchantId.split(",").map(Number)
                console.log(_this.defaultCheckedKeys)
                _this.$refs.tree.setCheckedKeys(_this.defaultCheckedKeys)
            },100)
        },
        //重组组织结构树数据
        resetTreeData(obj,list){
            if(obj.subtree){
                if(obj.cinemaInfos){
                    for(let i = 0; i < obj.cinemaInfos.length; i++){
                        let items = obj.cinemaInfos[i];
                        let data = {
                            id:items.id,
                            menuName:items.name,
                            subtree:[]
                        }
                        obj.subtree.push(data)
                    }
                }
                for(let j = 0; j < obj.subtree.length; j++){
                    let item = obj.subtree[j];
                    list.forEach(el=>{
                        if(item.id==el){
                            item.disabled=true
                        }
                    })
                    if(item.subtree){
                        this.resetTreeData(item,list)
                    }
                }
            }
           
        },
        //重组组织结构树数据
        // resetTreeData(obj){
        //     if(obj.subtree){
        //         if(obj.cinemas){
        //             for(let i = 0; i < obj.cinemas.length; i++){
        //                 let items = obj.cinemas[i];
        //                 let data = {
        //                     // id:items,
        //                     menuName:items,
        //                     subtree:[]
        //                 }
        //                 obj.subtree.push(data)
        //             }
        //         }
        //         for(let j = 0; j < obj.subtree.length; j++){
        //             let item = obj.subtree[j];
        //             if(item.subtree){
        //                 this.resetTreeData(item)
        //             }
        //         }
        //     }
           
        // },
        //获取通用单据设置
        getBillNormalSetting(){
            let params={
                global:1,
                orginizationId:0,
                tenantId:this.tenantId
            }
            this.$cwfList.getBillNormalSetting(params).then(data => {
                if (data && data.code === 200) {
                    this.tableData=data.data.businessTypeList
                    this.options=data.data.workflowList
                    this.resetData()
                    if(this.showType=="edit"){
                      this.editInitNormalSettingData()
                    }
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
        //重组渲染结构
        resetData(){
            this.resetRenderData=JSON.parse(JSON.stringify(this.tableData)) 
            let flag=false
            this.resetRenderData.forEach(item=>{
                item.list=JSON.parse(JSON.stringify(this.options)) 
                console.log(item.businessNo)
                if(item.id==2){
                    flag=true
                }
            })
            //兼容无需选项没有的情况
            if(flag){
                this.resetRenderData.forEach(item=>{
                    this.optionsValue[`${item.businessNo}`]="2"
                })
            }else{
                this.resetRenderData.forEach(item=>{
                    this.optionsValue[`${item.businessNo}`]=""
                })
            }
            console.log(this.resetRenderData)
            console.log(this.optionsValue)
            // if(this.showType=="edit"){
            //     this.optionsValue[`${this.dataInfo.businessTypeCode}`]=this.dataInfo.workflowBusinessId 
            // }
        },
          //编辑初始化树状图
        editInitNormalSettingData(){
            // this.optionsValue[`${this.dataInfo.businessTypeCode}`]=this.dataInfo.workflowBusinessId 
            console.log("this.options",this.options)
            this.options.forEach(item=>{
                this.dataInfo.rlsList.forEach(el=>{
                    if(el.workflowBusinessId==item.id){
                        this.optionsValue[`${el.businessTypeCode}`]= item.id
                    }
                })
            })
            
            console.log("getCheckedNodes",this.$refs.tree.getCheckedNodes())
        },
        //验证是否是已经设置过的节点
        querySetHistory(){
            let params={}
            this.$cwfList.querySetHistory(params).then(data => {
                if (data && data.code === 200&&data.flag==1) {
                    let list = data.data || []
                    this.showTreeData(list)
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
        //阻止用户选择已经选择的组织节点
        resetHistoryData(list){
            if(this.treeArr.length){
                this.treeArr.forEach(item=>{
                    this.treeArr.forEach(item=>{

                    })
                })
            }
        },
        //新建个性单据设置
        addPersonalSetting(){
            let treeData={
                orginizationId:"",
                orginizationName:"",
            }
            let treeArray=this.$refs.tree.getCheckedNodes()
            //验证组织结构
            console.log("treeArray",treeArray)
           if(treeArray.length==0){
                this.$message({
                    message:"组织结构不能为空",
                    type: "warning",
                    duration: 1000
                });
               return
           }

            treeArray.forEach(items=>{

                if(!treeData.orginizationId){
                    treeData.orginizationId=items.id
                }else{
                    treeData.orginizationId+=(","+items.id)
                }

                if(!treeData.orginizationName){
                    treeData.orginizationName=items.menuName
                }else{
                    treeData.orginizationName+=(","+items.menuName)
                }

               
            })
            console.log("tree",treeData)

            let params={
                tenantId:this.tenantId,
                list:[]
            }
            this.resetRenderData.forEach(item=>{
                if(parseInt(this.optionsValue[`${item.businessNo}`])){
                    params.list.push({
                        businessTypeCode:item.businessNo ,//业务类型编码
                        global:1,//是否全局设置0-是 1-否
                        orginizationId:treeData.orginizationId,//组织结构id
                        orginizationName:treeData.orginizationName,//组织结构名称
                        tenantId:this.tenantId,//租户id
                        workflowBusinessId:this.optionsValue[`${item.businessNo}`],//流程方案id
                    })
                }
            })
            //验证审批流程选项
            if(params.list.length==0){
                this.$message({
                    message:"请选择审批流程选项",
                    type: "warning",
                    duration: 1000
                });
                return
            }
            console.log(JSON.stringify(params))
            
            this.$cwfList.addPersonalSetting(params).then(data => {
                if (data && data.code === 200&&data.flag==1) {
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
        //编辑个性单据设置
        editPersonalSetting(){
            let treeData={
                orginizationId:"",
                orginizationName:"",
            }
            let treeArray=this.$refs.tree.getCheckedNodes()
            //验证组织结构
            if(treeArray.length==0){
                this.$message({
                    message:"组织结构不能为空",
                    type: "warning",
                    duration: 1000  
                });
               return
            }
            treeArray.forEach(items=>{

                if(!treeData.orginizationId){
                    treeData.orginizationId=items.id
                }else{
                    treeData.orginizationId+=(","+items.id)
                }

                if(!treeData.orginizationName){
                    treeData.orginizationName=items.menuName
                }else{
                    treeData.orginizationName+=(","+items.menuName)
                }

               
            })
            let params={
                tenantId:this.tenantId,
                merchantId:this.dataInfo.merchantId,
                list:[]
            }
            this.resetRenderData.forEach(item=>{
                if(parseInt(this.optionsValue[`${item.businessNo}`])){
                    params.list.push({
                        businessTypeCode:item.businessNo ,//业务类型编码
                        orginizationId:treeData.orginizationId,//组织结构id
                        orginizationName:treeData.orginizationName,//组织结构名称
                        tenantId:this.tenantId,//租户id
                        workflowBusinessId:this.optionsValue[`${item.businessNo}`]+"",//流程方案id
                    })
                }
               
            })
            //验证审批流程选项
            if(params.list.length==0){
                this.$message({
                    message:"请选择审批流程选项",
                    type: "warning",
                    duration: 1000
                });
                return
            }
            console.log(JSON.stringify(params))
            this.$cwfList.editBillSetting(params).then(data => {
                if (data && data.code === 200&&data.flag==1) {
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
        }
    },
    created(){
        this.showpageType()
        this.querySetHistory()
        this.getBillNormalSetting()
        
        

        console.log("this.dataInfo",this.dataInfo)
        console.log(this.showType)
    },
    mounted(){
      
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
            float: left;
            overflow: hidden;
            box-sizing: border-box;
        }
        .cinema-item{
            width: 50%;
            float: left;
            min-height: 1600px;
        }
    }
       
        
   
}
.el-row{
    margin-bottom: 20px;
}


</style>
