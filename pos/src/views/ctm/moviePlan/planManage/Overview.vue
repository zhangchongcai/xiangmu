<template>
    <div>
        <el-form :inline="true" :model="formData" class="demo-form-inline search-form" size="small">
            <el-form-item label="时间范围">
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
            <el-form-item label="开售状态">
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
            <el-form-item label="影厅">
                <el-select v-model="formData.hallUid" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                        v-for="item in hallUidOptions"
                        :key="item.uid"
                        :label="item.name"
                        :value="item.uid">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="渠道">
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
            <el-form-item label="影片名称">
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

        <el-table
            :data="tableData"
            stripe
            :header-cell-style="{'background': '#F2F4FD'}"
            style="width: 100%; margin-top: 10px">
            <el-table-column
                prop="movieName"
                label="场次名称"
                width="180"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="date"
                label="日期"
                width="180"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="time"
                label="时间"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="hallName"
                label="影厅"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="minPrice"
                label="最低票价"
                width="180"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="priceProgramName"
                label="价格方案"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="address"
                label="票类价格">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="bottom">
                        <div style="padding: 10px" v-for="item in scope.row.baseTicketList">
                            <span style="display: inline-block; min-width: 70px">{{item.ticketName}}</span>
                            <span>￥{{item.price}}</span>
                        </div>
                        <el-button type="text" slot="reference">查看</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                prop="addFee"
                label="增值服务费"
                show-overflow-tooltip>
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
    import formatDate from 'src/mixins/ctm/formatDate'

    export default {
        name: "Overview",
        mixins: [formatDate],
        data() {
            return {
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
                saleStatusOptions: [],
                hallUidOptions: [],
                channelUidOptions: [],
                date: '',
                total: 0,
                formData: {
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
            search() {
                this.$api.getPrizeList(this.formData).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.tableData = res.data.records
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
            getByName() {
                // 开售状态枚举值
                this.$api.getByName({name: 'SCH_PLAN_SALE_STATUS'}).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.saleStatusOptions = res.data
                    }else {
                        this.error(res.msg);
                    }

                })
            },
            findAllHall() {
                // 影厅枚举值
                this.$api.findAllHall({cinemaUid: this.formData.cinemaUid}).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.hallUidOptions = res.data
                    }else {
                        this.error(res.msg);
                    }

                })
            },
            getChannelList() {
                // 渠道枚举值
                this.$api.getChannelList({cinemaUid: this.formData.cinemaUid}).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.channelUidOptions = res.data
                    }else {
                        this.error(res.msg);
                    }

                })
            }
        },
        mounted() {

            this.date = this.getFutureWeekDate()
            this.dateChange(this.date)

            this.$api.getUserInfo().then( res => {
                console.log(res)
                if(res.code === 200) {
                    this.formData.cinemaUid = res.data.cinemaUid
                    this.search()
                    this.getByName()
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

</style>