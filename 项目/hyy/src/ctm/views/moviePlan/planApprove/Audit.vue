<template>
    <div class="audit">

        <singleCinema
                ref="frameSingleCinema"
                :framedialogVisible="singleCinemaVisible"
                :type="singleCinemaType"
                :innerData="innerData">
            <div slot="footerId">
                <el-button @click="singleCinemaVisible = false">取 消</el-button>
                <el-button type="primary" @click="singleCinemaVisible = false">确 定</el-button>
            </div>
        </singleCinema>

        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="70%">
            <p style="white-space: pre-wrap; line-height: 28px">{{ dialogMsg }}</p>
            <span slot="footer" class="dialog-footer">
                <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-form v-show="showType === 'table'" :inline="true" :model="formData" class="demo-form-inline search-form" size="small">
            <el-form-item>
                <el-button type="primary" @click="singleCinemaVisible = true">确 定</el-button>

            </el-form-item>
            <el-form-item label="场次日期：">
                <el-date-picker
                    v-model="date"
                    type="daterange"
                    @change="dateChange"
                    value-format="yyyy-MM-dd"
                    :clearable="false"
                    :editable="false"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="状态：">
                <el-select v-model="formData.actionType" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                        v-for="item in actionTypeOptions"
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

        <el-form v-show="showType === 'moviePlan'" :inline="true" class="demo-form-inline search-form" size="small">
            <el-form-item>
                <el-date-picker
                    v-model="moviePlanDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    :clearable="false"
                    :editable="false"
                    @change="moviePlanDateChange"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
        </el-form>

        <el-row type="flex" class="row-bg el-row-btns" justify="space-between">
            <el-col :span="12">
                <el-checkbox v-show="showType === 'moviePlan'" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>

                <el-button :disabled="showType === 'table' ? !multipleSelection.length : !selectedCount" @click="multipleHandler('pass')" size="small">通过</el-button>
                <el-button :disabled="showType === 'table' ? !multipleSelection.length : !selectedCount" @click="multipleHandler('overrule')" size="small">驳回</el-button>
                <span>已选 {{ showType === 'table' ? multipleSelection.length : selectedCount}} 项</span>
            </el-col>
            <el-col :span="12">
                <!--<el-button @click="onSubmit" size="small">快速选择</el-button>-->
                <el-button-group style="float: right">
                    <el-button @click="toggleShowType('table')" :type="showType==='table'?'primary':''" icon="el-icon-tickets"></el-button>
                    <el-button @click="toggleShowType('moviePlan')" :type="showType==='moviePlan'?'primary':''" icon="el-icon-menu"></el-button>
                </el-button-group>
<!--                <el-radio-group style="float: right" v-model="showType" size="medium">-->
<!--                    <el-radio-button icon="el-icon-tickets" ></el-radio-button>-->
<!--                    <el-radio-button icon="el-icon-menu" ></el-radio-button>-->
<!--                </el-radio-group>-->
            </el-col>
        </el-row>

        <div v-show="showType === 'table'">
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
                        width="200"
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{`${scope.row.movieName}（${scope.row.disVersion}/${scope.row.movieDescLanguage}）`}}
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
                        {{scope.row.publisherRate}}%
                    </template>
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
                        <span v-if="scope.row.actionType === 'PASS'">已通过</span>
                        <span v-if="scope.row.actionType === 'REJECT'">已驳回</span>
                        <span v-if="scope.row.actionType === 'SUBMIT'">审批中</span>
                    </template>
                </el-table-column>
                <el-table-column
                        width="180"
                        fixed="right"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button style="padding: 0" :disabled="!selectable(scope.row)" @click="handleClick(scope.row.planUid, 'pass')" type="text" size="small">通过</el-button>
                        <el-button style="padding: 0" :disabled="!selectable(scope.row)" @click="handleClick(scope.row.planUid, 'overrule')" type="text" size="small">驳回</el-button>
                        <el-button style="padding: 0" @click="toDetail(scope.row.planUid)" type="text" size="small">查看详情</el-button>
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

    </div>

</template>

<script>
    import formatDate from 'ctm/mixins/formatDate'
    import moviePlan from "ctm/views/moviePlan/planApprove/components/moviePlan"
    import singleCinema from "frame_cpm/dialogs/cinemaDialog/singleCinema"

    export default {
        name: "Audit",
        mixins: [formatDate],
        components: {
            moviePlan,
            singleCinema
        },
        data() {
            return {
                singleCinemaVisible: false,
                singleCinemaType: 2,
                innerData: {
                    id: '',
                },

                checkAll: false,
                isIndeterminate: false,
                showType: 'table',
                dialogMsg: '',
                dialogVisible: false,
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
                actionTypeOptions: [],
                date: '',
                total: 0,
                formData: {
                    cinemaUid: '',
                    current: 1,
                    startPlanDate: '',
                    endPlanDate: '',
                    actionType: 'SUBMIT',
                    size: 20
                },
                moviePlanDate: new Date(),
                baseParam: {},
                mode: 0,
                selectedCount: 0
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

            moviePlanDateChange(val) {
                this.baseParam = {
                    planDate: val,
                    uidCinema: this.formData.cinemaUid
                }
                this.isIndeterminate = false
                this.checkAll = false
            },

            handleCheckAllChange(val) {
                this.$refs.moviePlan.handleCheckedHall(val)
                this.$refs.moviePlan.$refs.filmPlan.selectAllRooms(val)
                this.$refs.moviePlan.updateRoomsIsIndeterminate()
                this.isIndeterminate = false
            },

            toggleShowType(showType) {
                this.showType = showType

            },

            toDetail(uid) {
                console.log(uid)
                this.$router.push({
                    path: '/ticket/moviePlan/detail',
                    query: { mode: 'view', uid }
                })
            },

            selectable(row) {
                // return row.actionType === 'SUBMIT' && Date.parse(row.showTimeStart) > new Date().getTime()
                return row.actionType === 'SUBMIT'
            },

            multipleHandler(actionType) {
                let data = []
                if(this.showType === 'table') {
                    data = this.multipleSelection.map( item => {
                        return item.planUid
                    })
                }else {
                    this.$refs.moviePlan.$refs.filmPlan.plan_rooms.forEach( item => {
                        item.forEach( innerItem => {
                            if(innerItem.isSelect) {
                                data.push(innerItem.planUid)
                            }
                        })
                    })
                }
                this.approvePass(data, actionType)

            },

            handleClick(planUid, actionType) {
                console.log(planUid, actionType);
                this.approvePass([planUid], actionType)
            },

            approvePass(planUids, actionType) {
                this.$ctmList.approvePass({
                    planUids,
                    actionType,
                    cinemaUid: this.formData.cinemaUid
                }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        if(res.data.length === 0) {
                            this.success(actionType === 'pass' ? '通过成功！' : '驳回成功！');
                        }else {
                            let msg = ''
                            res.data.forEach( (item, index) => {
                                msg += `${index + 1}、由于 ${item.hallName} 日期${item.showTimeStart.split(' ')[0]}开始于${item.showTimeStart.split(' ')[1].substring(0, 5)}的${item.movieName} ${item.errorMsg}，请重新检查后再提交审核。\n`
                            })
                            this.dialogMsg = msg
                            this.dialogVisible = true

                        }
                        this.search()
                        this.baseParam = JSON.parse(JSON.stringify(this.baseParam))
                        this.isIndeterminate = false
                        this.checkAll = false

                    }else {
                        this.error(res.msg);
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
            resetFields() {
                this.date = this.getFutureWeekDate()
                this.dateChange(this.date)
                this.formData.actionType = 'SUBMIT'
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
                this.$ctmList.getByName({name: 'SCH_PLAN_APPROVE_PLAN_ACTION_TYPE'}).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.actionTypeOptions = res.data
                    }else {
                        this.error(res.msg);
                    }

                })
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
            handleCheckAll(checkAll, isIndeterminate) {
                this.checkAll = checkAll
                this.isIndeterminate = isIndeterminate

            },
            getPlanRooms(data) {
                console.log(data)
                let selectedCount = 0
                data.forEach( item => {
                    item.forEach( innerItem => {
                        if(innerItem.isSelect) {
                            selectedCount++

                        }
                    })
                })
                this.selectedCount = selectedCount
            }
        },
        mounted() {
            this.date = this.getFutureWeekDate()
            this.dateChange(this.date)

            this.$ctmList.getUserInfo().then( res => {
                console.log(res)
                if(res.code === 200) {
                    this.formData.cinemaUid = res.data.cinemaUid
                    this.innerData.id = res.data.cinemaUid
                    this.search()
                    this.getByName()

                    this.baseParam = {
                        planDate: this.formatDateTime(Date.parse(new Date())),
                        uidCinema: res.data.cinemaUid
                    }

                }else {
                    this.error(res.msg);
                }

            }).catch( err => {
                console.log(err)
            })

            this.$eventHub.$on("handleCheckAll", this.handleCheckAll)
            this.$eventHub.$on('getPlanRooms', this.getPlanRooms)

        }

    }
</script>

<style lang="scss">

</style>