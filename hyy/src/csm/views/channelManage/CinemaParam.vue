<template>
    <section class="cinemaParam">
        <el-collapse v-model="activeNames">

            <!-- 基础信息 -->
            <el-collapse-item title="基础信息" name="basicInfo">
                <el-form class="basicInfo" :model="basicInfoFormData" inline label-width="200px">
                    <el-form-item label="渠道编码：">
                        <span>{{ basicInfoFormData.channelCode }}</span>
                    </el-form-item>
                    <el-form-item label="渠道名称：">
                        <span>{{ basicInfoFormData.channelName }}</span>
                    </el-form-item>
                    <el-form-item label="公司全称：">
                        <span>{{ basicInfoFormData.company }}</span>
                    </el-form-item>
                    <el-form-item label="渠道类型：">
                        <span>{{ basicInfoFormData.type }}</span>
                    </el-form-item>

                </el-form>
            </el-collapse-item>

            <!-- 交易规则 -->
            <el-collapse-item title="交易规则" name="tradeRule">
                <el-form label-width="200px">
                    <el-form-item label="网络代售费：">

                    </el-form-item>
                    <el-form-item label="增值服务费：">

                    </el-form-item>
                    <el-form-item label="售票截止时间：">

                    </el-form-item>
                    <el-form-item label="渠道可预售排期天数：">

                    </el-form-item>
                    <el-form-item label="每笔订单可购影票最多张数：">

                    </el-form-item>
                    <el-form-item label="每笔订单可购卖品最多数量：">

                    </el-form-item>
                    <el-form-item label="退票规则：">

                    </el-form-item>
                </el-form>
            </el-collapse-item>

            <!-- 业务权限 -->
            <el-collapse-item title="业务权限" name="businessPermission">
                <el-form label-width="200px">
                    <el-form-item label="基础信息接口：">

                    </el-form-item>
                    <el-form-item label="交易接口：">

                    </el-form-item>
                    <el-form-item label="会员卡接口：">

                    </el-form-item>
                </el-form>
            </el-collapse-item>

        </el-collapse>

        <div class="bottom-handler-tool">
            <div class="btn-area">
                <el-button type="primary" @click="">保存</el-button>
                <el-button @click="">取消</el-button>
            </div>
<!--            <div class="btn-area">-->
<!--                <el-button @click="">关闭</el-button>-->
<!--            </div>-->
        </div>

        <fixStepTool :stepData="stepData.stepList"></fixStepTool>
    </section>
</template>

<script>
    import fixStepTool from "ctm/components/fix-step-tool/fix-step-tool"
    import fixStepMixin from "ctm/mixins/fixStepTool"

    export default {
        name: 'CinemaParam',
        mixins: [fixStepMixin],
        components: {fixStepTool},
        data() {
            return {
                basicInfoFormData: {
                    channelCode: '',
                    channelName: '',
                    company: '',
                    type: '',

                },
                activeNames: ['basicInfo', 'tradeRule', 'businessPermission'],
                activeTab: 'first',
                stepData: {
                    stepEl: ".el-collapse-item",
                    stepList: [
                        {
                            name: "基础信息",
                            isactive: false
                        },
                        {
                            name: "交易规则",
                            isactive: false
                        },
                        {
                            name: "业务权限",
                            isactive: false
                        }
                    ]
                },
            }
        },
        methods: {

        },
        mounted() {

        }
    }
</script>

<style lang="scss">
    .cinemaParam {
        width: 76%;
        .basicInfo {
            .el-form-item {
                width: 40%;

            }
        }
    }


</style>