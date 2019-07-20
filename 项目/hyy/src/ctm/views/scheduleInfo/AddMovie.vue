<template>
    <section class="add-movie">

        <el-dialog
                title="时段一日期批量设置"
                :visible.sync="dateDialogVisible"
                width="30%"
                center>
            <div style="text-align: center">
                <el-date-picker
                        class="table-date"
                        v-model="batchDate"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button style="font-size: 12px" type="primary" @click="confirmBatchSettingDate">确定</el-button>
                <el-button style="font-size: 12px; margin-left: 30px" @click="dateDialogVisible = false">取消</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="时段一时间批量设置"
                :visible.sync="timeDialogVisible"
                width="30%"
                center>
            <div style="text-align: center">
                <el-time-picker
                        class="table-date"
                        is-range
                        value-format="HH:mm"
                        format="HH:mm"
                        v-model="batchTime"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围">
                </el-time-picker>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button style="font-size: 12px" type="primary" @click="confirmBatchSettingTime">确定</el-button>
                <el-button style="font-size: 12px; margin-left: 30px" @click="timeDialogVisible = false">取消</el-button>
            </span>
        </el-dialog>

        <h4 style="font-size: 14px; color: #333">添加影片排片信息</h4>

        <el-form class="movie-form" label-position="left" ref="formData" :model="formData" label-width="80px">
            <el-form-item label="专资影片：">
                <el-select
                        v-model="formData.movieCode"
                        @change="movieChange"
                        filterable
                        remote
                        clearable
                        reserve-keyword
                        placeholder="请输入影片名称"
                        :remote-method="remoteMethod"
                        :loading="loading">
                    <el-option
                            v-for="item in movieOptions"
                            :key="item.movieCode"
                            :label="item.movieName"
                            :value="item.movieCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="movie-info">
                <div>
                    <span>放映制式&nbsp; {{currentMovie.disVersion ? currentMovie.disVersion : ''}}</span>
                    <span>影片分类&nbsp; {{currentMovie.movieClass ? currentMovie.movieClass: ''}}</span>
                    <span>片长&nbsp; {{currentMovie.timeLong ? currentMovie.timeLong + '分' : ''}}</span>
                    <span>首映日期&nbsp; {{currentMovie.dateShowFirst ? currentMovie.dateShowFirst.split(' ')[0] : ''}}</span>
                    <span>公映日期&nbsp; {{currentMovie.datePublicShow ? currentMovie.datePublicShow.split(' ')[0] : ''}}</span>
                    <span>下映日期&nbsp; {{currentMovie.dateShowOff ? currentMovie.dateShowOff.split(' ')[0] : ''}}</span>
                </div>
            </el-form-item>
            <el-form-item label="说明：">
                <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="请输入内容"
                        v-model="formData.remark">
                </el-input>
            </el-form-item>
        </el-form>

        <h6 style="font-size: 12px; color: #666">按影院设置排片时段</h6>

        <div class="search-form-wrap">
            <el-form :inline="true" :model="formInline">
                <el-form-item label="省市：">
                    <el-select
                            style="width: 128px;"
                            v-model="formInline.provinceCode"
                            @change="provinceChange"
                            placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option
                                v-for="item in provinceOptions"
                                :key="item.provinceCode"
                                :label="item.provinceName"
                                :value="item.provinceCode">
                        </el-option>
                    </el-select>
                    <el-select
                            style="width: 128px;"
                            v-model="formInline.cityCode"
                            placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option
                                v-for="item in cityOptions"
                                :key="item.cityCode"
                                :label="item.cityName"
                                :value="item.cityCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="厅数：">
                    <el-input style="width: 80px;" v-model="formInline.hallCountLower" placeholder="请输入"></el-input>
                    至
                    <el-input style="width: 80px;" v-model="formInline.hallCountUpper" placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="getCinemaAreaList">查询</el-button>
        </div>

        <el-table
                ref="treeTable"
                :data="tableData"
                row-key="cinemaUid"
                :expand-row-keys="expandRowKeys"
                height="458"
                :header-cell-style="{'background': '#e7ebff'}"
                style="width: 100%; margin-top: 10px">
            <el-table-column
                    fixed
                    width="150">
                <template slot="header" slot-scope="scope">
                    <el-checkbox
                            :indeterminate="isIndeterminate"
                            v-model="checkAll"
                            @change="handleCheckAllChange"
                    >城市</el-checkbox>
                </template>
                <template slot-scope="scope">
                    <el-checkbox
                            v-if="scope.row.children"
                            :indeterminate="scope.row.isIndeterminate"
                            v-model="scope.row.checked"
                            @change="handleCheckCityChange($event, scope.row.cityCode)"
                    >{{scope.row.cityName}}</el-checkbox>
                </template>
            </el-table-column>
            <el-table-column
                    label="影院"
                    min-width="200"
                    fixed
                    show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-checkbox
                            v-if="scope.row.cinemaName"
                            v-model="scope.row.checked"
                            @change="handleCheckCinemaChange($event, scope.row.cinemaUid)"
                    >{{scope.row.cinemaName}}</el-checkbox>
                </template>
            </el-table-column>
            <el-table-column
                    prop="hallCount"
                    label="厅数"
                    width="80"
                    fixed
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    v-for="(item, index) in timeIntervalHeader"
                    show-overflow-tooltip>
                <template slot="header" slot-scope="scope">
                    <span>时段{{index+1}}</span>
                    <div class="time-interval-handler">
                        <el-link
                                :class="['time-interval-add', {'time-interval-line': index + 1 === timeIntervalHeader.length && index}]"
                                v-show="index + 1 === timeIntervalHeader.length"
                                icon="el-icon-circle-plus-outline"
                                @click="addTimeInterval(index)"
                        >添加</el-link>
                        <el-link
                                class="time-interval-del"
                                v-show="index"
                                icon="el-icon-remove-outline"
                                @click="delTimeInterval(index)"
                        >删除</el-link>
                    </div>
                </template>
                <el-table-column
                        width="321"
                        show-overflow-tooltip>
                    <template slot="header" slot-scope="scope">
                        <span>日期</span>
                        <el-button class="table-header-btn" @click="batchSettingDate(index)">批量设置</el-button>
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker
                                v-if="!scope.row.children"
                                class="table-date"
                                v-model="scope.row.timeList[index].date"
                                value-format="yyyy-MM-dd"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column
                        width="321"
                        show-overflow-tooltip>
                    <template slot="header" slot-scope="scope">
                        <span>时间</span>
                        <el-button class="table-header-btn" @click="batchSettingTime(index)">批量设置</el-button>
                    </template>
                    <template slot-scope="scope">
                        <el-time-picker
                                v-if="!scope.row.children"
                                class="table-date"
                                is-range
                                value-format="HH:mm"
                                format="HH:mm"
                                v-model="scope.row.timeList[index].time"
                                range-separator="至"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                placeholder="选择时间范围">
                        </el-time-picker>
                    </template>
                </el-table-column>
            </el-table-column>

        </el-table>

        <div class="btn-area">
            <el-button type="primary" @click="confirmAddMovie">确定</el-button>
            <el-button @click="cancelAddMovie">取消</el-button>
        </div>

    </section>
</template>

<script>
    export default {
        name: "AddMovie",
        props: {
            provinceOptions: {
                type: Array,
                required: true
            },
            basicFormData: {
                type: Object,
                required: true
            },
            editIndex: {
                type: Number,
                required: true
            },
            movieTableData: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                dateDialogVisible: false,
                batchDate: '',
                timeDialogVisible: false,
                batchTime: '',
                currentIndex: '',

                checkAll: false,
                isIndeterminate: false,

                loading: false,
                expandRowKeys: [],

                cityOptions: [],
                movieOptions: [],
                timeIntervalHeader: [{}],

                formData: {
                    movieCode: '',
                    remark: '',

                },
                currentMovie: {},

                formInline: {
                    provinceCode: '',
                    cityCode: '',
                    hallCountLower: '',
                    hallCountUpper: '',

                },
                tableData: [],

            }

        },
        methods: {

            initData(currentRow) {

                this.currentMovie = JSON.parse(JSON.stringify(currentRow))

                this.formData.remark = this.currentMovie.remark

                this.movieOptions = [this.currentMovie]
                this.formData.movieCode = this.currentMovie.movieCode


                let timeIntervalCount = currentRow.infoMovieTimeList.length / currentRow.movieCinemaVoList.length
                console.log(timeIntervalCount, 'timeIntervalCount')
                this.timeIntervalHeader = new Array(timeIntervalCount).fill({})

                let dataArr = []
                // let expandRowKeys = []

                currentRow.movieCinemaVoList.forEach( item => {

                    // 判断dataArr里有没有当前城市 没有就push 有就不push
                    let hasFlag = dataArr.find( innerItem => {
                        return innerItem.cityCode === item.cityCode
                    })
                    if(!hasFlag) {
                        // 没有当前城市 需要push
                        let dataObj = {
                            cityName: item.cityName,
                            cityCode: item.cityCode,
                            checked: false,
                            isIndeterminate: false,
                            children: []
                        }
                        dataArr.push(dataObj)
                    }
                })

                // 折叠表格 需要添加children
                dataArr.forEach( (item, index) => {
                    // cinemaUid 唯一标识
                    item.cinemaUid = 'cinemaUid' + index
                    // expandRowKeys.push('cinemaUid' + index)
                    currentRow.movieCinemaVoList.forEach( innerItem => {
                        if(item.cityCode === innerItem.cityCode) {
                            innerItem.checked = false
                            innerItem.timeList = new Array(timeIntervalCount)
                            console.log(innerItem.timeList, 'innerItem.timeList')

                            let countFlag = 0
                            currentRow.infoMovieTimeList.some( time => {
                                if(innerItem.cinemaUid === time.cinemaUid) {
                                    countFlag++
                                    innerItem.timeList[time.groupCode - 1] = {
                                        date: (time.startDate && time.endDate) ? [time.startDate, time.endDate] : '',
                                        time: (time.startTime && time.endTime) ? [time.startTime, time.endTime] : '',
                                    }
                                }

                                if(countFlag === timeIntervalCount) {

                                    // 重置标识并跳出循环
                                    countFlag = 0
                                    return true
                                }

                            })

                            item.children.push(innerItem)
                        }
                    })
                })

                console.log(dataArr, 'dataArr')

                // this.expandRowKeys = expandRowKeys
                this.tableData = dataArr


                this.$nextTick( () => {
                    setTimeout(_ => {
                        this.expandAll()
                    }, 50)
                })

            },

            handleCheckAllChange(val) {
                this.tableData.forEach( item => {
                    item.isIndeterminate = false
                    item.checked = val
                    item.children.forEach( innerItem => {
                        innerItem.checked = val
                    })
                })
                this.isIndeterminate = false
            },

            handleCheckCityChange(val, cityCode) {
                console.log(val, cityCode)
                this.tableData.some( item => {
                    if(item.cityCode === cityCode) {
                        item.children.forEach( innerItem => {
                            innerItem.checked = val
                        })
                        item.isIndeterminate = false
                        return true
                    }
                })
                this.syncCheckAll()

            },

            handleCheckCinemaChange(val, cinemaUid) {
                this.tableData.some( item => {
                    let data = item.children.find( innerItem => {
                        return innerItem.cinemaUid === cinemaUid
                    })
                    if(data) {
                        if(val) {
                            let flag = item.children.some( innerItem => {
                                return !innerItem.checked
                            })
                            if(flag) {
                                item.checked = false
                                item.isIndeterminate = true
                            }else {
                                item.checked = true
                                item.isIndeterminate = false
                            }
                        }else {
                            let flag = item.children.some( innerItem => {
                                return innerItem.checked
                            })
                            if(flag) {
                                item.checked = false
                                item.isIndeterminate = true
                            }else {
                                item.checked = false
                                item.isIndeterminate = false

                            }
                        }
                        return true
                    }

                })

                this.syncCheckAll()
            },

            syncCheckAll() {
                let checkAllFlag = this.tableData.every( item => {
                    return item.checked
                })

                if(checkAllFlag) {
                    this.checkAll = true
                    this.isIndeterminate = false

                }else {
                    let noCheckFlag = this.tableData.every( item => {
                        return !item.checked && !item.isIndeterminate
                    })
                    if(noCheckFlag) {
                        this.checkAll = false
                        this.isIndeterminate = false
                    }else {
                        this.checkAll = false
                        this.isIndeterminate = true
                    }
                }

            },


            confirmBatchSettingDate() {
                this.tableData.forEach( item => {
                    item.children.forEach( innerItem => {
                        if(innerItem.checked) {
                            innerItem.timeList[this.currentIndex].date = this.batchDate
                        }
                    })
                })
                this.dateDialogVisible = false
                this.batchDate = ''
            },

            confirmBatchSettingTime() {
                this.tableData.forEach( item => {
                    item.children.forEach( innerItem => {
                        if(innerItem.checked) {
                            innerItem.timeList[this.currentIndex].time = this.batchTime
                        }
                    })
                })
                this.timeDialogVisible = false
                this.batchTime = ''
            },

            // 批量设置日期
            batchSettingDate(index) {
                this.currentIndex = index
                this.dateDialogVisible = true

            },

            // 批量设置时间
            batchSettingTime(index) {
                this.currentIndex = index
                this.timeDialogVisible = true

            },

            movieChange(val) {
                if(!val) {
                    this.currentMovie = {}
                    return
                }

                let data = []

                // 有索引说明是编辑 要把当前行去掉之后再校验
                if(this.editIndex > -1) {
                    data = this.movieTableData.filter( (item, index) => {
                        return this.editIndex !== index
                    })
                }else {
                    data = this.movieTableData
                }

                let flag = data.find( item => {
                    return item.movieCode === val
                })

                if(flag) {
                    this.warning('当前信息表中存在该影片，请编辑')
                    this.formData.movieCode = ''
                    this.currentMovie = {}

                }else {
                    this.currentMovie = this.movieOptions.find( item => {
                        return item.movieCode === val
                    })

                }

            },

            remoteMethod(query) {
                console.log(this.basicFormData.showMonth, 'showMonth')
                let month = this.basicFormData.showMonth.getMonth() + 1
                let data = {
                    dateShowFirst: `${this.basicFormData.showMonth.getFullYear()}-${month > 9 ? month : '0' + month}-01`,
                    dateShowOff: `${this.basicFormData.showMonth.getFullYear()}-${month > 9 ? month : '0' + month}-${this.getCountDays(this.basicFormData.showMonth)}`,
                    movieName: query,
                    current: 1,
                    size: 10,
                }
                console.log(data, 'data')
                this.downloadMovieList(data)

            },

            provinceChange(provinceCode) {

                let data = this.provinceOptions.find( item => {
                    return item.provinceCode === provinceCode
                })

                this.cityOptions = data ? data.cityVoList : []

                this.formInline.cityCode = ''

            },

            delTimeInterval(index) {
                console.log(index)
                this.timeIntervalHeader.splice(index, 1)
                this.tableData.forEach( item => {
                    item.children.forEach( innerItem => {
                        innerItem.timeList.splice(index, 1)
                    })
                })

            },

            addTimeInterval(index) {
                console.log(index)
                this.timeIntervalHeader.push({})
                console.log(this.tableData, 'tableData')
                this.tableData.forEach( item => {
                    item.children.forEach( innerItem => {
                        innerItem.timeList.push({
                            date: '',
                            time: '',
                        })
                    })

                })

            },

            cancelAddMovie() {
                this.$emit('updateComponent', '')

            },
            confirmAddMovie() {
                if(!this.formData.movieCode) {
                    this.warning('请选择影片！')
                    return
                }
                if(this.tableData.length === 0) {
                    this.warning('请按影院设置排片时段！')
                    return
                }

                console.log(this.tableData, 'tableData')
                console.log(this.currentMovie, 'currentMovie')
                let data = JSON.parse(JSON.stringify(this.currentMovie))
                data.infoMovieTimeList = []
                data.movieCinemaVoList = []
                data.remark = this.formData.remark

                this.tableData.forEach( item => {
                    item.children.forEach( innerItem => {
                        data.movieCinemaVoList.push({
                            cinemaUid: innerItem.cinemaUid,
                            cinemaName: innerItem.cinemaName,
                            cityCode: innerItem.cityCode,
                            cityName: innerItem.cityName,
                            provinceCode: innerItem.provinceCode,
                            provinceName: innerItem.provinceName,
                            hallCount: innerItem.hallCount
                        })

                        innerItem.timeList.forEach( (time, index) => {
                            data.infoMovieTimeList.push({
                                cinemaUid: innerItem.cinemaUid,
                                startDate: time.date ? time.date[0] : '',
                                endDate: time.date ? time.date[1] : '',
                                startTime: time.time ? time.time[0] : '',
                                endTime: time.time ? time.time[1] : '',
                                groupCode: index + 1,
                            })

                        })

                    })
                })

                // 有索引就是编辑
                if(this.editIndex > -1) {
                    this.$emit('updateTableData', data)

                }else {
                    this.$emit('addTableData', data)

                }
                this.$emit('updateComponent', '')

            },

            // 默认展开所有行
            expandAll () {
                const els = this.$el.querySelectorAll('.el-table__fixed .el-table__expand-icon')
                console.log(els, 'els')
                for (let i = 0; i < els.length; i++) {
                    els[i].click()
                }
            },

            getCinemaAreaList() {
                this.$ctmList.getCinemaAreaList(this.formInline).then( res => {
                    console.log(res)
                    if(res.code === 200) {

                        // 初始化表头时段
                        this.timeIntervalHeader = [{}]
                        // 重置全选
                        this.checkAll = false
                        this.isIndeterminate = false

                        let dataArr = []
                        // let expandRowKeys = []

                        res.data.forEach( item => {

                            // 判断dataArr里有没有当前城市 没有就push 有就不push
                            let hasFlag = dataArr.find( innerItem => {
                                return innerItem.cityCode === item.cityCode
                            })
                            if(!hasFlag) {
                                // 没有当前城市 需要push
                                let dataObj = {
                                    cityName: item.cityName,
                                    cityCode: item.cityCode,
                                    checked: false,
                                    isIndeterminate: false,
                                    children: []
                                }
                                dataArr.push(dataObj)
                            }
                        })

                        // 折叠表格 需要添加children
                        dataArr.forEach( (item, index) => {
                            // cinemaUid 唯一标识
                            item.cinemaUid = 'cinemaUid' + index
                            // expandRowKeys.push('cinemaUid' + index)
                            res.data.forEach( innerItem => {
                                if(item.cityCode === innerItem.cityCode) {
                                    innerItem.checked = false
                                    innerItem.timeList = [{
                                        date: '',
                                        time: '',
                                    }]

                                    item.children.push(innerItem)
                                }
                            })
                        })

                        console.log(dataArr, 'dataArr')

                        // this.expandRowKeys = expandRowKeys
                        this.tableData = dataArr


                        this.$nextTick( () => {
                            setTimeout(_ => {
                                this.expandAll()
                            }, 50)
                        })


                    }else {
                        this.error(res.msg)
                    }

                }).catch( err => {
                    console.log(err)
                })
            },

            downloadMovieList(data) {
                this.loading = true
                this.$ctmList.DownloadmovieList(data).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.loading = false
                        this.movieOptions = res.data.records

                    }else {
                        this.error(res.msg)
                    }

                }).catch( err => {
                    console.log(err)
                })
            },

            /* 获取某个月的天数 */
            getCountDays(curDate) {
                /* 获取当前月份 */
                let curMonth = curDate.getMonth()
                /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
                curDate.setMonth(curMonth + 1)
                /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
                curDate.setDate(0)
                /* 返回当月的天数 */
                return curDate.getDate()
            },

        },
        mounted() {
            this.remoteMethod('')

        }
    }
</script>

<style lang="scss">
    .add-movie {
        background: #F5F5F5;
        border-radius: 4px;
        padding: 30px 24px 24px 24px;

        .table-date {
            width: 300px;
            height: 28px;
            line-height: 28px;
            .el-input__icon {
                line-height: 20px;
            }
            .el-range-input {
                font-size: 12px;
            }
            .el-range-separator {
                height: 28px;
                line-height: 28px;
                font-size: 12px;
                width: 15%;
            }
        }

        .movie-form {
            width: 550px;
            margin-top: 20px;
            .movie-info {
                .el-form-item__content {
                    margin-left: 0 !important;
                    span {
                        display: inline-block;
                        width: 32%;
                        font-size: 12px;
                        color: #666;
                    }
                }

            }
            .el-form-item__label {
                font-size: 12px;
                color: #666;
            }

        }
        .search-form-wrap {
            background: #F0F0F0;
            border: 1px solid #E5E5E5;
            padding: 16px 24px;
            margin-top: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .el-form {
                .el-form-item {
                    margin-bottom: 0;
                }
            }
            .el-button {
                width: 80px;
                height: 32px;
                border-radius: 4px;
                span {
                    font-size: 12px;
                }

            }

        }
        .el-table {
            .time-interval-handler {
                float: right;
                font-size: 0;
                height: 24px;
                line-height: 24px;
                .time-interval-add, .time-interval-del {
                    i {
                        font-size: 12px;
                        color: #3B74FF;
                        margin-right: 3px;
                    }
                    .el-link--inner {
                        color: #3B74FF;
                    }

                }
                .time-interval-add {
                    padding-right: 10px;
                }
                .time-interval-del {
                    padding-left: 10px;
                }
                .time-interval-line {
                    border-right: 1px solid #3B74FF;
                }
            }
            .table-header-btn {
                float: right;
                height: 24px;
                border: 1px solid #3B74FF;
                border-radius: 4px;
                background: transparent;
                span {
                    font-size: 12px;
                    color: #3B74FF;
                }

            }

        }
        .btn-area {
            margin-top: 20px;
            text-align: center;
            .el-button {
                width: 80px;
                height: 32px;
                border-radius: 4px;
                padding: 8px;
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