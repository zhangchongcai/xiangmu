<template>
<section class="movie-plan-window" @scroll="scroll" v-bind:style="{width:width+'px',height: contentSize.height +'px'}" ref="moviePlanWindow" @mousemove="changeTimeLine">
    <div class="content" v-bind:style="{width:contentSize.width+'px',height:contentSize.height+'px'}" @mousedown="addFilm" @mousemove="drawBlock" @mouseup="cleanDrawBlock" ref="content">
        <!-- 过去时间：灰色 -->
        <div class="pass-time" v-bind:style="{height: contentSize.height + 'px',width: pass_time.width + 'px'}"></div>
        <!-- 排片内容 -->
        <ul>
            <li class="row_content" v-for="(item,index) in plan_rooms" v-bind:key="index" v-bind:style="{height: contentSize.roomItemHeight + 'px'}" v-bind:data-item="index">
                <ul class="flex-base">
                    <el-tooltip placement="right" v-for="(filmItem,filmItem_index) in item" v-bind:key="filmItem_index" :manual="block.click" :enterable="!block.click">
                        <div slot="content" class="tool-tips">
                            <div>{{filmItem.movieName}}（{{filmItem.disversion}}/{{filmItem.language}}）{{filmItem.timeLong}}分钟</div>
                            <div>{{filmItem.startTime.hours+':'+filmItem.startTime.minute + '-' + filmItem.endTime.hours + ':' + filmItem.endTime.minute}}</div>
                            <div v-if="filmItem.originFlag">
                                <div>审核状态：<span>{{filmItem.approve_text}}</span></div>
                                <div>放映计划状态：<span>{{filmItem.plan_text}}</span></div>
                                <div>销售状态：<span>{{filmItem.sale_text}}</span></div>
                                <div>人次：{{filmItem.privateSaleSeatCount ? filmItem.privateSaleSeatCount : 0}}人 票房：0元 上座率：{{filmItem.seatPrecent}}%</div>
                            </div>
                        </div>
                        <li class="filmItem" v-bind:style="{width: filmItem.timeLong+'px',left: filmItem.positionX +'px'}" v-bind:class="{isSelect: filmItem.isSelect}" @mousedown="filmMouseDown" @mousemove="filmMouseMove" @mouseup="filmMouseUp" v-bind:data-row="index" v-bind:data-item="filmItem_index" :data-planstatus="filmItem.planStatus">
                            <div class="film-header" v-bind:style="{background: filmItem.color}"></div>
                            <div class="film-content flex-base" v-bind:style="{background: colorRgba(filmItem.color,0.15)}">
                                <div class="text-hide">{{filmItem.movieName}}</div>
                                <div>({{filmItem.disversion + '/' + filmItem.language}})</div>
                                <div>{{filmItem.startTime.hours+':'+filmItem.startTime.minute + '-' + filmItem.endTime.hours + ':' + filmItem.endTime.minute}}</div>
                            </div>
                            <!-- 影片状态 -->
                            <div class="triangle-absolute" v-if="filmItem.approveStatus" :class="{'success':filmItem.approveStatus == 'APPROVED' && filmItem.saleStatus == 'SALE','going':filmItem.approveStatus == 'WAIT_APPROVE','stop': filmItem.approveStatus == 'APPROVED' && filmItem.saleStatus == 'STOP'}"></div>
                        </li>
                    </el-tooltip>
                </ul>
            </li>
        </ul>
        <!-- 单独添加影片：时间刻度线 -->
        <div class="time-line" v-if="selectMovieData.isShow" v-bind:style="{left: time_line.positionX + 'px',height:contentSize.height+'px'}">
            <div class="clock-info" v-bind:style="{top: clock.positionY + 'px'}">{{single_movie.startTime.hours+':'+single_movie.startTime.minute + '-' + single_movie.endTime.hours +':' + single_movie.endTime.minute}}</div>
            <ul class="select-movie-content">
                <li class="movie-item" v-bind:style="{width: selectMovieData.selectMoive.timeLong +'px', top: single_movie.positionY + 'px'}">
                    <div class="movie-header" v-bind:style="{background: selectMovieData.selectMoive.color}"></div>
                    <div class="movie-content flex-base" v-bind:style="{background:colorRgba(selectMovieData.selectMoive.color,0.1)}">
                        <div class="text-hide">{{selectMovieData.selectMoive.movieName}}</div>
                        <div>({{selectMovieData.selectMoive.disversion + '/' + selectMovieData.selectMoive.language}})</div>
                        <div>{{single_movie.startTime.hours+':'+single_movie.startTime.minute +'-'+ single_movie.endTime.hours+':'+ single_movie.endTime.minute}}</div>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 拖拽影片：创建模板副本 -->
        <div class="drop-film" v-bind:style="{width:contentSize.width+'px',height:contentSize.height+'px'}" v-if="isDropShow" @mouseup="dropFilmMouseUp" @mousemove="dropFilmMove">
            <ul>
                <li class="drop-item" v-for="(drop_item,drop_item_index) in drop_data" v-bind:key="drop_item_index" v-bind:style="{top: drop_item.positionY + relative.positionY + 'px', left: drop_item.positionX + relative.positionX + 'px',width: drop_item.timeLong +'px'}">
                    <div class="drop-header" v-bind:style="{background: drop_item.color}"></div>
                    <div class="drop-content flex-base" v-bind:style="{background:colorRgba(drop_item.color,0.1)}">
                        <div class="text-hide">{{drop_item.movieName}}</div>
                        <div>({{drop_item.disversion + '/' + drop_item.language}})</div>
                        <div>{{time(dropScale(drop_item.positionX + relative.positionX,dragPrecision)).hours+':'+time(dropScale(drop_item.positionX + relative.positionX,dragPrecision)).minute +'-'+ time(dropScale(drop_item.positionX + relative.positionX,dragPrecision) + Number(drop_item.timeLong)).hours+':'+ time(dropScale(drop_item.positionX + relative.positionX,dragPrecision) + Number(drop_item.timeLong)).minute}}</div>
                    </div>
                </li>
            </ul>
            <!-- 时间刻度线 -->
            <div class="time-line" v-if="drop_clock.isShow" v-bind:style="{left: drop_clock.positionX + 'px', height: contentSize.height+'px'}">
                <div class="clock-info" v-bind:style="{top: drop_clock.positionY + 'px'}">{{drop_clock.startTime.hours + ':' + drop_clock.startTime.minute + '-' + drop_clock.endTime.hours +':'+ drop_clock.endTime.minute}}</div>
            </div>
        </div>
        <!-- 矩形 -->
        <div class="draw-block" v-bind:style="{top:blockSetting.top.positionY+'px',left: blockSetting.top.positionX + 'px', width: blockSetting.size.width+ 'px',height: blockSetting.size.height + 'px'}"></div>
        <!-- 控制器 -->
        <div class="item-controls" v-if="control.config.isShow" v-bind:style="{left: control.config.positionX+'px', top:control.config.positionY+'px'}">
            <div class="top" v-if="control.config.type == 'bottom'"></div>
            <ul class="flex-base">
                <div class="left" v-if="control.config.type == 'right'"></div>
                <li v-for="(controlItem,controlItemIndex) in control.controlItem" :data-status="controlItem.status" :key="controlItemIndex" v-on:click="controlEmit(controlItem.controlFn)">{{controlItem.text}}</li>
                <div class="right" v-if="control.config.type == 'left'"></div>
            </ul>
            <div class="bottom" v-if="control.config.type == 'top'"></div>
        </div>
    </div>
</section>
</template>

<script>
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
        pageControlType: {
            type: Boolean
        }
    },
    data() {
        return {
            scrollY: "",
            scrollX: "",
            // content距离边框距离
            margin_left: 30,
            movieItemHeight: 64,
            maxTime: 60 * 24,
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
            userNeedSave: false
        };
    },
    created() {
        let that = this;
        window.onkeydown = function (e) {
            // 选中全部
            if (e.keyCode == 65 && e.ctrlKey) {
                that.$options.methods.selectAll(that)
            }
        }

    },
    mounted() {},
    destroyed() {
        window.onkeydown = null;
    },
    watch: {
        plan_list(data, old_data) {
            let _data = JSON.parse(JSON.stringify(data.data));
            for (let i = 0; i < _data.length; i++) {
                let c_d = _data[i];
                for (let j = 0; j < c_d.length; j++) {
                    let s_time = c_d[j].showTimeStart.split(' ')[1].split(':');
                    let e_time = c_d[j].showTimeEnd.split(' ')[1].split(':');
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
                    let privateSaleSeatCount = Number(c_d[j].privateSaleSeatCount);
                    let seatnum = Number(c_d[j].seatnum);
                    let seatPrecent;
                    if (privateSaleSeatCount != 0 && seatnum != 0) {
                        seatPrecent = (privateSaleSeatCount / seatnum) * 100;
                    } else {
                        seatPrecent = 0;
                    }

                    // 审核状态
                    let approveStatus = c_d[j].approveStatus;
                    let approve_text;
                    if (approveStatus == 'NOT_APPROVE') {
                        approve_text = '未审核';
                    } else if (approveStatus == 'WAIT_APPROVE') {
                        approve_text = '待审核';
                    } else if (approveStatus == 'APPROVED') {
                        approve_text = '已审核';
                    }

                    // 销售状态
                    let saleStatus = c_d[j].saleStatus;
                    let sale_text;
                    if (saleStatus == 'SALE') {
                        sale_text = '可售';
                    } else if (saleStatus == 'NOT_SALE') {
                        sale_text = '不可售';
                    } else if (saleStatus == 'STOP') {
                        sale_text = '暂停';
                    }

                    // 放映计划状态
                    let planStatus = c_d[j].planStatus;
                    let plan_text;
                    if (planStatus == 'NEW') {
                        plan_text = '新建';
                    } else if (planStatus == 'VALID') {
                        plan_text = '生效';
                    } else if (planStatus == 'LOCKED') {
                        plan_text = '锁定';
                    } else if (planStatus == 'DELETED') {
                        plan_text = '删除';
                    }

                    c_d[j].plan_text = plan_text;
                    c_d[j].approve_text = approve_text;
                    c_d[j].sale_text = sale_text;
                    c_d[j].seatPrecent = seatPrecent;
                    c_d[j].startTime = startTime;
                    c_d[j].endTime = endTime;
                    c_d[j].positionX = positionX;
                    let positionY = this.$options.methods.innerPostionY(this, i);
                    c_d[j].positionY = positionY;
                    // 用于校验数据是否改变
                    c_d[j].originFlag = {
                        positionX,
                        positionY
                    }
                }
                c_d.sort(this.sort('positionX', 'up'));
            }
            this.plan_rooms = _data;

            if (data.type) {
                this.turnPageMidleWare(this, data.type);
            }
        },
        plan_rooms(data, old_data) {
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

            // 实时修改 我的数据
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

            this.$emit('setMindData', {
                mindArr
            });
        },
        /* 拖拽精度 场次间隔 */
        scaleConfig(data, old_data) {
            this.dragPrecision = Number(data.dragPrecision);
            this.timeInterval = Number(data.timeInterval);
        },
        baseParam(data, old_data) {
            if (data.planDate != old_data.planDate) {
                this.$options.methods.passTimeShadow(this);
                this.$options.methods.longInterval(this);
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
            if (positionX < l_offsetLeft - margin_left) {
                positionX = l_offsetLeft - margin_left;
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
        /* 添加影片位置 确定矩形起点*/
        addFilm(e) {
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

            if (this.selectMovieData.isSelect) {
                // 确定当前所点击行
                let cloum_num = Math.floor(positionY / this.contentSize.roomItemHeight);
                let cloum_isAddOne = positionY % this.contentSize.roomItemHeight;

                if (cloum_isAddOne >= 50) {
                    cloum_num = cloum_num + 1;
                }

                if (cloum_num > this.plan_rooms.length) {
                    cloum_num = this.plan_rooms.length;
                }

                if (e.button == 0) {
                    // 左键添加
                    let movie = JSON.stringify(this.selectMovieData.selectMoive);
                    movie = JSON.parse(movie);
                    movie["select"] = false;
                    // 电影所需的位置（时长）
                    let movieNeedTime = Number(movie.timeLong);
                    // 当前添加到的影厅
                    let c_plan_rooms = this.plan_rooms[cloum_num];
                    let maxTime = this.maxTime;
                    positionX = this.$options.methods.dropScale(positionX, this.dragPrecision);
                    // 超出限定时
                    if (positionX + movieNeedTime > maxTime) {
                        return;
                    }

                    if (c_plan_rooms.length == 0) {
                        // 直接添加
                        // 电影开始播放时间
                        let _time = this.$options.methods.innerTime(this, positionX, movieNeedTime);
                        movie.startTime = _time.startTime;
                        movie.endTime = _time.endTime;
                        movie.positionX = positionX;
                        c_plan_rooms.push(movie);
                    } else {
                        let inner_action = this.$options.methods.canInnerRoom(c_plan_rooms, positionX, movieNeedTime, maxTime, this.timeInterval);
                        let _time = this.$options.methods.innerTime(this, inner_action.innerPositionX, movieNeedTime);
                        movie.startTime = _time.startTime;
                        movie.endTime = _time.endTime;
                        movie.positionX = inner_action.innerPositionX;
                        if (inner_action.canIn) {
                            if (inner_action.type == 'splice') {
                                c_plan_rooms.splice(inner_action.index, 0, movie);
                            } else {
                                c_plan_rooms.unshift(movie);
                            }
                        }

                    }
                } else if (e.button == 2) {
                    // 右键清空已选影片
                    this.$emit("cleanMovie");
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
            if (this.block.click) {
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

                // 起点坐标
                let block = this.block;
                let start_positionX = this.block.mouseStart.positionX;
                let start_positionY = this.block.mouseStart.positionY;

                // 宽度
                let width = positionX - start_positionX;
                // 高度
                let height = positionY - start_positionY;
                // 确定拖拉方位
                // let c_type,r_type;
                let topPositinX;
                let topPositionY;
                if (width < 0) {
                    // r_type = 'left'; 
                    topPositinX = positionX;
                } else {
                    // r_type = 'right';
                    topPositinX = start_positionX;
                }
                if (height < 0) {
                    // c_type = 'top';
                    topPositionY = positionY;
                } else {
                    // c_type = 'bottom';
                    topPositionY = start_positionY;
                }

                width = Math.abs(width);
                height = Math.abs(height);

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
                };
            }
        },
        /* 清除矩形 */
        cleanDrawBlock() {
            let block = JSON.parse(JSON.stringify(this.block));
            let blockSetting = JSON.parse(JSON.stringify(this.blockSetting));

            let cloum_min = blockSetting.top.positionY,
                block_height = blockSetting.size.height,
                colum_max = cloum_min + block_height;
            let row_min = blockSetting.top.positionX,
                block_width = blockSetting.size.width,
                row_max = row_min + block_width;

            let roomItemHeight = this.contentSize.roomItemHeight;

            let c_min_num = this.$options.methods.innerPosition(cloum_min, roomItemHeight),
                c_max_num = Math.floor(colum_max / roomItemHeight);

            let plan_rooms = JSON.parse(JSON.stringify(this.plan_rooms));
            let drop_data = JSON.parse(JSON.stringify(this.drop_data));
            let cover_drop_data = [];
            if (block.ctrl) {
                // 不移除之前所选
                for (let i = c_min_num; i <= c_max_num; i++) {
                    for (let j = 0; j < plan_rooms[i].length; j++) {
                        if (row_min <= plan_rooms[i][j].positionX && plan_rooms[i][j].positionX <= row_max) {
                            let existent = false;
                            for (let k = 0; k < drop_data.length; k++) {
                                // 判断是否已经存在
                                if (drop_data[k].rowIndex == i && drop_data[k].itemIndex == j) {
                                    existent = true;
                                }
                            }

                            if (!existent) {
                                plan_rooms[i][j].isSelect = true;
                                let c_item = JSON.parse(JSON.stringify(plan_rooms[i][j]));
                                c_item.rowIndex = i;
                                c_item.positionY = this.$options.methods.innerPostionY(this, i);
                                c_item.itemIndex = j;
                                // 校验是否可以拖拽
                                let dropStatus = this.$options.methods.planDropStatus(c_item.planStatus);
                                if (dropStatus) {
                                    drop_data.push(c_item);
                                }
                            }
                        }
                    }
                }
            } else {
                // 移除之前所选中
                for (let i = 0; i < plan_rooms.length; i++) {
                    for (let j = 0; j < plan_rooms[i].length; j++) {
                        plan_rooms[i][j].isSelect = false;
                        if (c_min_num <= i && i <= c_max_num) {
                            if (row_min <= plan_rooms[i][j].positionX && plan_rooms[i][j].positionX <= row_max) {
                                if (block_width != 0 && block_height != 0) {
                                    plan_rooms[i][j].isSelect = true;
                                    let c_item = JSON.parse(JSON.stringify(plan_rooms[i][j]));
                                    c_item.rowIndex = i;
                                    c_item.positionY = this.$options.methods.innerPostionY(this, i);
                                    c_item.itemIndex = j;
                                    // 校验是否可以拖拽
                                    let dropStatus = this.$options.methods.planDropStatus(c_item.planStatus);
                                    if (dropStatus) {
                                        cover_drop_data.push(c_item);
                                    }
                                }
                            }
                        }
                    }
                }
                drop_data = cover_drop_data;
            }

            this.plan_rooms = plan_rooms;
            this.drop_data = drop_data;

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

            this.$options.methods.hideControl(this);
        },
        /* 鼠标在元素内位置 */
        mousePosition(clientX, clientY, element, parentScrollAll, margin_left) {
            let p_offsetTop = element.offsetTop,
                p_offsetLeft = element.offsetLeft,
                p_scorllLeft = element.scrollLeft,
                p_scorllTop = element.scrollTop;

            let positionX = clientX - p_offsetLeft + p_scorllLeft - margin_left + parentScrollAll.scorllLeft;
            let positionY = clientY - p_offsetTop + p_scorllTop + parentScrollAll.scorllTop;

            return {
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
                hours = 6 + hours;
            } else {
                hours = hours - 18;
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
            return (h - 6) * 60;
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
        /* 60S计时器 */
        longInterval(that) {
            clearInterval(that.shadowInterval);
            that.shadowInterval = setInterval(function () {
                that.$options.methods.passTimeShadow(that);
                that.$options.methods.longInterval(that);
            }, 60000);
        },
        /* 设置阴影宽高 */
        passTimeShadow(that) {
            // 传入日期
            let currentDate = that.baseParam.planDate;
            // 系统日期
            let systemDate = new Date();
            console.log(systemDate)
            let s_year = systemDate.getFullYear(),
                s_mounth = systemDate.getMonth() + 1,
                s_day = systemDate.getDate();

            s_mounth = s_mounth < 10 ? `0${s_mounth}` : s_mounth;
            s_day = s_day < 10 ? `0${s_day}` : s_day;

            let systemDateFlage = new Date(`${s_year}-${s_mounth}-${s_day}`).getTime(),
                currentDateFlage = new Date(`${currentDate}`).getTime();

            let width;
            console.log('systemDateFlage:', systemDateFlage, 'currentDateFlage:', currentDateFlage);
            if (systemDateFlage == currentDateFlage) {
                let clock_date = new Date(),
                    hours = clock_date.getHours(),
                    minutes = clock_date.getMinutes();
                if (hours < 6) {
                    width = (24 - hours) * 60;
                } else {
                    width = (hours - 6) * 60;
                }
                width += minutes;
            } else if (systemDateFlage < currentDateFlage) {
                width = 0;
            } else {
                width = 24 * 60;
            }

            that.pass_time.width = width;
            that.clock_date.positionX = width;
        },
        /* 点击影片 */
        filmMouseDown(e) {
            e.stopPropagation();

            let itemMarginTop = (this.contentSize.roomItemHeight - this.movieItemHeight) / 2;

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
            selectMovie.rowIndex = rowIndex;
            selectMovie.itemIndex = itemIndex;
            selectMovie.positionY = itemMarginTop + this.contentSize.roomItemHeight * rowIndex;
            selectMovie.isSelect = true;

            if (!isCtrl) {
                this.$options.methods.controlManage(this, selectMovie);
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
                let isDropAllPress;
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
                // 隐藏控制器
                this.$options.methods.hideControl(this);
                // 多选 存在重置的状况 所以需要判断plan_rooms中是否存在已选 并将已选添加进drop_data
                let length = drop_data.length;
                if (length == 0) {
                    if (dropStatus) {
                        drop_data.push(selectMovie);
                    }
                } else {
                    for (let i = 0; i < length; i++) {
                        let r_index = drop_data[i].rowIndex;
                        let i_index = drop_data[i].itemIndex;
                        if (dropStatus) {
                            if (r_index == rowIndex && i_index == itemIndex) {
                                drop_data.splice(i, 1);
                                break;
                            }
                            if (i == length - 1) {
                                drop_data.push(selectMovie);
                            }
                        }
                    }
                }
                this.plan_rooms[rowIndex][itemIndex].isSelect = !this.plan_rooms[rowIndex][itemIndex].isSelect;
            }

            this.drop_data = drop_data;
        },
        /* 拖拽影片 */
        filmMouseMove(e) {
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
            // 隐藏控制器
            if (this.control.config.isShow) {
                this.$options.methods.hideControl(this);
            }

            e.stopPropagation();
            // 开始拖动位置
            let startPositionX = this.dropStartPosition.positionX;
            let startPositionY = this.dropStartPosition.positionY;

            // 鼠标位置
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

            let drop_data = JSON.parse(JSON.stringify(this.drop_data));
            // 找出拖拽数据中 最左值 最右值 最高值 最低值 组成矩形做边界检测
            let cube;
            // 时钟高度
            let clock_postionY;
            let movieTime;
            //let left,right,top,bottom;
            for (let i = 0; i < drop_data.length; i++) {
                let left = drop_data[i].positionX + positionX - startPositionX;
                let right = left + Number(drop_data[i].timeLong);
                let top = drop_data[i].positionY + positionY - startPositionY;
                let bottom = top + this.movieItemHeight;
                if (!cube) {
                    cube = {
                        left,
                        right,
                        top,
                        bottom
                    }
                    clock_postionY = drop_data[i].positionY;
                    movieTime = drop_data[i].timeLong;
                } else {
                    if (left < cube.left) {
                        cube.left = left;
                        clock_postionY = drop_data[i].positionY;
                        movieTime = drop_data[i].timeLong;
                    }
                    if (right > cube.right) {
                        cube.right = right;
                    }
                    if (top < cube.top) {
                        cube.top = top;
                    }
                    if (bottom > cube.bottom) {
                        cube.bottom = bottom;
                    }
                }
            }

            if (!cube) debugger;
            // 每小时间隔60min 每刻度尺间隔11 每刻度尺宽1 49 = 11*4+4+1；
            if (cube.left >= 0 && cube.right <= this.contentSize.width - 49 && cube.top >= 0 && cube.bottom <= this.rooms.length * this.contentSize.roomItemHeight) {
                this.relative = {
                    positionX: positionX - startPositionX,
                    positionY: positionY - startPositionY
                }
                // 拖拽精度修改时间
                let _positionX = this.$options.methods.dropScale(cube.left, this.dragPrecision);
                let startTime = this.$options.methods.time(_positionX);
                let endTime = this.$options.methods.time(_positionX + Number(movieTime));
                let c_postionY = clock_postionY + positionY - startPositionY - 25;
                if (c_postionY < 0) {

                    if (this.contentSize.height < 50 + this.movieItemHeight) {
                        c_postionY = clock_postionY + positionY - startPositionY;
                    } else {
                        c_postionY = clock_postionY + positionY - startPositionY + this.movieItemHeight + 5;
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
            // 将拖拽的数据插入对应的位置
            let drop_data = JSON.parse(JSON.stringify(this.drop_data));
            let relative = this.relative;
            let plan_rooms = this.plan_rooms;

            // 校验是否出现错误
            let isError = false;
            for (let i = 0; i < drop_data.length; i++) {
                let d_positionX = drop_data[i].positionX,
                    d_positionY = drop_data[i].positionY;
                let c_positionX = this.$options.methods.dropScale(d_positionX + relative.positionX, this.dragPrecision),
                    c_row_index = this.$options.methods.innerPosition(d_positionY + relative.positionY, this.contentSize.roomItemHeight);

                let c_plan_rooms = plan_rooms[c_row_index];
                // 修改位置
                drop_data[i].positionX = c_positionX;
                drop_data[i].rowIndex = c_row_index;
                if (c_plan_rooms.length == 0) {
                    let _time = this.$options.methods.innerTime(this, c_positionX, Number(drop_data[i].timeLong));
                    drop_data[i].startTime = _time.startTime;
                    drop_data[i].endTime = _time.endTime;
                    plan_rooms[c_row_index].push(drop_data[i]);
                } else {
                    let current_drop = JSON.parse(JSON.stringify(drop_data[i]));
                    delete current_drop.itemIndex;
                    delete current_drop.rowIndex;
                    let movieNeedTime = current_drop.timeLong;
                    let maxTime = this.maxTime;
                    // 校验是否能插入
                    let inner_action = this.$options.methods.canInnerRoom(c_plan_rooms, c_positionX, movieNeedTime, maxTime, this.timeInterval);
                    let _time = this.$options.methods.innerTime(this, inner_action.innerPositionX, Number(drop_data[i].timeLong));
                    current_drop.startTime = _time.startTime;
                    current_drop.endTime = _time.endTime;
                    current_drop.positionX = inner_action.innerPositionX;

                    if (inner_action.canIn) {
                        if (inner_action.type == 'splice') {
                            plan_rooms[c_row_index].splice(inner_action.index, 0, current_drop);
                            drop_data[i].itemIndex = inner_action.index - 1;
                        } else {
                            plan_rooms[c_row_index].unshift(current_drop);
                            drop_data[i].itemIndex = 0;
                        }
                    } else {
                        isError = true;
                    }
                }
            }

            // 清空已选
            for (let i = 0; i < plan_rooms.length; i++) {
                for (let j = 0; j < plan_rooms[i].length; j++) {
                    plan_rooms[i][j].isSelect = false;
                }
            }

            if (!isError) {
                this.plan_rooms = plan_rooms;
            } else {
                this.plan_rooms = this.dropCopyData;
            }

            this.drop_data = [];

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
            this.isDropShow = false;
            this.isMouseDown = false;

        },
        /* 计算数据应该插入模板的位置 */
        innerPosition(positionY, roomItemHeight) {
            let index = Math.floor(positionY / roomItemHeight);
            let less = positionY % roomItemHeight;
            if (less > 50) {
                index += 1;
            }
            return index
        },
        /* 计算数据插入的positionY */
        innerPostionY(that, rowIndex) {
            let positionY = rowIndex * that.contentSize.roomItemHeight + (that.contentSize.roomItemHeight - that.movieItemHeight) / 2;
            return positionY;
        },
        /* 计算数据能否插入 */
        canInnerRoom(plan_rooms, c_positionX, movieNeedTime, maxTime, plan_distant) {
            // 插入电影是否存在其他相邻电影
            let min_movie;
            let max_movie;

            // 检测通过后插入元素下标
            let start_index;
            let end_index;

            for (let i = 0; i < plan_rooms.length; i++) {
                let i_positionX = plan_rooms[i].positionX;
                if (!min_movie && i_positionX < c_positionX) {
                    min_movie = plan_rooms[i];
                    start_index = i;
                }

                if (min_movie && min_movie.positionX < i_positionX && i_positionX < c_positionX) {
                    min_movie = plan_rooms[i];
                    start_index = i;
                }

                if (!max_movie && i_positionX > c_positionX) {
                    max_movie = plan_rooms[i];
                    end_index = i;
                }
            }

            // 限制区间
            let l_room;
            // 可播放时间
            let l_time;
            // 只有一边有电影 可以适用 自动间隔
            let innerType;

            if (min_movie && max_movie) {
                // 在已有电影添加
                l_room = {
                    min: min_movie.positionX + Number(min_movie.timeLong) + plan_distant,
                    max: max_movie.positionX - plan_distant
                }
                innerType = 'center';
            } else if (min_movie && !max_movie) {
                // 只有左边有电影
                l_room = {
                    min: min_movie.positionX + Number(min_movie.timeLong) + plan_distant,
                    max: maxTime
                }
                innerType = 'left';
            } else if (!min_movie && max_movie) {
                // 只有右边有电影
                l_room = {
                    min: 0,
                    max: Number(max_movie.positionX) - plan_distant
                }
                innerType = 'right';
            }
            l_time = l_room.max - l_room.min;

            let canIn = false;
            let type; // 插入的类型 splice / unshift
            let index; // 插入的下标
            let innerPositionX;
            if (Number(movieNeedTime) <= l_time) {
                if (innerType == 'center') {
                    if (c_positionX <= l_room.min) {
                        // 低于限制值
                        innerPositionX = l_room.min;
                    } else if (c_positionX + Number(movieNeedTime) >= l_room.max) {
                        // 超出最大值
                        innerPositionX = l_room.max - Number(movieNeedTime);
                    } else {
                        innerPositionX = c_positionX;
                    }
                }

                if (innerType == 'left') {
                    if (min_movie.positionX <= c_positionX && c_positionX <= l_room.min) {
                        innerPositionX = l_room.min;
                    } else {
                        innerPositionX = c_positionX;
                    }
                }

                if (innerType == 'center' || innerType == 'left') {
                    canIn = true;
                    type = 'splice';
                    index = start_index + 1;
                }

                if (innerType == 'right') {
                    if (l_room.max <= c_positionX + Number(movieNeedTime)) {
                        innerPositionX = l_room.max - Number(movieNeedTime);
                    } else {
                        innerPositionX = c_positionX;
                    }
                    canIn = true;
                    type = 'unshift';
                }
            } else {
                console.log('播放时间不足！');
            }

            return {
                canIn,
                type,
                index,
                innerPositionX
            }
        },
        /* 计算插入电影的时间 */
        innerTime(that, positionX, movieNeedTime) {
            let start_time = that.$options.methods.time(positionX);
            let end_time = that.$options.methods.time(positionX + movieNeedTime);
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
            let c_index = Number(data.index);
            let plan_rooms = JSON.parse(JSON.stringify(this.plan_rooms));
            let drop_data = [];
            for (let i = 0; i < plan_rooms.length; i++) {
                for (let j = 0; j < plan_rooms[i].length; j++) {
                    let c_d = plan_rooms[i][j];
                    if (i == c_index) {
                        let dropStatus = this.$options.methods.planDropStatus(c_d.planStatus);

                        c_d.isSelect = true;
                        let c_movie = JSON.parse(JSON.stringify(c_d));
                        c_movie.rowIndex = i;
                        c_movie.positionY = this.$options.methods.innerPostionY(this, i);
                        c_movie.itemIndex = j;
                        if (dropStatus) {
                            drop_data.push(c_movie);
                        }
                    } else {
                        c_d.isSelect = false;
                    }
                }
            }
            this.drop_data = drop_data;
            this.plan_rooms = plan_rooms;
        },
        /* 选中全部 */
        selectAll(that) {
            let plan_rooms = JSON.parse(JSON.stringify(that.plan_rooms));
            let drop_data = [];

            for (let i = 0; i < plan_rooms.length; i++) {
                for (let j = 0; j < plan_rooms[i].length; j++) {
                    let c_d = plan_rooms[i][j];
                    let dropStatus = that.$options.methods.planDropStatus(c_d.planStatus);
                    c_d.isSelect = true;
                    let c_item = JSON.parse(JSON.stringify(c_d));
                    c_item.rowIndex = i;
                    c_item.positionY = that.$options.methods.innerPostionY(that, i);
                    c_item.itemIndex = j;
                    if (dropStatus) {
                        drop_data.push(c_item);
                    }
                }
            }
            that.plan_rooms = plan_rooms;
            that.drop_data = drop_data;

            // 隐藏控制器
            that.$options.methods.hideControl(that);
        },
        /* 保存排片 */
        savePlan(that, type) {
            let pointer = that ? that : this;

            let plan_rooms = JSON.parse(JSON.stringify(pointer.plan_rooms));
            let rooms = JSON.parse(JSON.stringify(pointer.rooms));
            let baseParam = pointer.baseParam;
            let uidCinema = baseParam.uidCinema;
            let planDate = baseParam.planDate;
            let _data = {
                "uid_cinema": uidCinema,
                arrPlan: []
            };
            for (let i = 0; i < plan_rooms.length; i++) {
                let uidHall = rooms[i].uid_hall;
                let hallCode = rooms[i].hall_code;
                let hallName = rooms[i].hall_name;
                for (let j = 0; j < plan_rooms[i].length; j++) {
                    let c_d = plan_rooms[i][j];
                    let showTimeStart = `${planDate} ${c_d.startTime.hours}:${c_d.startTime.minute}`;
                    let showTimeEnd = `${planDate} ${c_d.endTime.hours}:${c_d.endTime.minute}`;

                    let c_data = {
                        disVersion: c_d.disversion,
                        displayName: c_d.disversion,
                        hallCode,
                        joinFlag: c_d.joinFlag ? c_d.joinFlag : 0,
                        makeDate: planDate,
                        movieCode: c_d.movieCode,
                        movieLanguage: c_d.language,
                        movieName: c_d.movieName,
                        planDate,
                        showTimeEnd,
                        showTimeStart,
                        timeLong: c_d.timeLong,
                        uidCinema,
                        uidHall,
                        uidMovie: c_d.baseMovieUid,
                        uidPlan: c_d.uid ? c_d.uid : "",
                        singleToManyFlag: 0,
                        planId: c_d.planId ? c_d.planId : "",
                        uidMovie: c_d.movieUid,
                        hallName
                    };

                    let originFlag = c_d.originFlag;
                    if (originFlag) {
                        // 后台返回的数据
                        if (originFlag.positionX != c_d.positionX || originFlag.positionY != c_d.positionY) {
                            _data.arrPlan.push(c_data);
                        }
                    } else {
                        _data.arrPlan.push(c_data);
                    }

                    // disVersion	屏幕类型	string	@mock=中国巨幕3
                    // displayName	屏幕名称	string	@mock=捉妖记3333（中国巨幕/粤语）
                    // hallCode	    影院的编码	string	@mock=5717092506979603
                    // joinFlag	    是否连场，0非连场	number	@mock=0
                    // makeDate	    售卖日期	string	@mock=2019-01-07
                    // movieCode	影院编码	string	@mock=001103692015
                    // movieLanguage	电影语言	string	@mock=粤语
                    // movieName	电影名称	string	@mock=捉妖记3
                    // planDate	    放映日期	string	@mock=2019-01-07
                    // showTimeEnd	开始日期	string	@mock=2019-01-05T15:59:00
                    // showTimeStart	结束日期	string	@mock=2019-01-05T14:00:00
                    // timeLong	    时长	number	@mock=119
                    // uidCinema	影院的uid	string	@mock=a405489f-adcc-42cd-b2ee-6789693aa481
                    // uidHall	    影厅的uid	string	@mock=a33e8c8509db4fedac51700554452b5e
                    // uidMovie	    电影的uid	string	@mock=900302a3-856b-49ce-9d54-2cbf0c474936
                    // uidPlan
                }
            }
            pointer.$api.savePlanAll(_data).then(data => {
                // 重置校验用户是否需要保存操作
                pointer.resetSaveFlage();
                // 刷新当前排片数据
                pointer.$emit('initMoivePlan', {
                    type: type ? type : null
                });
                pointer.$message({
                    message: '排片保存成功！',
                    type: 'success'
                });
            }).catch((msg, error) => {
                console.log('msg:', msg, 'error:', error);
            })
        },
        /* 控制器 根据选中影片设置状态 */
        controlManage(that, movie) {
            let roomHeight = that.contentSize.roomItemHeight,
                itemHeight = that.movieItemHeight;

            let bottom = that.plan_rooms.length * roomHeight,
                top = 0,
                left = 0,
                right = that.maxTime;

            let min_positionX = movie.positionX,
                max_positionX = min_positionX + movie.timeLong,
                min_positionY = movie.positionY,
                max_positionY = min_positionY + that.movieItemHeight;

            let r_l_control_width = that.control.r_l_width,
                r_l_control_height = that.control.r_l_height,
                t_b_control_width = that.control.t_b_width,
                t_b_control_height = that.control.t_b_height;

            let type;
            let c_positionY, c_positionX;
            if (bottom == roomHeight) {
                // 只有一行数据
                if (max_positionY + r_l_control_width > right) {
                    type = 'left';
                    c_positionX = min_positionY - r_l_control_width;
                } else {
                    type = 'right';
                    c_positionX = max_positionX;
                }
                c_positionY = max_positionY - (max_positionY - min_positionY) / 2 - r_l_control_height / 2 + (roomHeight - itemHeight) / 2;
            } else {
                // 多行数据
                if (max_positionY + t_b_control_height > bottom) {
                    type = 'top';
                    c_positionY = min_positionY - t_b_control_height;
                } else {
                    type = 'bottom'
                    c_positionY = max_positionY;
                }
                c_positionX = min_positionX;
            }

            let approveStatus = movie.approveStatus ? movie.approveStatus : '';
            let saleStatus = movie.saleStatus ? movie.saleStatus : '';

            let controlItemArr = that.$options.methods.controlItem(that, approveStatus, saleStatus);

            that.control.controlItem = controlItemArr;
            that.control.config = {
                type,
                isShow: true,
                positionX: c_positionX,
                positionY: c_positionY
            };
            that.control.movie = movie;
        },
        /* 设置控制器可操作类型 */
        controlItem(that, approveStatus, saleStatus) {
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
                    text: '连排',
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
                }
            }
            let setControlArr = [];
            if (approveStatus == 'NOT_APPROVE' || approveStatus == '') {
                // 未审核 或 新建
                setControlArr = ['edit', 'copy', 'delete', 'continuityPlan', 'selectSameMoive'];
            } else if (approveStatus == 'WAIT_APPROVE') {
                // 审核中
                setControlArr = ['checkMovie', 'copy'];
            } else if (approveStatus == 'APPROVED') {
                // 已审核
                if (saleStatus == 'SALE') {
                    // 在销售 
                    setControlArr = ['checkMovie', 'copy', 'stopSale', 'selectSameMoive'];
                } else if (saleStatus == 'STOP') {
                    // 停售
                    setControlArr = ['edit', 'copy', 'startSale', 'selectSameMoive']
                }
            }
            let controlItemArr = [];
            for (let i = 0; i < setControlArr.length; i++) {
                controlItemArr.push(controlObj[setControlArr[i]]);
            }
            return controlItemArr;
        },
        /* 控制器 - 事件分发 */
        controlEmit(type) {
            this[`${type}`]();
        },
        /* 隐藏控制器 */
        hideControl(that) {
            that.control.config = {
                type: '',
                isShow: false,
                positionX: 0,
                positionY: 0
            }
        },
        /* 控制器 - 删除单个排期影片 */
        deletSinglePlan(e) {
            if (!this.pageControlType) {
                return this.$emit('cantEdition');
            }

            let movie = JSON.parse(JSON.stringify(this.control.movie));
            let r_index = movie.rowIndex,
                i_index = movie.itemIndex;
            let plan_rooms = JSON.parse(JSON.stringify(this.plan_rooms));
            if (movie.originFlag) {
                // 远端存在排片数据
                let param = {
                    planUids: [`${movie.uid}`]
                };
                this.$api.deletePlan(param).then(data => {
                    let _data = data.data;
                    if (_data.tag) {
                        plan_rooms[r_index].splice(i_index, 1);
                        this.plan_rooms = this.$options.methods.resetItemIndex(plan_rooms);
                        this.control.movie = null;
                    }
                }).catch(msg => {
                    console.log(msg);
                });
            } else {
                plan_rooms[r_index].splice(i_index, 1);
                this.plan_rooms = this.$options.methods.resetItemIndex(plan_rooms);
                this.control.movie = null;
            }

        },
        /* 删除所选排期影片 */
        deletSelectPlan(e) {
            let planArray = JSON.parse(JSON.stringify(this.plan_rooms));
            // 找出需要删除远端排片
            let param = {
                planUids: []
            };

            let newPlanArray = this.$options.methods.returnBasePlanArray(planArray);
            let hasDelete = false;
            let cantDelet = false;
            for (let i = 0; i < planArray.length; i++) {
                for (let j = 0; j < planArray[i].length; j++) {
                    let c_d = planArray[i][j];
                    let deleteStatus = this.$options.methods.planDeleteStatus(c_d.planStatus);
                    if (c_d.isSelect && deleteStatus) {
                        hasDelete = true;
                        if (c_d.originFlag) {
                            param.planUids.push(c_d.uid);
                        }
                    } else {
                        newPlanArray[i].push(c_d);
                    }

                    if (!deleteStatus && c_d.isSelect) {
                        cantDelet = true;
                    }
                }
            }

            if (param.planUids.length != 0) {
                this.$api.deletePlan(param).then(data => {
                    let _data = data.data;
                    if (_data.tag) {
                        this.plan_rooms = this.$options.methods.resetItemIndex(newPlanArray);
                        this.$message({
                            showClose: true,
                            message: '删除成功！',
                            type: 'success'
                        });
                    }
                }).catch(
                    msg => {
                        console.log(msg);
                    }
                )
            } else if (hasDelete) {
                this.plan_rooms = this.$options.methods.resetItemIndex(newPlanArray);
                this.$message({
                    showClose: true,
                    message: '删除成功！',
                    type: 'success'
                });
            }

            if (cantDelet) {
                this.$message({
                    showClose: true,
                    message: '当前所选场次存在可售或未完全退票，部分不可删除',
                    type: 'warn'
                });
            }
            // 隐藏控制器
            this.$options.methods.hideControl(this);
        },
        /* 返回基础排片数组*/
        returnBasePlanArray(planArray) {
            let basePlanArray = [];
            for (let i = 0; i < planArray.length; i++) {
                basePlanArray.push([]);
            }
            return basePlanArray;
        },
        /* 删除排片 重置itemIndex */
        resetItemIndex(planArray) {
            for (let i = 0; i < planArray.length; i++) {
                let c_planArray = planArray[i];
                for (let j = 0; j < c_planArray.length; j++) {
                    c_planArray[j].itemIndex = j;
                }
            }
            return planArray;
        },
        /* 控制器 - 中途岛：用于校验用户之前是否在已保存的情况下，进行切换页面 */
        turnPageMidleWare(that, type) {
            let pointer = that ? that : this;
            pointer.editionMovie(pointer, type);
        },
        /* 控制器 - 编辑影片 */
        editionMovie(that, type) {
            let pointer = that ? that : this;

            if (!pointer.pageControlType && type != 'view') {
                return pointer.$emit('cantEdition');
            }

            let _type = type ? type : 'edition';

            if (pointer.userNeedSave) {
                return pointer.savePlan(pointer, _type);
            }

            let movie = JSON.parse(JSON.stringify(pointer.control.movie));
            let planArray = JSON.parse(JSON.stringify(pointer.plan_rooms));
            let new_movie;
            if (type) {
                new_movie = planArray[`${movie.rowIndex}`][`${movie.itemIndex}`];
            }
            let parma_obj = {
                type: _type,
                current_item: type ? new_movie : movie,
                current_row: planArray[`${Number(movie.rowIndex)}`],
                pricePlan: pointer.pricePlan
            };
            pointer.$store.commit('setMoviePlanControl', parma_obj);
            pointer.$router.push({
                path: '/CTM/moviePlan/default'
            });
        },
        /* 控制器 - 查看影片*/
        viewMoive() {
            this.$options.methods.editionMovie(this, 'view');
        },
        /* 控制器 - 连排 */
        continuityPlan() {
            if (!this.pageControlType) {
                return this.$emit('cantEdition');
            }
            console.log('触发连排！');
        },
        /* 控制器 - 停售 */
        stopSale() {
            if (!this.pageControlType) {
                return this.$emit('cantEdition');
            }
            this.$options.methods.stopOrStartSale(this, 'stop');
        },
        /* 控制器 - 开售 */
        startSale() {
            if (!this.pageControlType) {
                return this.$emit('cantEdition');
            }
            this.$options.methods.stopOrStartSale(this, 'open');
        },
        /* 控制器 - 选中同影片 */
        selectSameMoive() {
            let movie = JSON.parse(JSON.stringify(this.control.movie));
            let planArray = JSON.parse(JSON.stringify(this.plan_rooms));

            let drop_data = [];
            // 选中movieCode相同的电影
            let movieCodeFlage = movie.movieCode;
            for (let i = 0; i < planArray.length; i++) {
                for (let j = 0; j < planArray[i].length; j++) {
                    let c_d = planArray[i][j];
                    if (c_d.movieCode == movieCodeFlage) {
                        c_d.isSelect = true;
                        let movieItem = JSON.parse(JSON.stringify(c_d));
                        movieItem.rowIndex = i;
                        movieItem.itemIndex = j;
                        movieItem.positionY = this.$options.methods.innerPostionY(this, i);
                        // 校验是否可拖拽
                        let dropStatus = this.$options.methods.planDropStatus(c_d.planStatus);
                        if (dropStatus) {
                            drop_data.push(movieItem);
                        }
                    }
                }
            }
            this.plan_rooms = planArray;
            this.drop_data = drop_data;

        },
        /* 控制器 - 复制影片 */
        copyMoive() {
            if (!this.pageControlType) {
                return this.$emit('cantEdition');
            }

            let movie = JSON.parse(JSON.stringify(this.control.movie));
            delete movie.planId;
            delete movie.uid;
            let deleteArr = ['planId', 'showTimeEnd', 'showTimeStart', 'startTime', 'endTime', 'positionX', 'positionY', 'rowIndex', 'itemIndex', 'uid', 'originFlag', 'planStatus', 'plan_text', 'saleStatus', 'sale_text', 'approveStatus', 'approve_text'];
            for (let i = 0; i < deleteArr.length; i++) {
                delete movie[`${deleteArr[i]}`];
            }
            this.$emit('copyMovie', {
                isSelect: true,
                selectMoive: movie
            })
        },
        /* 重置校验用户保存操作 */
        resetSaveFlage() {
            this.origin_data = null;
            this.userNeedSave = false;
        },
        /* 提交审核 */
        submitReview(that) {
            let userNeedSave = this.userNeedSave;
            let pointer = that ? that : this;
            if (userNeedSave) {
                return
            }
        },
        /* 清除空重排 - 只能清空新建状态的排片 */
        planClean() {
            let planArray = JSON.parse(JSON.stringify(this.plan_rooms));
            let newPlanArray = this.$options.methods.returnBasePlanArray(planArray);
            // 是否存在不可删除项 提醒用户
            let cantDelete = false;
            // 远端要删除的数组
            let param = {
                planUids: []
            }
            let hasDelete = false;
            for (let i = 0; i < planArray.length; i++) {
                for (let j = 0; j < planArray[i].length; j++) {
                    let c_d = planArray[i][j];
                    let deleteStatus = this.$options.methods.planDeleteStatus(c_d.planStatus);
                    if (!deleteStatus) {
                        newPlanArray[i].push(c_d);
                        cantDelete = true;
                    } else if (c_d.originFlag) {
                        param.planUids.push(c_d.uid);
                    }

                    if (deleteStatus) {
                        hasDelete = true;
                    }
                }
            }

            if (param.planUids.length != 0) {
                this.$api.deletePlan(param).then(data => {
                    let _data = data.data;
                    if (_data.tag) {
                        this.plan_rooms = this.$options.methods.resetItemIndex(newPlanArray);
                        this.$message({
                            showClose: true,
                            message: '重排成功！',
                            type: 'success'
                        });
                    }
                }).catch(msg => {
                    console.log(msg);
                })
            } else if (hasDelete) {
                this.plan_rooms = this.$options.methods.resetItemIndex(newPlanArray);
                this.$message({
                    showClose: true,
                    message: '重排成功！',
                    type: 'success'
                });
            }

            if (cantDelete) {
                // 提示用户存在不可删除项
                this.$message({
                    showClose: true,
                    message: '当前所选场次存在可售或未完全退票，不可删除',
                    type: 'warn'
                });
            }
        },
        /* 停售/开售 */
        stopOrStartSale(that, saleStatus, isMore) {
            let pointer = that ? that : this;
            let planArray = JSON.parse(JSON.stringify(pointer.plan_rooms));
            let param = {
                cinemaUid: pointer.baseParam.uidCinema,
                saleStatus,
                planUids: []
            }
            if (isMore) {
                // 多选
                for (let i = 0; i < planArray.length; i++) {
                    for (let j = 0; j < planArray[i].length; j++) {
                        let c_d = planArray[i][j];
                        if (c_d.isSelect) {
                            let flagStatus;
                            if (saleStatus == 'stop') {
                                flagStatus = pointer.$options.methods.planStopStatus(c_d.planStatus, c_d.saleStatus);
                            } else {
                                flagStatus = pointer.$options.methods.planPlayStatus(c_d.saleStatus);
                            }
                            if (flagStatus) {
                                param.planUids.push(c_d.uid);
                            }
                        }
                    }
                }
            } else {
                let movie = JSON.parse(JSON.stringify(pointer.control.movie));
                let flagStatus;
                if (saleStatus == 'stop') {
                    flagStatus = pointer.$options.methods.planStopStatus(movie.planStatus, movie.saleStatus);
                } else {
                    flagStatus = pointer.$options.methods.planPlayStatus(movie.saleStatus);
                }
                if (flagStatus) {
                    param.planUids.push(movie.uid);
                }
            }

            if (param.planUids.length != 0) {
                pointer.$api.stopOrStartSalePlan(param).then(data => {
                    let tips;
                    if (saleStatus == 'stop') {
                        tips = '停售';
                    } else {
                        tips = '开售'
                    }
                    pointer.$message({
                        message: `${tips}操作成功！`,
                        type: 'success'
                    });
                    pointer.$emit('initMoivePlan');
                }).catch(msg => {
                    console.log(msg);
                })
            }
        },
        /* 暂停销售 */
        planStop() {
            this.$options.methods.stopOrStartSale(this, 'stop', true);
        },
        /* 恢复销售 */
        planOpen() {
            this.$options.methods.stopOrStartSale(this, 'open', true);
        },
        /* 校验 - 当前场次是否为可删除状态 */
        planDeleteStatus(status) {
            let deleteStatus = false;
            if (status == 'NEW' || !status) {
                deleteStatus = true;
            }
            return deleteStatus;
        },
        /* 校验 - 当前场次是否为可拖作状态 */
        planDropStatus(status) {
            let statusFlage = false;
            if (status == 'NEW' || !status) {
                statusFlage = true;
            }
            return statusFlage;
        },
        /* 校验 - 场次是否可停售 */
        planStopStatus(planStatus, saleStatus) {
            let status = false;
            if (planStatus == 'VALID' && saleStatus == 'SALE') {
                status = true;
            }
            return status;
        },
        /* 校验 - 场次是否为可销售 */
        planPlayStatus(saleStatus) {
            let status = false;
            if (saleStatus == 'STOP') {
                status = true;
            }
            return status;
        },
        /* 校验 - 场次是否有留座 */
        planHaveKeep() {

        },
        /* 提示 - 高亮 */

        /* 审核通过 / 驳回 */
        approvePassPlan(type) {
            let planArray = JSON.parse(JSON.stringify(this.plan_rooms));
            let planUids = [];
            // 用户是否选中
            let isHasSelect = false;
            // 提示信息 是否存在不可修改
            let isHasSuccess = false;
            let isHasError = false;
            let successTips = `部分场次可${type == 'pass' ? '通过' : '驳回'}已执行操作`;
            let errorTips = `存在部分场次${type == 'pass' ? '通过' : '驳回'}不可操作`;

            for (let i = 0; i < planArray.length; i++) {
                for (let j = 0; j < planArray[i].length; j++) {
                    let c_d = planArray[i][j];
                    if (c_d.isSelect && c_d.approveStatus == 'WAIT_APPROVE') {
                        planUids.push(c_d.uid);
                        if (!isHasSuccess) {
                            isHasSuccess = true;
                        }
                    }
                    if (!isHasError && c_d.isSelect && c_d.approveStatus == 'APPROVED') {
                        isHasError = true;
                    }
                    if (!isHasSelect && c_d.isSelect) {
                        isHasSelect = true;
                    }
                }
            }

            let tips = ``;
            if (isHasSuccess && isHasError) {
                tips = successTips + `,` + errorTips;
            } else if (isHasSuccess) {
                tips = successTips;
            } else {
                tips = errorTips;
            }

            if (isHasSelect) {
                if (planUids.length != 0) {
                    let param = {
                        actionType: type,
                        cinemaUid: this.baseParam.cinemaUid,
                        planUids
                    }
                    this.$api.approvePassPlan(param).then(data => {
                        // 刷新页面
                        this.$emit('initMoivePlan', {
                            type: null
                        });
                        this.$message({
                            message: tips,
                            type: 'success'
                        });
                    }).catch(msg => {
                        this.$message({
                            message: `${type == 'pass' ? '通过' : '驳回'}操作错误，请稍后进行`,
                            type: 'error'
                        });
                        console.log(msg);
                    })
                } else {
                    this.$message({
                        message: tips,
                        type: 'error'
                    });
                }
            } else {
                this.$message({
                    message: `请选中后再进行${type == 'pass' ? '通过' : '驳回'}操作`,
                    type: 'warn'
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.movie-plan-window {
    max-height: 640px;
    min-width: 915px;
    overflow: auto;
    position: relative;
    box-shadow: inset 2px 2px 15px 0px rgba(0, 0, 0, 0.13);

    .content {
        margin-left: 30px;

        .row_content:nth-of-type(2n-1) {
            background: #d6d2d257;
        }

        .row_content {
            ul {
                height: 100%;
                position: relative;
                justify-content: unset;

                .filmItem {
                    // height: 64px;
                    position: absolute;
                    background: white;

                    .film-header {
                        height: 3px;
                    }

                    .film-content {
                        height: 61px;
                        justify-content: center;
                        align-items: flex-start;
                        flex-direction: column;

                        div {
                            font-size: 12px;
                            margin-left: 10px;
                        }

                        div:nth-of-type(1) {
                            font-weight: bold;
                            width: 80%;
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

                .isSelect {
                    box-shadow: 0px 0px 0px 2px #3B74FF;

                    // .film-header {
                    //     background: #3B74FF !important;
                    // }

                    // .film-content {
                    //     background: #3B74FF !important;

                    //     div {
                    //         color: white !important;
                    //     }
                    // }
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
                    height: 61px;
                    justify-content: center;
                    align-items: flex-start;
                    flex-direction: column;

                    div {
                        font-size: 12px;
                        margin-left: 10px;
                    }

                    div:nth-of-type(1) {
                        font-weight: bold;
                        width: 80%;
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
        background: rgba(3, 3, 3, 0.17);
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
                    height: 61px;
                    justify-content: center;
                    align-items: flex-start;
                    flex-direction: column;

                    div {
                        font-size: 12px;
                        margin-left: 10px;
                    }

                    div:nth-of-type(1) {
                        font-weight: bold;
                        width: 80%;
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
        margin-left: 30px;
    }

    // 控制器
    .item-controls {
        position: absolute;
        margin-left: 30px;

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
