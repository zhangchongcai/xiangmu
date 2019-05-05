<template>
<section :style="{width: width +'px'}">
    <div class="scale-window">
        <ul class="content flex-base" :style="{left:'-'+scrollX +'px'}">
            <li class="time-item flex-base">
                <div class="time" style="opacity: 0">05:00</div>
                <ul class="line flex-base">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </li>
            <li class="time-item flex-base" v-for="(time_item,time_item_index) in timeLine" :key="time_item_index">
                <div class="time">{{time_item}}</div>
                <ul class="line flex-base">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </li>
        </ul>
    </div>
    <div class="chaneg-scale">
        <el-tooltip class="item" effect="dark" content="时间轴设定" placement="left">
            <div @click="changeScaleDialogVisible = true"><i class="iconfont icon-neiye-shijianzhousheding"></i></div>
        </el-tooltip>
    </div>
    <el-dialog custom-class="changeScaleDialog" title="时间轴设置" :visible.sync="changeScaleDialogVisible" width="30%" left>
        <!-- 弹窗内容 开始-->
        <div class="flex-base">
            <div><span>*</span>拖动精度： <input type="text" placeholder="请输入" v-model="dragPrecision" title="请输入一个介于1和60之间的值"> 分钟</div>
                <div><span>*</span>场次间隔： <input type="text" placeholder="请输入" v-model="timeInterval" title="请输入一个介于1和99之间的值"> 分钟</div>
                </div>
                <!-- 弹窗内容 结束 -->
                <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="changeScale">确 定</el-button>
                <el-button @click="cancleChangeScale">取 消</el-button>
        </span>
    </el-dialog>
</section>
</template>

<script>
export default {
    props: {
        scrollX: {
            type: Number,
            required: true
        },
        width: {
            type: Number,
            required: true
        },
        scaleConfig: {
            type: Object
        }
    },
    watch: {
        scaleConfig(data, old_data) {
            let _data = JSON.parse(JSON.stringify(data));
            this.$options.methods.initScale(this, _data);
        }
    },
    data() {
        return {
            startTime: 6,
            betweenTime: 24,
            timeLine: [],
            normalWidth: null,
            changeScaleDialogVisible: false,
            dragPrecision: null,
            timeInterval: null
        }
    },
    created() {
        this.normalWidth = window.innerWidth;
    },
    mounted() {
        let startTime = this.startTime;
        let betweenTime = this.betweenTime;
        let timeLine = [];
        for (let i = 0; i <= betweenTime; i++) {
            if (startTime < 24) {
                if (startTime < 10) {
                    timeLine.push('0' + startTime + ':00');
                } else {
                    timeLine.push(startTime + ':00');
                }
            } else {
                startTime = startTime - 24;
                timeLine.push('0' + startTime + ':00');
            }
            startTime++;
        }
        this.timeLine = timeLine;
    },
    methods: {
        /* 修改时间轴 */
        changeScale() {
            let scaleConfig = JSON.parse(JSON.stringify(this.scaleConfig));

            let dragPrecision = Number(this.dragPrecision);
            let timeInterval = Number(this.timeInterval);

            let precisionFlage = false;
            let precisionTips = '拖动精度栏请输入一个介于1和60之间的整数';
            let timeIntervalFlage = false;
            let timeIntervalTips = '场次间隔栏请输入一个介于1和99之间的整数';

            if (1 <= dragPrecision && dragPrecision <= 60 && /^\+?[1-9][0-9]*$/.test(dragPrecision)) {
                precisionFlage = true;
            }
            if (1 <= timeInterval && timeInterval <= 99 && /^\+?[1-9][0-9]*$/.test(timeInterval)) {
                timeIntervalFlage = true;
            }
            let errorTips = '';
            if (!precisionFlage && !timeIntervalFlage) {
                errorTips = precisionTips + ',' + timeIntervalTips;
            } else if (!precisionFlage) {
                errorTips = precisionTips;
            } else if (!timeIntervalFlage) {
                errorTips = timeIntervalTips;
            }

            if (precisionFlage && timeIntervalFlage) {
                if (scaleConfig.dragPrecision != dragPrecision || scaleConfig.timeInterval != timeInterval) {
                    this.$emit('saveChangeScale', {
                        dragPrecision,
                        timeInterval
                    });
                }
                this.changeScaleDialogVisible = false;
            } else {
                this.error(errorTips)
            }
        },
        /* 取消修改 */
        cancleChangeScale() {
            let scaleConfig = JSON.parse(JSON.stringify(this.scaleConfig));
            this.$options.methods.initScale(this, scaleConfig);
            this.changeScaleDialogVisible = false;
        },
        /* 初始化刻度尺 */
        initScale(that, data) {
            let pointer = that ? that : this;
            pointer.dragPrecision = data.dragPrecision;
            pointer.timeInterval = data.timeInterval;
        }
    }
};
</script>

<style lang="scss" scoped>
section {
    height: 30px;
    background-color: #f5f5f5;
    padding-right: 32px;
    box-sizing: border-box;
    position: relative;
}
.scale-window {
    min-width: 915px;
    width: 100%;
    height: 30px;
    overflow: hidden;
    position: relative;
    float: left;
}

.content {
    justify-content: flex-start;
    // margin-left: 30px;
    position: absolute;
    bottom: 0;

    .time-item {
        height: 27px;
        width: 60px;
        align-items: flex-start;
        position: relative;
        flex-direction: column;

        .time {
            font-size: 12px;
            color: #666666;
            position: relative;
            right: 15px;
        }

        .line {
            align-items: flex-end;

            li:nth-of-type(1) {
                height: 9px;
            }

            li {
                background: #666666;
                width: 1px;
                height: 4px;
                margin-right: 11px;
            }
        }
    }

    // .time-item:nth-last-of-type(1) {
    //     width: 49px;

    //     .line {
    //         li:nth-last-of-type(1) {
    //             margin-right: unset;
    //         }
    //     }
    // }
}

.chaneg-scale {
    height: 12px;
    width: 12px;
    position: absolute;
    right: 10px;
    top: 5px;
    div {
        width: 12px;
        height: 12px;
        cursor: pointer;
        color: #3b74ff;
        .iconfont {
            font-size: 12px;
           display: block;
        }
    }
}

.changeScaleDialog {
    .el-dialog__body {
        &>div {
            flex-direction: column;

            div {
                font-size: 12px;

                span {
                    color: #F33430;
                    font-size: 12px;
                }

                input {
                    border: 1px solid #BCBCBC;
                    border-radius: 4px;
                    width: 144px;
                    height: 32px;
                    text-indent: 16px;
                }
            }

            div:nth-of-type(1) {
                margin-bottom: 16px;
            }

        }
    }
}
</style>
