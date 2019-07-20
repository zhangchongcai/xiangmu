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
                <el-form :model="tradeRuleFormData" :rules="tradeRuleFormDataRules" ref="tradeRuleFormData" label-width="240px">
                    <el-form-item
                            label="网络代售费："
                            :prop="tradeRuleFormData.netSaleFeeMode === 2 ? 'saleFeePercentage' : 'saleFeeMoney'">
                        <el-select @change="netSaleFeeModeChange" v-model="tradeRuleFormData.netSaleFeeMode" placeholder="请选择">
                            <el-option
                                    v-for="item in netSaleFeeModeOptions"
                                    :key="item.keyCode"
                                    :label="item.keyName"
                                    :value="item.keyCode">
                            </el-option>
                        </el-select>
                        <span v-show="tradeRuleFormData.netSaleFeeMode === 2">
                            <el-input
                                    style="width: 100px"
                                    placeholder="请输入"
                                    v-model="tradeRuleFormData.saleFeePercentage">
                            </el-input> %
                        </span>
                        <span v-show="tradeRuleFormData.netSaleFeeMode !== 2">
                            <el-input
                                    style="width: 100px"
                                    placeholder="请输入"
                                    v-model="tradeRuleFormData.saleFeeMoney">
                            </el-input> 元
                        </span>

                    </el-form-item>
                    <el-form-item label="增值服务费：" prop="addFeeType">
                        <el-radio v-model="tradeRuleFormData.addFeeType" :label="0">系统设置</el-radio>
                        <el-radio v-model="tradeRuleFormData.addFeeType" :label="1">合作商设置</el-radio>
                    </el-form-item>
                    <el-form-item label="售票截止时间：" prop="saleEndTime">
                        <div>
                            <el-radio @change="saleEndTimeTypeChange" v-model="tradeRuleFormData.saleEndTimeType" :label="0">放映前</el-radio>
                            <span v-show="tradeRuleFormData.saleEndTimeType === 0">
                                <el-input
                                        style="width: 100px"
                                        placeholder="请输入"
                                        v-model="tradeRuleFormData.saleEndTime">
                                </el-input> 分钟（最大100分钟）
                            </span>
                        </div>
                        <div>
                            <el-radio @change="saleEndTimeTypeChange" v-model="tradeRuleFormData.saleEndTimeType" :label="1">放映后</el-radio>
                            <span v-show="tradeRuleFormData.saleEndTimeType === 1">
                                <el-input
                                        style="width: 100px"
                                        placeholder="请输入"
                                        v-model="tradeRuleFormData.saleEndTime">
                                </el-input> 分钟（最大100分钟）
                            </span>
                        </div>
                        <div>
                            <el-radio @change="saleEndTimeTypeChange" v-model="tradeRuleFormData.saleEndTimeType" :label="2">放映结束前都可售票</el-radio>
                        </div>

                    </el-form-item>
                    <el-form-item label="渠道可预售排期天数：" prop="presalePlanDays">
                        <el-input
                                style="width: 100px"
                                placeholder="请输入"
                                v-model="tradeRuleFormData.presalePlanDays">
                        </el-input> （最大60天）
                    </el-form-item>
                    <el-form-item label="每笔订单可购影票最多张数：" prop="maxSaleTicketAmount">
                        <el-input
                                style="width: 100px"
                                placeholder="请输入"
                                v-model="tradeRuleFormData.maxSaleTicketAmount">
                        </el-input> （最大20张）
                    </el-form-item>
                    <el-form-item label="每笔订单可购卖品最多数量：" prop="maxSaleGoodsAmount">
                        <el-input
                                style="width: 100px"
                                placeholder="请输入"
                                v-model="tradeRuleFormData.maxSaleGoodsAmount">
                        </el-input> （最大20笔）
                    </el-form-item>
<!--                    <el-form-item label="退票规则：">-->
<!--                        <el-select v-model="tradeRuleFormData.refundRuleUid" placeholder="请选择">-->
<!--                            <el-option-->
<!--                                    v-for="item in refundRuleUidOptions"-->
<!--                                    :key="item.keyCode"-->
<!--                                    :label="item.keyName"-->
<!--                                    :value="item.keyCode">-->
<!--                            </el-option>-->
<!--                        </el-select>-->
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
                <el-button type="primary" :disabled="!tradeRuleShow" @click="saveCinemaParams">保存</el-button>
                <el-button @click="cancel">取消</el-button>
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
            let saleFeePercentageValidator = (rule, value, callback) => {
                if (!value && this.tradeRuleFormData.netSaleFeeMode === 2) {
                    callback(new Error('请输入百分比'))
                } else {
                    let reg = /^([1-9]\d?|100)$/
                    if(reg.test(value)) {
                        callback()
                    }else {
                        callback(new Error('百分比区间为1-100的整数'))
                    }
                }
            }

            let saleFeeMoneyValidator = (rule, value, callback) => {
                if (!value && this.tradeRuleFormData.netSaleFeeMode !== 2) {
                    callback(new Error('请输入金额'))
                } else {
                    let reg = /^(\d{1,2}(\.\d{1,2})?|100)$/
                    if(reg.test(value)) {
                        callback()
                    }else {
                        callback(new Error('金额区间为0-100，最多两位小数'))
                    }
                }
            }

            let saleEndTimeValidator = (rule, value, callback) => {
                if (!value) {
                    if(this.tradeRuleFormData.saleEndTimeType === 2) {
                        callback()
                    }else {
                        callback(new Error('请输入时间'))
                    }
                } else {
                    let reg = /^100$|^(\d|[1-9]\d)$/
                    if (reg.test(value)) {
                        callback()
                    }else {
                        callback(new Error('时间区间为0-100'))

                    }
                }
            }

            let presalePlanDaysValidator = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入天数'))
                } else {
                    let reg = /^([1-9]|[1-5][0-9]|60)$/
                    if (reg.test(value)) {
                        callback()
                    }else {
                        callback(new Error('天数区间为1-60'))

                    }
                }
            }

            let maxSaleTicketAmountValidator = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入张数'))
                } else {
                    let reg = /^(?:[1-9]|1[0-9]|20)$/
                    if (reg.test(value)) {
                        callback()
                    }else {
                        callback(new Error('张数区间为1-20'))

                    }
                }
            }

            let maxSaleGoodsAmountValidator = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入数量'))
                } else {
                    let reg = /^(?:[1-9]|1[0-9]|20)$/
                    if (reg.test(value)) {
                        callback()
                    }else {
                        callback(new Error('数量区间为1-20'))

                    }
                }
            }

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
                    netSaleFeeMode: 0,
                    saleFeePercentage: '',
                    saleFeeMoney: '',
                    addFeeType: 0,
                    saleEndTimeType: 0,
                    saleEndTime: '',
                    presalePlanDays: '',
                    maxSaleTicketAmount: '',
                    maxSaleGoodsAmount: '',
                    refundRuleUid: '',
                },
                tradeRuleFormDataRules: {
                    saleFeePercentage: [
                        { validator: saleFeePercentageValidator, trigger: 'blur' }
                    ],
                    saleFeeMoney: [
                        { validator: saleFeeMoneyValidator, trigger: 'blur' }
                    ],
                    addFeeType: [
                        { required: true, message: '请选择增值服务费', trigger: 'change' }
                    ],
                    saleEndTime: [
                        { validator: saleEndTimeValidator, trigger: 'blur' }
                    ],
                    presalePlanDays: [
                        { validator: presalePlanDaysValidator, trigger: 'blur' }
                    ],
                    maxSaleTicketAmount: [
                        { validator: maxSaleTicketAmountValidator, trigger: 'blur' }
                    ],
                    maxSaleGoodsAmount: [
                        { validator: maxSaleGoodsAmountValidator, trigger: 'blur' }
                    ],

                },

                refundRuleUidOptions: [],
                netSaleFeeModeOptions: [{
                    keyName: '最高限额',
                    keyCode: 0
                }, {
                    keyName: '固定金额',
                    keyCode: 1
                }, {
                    keyName: '标准价百分比',
                    keyCode: 2
                }],
                tradeRuleShow: true,
                mode: 'add',
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
            cancel() {
                this.$router.push({ path: '/trade/cinemaChannel' })
            },

            netSaleFeeModeChange(val) {
                console.log(val)
                this.tradeRuleFormData.saleFeePercentage = ''
                this.tradeRuleFormData.saleFeeMoney = ''
                this.$refs.tradeRuleFormData.clearValidate(['saleFeePercentage', 'saleFeeMoney'])

            },
            saleEndTimeTypeChange(val) {
                console.log(val)
                this.tradeRuleFormData.saleEndTime = ''
                this.$refs.tradeRuleFormData.clearValidate('saleEndTime')

            },
            saveCinemaParams() {
                console.log(this.basicInfoFormData, this.tradeRuleFormData)
                if(this.tradeRuleShow) {
                    this.$refs.tradeRuleFormData.validate( valid => {
                        if (valid) {
                            if(this.mode === 'add') {
                                this.addChannelCinema(Object.assign(this.basicInfoFormData, this.tradeRuleFormData))

                            }else if(this.mode === 'update') {
                                this.updateChannelCinema(Object.assign(this.basicInfoFormData, this.tradeRuleFormData))

                            }
                        }
                    })
                }else {
                    if(this.mode === 'add') {
                        this.addChannelCinema(this.basicInfoFormData)

                    }else if(this.mode === 'update') {
                        this.updateChannelCinema(this.basicInfoFormData)

                    }
                }

            },

            getChannelDetail(channelUid, cinemaUid) {
                this.$csmList.getChannelDetail({ channelUid, cinemaUid }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        if(res.data) {
                            this.mode = 'update'
                            this.tradeRuleFormData = res.data

                        }
                    }else {
                        this.error(res.msg)
                    }

                })


            },

            addChannelCinema(data) {
                this.$csmList.addChannelCinema(data).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.success('保存成功！')
                        this.$router.push({ path: '/trade/cinemaChannel' })

                    }else {
                        this.error(res.msg)
                    }

                })
            },

            updateChannelCinema(data) {
                this.$csmList.updateChannelCinema(data).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.success('保存成功！')
                        this.$router.push({ path: '/trade/cinemaChannel' })

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