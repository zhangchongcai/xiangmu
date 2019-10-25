<template>
    <section class="schedule-info-add">

        <el-form :inline="true" :model="basicFormData" style="margin-top: 20px">
            <el-form-item label="公映年月：">
                <el-date-picker
                        v-model="basicFormData.showMonth"
                        type="month"
                        :readonly="!!mode"
                        :clearable="false"
                        :editable="false"
                        :picker-options="pickerOptions"
                        placeholder="请选择">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="版本：">
                <span style="font-size: 12px">{{(mode === 'edit' && currentStatus === 3) ? basicFormData.versionNo + 1 : basicFormData.versionNo}}</span>
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
                        <el-button v-if="!mode || mode === 'edit'" @click="toAddMovie">添加影片</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table
                    v-show="currentCinema.length > 0"
                    :data="tableData"
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
                        width="160"
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
                        label="首映/下映日期"
                        width="200"
                        fixed
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.dateShowFirst">{{scope.row.dateShowFirst.split(' ')[0]}}</span>
                        <span v-if="scope.row.dateShowFirst && scope.row.dateShowOff">至</span>
                        <span v-if="scope.row.dateShowOff">{{scope.row.dateShowOff.split(' ')[0]}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="公映日期"
                        width="100"
                        fixed
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.datePublicShow">{{scope.row.datePublicShow.split(' ')[0]}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="适用影院"
                        width="100"
                        fixed
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div style="font-size: 12px" v-if="scope.row.movieCinemaVoList">
<!--                            已选<span style="color: #e7746b">{{scope.row.movieCinemaVoList.length}}</span>家-->
                            已选<span style="color: #e7746b">{{ getCinemaCount(scope.row) }}</span>家
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="影院"
                        min-width="200">
                    <el-table-column
                            :key="index"
                            v-for="(item,index) in currentCinema"
                            :label="item.cinemaName"
                            min-width="260"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div v-show="time.cinemaUid === item.cinemaUid && (time.startDate || time.startTime)"
                                 :key="idx"
                                 v-for="(time,idx) in scope.row.infoMovieTimeList"
                                 class="time-table-template">
                                <div v-if="time.startDate && time.endDate" :style="{'font-size': '12px', 'line-height': time.startTime ? '25px' : '50px'}">
                                    {{time.startDate}} 至 {{time.endDate}}
                                </div>
                                <div v-if="time.startTime && time.endTime" :style="{'font-size': '12px', 'line-height': time.startDate ? '25px' : '50px'}">
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
                        <el-button v-if="!mode || mode === 'edit'" style="padding: 0" @click="toEditMovie(scope.$index)" type="text" size="small">编辑</el-button>
                        <el-button v-if="!mode || mode === 'edit'" style="padding: 0" @click="deleteRow(scope.$index)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-table
                    v-show="currentCinema.length === 0"
                    :data="tableData"
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
                        width="160"
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
                        label="首映/下映日期"
                        width="200"
                        fixed
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.dateShowFirst">{{scope.row.dateShowFirst.split(' ')[0]}}</span>
                        <span v-if="scope.row.dateShowFirst && scope.row.dateShowOff">至</span>
                        <span v-if="scope.row.dateShowOff">{{scope.row.dateShowOff.split(' ')[0]}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="公映日期"
                        width="100"
                        fixed
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.datePublicShow">{{scope.row.datePublicShow.split(' ')[0]}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="适用影院"
                        width="100"
                        fixed
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div style="font-size: 12px" v-if="scope.row.movieCinemaVoList">
                            <!--                            已选<span style="color: #e7746b">{{scope.row.movieCinemaVoList.length}}</span>家-->
                            已选<span style="color: #e7746b">{{ getCinemaCount(scope.row) }}</span>家
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="影院"
                        min-width="200">
                </el-table-column>
                <el-table-column
                        width="100"
                        fixed="right"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="!mode || mode === 'edit'" style="padding: 0" @click="toEditMovie(scope.$index)" type="text" size="small">编辑</el-button>
                        <el-button v-if="!mode || mode === 'edit'" style="padding: 0" @click="deleteRow(scope.$index)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-table
                v-show="approveRecordData.length > 0"
                :data="approveRecordData"
                style="width: 100%; margin: 10px 0">
            <el-table-column
                    label="审批结果"
                    show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.action === 'PASS'">通过</span>
                    <span v-if="scope.row.action === 'REJECT'">驳回</span>
                    <span v-if="scope.row.action === 'SUBMIT'">提交</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="remark"
                    label="审批意见"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="approveUserName"
                    label="审批人"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="approveTime"
                    label="审批时间"
                    show-overflow-tooltip>
            </el-table-column>
        </el-table>

        <el-form class="approve-form" v-show="mode === 'approve'" :model="approveForm" :rules="rules" ref="approveForm" label-width="100px">
            <el-form-item label="审批结果：" prop="action">
                <el-radio v-model="approveForm.action" label="PASS">通过</el-radio>
                <el-radio v-model="approveForm.action" label="REJECT">驳回</el-radio>
            </el-form-item>
            <el-form-item label="审批意见：" prop="remark">
                <el-input
                        style="width: 360px"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入"
                        v-model="approveForm.remark"
                        maxlength="500">
                </el-input>
                <span style="position: absolute; bottom: 0; line-height: 12px; font-size: 12px; margin-left: 10px;">{{approveForm.remark.length}}/500</span>
            </el-form-item>
        </el-form>

        <div v-if="mode === 'approve'" class="btn-area">
            <el-button type="primary" @click="confirmApprove">确定</el-button>
            <el-button @click="closeDetail">返回</el-button>
        </div>

        <div v-if="!mode || mode === 'edit'" class="btn-area">
            <el-button type="primary" @click="submitGuideInfo">提交审核</el-button>
            <el-button type="primary" @click="saveGuideInfo">确定</el-button>
            <el-button @click="closeDetail">取消</el-button>
        </div>

        <div v-if="mode === 'view'" class="btn-area">
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
    import addMovie from 'ctmSrc/views/scheduleInfo/AddMovie'
    import areaData from 'ctmSrc/assets/data/area'
    export default {
        name: "Add",
        components: {
            addMovie
        },
        data() {
            let remarkValidator = (rule, value, callback) => {
                if (!value && this.approveForm.action === '') {
                    callback(new Error('请输入审批意见'))
                } else {
                    callback()
                }
            }
            return {
                approveForm: {
                    action: 'PASS',
                    remark: '',
                    uid: ''
                },

                currentStatus: '',

                approveRecordData: [],

                rules: {
                    action: [
                        { required: true, message: '请选择审批结果', trigger: 'change' }
                    ],
                    remark: [
                        { validator: remarkValidator, trigger: 'submit' }
                    ],
                },

                mode: '',
                uid: '',
                editIndex: -1,
                basicFormData: {
                    showMonth: '',
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

            getCinemaCount(row) {
                let count = 0
                row.movieCinemaVoList.forEach( item => {
                    row.infoMovieTimeList.some( inner => {
                        if(item.cinemaUid === inner.cinemaUid && (inner.startDate || inner.startTime)) {
                            count++
                            return true
                        }
                    })
                })
                return count
            },

            confirmApprove() {
                this.$refs.approveForm.validate( valid => {
                    if (valid) {
                        this.schGuideInfoApprove()
                    }
                });

            },

            closeDetail() {
                this.$router.push({ path: '/ticket/scheduleInfo' })

            },

            positionToAddMovie() {
                this.$nextTick(() => {
                    document.querySelector('.content-wrapper').scrollTop = document.querySelector('.add-movie').offsetTop

                    console.log(document.querySelector('.add-movie').offsetTop)

                })
            },

            toEditMovie(index) {
                this.editIndex = index
                this.component = 'addMovie'
                this.positionToAddMovie()

                this.$nextTick( () => {
                    this.$refs.addMovie.initData(JSON.parse(JSON.stringify(this.tableData[index])))

                })

            },

            deleteRow(index) {
                this.tableData.splice(index, 1)

            },

            saveGuideInfo() {
                if(!this.tableData.length) {
                    this.error('请至少添加一部影片！')
                    return
                }

                let validate = ''
                let month = this.basicFormData.showMonth.getMonth() + 1

                let showMonthStart = `${this.basicFormData.showMonth.getFullYear()}-${month > 9 ? month : '0' + month}-01 00:00:00`
                let showMonthEnd = `${this.basicFormData.showMonth.getFullYear()}-${month > 9 ? month : '0' + month}-${this.getCountDays(new Date(this.basicFormData.showMonth))} 23:59:59`

                this.tableData.forEach( item => {
                    if(Date.parse(showMonthStart) > Date.parse(item.datePublicShow) || Date.parse(showMonthEnd) < Date.parse(item.datePublicShow)) {
                        validate += `<p><span style="color: #F33430">${item.movieName}</span>公映日期不在公映年月范围内</p>`
                    }
                })

                if(validate.length) {
                    this.$alert(validate, '提示', {
                        dangerouslyUseHTMLString: true
                    })
                    return
                }

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
                if(!this.tableData.length) {
                    this.error('请至少添加一部影片！')
                    return
                }

                let validate = ''
                let month = this.basicFormData.showMonth.getMonth() + 1

                let showMonthStart = `${this.basicFormData.showMonth.getFullYear()}-${month > 9 ? month : '0' + month}-01 00:00:00`
                let showMonthEnd = `${this.basicFormData.showMonth.getFullYear()}-${month > 9 ? month : '0' + month}-${this.getCountDays(new Date(this.basicFormData.showMonth))} 23:59:59`

                this.tableData.forEach( item => {
                    if(Date.parse(showMonthStart) > Date.parse(item.datePublicShow) || Date.parse(showMonthEnd) < Date.parse(item.datePublicShow)) {
                        validate += `<p><span style="color: #F33430">${item.movieName}</span>公映日期不在公映年月范围内</p>`
                    }
                })

                if(validate.length) {
                    this.$alert(validate, '提示', {
                        dangerouslyUseHTMLString: true
                    })
                    return
                }

                let data = {
                    showMonth: `${this.basicFormData.showMonth.getFullYear()}${month > 9 ? month : '0' + month}`,
                    infoMovieList: this.tableData
                }
                if(this.mode) {
                    data.versionNo = this.basicFormData.versionNo
                    data.uid = this.uid
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
                if(this.component === 'addMovie') {
                    this.$refs.addMovie.formData.movieCode = ''
                    this.$refs.addMovie.movieChange('')
                    this.$refs.addMovie.remoteMethod('')

                }else {
                    this.component = 'addMovie'
                }
                this.positionToAddMovie()
            },

            updateComponent(val) {
                this.component = val

            },

            schGuideInfoApprove() {
                this.$ctmList.schGuideInfoApprove(this.approveForm).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.success(this.approveForm.action === 'PASS' ? '通过成功！' : '驳回成功！');
                        this.$router.push({ path: '/ticket/scheduleInfo' })

                    }else {
                        this.error(res.msg)
                    }

                }).catch( err => {
                    console.log(err)
                })
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
                this.provinceOptions = areaData
                this.cityOptions = this.provinceOptions[0].cityVoList

                this.formInline.provinceCode = this.provinceOptions[0].provinceCode
                this.formInline.cityCode = this.cityOptions[0].cityCode

                this.getCinemaAreaList()

                // this.$ctmList.getAreaInfo().then( res => {
                //     console.log(res)
                //     if(res.code === 200) {
                //         this.provinceOptions = res.data
                //         this.cityOptions = this.provinceOptions[0].cityVoList
                //
                //         this.formInline.provinceCode = this.provinceOptions[0].provinceCode
                //         this.formInline.cityCode = this.cityOptions[0].cityCode
                //
                //         this.getCinemaAreaList()
                //
                //     }else {
                //         this.error(res.msg)
                //     }
                //
                // }).catch( err => {
                //     console.log(err)
                // })
            },

            schGuideInfoDetails(showMonth, versionNo) {
                this.$ctmList.schGuideInfoDetails({ showMonth, versionNo }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.basicFormData.showMonth = new Date(`${res.data.showMonth.substr(0, 4)}-${res.data.showMonth.substr(4, 2)}`)
                        this.basicFormData.versionNo = res.data.versionNo

                        this.tableData = res.data.infoMovieList
                        this.currentStatus = res.data.status
                        this.uid = res.data.uid
                        this.approveForm.uid = res.data.uid

                        this.approveRecordData = res.data.approveHistoryVoList

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
            console.log(this.$route)

            if(this.$route.query.mode) {
                this.mode = this.$route.query.mode
            }
            if(this.$route.query.showMonth && this.$route.query.versionNo) {
                this.schGuideInfoDetails(this.$route.query.showMonth, this.$route.query.versionNo)
            }else {
                let date = new Date()
                date.setMonth(date.getMonth() + 1)
                this.basicFormData.showMonth = date
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
                font-size: 14px;
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

        .approve-form {
            .el-form-item {
                margin-bottom: 0;
                .el-form-item__label, .el-radio__label {
                    font-size: 12px;
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