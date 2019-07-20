<template>
    <section class="cinemaParam">
        <el-collapse v-model="activeNames">

            <!-- 基础信息 -->
            <el-collapse-item title="基础信息" name="basicInfo">
                <el-form class="basicInfo" :model="basicInfoFormData" inline label-width="100px">
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
                        <span v-if="basicInfoFormData.type === 1 || basicInfoFormData.type === 0">自营渠道</span>
                        <span v-else-if="basicInfoFormData.type === 2">第三方渠道</span>
                    </el-form-item>

                </el-form>
            </el-collapse-item>

            <!-- 交易规则 -->
            <el-collapse-item v-if="tradeRuleShow" title="交易规则" name="tradeRule">
                <el-form :model="tradeRuleFormData" ref="tradeRuleFormData" label-width="240px">
                    <el-form-item label="网络代售费：">
                        <span v-if="tradeRuleFormData.netSaleFeeMode === 0">最高限额{{tradeRuleFormData.saleFeeMoney}}元</span>
                        <span v-else-if="tradeRuleFormData.netSaleFeeMode === 1">固定金额{{tradeRuleFormData.saleFeeMoney}}元</span>
                        <span v-else-if="tradeRuleFormData.netSaleFeeMode === 2">标准价百分比{{tradeRuleFormData.saleFeePercentage}}%</span>
                    </el-form-item>
                    <el-form-item label="增值服务费：">
                        <span v-if="tradeRuleFormData.addFeeType === 0">系统设置</span>
                        <span v-else-if="tradeRuleFormData.addFeeType === 1">合作商设置</span>
                        <span v-else-if="tradeRuleFormData.addFeeType === 1">合作商设置</span>
                    </el-form-item>
                    <el-form-item label="售票截止时间：">
                        <span v-if="tradeRuleFormData.saleEndTimeType === 0">放映前{{tradeRuleFormData.saleEndTime}}分钟</span>
                        <span v-else-if="tradeRuleFormData.saleEndTimeType === 1">放映后{{tradeRuleFormData.saleEndTime}}分钟</span>
                        <span v-else-if="tradeRuleFormData.saleEndTimeType === 2">放映结束前都可售票</span>
                    </el-form-item>
                    <el-form-item label="渠道可预售排期天数：">
                        <span v-if="tradeRuleFormData.presalePlanDays">{{tradeRuleFormData.presalePlanDays}}天</span>
                    </el-form-item>
                    <el-form-item label="每笔订单可购影票最多张数：">
                        <span v-if="tradeRuleFormData.maxSaleTicketAmount">{{tradeRuleFormData.maxSaleTicketAmount}}张</span>
                    </el-form-item>
                    <el-form-item label="每笔订单可购卖品最多数量：">
                        <span v-if="tradeRuleFormData.maxSaleGoodsAmount">{{tradeRuleFormData.maxSaleGoodsAmount}}笔</span>
                    </el-form-item>
<!--                    <el-form-item label="退票规则：">-->
<!--                    -->
<!--                    </el-form-item>-->
                </el-form>
            </el-collapse-item>

            <!-- 业务权限 -->
<!--            <el-collapse-item title="业务权限" name="businessPermission">-->
<!--                <el-form label-width="240px">-->
<!--                    <el-form-item label="基础信息接口：">-->

<!--                    </el-form-item>-->
<!--                    <el-form-item label="交易接口：">-->

<!--                    </el-form-item>-->
<!--                    <el-form-item label="会员卡接口：">-->

<!--                    </el-form-item>-->
<!--                </el-form>-->
<!--            </el-collapse-item>-->

        </el-collapse>

        <div class="bottom-handler-tool">
            <div class="btn-area">
                <el-button @click="closeDetail">关闭</el-button>
            </div>
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
                    channelUid: '',
                    cinemaUid: '',
                },
                tradeRuleFormData: {
                    netSaleFeeMode: '',
                    saleFeePercentage: '',
                    saleFeeMoney: '',
                    addFeeType: '',
                    saleEndTimeType: '',
                    saleEndTime: '',
                    presalePlanDays: '',
                    maxSaleTicketAmount: '',
                    maxSaleGoodsAmount: '',
                    refundRuleUid: '',
                },

                tradeRuleShow: true,
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
                        // {
                        //     name: "业务权限",
                        //     isactive: false
                        // }
                    ]
                },
            }
        },
        methods: {
            closeDetail() {
                this.$router.push({ path: '/trade/cinemaChannel' })
            },
            getChannelDetail(channelUid, cinemaUid) {
                this.$csmList.getChannelDetail({ channelUid, cinemaUid }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        if(res.data) {
                            this.tradeRuleFormData = res.data

                        }

                    }else {
                        this.error(res.msg)
                    }

                })

            },
            initData() {
                this.basicInfoFormData.channelCode = this.$route.query.data.code
                this.basicInfoFormData.channelName = this.$route.query.data.name
                this.basicInfoFormData.company = this.$route.query.data.company
                this.basicInfoFormData.type = this.$route.query.data.nature
                this.basicInfoFormData.channelUid = this.$route.query.data.uid
                this.basicInfoFormData.cinemaUid = this.$route.query.cinemaUid
            }

        },
        created() {
            if(this.$route.query.data.uid === '0' || this.$route.query.data.uid === '1') {
                this.tradeRuleShow = false
                this.stepData.stepList = this.stepData.stepList.filter( item => {
                    return item.name !== '交易规则'
                })
            }
        },
        mounted() {
            console.log(this.$route.query)
            this.initData()
            this.getChannelDetail(this.$route.query.data.uid, this.$route.query.cinemaUid)

        }
    }
</script>

<style lang="scss">
    .cinemaParam {
        width: 80%;
        .basicInfo {
            .el-form-item {
                width: 40%;

            }
        }
        .btn-area {
            text-align: center;
        }
    }


</style>