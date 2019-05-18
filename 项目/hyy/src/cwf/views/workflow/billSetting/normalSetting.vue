<template>
    <div>
        <div class="box-item">
            <el-row :gutter="20">
                <el-col :span="6" >
                    <div class="grid-content bg-purple">
                        <div class="item-title">票券销售申请单：审批流程</div>
                    </div>
                </el-col>
                <el-col :span="6">
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
                <el-col :span="6" >
                    <div class="grid-content bg-purple">
                        <div class="item-title">预充值卡申请单：审批流程</div>
                    </div>
                </el-col>
                <el-col :span="6">
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
        <div class="box-item">
            <el-row :gutter="20">
                <el-col :span="6" >
                    <div class="grid-content bg-purple">
                        <div class="item-title">常规营销活动：审批流程</div>
                    </div>
                </el-col>
                <el-col :span="6">
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
                <el-col :span="6" >
                    <div class="grid-content bg-purple">
                        <div class="item-title">会员营销活动：审批流程</div>
                    </div>
                </el-col>
                <el-col :span="6">
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
        <div class="box-item">
            <el-row :gutter="20">
                <el-col :span="6" >
                    <div class="grid-content bg-purple">
                        <div class="item-title">卖品申购单：审批流程</div>
                    </div>
                </el-col>
                <el-col :span="6">
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
                <el-col :span="6" >
                    <div class="grid-content bg-purple">
                        <div class="item-title">卖品盘点单：审批流程</div>
                    </div>
                </el-col>
                <el-col :span="6">
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
        <div class="box-item">
            <el-row :gutter="20">
                <el-col :span="6" >
                    <div class="grid-content bg-purple">
                        <div class="item-title">卖品订货单：审批流程</div>
                    </div>
                </el-col>
                <el-col :span="6">
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
                <el-col :span="6" >
                    <div class="grid-content bg-purple">
                        <div class="item-title">卖品退货单：审批流程</div>
                    </div>
                </el-col>
                <el-col :span="6">
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
        <div class="box-item">
            <el-row :gutter="20">
                <el-col :span="6" >
                    <div class="grid-content bg-purple">
                        <div class="item-title">调拨申请单：审批流程</div>
                    </div>
                </el-col>
                <el-col :span="6">
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
                <el-col :span="6" >
                    <div class="grid-content bg-purple">
                        <div class="item-title">采购入库单：审批流程</div>
                    </div>
                </el-col>
                <el-col :span="6">
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
        <div class="box-item">
            <el-row :gutter="20">
                <el-col :span="6" >
                    <div class="grid-content bg-purple">
                        <div class="item-title">商品零售价调整单：审批流程</div>
                    </div>
                </el-col>
                <el-col :span="6">
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
                <el-col :span="6" >
                    <div class="grid-content bg-purple">
                        <div class="item-title">套餐零售价调整单：审批流程</div>
                    </div>
                </el-col>
                <el-col :span="6">
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
        <div class="footer">
            <el-button class="saveBtn" type="primary" round>保存按钮</el-button>
        </div>
     
        
    </div>
</template>

<script>
export default {
    data(){
        return {
            options: [
                {
                    value: '选项1',
                    label: '黄金糕'
                },
                {
                    value: '选项2',
                    label: '双皮奶'
                }, 
                {
                    value: '选项3',
                    label: '蚵仔煎'
                }, 
                {
                    value: '选项4',
                    label: '龙须面'
                }, 
                {
                    value: '选项5',
                    label: '北京烤鸭'
                }
            ],
            value:""
        }
    },
    methods:{

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
