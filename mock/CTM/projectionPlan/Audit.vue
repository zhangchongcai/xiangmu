<template>
    <div class="audit">

        <el-form :inline="true" :model="formData" class="demo-form-inline search-form" size="small">
            <el-form-item label="场次日期">
                <el-date-picker
                    v-model="date"
                    type="daterange"
                    @change="dateChange"
                    value-format="yyyy-MM-dd"
                    :clearable="false"
                    :editable="false"
                    unlink-panels
                    range-separator="~"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="formData.approveStatus" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                        v-for="item in approveStatusOptions"
                        :key="item.keyCode"
                        :label="item.keyName"
                        :value="item.keyCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
                <el-button @click="resetFields">重置条件</el-button>
            </el-form-item>
        </el-form>

        <el-row type="flex" class="row-bg el-row-btns" justify="space-between">
            <el-col :span="12">
                <el-button :disabled="!multipleSelection.length" @click="multipleHandler('pass')" size="small">通过</el-button>
                <el-button :disabled="!multipleSelection.length" @click="multipleHandler('overrule')" size="small">驳回</el-button>
                <span>已选 {{ multipleSelection.length }} 项</span>
            </el-col>
            <el-col :span="12">
                <!--<el-button @click="onSubmit" size="small">快速选择</el-button>-->
                <el-button-group style="float: right">
                    <el-button type="primary" icon="el-icon-tickets"></el-button>
                    <el-button type="primary" icon="el-icon-menu"></el-button>
                </el-button-group>
            </el-col>
        </el-row>

        <el-table
            :data="tableData"
            stripe
            @selection-change="handleSelectionChange"
            :header-cell-style="{'background': '#F2F4FD'}"
            style="width: 100%">
            <el-table-column
                type="selection"
                width="55"
                :selectable="selectable">
            </el-table-column>
            <el-table-column
                prop="movieName"
                label="影片名称"
                width="180"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="showTimeStart"
                label="日期时间"
                width="180"
                show-overflow-tooltip>
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
            </el-table-column>
            <el-table-column
                prop="priceProgramName"
                label="价格方案"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="minPrice"
                label="最低票价"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                label="票类价格"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="bottom" v-if="scope.row.baseTicketList && scope.row.baseTicketList.length > 0">
                        <div style="padding: 10px" v-for="item in scope.row.baseTicketList">
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
                        <div style="padding: 10px" v-for="item in scope.row.favTicketList">
                            <span style="display: inline-block; min-width: 70px">{{item.channelName}}</span>
                            <span>￥{{item.price}}</span>
                        </div>
                        <el-button type="text" slot="reference">查看</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <!--<el-table-column-->
                <!--prop="priceProgramName"-->
                <!--label="增值服务费"-->
                <!--show-overflow-tooltip>-->
            <!--</el-table-column>-->
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
                    <span v-if="scope.row.approveStatus === 'APPROVED'">已审核</span>
                    <span v-if="scope.row.approveStatus === 'NOT_APPROVE'">未审核</span>
                    <span v-if="scope.row.approveStatus === 'WAIT_APPROVE'">待审核</span>
                </template>
            </el-table-column>
            <el-table-column
                width="120"
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                    <el-button :disabled="scope.row.approveStatus !== 'WAIT_APPROVE'" @click="handleClick(scope.row.planUid, 'pass')" type="text" size="small">通过</el-button>
                    <el-button :disabled="scope.row.approveStatus !== 'WAIT_APPROVE'" @click="handleClick(scope.row.planUid, 'overrule')" type="text" size="small">驳回</el-button>
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

</template>

<script>
    import formatDate from 'src/mixins/CTM/formatDate'
    import moviePlan from "src/views/CTM/moviePlan/moviePlan"

    export default {
        name: "Audit",
        mixins: [formatDate],
        components: {
            moviePlan
        },
        data() {
            return {
                status: '',
                multipleSelection: [],
                tableData: [],
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
                approveStatusOptions: [],
                date: '',
                total: 0,
                formData: {
                    cinemaUid: '',
                    current: 1,
                    startPlanDate: '',
                    endPlanDate: '',
                    approveStatus: '',
                    size: 20
                }
            }
        },
        methods: {

            selectable(row) {
                return row.approveStatus === 'WAIT_APPROVE'
            },

            multipleHandler(actionType) {
                let data = this.multipleSelection.map( item => {
                    return item.planUid
                })
                this.approvePass(data, actionType)

            },

            handleClick(planUid, actionType) {
                console.log(planUid, actionType);
                this.approvePass([planUid], actionType)
            },

            approvePass(planUids, actionType) {
                this.$api.approvePass({
                    planUids,
                    actionType,
                    cinemaUid: this.formData.cinemaUid
                }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.$message.success(actionType === 'pass' ? '通过成功！' : '驳回成功！');
                        this.search()
                    }else {
                        this.$message.error(res.msg);
                    }

                })
            },

            dateChange(val) {
                console.log(val)
                if(val) {
                    this.formData.startPlanDate = val[0]
                    this.formData.endPlanDate = val[1]
                }else {
                    this.formData.startPlanDate = ''
                    this.formData.endPlanDate = ''
                }

            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            search() {
                this.$api.getApproveList(this.formData).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.tableData = res.data.records
                        this.total = res.data.total

                    }else {
                        this.$message.error(res.msg);
                    }

                })
            },
            resetFields() {
                this.date = this.getCurrentWeekDate()
                this.dateChange(this.date)
                this.formData.approveStatus = ''
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
            getByName() {
                // 审核状态枚举值
                this.$api.getByName({name: 'SCH_PLAN_APPROVE_STATUS'}).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.approveStatusOptions = res.data
                    }else {
                        this.$message.error(res.msg);
                    }

                })
            }
        },
        mounted() {
            this.date = this.getCurrentWeekDate()
            this.dateChange(this.date)

            this.$api.getUserInfo().then( res => {
                console.log(res)
                if(res.code === 200) {
                    this.formData.cinemaUid = res.data.cinemaUid
                    this.search()
                    this.getByName()

                }else {
                    this.$message.error(res.msg);
                }

            }).catch( err => {
                console.log(err)
            })




        }

    }
</script>

<style lang="scss">

</style>