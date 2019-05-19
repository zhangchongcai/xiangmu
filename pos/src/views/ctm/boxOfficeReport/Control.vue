<template>
    <div class="control">
        <!--<CinemaSelect></CinemaSelect>-->

        <el-form :inline="true" :model="formData" class="demo-form-inline search-form" size="small">
            <el-form-item>
                <el-select v-model="formData.cinemaUid" @change="cinemaChange" placeholder="请选择">
                    <el-option
                        v-for="item in cinemaOptions"
                        :key="item.cinemaUid"
                        :label="item.cinemaName"
                        :value="item.cinemaUid">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <i class="el-icon-arrow-left" @click="changeDate(false)"></i>
                <el-date-picker
                    v-model="formData.date"
                    class="month"
                    type="month"
                    @change="dateChange"
                    :clearable="false"
                    :editable="false"
                    placeholder="请选择">
                </el-date-picker>
                <i class="el-icon-arrow-right" @click="changeDate(true)"></i>
            </el-form-item>
            <el-form-item style="float: right">
                <el-button type="primary" @click="report('')">批量上报</el-button>
            </el-form-item>

        </el-form>
        <div class="table-header clearfix">
            <div :style="{ color: (item === '星期六' || item === '星期日') ? '#999' : '#666' }" class="table-header-content" v-for="item in headerData" :key="item">{{ item }}</div>
        </div>
        <div class="table-body clearfix">
            <div :class="['table-body-content', {'bg-holiday': index % 7 === 0 || index % 7 === 6}, {'bg-today': new Date(Date.parse(item.reportDate)).toDateString() === new Date().toDateString()}]" v-for="(item, index) in bodyData" :key="index">
                <div v-if="item.reportStatus && item.reportStatus != '0'" :class="['iconfont', {'icon-report-success': item.reportStatus == 3}, {'icon-report-failed': item.reportStatus == 2}, {'icon-reporting': item.reportStatus == 1}]"></div>
                <span class="table-content-title">{{ item.reportDate ? item.reportDate.split('-')[2] : '' }}</span>
                <div v-if="item.reportStatus && item.reportStatus != '0'" class="table-content-btn">
                    <el-button size="mini" @click="report(item.reportDate)">重新上报</el-button>
                </div>
                <div v-if="(!item.reportStatus && Date.parse(item.reportDate) < new Date().getTime()) || item.reportStatus == '0'" class="table-content-btn">
                    <el-button size="mini" @click="report(item.reportDate)">上报</el-button>
                </div>

            </div>
        </div>

        <el-row type="flex" class="layout-footer" justify="space-between">
            <el-col :span="12">
                影厅总数：<span class="layout-footer-text">{{totalHallNum}}</span>
                座位总数：<span class="layout-footer-text">{{totalSeatNum}}</span>
            </el-col>
            <el-col :span="12">
                <div style="float: right">
                    <div class="layout-footer-status">
                        上报成功 <div class="iconfont icon-report-success"></div>
                    </div>
                    <div class="layout-footer-status">
                        上报失败 <div class="iconfont icon-report-failed"></div>
                    </div>
                    <div class="layout-footer-status">
                        正在上报 <div class="iconfont icon-reporting"></div>
                    </div>
                </div>


            </el-col>
        </el-row>
    </div>

</template>

<script>

    import CinemaSelect from 'src/components/cinemaSelect/CinemaSelect'

    export default {
        name: "Control",
        components: {
            CinemaSelect
        },

        data() {
            return {
                cinemaOptions: [],
                totalHallNum: '',
                totalSeatNum: '',
                formData: {
                    cinemaUid: '',
                    date: new Date()
                },
                headerData: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                bodyData: [],
            }
        },
        methods: {
            mGetDate(year, month) {
                let d = new Date(year, month, 0)
                return d.getDate()
            },

            changeDate(isNext) {
                let dayCount = 0
                if(isNext) {
                    dayCount = this.mGetDate(this.formData.date.getFullYear(), this.formData.date.getMonth() + 1)
                }else {
                    dayCount = this.mGetDate(this.formData.date.getFullYear(), this.formData.date.getMonth() ? this.formData.date.getMonth() : 12)
                }
                this.formData.date = new Date(Date.parse(this.formData.date) + (isNext ? dayCount*60*60*24*1000 : -dayCount*60*60*24*1000))
                this.getSchreportCalendar()

            },
            report(date) {
                console.log(date)
                if(date) {
                    this.schreportReport([date])
                }else {
                    let dateList = []
                    this.bodyData.forEach( item => {
                        if(item.reportStatus == '0' || item.reportStatus == '2') {
                            dateList.push(item.reportDate)
                        }
                    })
                    console.log(dateList)
                    this.schreportReport(dateList)
                }

            },

            schreportReport(dateList) {

                this.$api.schreportReport({dateList, cinemaUid: this.formData.cinemaUid}).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.success('上报成功！');

                    }else {
                        this.error(res.msg);
                    }

                }).catch( err => {
                    console.log(err)
                })

            },

            getCinemaHallSeat() {
                this.$api.getCinemaHallSeat({cinemaUid: this.formData.cinemaUid}).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.totalHallNum = res.data.totalHallNum
                        this.totalSeatNum = res.data.totalSeatNum

                    }else {
                        this.error(res.msg);
                    }

                }).catch( err => {
                    console.log(err)
                })
            },

            cinemaChange() {
                // this.getSchreportCalendar()

            },

            dateChange() {
                this.getSchreportCalendar()

            },

            getSchreportCalendar() {
                let data = {
                    cinemaUid: this.formData.cinemaUid,
                    year: this.formData.date.getFullYear(),
                    month: this.formData.date.getMonth() + 1
                }
                console.log(data)

                this.$api.getSchreportCalendar(data).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        if(res.data.length === 0) {
                            let month = this.formData.date.getMonth() + 1
                            let startDate = new Date(Date.parse(`${this.formData.date.getFullYear()}-${this.formData.date.getMonth() + 1}-01`))

                            let beforeDate = new Array(startDate.getDay()).fill({})
                            let dayCount = 0

                            switch (month) {
                                case 1:
                                case 3:
                                case 5:
                                case 7:
                                case 8:
                                case 10:
                                case 12:
                                    dayCount = 31
                                    break
                                case 4:
                                case 6:
                                case 9:
                                case 11:
                                    dayCount = 30
                                    break
                                case 2:
                                    dayCount = this.formData.date.getFullYear() % 4 === 0 ? 29 : 28
                                    break
                            }
                            let date = new Array(dayCount).fill({}).map( (item, index) => {
                                return {
                                    reportDate: `${this.formData.date.getFullYear()}-${this.formData.date.getMonth() + 1}-${index + 1}`,
                                }
                            })
                            let afterCount = 6 - new Date(Date.parse(date[date.length - 1].reportDate)).getDay()

                            let data = beforeDate.concat(date, new Array(afterCount).fill({}))
                            this.bodyData = data

                        }else {
                            let beforeCount = new Date(Date.parse(res.data[0].reportDate)).getDay(),
                                afterCount = 6 - new Date(Date.parse(res.data[res.data.length - 1].reportDate)).getDay()
                            console.log(beforeCount, afterCount)
                            let data = new Array(beforeCount).fill({}).concat(res.data, new Array(afterCount).fill({}))

                            this.bodyData = data
                            console.log(this.bodyData)
                        }


                    }else {
                        this.error(res.msg);
                    }

                }).catch( err => {
                    console.log(err)
                })
            }

        },
        mounted() {
            this.$api.getUserInfo().then( res => {
                console.log(res)
                if(res.code === 200) {
                    this.cinemaOptions = [res.data]
                    this.formData.cinemaUid = res.data.cinemaUid

                    this.getSchreportCalendar()
                    this.getCinemaHallSeat()

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
    .control {

        .icon-report-success {
            position: absolute;
            right: 0;
            top: 0;
            color: #05E043;
            font-size: 16px;
        }

        .icon-report-failed {
            position: absolute;
            right: 0;
            top: 0;
            color: #FC4040;
            font-size: 16px;
        }

        .icon-reporting {
            position: absolute;
            right: 0;
            top: 0;
            color: #3B74FF;
            font-size: 16px;
        }

        .bg-holiday {
            background: #F8F8F8;
        }

        .bg-today {
            background: #F2F4FD;
        }

        .table-header {
            border-bottom: 1px solid #BCBCBC;
            .table-header-content {
                text-align: center;
                height: 32px;
                line-height: 32px;
                float: left;
                width: 14.28%;
            }

        }
        .table-body {
            border-left: 1px solid #F5F5F5;
            .iconfont {
                right: 46%;
                top: 10px
            }
            .table-body-content {
                position: relative;
                padding: 10px 24px;
                box-sizing: border-box;
                float: left;
                height: 113px;
                width: 14.28%;
                border-right: 1px solid #F5F5F5;
                border-bottom: 1px solid #F5F5F5;

                .table-content-title {
                    font-size: 18px;
                    color: #333;

                }
                .table-content-btn {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }

                span {
                    font-size: 12px;
                }

            }
        }
        .layout-footer {
            background: #F5F5F5;
            padding: 10px 12px;
            .layout-footer-text {
                margin-right: 50px;
                color: #3B74FF;
            }
            .layout-footer-status {
                display: inline-block;
                position: relative;
                width: 80px;
                margin-left: 20px;
            }
        }
    }


</style>