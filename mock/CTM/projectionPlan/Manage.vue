<template>
    <div class="manage">

        <el-dialog title="复制放映计划" :visible.sync="copyPlanFormVisible">
            <el-form ref="copyPlanForm" :model="copyPlanForm" size="small">
                <el-form-item label="复制放映日期：" :label-width="formLabelWidth" prop="copyPlanDate">
                    <span>{{ copyPlanForm.copyPlanDate }}</span>
                </el-form-item>
                <el-form-item label="目标放映日期：" :label-width="formLabelWidth" prop="targetPlanDate">
                    <el-date-picker
                        v-model="targetPlanDate"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        :clearable="false"
                        :editable="false"
                        unlink-panels
                        range-separator="~"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="影厅：" :label-width="formLabelWidth" prop="hallList">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全部影厅</el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="copyPlanForm.hallList" @change="handlecheckedHallsChange">
                        <el-checkbox v-for="(item, index) in allHalls" :label="item.uid" :key="index">{{item.name}}</el-checkbox>
                    </el-checkbox-group>

                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="copyPlanFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="copySchPlan">确 定</el-button>
            </div>
        </el-dialog>

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

        </el-form>
        <div class="table-header clearfix">
            <div class="table-header-content" v-for="item in headerData" :key="item">{{ item }}</div>
        </div>
        <div class="table-body clearfix">
            <div :class="['table-body-content', {'bg-holiday': item.week == '星期六' || item.week == '星期日'}, {'bg-today': item.today}]" v-for="(item, index) in bodyData" :key="index">
                <div v-if="item.timeCount" :class="[{'green-triangle': item.approveStatusName == '已审核'}, {'red-triangle': item.approveStatusName == '已驳回'}, {'gray-triangle': item.approveStatusName == '未审核'}]"></div>
                <span class="table-content-title">{{ item.makeDate ? item.makeDate.split('-')[2] : '' }}</span>
                <div v-if="item.timeCount">
                    <p>总场次：{{item.timeCount}}</p>
                    <p>状态：{{item.approveStatusName}}</p>
                    <p v-if="item.editorLock">用户"{{ item.editorName }}"正在编辑</p>
                </div>

                <div class="table-content-btns" v-if="item.timeCount">
                    <el-button size="mini" type="primary" @click="scanPlan(item.makeDate)">查看</el-button>
                    <el-button size="mini" type="primary" @click="editPlan(item.makeDate)">编辑</el-button>
                    <el-button size="mini" type="primary" @click="copyPlan(item.makeDate)">复制</el-button>
                </div>
                <div class="table-content-btn" v-if="item.makeDate && !item.timeCount">
                    <el-button size="mini" type="primary" @click="addPlan(item.makeDate)">新建排期</el-button>
                </div>
            </div>
        </div>

        <el-row type="flex" class="layout-footer" justify="space-between">
            <el-col :span="12">
                影厅总数：<span class="layout-footer-text">{{8}}</span>
                座位总数：<span class="layout-footer-text">{{1666}}</span>
            </el-col>
            <el-col :span="12">
                <div style="float: right">
                    <div class="layout-footer-status">
                        已审核 <div class="green-triangle"></div>
                    </div>
                    <div class="layout-footer-status">
                        已驳回 <div class="red-triangle"></div>
                    </div>
                    <div class="layout-footer-status">
                        未审核 <div class="gray-triangle"></div>
                    </div>
                </div>

            </el-col>
        </el-row>
    </div>

</template>

<script>
    export default {
        name: "Manage",
        data() {
            return {
                checkAll: true,
                allCheckedHalls: [],
                allHalls: [],
                isIndeterminate: false,
                formLabelWidth: '120px',
                copyPlanFormVisible: false,
                targetPlanDate: '',
                copyPlanForm: {
                    copyPlanDate: '',
                    targetPlanDateStart: '',
                    targetPlanDateEnd: '',
                    hallList: [],
                    cinemaUid: ''
                },
                cinemaOptions: [],
                formData: {
                    cinemaUid: '',
                    date: new Date()
                },
                headerData: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                bodyData: [],
            }
        },
        methods: {

            scanPlan(date) {
                this.$router.push({ path: '/CTM/moviePlan/layout', query: { date }})
            },

            editPlan(date) {
                this.$router.push({ path: '/CTM/moviePlan/layout', query: { date }})
            },

            addPlan(date) {
                this.$router.push({ path: '/CTM/moviePlan/layout', query: { date }})
            },

            changeDate(isNext) {
                console.log(this.formData.date)
                this.formData.date = new Date(Date.parse(this.formData.date) + (isNext ? 30*60*60*24*1000 : -30*60*60*24*1000))
                this.getListCalendarPlan()

            },

            copySchPlan() {
                this.copyPlanForm.targetPlanDateStart = this.targetPlanDate[0]
                this.copyPlanForm.targetPlanDateEnd = this.targetPlanDate[1]

                this.$api.copySchPlan(this.copyPlanForm).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.$message.success(res.msg);
                        this.copyPlanFormVisible = false
                    }else {
                        this.$message.error(res.msg);
                    }

                })
            },

            handleCheckAllChange(val) {
                this.copyPlanForm.hallList = val ? this.allCheckedHalls : [];
                this.isIndeterminate = false;
            },
            handlecheckedHallsChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.allHalls.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.allHalls.length;
            },

            getDate(timestamp) {
                let date = new Date(timestamp)
                let Y = date.getFullYear()
                let M = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
                let D = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
                return Y + '-' + M + '-' + D
            },

            copyPlan(makeDate) {
                console.log(makeDate)
                this.copyPlanFormVisible = true
                this.copyPlanForm.copyPlanDate = makeDate
                let currentDate = this.getDate(Date.parse(new Date()) + 60*60*24*1000)
                this.targetPlanDate = [currentDate, currentDate]
                this.$api.findAllHall({cinemaUid: this.formData.cinemaUid}).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.allHalls = res.data
                        let data = res.data.map( item => {
                            return item.uid
                        })
                        this.allCheckedHalls = JSON.parse(JSON.stringify(data))
                        this.copyPlanForm.hallList = data
                    }else {
                        this.$message.error(res.msg);
                    }

                })

            },

            cinemaChange() {
                // this.getListCalendarPlan()

            },

            dateChange() {
                this.getListCalendarPlan()

            },

            getListCalendarPlan() {
                let data = {
                    cinemaUid: this.formData.cinemaUid,
                    year: this.formData.date.getFullYear(),
                    month: this.formData.date.getMonth() + 1
                }
                console.log(data)

                this.$api.listCalendarPlan(data).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        let beforeCount = 0,
                            afterCount = 0
                        switch (res.data.datelist[0].week) {
                            case '星期日':
                                beforeCount = 0
                                break
                            case '星期一':
                                beforeCount = 1
                                break
                            case '星期二':
                                beforeCount = 2
                                break
                            case '星期三':
                                beforeCount = 3
                                break
                            case '星期四':
                                beforeCount = 4
                                break
                            case '星期五':
                                beforeCount = 5
                                break
                            case '星期六':
                                beforeCount = 6
                                break
                            default:

                        }
                        switch (res.data.datelist[res.data.datelist.length - 1].week) {
                            case '星期日':
                                afterCount = 6
                                break
                            case '星期一':
                                afterCount = 5
                                break
                            case '星期二':
                                afterCount = 4
                                break
                            case '星期三':
                                afterCount = 3
                                break
                            case '星期四':
                                afterCount = 2
                                break
                            case '星期五':
                                afterCount = 1
                                break
                            case '星期六':
                                afterCount = 0
                                break
                            default:

                        }
                        let data = new Array(beforeCount).fill({}).concat(res.data.datelist, new Array(afterCount).fill({}))

                        this.bodyData = data
                        console.log(this.bodyData)

                    }else {
                        this.$message.error(res.msg);
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
                    this.copyPlanForm.cinemaUid = res.data.cinemaUid

                    this.getListCalendarPlan()

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
    .manage {
        .el-checkbox-group {
            .el-checkbox + .el-checkbox {
                margin-left: 0;
            }
            .el-checkbox {
                margin-right: 30px;
            }
        }

        .green-triangle {
            position: absolute;
            right: 0;
            top: 0;
            border-right: 10px solid rgb(5,224,67);
            border-top: 10px solid rgb(5,224,67);
            border-left: 10px solid transparent;
            border-bottom: 10px solid transparent;
        }

        .red-triangle {
            position: absolute;
            right: 0;
            top: 0;
            border-right: 10px solid rgb(252,64,64);
            border-top: 10px solid rgb(252,64,64);
            border-left: 10px solid transparent;
            border-bottom: 10px solid transparent;
        }

        .gray-triangle {
            position: absolute;
            right: 0;
            top: 0;
            border-right: 10px solid rgb(136,136,136);
            border-top: 10px solid rgb(136,136,136);
            border-left: 10px solid transparent;
            border-bottom: 10px solid transparent;
        }

        .bg-holiday {
            background: #F8F8F8;
        }

        .bg-today {
            background: #F2F4FD;
        }

        .table-header {
            border-bottom: 1px solid #F5F5F5;
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
                .table-content-btns {
                    display: none;
                }
                .table-content-btn {
                    display: none;
                    // position: absolute;
                    // left: 50%;
                    // top: 50%;
                    // transform: translate(-50%, -50%);
                }
                p {
                    font-size: 12px;
                    line-height: 20px;
                    text-decoration: underline;

                }
                span {
                    font-size: 12px;
                }

            }
            .table-body-content:hover {
                .table-content-btn {
                    display: block;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }
                .table-content-btns {
                    position: absolute;
                    right: -18px;
                    top: -4px;
                    width: 100px;
                    height: 120px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    align-items: center;
                    border: 1px solid #F5F5F5;
                    border-radius: 5px;
                    box-shadow: 0px 0px 2px 2px #F5F5F5;
                    background: #FFF;
                    z-index: 1;
                    .el-button {
                        padding: 4px 18px;
                    }
                    .el-button + .el-button {
                        margin-left: 0;
                    }
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
                width: 70px;
                margin-left: 20px;
            }
        }
    }


</style>