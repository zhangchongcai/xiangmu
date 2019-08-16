<template>
    <div>
        <div class="box">
            <el-row :gutter="20">
                <el-col class="box-item" :span="12" v-for="item in resetRenderData" :key="item.id" >
                    <template v-if="resetRenderData.length">
                        <div >
                            <div class="" style="float:left;">
                                <div class="item-title">{{item.businessName}}：</div>
                            </div>
                            <div style="float:left;">
                                <el-select v-model="optionsValue[`${item.businessNo}`]" placeholder="请选择" v-if="optionsValue" @change="change()">
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
                    </template>
                </el-col>
            </el-row>
        </div>
       
        <div class="footer">
            <el-button class="saveBtn" type="primary" @click="saveBillNormalSetting">保存</el-button>
        </div>
     
    </div>
</template>

<script>
export default {
    data(){
        return {
            tenantId:  JSON.parse(localStorage.getItem('user')).consumerId, //商户id
            options: [],//列表下拉选项数据
            optionsValue:{},//选项数据的值集合
            tableData:[],//列表数据
            resetRenderData:[],//列表重组数据
        }
    },
    methods:{
        //监听下拉事件
        change(){
            this.$forceUpdate()
        },
        //获取单据设置列表
        getBillNormalSetting(){
            let params={
                global:0,
                orginizationId:0,
                tenantId:this.tenantId
            }
            this.$cwfList.getBillNormalSetting(params).then(data => {
                if (data && data.code === 200&&data.flag==1) {
                    this.tableData=data.data.businessTypeList
                    this.options=data.data.workflowList
                    this.resetData(data.data)
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
        resetData(data){
            this.resetRenderData=JSON.parse(JSON.stringify(this.tableData)) 
            let flag=false//是否存在无需审批标记
            this.resetRenderData.forEach(item=>{
                item.list=JSON.parse(JSON.stringify(this.options)) 
            })
            //兼容无需选项没有的情况
            this.options.forEach(item=>{
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
            console.log("resetRenderData",this.resetRenderData)
            console.log(this.optionsValue)
            if(data.workflowBusinessList){
                data.workflowBusinessList.forEach(element=>{
                    data.workflowList.forEach(items=>{
                        if(element.workflowBusinessId==items.id){
                            this.optionsValue[`${element.businessTypeCode}`]= element.workflowBusinessId
                        }
                    })
                })
            }
        },
        //保存通用单据设置
        saveBillNormalSetting(){
            let params={
                tenantId:this.tenantId,//租户id
                list:[]
            }
            this.resetRenderData.forEach(item=>{
                if(parseInt(this.optionsValue[`${item.businessNo}`])){
                    params.list.push({
                        businessTypeCode:item.businessNo,//业务类型编码
                        global:0,//是否全局设置0-是 1-否
                        // orginizationId:0,//组织结构id
                        // orginizationName:"guansd",//组织结构名称
                        tenantId:this.tenantId,//租户id
                        workflowBusinessId:this.optionsValue[`${item.businessNo}`],//流程方案id
                    })
                }
               
            })
            console.log(JSON.stringify(params))
            
            this.$cwfList.saveBillSetting(params).then(data => {
                if (data && data.code === 200 &&data.flag==1) {
                    this.$message({
                        message: "保存成功",
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
        this.getBillNormalSetting()
    }
}
</script>

<style lang="scss" scoped>
.box{
    margin-bottom:24px;
    min-height: 600px;
    .box-item{
        margin-bottom: 24px;
        .item-title{
            // font-size: 14px;
            width:150px;
            line-height: 32px;
            height: 32px;
            text-align: left;
            padding-right: 5px;
            color: #666666;
        }
    }
}

.footer {
    position: fixed;
    bottom: 0px;
    height: 56px;
    width: 90%;
    background: #ffffff;
    .saveBtn {
        width: 80px;
        padding-left: 0;
        padding-right: 0;
        height: 32px;
        font-size: 12px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        span {
            text-align: center;
        }
    }
}

</style>
