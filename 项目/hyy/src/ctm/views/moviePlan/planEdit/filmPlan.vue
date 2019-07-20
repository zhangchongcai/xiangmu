<template>
    <section class="movie-plan-window" @scroll="scroll" :style="{height: 'calc(100% - 30px)'}" ref="moviePlanWindow" @mousemove="changeTimeLine">
        <div class="content" id="planContent" :style="{width:contentSize.width+'px', height: contentSize.height +'px'}" @mousedown="addFilm" @mousemove="drawBlock" @mouseup="cleanDrawBlock" ref="content">
            <!-- 过去时间：灰色 -->
            <div class="pass-time" :style="{height: contentSize.height +'px', width: pass_time.width + 'px'}"></div>
            <!-- 排片内容 -->
            <ul>
                <li class="row_content" v-for="(item,index) in plan_rooms" :key="index" :style="{height: contentSize.roomItemHeight + 'px'}" :data-item="index">
                    <ul class="flex-base">
                            <el-tooltip placement="right" :disabled="isDropShow || selectMovieData.isSelect || selectMovieData.isShow" v-for="(filmItem,filmItem_index) in item" :key="filmItem_index" :manual="block.click" :enterable="!block.click" :open-delay="400" :hide-after="100">
                            <div slot="content" class="plan-tool-tips">
                                <div>{{filmItem.movieName}}（{{filmItem.disversion}}/{{filmItem.language}}）{{filmItem.timeLong}}分钟</div>
                                <div>{{filmItem.startTime.hours+':'+filmItem.startTime.minute + '-' + filmItem.endTime.hours + ':' + filmItem.endTime.minute}}</div>
                                <div v-if="filmItem.originFlag">
                                    <div class="plan-tip">审核状态：<span class="font-bold">{{filmItem.approve_text}}</span></div>
                                    <div class="plan-tip">放映计划状态：<span class="font-bold">{{filmItem.plan_text}}</span></div>
                                    <div class="plan-tip">销售状态：<span class="font-bold">{{filmItem.sale_text}}</span></div>
                                    <div class="plan-tip"><span class="mr30">人次：{{filmItem.personTime || 0}}人</span> <span class="mr30"> 票房：{{filmItem.tolatMoney || 0}}元</span> <span class="mr30">上座率：{{filmItem.occupancy || 0}}%</span></div>
                                    <div class="plan-tip"><span class="mr30">我的最低价格: {{filmItem.minPrice}}元</span><span class="mr30">竞对最低价格: {{filmItem.cheapestPrice || '--'}}元</span><span class="mr30" v-if="filmItem.cheapestPrice">差价: {{Number(filmItem.minPrice) - Number(filmItem.cheapestPrice)}}元</span></div>
                                </div>
                            </div>
                            <li class="filmItem" :style="{width: filmItem.timeLong + 'px', left: filmItem.positionX + 'px'}" :class="{isSelect: filmItem.isSelect, error: filmItem.saveError}" @mousedown="filmMouseDown(filmItem, index, filmItem_index, $event)" @mousemove="filmMouseMove" @mouseup="filmMouseUp" :data-row="index">
                                <div class="film-content flex-base" :style="filmContentStyle(filmItem)">
                                    <div class="text-hide">{{filmItem.movieName}}</div>
                                    <div v-if="!filmItem.joinFlag">({{filmItem.disversion + '/' + filmItem.language}})</div>
                                    <div>{{filmItem.startTime.hours+':'+filmItem.startTime.minute + '-' + filmItem.endTime.hours + ':' + filmItem.endTime.minute}}</div>
                                </div>
                                <!-- 影片状态 -->
                                <div class="triangle-absolute" v-if="filmItem.approveStatus" :class="{'success':filmItem.approveStatus == 'APPROVED' && filmItem.saleStatus == 'SALE','going':filmItem.approveStatus == 'WAIT_APPROVE','stop': filmItem.approveStatus == 'APPROVED' && filmItem.saleStatus == 'STOP', 'warn': filmItem.approveStatus == 'REJECT'}"></div>
                            </li>
                        </el-tooltip>
                    </ul>
                </li>
            </ul>
            <!-- 单独添加影片：时间刻度线 -->
            <div class="time-line" v-if="selectMovieData.isShow" :style="{left: time_line.positionX + 'px',height:contentSize.height+'px'}">
                <div class="clock-info" :style="{top: clock.positionY + 'px'}">{{single_movie.startTime.hours+':'+single_movie.startTime.minute + '-' + single_movie.endTime.hours +':' + single_movie.endTime.minute}}</div>
                <ul class="select-movie-content">
                    <li class="movie-item" :style="{width: selectMovieData.selectMoive.timeLong +'px', top: single_movie.positionY + 'px'}">
                        <div class="movie-header" :style="{background: selectMovieData.selectMoive.color}"></div>
                        <div class="movie-content flex-base" :style="{background:colorRgba(selectMovieData.selectMoive.color,0.1)}">
                            <div class="text-hide">{{selectMovieData.selectMoive.movieName}}</div>
                            <div>({{selectMovieData.selectMoive.disversion + '/' + selectMovieData.selectMoive.language}})</div>
                            <div>{{single_movie.startTime.hours+':'+single_movie.startTime.minute +'-'+ single_movie.endTime.hours+':'+ single_movie.endTime.minute}}</div>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- 拖拽影片：创建模板副本 -->
            <div class="drop-film" :style="{width:contentSize.width+'px',height:contentSize.height+'px'}" v-if="isDropShow" @mouseup="dropFilmMouseUp" @mousemove="dropFilmMove">
                <ul>
                    <li class="drop-item" v-for="(drop_item,drop_item_index) in drop_data" :key="drop_item_index" :style="{top: drop_item.positionY + relative.positionY + 'px', left: drop_item.positionX + relative.positionX + 'px',width: drop_item.timeLong +'px'}">
                        <div class="drop-header" :style="{background: drop_item.color}"></div>
                        <div class="drop-content flex-base" :style="{background:colorRgba(drop_item.color,0.1)}">
                            <div class="text-hide">{{drop_item.movieName}}</div>
                            <div>({{drop_item.disversion + '/' + drop_item.language}})</div>
                            <div>{{time(dropScale(drop_item.positionX + relative.positionX,dragPrecision)).hours+':'+time(dropScale(drop_item.positionX + relative.positionX,dragPrecision)).minute +'-'+ time(dropScale(drop_item.positionX + relative.positionX,dragPrecision) + Number(drop_item.timeLong)).hours+':'+ time(dropScale(drop_item.positionX + relative.positionX,dragPrecision) + Number(drop_item.timeLong)).minute}}</div>
                        </div>
                    </li>
                </ul>
                <!-- 时间刻度线 -->
                <div class="time-line" v-if="drop_clock.isShow" :style="{left: drop_clock.positionX + 'px', height: contentSize.height + 'px'}">
                    <div class="clock-info" :style="{top: drop_clock.positionY + 'px'}">{{drop_clock.startTime.hours + ':' + drop_clock.startTime.minute + '-' + drop_clock.endTime.hours +':'+ drop_clock.endTime.minute}}</div>
                </div>
            </div>
            <!-- 矩形 -->
            <div class="draw-block" :style="{top:blockSetting.top.positionY+'px',left: blockSetting.top.positionX + 'px', width: blockSetting.size.width+ 'px',height: blockSetting.size.height + 'px'}"></div>
            <!-- 控制器 -->
            <div class="item-controls" v-if="control.config.isShow" :style="{left: control.config.positionX + 'px', top:control.config.positionY + 'px'}">
                <div class="top" v-if="control.config.type == 'bottom'"></div>
                <ul class="flex-base">
                    <div class="left" v-if="control.config.type == 'right'"></div>
                    <li v-for="(controlItem,controlItemIndex) in control.controlItem" :data-status="controlItem.status" :key="controlItemIndex" @click="controlEmit(controlItem.controlFn)">{{controlItem.text}}</li>
                    <div class="right" v-if="control.config.type == 'left'"></div>
                </ul>
                <div class="bottom" v-if="control.config.type == 'top'"></div>
            </div>
            
        </div>
        <!-- 设置时间失效提示框 -->
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>放映时间设置无效，请重新指定</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 设置无效影厅提示框 -->
        <el-dialog
            title="提示"
            :visible.sync="hallBanTip"
            width="30%">
            <span>当前影厅被禁用，请重新指定影厅</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="hallBanTip = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 设置无效影厅提示框 -->
        <el-dialog
            title="提示"
            :visible.sync="timeErrorTip"
            width="30%">
            <span>{{errorText}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="timeErrorTip = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 提交审批失败dialog -->
        <el-dialog
            title="错误提示"
            :visible.sync="approveErrorDialog"
            :show-close="false"
            width="30%">
            <span>以下放映计划存在最低票价或者基础票价数据为空，请配置!</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="approveErrorDialog = false">确定</el-button>
            </span>
        </el-dialog>
        <!-- 排片指导校验表格dialog -->
        <el-dialog
            title="总部排片指导"
            :visible.sync="planAdviceDialog"
            :show-close="false"
            width="60%">
            <span >提示, 以下影片排片率未达标, 请确认和调整</span>
            <el-table
                style="margin-top: 10px;"
                height="300"
                :row-class-name="tableRowClassName"
                :data="planAdviceRejectData">
                
                <el-table-column
                    label="影片名称"
                >
                 <template slot-scope="scope">
                    <div>
                        {{scope.row.movieName}}{{'(' + scope.row.disVersion + ')'}}
                    </div>   
                </template>
                </el-table-column>
                <el-table-column
                    prop="myNum"
                    label="场次数(场)"
                    width="80"
                >
                </el-table-column>
                <el-table-column
                    prop="myPer"
                    label="占比(%)"
                    width="80"
                >
                </el-table-column>
                <el-table-column
                    label="总部指标"
                >
                <template slot-scope="scope">
                    <div>
                        <span v-if="!scope.row.rangeNoCheck">占比{{scope.row.timeRatioLower}}-{{scope.row.timeRatioUpper}}%</span> <span v-if="!scope.row.rangeNoCheck && !scope.row.numNoCheck">,</span> <span v-if="!scope.row.numNoCheck">场次{{scope.row.timeNumLower}}-{{scope.row.timeNumUpper}}场</span>
                    <span v-if="scope.row.guideType == 1">强制</span> 
                    <span v-if="scope.row.guideType == 2">指导</span> 
                    </div>   
                </template>
                </el-table-column>

            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="planAdviceDialog = false">确定</el-button>
                <el-button v-if="!adviceTipType" type="primary" @click="continueApprove">继续提交审核</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="排片指导预警"
            :visible.sync="planAdviceWarn"
            :show-close="false"
            width="80%">
            <el-table
                height="300"
                :row-class-name="tableRowClassName"
                :data="planAdviceRejectData">
                
                <el-table-column
                    prop="index"
                    label="序号"
                    width="57">
                </el-table-column>
                <el-table-column
                    prop="movieName"
                    label="基础影片名"
                    width="174">
                </el-table-column>
                <el-table-column
                    prop="adviceType"
                    label="指导类型"
                    width="103">
                </el-table-column>
                <el-table-column label="指导场次/百分比">
                    <!-- prop="province" -->
                    <el-table-column
                    label="黄金场"
                    width="96">
                    </el-table-column>
                    <!-- prop="city" -->
                    <el-table-column
                    label="所有厅"
                    width="96">
                    </el-table-column>
                    
                </el-table-column>
                <el-table-column
                    prop="planCount"
                    label="场次上限"
                    width="103">
                </el-table-column>
                <el-table-column label="实际已排场次/百分比">
                    <!-- prop="province" -->
                    <el-table-column
                    label="黄金场"
                    width="96">
                    </el-table-column>
                    <!-- prop="city" -->
                    <el-table-column
                    label="所有厅"
                    width="96">
                    </el-table-column>
                    
                </el-table-column>
                <el-table-column
                    prop="myPlanCount"
                    label="已排场次"
                    width="103">
                </el-table-column>
                
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="planAdviceDialog = false">确定</el-button>
                <el-button v-if="!adviceTipType" type="primary" @click="continueApprove">继续提交审核</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
import {saveMoviePlan, deletePlan, subApproves, saleOpenStop, approvePassPlan, copySinglePlan, getDecision} from 'ctm/http/interface'
export default {
    props: {
        pricePlan: {
            type: Object,
            required: true
        },
        baseParam: {
            type: Object,
            required: true
        },
        scaleConfig: {
            type: Object,
            required: true
        },
        width: {
            type: Number,
            required: true
        },
        rooms: {
            type: Array,
            required: true
        },
        contentSize: {
            type: Object,
            required: true,
            default: {
                width: null,
                height: null,
                roomItemHeight: null
            }
        },
        selectMovieData: {
            type: Object,
            default: {
                isSelect: false,
                selectMoive: {},
                isShow: false
            }
        },
        plan_list: {
            type: Object
        },
        mode: {
            type: Number,
            default: 1
        },
        adviceData: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            scrollY: "",
            scrollX: "",
            // content距离边框距离
            margin_left: 0,
            movieItemHeight: 66,
            maxTime: 60 * 25,
            // 拖拽精度
            dragPrecision: 1,
            // 场次间隔
            timeInterval: 1,
            // 时间刻度线
            time_line: {
                positionX: null,
                positionY: null
            },
            single_movie: {
                startTime: {
                    hours: null,
                    minute: null
                },
                endTime: {
                    hours: null,
                    minute: null
                }
            },
            plan_rooms: [],
            // 过去时间
            clock_date: {
                positionX: 0
            },
            // 遮罩层宽度
            pass_time: {
                width: 0
            },
            // 已选可拖拽数据
            drop_data: [],
            // 拖拽备份数据 用于还原
            dropCopyData: [],
            // 上一次拖拽的数据
            lastDropDataCopy: [],
            // 是否显示拖拽模板
            isDropShow: false,
            isMouseDown: false,
            // 移动模板相对位移
            relative: {
                positionX: 0,
                positionY: 0
            },
            // 解决mousemove 秒触发
            mouseFlag: {
                x: '',
                y: ''
            },
            // 移动模板时钟位置
            drop_clock: {
                isShow: false,
                positionX: 0,
                positionY: 0,
                startTime: {
                    hours: '',
                    minute: ''
                },
                endTime: {
                    hours: '',
                    minute: ''
                }
            },
            // 矩形
            block: {
                click: false,
                mouseStart: {
                    positionX: 0,
                    positionY: 0
                }
            },
            blockSetting: {
                isShow: false,
                top: {
                    positionX: 0,
                    positionY: 0
                },
                size: {
                    width: 0,
                    height: 0
                }
            },
            // 控制器
            control: {
                r_l_height: 32,
                r_l_width: 259,
                t_b_width: 252,
                t_b_height: 39,
                config: {
                    isShow: false,
                    type: '',
                    positionX: 0,
                    positionY: 0
                },
                controlItem: []
            },
            // 缓存载入数据 用于校验用户是否需要保存操作
            origin_data: null,
            userNeedSave: false,
            // 当前选中的排片
            curPlan: {},
            // 放映时间设置失效dialog提示框标记
            dialogVisible: false,
            // 影厅禁用 提示
            hallBanTip: false,
            // 上下映日期不对提示
            timeErrorTip: false,
            errorText: '',
            // 提交审批失败dialog
            approveErrorDialog: false,
            // 提交审批失败数据
            approveErrorData: null,
            // 排片指导校验
            planAdviceDialog: false,
            adviceTipType: true,
            planAdviceRejectData: [],
            allowApprove: false,
            copyConfig: {
                id: '',
                copyFlag: false
            },
            // copy 截流阀
            isCopying: false,
            // 排片指导预警
            planAdviceWarn: false,
        }
    },
    mounted() {
        this.shadowInterval = setInterval(() => {
                this.passTimeShadow()
            }, 60000)
    },
    beforeDestroy() {
        clearInterval(this.shadowInterval)
        this.shadowInterval = null
    },
    destroyed() {
        window.onkeydown = null
    },
    watch: {
        plan_list(data, old_data) {
            let _data = JSON.parse(JSON.stringify(data.data));
            for (let i = 0; i < _data.length; i++) {
                let c_d = _data[i];
                for (let j = 0; j < c_d.length; j++) {
                    let s_time = c_d[j].startTime.split(':')
                    let e_time = c_d[j].endTime.split(':')
                    let startTime = {
                        'hours': s_time[0],
                        'minute': s_time[1]
                    };
                    let endTime = {
                        'hours': e_time[0],
                        'minute': e_time[1]
                    };

                    let positionX = this.position(s_time[0]) + Number(s_time[1]);

                    // 上座率
                    // let privateSaleSeatCount = Number(c_d[j].privateSaleSeatCount);
                    // let seatnum = Number(c_d[j].seatnum)
                    // let seatPrecent;
                    // if (privateSaleSeatCount != 0 && seatnum != 0) {
                    //     seatPrecent = (privateSaleSeatCount / seatnum) * 100
                    // } else {
                    //     seatPrecent = 0
                    // }

                    // 审核状态
                    let approveStatus = c_d[j].approveStatus
                    let approve_text
                    if (approveStatus == 'NOT_APPROVE') {
                        approve_text = '未审核'
                    } else if (approveStatus == 'WAIT_APPROVE') {
                        approve_text = '待审核'
                    } else if (approveStatus == 'APPROVED') {
                        approve_text = '已审核'
                    } else if (approveStatus == 'REJECT') {
                        approve_text = '已驳回'
                    }

                    // 销售状态
                    let saleStatus = c_d[j].saleStatus;
                    let sale_text
                    if (saleStatus == 'SALE') {
                        sale_text = '可售'
                    } else if (saleStatus == 'NOT_SALE') {
                        sale_text = '不可售'
                    } else if (saleStatus == 'STOP') {
                        sale_text = '暂停'
                    }

                    // 放映计划状态
                    let planStatus = c_d[j].planStatus
                    let plan_text
                    if (planStatus == 'NEW') {
                        plan_text = '新建'
                    } else if (planStatus == 'VALID') {
                        plan_text = '生效'
                    } else if (planStatus == 'LOCKED') {
                        plan_text = '锁定'
                    } else if (planStatus == 'DELETED') {
                        plan_text = '删除'
                    }

                    c_d[j].plan_text = plan_text
                    c_d[j].approve_text = approve_text
                    c_d[j].sale_text = sale_text
                    // c_d[j].seatPrecent = seatPrecent
                    c_d[j].startTime = startTime
                    c_d[j].endTime = endTime
                    c_d[j].positionX = positionX
                    let positionY = this.innerPoistionY(i)
                    c_d[j].positionY = positionY
                    // 用于校验数据是否改变
                    c_d[j].originFlag = {
                        positionX,
                        positionY
                    }
                    // 保存成功失败标记
                    c_d[j].saveError = false
                    // 相同出入场词提示标记
                    c_d[j].sameTimeTip = false
                }
                c_d.sort(this.sort('positionX', 'up'))
            }
            if (this.approveErrorData && this.approveErrorData.length) {
                this.approveErrorDialog = true
                _data.forEach(row => {
                    row.forEach(plan => {
                        this.approveErrorData.forEach(item => {
                            if (item == plan.planUid) {
                                plan.isSelect = true
                            }
                        })
                    })
                })
                this.approveErrorData = null
            }
                
            this.plan_rooms = _data
            // 初始化排片指导
            this.$emit('initPlanAdvice', _data.reduce((arr, item) => {
                return arr.concat(item)
            }, []))

             getDecision({
                cinemaUid: this.baseParam.uidCinema,
                planDate: this.baseParam.planDate
            }).then(res => {
                if (res.code != 200) return this.error(res.msg)
                if (res.code == 200) {
                    res.data.forEach(item => {
                        _data.forEach(row => {
                            row.some(plan => {
                                if (plan.planUid == item.planUid) {
                                    plan.personTime = item.personTime
                                    plan.occupancy = item.occupancy
                                    plan.tolatMoney = item.tolatMoney
                                    return true
                                }
                            })
                        })
                    })
                }
            })
            this.plan_rooms = _data

        },
        plan_rooms(data, old_data) {
            // 校验是否修改过数据 用于判断是否需要用户进行保存操作
            let originFlag = JSON.parse(JSON.stringify(this.origin_data))
            if (!originFlag) {
                this.origin_data = JSON.parse(JSON.stringify(data))
            }

            let old_flage = JSON.parse(JSON.stringify(this.origin_data))
            let new_flage = JSON.parse(JSON.stringify(data))

            // for (let i = 0; i < old_flage.length; i++) {
            //     for (let j = 0; j < old_flage[i].length; j++) {
            //         delete old_flage[i][j].isSelect
            //     }
            // }

            // for (let i = 0; i < new_flage.length; i++) {
            //     for (let j = 0; j < new_flage[i].length; j++) {
            //         delete new_flage[i][j].isSelect
            //     }
            // }
            if (JSON.stringify(new_flage) !== JSON.stringify(old_flage)) {
                this.userNeedSave = true
            } else {
                this.userNeedSave = false
            }

            // 实时修改 
            // let _data = JSON.parse(JSON.stringify(data));
            // let mindObj = {};
            // let allPlanMovieNum = 0;
            // for (let i = 0; i < _data.length; i++) {
            //     let c_d = _data[i]
            //     for (let j = 0; j < c_d.length; j++) {
            //         let cc_d = c_d[j]
            //         if (!mindObj[`${cc_d.movieCode}`]) {
            //             mindObj[`${cc_d.movieCode}`] = {
            //                 color: cc_d.color,
            //                 movieName: cc_d.movieName,
            //                 planNum: 1
            //             }
            //         } else {
            //             mindObj[`${cc_d.movieCode}`].planNum++
            //         }
            //         allPlanMovieNum++
            //     }
            // }
            // let mindArr = []
            // let mindFlagArr = Object.keys(mindObj);
            // for (let i = 0; i < mindFlagArr.length; i++) {
            //     let c_obj = mindObj[`${mindFlagArr[i]}`]
            //     c_obj.planPercent = ((c_obj.planNum / allPlanMovieNum) * 100).toFixed(2)
            //     mindArr.push(c_obj)
            // }

            
            this.$emit('changeMyData')
        },
        /* 拖拽精度 场次间隔 */
        scaleConfig(data, old_data) {
            this.dragPrecision = Number(data.dragPrecision)
            this.timeInterval = Number(data.timeInterval)
        },
        baseParam(data, old_data) {
            if (data.planDate != old_data.planDate) {
                this.passTimeShadow()
            }
        }
    },
    methods: {
        /* 滚动时触发影厅和刻度滚动 */
        scroll(e) {
            this.$emit("scroll", {
                scrollTop: e.target.scrollTop,
                scrollLeft: e.target.scrollLeft
            });
        },
        /* 修改时间线 */
        changeTimeLine(e) {
            e.stopPropagation()
            let selectMovieData = this.selectMovieData
            let isSelect = selectMovieData.isSelect
            let selectData = selectMovieData.selectMoive
            if (!isSelect) return
            if (!selectMovieData.isShow) {
                this.selectMovieData.isShow = true
            }

            // 鼠标所在浏览器位置
            let clientX = e.clientX,
                clientY = e.clientY
            // 父元素所在位置
            let margin_left = this.margin_left
            let parentElement = this.$refs.moviePlanWindow
            // 父级滚动条总和
            let parentScrollAll = this.$options.methods.parentScrollAll(parentElement)

            // 鼠标在元素内具体位置
            let position = this.mousePosition(clientX, clientY, parentElement, parentScrollAll, margin_left)
            let positionX = position.positionX
            let positionY = position.positionY

            // 校验是否超出限定时间
            let limitElement = this.$refs.content
            let l_offsetLeft = limitElement.offsetLeft
            let l_offsetTop = limitElement.offsetTop
            let l_offsetWidth = limitElement.offsetWidth
            let l_offsetHeight = limitElement.offsetHeight
            // 左右边界检测
            if (positionX < l_offsetLeft - margin_left + 60) {
                positionX = l_offsetLeft - margin_left + 60
            } else if (positionX + Number(selectData.timeLong) >= l_offsetWidth) {
                positionX = l_offsetWidth - Number(selectData.timeLong)
            }

            //上下边界检测
            let movieItemHeight = this.movieItemHeight
            if (positionY + movieItemHeight >= l_offsetHeight) {
                positionY = l_offsetHeight - movieItemHeight
            } else if (positionY <= l_offsetTop) {
                positionY = l_offsetTop
            }

            // 时间线位置
            this.time_line = {
                positionX: positionX + margin_left
            };

            if (this.selectMovieData.isSelect) {
                let _positionX = this.$options.methods.dropScale(positionX, this.dragPrecision)
                let movie_clock_start = this.$options.methods.time(_positionX)
                let movie_clock_end = this.$options.methods.time(_positionX + Number(this.selectMovieData.selectMoive.timeLong))
                // 添加影片显示位置
                this.single_movie = {
                    startTime: {
                        hours: movie_clock_start.hours,
                        minute: movie_clock_start.minute
                    },
                    endTime: {
                        hours: movie_clock_end.hours,
                        minute: movie_clock_end.minute
                    },
                    positionY: positionY
                }
            }

            if (positionY < 50) {
                if (this.contentSize.height < 50 + this.movieItemHeight) {
                    positionY = positionY
                } else {
                    positionY = positionY + this.movieItemHeight + 5
                }
            } else {
                positionY = positionY - 25
            }
            this.clock = {
                positionX: positionX + margin_left,
                positionY: positionY
            }
        },
        /* 添加影片位置 确定矩形起点*/
        addFilm(e) {
            if (this.isCopying) return
            // 鼠标点击位置
            let clientX = e.clientX,
                clientY = e.clientY

            // 父元素位置
            let margin_left = this.margin_left
            let parentElement = this.$refs.moviePlanWindow
            // 父级滚动条总和
            let parentScrollAll = this.$options.methods.parentScrollAll(parentElement)

            // 鼠标所在元素具体位置
            let position = this.mousePosition(clientX, clientY, parentElement, parentScrollAll, margin_left)
            let positionX = position.positionX < 60 ? 60 : position.positionX
            let positionY = position.positionY

            if (this.selectMovieData.isSelect) {    // add film
                // 确定当前所点击行
                let cloum_num = Math.floor(positionY / this.contentSize.roomItemHeight)
                let cloum_isAddOne = positionY % this.contentSize.roomItemHeight

                if (cloum_isAddOne >= 50) {
                    cloum_num = cloum_num + 1
                }

                if (cloum_num > this.plan_rooms.length) {
                    cloum_num = this.plan_rooms.length
                }

                if (e.button == 0) {
                    // 左键添加
                    let movie = JSON.parse(JSON.stringify(this.selectMovieData.selectMoive))
                    movie["select"] = false
                    // 电影所需的位置（时长）
                    let movieNeedTime = Number(movie.timeLong)
                    // 检测影厅是否禁用
                    if (!this.rooms[cloum_num].status) {
                        return this.hallBanTip = true
                    }
                    // 当前添加到的影厅
                    let plan_rooms = JSON.parse(JSON.stringify(this.plan_rooms))
                    let c_plan_rooms = plan_rooms[cloum_num]
                    let maxTime = this.maxTime
                    positionX = this.dropScale(positionX, this.dragPrecision)
                    // 超出限定时
                    if (positionX + movieNeedTime >= maxTime) return

                    if (c_plan_rooms.length == 0) {
                        // 直接添加
                        // 电影开始播放时间
                        let _time = this.innerTime(positionX, movieNeedTime)
                        let planStatus = this.checkTimeRight(_time, movie)
                        if (planStatus.planError) {
                            this.errorText = planStatus.errorType
                            this.timeErrorTip = true
                            return
                        }
                        movie.startTime = _time.startTime
                        movie.endTime = _time.endTime
                        movie.positionX = positionX
                        movie.hallUid = this.rooms[cloum_num].uid_hall
                        movie.saveError = false
                        movie.sameTimeTip = false
                        if (this.copyConfig.copyFlag) {
                            this.isCopying = true
                            copySinglePlan({
                                targetPlanUid: this.copyConfig.id,
                                hallUid: movie.hallUid,
                                planTimeStart: movie.startTime.hours < 6 ? `${this.formatDateTime(new Date(this.baseParam.planDate).getTime() + 24 * 60 * 60 * 1000)} ${movie.startTime.hours}:${movie.startTime.minute}` : `${this.baseParam.planDate} ${movie.startTime.hours}:${movie.startTime.minute}`,
                                planTimeEnd: movie.endTime.hours < 6 ? `${this.formatDateTime(new Date(this.baseParam.planDate).getTime() + 24 * 60 * 60 * 1000)} ${movie.endTime.hours}:${movie.endTime.minute}` : `${this.baseParam.planDate} ${movie.endTime.hours}:${movie.endTime.minute}`,
                                showNoInHall: 1,
                                planShowInterval: 0
                            }).then(res => {
                                if (res.code != 200) {
                                    this.isCopying = false
                                    return this.error(res.msg)
                                }
                                if (res.code == 200 && res.data) {
                                    movie.approveStatus = res.data.approveStatus
                                    movie.cheapestPrice = res.data.cheapestPrice
                                    movie.disVersion = res.data.disVersionName
                                    movie.planUid = res.data.planUid
                                    movie.joinFlag = res.data.joinFlag
                                    movie.joinMovieName = res.data.joinMovieName
                                    movie.planTimeVoList = res.data.planTimeVoList
                                    movie.saleStatus = res.data.saleStatus
                                    movie.planStatus = res.data.planStatus
                                    movie.permitSaleBox = res.data.permitSaleBox
                                    movie.permitDiscount = res.data.permitDiscount
                                    movie.mustRightSeat = res.data.mustRightSeat
                                    movie.minPrice = res.data.minPrice
                                    movie.rate = res.data.rate
                                    movie.isCounter = res.data.isCounter
                                    movie.isSelfServiceTerminals = res.data.isSelfServiceTerminals
                                    movie.personTime = res.data.personTime
                                    movie.tolatMoney = res.data.tolatMoney
                                    movie.occupancy = res.data.occupancy
                                    movie.approve_text = movie.approveStatus == 'NOT_APPROVE' ? '未审核' : movie.approveStatus == 'WAIT_APPROVE' ? '待审核' : movie.approveStatus == 'APPROVED' ? '已审核' : movie.approveStatus == 'REJECT' ? '已驳回' : ''
                                    movie.sale_text = movie.saleStatus == 'SALE' ? '可售' : movie.saleStatus == 'NOT_SALE' ? '不可售' : movie.saleStatus == 'STOP' ? '暂停' : ''
                                    movie.plan_text = movie.planStatus == 'NEW' ? '新建' : movie.planStatus == 'VALID' ? '生效' : movie.planStatus == 'LOCKED' ? '锁定' : movie.planStatus == 'DELETED' ? '删除' : ''

                                    
                                    
                                    let positionY = this.innerPoistionY(cloum_num)
                                    movie.positionY = positionY
                                    // 用于校验数据是否改变
                                    movie.originFlag = {
                                        positionX,
                                        positionY
                                    }
                                                
                                    c_plan_rooms.push(movie)
                                    this.plan_rooms = plan_rooms
                                    this.isCopying = false
                                }
                            })
                        } else {
                            c_plan_rooms.push(movie)
                            this.plan_rooms = plan_rooms
                        }
                        
                    } else {
                        let inner_action = this.canInnerRoom(c_plan_rooms, positionX, movieNeedTime, maxTime, this.timeInterval)
                        let _time = this.innerTime(inner_action.innerPositionX, movieNeedTime)
                        let planStatus = this.checkTimeRight(_time, movie)
                        if (planStatus.planError) {
                            this.errorText = planStatus.errorType
                            this.timeErrorTip = true
                            return
                        }
                        movie.startTime = _time.startTime
                        movie.endTime = _time.endTime
                        movie.positionX = inner_action.innerPositionX
                        movie.hallUid = this.rooms[cloum_num].uid_hall
                        movie.saveError = false
                        movie.sameTimeTip = false
                        if (inner_action.canIn) {
                            if (inner_action.type == 'splice') {
                                if (this.copyConfig.copyFlag) {
                                    let planShowInterval
                                    let prevData = c_plan_rooms[inner_action.index - 1]
                                    let prevTime = prevData.endTime.hours < 6 
                                    ? `${this.formatDateTime(new Date(this.baseParam.planDate).getTime() + 24 * 60 * 60 * 1000)} ${prevData.endTime.hours}:${prevData.endTime.minute}` 
                                    : `${this.baseParam.planDate} ${prevData.endTime.hours}:${prevData.endTime.minute}`

                                
                                    let nextTime = movie.startTime.hours < 6 
                                        ? `${this.formatDateTime(new Date(this.baseParam.planDate).getTime() + 24 * 60 * 60 * 1000)} ${movie.startTime.hours}:${movie.startTime.minute}` 
                                        : `${this.baseParam.planDate} ${movie.startTime.hours}:${movie.startTime.minute}`

                                    planShowInterval = (new Date(nextTime).getTime() - new Date(prevTime).getTime()) / 1000 / 60
                                    this.isCopying = true
                                    copySinglePlan({
                                        targetPlanUid: this.copyConfig.id,
                                        hallUid: movie.hallUid,
                                        planTimeStart: movie.startTime.hours < 6 ? `${this.formatDateTime(new Date(this.baseParam.planDate).getTime() + 24 * 60 * 60 * 1000)} ${movie.startTime.hours}:${movie.startTime.minute}` : `${this.baseParam.planDate} ${movie.startTime.hours}:${movie.startTime.minute}`,
                                        planTimeEnd: movie.endTime.hours < 6 ? `${this.formatDateTime(new Date(this.baseParam.planDate).getTime() + 24 * 60 * 60 * 1000)} ${movie.endTime.hours}:${movie.endTime.minute}` : `${this.baseParam.planDate} ${movie.endTime.hours}:${movie.endTime.minute}`,
                                        showNoInHall: inner_action.index + 1,
                                        planShowInterval: planShowInterval
                                    }).then(res => {
                                        if (res.code != 200) {
                                            this.isCopying = false
                                            return this.error(res.msg)
                                        }
                                        if (res.code == 200 && res.data) {
                                            movie.approveStatus = res.data.approveStatus
                                            movie.cheapestPrice = res.data.cheapestPrice
                                            movie.disVersion = res.data.disVersionName
                                            movie.planUid = res.data.planUid
                                            movie.joinFlag = res.data.joinFlag
                                            movie.joinMovieName = res.data.joinMovieName
                                            movie.planTimeVoList = res.data.planTimeVoList
                                            movie.saleStatus = res.data.saleStatus
                                            movie.planStatus = res.data.planStatus
                                            movie.permitSaleBox = res.data.permitSaleBox
                                            movie.permitDiscount = res.data.permitDiscount
                                            movie.mustRightSeat = res.data.mustRightSeat
                                            movie.minPrice = res.data.minPrice
                                            movie.rate = res.data.rate
                                            movie.isCounter = res.data.isCounter
                                            movie.isSelfServiceTerminals = res.data.isSelfServiceTerminals
                                            movie.personTime = res.data.personTime
                                            movie.tolatMoney = res.data.tolatMoney
                                            movie.occupancy = res.data.occupancy
                                            movie.approve_text = movie.approveStatus == 'NOT_APPROVE' ? '未审核' : movie.approveStatus == 'WAIT_APPROVE' ? '待审核' : movie.approveStatus == 'APPROVED' ? '已审核' : movie.approveStatus == 'REJECT' ? '已驳回' : ''
                                            movie.sale_text = movie.saleStatus == 'SALE' ? '可售' : movie.saleStatus == 'NOT_SALE' ? '不可售' : movie.saleStatus == 'STOP' ? '暂停' : ''
                                            movie.plan_text = movie.planStatus == 'NEW' ? '新建' : movie.planStatus == 'VALID' ? '生效' : movie.planStatus == 'LOCKED' ? '锁定' : movie.planStatus == 'DELETED' ? '删除' : ''

                                            
                                            
                                            let positionY = this.innerPoistionY(cloum_num)
                                            movie.positionY = positionY
                                            // 用于校验数据是否改变
                                            movie.originFlag = {
                                                positionX,
                                                positionY
                                            }
                                            

                                            c_plan_rooms.splice(inner_action.index, 0, movie)
                                            this.plan_rooms = plan_rooms
                                            this.isCopying = false
                                        }
                                    })
                                } else {
                                    c_plan_rooms.splice(inner_action.index, 0, movie)
                                    this.plan_rooms = plan_rooms
                                }
                                
                            } else {
                                if (this.copyConfig.copyFlag) {
                                    this.isCopying = true
                                    copySinglePlan({
                                        targetPlanUid: this.copyConfig.id,
                                        hallUid: movie.hallUid,
                                        planTimeStart: movie.startTime.hours < 6 ? `${this.formatDateTime(new Date(this.baseParam.planDate).getTime() + 24 * 60 * 60 * 1000)} ${movie.startTime.hours}:${movie.startTime.minute}` : `${this.baseParam.planDate} ${movie.startTime.hours}:${movie.startTime.minute}`,
                                        planTimeEnd: movie.endTime.hours < 6 ? `${this.formatDateTime(new Date(this.baseParam.planDate).getTime() + 24 * 60 * 60 * 1000)} ${movie.endTime.hours}:${movie.endTime.minute}` : `${this.baseParam.planDate} ${movie.endTime.hours}:${movie.endTime.minute}`,
                                        showNoInHall: 1,
                                        planShowInterval: 0
                                    }).then(res => {
                                        if (res.code != 200) {
                                            this.isCopying = false
                                            return this.error(res.msg)
                                        }
                                        if (res.code == 200 && res.data) {
                                            movie.approveStatus = res.data.approveStatus
                                            movie.cheapestPrice = res.data.cheapestPrice
                                            movie.disVersion = res.data.disVersionName
                                            movie.planUid = res.data.planUid
                                            movie.joinFlag = res.data.joinFlag
                                            movie.joinMovieName = res.data.joinMovieName
                                            movie.planTimeVoList = res.data.planTimeVoList
                                            movie.saleStatus = res.data.saleStatus
                                            movie.planStatus = res.data.planStatus
                                            movie.permitSaleBox = res.data.permitSaleBox
                                            movie.permitDiscount = res.data.permitDiscount
                                            movie.mustRightSeat = res.data.mustRightSeat
                                            movie.minPrice = res.data.minPrice
                                            movie.rate = res.data.rate
                                            movie.isCounter = res.data.isCounter
                                            movie.isSelfServiceTerminals = res.data.isSelfServiceTerminals
                                            movie.personTime = res.data.personTime
                                            movie.tolatMoney = res.data.tolatMoney
                                            movie.occupancy = res.data.occupancy
                                            movie.approve_text = movie.approveStatus == 'NOT_APPROVE' ? '未审核' : movie.approveStatus == 'WAIT_APPROVE' ? '待审核' : movie.approveStatus == 'APPROVED' ? '已审核' : movie.approveStatus == 'REJECT' ? '已驳回' : ''
                                            movie.sale_text = movie.saleStatus == 'SALE' ? '可售' : movie.saleStatus == 'NOT_SALE' ? '不可售' : movie.saleStatus == 'STOP' ? '暂停' : ''
                                            movie.plan_text = movie.planStatus == 'NEW' ? '新建' : movie.planStatus == 'VALID' ? '生效' : movie.planStatus == 'LOCKED' ? '锁定' : movie.planStatus == 'DELETED' ? '删除' : ''

                                            
                                            
                                            let positionY = this.innerPoistionY(cloum_num)
                                            movie.positionY = positionY
                                            // 用于校验数据是否改变
                                            movie.originFlag = {
                                                positionX,
                                                positionY
                                            }
                                            

                                            c_plan_rooms.unshift(movie)
                                            this.plan_rooms = plan_rooms
                                            this.isCopying = false
                                        }
                                    })
                                } else {
                                    c_plan_rooms.unshift(movie)
                                    this.plan_rooms = plan_rooms
                                }
                            }
                        }

                    }
                    
                } else if (e.button == 2) {
                    // 右键清空已选影片
                    this.$emit("cleanMovie")
                    this.copyConfig = {
                        id: '',
                        copyFlag: false
                    }
                    this.isCopying = false
                }
            } else {
                if (e.button == 0) {
                    this.block = {
                        click: true,
                        ctrl: e.ctrlKey,
                        mouseStart: {
                            positionX,
                            positionY
                        }
                    }

                }
            }
            
        },
        /* 画矩形 */
        drawBlock(e) {
            if (!this.mode) return
            if (this.block.click) {
                // 鼠标点击位置
                let clientX = e.clientX,
                    clientY = e.clientY

                // 父元素位置
                let margin_left = this.margin_left
                let parentElement = this.$refs.moviePlanWindow
                // let parentElement = this.$refs.content;
                // 父级滚动条总和
                let parentScrollAll = this.$options.methods.parentScrollAll(parentElement)

                // 鼠标所在元素具体位置
                let position = this.mousePosition(clientX, clientY, parentElement, parentScrollAll, margin_left, true)
                let positionX = position.positionX
                let positionY = position.positionY

                // 起点坐标
                let block = this.block
                let start_positionX = this.block.mouseStart.positionX
                let start_positionY = this.block.mouseStart.positionY

                // 宽度
                let width = positionX - start_positionX
                // 高度
                let height = positionY - start_positionY
                // 确定拖拉方位
                // let c_type,r_type;
                let topPositinX
                let topPositionY
                if (width < 0) {
                    // r_type = 'left';
                    topPositinX = positionX
                } else {
                    // r_type = 'right';
                    topPositinX = start_positionX
                }
                if (height < 0) {
                    // c_type = 'top';
                    topPositionY = positionY
                } else {
                    // c_type = 'bottom';
                    topPositionY = start_positionY
                }

                width = Math.abs(width)
                height = Math.abs(height)

                this.blockSetting = {
                    isShow: true,
                    top: {
                        positionX: topPositinX,
                        positionY: topPositionY
                    },
                    size: {
                        width,
                        height
                    }
                }
            }
        },
        /* 清除矩形 */
        cleanDrawBlock() {
            let block = JSON.parse(JSON.stringify(this.block))
            let blockSetting = JSON.parse(JSON.stringify(this.blockSetting))

            let cloum_min = blockSetting.top.positionY,
                block_height = blockSetting.size.height,
                colum_max = cloum_min + block_height;
            let row_min = blockSetting.top.positionX,
                block_width = blockSetting.size.width,
                row_max = row_min + block_width

            let roomItemHeight = this.contentSize.roomItemHeight

            let c_min_num = this.$options.methods.innerPosition(cloum_min, roomItemHeight),
                c_max_num = Math.floor(colum_max / roomItemHeight)

            let plan_rooms = JSON.parse(JSON.stringify(this.plan_rooms))
            let drop_data = JSON.parse(JSON.stringify(this.drop_data))
            let cover_drop_data = []
            if (block.ctrl) {
                // 不移除之前所选
                for (let i = c_min_num; i <= c_max_num; i++) {
                    for (let j = 0; j < plan_rooms[i].length; j++) {
                        if (row_min <= plan_rooms[i][j].positionX && plan_rooms[i][j].positionX <= row_max) {
                            let existent = false
                            for (let k = 0; k < drop_data.length; k++) {
                                // 判断是否已经存在
                                if (drop_data[k].rowIndex == i && drop_data[k].itemIndex == j) {
                                    existent = true
                                }
                            }

                            if (!existent) {
                                plan_rooms[i][j].isSelect = true;
                                let c_item = JSON.parse(JSON.stringify(plan_rooms[i][j]))
                                c_item.rowIndex = i
                                c_item.positionY = this.innerPoistionY(i)
                                c_item.itemIndex = j
                                // 校验是否可以拖拽
                                let dropStatus = this.planDropStatus(c_item.planStatus)
                                if (dropStatus) {
                                    drop_data.push(c_item)
                                }
                            }
                        }
                    }
                }
            } else {
                // 移除之前所选中
                for (let i = 0; i < plan_rooms.length; i++) {
                    for (let j = 0; j < plan_rooms[i].length; j++) {
                        plan_rooms[i][j].isSelect = false
                        if (c_min_num <= i && i <= c_max_num) {
                            if (row_min <= plan_rooms[i][j].positionX && plan_rooms[i][j].positionX <= row_max) {
                                if (block_width != 0 && block_height != 0) {
                                    plan_rooms[i][j].isSelect = true
                                    let c_item = JSON.parse(JSON.stringify(plan_rooms[i][j]));
                                    c_item.rowIndex = i
                                    c_item.positionY = this.innerPoistionY(i);
                                    c_item.itemIndex = j
                                    // 校验是否可以拖拽
                                    let dropStatus = this.planDropStatus(c_item.planStatus)
                                    if (dropStatus) {
                                        cover_drop_data.push(c_item)
                                    }
                                }
                            }
                        }
                    }
                }
                drop_data = cover_drop_data
            }

            this.plan_rooms = plan_rooms
            this.drop_data = drop_data

            this.block = {
                click: false,
                ctrl: false,
                mouseStart: {
                    positionX: 0,
                    positionY: 0
                }
            }
            this.blockSetting = {
                isShow: false,
                top: {
                    positionX: 0,
                    positionY: 0
                },
                size: {
                    width: 0,
                    height: 0
                }
            }

            this.hideControl()
        },
        /* 鼠标在元素内位置 */
        mousePosition(clientX, clientY, element, parentScrollAll, margin_left, isDrawBlock) {
            let p_offsetTop = element.offsetTop,
                p_offsetLeft = element.offsetLeft,
                p_scorllLeft = element.scrollLeft,
                p_scorllTop = element.scrollTop;
            let positionX = clientX - p_offsetLeft + p_scorllLeft - margin_left + parentScrollAll.scorllLeft
            let positionY = clientY - p_offsetTop + p_scorllTop + parentScrollAll.scorllTop

            return isDrawBlock ? {
                positionX,
                positionY
            } : {
                positionX,
                positionY
            }
        },
        /* 修改颜色为rgba */
        colorRgba(str, opacity) {
            let sColor = str.toLowerCase();
            if (sColor) {
                if (sColor.length === 4) {
                    let sColorNew = "#";
                    for (let i = 1; i < 4; i += 1) {
                        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                    }
                    sColor = sColorNew;
                }
                //处理六位的颜色值
                let sColorChange = [];
                for (let i = 1; i < 7; i += 2) {
                    sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
                }
                return "rgba(" + sColorChange.join(",") + "," + opacity + ")";
            } else {
                return sColor;
            }
        },
        filmContentStyle(filmItem) {
            if (filmItem.sameTimeTip) {
                return {
                    background: this.colorRgba(filmItem.color, 0.15),
                    border: `3px solid red`
                }
            }
            if (filmItem.saveError) {
                return {
                    background: this.colorRgba(filmItem.color, 0.15),
                    border: `3px solid red`
                }
            }

            return  filmItem.isSelect ? {
                        background: this.colorRgba(filmItem.color, 0.15),
                        border: `3px solid ${this.colorRgba(filmItem.color, 1)}`
                    } : {
                        background: this.colorRgba(filmItem.color, 0.15),
                        borderTop: `3px solid ${this.colorRgba(filmItem.color, 1)}`
                    }
        },
        /* 拖拽精度 */
        dropScale(positionX, _scaleNum) {
            let _halfScale = _scaleNum / 2
            // 余下的精度
            let l_positionX = (positionX % 60) % _scaleNum

            let _positionX
            if (l_positionX < _halfScale) {
                _positionX = positionX - l_positionX
            } else {
                _positionX = positionX + _scaleNum - l_positionX
            }
            return _positionX
        },
        /* 位置转换时间 */
        time(positionX) {
            // 时钟
            let hours = Math.floor(positionX / 60);
            let minute = Math.floor(positionX - hours * 60);

            // 格式化时钟
            if (hours <= 18) {
                hours = 6 + hours - 1;
            } else {
                hours = hours - 18 - 1;
            }
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (minute < 10) {
                minute = "0" + minute;
            }

            hours = String(hours);
            minute = String(minute);

            if (hours == '24') {
                hours = '00';
            }
            return {
                hours,
                minute
            };
        },
        /* 时间转换位置 */
        position(hours) {
            let h = Number(hours);
            if (h < 6) {
                h = (24 + h);
            }
            return (h - 6 + 1) * 60;
        },
        /* 获取父级滚动条总和 */
        parentScrollAll(el) {
            let parent = el;
            let parentArray = [];
            let scorllTop = 0;
            let scorllLeft = 0;
            while (parent.tagName != "HTML") {
                scorllTop += parent.parentNode.scrollTop;
                scorllLeft += parent.parentNode.scrollLeft;

                parentArray.push(parent.parentNode);
                parent = parent.parentNode;
            }

            return {
                scorllTop,
                scorllLeft
            };
        },
        longInterval() {
            
        },
        /* 设置阴影宽高 */
        passTimeShadow() {
            // 传入日期
            let currentDate = this.baseParam.planDate
            // 系统日期
            let systemDate = new Date()
            let s_year = systemDate.getFullYear(),
                s_mounth = systemDate.getMonth() + 1,
                s_day = systemDate.getDate()

            s_mounth = s_mounth < 10 ? `0${s_mounth}` : s_mounth
            s_day = s_day < 10 ? `0${s_day}` : s_day

            let systemDateFlage = new Date(`${s_year}-${s_mounth}-${s_day}`).getTime(),
                currentDateFlage = new Date(`${currentDate}`).getTime()
            let width, hours = new Date().getHours(), min = new Date().getMinutes()
            if (systemDateFlage == currentDateFlage) {
                // + 1 因为 前边有一个小时区域无法布局
                if (hours < 5) {
                    width = 0
                } else if (hours < 6 && hours >= 5) {
                    width = 0 + min
                } else {
                    width = (hours - 6 + 1) * 60 + min
                }
            } else if (systemDateFlage < currentDateFlage) {
                width = 0
            } else {
                if (systemDateFlage - currentDateFlage - 24 * 60 * 60 * 1000 >= 24 * 60 * 60 * 1000) {
                    width = 25 * 60
                } else {
                    if (hours < 6) {
                        width = (24 - (6 - hours) + 1) * 60 + min
                    }  else {
                        width = 25 * 60
                    }
                }
                
            }

            this.pass_time.width = width
            this.clock_date.positionX = width;
        },

        /* 点击影片 */
        filmMouseDown(film, filmRowIndex, filmIndex, e) {
            e.stopPropagation()
            let itemMarginTop = (this.contentSize.roomItemHeight - this.movieItemHeight) / 2
            let rowIndex = filmRowIndex,
            itemIndex = filmIndex,
            planStatus = film.planStatus
            this.mouseFlag = {
                x: e.pageX,
                y: e.pageY
            }

            // 校验当前影片是否为可拖拽状态
            let dropStatus = this.planDropStatus(planStatus)
            if (dropStatus && !this.isMouseDown) {
                // 开启拖拽影片开关
                this.isMouseDown = true
            }
            let isCtrl = e.ctrlKey;

            let selectMovie = JSON.parse(JSON.stringify(this.plan_rooms[rowIndex][itemIndex]));
            selectMovie.rowIndex = rowIndex;
            selectMovie.itemIndex = itemIndex;
            selectMovie.positionY = itemMarginTop + this.contentSize.roomItemHeight * rowIndex;
            selectMovie.isSelect = true;
            this.curPlan = selectMovie

            if (!isCtrl) {
                this.controlManage(selectMovie);
            }


            // 已选影片
            let drop_data = JSON.parse(JSON.stringify(this.drop_data));
            let plan_rooms = JSON.parse(JSON.stringify(this.plan_rooms));
            // 选中影片
            if (!isCtrl) {
                // 单选
                // 判断是否为已选中的 如果是已选中的 需校验下一步操作为 拖拽全部 还是 拖拽当前
                let isDropAllPress
                if (drop_data.length != 0) {
                    let existent = false;
                    // 是否已经存在
                    for (let i = 0; i < drop_data.length; i++) {
                        if (drop_data[i].rowIndex == rowIndex && drop_data[i].itemIndex == itemIndex) {
                            existent = true;
                        }
                    }

                    if (!existent) {
                        for (let i = 0; i < plan_rooms.length; i++) {
                            for (let j = 0; j < plan_rooms[i].length; j++) {
                                plan_rooms[i][j].isSelect = false;
                            }
                        }
                        if (dropStatus) {
                            drop_data = [selectMovie];
                        } else {
                            drop_data = [];
                        }

                        plan_rooms[rowIndex][itemIndex].isSelect = true;
                        this.plan_rooms = plan_rooms;
                    }

                } else {
                    for (let i = 0; i < plan_rooms.length; i++) {
                        for (let j = 0; j < plan_rooms[i].length; j++) {
                            plan_rooms[i][j].isSelect = i == rowIndex && itemIndex == j
                        }
                    }

                    if (dropStatus) {
                        drop_data = [selectMovie];
                    } else {
                        drop_data = [];
                    }
                    // plan_rooms[rowIndex][itemIndex].isSelect = true
                    this.plan_rooms = plan_rooms;
                }
            } else {
                // 隐藏控制器
                this.hideControl()
                // 多选 存在重置的状况 所以需要判断plan_rooms中是否存在已选 并将已选添加进drop_data
                let length = drop_data.length;
                if (length == 0) {
                    if (dropStatus) {
                        drop_data.push(selectMovie);
                    }
                } else {
                    for (let i = 0; i < length; i++) {
                        let r_index = drop_data[i].rowIndex
                        let i_index = drop_data[i].itemIndex
                        if (dropStatus) {
                            if (r_index == rowIndex && i_index == itemIndex) {
                                drop_data.splice(i, 1)
                                break;
                            }
                            if (i == length - 1) {
                                drop_data.push(selectMovie)
                            }
                        }
                    }
                }
                this.plan_rooms[rowIndex][itemIndex].isSelect = !this.plan_rooms[rowIndex][itemIndex].isSelect
            }

            this.drop_data = drop_data
        },
        /* 拖拽影片 */
        filmMouseMove(e) {
            if(!this.mode) return
            if (this.isMouseDown) {
                if (e.pageX == this.mouseFlag.x && e.pageY == this.mouseFlag.y) {
                    return false
                }
                this.isDropShow = true;
                let plan_rooms = JSON.parse(JSON.stringify(this.plan_rooms));
                // 备份数据
                let dropCopyData = JSON.parse(JSON.stringify(plan_rooms));

                this.dropCopyData = dropCopyData;

                // 清空已选排片数据
                let drop_data = JSON.parse(JSON.stringify(this.drop_data));
                for (let i = 0; i < drop_data.length; i++) {
                    let r_index = drop_data[i].rowIndex,
                        i_positionX = drop_data[i].positionX;
                    //plan_rooms[r_index].splice(i_index, 1);
                    let c_plan_rooms = plan_rooms[r_index];
                    for (let j = 0; j < c_plan_rooms.length; j++) {
                        let c_positionX = c_plan_rooms[j].positionX;
                        if (i_positionX == c_positionX) {
                            plan_rooms[r_index].splice(j, 1);
                            break;
                        }
                    }
                }
                this.plan_rooms = plan_rooms;
                // 鼠标点击位置
                let clientX = e.clientX,
                    clientY = e.clientY;

                // 父元素位置
                let margin_left = this.margin_left;
                let parentElement = this.$refs.moviePlanWindow;
                // 父级滚动条总和
                let parentScrollAll = this.$options.methods.parentScrollAll(parentElement);

                // 鼠标所在元素具体位置
                let position = this.mousePosition(clientX, clientY, parentElement, parentScrollAll, margin_left);
                let positionX = position.positionX;
                let positionY = position.positionY;
                // 开始拖动的位置
                this.dropStartPosition = {
                    positionX,
                    positionY
                }

            }
        },
        /* 取消点击 */
        filmMouseUp(e) {
            if (!this.blockSetting.isShow) {
                e.stopPropagation()
            }
            this.isMouseDown = false
            this.isDropShow = false
        },
        /* 模板中移动 */
        dropFilmMove(e) {
            // 查看模式过滤
            if (!this.mode) return
            // 隐藏控制器
            if (this.control.config.isShow) {
                this.hideControl()
            }

            e.stopPropagation();
            // 开始拖动位置
            let startPositionX = this.dropStartPosition.positionX
            let startPositionY = this.dropStartPosition.positionY
            // 鼠标位置
            let clientX = e.clientX, clientY = e.clientY

            // 父元素位置
            let margin_left = this.margin_left
            let parentElement = this.$refs.moviePlanWindow
            // 父级滚动条总和
            let parentScrollAll = this.$options.methods.parentScrollAll(parentElement)

            // 鼠标所在元素具体位置
            let position = this.mousePosition(clientX, clientY, parentElement, parentScrollAll, margin_left)
            let positionX = position.positionX
            let positionY = position.positionY
            let drop_data = JSON.parse(JSON.stringify(this.drop_data))
            // 找出拖拽数据中 最左值 最右值 最高值 最低值 组成矩形做边界检测
            let cube
            // 时钟高度
            let clock_postionY
            let movieTime
            //let left,right,top,bottom;
            for (let i = 0; i < drop_data.length; i++) {
                let left = drop_data[i].positionX + positionX - startPositionX
                let right = left + Number(drop_data[i].timeLong)
                let top = drop_data[i].positionY + positionY - startPositionY
                let bottom = top + this.movieItemHeight
                if (!cube) {
                    cube = {
                        left,
                        right,
                        top,
                        bottom
                    }
                    clock_postionY = drop_data[i].positionY
                    movieTime = drop_data[i].timeLong
                } else {
                    if (left < cube.left) {
                        cube.left = left
                        clock_postionY = drop_data[i].positionY
                        movieTime = drop_data[i].timeLong
                    }
                    if (right > cube.right) {
                        cube.right = right
                    }
                    if (top < cube.top) {
                        cube.top = top
                    }
                    if (bottom > cube.bottom) {
                        cube.bottom = bottom
                    }
                }
            }

            if (!cube) debugger
            // 每小时间隔60min 每刻度尺间隔11 每刻度尺宽1 49 = 11*4+4+1；
            // if (cube.left >= 0 && cube.right <= this.contentSize.width - 49 && cube.top >= 0 && cube.bottom <= this.rooms.length * this.contentSize.roomItemHeight) {
            if (cube.left >= 60 && cube.right <= this.contentSize.width - 64 && cube.top >= 0 && cube.bottom <= this.rooms.length * this.contentSize.roomItemHeight) {
                this.relative = {
                    positionX: positionX - startPositionX,
                    positionY: positionY - startPositionY
                }
                // 拖拽精度修改时间
                let _positionX = this.dropScale(cube.left, this.dragPrecision)
                let startTime = this.time(_positionX)
                let endTime = this.time(_positionX + Number(movieTime))
                let c_postionY = clock_postionY + positionY - startPositionY - 25
                if (c_postionY < 0) {

                    if (this.contentSize.height < 50 + this.movieItemHeight) {
                        c_postionY = clock_postionY + positionY - startPositionY
                    } else {
                        c_postionY = clock_postionY + positionY - startPositionY + this.movieItemHeight + 5
                    }

                }
                this.drop_clock = {
                    isShow: true,
                    positionX: cube.left,
                    positionY: c_postionY,
                    startTime,
                    endTime
                }
            }

        },
        /* 模板中松开鼠标 */
        dropFilmMouseUp(e) {
            if (!this.mode) return
            // 将拖拽的数据插入对应的位置
            let drop_data = JSON.parse(JSON.stringify(this.drop_data))
            let relative = this.relative
            let plan_rooms = this.plan_rooms
            
            // 校验是否出现错误
            let isError = false
            // 校验是否有拖动至禁用影厅
            let isHallBanTip = false
            for (let i = 0; i < drop_data.length; i++) {
                let d_positionX = drop_data[i].positionX,
                    d_positionY = drop_data[i].positionY
                let c_positionX = this.dropScale(d_positionX + relative.positionX, this.dragPrecision),
                    c_row_index = this.innerPosition(d_positionY + relative.positionY, this.contentSize.roomItemHeight)
                if (!this.rooms[c_row_index].status) {
                    isHallBanTip = true
                }
                let c_plan_rooms = plan_rooms[c_row_index]
                // 修改位置
                drop_data[i].positionX = c_positionX
                drop_data[i].rowIndex = c_row_index
                if (c_plan_rooms.length == 0) {
                    let _time = this.innerTime(c_positionX, Number(drop_data[i].timeLong))
                    drop_data[i].startTime = _time.startTime
                    drop_data[i].endTime = _time.endTime
                    drop_data[i].hallUid = this.rooms[c_row_index].uid_hall
                    plan_rooms[c_row_index].push(drop_data[i])
                } else {
                    let current_drop = JSON.parse(JSON.stringify(drop_data[i]))
                    delete current_drop.itemIndex
                    delete current_drop.rowIndex
                    let movieNeedTime = current_drop.timeLong
                    let maxTime = this.maxTime
                    // 校验是否能插入
                    let inner_action = this.canInnerRoom(c_plan_rooms, c_positionX, movieNeedTime, maxTime, this.timeInterval)
                    let _time = this.innerTime(inner_action.innerPositionX, Number(drop_data[i].timeLong))
                    current_drop.startTime = _time.startTime
                    current_drop.endTime = _time.endTime
                    current_drop.positionX = inner_action.innerPositionX

                    if (inner_action.canIn) {
                        current_drop.hallUid = this.rooms[c_row_index].uid_hall
                        if (inner_action.type == 'splice') {
                            plan_rooms[c_row_index].splice(inner_action.index, 0, current_drop)
                            drop_data[i].itemIndex = inner_action.index - 1
                        } else {
                            plan_rooms[c_row_index].unshift(current_drop)
                            drop_data[i].itemIndex = 0
                        }
                    } else {
                        isError = true
                    }
                }
            }

            // 清空已选
            for (let i = 0; i < plan_rooms.length; i++) {
                for (let j = 0; j < plan_rooms[i].length; j++) {
                    plan_rooms[i][j].isSelect = false
                }
            }
            // 判断是否有 涉及到禁用影厅
            if (isHallBanTip) {
                this.hallBanTip = true
            }
            if (!isError && !isHallBanTip) {
                this.plan_rooms = plan_rooms
            } else {
                this.plan_rooms = this.dropCopyData
            }

            this.drop_data = []

            this.relative = {
                positionX: 0,
                positionY: 0
            }
            this.drop_clock = {
                positionX: 0,
                positionY: 0
            }
            this.drop_clock = {
                isShow: false,
                positionX: 0,
                positionY: 0,
                startTime: {
                    hours: '',
                    minute: ''
                },
                endTime: {
                    hours: '',
                    minute: ''
                }
            }
            this.isDropShow = false
            this.isMouseDown = false
        },
        /* 计算数据应该插入模板的位置 */
        innerPosition(positionY, roomItemHeight) {
            let index = Math.floor(positionY / roomItemHeight)
            let less = positionY % roomItemHeight
            if (less > 50) {
                index += 1
            }
            return index
        },
        /* 计算数据插入的positionY */
        innerPoistionY(rowIndex) {
            let positionY = rowIndex * this.contentSize.roomItemHeight + (this.contentSize.roomItemHeight - this.movieItemHeight) / 2
            return positionY
        },
        /* 计算数据能否插入 */
        canInnerRoom(plan_rooms, c_positionX, movieNeedTime, maxTime, plan_distant) {
            // 插入电影是否存在其他相邻电影
            let min_movie
            let max_movie

            // 检测通过后插入元素下标
            let start_index
            let end_index
            
            let sameTime = false

            plan_rooms.forEach((item, i) => {
                if (item.positionX == c_positionX ) {
                    sameTime = true
                }
                if (!min_movie && item.positionX < c_positionX) {
                    min_movie = item
                    start_index = i
                } else if (min_movie && min_movie.positionX < item.positionX && item.positionX < c_positionX) {
                    min_movie = item  
                    start_index = i
                }

                if (!max_movie && item.positionX > c_positionX) {
                    max_movie = item
                    end_index = i
                } else if (max_movie && max_movie.positionX > item.positionX && item.positionX > c_positionX) {
                    max_movie = item
                    end_index = i
                }
            })
            
            let canIn = false
            if (sameTime) {
                return {
                    canIn,
                    type,
                    index,
                    innerPositionX
                }
            }

            // 限制区间
            let l_room
            // 可播放时间
            let l_time
            // 只有一边有电影 可以适用 自动间隔
            let innerType

            if (min_movie && max_movie) {
                // 在已有电影添加
                l_room = {
                    min: min_movie.positionX + Number(min_movie.timeLong) + plan_distant,
                    max: max_movie.positionX - plan_distant
                }
                innerType = 'center'
            } else if (min_movie && !max_movie) {
                // 只有左边有电影
                l_room = {
                    min: min_movie.positionX + Number(min_movie.timeLong) + plan_distant,
                    max: maxTime
                }
                innerType = 'left'
            } else if (!min_movie && max_movie) {
                // 只有右边有电影
                l_room = {
                    min: 0,
                    max: Number(max_movie.positionX) - plan_distant
                }
                innerType = 'right'
            }
            l_time = l_room.max - l_room.min

            let type // 插入的类型 splice / unshift
            let index // 插入的下标
            let innerPositionX
            if (Number(movieNeedTime) <= l_time) {
                if (innerType == 'center') {
                    if (c_positionX <= l_room.min) {
                        // 低于限制值
                        innerPositionX = l_room.min
                    } else if (c_positionX + Number(movieNeedTime) >= l_room.max) {
                        // 超出最大值
                        innerPositionX = l_room.max - Number(movieNeedTime)
                    } else {
                        innerPositionX = c_positionX
                    }
                }

                if (innerType == 'left') {
                    if (min_movie.positionX <= c_positionX && c_positionX <= l_room.min) {
                        innerPositionX = l_room.min
                    } else {
                        innerPositionX = c_positionX
                    }
                }

                if (innerType == 'center' || innerType == 'left') {
                    canIn = true
                    type = 'splice'
                    index = start_index + 1
                }

                if (innerType == 'right') {
                    if (l_room.max <= c_positionX + Number(movieNeedTime)) {
                        innerPositionX = l_room.max - Number(movieNeedTime)
                    } else {
                        innerPositionX = c_positionX
                    }
                    canIn = true
                    type = 'unshift'
                }
            } else {
                this.dialogVisible = true
            }

            return {
                canIn,
                type,
                index,
                innerPositionX
            }
        },
        /* 计算插入电影的时间 */
        innerTime(positionX, movieNeedTime) {
            let start_time = this.time(positionX)
            let end_time = this.time(positionX + movieNeedTime)
            let startTime = {
                hours: start_time.hours,
                minute: start_time.minute
            };
            let endTime = {
                hours: end_time.hours,
                minute: end_time.minute
            };
            return {
                startTime,
                endTime
            }
        },
        /* 选中当前影厅所有可选电影 */
        selectRoom(data) {
            let c_index = Number(data.index)
            let plan_rooms = JSON.parse(JSON.stringify(this.plan_rooms))
            let drop_data = []
            for (let i = 0; i < plan_rooms.length; i++) {
                for (let j = 0; j < plan_rooms[i].length; j++) {
                    let c_d = plan_rooms[i][j]
                    if (i == c_index) {
                        let dropStatus = this.planDropStatus(c_d.planStatus)

                        c_d.isSelect = true
                        let c_movie = JSON.parse(JSON.stringify(c_d))
                        c_movie.rowIndex = i
                        c_movie.positionY = this.innerPoistionY(i)
                        c_movie.itemIndex = j
                        if (dropStatus) {
                            drop_data.push(c_movie)
                        }
                    } else {
                        c_d.isSelect = false
                    }
                }
            }
            this.drop_data = drop_data
            this.plan_rooms = plan_rooms
        },
        /* 选中全部 */
        selectAll() {
            let plan_rooms = JSON.parse(JSON.stringify(this.plan_rooms))
            let drop_data = []

            for (let i = 0; i < plan_rooms.length; i++) {
                for (let j = 0; j < plan_rooms[i].length; j++) {
                    let c_d = plan_rooms[i][j]
                    let dropStatus = this.planDropStatus(c_d.planStatus)
                    c_d.isSelect = true
                    let c_item = JSON.parse(JSON.stringify(c_d))
                    c_item.rowIndex = i
                    c_item.positionY = this.innerPoistionY(i)
                    c_item.itemIndex = j
                    if (dropStatus) {
                        drop_data.push(c_item)
                    }
                }
            }
            this.plan_rooms = plan_rooms
            this.drop_data = drop_data

            // 隐藏控制器
            this.hideControl()
        },
        /* 保存排片 */
        savePlan(type, cb) {
            // 如果是别的操作触发 的自动保存操作 不校验相同开场结束时间
            if (cb) {
                this.submitSave(type, cb)
                return
            }
            let planData = JSON.parse(JSON.stringify(this.plan_rooms)).reduce((data, item) => {
                return data.concat(item.map(plan => plan))
            }, [])
            let sameStartTimeArr = [], sameEndTimeArr = []
            planData.forEach(item => {
                planData.forEach(plan => {
                    if (!(item.hallUid == plan.hallUid && item.positionX == plan.positionX)) {
                        if (`${item.startTime.hours}${item.startTime.minute}` == `${plan.startTime.hours}${plan.startTime.minute}`) {
                            sameStartTimeArr.push(`${item.startTime.hours}${item.startTime.minute}`)
                        } else if (`${item.endTime.hours}${item.endTime.minute}` == `${plan.endTime.hours}${plan.endTime.minute}`) {
                            sameEndTimeArr.push(`${item.endTime.hours}${item.endTime.minute}`)
                        }
                    }
                })
            })
            if (!sameStartTimeArr.length && !sameEndTimeArr.length) {
                this.plan_rooms.forEach(row => {
                    row.forEach(plan => {
                        plan.sameTimeTip = false
                    })
                })
                this.submitSave(type, cb)
            } else {
                this.$confirm('存在出入场时间相同的场次 是否保存?', '确认信息', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '保存',
                    cancelButtonText: '取消'
                    })
                    .then(() => {
                        this.plan_rooms.forEach(row => {
                            row.forEach(plan => {
                                plan.sameTimeTip = false
                            })
                        })
                        this.submitSave(type, cb)
                    })
                    .catch(action => {
                        if (action == 'cancel') {
                            let planDataCopy = JSON.parse(JSON.stringify(this.plan_rooms))
                            planDataCopy.forEach(row => {
                                row.forEach(plan => {
                                    sameStartTimeArr.some(item => {
                                        if (`${plan.startTime.hours}${plan.startTime.minute}` == item) {
                                            plan.sameTimeTip = true
                                            return true
                                        }
                                    })
                                    // 此处判断 节省性能 如果已经有相同时间提示标记的 则不需要再进行遍历
                                    if (!plan.sameTimeTip) {
                                        sameEndTimeArr.some(item => {
                                            if (`${plan.startTime.hours}${plan.startTime.minute}` == item) {
                                                plan.sameTimeTip = true
                                                return true
                                            }
                                        })
                                    }
                                })
                            })
                            this.plan_rooms = planDataCopy
                        }    
                    })
            }            

        },
        // 提交保存排片
        /**
         * @cb 是否需要回调
         * 如果是回调 cb == true 时 为编辑/查看场次详情
         * cb 类型为 function 时 为回调函数
         */
        submitSave(type, cb) {
            let subData = []
            this.changePlanIndexInterval()
            this.plan_rooms.forEach((row, rowIndex) => {
                subData = subData.concat(
                row.filter(plan => plan.approveStatus !== 'WAIT_APPROVE' && plan.approveStatus !== 'APPROVED').map(plan =>{
                    let item = {
                        "planUid": plan.planUid ? plan.planUid : '',
                        "cinemaUid": this.baseParam.uidCinema,
                        "movieCode": plan.movieCode,
                        "hallUid": this.rooms[rowIndex].uid_hall,
                        "movieLanguage": plan.language,
                        "mustRightSeat": plan.mustRightSeat != undefined ? plan.mustRightSeat : 1,
                        "planDate": this.baseParam.planDate,
                        "planTimeStart": plan.startTime.hours < 6 ? `${this.formatDateTime(new Date(this.baseParam.planDate).getTime() + 24 * 60 * 60 * 1000)} ${plan.startTime.hours}:${plan.startTime.minute}` : `${this.baseParam.planDate} ${plan.startTime.hours}:${plan.startTime.minute}`,
                        "planTimeEnd": plan.endTime.hours < 6 ? `${this.formatDateTime(new Date(this.baseParam.planDate).getTime() + 24 * 60 * 60 * 1000)} ${plan.endTime.hours}:${plan.endTime.minute}` : `${this.baseParam.planDate} ${plan.endTime.hours}:${plan.endTime.minute}`,
                        "minPrice": plan.minPrice != undefined ? plan.minPrice : 0,
                        "rate": plan.rate != undefined ? plan.rate : 0,
                        "permitSaleBox": plan.permitSaleBox != undefined ? plan.permitSaleBox : 1,
                        "permitDiscount": plan.permitDiscount != undefined ? plan.permitDiscount : 0,
                        "joinFlag": plan.joinFlag != undefined ? plan.joinFlag : 0,
                        "schPlanFavTicketVoList": [],
                        "schPlanBaseTicketVoList": [],
                        "priceProgramName": this.pricePlan.priceProgramName,
                        "priceProgramUid": this.pricePlan.priceProgramUid,
                        "showNoInHall": plan.showNoInHall,
                        "planShowInterval": plan.planShowInterval
                        }
                        return plan.joinFlag ? plan.newJoinFlag ? Object.assign(item, {
                            planTimeVoList: [
                                {
                                    percentPrice: 100,
                                    showIndex: 1,
                                    movieCode: plan.movieCode,
                                    movieDescLanguage: plan.language,
                                    minPrice: plan.minPrice != undefined ? plan.minPrice : 0,	
                                    rate: plan.rate != undefined ? plan.rate : 0,
                                    planTimeStart: plan.startTime.hours < 6 ? `${this.formatDateTime(new Date(this.baseParam.planDate).getTime() + 24 * 60 * 60 * 1000)} ${plan.startTime.hours}:${plan.startTime.minute}` : `${this.baseParam.planDate} ${plan.startTime.hours}:${plan.startTime.minute}`,
                                    planTimeEnd: plan.endTime.hours < 6 ? `${this.formatDateTime(new Date(this.baseParam.planDate).getTime() + 24 * 60 * 60 * 1000)} ${plan.endTime.hours}:${plan.endTime.minute}` : `${this.baseParam.planDate} ${plan.endTime.hours}:${plan.endTime.minute}`
                                }
                            ],
                            intervalMinute: plan.intervalMinute,
                            joinMovieName: plan.movieName
                        }) : Object.assign(item, {
                            planTimeVoList: plan.planTimeVoList,
                            intervalMinute: plan.intervalMinute,
                            joinMovieName: plan.joinMovieName
                        }) : item
                    }))
            })
            // 处理 没有可以提交保存的 数据 的情况
            if (!subData.length) {
                if (!cb) {
                    return this.warning('暂时没有可以保存的场次')
                } else {
                    if (cb == true) {
                        return this.goToPlanDetail(type)
                    } else {
                        cb()
                        return
                    }
                }
            }

            let _data = {
                list: subData
            }

            saveMoviePlan(_data).then(res => {
                if (res.code != 200) return this.error(res.msg)
                if (res.data.length) {
                    this.plan_rooms.forEach(plan => {
                        plan.forEach(cPlan => {
                            res.data.some(item => {
                                if (item.hallUid == cPlan.hallUid && `${cPlan.startTime.hours}:${cPlan.startTime.minute}` == item.planTimeStart.split(' ')[1]) {
                                    cPlan.saveError = true
                                    return true
                                }
                            })
                        })
                        
                    })
                    this.warning('部分排片保存不成功, 请单独选择价格方案')
                    return
                }
                // 重置校验用户是否需要保存操作
                this.resetSaveFlage()
                if (!cb) {
                    this.success('排片保存成功！')
                    this.$emit('initMoivePlan', {
                            type: type ? type : null
                        })
                } else {
                    // 刷新当前排片数据
                    if (cb === true) {
                        this.$emit('initMoivePlan', {
                            type: type ? type : null,
                            curPlan: this.curPlan
                        })
                    } else {
                        cb && cb()
                    }
                }
            })
        },
        changePlanIndexInterval() {
            this.plan_rooms.forEach((row, rowIndex) => {
                row.forEach((plan, planIndex) => {
                    plan.planShowInterval = planIndex ? this.calcPlanTimeInterval(row[planIndex - 1], plan) : 0
                    plan.showNoInHall = planIndex + 1
                })
            })
        },
        /* 控制器 根据选中影片设置状态 */
        controlManage(movie) {
            let roomHeight = this.contentSize.roomItemHeight,
                itemHeight = this.movieItemHeight

            let bottom = this.plan_rooms.length * roomHeight,
                top = 0,
                left = 0,
                right = this.maxTime

            let min_positionX = movie.positionX,
                max_positionX = min_positionX + movie.timeLong,
                min_positionY = movie.positionY,
                max_positionY = min_positionY + this.movieItemHeight

            let r_l_control_width = this.control.r_l_width,
                r_l_control_height = this.control.r_l_height,
                t_b_control_width = this.control.t_b_width,
                t_b_control_height = this.control.t_b_height

            let type = 'bottom';
            let c_positionY, c_positionX
            c_positionX = min_positionX
            c_positionY = max_positionY
            // if (bottom == roomHeight) {
            //     // 只有一行数据
            //     if (max_positionY + r_l_control_width > right) {
            //         type = 'left'
            //         c_positionX = min_positionY - r_l_control_width
            //     } else {
            //         type = 'right'
            //         c_positionX = max_positionX
            //     }
            //     c_positionY = max_positionY - (max_positionY - min_positionY) / 2 - r_l_control_height / 2 + (roomHeight - itemHeight) / 2
            // } else {
            //     // 多行数据
            //     if (max_positionY + t_b_control_height > bottom) {
            //         type = 'top'
            //         c_positionY = min_positionY - t_b_control_height
            //     } else {
            //         type = 'bottom'
            //         c_positionY = max_positionY
            //     }
            //     c_positionX = min_positionX
            // }

            let controlItemArr = this.controlItem(movie)

            this.control.controlItem = controlItemArr
            this.control.config = {
                type,
                isShow: true,
                positionX: c_positionX,
                positionY: c_positionY
            }
            this.control.movie = movie
        },
        /* 设置控制器可操作类型 */
        controlItem(movie) {
             let controlObj = {
                    'edit': {
                        text: '编辑',
                        controlFn: 'editionMovie'
                    },
                    'copy': {
                        text: '复制',
                        controlFn: 'copyMoive'
                    },
                    'delete': {
                        text: '删除',
                        controlFn: 'deletSinglePlan'
                    },
                    'continuityPlan': {
                        text: '连场',
                        controlFn: 'continuityPlan'
                    },
                    'selectSameMoive': {
                        text: '选中同影片',
                        controlFn: 'selectSameMoive'
                    },
                    'checkMovie': {
                        text: '查看',
                        controlFn: 'viewMoive'
                    },
                    'stopSale': {
                        text: '停售',
                        controlFn: 'stopSale',
                    },
                    'startSale': {
                        text: '开售',
                        controlFn: 'startSale',
                    },
                    'importPlan': {
                        text: '单独导入价格方案',
                        controlFn: 'importPlanForSingle'
                     }
                }
            let setControlArr = [], approveStatus = movie.approveStatus ? movie.approveStatus : '', saleStatus = movie.saleStatus ? movie.saleStatus : ''
            if (this.mode) {
                if (approveStatus == 'NOT_APPROVE' || approveStatus == '' || approveStatus == 'REJECT') {
                    // 未审核 或 新建
                    setControlArr = !movie.joinFlag ? ['edit', 'copy', 'delete', 'continuityPlan', 'selectSameMoive'] : ['edit', 'copy', 'delete', 'selectSameMoive']
                } else if (approveStatus == 'WAIT_APPROVE') {
                    // 审核中
                    setControlArr = ['checkMovie', 'copy']
                } else if (approveStatus == 'APPROVED') {
                    // 已审核
                    if (saleStatus == 'SALE') {
                        // 在销售
                        let startTime = movie.startTime.hours < 6 ? `${this.formatDateTime(new Date(this.baseParam.planDate).getTime() + 24 * 60 * 60 * 1000)} ${movie.startTime.hours}:${movie.startTime.minute}` : `${this.baseParam.planDate} ${movie.startTime.hours}:${movie.startTime.minute}`
                        setControlArr = new Date(startTime).getTime() <= new Date().getTime() ? ['checkMovie', 'copy', 'selectSameMoive'] : ['checkMovie', 'copy', 'stopSale', 'selectSameMoive']
                    } else if (saleStatus == 'STOP') {
                        // 停售
                        let startTime = movie.startTime.hours < 6 ? `${this.formatDateTime(new Date(this.baseParam.planDate).getTime() + 24 * 60 * 60 * 1000)} ${movie.startTime.hours}:${movie.startTime.minute}` : `${this.baseParam.planDate} ${movie.startTime.hours}:${movie.startTime.minute}`
                        setControlArr = new Date(startTime).getTime() <= new Date().getTime() ? ['copy', 'startSale', 'selectSameMoive'] : ['edit', 'copy', 'delete', 'startSale', 'selectSameMoive']
                    } else if (saleStatus == 'NOT_SALE') {
                        setControlArr = ['copy', 'startSale', 'selectSameMoive']
                    }
                } 
            } else {
                setControlArr = ['checkMovie']
            }
            if (movie.saveError) {
                setControlArr.push('importPlan')
            }
            let controlItemArr = []
            for (let i = 0; i < setControlArr.length; i++) {
                controlItemArr.push(controlObj[setControlArr[i]])
            }
            return controlItemArr
        },
        /* 控制器 - 事件分发 */
        controlEmit(type) {
            this[`${type}`]();
        },
        /* 隐藏控制器 */
        hideControl() {
            this.control.config = {
                type: '',
                isShow: false,
                positionX: 0,
                positionY: 0
            }
        },
        /* 控制器 - 删除单个排期影片 */
        deletSinglePlan(e) {
            let movie = JSON.parse(JSON.stringify(this.control.movie))
            let r_index = movie.rowIndex,
                i_index = movie.itemIndex;
            let plan_rooms = JSON.parse(JSON.stringify(this.plan_rooms))
            if (movie.originFlag) {
                // 远端存在排片数据
                let param = {
                    list: [`${movie.planUid}`]
                };
                deletePlan(param).then(res => {
                    if (res.code == 200) {
                        plan_rooms[r_index].splice(i_index, 1);
                        this.plan_rooms = this.resetItemIndex(plan_rooms)
                        this.control.movie = null
                        this.success('删除成功！')
                    } else {
                        this.error(res.msg)
                    }
                })
            } else {
                plan_rooms[r_index].splice(i_index, 1)
                this.plan_rooms = this.resetItemIndex(plan_rooms)
                this.control.movie = null
            }

        },
        /* 删除所选排期影片 */
        deleteSelectPlan(e) {
            if (this.plan_rooms.every(row => row.every(plan => !plan.isSelect))) {
                return this.warning('请至少选中一个需要删除的排片!')
            }
            let planArray = JSON.parse(JSON.stringify(this.plan_rooms))
            // 找出需要删除远端排片
            let param = {
                list: []
            }
            let newPlanArray = planArray.map(item => [])
            let hasDelete = false
            let cantDelete = false

            planArray.forEach((row, rowIndex) => {
                row.forEach(plan => {
                    let deleteStatus = !plan.planStatus || plan.planStatus == 'NEW'
                    if (plan.isSelect && deleteStatus) {
                        hasDelete = true
                        if (plan.originFlag) {
                            param.list.push(plan.planUid)
                        }
                    } else {
                        newPlanArray[rowIndex].push(plan)
                    }
                    cantDelete = cantDelete ? cantDelete : !deleteStatus && plan.isSelect
                })
            })
            
            if (param.list.length) {
                deletePlan(param).then(res => {
                    if (res.code == 200) {
                        this.plan_rooms = this.resetItemIndex(newPlanArray)
                        if (cantDelete) {
                            this.warning('当前所选场次存在可售或未完全退票，部分不可删除')
                        } else {
                            this.success('删除成功！')
                        }
                    } else {
                        this.error(res.msg)
                    }
                })
            } else if (hasDelete) {
                this.plan_rooms = this.resetItemIndex(newPlanArray)
                this.success('删除成功！')
            
            } else if (!hasDelete && cantDelete) {
                this.warning('当前所选场次存在可售或未完全退票，部分不可删除')
            }

            
            // 隐藏控制器
            this.hideControl()
        },
        /* 删除排片 重置itemIndex */
        resetItemIndex(planArray) {
            for (let i = 0; i < planArray.length; i++) {
                let c_planArray = planArray[i]
                for (let j = 0; j < c_planArray.length; j++) {
                    c_planArray[j].itemIndex = j
                }
            }
            return planArray
        },
        /* 控制器 - 编辑影片 */
        editionMovie(type) {
            let _type = type ? type : 'edit'
            let rowData = JSON.parse(JSON.stringify(this.plan_rooms[`${Number(this.control.movie.rowIndex)}`]))
            rowData.forEach(item => {
                item.showTimeStart = item.startTime.hours < 6 ? `${this.formatDateTime(new Date (this.baseParam.planDate).getTime() + 24 * 60 * 60 * 1000)} ${item.startTime.hours}:${item.startTime.minute}` : `${this.baseParam.planDate} ${item.startTime.hours}:${item.startTime.minute}`
                item.showTimeEnd = item.endTime.hours < 6 ? `${this.formatDateTime(new Date (this.baseParam.planDate).getTime() + 24 * 60 * 60 * 1000)} ${item.endTime.hours}:${item.endTime.minute}` : `${this.baseParam.planDate} ${item.endTime.hours}:${item.endTime.minute}`
            })
            let currentRow = rowData.filter(item => !(item.hallUid == this.curPlan.hallUid && item.positionX == this.curPlan.positionX))
            if (this.userNeedSave && this.mode) {
                this.savePlan(_type, true)
                return 
            } else {
                this.goToPlanDetail(_type)
            }
            
            
        },
        goToPlanDetail(type) {
            let uid = '', joinFlag = 0
            if (this.curPlan.planUid) {
                uid = this.curPlan.planUid
                joinFlag = this.curPlan.joinFlag
            } else {
                this.plan_rooms.reduce((data, row) => {
                    return data.concat(row)
                }, []).some(item => {
                    if (item.hallUid == this.curPlan.hallUid && item.positionX == this.curPlan.positionX) {
                        uid = item.planUid
                        joinFlag = item.joinFlag
                        return true
                    }
                })
            }
            
            let path = type == 'continuityPlan' ? `consecutivePlan?mode=edit&uid=${uid}` : joinFlag ? `consecutivePlan?mode=${type}&uid=${uid}` : `detail?mode=${type}&uid=${uid}`
            path += `&referer=${encodeURIComponent('/ticket/moviePlan/layout?date=' + this.baseParam.planDate)}`
            this.$router.push({
                    path
            })
            
        },
        /* 控制器 - 查看影片*/
        viewMoive() {
            this.editionMovie('view')
        },
        /* 控制器 - 连场 */
        continuityPlan() {
            let plan_rooms = JSON.parse(JSON.stringify(this.plan_rooms))
            plan_rooms.forEach(row => {
                row.forEach(plan => {
                    if (plan.hallUid == this.curPlan.hallUid && plan.positionX == this.curPlan.positionX) {
                        
                        plan.joinFlag = 1
                        this.userNeedSave = true
                        // plan.originFlag = 
                        plan.newJoinFlag = true
                        return true
                    }
                })        
            })
            this.plan_rooms = plan_rooms
            this.editionMovie('continuityPlan')
        },
        /* 控制器 - 停售 */
        stopSale() {
            this.stopOrStartSale('stop')
        },
        /* 控制器 - 开售 */
        startSale() {
            this.stopOrStartSale('open')
        },
        /* 控制器 - 选中同影片 */
        selectSameMoive() {
            let movie = JSON.parse(JSON.stringify(this.control.movie))
            let planArray = JSON.parse(JSON.stringify(this.plan_rooms))

            let drop_data = []
            // 选中movieCode相同的电影
            let movieCodeFlage = movie.movieCode;
            for (let i = 0; i < planArray.length; i++) {
                for (let j = 0; j < planArray[i].length; j++) {
                    let c_d = planArray[i][j]
                    if (c_d.movieCode == movieCodeFlage) {
                        c_d.isSelect = true
                        let movieItem = JSON.parse(JSON.stringify(c_d))
                        movieItem.rowIndex = i
                        movieItem.itemIndex = j
                        movieItem.positionY = this.innerPoistionY(i)
                        // 校验是否可拖拽
                        let dropStatus = this.planDropStatus(c_d.planStatus)
                        if (dropStatus) {
                            drop_data.push(movieItem)
                        }
                    }
                }
            }
            this.plan_rooms = planArray
            this.drop_data = drop_data

        },
        /* 控制器 - 复制影片 */
        copyMoive() {
            let movie = JSON.parse(JSON.stringify(this.control.movie))
            this.copyConfig = {
                id: movie.planUid ? movie.planUid : '',
                copyFlag: !!movie.planUid
            }
            
            let deleteArr = ['planUid', 'startTime', 'endTime', 'positionX', 'positionY', 'rowIndex', 'itemIndex', 'originFlag', 'planStatus', 'plan_text', 'saleStatus', 'sale_text', 'approveStatus', 'approve_text', 'hallCode', 'hallName', 'hallUid', 'saveError', 'sameTimeTip', 'isSelect']
            for (let i = 0; i < deleteArr.length; i++) {
                delete movie[`${deleteArr[i]}`]
            }
            this.$emit('copyMovie', {
                isSelect: true,
                selectMoive: movie
            })
        },
        importPlanForSingle () {
            // console.log(11)
        },
        /* 重置校验用户保存操作 */
        resetSaveFlage() {
            this.origin_data = null
            this.userNeedSave = false
        },
        /* 提交审核 */
        submitReview(noCheck) {
            if (!noCheck) {
                this.checkAllowApprove()
            }
            if (!this.allowApprove) return
            let userNeedSave = this.userNeedSave
            if (userNeedSave) {
                this.savePlan(null, this.subApproves)
            } else {
                this.subApproves()
            }
            
        },
        // 提交审批 api
        subApproves() {
            this.control.config.isShow = false
            let param = {
                planDate: this.baseParam.planDate,
                uidCinema: this.baseParam.uidCinema
            }
            subApproves(param).then(res => {
                if (res.code == 200) {

                    if (res.data && res.data.length) {
                        this.approveErrorData = res.data
                    }

                    // 刷新当前排片数据
                    this.$emit('initMoivePlan', {
                        type: null
                    })
                    if (!res.data.length) {
                        this.success('提交审批成功')
                    }
                } else {
                    this.error(res.msg)
                }
            })
        },
        /* 清除空重排 - 只能清空新建状态的排片 */
        planClean() {
            let planArray = JSON.parse(JSON.stringify(this.plan_rooms))
            let newPlanArray = planArray.map(item => [])
            // 是否存在不可删除项 提醒用户
            let cantDelete = false
            // 远端要删除的数组
            let param = {
                list: []
            }
            let hasDelete = false

            planArray.forEach((row, rowIndex) => {
                row.forEach(plan => {
                    let deleteStatus = !plan.planStatus || plan.planStatus == 'NEW'
                    if (!deleteStatus) {
                        newPlanArray[rowIndex].push(plan)
                        cantDelete = true
                    } else if (plan.originFlag) {
                        param.list.push(plan.planUid)
                    }
                    if (deleteStatus) {
                        hasDelete = true
                    }
                })
            })


            if (param.list.length) {
                deletePlan(param).then(res => {
                    if (res.code == 200) {
                        this.plan_rooms = this.resetItemIndex(newPlanArray)
                        if (cantDelete) {
                            // 提示用户存在不可删除项
                            this.warning('当前所选场次存在可售或未完全退票，不可删除');
                        } else {
                            this.success('重排成功！')
                        }
                    } else {
                        this.error(res.msg)
                    }
                })
            } else if (hasDelete) {
                this.plan_rooms = this.resetItemIndex(newPlanArray)
                this.success('重排成功！')
            } else if (!hasDelete && cantDelete) {
                this.warning('当前所选场次存在可售或未完全退票，部分不可删除')
            }

            
        },
        /* 停售/开售 */
        stopOrStartSale(saleStatus, isMore) {
            let planArray = JSON.parse(JSON.stringify(this.plan_rooms))
            let param = {
                cinemaUid: this.baseParam.uidCinema,
                saleStatus,
                planUids: []
            }
            if (isMore) {
                // 多选
                for (let i = 0; i < planArray.length; i++) {
                    for (let j = 0; j < planArray[i].length; j++) {
                        let c_d = planArray[i][j]
                        if (c_d.planUid && c_d.approveStatus == 'APPROVED') {
                            if (c_d.isSelect) {
                                let flagStatus
                                if (saleStatus == 'stop') {
                                    flagStatus = this.planStopStatus(c_d.planStatus, c_d.saleStatus)
                                } else {
                                    flagStatus = this.planPlayStatus(c_d.saleStatus)
                                }
                                if (flagStatus) {
                                    param.planUids.push(c_d.planUid)
                                }
                            }
                        }
                    }
                }
            } else {
                let movie = JSON.parse(JSON.stringify(this.control.movie))
                let flagStatus
                if (saleStatus == 'stop') {
                    flagStatus = this.planStopStatus(movie.planStatus, movie.saleStatus)
                } else {
                    flagStatus = this.planPlayStatus(movie.saleStatus)
                }
                if (flagStatus) {
                    param.planUids.push(movie.planUid)
                }
            }
            if (param.planUids.length != 0) {
                saleOpenStop(param).then(res => {
                    if (res.code != 200) return this.error(res.msg)
                    let tips = saleStatus == 'stop' ? '停售' : '开售'
                    this.$emit('initMoivePlan')
                    this.success(`${tips}操作成功！`)
                })
            } else {
                this.warning('请至少选中一个排片计划')
            }
        },
        /* 暂停销售 */
        planStop() {
            this.stopOrStartSale('stop', true)
        },
        /* 恢复销售 */
        planOpen() {
            this.stopOrStartSale('open', true)
        },
        /* 校验 - 当前场次是否为可删除状态 */
        planDeleteStatus(status) {
            let deleteStatus = false
            if (status == 'NEW' || !status) {
                deleteStatus = true
            }
            return deleteStatus;
        },
        /* 校验 - 当前场次是否为可拖作状态 */
        planDropStatus(status) {
            let statusFlage = status == 'NEW' || !status
            return statusFlage
        },
        /* 校验 - 场次是否可停售 */
        planStopStatus(planStatus, saleStatus) {
            let status = false
            if (planStatus == 'VALID' && saleStatus == 'SALE') {
                status = true
            }
            return status
        },
        /* 校验 - 场次是否为可销售 */
        planPlayStatus(saleStatus) {
            let status = false
            if (saleStatus == 'STOP') {
                status = true
            }
            return status
        },
        /* 校验 - 场次是否有留座 */
        planHaveKeep() {

        },
        /* 审核通过 / 驳回 */
        approvePassPlan(type) {
            let planArray = JSON.parse(JSON.stringify(this.plan_rooms))
            let planUids = []
            // 用户是否选中
            let isHasSelect = false
            // 提示信息 是否存在不可修改
            let isHasSuccess = false
            let isHasError = false
            let successTips = `部分场次可${type == 'pass' ? '通过' : '驳回'}已执行操作`
            let errorTips = `存在部分场次${type == 'pass' ? '通过' : '驳回'}不可操作`

            for (let i = 0; i < planArray.length; i++) {
                for (let j = 0; j < planArray[i].length; j++) {
                    let c_d = planArray[i][j]
                    if (c_d.isSelect && c_d.approveStatus == 'WAIT_APPROVE') {
                        planUids.push(c_d.uid)
                        if (!isHasSuccess) {
                            isHasSuccess = true
                        }
                    }
                    if (!isHasError && c_d.isSelect && c_d.approveStatus == 'APPROVED') {
                        isHasError = true
                    }
                    if (!isHasSelect && c_d.isSelect) {
                        isHasSelect = true
                    }
                }
            }

            let tips = ``
            if (isHasSuccess && isHasError) {
                tips = successTips + `,` + errorTips
            } else if (isHasSuccess) {
                tips = successTips
            } else {
                tips = errorTips
            }

            if (isHasSelect) {
                if (planUids.length != 0) {
                    let param = {
                        actionType: type,
                        cinemaUid: this.baseParam.cinemaUid,
                        planUids
                    }
                    approvePassPlan(param).then(res => {
                        if (res.code != 200) this.error(res.msg)
                        // 刷新页面
                        this.$emit('initMoivePlan', {
                            type: null
                        })
                        this.success(tips)
                    })
                } else {
                    this.error(tips)
                }
            } else {
                this.warning(`请选中后再进行${type == 'pass' ? '通过' : '驳回'}操作`)
            }
        },
        // 计算排片间隔
        calcPlanTimeInterval(prevData, nextData) {
            let prevTime = prevData.endTime.hours < 6 
                ? `${this.formatDateTime(new Date(this.baseParam.planDate).getTime() + 24 * 60 * 60 * 1000)} ${prevData.endTime.hours}:${prevData.endTime.minute}` 
                : `${this.baseParam.planDate} ${prevData.endTime.hours}:${prevData.endTime.minute}`

            
            let nextTime = nextData.startTime.hours < 6 
                ? `${this.formatDateTime(new Date(this.baseParam.planDate).getTime() + 24 * 60 * 60 * 1000)} ${nextData.startTime.hours}:${nextData.startTime.minute}` 
                : `${this.baseParam.planDate} ${nextData.startTime.hours}:${nextData.startTime.minute}`

            return (new Date(nextTime).getTime() - new Date(prevTime).getTime()) / 1000 / 60
        },
        approveErrorCb() {
            this.$nextTick(() => {
                this.approveErrorDialog = true
                // let plan_rooms = JSON.parse(JSON.stringify(this.plan_rooms))
                // plan_rooms.forEach(row => {
                //     row.forEach(plan => {
                //         plan.isSelect = false
                //     })
                // })
                // plan_rooms.forEach(row => {
                //     row.forEach(plan => {
                //         this.approveErrorData.forEach(item => {
                //             if (item == plan.planUid) {
                //                 plan.isSelect = true
                //             }
                //         })
                //     })
                // })
                // this.plan_rooms = plan_rooms
                // this.approveErrorData = null
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
        // 继续提交审批
        continueApprove() {
            this.allowApprove = true
            this.submitReview(true)
            this.planAdviceDialog = false
        },
        // 校验是否允许审批
        checkAllowApprove() {
            let adviceData = this.adviceData.filter(item => item.isAdvice)
            if (adviceData.some(item => item.isNumErr || item.isPerErr)) {
                this.allowApprove = false
                this.adviceTipType = adviceData.some(item => item.guideType == 1 && (item.isNumErr || item.isPerErr))
                this.planAdviceRejectData = adviceData.filter(item => item.isNumErr || item.isPerErr)
                this.planAdviceDialog = true
            } else {
                this.allowApprove = true
            }
        },
        tableRowClassName({row, rowIndex}) {
            return row.guideType == 1 ? 'force-row' : ''
        },
        changeAllowApprove() {
            let adviceData = this.adviceData.filter(item => item.isAdvice)
            this.allowApprove = !adviceData.some(item => item.isNumErr || item.isPerErr)
            
        },
        // 校验 是否在 上下映时间内
        checkTimeRight(time, movie) {
            let planStartTime = time.startTime.hours < 6 ? `${this.formatDateTime(new Date(this.baseParam.planDate).getTime() + 24 * 60 * 60 * 1000)} ${time.startTime.hours}:${time.startTime.minute}` : `${this.baseParam.planDate} ${time.startTime.hours}:${time.startTime.minute}`
            let planTimeEnd = time.endTime.hours < 6 ? `${this.formatDateTime(new Date(this.baseParam.planDate).getTime() + 24 * 60 * 60 * 1000)} ${time.endTime.hours}:${time.endTime.minute}` : `${this.baseParam.planDate} ${time.endTime.hours}:${time.endTime.minute}`
            if (movie.joinFlag == 1) {
                // 计算各影片开始结束时间 需要接口提供 timelong movieName等
            } else {
                return {
                    planError: new Date (planStartTime).getTime() >= new Date(movie.dateShowOff).getTime() || new Date(planStartTime).getTime() < new Date(movie.dateShowFirst).getTime(),
                    errorType: new Date (planStartTime).getTime() >= new Date(movie.dateShowOff).getTime() ? '超过影片下线日期，不能编排放映计划' : new Date(planStartTime).getTime() < new Date(movie.dateShowFirst).getTime() ? '未到影片首映日期，不能编排放映计划' : ''
                }
            }
            
        }
    }
}
</script>

<style lang="scss" scoped>


.movie-plan-window {
    // max-height: calc(100% - 30px) !important;
    // min-height: 600px;
    // min-width: 915px;
    overflow-y: scroll;
    overflow-x: scroll;
    position: relative;
    box-shadow: inset 2px 2px 15px 0px rgba(0, 0, 0, 0.13);

    .content {
        // margin-left: 30px;
        position: relative;
        .row_content:nth-of-type(2n-1) {
            background: rgb(248, 248, 248);
        }

        .row_content {
            ul {
                height: 100%;
                position: relative;
                justify-content: unset;

                .filmItem {
                    position: absolute;
                    background: white;
                    box-sizing: border-box;

                    // .film-header {
                    //     height: 3px;
                    // }

                    .film-content {
                        height: 66px;
                        box-sizing: border-box;
                        justify-content: center;
                        align-items: flex-start;
                        flex-direction: column;

                        div {
                            width: 100%;
                            box-sizing: border-box;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            font-size: 12px;
                            padding: 0 10px;
                        }

                        div:nth-of-type(1) {
                            font-weight: bold;
                        }

                        div:nth-of-type(2) {
                            color: #666666;
                            margin-top: 3px;
                            margin-bottom: 3px;
                        }

                        div:nth-of-type(3) {
                            font-family: ArialMT;
                            color: #808080;
                        }
                    }

                    .triangle-absolute {
                        bottom: 0;
                        right: 0;
                    }
                }

                // .isSelect {
                //     // box-shadow: 0px 0px 0px 2px #3B74FF;

                //     // .film-header {
                //     //     background: #3B74FF !important;
                //     // }

                //     // .film-content {
                //     //     background: #3B74FF !important;

                //     //     div {
                //     //         color: white !important;
                //     //     }
                //     // }
                // }
            }
        }
    }

    .time-line {
        width: 1px;
        background: #333333;
        box-shadow: 0px 0px 0.5px #333333;
        position: absolute;
        top: 0;

        .clock-info {
            width: 70px;
            padding: 3px;
            text-align: center;
            position: absolute;
            font-size: 12px;
            color: white;
            background: #333333;
            border-radius: 2px;
            z-index: 99;
        }

        .select-movie-content {
            position: absolute;

            .movie-item {
                position: absolute;
                background: white;
                margin-left: 1px;

                .movie-header {
                    height: 3px;
                }

                .movie-content {
                    height: 66px;
                    justify-content: center;
                    align-items: flex-start;
                    flex-direction: column;

                    div {
                        width: 100%;
                        box-sizing: border-box;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        font-size: 12px;
                        padding: 0 10px;
                    }

                    div:nth-of-type(1) {
                        font-weight: bold;
                    }

                    div:nth-of-type(2) {
                        color: #666666;
                        margin-top: 3px;
                        margin-bottom: 3px;
                    }

                    div:nth-of-type(3) {
                        font-family: ArialMT;
                        color: #808080;
                    }
                }
            }
        }
    }

    // 过去时间
    .pass-time {
        position: absolute;
        top: 0;
        background: rgba(3, 3, 3, 0.174);
        z-index: 999;
        pointer-events: none;
    }

    // 拖拽模板
    .drop-film {
        position: absolute;
        top: 0;

        ul {
            .drop-item {
                // height: 64px;
                position: absolute;
                background: white;

                .drop-header {
                    height: 3px;
                }

                .drop-content {
                    height: 66px;
                    box-sizing: border-box;
                    justify-content: center;
                    align-items: flex-start;
                    flex-direction: column;

                    div {
                        width: 100%;
                        box-sizing: border-box;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        font-size: 12px;
                        padding: 0 10px;
                    }

                    div:nth-of-type(1) {
                        font-weight: bold;
                    }

                    div:nth-of-type(2) {
                        color: #666666;
                        margin-top: 3px;
                        margin-bottom: 3px;
                    }

                    div:nth-of-type(3) {
                        font-family: ArialMT;
                        color: #808080;
                    }
                }
            }
        }

        .time-line {
            width: 1px;
            background: #333333;
            box-shadow: 0px 0px 0.5px #333333;
            position: absolute;
            top: 0;

            .clock-info {
                width: 70px;
                padding: 3px;
                text-align: center;
                margin-bottom: 25px;
                position: absolute;
                font-size: 12px;
                color: white;
                background: #333333;
                border-radius: 2px;
            }
        }
    }

    // 矩形
    .draw-block {
        position: absolute;
        background: rgba(0, 0, 0, 0.3);
        // margin-left: 30px;
    }
    
    // 控制器
    .item-controls {
        position: absolute;
        div {
            border-color: transparent transparent #ffffff;
            width: 0;
            height: 0;
            border-style: solid;
        }

        .top {
            border-width: 0px 5px 7px 5px;
            margin-left: 18px;
        }

        .left {
            border-width: 0px 5px 7px 5px;
            transform-origin: center;
            transform: rotateZ(-90deg);
            position: absolute;
            left: -9px;
        }

        .right {
            border-width: 0px 5px 7px 5px;
            transform-origin: center;
            transform: rotateZ(90deg);
            position: absolute;
            right: -9px;
        }

        .bottom {
            border-width: 0px 5px 7px 5px;
            transform-origin: center;
            transform: rotateZ(180deg);
            margin-left: 18px;
        }

        ul {
            background: #FFFFFF;
            box-shadow: 0 1px 4px 0 rgba(102, 102, 102, 0.29);
            border-radius: 4px;
            position: relative;

            li {
                height: 32px;
                font-size: 12px;
                color: #3B74FF;
                line-height: 32px;
                margin-left: 16px;
                cursor: pointer;
                white-space: nowrap;
            }

            li:nth-last-of-type(1) {
                margin-right: 16px;
            }

            li:hover {
                color: blue;
            }
        }
    }
    
}

</style>
