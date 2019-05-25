<template>
    <div :class="isFullScreen ? 'movie-plan full' : 'movie-plan'">
        <div class="movie-plan-tool">
            <div class="plan-tool-l">
                <el-select
                    v-model="hall.value"
                    placeholder="请选择">
                    <el-option
                        v-for="item in hall.data"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>

                <span class="plan-tool-l-break"></span>
                <div class="date-picker-con">
                    <span
                        class="date-picker-prev iconfont icon-neiye-qiehuanzuojiantou"
                        @click="changeDay(0)"
                    ></span>
                    <span class="date-picker-week">{{currentWeekDay}}</span>
                    <el-date-picker
                        v-model="dateValue"
                        type="date"
                        align="center"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="timestamp"
                        :editable="false"
                        :clearable="false"
                        :picker-options="pickerOptions"
                        @change="dateChange"
                    >
                    </el-date-picker>
                    <span
                        class="date-picker-next iconfont icon-neiye-qiehuanyoujiantou"
                        @click="changeDay(1)"
                    ></span>
                </div>
                <span class="plan-tool-l-break"></span>
                <div class="price-plan">
                    <span class="price-plan-label">
                        价格方案：
                    </span>
                    <el-select
                    v-model="pircePlanValue"
                    @change="changePricePlan"
                    placeholder="请选择">
                        <el-option
                            v-for="item in pricePlan"
                            :key="item.uid"
                            :label="item.name + '-' + item.price + '元'"
                            :value="item.uid"
                        >
                        </el-option>
                    </el-select>
                </div>
            </div>

            <div class="plan-tool-r">
                <div class="plan-menu-area">
                    <div class="meun-area-l">
                        <ul class="plan-menu-group">
                            <li class="plan-single-menu" @click="planTicketOffice">
                                <i class="iconfont icon-neiye-changcipiaofang plan-tool-icon"></i>
                                <p class="plan-menu-name">场次票房</p>
                            </li>
                            <li class="plan-single-menu">
                                <i class="iconfont icon-neiye-paipiancankao plan-tool-icon"></i>
                                <p class="plan-menu-name">排片参考</p>
                            </li>
                            <li class="plan-single-menu">
                                <i class="iconfont icon-neiye-kongchang plan-tool-icon"></i>
                                <p class="plan-menu-name">空场</p>
                            </li>
                        </ul>
                    </div>
                    <div class="meun-area-r">
                        <ul class="plan-menu-group">
                            <li class="plan-single-menu" @click="closeCheckedPlan">
                                <i class="iconfont icon-neiye-shanchu plan-tool-icon"></i>
                                <p class="plan-menu-name">删除</p>
                            </li>
                            <!-- <li class="plan-single-menu">
                                <i class="iconfont icon-neiye-piliangbianji plan-tool-icon"></i>
                                <p class="plan-menu-name">批量编辑</p>
                            </li> -->
                            <el-dropdown  @command="exportMoviePlan">
                                <li class="plan-single-menu" >
                                    <i class="iconfont icon-neiye-daochu plan-tool-icon"></i>
                                    <p class="plan-menu-name">导出</p>
                                </li>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="1">导出方案1</el-dropdown-item>
                                    <el-dropdown-item command="2">导出方案2</el-dropdown-item>
                                    <el-dropdown-item command="3">导出方案3</el-dropdown-item>
                                </el-dropdown-menu>
                                
                            </el-dropdown>
                            <!-- <li class="plan-single-menu">
                                <i class="iconfont icon-neiye-dayin plan-tool-icon"></i>
                                <p class="plan-menu-name">打印</p>
                            </li> -->
                            <li class="plan-single-menu" @click="saveCheckedPlan">
                                <i class="iconfont icon-neiye-baocun plan-tool-icon"></i>
                                <p class="plan-menu-name">保存</p>
                            </li>
                            <li class="plan-single-menu" @click="subApproves">
                                <i class="iconfont icon-neiye-tijiaoshenhe plan-tool-icon"></i>
                                <p class="plan-menu-name">提交审批</p>
                            </li>
                            <li
                                class="plan-single-menu"
                                @click="changeFullScreen"
                            >
                                <i class="iconfont icon-neiye-quanping plan-tool-icon"></i>
                                <p class="plan-menu-name">{{isFullScreen ? '退出全屏' : '全屏'}}</p>
                            </li>
                        </ul>
                    </div>
                </div>

                <el-popover
                    placement="bottom"
                    width="540"
                    trigger="hover">
                    <ul class="plan-menu-group">
                        <li class="plan-single-menu" @click="dialogFormVisible = true">
                            <i class="iconfont icon-neiye-piankushezhi plan-tool-icon"></i>
                            <p class="plan-menu-name">片库设置</p>
                        </li>
                        <li class="plan-single-menu" @click="salePause">
                            <i class="iconfont icon-neiye-zantingxiaoshou plan-tool-icon"></i>
                            <p class="plan-menu-name">暂停销售</p>
                        </li>
                        <li class="plan-single-menu" @click="recoverSale">
                            <i class="iconfont icon-neiye-huifuxiaoshou plan-tool-icon"></i>
                            <p class="plan-menu-name">恢复销售</p>
                        </li>
                        <li class="plan-single-menu">
                            <i class="iconfont icon-neiye-zhijieshenhe plan-tool-icon"></i>
                            <p class="plan-menu-name">直接审核</p>
                        </li>
                        <li class="plan-single-menu">
                            <i class="iconfont icon-neiye-daoru plan-tool-icon"></i>
                            <p class="plan-menu-name">导入</p>
                        </li>
                        <li class="plan-single-menu">
                            <i class="iconfont icon-neiye-guanlipaiqi plan-tool-icon"></i>
                            <p class="plan-menu-name">管理排期</p>
                        </li>
                        <li class="plan-single-menu">
                            <i class="iconfont icon-neiye-qingchuzhongpai plan-tool-icon"></i>
                            <p class="plan-menu-name">清除重排</p>
                        </li>
                    </ul>
                    <div
                        slot="reference"
                        class="plan-more-menu"
                    >更多</div>
                </el-popover>
                <span class="plan-tool-l-break"></span>
            </div>
        </div>
        <el-dialog title="片库设置" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="活动名称" :label-width="'120px'">
                <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动区域" :label-width="'120px'">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <movie-plan ref="moviePlan" :price-plan="curPricePlan" :base-param="baseParam"></movie-plan>
    </div>
</template>

<script>
import { getPricePlan, subApproves, getUserInfo, exportMoviePlan } from '../../../http/interface'
import moviePlan from "./moviePlan"
import { Message } from "element-ui"
export default {
    data() {
        return {
            dateValue: "",
            uidCinema: '',
            cinemaName: '',
            currentWeekDay: "",
            pricePlan: [],
            curPricePlan: {},
            hall: {
                data: [],
                value: ""
            },
            pickerOptions: {
                shortcuts: [
                    {
                        text: "今天",
                        onClick(picker) {
                            picker.$emit("pick", new Date())
                        }
                    }
                ]
            },
            baseParam: {
            },
            pircePlanValue: '',
            isFullScreen: false,
            dialogFormVisible: false,
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            }
        }
    },
    created() {
        this.getUserInfo()
        window.document.oncontextmenu = function() {
            return false
        }
        this.getPricePlan()
    },
    mounted() {
        this.dateInit()
    },
    methods: {
        getUserInfo() {
            getUserInfo({}).then(res => {
                if (res.code == 200 && res.data) {
                    this.uidCinema = res.data.cinemaUid
                    this.cinemaName = res.data.cinemaName
                    this.hall.value = res.data.cinemaUid
                    this.hall.data = [{
                        id: res.data.cinemaUid,
                        name: res.data.cinemaName
                    }]
                    this.baseParam = {
                        planDate: this.formatDateTime(this.dateValue),
                        uidCinema: this.uidCinema
                    }
                }
            })
        },
        getPricePlan() {
            getPricePlan({}).then(res => {
                if(res.data && res.code == 200) {
                    res.data.list.forEach(item => {
                        if (!item.price) item.price = 0
                        if (!item.rate) item.rate = 0
                    })
                    this.pricePlan = res.data.list
                    this.pircePlanValue = res.data.list[0].uid
                    this.curPricePlan = res.data.list[0]
                }
            })
        },
        dateInit() {
            let curTime = this.$route.query.date ? new Date(this.$route.query.date) : new Date()
            this.dateValue = Date.parse(curTime)
            this.currentWeekDay = "星期" + "日一二三四五六".charAt(curTime.getDay())
        },
        dateChange(e) {
            this.dateValue = e
            let checkTime = new Date(e)
            this.currentWeekDay = "星期" + "日一二三四五六".charAt(checkTime.getDay())
            this.baseParam = {
                planDate: this.formatDateTime(this.dateValue),
                uidCinema: this.uidCinema
            }
        },
        // 左右键切换日期
        changeDay(flag) {
            if (flag) {
                this.dateValue += 24 * 60 * 60 * 1000
                this.baseParam = {
                    planDate: this.formatDateTime(this.dateValue),
                    uidCinema: this.uidCinema
                }
                let checkTime = new Date(this.dateValue)
                this.currentWeekDay =
                    "星期" + "日一二三四五六".charAt(checkTime.getDay())
                return
            }
            this.dateValue -= 24 * 60 * 60 * 1000
            this.baseParam = {
                planDate: this.formatDateTime(this.dateValue),
                uidCinema: this.uidCinema
            }
            let checkTime = new Date(this.dateValue)
            this.currentWeekDay =
                "星期" + "日一二三四五六".charAt(checkTime.getDay())
            return
        },
        changePricePlan(val) {
            this.curPricePlan = this.pricePlan.find(item => item.uid == val)
        },
        // 全屏/非全屏模式
        changeFullScreen() {
            this.isFullScreen = !this.isFullScreen
            if (this.isFullScreen) {
                this.$message({
                    message: "点击退出全屏按钮退出全屏",
                    type: "success",
                    center: true,
                    duration: 800
                })
            }
        },
        // 片库设置
        movieDBSet() {

        },
        // 展示 or 关闭 票房提示
        planTicketOffice() {
            if (this.$refs.moviePlan.$refs.filmBan.showBan) {
                this.$refs.moviePlan.$refs.filmBan.showBan = false
                this.$refs.moviePlan.closeFilmBan()
            } else {
                this.$refs.moviePlan.showFlimBan()
            }
        },
        // 提交审批
        subApproves() {
            subApproves([{planDate: this.formatDateTime(this.dateValue), uidCinema: this.uidCinema}]).then(res => {
                if (res.code == 200 && res.data) {
                    this.success('提交审核成功')
                    this.$refs.moviePlan.initMoivePlan()
                }
            })
        },
        // 删除 选中排片计划
        closeCheckedPlan() {
            this.$refs.moviePlan.deleteSelect()
        },
        // 保存选中排片计划
        saveCheckedPlan() {
            this.$refs.moviePlan.savePlan()
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
        exportMoviePlan(command) {
            exportMoviePlan({planDate: this.formatDateTime(this.dateValue), type: command, uidCinema: this.uidCinema}).then(res => {
                if (res.code == 200 && res.data) {
                    
                    console.log(res)
                    const exportExlUrl = `data:application/vnd.ms-excel;base64,${res.data.wbBase64String}`
                    console.log(exportExlUrl)
                    const fileName = `${this.cinemaName}${this.formatDateTime(this.dateValue)}导出方案${command}.xls`
                    if ('download' in document.createElement('a')) { // 非IE下载
                        const elink = document.createElement('a')
                        elink.download = fileName
                        elink.style.display = 'none'
                        elink.href = exportExlUrl
                        document.body.appendChild(elink)
                        elink.click()
                        URL.revokeObjectURL(elink.href) // 释放URL 对象
                    document.body.removeChild(elink)
                    } else { // IE10+下载
                        console.log('ie')
                        var elemIF = document.createElement("iframe");  
                        elemIF.src = exportExlUrl;  
                        elemIF.style.display = "none";  
                        document.body.appendChild(elemIF); 
                    //     // navigator.msSaveBlob(blob, fileName)
                    }

                    // TODO 兼容IE10+浏览器下载

                }
            })
        },
        salePause() {
            console.log(this.$refs)
            this.$refs.moviePlan.$refs.filmPlan.planStop()
        },
        recoverSale() {
            this.$refs.moviePlan.$refs.filmPlan.planOpen()
        }
    },
    destroyed() {
        window.document.oncontextmenu = null
    },
    components: {
        moviePlan
    },
    computed: {
    }
}
</script> 

<style lang="scss">
.movie-plan {
    transition: all 0.2s;
    background-color: #fff;
    &.full {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 999;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
    .movie-plan-tool {
        height: 56px;
        background-color: #f2f4fd;
        margin-bottom: 12px;
        .plan-tool-l {
            float: left;
            height: 56px;
            box-sizing: border-box;
            padding: 12px 0 0 8px;
            background-color: #edf1fd;
            border-right: 1px solid #fff;
            .plan-tool-l-break {
                float: left;
                width: 1px;
                height: 48px;
                background-color: rgb(199, 215, 254);
                position: relative;
                top: -8px;
                margin: 0 3px 0 10px;
            }
            .el-select {
                float: left;
            }
            .el-select .el-input.is-focus .el-input__inner {
                border-color: #3b74ff;
            }
            .el-select .el-input--suffix {
                float: left;
                width: 152px;
                height: 32px;
                .el-input__inner {
                    height: 32px;
                    font-size: 12px;
                    color: #333;
                    padding-left: 8px;
                    border-color: transparent;
                }

                .el-input__icon {
                    line-height: 32px;
                    font-size: 12px;
                }
            }
            .price-plan {
                width: 200px;
                padding-left: 10px;
                float: left;
                height: 100%;
                box-sizing: border-box;
                .price-plan-label {
                    display: inline-block;
                    height: 32px;
                    line-height: 32px;
                    float: left;
                    width: 60px;
                    font-size: 12px;
                    color: #333;
                    margin-right: 2px;
                }
                .el-select .el-input--suffix {
                    width: 112px;
                }
            }
            .date-picker-con {
                font-size: 0;
                float: left;
                width: 189px;
                height: 32px;
                padding-left: 24px;
                box-sizing: border-box;
                border-radius: 4px;
                position: relative;
                cursor: pointer;
                .el-date-editor.el-input {
                    width: 140px;
                }
                .date-picker-prev,
                .date-picker-next,
                .date-picker-week {
                    position: absolute;
                    width: 23px;
                    height: 100%;
                    top: 0;
                    z-index: 9;
                    text-align: center;
                    line-height: 32px;
                }
                .date-picker-week {
                    font-size: 12px;
                    line-height: 32px;
                    color: #666;
                    width: 45px;
                    text-align: left;
                    left: 32px;
                    pointer-events: none;
                }
                .date-picker-prev {
                    left: 0;
                }
                .date-picker-next {
                    right: 0;
                }
                .el-input__prefix {
                    display: none;
                }
                .el-input__inner {
                    width: 140px;
                    height: 32px;
                    color: #333;
                    font-size: 12px;
                    border-color: transparent;
                    padding-left: 58px;
                    padding-right: 0;
                    cursor: pointer;
                }
                .el-input__inner:focus {
                    border-color: #3b74ff;
                }
            }
        }
        .plan-tool-r {
            width: calc(100% - 578px);
            float: left;
            .plan-menu-area {
                float: left;
                height: 56px;
                width: calc(100% - 60px);
                overflow: hidden;
            }
            .plan-menu-area .meun-area-l {
                float: left;
                height: 100%;
            }
            .plan-menu-area .meun-area-r {
                float: right;
                height: 100%;
            }
            .plan-menu-group {
                display: inline-block;
                height: 56px;
                .plan-single-menu {
                    text-align: center;
                    height: 100%;
                    box-sizing: border-box;
                    // float: left;
                    display: inline-block;
                    padding-top: 8px;
                    cursor: pointer;
                    .plan-menu-name {
                        padding: 4px 10px;
                        font-size: 12px;
                        color: #666;
                        letter-spacing: 1px;
                        line-height: 16px;
                    }
                    .plan-tool-icon {
                        font-size: 14px;
                        color: #3b74ff;
                    }
                    // &:hover {
                    //     background-color: #3b74ff;
                    //     .plan-menu-name,
                    //     .plan-tool-icon {
                    //         color: #fff;
                    //     }
                    // }
                }
            }
            .plan-more-menu {
                width: 48px;
                float: right;
                height: 100%;
                line-height: 56px;
                text-align: center;
                letter-spacing: 1px;
                color: #666;
                font-size: 12px;
                cursor: pointer;
            }
            .plan-tool-l-break {
                float: right;
                width: 1px;
                height: 48px;
                background-color: rgb(199, 215, 254);
                position: relative;
                top: 5px;
                margin: 0 5px 0 0;
            }
        }
    }
}
.el-popover {
    padding: 0;
	.plan-single-menu {
		width: 76px;
		text-align: center;
		height: 100%;
		box-sizing: border-box;
		float: left;
		padding-top: 8px;
		cursor: pointer;
		.plan-menu-name {
			padding: 4px 10px;
			font-size: 12px;
			color: #666;
			letter-spacing: 1px;
			line-height: 16px;
		}
		.plan-tool-icon {
			font-size: 14px;
			color: #3b74ff;
		}
		// &:hover {
		// 	background-color: #3b74ff;
		// 	.plan-menu-name,
		// 	.plan-tool-icon {
		// 		color: #fff;
		// 	}
		// }
	}
}
.el-select-dropdown__item {
    box-sizing: border-box;
    height: 32px;
    line-height: 32px;
    padding: 0 8px;
    background-color: #fff;
    font-weight: normal;
    span {
        font-size: 12px;
        color: #666;
    }
    &.selected {
        font-weight: normal;
        span {
            color: #3b74ff;
        }
    }
    &.hover {
        background-color: #f5f5f5;
    }
}
.el-date-picker,
.el-date-picker.has-sidebar {
    width: 224px;
    border: none;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    .el-picker-panel__body {
        margin-left: 0;
        border-bottom: 1px solid #ebeef5;
    }
    .el-picker-panel__sidebar {
        width: 100%;
        height: 32px;
        bottom: -32px;
        left: 0;
        right: 0;
        top: auto;
        border: none;
        padding: 0;
        box-shadow: 0px 6px 12px 0 rgba(0, 0, 0, 0.1);
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
        .el-picker-panel__shortcut {
            text-align: center;
            color: #3b74ff;
            padding: 0;
        }
    }
    .el-date-picker__header {
        padding: 0px 6px;
        margin: 0;
        border-bottom: solid 1px #ebeef5;
        .el-date-picker__header-label {
            color: #666;
            font-size: 12px;
        }
        .el-picker-panel__icon-btn {
            color: #666;
            font-weight: 700;
        }
    }
    .el-picker-panel__content {
        width: 100%;
        margin: 0;
        th {
            width: 32px;
            height: 32px;
            padding: 0;
            line-height: 32px;
            font-size: 12px;
            color: #bcbcbc;
            border-bottom: none;
        }
        .el-date-table td {
            padding: 0;
            height: 32px;
            div {
                padding: 0;
                height: 100%;
                span {
                    display: block;
                    width: 100%;
                    height: 100%;
                    line-height: 32px;
                    border-radius: 2px;
                    font-size: 12px;
                    color: #666;
                }
            }
        }
        .el-date-table td.today {
            span {
                color: #409eff;
            }
        }
        .el-date-table td.current {
            span {
                color: #fff;
            }
        }
        .el-date-table td:hover {
            background-color: #f2f4fd;
        }
        .el-date-table .prev-month span,
        .el-date-table .next-month span {
            color: #bcbcbc;
        }
        .el-date-table .prev-month:hover,
        .el-date-table .next-month:hover {
            background-color: #fff;
        }
    }
}
</style>