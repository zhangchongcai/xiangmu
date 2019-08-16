<template>
<section class="movie-plan-window" @scroll="scroll" :style="{height: 'calc(100% - 30px)'}" ref="moviePlanWindow" @mousemove="changeTimeLine">
    <div class="content" :style="{width:contentSize.width+'px', height: contentSize.height +'px'}" ref="content">
        <!-- 过去时间：灰色 -->
        <div class="pass-time" :style="{height: contentSize.height +'px', width: pass_time.width + 'px'}"></div>
        <!-- 排片内容 -->
        <ul>
            <li class="row_content" v-for="(item,index) in plan_rooms" :key="index" :style="{height: contentSize.roomItemHeight + 'px'}" :data-item="index">
                <ul class="flex-base">
                        <el-tooltip placement="right" :disabled="isDropShow || selectMovieData.isSelect || selectMovieData.isShow" v-for="(filmItem,filmItem_index) in item" :key="filmItem_index" :manual="block.click" :enterable="!block.click" :open-delay="400" :hide-after="100">
                        <div slot="content" class="tool-tips">
                            <div>{{filmItem.movieName}}（{{filmItem.disversion}}/{{filmItem.language}}）{{filmItem.timeLong}}分钟</div>
                            <div>{{filmItem.startTime.hours+':'+filmItem.startTime.minute + '-' + filmItem.endTime.hours + ':' + filmItem.endTime.minute}}</div>
                            <div v-if="filmItem.originFlag">
                                <div>审批状态：<span class="font-bold">{{filmItem.approve_text}}</span></div>
                                <div>放映计划状态：<span class="font-bold">{{filmItem.plan_text}}</span></div>
                                <div>销售状态：<span class="font-bold">{{filmItem.sale_text}}</span></div>
                                <div><span class="mr30">人次：{{filmItem.privateSaleSeatCount ? filmItem.privateSaleSeatCount : 0}}人</span> <span class="mr30"> 票房：0元</span> <span class="mr30">上座率：{{filmItem.seatPrecent}}%</span></div>
                            </div>
                        </div>
                        <li class="filmItem" :style="{width: filmItem.timeLong + 'px', left: filmItem.positionX + 'px'}" :class="{isSelect: filmItem.isSelect, error: filmItem.saveError}" @mousedown="filmMouseDown" @mousemove="filmMouseMove" @mouseup="filmMouseUp" :data-row="index" :data-item="filmItem_index" :data-planstatus="filmItem.planStatus">
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
            <div class="time-line" v-if="drop_clock.isShow" :style="{left: drop_clock.positionX + 'px', height: contentSize.height+'px'}">
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
        :visible="dialogVisible"
        width="30%">
        <span>放映时间设置无效，请重新指定</span>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
</section>
</template>

<script>
export default {
    props: {
        // pricePlan: {
        //     type: Object,
        //     required: true
        // },
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
        pageControlType: {
            type: Boolean
        },
        mode: {
            type: Number,
            default: 1
        },
    },
    data() {
        return {
            scrollY: "",
            scrollX: "",
            // content距离边框距离
            margin_left: 0,
            movieItemHeight: 64,
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
            dialogVisible: false
        };
    },
    created() {
        let that = this
        window.onkeydown = e => {
            // 选中全部
            if (e.keyCode == 65 && e.ctrlKey) {
                this.selectAllRooms(true)
            }
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

                    let positionX = this.$options.methods.position(s_time[0]) + Number(s_time[1]);

                    // 上座率
                    // let privateSaleSeatCount = Number(c_d[j].privateSaleSeatCount);
                    // let seatnum = Number(c_d[j].seatnum)
                    // let seatPrecent;
                    // if (privateSaleSeatCount != 0 && seatnum != 0) {
                    //     seatPrecent = (privateSaleSeatCount / seatnum) * 100
                    // } else {
                    //     seatPrecent = 0
                    // }

                    // 审批状态
                    let approveStatus = c_d[j].approveStatus
                    let approve_text
                    if (approveStatus == 'NOT_APPROVE') {
                        approve_text = '未审批'
                    } else if (approveStatus == 'WAIT_APPROVE') {
                        approve_text = '待审批'
                    } else if (approveStatus == 'APPROVED') {
                        approve_text = '已审批'
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
                    let positionY = this.innerPostionY(this, i)
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
            this.plan_rooms = _data

            // 初始化排片指导
            this.$emit('initPlanAdvice', _data.reduce((arr, item) => {
                return arr.concat(item)
            }, []))
        },
        plan_rooms: {
            handler(data, old_data) {
                // 校验是否修改过数据 用于判断是否需要用户进行保存操作
                let originFlag = JSON.parse(JSON.stringify(this.origin_data));
                if (!originFlag) {
                    this.origin_data = JSON.parse(JSON.stringify(data));
                }

                let old_flage = JSON.parse(JSON.stringify(this.origin_data));
                let new_flage = JSON.parse(JSON.stringify(data));

                for (let i = 0; i < old_flage.length; i++) {
                    for (let j = 0; j < old_flage[i].length; j++) {
                        delete old_flage[i][j].isSelect;
                    }
                }

                for (let i = 0; i < new_flage.length; i++) {
                    for (let j = 0; j < new_flage[i].length; j++) {
                        delete new_flage[i][j].isSelect;
                    }
                }
                if (JSON.stringify(new_flage) !== JSON.stringify(old_flage)) {
                    this.userNeedSave = true;
                } else {
                    this.userNeedSave = false;
                }

                // 实时修改
                let _data = JSON.parse(JSON.stringify(data));
                let mindObj = {};
                let allPlanMovieNum = 0;
                for (let i = 0; i < _data.length; i++) {
                    let c_d = _data[i];
                    for (let j = 0; j < c_d.length; j++) {
                        let cc_d = c_d[j];
                        if (!mindObj[`${cc_d.movieCode}`]) {
                            mindObj[`${cc_d.movieCode}`] = {
                                color: cc_d.color,
                                movieName: cc_d.movieName,
                                planNum: 1
                            }
                        } else {
                            mindObj[`${cc_d.movieCode}`].planNum++;
                        }
                        allPlanMovieNum++;
                    }
                }
                let mindArr = [];
                let mindFlagArr = Object.keys(mindObj);
                for (let i = 0; i < mindFlagArr.length; i++) {
                    let c_obj = mindObj[`${mindFlagArr[i]}`];
                    c_obj.planPercent = ((c_obj.planNum / allPlanMovieNum) * 100).toFixed(2);
                    mindArr.push(c_obj);
                }
            },
            deep: true

        },
        /* 拖拽精度 场次间隔 */
        scaleConfig(data, old_data) {
            this.dragPrecision = Number(data.dragPrecision);
            this.timeInterval = Number(data.timeInterval);
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
            e.stopPropagation();
            let selectMovieData = this.selectMovieData;
            let isSelect = selectMovieData.isSelect;
            let selectData = selectMovieData.selectMoive;
            if (!isSelect) return;
            if (!selectMovieData.isShow) {
                this.selectMovieData.isShow = true;
            }

            // 鼠标所在浏览器位置
            let clientX = e.clientX,
                clientY = e.clientY;
            // 父元素所在位置
            let margin_left = this.margin_left;
            let parentElement = this.$refs.moviePlanWindow;
            // 父级滚动条总和
            let parentScrollAll = this.$options.methods.parentScrollAll(parentElement);

            // 鼠标在元素内具体位置
            let position = this.$options.methods.mousePosition(clientX, clientY, parentElement, parentScrollAll, margin_left);
            let positionX = position.positionX;
            let positionY = position.positionY;

            // 校验是否超出限定时间
            let limitElement = this.$refs.content;
            let l_offsetLeft = limitElement.offsetLeft;
            let l_offsetTop = limitElement.offsetTop;
            let l_offsetWidth = limitElement.offsetWidth;
            let l_offsetHeight = limitElement.offsetHeight;
            // 左右边界检测
            if (positionX < l_offsetLeft - margin_left + 60) {
                positionX = l_offsetLeft - margin_left + 60;
            } else if (positionX + Number(selectData.timeLong) >= l_offsetWidth) {
                positionX = l_offsetWidth - Number(selectData.timeLong);
            }

            //上下边界检测
            let movieItemHeight = this.movieItemHeight;
            if (positionY + movieItemHeight >= l_offsetHeight) {
                positionY = l_offsetHeight - movieItemHeight;
            } else if (positionY <= l_offsetTop) {
                positionY = l_offsetTop;
            }

            // 时间线位置
            this.time_line = {
                positionX: positionX + margin_left
            };

            if (this.selectMovieData.isSelect) {
                let _positionX = this.$options.methods.dropScale(positionX, this.dragPrecision);
                let movie_clock_start = this.$options.methods.time(_positionX);
                let movie_clock_end = this.$options.methods.time(_positionX + Number(this.selectMovieData.selectMoive.timeLong));
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
                };
            }

            if (positionY < 50) {
                if (this.contentSize.height < 50 + this.movieItemHeight) {
                    positionY = positionY;
                } else {
                    positionY = positionY + this.movieItemHeight + 5;
                }
            } else {
                positionY = positionY - 25
            }
            this.clock = {
                positionX: positionX + margin_left,
                positionY: positionY
            };
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
            let _halfScale = _scaleNum / 2;
            // 余下的精度
            let l_positionX = (positionX % 60) % _scaleNum;

            let _positionX;
            if (l_positionX < _halfScale) {
                _positionX = positionX - l_positionX;
            } else {
                _positionX = positionX + _scaleNum - l_positionX;
            }
            return _positionX;
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

            let width
            if (systemDateFlage == currentDateFlage) {
                let clock_date = new Date(),
                    hours = clock_date.getHours(),
                    minutes = clock_date.getMinutes()
                // + 1 因为 前边有一个小时区域无法布局
                if (hours < 6) {
                    width = (24 - hours + 1) * 60
                } else {
                    width = (hours - 6 + 1) * 60
                }
                width += minutes;
            } else if (systemDateFlage < currentDateFlage) {
                width = 0
            } else {
                width = 25 * 60
            }

            this.pass_time.width = width
            this.clock_date.positionX = width;
        },
        /* 点击影片 */
        filmMouseDown(e) {
            e.stopPropagation()

            let itemMarginTop = (this.contentSize.roomItemHeight - this.movieItemHeight) / 2

            let element = e.target;
            let isHasFilmItem = element.classList.value.indexOf('filmItem');
            let dataset = element.dataset;
            let rowIndex = dataset.row,
                itemIndex = dataset.item,
                planStatus = dataset.planStatus;

            while (isHasFilmItem == -1) {
                element = element.parentElement;
                dataset = element.dataset;
                rowIndex = dataset.row;
                itemIndex = dataset.item;
                planStatus = dataset.planstatus;
                isHasFilmItem = element.classList.value.indexOf('filmItem');
            }

            // 校验当前影片是否为可拖拽状态
            let dropStatus = this.$options.methods.planDropStatus(planStatus);
            let isCtrl = e.ctrlKey;

            let selectMovie = JSON.parse(JSON.stringify(this.plan_rooms[rowIndex][itemIndex]));
            this.curPlan = selectMovie
            selectMovie.rowIndex = rowIndex;
            selectMovie.itemIndex = itemIndex;
            selectMovie.positionY = itemMarginTop + this.contentSize.roomItemHeight * rowIndex;
            selectMovie.isSelect = true;

            if (!isCtrl) {
                this.controlManage(selectMovie);
            }
            if (dropStatus) {
                // 开启拖拽影片开关
                this.isMouseDown = true;
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
                if (!this.pageControlType) {
                    return this.$emit('cantEdition');
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
                let position = this.$options.methods.mousePosition(clientX, clientY, parentElement, parentScrollAll, margin_left);
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
                e.stopPropagation();
            }
            this.isMouseDown = false;
            this.isDropShow = false;
        },
        /* 模板中移动 */
        dropFilmMove(e) {
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
            let position = this.$options.methods.mousePosition(clientX, clientY, parentElement, parentScrollAll, margin_left)
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
                let _positionX = this.$options.methods.dropScale(cube.left, this.dragPrecision)
                let startTime = this.$options.methods.time(_positionX)
                let endTime = this.$options.methods.time(_positionX + Number(movieTime))
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
            for (let i = 0; i < drop_data.length; i++) {
                let d_positionX = drop_data[i].positionX,
                    d_positionY = drop_data[i].positionY
                let c_positionX = this.$options.methods.dropScale(d_positionX + relative.positionX, this.dragPrecision),
                    c_row_index = this.$options.methods.innerPosition(d_positionY + relative.positionY, this.contentSize.roomItemHeight)

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

            if (!isError) {
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
        innerPostionY(that, rowIndex) {
            let positionY = rowIndex * that.contentSize.roomItemHeight + (that.contentSize.roomItemHeight - that.movieItemHeight) / 2
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
            let innerPositionX;
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

        /* 选中全部电影或取消全选 */
        selectAllRooms(flag) {
            let plan_rooms = JSON.parse(JSON.stringify(this.plan_rooms))
            plan_rooms.forEach( item => {
                item.forEach( innerItem => {
                    if(innerItem.approveStatus === 'WAIT_APPROVE' && flag) {
                        innerItem.isSelect = true
                    }else {
                        innerItem.isSelect = false
                    }
                })
            })
            this.plan_rooms = plan_rooms

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

            let type;
            let c_positionY, c_positionX
            if (bottom == roomHeight) {
                // 只有一行数据
                if (max_positionY + r_l_control_width > right) {
                    type = 'left'
                    c_positionX = min_positionY - r_l_control_width
                } else {
                    type = 'right'
                    c_positionX = max_positionX
                }
                c_positionY = max_positionY - (max_positionY - min_positionY) / 2 - r_l_control_height / 2 + (roomHeight - itemHeight) / 2
            } else {
                // 多行数据
                if (max_positionY + t_b_control_height > bottom) {
                    type = 'top'
                    c_positionY = min_positionY - t_b_control_height
                } else {
                    type = 'bottom'
                    c_positionY = max_positionY
                }
                c_positionX = min_positionX
            }

            let controlItemArr = this.controlItem(this, movie)

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
        controlItem(that, movie) {
            let controlObj = {
                'checkMovie': {
                    text: '查看',
                    controlFn: 'viewMoive'
                },
            }
            let setControlArr = [], approveStatus = movie.approveStatus ? movie.approveStatus : '', saleStatus = movie.saleStatus ? movie.saleStatus : ''
            setControlArr = ['checkMovie']
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

        /* 控制器 - 编辑影片 */
        editionMovie(type) {
            let _type = type ? type : 'edit'
            if (!this.pageControlType && type != 'view') {
                return this.$emit('cantEdition')
            }
            let rowData = JSON.parse(JSON.stringify(this.plan_rooms[`${Number(this.control.movie.rowIndex)}`]))
            rowData.forEach(item => {
                item.showTimeStart = `${this.baseParam.planDate} ${item.startTime.hours}:${item.startTime.minute}`
                item.showTimeEnd = `${this.baseParam.planDate} ${item.endTime.hours}:${item.endTime.minute}`
            })
            let currentRow = rowData.filter(item => !(item.hallUid == this.curPlan.hallUid && item.positionX == this.curPlan.positionX))
            this.$store.commit('changeCurrentRow', currentRow)
            if (this.userNeedSave && this.mode) {
                this.savePlan(_type, true)
                return 
            } else {
                this.goToPlanDetail(_type)
            }
            
            
        },
        goToPlanDetail(type) {
            let uid = ''
            if (this.curPlan.planUid) {
                uid = this.curPlan.planUid
            } else {
                this.plan_rooms.some(item => {
                    if (item.hallUid == this.curPlan.hallUid && item.positionX == this.curPlan.positionX) {
                        uid = item.planUid
                        return true
                    }
                })
            }
            this.$router.push({
                path: `/ticket/moviePlan/detail?mode=${type}&uid=${uid}`
            })
        },
        /* 控制器 - 查看影片*/
        viewMoive() {
            this.editionMovie('view')
        },

        importPlanForSingle () {
            console.log(11)
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
            let statusFlage = false
            if (status == 'NEW' || !status) {
                statusFlage = true
            }
            return statusFlage
        },

    }
};
</script>

<style lang="scss" scoped>
    // 排片提示信息
    .tool-tips {
        .plan-tip {
            font-size: 12px;
            margin-bottom: 5px;
            .font-bold {
                font-weight: bold;
                color:#FF8900;
            }
        }
        .plan-tip:nth-last-of-type(1) {
            margin-bottom: 0;
        }
        .plan-tip {
            .mr30 {
                font-size: 12px;
                margin-right: 30px;
            }
        }
        div {
            font-size: 12px;
            margin-bottom: 2px;
            &:nth-child(1) {
                margin-bottom: 4px;
            }
        }

    }
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
