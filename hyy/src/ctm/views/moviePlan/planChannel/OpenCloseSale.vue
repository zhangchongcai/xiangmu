<template>
    <div class="open-close-sale">

        <singleCinema
                ref="frameSingleCinema"
                :framedialogVisible.sync="singleCinemaVisible"
                :type="singleCinemaType"
                :innerData="innerData"
                @callBackSingle="callBackSingle">
            <div slot="footerId">
                <el-button type="primary" @click="$refs.frameSingleCinema.confirmData(), singleCinemaVisible = false">确 定</el-button>
                <el-button @click="singleCinemaVisible = false">取 消</el-button>
            </div>
        </singleCinema>

        <el-dialog title="选择渠道" @close="dialogClose" :visible.sync="dialogVisible" width="76%">
            <el-form :inline="true" :model="searchForm" :label-width="formLabelWidth" size="small">
                <el-form-item label="渠道类型">
                    <el-select v-model="searchForm.channelNative" placeholder="请选择">
                        <el-option label="全部" :value="-1"></el-option>
                        <el-option
                            v-for="item in channelNatureOptions"
                            :key="item.keyCode"
                            :label="item.keyName"
                            :value="item.keyCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道编码">
                    <el-input v-model="searchForm.code" placeholder="请输入渠道编码"></el-input>
                </el-form-item>
                <el-form-item label="渠道名称">
                    <el-input v-model="searchForm.name" placeholder="请输入渠道名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getBaseChannelList" icon="el-icon-search">查询</el-button>
                </el-form-item>
            </el-form>

            <div style="display: flex">
                <el-table
                    :data="gridData"
                    ref="multipleTable"
                    stripe
                    :header-cell-style="{'background': '#F2F4FD'}"
                    @selection-change="selectedChannelChange"
                    style="width: 70%">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column property="code" label="渠道编码" width="150"></el-table-column>
                    <el-table-column property="name" label="渠道名称"></el-table-column>
                    <el-table-column
                        label="渠道类型"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.type === 0">线下渠道</span>
                            <span v-else-if="scope.row.type === 1">直营线上</span>
                            <span v-else-if="scope.row.type === 2">网络代售渠道</span>
                        </template>
                    </el-table-column>
                </el-table>

                <el-card class="box-card" shadow="never">
                    <div slot="header" class="clearfix">
                        <span>已选内容：</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="emptyData">清空</el-button>
                    </div>
                    <div v-for="item in selectedChannel" :key="item.code" class="text item">
                        <span>{{ item.name }}</span>
                        <i style="float: right; padding: 3px 0; cursor: pointer" class="el-icon-close" @click="deleteCurrent(item.code)"></i>
                    </div>
                </el-card>

            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="setChannelStatus">保 存</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-form :inline="true" :model="formData" class="demo-form-inline search-form" size="small">
            <el-form-item label="影院名称：">
                <el-button @click="$refs.frameSingleCinema.listAuthCommCinemas(), singleCinemaVisible = true">{{ cinemaName }}</el-button>
            </el-form-item>
<!--            <el-form-item label="放映时间：">-->
<!--                <el-select v-model="formData.isOverdue" placeholder="请选择">-->
<!--                    <el-option-->
<!--                            v-for="item in isOverdueOptions"-->
<!--                            :key="item.keyCode"-->
<!--                            :label="item.keyName"-->
<!--                            :value="item.keyCode">-->
<!--                    </el-option>-->
<!--                </el-select>-->
<!--            </el-form-item>-->
            <el-form-item label="时间范围：">
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
            <el-form-item label="开售状态：">
                <el-select v-model="formData.saleStatus" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                        v-for="item in saleStatusOptions"
                        :key="item.keyCode"
                        :label="item.keyName"
                        :value="item.keyCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="影厅：">
                <el-select v-model="formData.hallUid" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                        v-for="item in hallUidOptions"
                        v-if="item.status"
                        :key="item.uid"
                        :label="item.name"
                        :value="item.uid">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="销售渠道：">
                <el-select v-model="formData.channelUid" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                        v-for="item in channelUidOptions"
                        :key="item.uid"
                        :label="item.name"
                        :value="item.uid">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="影片名称：">
                <el-input
                    placeholder="请输入影片名称"
                    v-model="formData.movieName"
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
                <el-button @click="resetFields">重置条件</el-button>
            </el-form-item>
        </el-form>

        <el-row type="flex" class="row-bg el-row-btns" justify="space-between">
            <el-col :span="12">
                <el-button :disabled="!multipleSelection.length" @click="multipleHandler('open')" size="small">场次开售</el-button>
                <el-button :disabled="!multipleSelection.length" @click="multipleHandler('stop')" size="small">场次停售</el-button>
                <el-button :disabled="!multipleSelection.length" @click="handleChannel('open')" size="small">渠道开售</el-button>
                <el-button :disabled="!multipleSelection.length" @click="handleChannel('stop')" size="small">渠道停售</el-button>
                <span>已选 {{ multipleSelection.length }} 项</span>
            </el-col>
            <!--<el-col :span="2.5">-->
                <!--<el-button @click="onSubmit" size="small">快速选择</el-button>-->
            <!--</el-col>-->
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
                width="200"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    {{`${scope.row.joinFlag ? scope.row.joinMovieName : scope.row.movieName}（${scope.row.disVersion || '--'}/${scope.row.movieDescLanguage || '--'}）`}}
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
                width="180"
                show-overflow-tooltip>
            </el-table-column>
            <!--<el-table-column-->
                <!--prop="timeLong"-->
                <!--label="影片时长"-->
                <!--show-overflow-tooltip>-->
            <!--</el-table-column>-->
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
                        <div style="padding: 10px" v-if="item.saleStatus === 'SALE'" v-for="(item, index) in scope.row.favTicketList" :key="index">
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
                    <el-popover
                            trigger="hover"
                            placement="bottom"
                            v-if="(scope.row.baseTicketList && scope.row.baseTicketList.length > 0) || (scope.row.favTicketList && scope.row.favTicketList.length > 0)">
                        <div style="padding: 10px" v-for="(item, index) in scope.row.baseTicketList" :key="item.ticketName">
                            <span style="display: inline-block; min-width: 70px">{{item.ticketName}}</span>
                            <span>￥{{item.addFee}}</span>
                        </div>
                        <div style="padding: 10px" v-if="item.saleStatus === 'SALE'" v-for="(item, index) in scope.row.favTicketList" :key="item.channelName">
                            <span style="display: inline-block; min-width: 70px">{{item.channelName}}</span>
                            <span>￥{{item.addFee}}</span>
                        </div>
                        <el-button type="text" slot="reference">查看</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                label="销售渠道"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="bottom" v-if="scope.row.saleChannel && scope.row.saleChannel.length > 0">
                        <div style="padding: 10px" v-for="(item, index) in scope.row.saleChannel" :key="index">
                            <span style="display: inline-block; min-width: 70px">{{item}}</span>
                        </div>
                        <el-button type="text" slot="reference">查看</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                prop="saleStatus"
                label="场次状态"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                width="120"
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.saleStatus === '停售'" :disabled="!selectable(scope.row)" @click="handleClick(scope.row.planUid, 'open')" type="text" size="small">开售</el-button>
                    <el-button v-else :disabled="!selectable(scope.row)" @click="handleClick(scope.row.planUid, 'stop')" type="text" size="small">停售</el-button>
                    <el-button style="padding: 0" @click="toDetail(scope.row.planUid)" type="text" size="small">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="page-wrap">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="formData.currentPage"
                :page-sizes="[20, 40, 60, 80]"
                :page-size="formData.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

    </div>

</template>

<script>

    import formatDate from 'ctm/mixins/formatDate'
    import singleCinema from "frame_cpm/dialogs/cinemaDialog/singleCinema"


    export default {
        name: "OpenCloseSale",
        mixins: [formatDate],
        components: {
            singleCinema
        },
        data() {
            return {
                singleCinemaVisible: false,
                singleCinemaType: 2,
                innerData: {
                    id: '',
                },
                cinemaName: '',

                openStopFlag: '',
                channelNatureOptions: [{
                    keyCode: 2,
                    keyName: '网络代售渠道'
                }, {
                    keyCode: 1,
                    keyName: '直营线上'
                }, {
                    keyCode: 0,
                    keyName: '线下渠道'
                }],

                selectedChannel: [],
                gridData: [],
                searchForm: {
                    cinemaUid: '',
                    channelNative: -1,
                    name: '',
                    code: '',
                },
                formLabelWidth: '60px',
                dialogVisible: false,

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
                saleStatusOptions: [{
                    keyCode: 'SALE',
                    keyName: '开售'
                }, {
                    keyCode: 'STOP',
                    keyName: '停售'
                }],
                hallUidOptions: [],
                channelUidOptions: [],
                // isOverdueOptions: [{
                //     keyCode: 0,
                //     keyName: '未过期'
                // }, {
                //     keyCode: 1,
                //     keyName: '已过期'
                // }],
                date: '',
                total: 0,
                formData: {
                    // isOverdue: 0,
                    channelUid: '',
                    cinemaUid: '',
                    saleStatus: '',
                    hallUid: '',
                    current: 1,
                    size: 20,
                    movieName: '',
                    startPlanDate: '',
                    endPlanDate: '',
                }
            }
        },
        methods: {

            callBackSingle(data) {
                this.singleCinemaVisible = data.framedialogVisible
                if(data.isCloseWindow) return

                console.log(data, '-----> data')
                this.cinemaName = data.data.name
                this.formData.cinemaUid = data.data.id
                this.searchForm.cinemaUid = data.data.id
                this.innerData.id = data.data.id

                this.search()

                this.findAllHall()
                this.getChannelList()

                // this.baseParam = {
                //     planDate: this.baseParam.planDate,
                //     uidCinema: data.data.id
                // }

            },

            dialogClose() {
                this.searchForm.channelNative = -1
                this.searchForm.name = this.searchForm.code = ''
            },

            emptyData() {
                this.selectedChannel = []
                this.$refs.multipleTable.clearSelection()

            },

            deleteCurrent(code) {
                let row = this.selectedChannel.find( item => {
                    return item.code === code
                })
                this.$refs.multipleTable.toggleRowSelection(row)

            },

            getBaseChannelList(cb) {
                this.$ctmList.getBaseChannelList(this.searchForm).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.gridData = res.data
                        cb && cb()
                    }else {
                        this.error(res.msg)
                    }

                })

            },
            toDetail(uid) {
                console.log(uid)
                this.$router.push({
                    path: '/ticket/moviePlan/detail',
                    query: { mode: 'view', uid, referer: encodeURIComponent(this.$route.fullPath) }
                })
            },

            selectable(row) {
                return Date.parse(row.showTimeStart) > new Date().getTime()
            },

            handleChannel(flag) {
                let data = this.multipleSelection.find( item => {
                    console.log(item.saleStatus)
                    return item.saleStatus === '停售'
                })
                if(data) {
                    this.error('所选场次中存在已停售场次，不允许做渠道开停售，请检查后再做渠道开停售')
                    return
                }
                this.openStopFlag = flag
                this.getBaseChannelList( _ => {
                    this.dialogVisible = true
                })

            },

            setChannelStatus() {
                let channelList = this.selectedChannel.map( item => {
                    return item.uid
                })
                let planUids = this.multipleSelection.map( item => {
                    return item.planUid
                })
                if(this.openStopFlag === 'open') {
                    this.$ctmList.setChannelOpen({ channelList, planUids }).then( res => {
                        console.log(res)
                        if(res.code === 200) {
                            this.success('渠道开售成功！')
                            this.dialogVisible = false
                            this.search()
                        }else {
                            this.error(res.msg)
                        }

                    })
                }else if(this.openStopFlag === 'stop') {
                    this.$ctmList.setChannelStop({ channelList, planUids }).then( res => {
                        console.log(res)
                        if(res.code === 200) {
                            this.success('渠道停售成功！')
                            this.dialogVisible = false
                            this.search()
                        }else {
                            this.error(res.msg)
                        }

                    })
                }
            },

            handleClick(planUid, saleStatus) {
                console.log(planUid, saleStatus);
                this.saleOpenStop([planUid], saleStatus)
            },

            multipleHandler(saleStatus) {
                let data = this.multipleSelection.map( item => {
                    return item.planUid
                })
                this.saleOpenStop(data, saleStatus)

            },

            saleOpenStop(planUids, saleStatus) {
                this.$ctmList.saleOpenStop({
                    planUids,
                    saleStatus,
                    cinemaUid: this.formData.cinemaUid
                }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.success(saleStatus === 'open' ? '开售成功！' : '停售成功！');
                        this.search()

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
            selectedChannelChange(val) {
                this.selectedChannel = val
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            search() {
                this.$ctmList.getSaleList(this.formData).then( res => {
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
                this.formData.hallUid = ''
                this.formData.channelUid = ''
                this.formData.saleStatus = ''
                this.formData.movieName = ''
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
            // getByName() {
            //     // 开售状态枚举值
            //     this.$ctmList.getByName({name: 'SCH_PLAN_SALE_STATUS'}).then( res => {
            //         console.log(res)
            //         if(res.code === 200) {
            //             this.saleStatusOptions = res.data
            //         }else {
            //             this.error(res.msg);
            //         }
            //
            //     })
            // },
            findAllHall() {
                // 影厅枚举值
                this.$ctmList.findAllHall({cinemaUid: this.formData.cinemaUid}).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.hallUidOptions = res.data
                        this.formData.hallUid = ''

                    }else {
                        this.error(res.msg);
                    }

                })
            },

            getChannelList() {
                // 渠道枚举值
                this.$ctmList.getChannelList({cinemaUid: this.formData.cinemaUid, type: 1}).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.channelUidOptions = res.data
                        this.formData.channelUid = ''

                    }else {
                        this.error(res.msg);
                    }

                })
            }
        },
        mounted() {
            this.date = this.getFutureWeekDate()
            this.dateChange(this.date)

            this.$ctmList.getUserInfo().then( res => {
                console.log(res)
                if(res.code === 200) {
                    this.formData.cinemaUid = res.data.cinemaUid
                    this.searchForm.cinemaUid = res.data.cinemaUid
                    this.innerData.id = Number(res.data.cinemaUid)
                    this.cinemaName = res.data.cinemaName

                    this.search()
                    // this.getByName()
                    this.findAllHall()
                    this.getChannelList()

                }else {
                    this.error(res.msg);
                }

            }).catch( err => {
                console.log(err)
            })


        }

    }
</script>

<style lang="scss">
    .open-close-sale {
        .el-dialog__body .el-form-item .el-button span{
            color: #fff;
        }
        .box-card {
            width: 30%;
            .text {
                font-size: 12px;
            }
            .item {
                margin-bottom: 8px;
            }
        }
    }

</style>