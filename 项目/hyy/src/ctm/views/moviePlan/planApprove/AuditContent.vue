<template>
    <div class="audit-content">
        <div class="audit-content-title">
            <div class="cinema-name">
                {{currentData.cinemaName}}
            </div>
            <div class="date">
                星期{{currentWeek}}&nbsp;&nbsp;&nbsp;{{currentData.planDate.split(' ')[0]}}
            </div>
        </div>

        <el-row type="flex" class="row-bg el-row-btns" justify="space-between">
            <el-col :span="24">
                <el-button-group style="float: right">
                    <el-button style="width: 64px" @click="toggleShowType('table')" :type="showType==='table'?'primary':''" icon="el-icon-tickets"></el-button>
                    <el-button style="width: 64px" @click="toggleShowType('moviePlan')" :type="showType==='moviePlan'?'primary':''" icon="el-icon-menu"></el-button>
                </el-button-group>
            </el-col>
        </el-row>

        <div v-show="showType === 'table'">
            <el-table
                    :data="tableData"
                    stripe
                    :header-cell-style="{'background': '#e7ebff'}"
                    style="width: 100%">
                <el-table-column
                        prop="movieName"
                        label="影片名称"
                        width="200"
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.joinFlag">{{ scope.row.joinMovieName }}</span>
                        <span v-else>{{`${scope.row.movieName}（${scope.row.disVersion}/${scope.row.movieDescLanguage}）`}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="showTimeStart"
                        label="日期"
                        width="120"
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.showTimeStart.split(' ')[0]}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="showTimeStart"
                        label="时间"
                        width="120"
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{`${scope.row.showTimeStart.split(' ')[1].substring(0, 5)}-${scope.row.showTimeEnd.split(' ')[1].substring(0, 5)}`}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="hallName"
                        label="影厅"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="publisherRate"
                        label="院方分账比例"
                        width="120"
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="!scope.row.joinFlag">{{scope.row.publisherRate}}%</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="priceProgramName"
                        label="价格方案"
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="!scope.row.joinFlag">{{scope.row.priceProgramName}}</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="minPrice"
                        label="最低票价"
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="!scope.row.joinFlag">{{scope.row.minPrice}}</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="票类价格"
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="bottom" v-if="scope.row.baseTicketList && scope.row.baseTicketList.length > 0">
                            <div style="padding: 10px" v-for="(item, index) in scope.row.baseTicketList" :key="index">
                                <span style="display: inline-block; min-width: 70px">{{item.ticketName}}</span>
                                <span>￥{{item.price}}</span>
                            </div>
                            <el-button type="text" slot="reference">查看</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                        label="网售价格"
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="bottom" v-if="scope.row.favTicketList && scope.row.favTicketList.length > 0">
                            <div style="padding: 10px" v-for="(item, index) in scope.row.favTicketList" :key="index">
                                <span style="display: inline-block; min-width: 70px">{{item.channelName}}</span>
                                <span>￥{{item.price}}</span>
                            </div>
                            <el-button type="text" slot="reference">查看</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                        width="120"
                        prop="priceProgramName"
                        label="增值服务费"
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        0.00
                    </template>
                </el-table-column>
                <el-table-column
                        prop="submitUserName"
                        label="提交人"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="approveUserName"
                        label="审批人"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        label="状态"
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.approveStatus === 'WAIT_APPROVE'">待审批</span>
                        <span v-if="scope.row.approveStatus === 'APPROVED'">已审批</span>
                        <span v-if="scope.row.approveStatus === 'REJECT'">已驳回</span>
                    </template>
                </el-table-column>
            </el-table>

            <div class="page-wrap">
                <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="formData.current"
                        :page-sizes="[20, 40, 60, 80]"
                        :page-size="formData.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>

        <div class="moviePlanWrap" v-show="showType === 'moviePlan'">
            <movie-plan ref="moviePlan" :pageControlType="false" :base-param="baseParam" :mode="mode"></movie-plan>

        </div>

        <el-table
                v-show="approveRecordData.length > 0"
                :data="approveRecordData"
                stripe
                :header-cell-style="{'background': '#F2F4FD'}"
                style="width: 100%; margin-bottom: 10px">
            <el-table-column
                    prop="approveStatus"
                    label="审批结果"
                    show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.approveStatus === 'APPROVED'">通过</span>
                    <span v-if="scope.row.approveStatus === 'REJECT'">驳回</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="approveRemark"
                    label="审批意见"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="approveUesrName"
                    label="审批人"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="approveTime"
                    label="审批时间"
                    show-overflow-tooltip>
            </el-table-column>
        </el-table>

        <el-form class="approve-form" v-show="!isView" :model="approveForm" :rules="rules" ref="approveForm" label-width="100px">
            <el-form-item label="审批结果：" prop="isPass">
                <el-radio v-model="approveForm.isPass" :label="1">通过</el-radio>
                <el-radio v-model="approveForm.isPass" :label="0">驳回</el-radio>
            </el-form-item>
            <el-form-item label="审批意见：" prop="approveRemark">
                <el-input
                        style="width: 360px"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入"
                        v-model="approveForm.approveRemark"
                        maxlength="500">
                </el-input>
                <span style="position: absolute; bottom: 0; line-height: 12px; font-size: 12px; margin-left: 10px;">{{approveForm.approveRemark.length}}/500</span>
            </el-form-item>
        </el-form>

        <div class="btn-area">
            <el-button v-if="!isView" type="primary" @click="confirmApprove">确定</el-button>
            <el-button @click="cancelApprove">返回</el-button>
        </div>

    </div>

</template>

<script>
    import formatDate from 'ctm/mixins/formatDate'
    import moviePlan from "ctm/views/moviePlan/planApprove/components/moviePlan"
    import singleCinema from "frame_cpm/dialogs/cinemaDialog/singleCinema"

    export default {
        name: "AuditContent",
        mixins: [formatDate],
        components: {
            moviePlan,
            singleCinema
        },
        props: {
            currentData: {
                type: Object,
                required: true
            },
            showType: {
                type: String,
                required: true
            },
            isView: {
                type: Boolean,
                required: true
            },
        },
        data() {
            let approveRemarkValidator = (rule, value, callback) => {
                if (!value && !this.approveForm.isPass) {
                    callback(new Error('请输入审批意见'))
                } else {
                    callback()
                }
            }
            return {
                approveForm: {
                    isPass: 1,
                    approveRemark: '',
                    planDate: '',
                    uidCinema: '',
                    approveUid: '',
                },
                rules: {
                    isPass: [
                        { required: true, message: '请选择审批结果', trigger: 'change' }
                    ],
                    approveRemark: [
                        { validator: approveRemarkValidator, trigger: 'submit' }
                    ],
                },
                status: '',
                multipleSelection: [],
                tableData: [],
                approveRecordData: [],
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                date: '',
                total: 0,
                formData: {
                    cinemaUid: '',
                    current: 1,
                    startPlanDate: '',
                    endPlanDate: '',
                    actionType: '',
                    size: 20
                },
                moviePlanDate: new Date(),
                baseParam: {},
                mode: 0,
                selectedCount: 0
            }
        },
        computed: {
            currentWeek() {
                let week = ''
                switch (new Date(this.currentData.planDate).getDay()) {
                    case 1:
                        week = '一'
                        break
                    case 2:
                        week = '二'
                        break
                    case 3:
                        week = '三'
                        break
                    case 4:
                        week = '四'
                        break
                    case 5:
                        week = '五'
                        break
                    case 6:
                        week = '六'
                        break
                    case 0:
                        week = '日'
                        break
                }
                return week

            }

        },
        watch: {
            showType(val) {
                if(val === 'moviePlan') {
                    window.document.oncontextmenu = function() {
                        return false
                    }
                }else {
                    window.document.oncontextmenu = null
                }
            }

        },
        destroyed() {
            window.document.oncontextmenu = null
        },
        methods: {

            confirmApprove() {
                this.$refs.approveForm.validate( valid => {
                    if (valid) {
                        this.schApprove()
                    }
                });

            },

            cancelApprove() {
                this.$emit('updateCurrentComponent', 'auditOverview')
            },

            toggleShowType(showType) {
                this.$emit('updateShowType', showType)
            },

            schApprove() {
                this.$ctmList.schApprove(this.approveForm).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        if(!res.data) {
                            this.success(this.approveForm.isPass ? '通过成功！' : '驳回成功！');
                            this.$emit('updateCurrentComponent', 'auditOverview')
                        }else {
                            this.error(res.data)
                        }

                    }else {
                        this.error(res.msg);
                    }

                })
            },

            search() {
                this.$ctmList.getApproveList(this.formData).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.tableData = res.data.list
                        this.total = res.data.total

                    }else {
                        this.error(res.msg);
                    }

                })
            },

            schApproveDetails() {
                this.$ctmList.schApproveDetails({
                    approveUid: this.currentData.uid
                }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.approveRecordData = res.data.historyList

                    }else {
                        this.error(res.msg);
                    }

                })
            },

            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.formData.size = val
                this.search()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.formData.current = val
                this.search()
            },

            formatDateTime(timeStamp) {
                var date = new Date(timeStamp)
                let y = date.getFullYear()
                let m = date.getMonth() + 1
                m = m < 10 ? `0${m}` : m
                let d = date.getDate()
                d = d < 10 ? `0${d}` : d
                let h = date.getHours()
                return `${y}-${m}-${d}`
            },

        },
        mounted() {
            console.log(this.currentData, 'currentData')
            this.formData.cinemaUid = this.approveForm.uidCinema = this.currentData.cinemaUid
            this.formData.startPlanDate = this.formData.endPlanDate = this.approveForm.planDate = this.currentData.planDate.split(' ')[0]
            this.approveForm.approveUid = this.currentData.uid

            this.search()
            this.schApproveDetails()

            this.baseParam = {
                planDate: this.currentData.planDate.split(' ')[0],
                uidCinema: this.currentData.cinemaUid
            }



        }

    }
</script>

<style lang="scss">
    .audit-content {
        /*height: 100%;*/
        padding: 20px;
        .audit-content-title {
            width: 100%;
            padding: 12px 16px;
            background: #EDF1FD;
            .cinema-name {
                display: inline-block;
                min-width: 158px;
                font-size: 12px;
                height: 32px;
                line-height: 32px;

            }
            .date {
                display: inline-block;
                font-size: 12px;
                padding-left: 30px;
                height: 32px;
                line-height: 32px;
                border-left: 1px solid #C7D7FE;

            }

        }
        .moviePlanWrap {
            /*height: calc(100% - 130px);*/
            margin-bottom: 6px;
        }
        .approve-form {
            .el-form-item {
                margin-bottom: 0;
                .el-form-item__label, .el-radio__label {
                    font-size: 12px;
                }
            }

        }
        .btn-area {
            text-align: center;
            margin-top: 20px;
            .el-button {
                width: 80px;
                height: 32px;
                border-radius: 4px;
                span {
                    font-size: 12px;
                }
            }
            .el-button + .el-button {
                margin-left: 32px;
            }

        }
    }

</style>