<template>
    <section class="schedule-info-add">

        <el-form :inline="true" :model="basicFormData" style="margin-top: 20px">
            <el-form-item label="首映年月：">
                <el-date-picker
                        v-model="basicFormData.showMonth"
                        type="month"
                        :readonly="!!mode"
                        :clearable="false"
                        :picker-options="pickerOptions"
                        placeholder="请选择">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="版本：">
                {{basicFormData.versionNo}}
            </el-form-item>
        </el-form>

        <div class="content">
            <h4 class="title">影片排片信息</h4>
            <div class="header clearfix">
                <div class="header-left">设置影片排片时段的影院在排片时会进行时段校验，未设置的影院不校验。</div>
                <el-form class="header-right" :inline="true" :model="formInline">
                    <el-form-item label="省市">
                        <el-select
                                style="width: 128px"
                                v-model="formInline.provinceCode"
                                @change="provinceChange"
                                placeholder="请选择">
<!--                            <el-option label="全部" value=""></el-option>-->
                            <el-option
                                    v-for="item in provinceOptions"
                                    :key="item.provinceCode"
                                    :label="item.provinceName"
                                    :value="item.provinceCode">
                            </el-option>
                        </el-select>
                        <el-select
                                style="width: 128px"
                                v-model="formInline.cityCode"
                                @change="getCinemaAreaList"
                                placeholder="请选择">
<!--                            <el-option label="全部" value=""></el-option>-->
                            <el-option
                                    v-for="item in cityOptions"
                                    :key="item.cityCode"
                                    :label="item.cityName"
                                    :value="item.cityCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="影院">
                        <el-select v-model="cinema" placeholder="请选择">
                            <el-option label="全部" value=""></el-option>
                            <el-option
                                    v-for="item in cinemaOptions"
                                    :key="item.cinemaUid"
                                    :label="item.cinemaName"
                                    :value="item.cinemaUid">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="margin-right: 0">
                        <el-button v-if="mode !== 'view'" @click="toAddMovie">添加影片</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table
                    :data="tableData"
                    stripe
                    :header-cell-style="{'background': '#e7ebff'}"
                    style="width: 100%; margin-top: 5px">
                <el-table-column
                        label="序号"
                        fixed
                        type="index"
                        width="60">
                </el-table-column>
                <el-table-column
                        prop="movieName"
                        label="影片"
                        fixed
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="disVersion"
                        label="放映制式"
                        width="80"
                        fixed
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="movieClass"
                        label="影片分类"
                        width="80"
                        fixed
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="movieLanguage"
                        label="语言"
                        width="80"
                        fixed
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="timeLong"
                        label="片长（分钟）"
                        width="100"
                        fixed
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        label="公映/下映日期"
                        width="200"
                        fixed
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.datePublicShow">{{scope.row.datePublicShow.split(' ')[0]}}</span>
                        <span v-if="scope.row.datePublicShow && scope.row.dateShowOff">至</span>
                        <span v-if="scope.row.dateShowOff">{{scope.row.dateShowOff.split(' ')[0]}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="首映日期"
                        width="100"
                        fixed
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.dateShowFirst">{{scope.row.dateShowFirst.split(' ')[0]}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="适用影院"
                        width="100"
                        fixed
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div style="font-size: 12px" v-if="scope.row.movieCinemaVoList">
                            已选<span style="color: #e7746b">{{scope.row.movieCinemaVoList.length}}</span>家
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        v-if="currentCinema.length > 0"
                        label="影院">
                    <el-table-column
                            v-for="item in currentCinema"
                            :label="item.cinemaName"
                            width="260"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div v-if="time.cinemaUid === item.cinemaUid"
                                 v-for="time in scope.row.infoMovieTimeList"
                                 class="time-table-template">
                                <div v-if="time.startDate && time.endDate" style="font-size: 12px">
                                    {{time.startDate}} 至 {{time.endDate}}
                                </div>
                                <div v-if="time.startTime && time.endTime" style="font-size: 12px">
                                    {{time.startTime}} 至 {{time.endTime}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column
                        width="100"
                        fixed="right"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="mode !== 'view'" style="padding: 0" @click="toEditMovie(scope.$index)" type="text" size="small">编辑</el-button>
                        <el-button v-if="mode !== 'view'" style="padding: 0" @click="deleteRow(scope.$index)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div v-if="mode !== 'view'" class="btn-area">
            <el-button type="primary" @click="submitGuideInfo">提交审核</el-button>
            <el-button type="primary" @click="saveGuideInfo">确定</el-button>
            <el-button @click="closeDetail">取消</el-button>
        </div>

        <div v-else class="btn-area">
            <el-button @click="closeDetail">关闭</el-button>
        </div>

        <component
                :is="component"
                ref="addMovie"
                @updateComponent="updateComponent"
                @addTableData="addTableData"
                @updateTableData="updateTableData"
                :provinceOptions="provinceOptions"
                :basicFormData="basicFormData"
                :editIndex="editIndex"
                :movieTableData="tableData"
        ></component>

    </section>
</template>

<script>
    import addMovie from 'ctm/views/scheduleInfo/AddMovie'
    export default {
        name: "Add",
        components: {
            addMovie
        },
        data() {
            return {
                mode: '',
                editIndex: -1,
                basicFormData: {
                    showMonth: new Date(),
                    versionNo: 1,
                },
                formInline: {
                    provinceCode: '',
                    cityCode: '',

                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    },
                },

                cinema: '',

                component: '',
                tableData: [],
                provinceOptions: [],
                cityOptions: [],
                cinemaOptions: [],


            }
        },
        computed: {
            currentCinema() {
                if(this.cinema) {
                    let currentCinema = this.cinemaOptions.filter( item => {
                        return item.cinemaUid === this.cinema

                    })
                    return currentCinema
                }else {
                    return this.cinemaOptions
                }

            }
        },
        methods: {

            closeDetail() {
                this.$router.push({ path: '/ticket/scheduleInfo' })

            },

            positionToAddMovie() {
                this.$nextTick(() => {
                    document.querySelector('.el-main').scrollTop = document.querySelector('.add-movie').offsetTop

                    console.log(document.querySelector('.add-movie').offsetTop)

                })
            },

            toEditMovie(index) {
                this.editIndex = index
                this.component = 'addMovie'
                this.$nextTick( () => {
                    this.$refs.addMovie.initData(JSON.parse(JSON.stringify(this.tableData[index])))

                })

            },

            deleteRow(index) {
                this.tableData.splice(index, 1)

            },

            saveGuideInfo() {
                let month = this.basicFormData.showMonth.getMonth() + 1
                let data = {
                    showMonth: `${this.basicFormData.showMonth.getFullYear()}${month > 9 ? month : '0' + month}`,
                    infoMovieList: this.tableData
                }
                if(this.mode) {
                    data.versionNo = this.basicFormData.versionNo
                    this.schGuideInfoUpdate(data)

                }else {
                    this.schGuideInfoSave(data)

                }

            },

            submitGuideInfo() {
                let month = this.basicFormData.showMonth.getMonth() + 1
                let data = {
                    showMonth: `${this.basicFormData.showMonth.getFullYear()}${month > 9 ? month : '0' + month}`,
                    infoMovieList: this.tableData
                }
                if(this.mode) {
                    data.versionNo = this.basicFormData.versionNo
                }
                this.schGuideInfoSubmit(data)

            },

            updateTableData(val) {
                let data = JSON.parse(JSON.stringify(this.tableData))
                data[this.editIndex] = val

                this.tableData = data

            },

            addTableData(val) {
                this.tableData.push(val)

            },

            provinceChange(provinceCode) {
                let data = this.provinceOptions.find( item => {
                    return item.provinceCode === provinceCode
                })

                this.cityOptions = data.cityVoList
                this.formInline.cityCode = this.cityOptions[0].cityCode

                this.getCinemaAreaList()

            },

            toAddMovie() {
                this.editIndex = -1
                this.component = 'addMovie'
                this.positionToAddMovie()
            },

            updateComponent(val) {
                this.component = val

            },

            schGuideInfoSave(data) {
                this.$ctmList.schGuideInfoSave(data).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.success('保存成功！')
                        this.$router.push({ path: '/ticket/scheduleInfo' })

                    }else {
                        this.error(res.msg)
                    }

                }).catch( err => {
                    console.log(err)
                })
            },

            schGuideInfoUpdate(data) {
                this.$ctmList.schGuideInfoUpdate(data).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.success('保存成功！')
                        this.$router.push({ path: '/ticket/scheduleInfo' })

                    }else {
                        this.error(res.msg)
                    }

                }).catch( err => {
                    console.log(err)
                })
            },

            schGuideInfoSubmit(data) {
                this.$ctmList.schGuideInfoSubmit(data).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.success('提交审核成功！')
                        this.$router.push({ path: '/ticket/scheduleInfo' })

                    }else {
                        this.error(res.msg)
                    }

                }).catch( err => {
                    console.log(err)
                })
            },

            getCinemaAreaList() {
                this.$ctmList.getCinemaAreaList(this.formInline).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.cinemaOptions = res.data
                        this.cinema = ''


                    }else {
                        this.error(res.msg)
                    }

                }).catch( err => {
                    console.log(err)
                })
            },

            getAreaInfo() {
                this.$ctmList.getAreaInfo().then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.provinceOptions = res.data
                        this.cityOptions = this.provinceOptions[0].cityVoList

                        this.formInline.provinceCode = this.provinceOptions[0].provinceCode
                        this.formInline.cityCode = this.cityOptions[0].cityCode

                        this.getCinemaAreaList()

                    }else {
                        this.error(res.msg)
                    }

                }).catch( err => {
                    console.log(err)
                })
            },

            schGuideInfoDetails(showMonth, versionNo) {
                this.$ctmList.schGuideInfoDetails({ showMonth, versionNo }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.basicFormData.showMonth = new Date(`${res.data.showMonth.substr(0, 4)}-${res.data.showMonth.substr(4, 2)}`)
                        this.basicFormData.versionNo = res.data.versionNo
                        this.tableData = res.data.infoMovieList

                    }else {
                        this.error(res.msg)
                    }

                }).catch( err => {
                    console.log(err)
                })
            },

        },
        mounted() {
            console.log(this.$route)
            if(this.$route.query.mode) {
                this.mode = this.$route.query.mode
            }
            if(this.$route.query.showMonth && this.$route.query.versionNo) {
                this.schGuideInfoDetails(this.$route.query.showMonth, this.$route.query.versionNo)
            }
            this.getAreaInfo()
        }

    }
</script>

<style lang="scss">
    .schedule-info-add {
        .content {
            .title {
                color: #333333;
            }
            .header {
                .header-left {
                    float: left;
                    height: 40px;
                    line-height: 40px;
                    font-size: 12px;
                    color: #999999;
                }
                .header-right {
                    float: right;
                    .el-form-item {
                        margin-bottom: 0;
                        .el-button {
                            width: 80px;
                            height: 32px;
                            border: 1px solid #3B74FF;
                            border-radius: 4px;
                            padding: 8px;
                            span {
                                font-size: 12px;
                                color: #3B74FF;
                            }
                        }
                    }

                }

            }

            .el-table {
                .time-table-template {
                    height: 50px;
                }
                .time-table-template+.time-table-template {
                    border-top: 1px solid #ccc
                }
            }
        }

        .btn-area {
            margin-top: 20px;
            text-align: center;
            margin-bottom: 56px;
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