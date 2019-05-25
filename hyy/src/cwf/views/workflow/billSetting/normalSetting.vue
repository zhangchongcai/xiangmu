<template>
    <div>
        <div class="box-item" v-for="(item,index) in resetRenderData" :key="item.id" v-if="resetRenderData.length">
            <el-row :gutter="20">
                <el-col :span="6" >
                    <div class="grid-content bg-purple">
                        <div class="item-title">{{item.businessName}}：审批流程</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple-light">
                        <div>
                            <el-select v-model="optionsValue[`${item.businessNo}`]" placeholder="请选择" v-if="optionsValue">
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
       
        <div class="footer">
            <el-button class="saveBtn" type="primary" round @click="saveBillNormalSetting">保存按钮</el-button>
        </div>
     
    </div>
</template>

<script>
export default {
    data(){
        return {
            options: [],//列表下拉选项数据
            optionsValue:{},//选项数据的值集合
            tableData:[],//列表数据
            resetRenderData:[],//列表重组数据
        }
    },
    methods:{
        //获取单据设置列表
        getBillSettingList(){
            let params={
                global:0,
                orginizationId:0,
                tenantId:805852
            }
            this.$cwfList.getBillSettingList(params).then(data => {
                if (data && data.code === 200) {
                    this.tableData=data.data.businessTypeList
                    this.options=data.data.workflowList
                    this.resetData(data.data)
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
        //重组渲染结构
        resetData(data){
            this.resetRenderData=JSON.parse(JSON.stringify(this.tableData)) 
            this.resetRenderData.forEach(item=>{
                item.list=JSON.parse(JSON.stringify(this.options)) 
            })
            console.log(this.resetRenderData)
            console.log(this.optionsValue)
            if(data.workflowBusinessList){
                data.workflowBusinessList.forEach(element=>{
                    this.optionsValue[`${element.businessTypeCode}`]=element.workflowBusinessId 
                })
            }
        },
        //保存通用单据设置
        saveBillNormalSetting(){
            let params={
                list:[]
            }
            this.resetRenderData.forEach(item=>{
                if(parseInt(this.optionsValue[`${item.businessNo}`])){
                    params.list.push({
                        businessTypeCode:item.businessNo,//业务类型编码
                        global:0,//是否全局设置0-是 1-否
                        orginizationId:0,//组织结构id
                        orginizationName:"guansd",//组织结构名称
                        tenantId:805852,//租户id
                        workflowBusinessId:parseInt(this.optionsValue[`${item.businessNo}`]),//流程方案id
                    })
                }
               
            })
            console.log(JSON.stringify(params))
            
            this.$cwfList.saveBillSetting(params).then(data => {
                if (data && data.code === 200) {
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
        this.getBillSettingList()
    }
}
</script>

<style lang="scss" scoped>
.box-item{
    margin-bottom:30px;
    .item-title{
        text-align: right;
        line-height: 32px;
    }

}
.footer{
    width: 100%;
    text-align: center;
    margin: 0 auto;
    .saveBtn{
        margin-top: 100px;
        text-align: center;
        // margin: 0 auto;
    }
}

</style>
