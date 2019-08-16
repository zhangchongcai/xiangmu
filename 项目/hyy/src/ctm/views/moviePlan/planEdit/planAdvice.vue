<template>
    <div class="plan-advice">
        <div class="delete-ban-btn" @click="closeAdvice">
            <i class="iconfont icon-neiye-danchuangquxiao"></i>
        </div>
        <div class="title">总部排片指导</div>
        <div class="film-ban">
            <div class="select-show">
                <div :class="{active: !showIndex}" @click="changeDataShow(0)" data-type="planNum">场次</div>
                <div :class="{active: showIndex}" @click="changeDataShow(1)" data-type="planPercent">排片占比</div>
            </div>
            <div class="data-header">
                <div class="data-title">指导</div>
                <div class="data-title">我的</div>
            </div>
            <ul class="ban-content">
                <li v-for="(item, index) in adviceData" :key="index">
                    <div class="film-name">
                        <div :style="{background: item.color}"></div>
                        <div class="text-hide" :title="item.movieInfoVoList.map(citem => citem.movieName).join(',')">{{item.movieInfoVoList.map(citem => citem.movieName).join(',')}}</div>
                    </div>
                    <div class="data-detail" v-show="!showIndex" v-if="item.isAdvice">
                        <el-tooltip class="guide-tip-class" effect="dark" :content="item.guideType == 1 ? '强制排片指导' : '建议排片指导'" placement="bottom">
                            <div class="reference" v-if="!item.numNoCheck" :style="{color: item.guideType == 1 ? '#FC4040' : '#F5A623'}">{{item.movieDetailVoList.find(citem => citem.detailType != 'h').timeNumLower == item.movieDetailVoList.find(citem => citem.detailType != 'h').timeNumLower ? item.movieDetailVoList.find(citem => citem.detailType != 'h').timeNumLower : item.movieDetailVoList.find(citem => citem.detailType != 'h').timeNumLower + '-' + item.movieDetailVoList.find(citem => citem.detailType != 'h').timeNumUpper}}场</div>
                        </el-tooltip>
                        <div class="reference" v-if="item.numNoCheck">- -</div>
                        <div class="my-data" :style="{color: item.isNumErr ? item.guideType == 1 ? '#FC4040' : '#F5A623' : '#3B74FF'}"><span v-if="item.isNumErr">!</span>{{item.myNum}}场</div>
                    </div>
                    <div class="data-detail" v-show="!showIndex" v-if="!item.isAdvice">
                        <div class="reference">- -</div>
                        <div class="my-data" >{{item.myNum}}场</div>
                    </div>
                    <div class="data-detail" v-show="showIndex" v-if="item.isAdvice">
                        <el-tooltip class="guide-tip-class" effect="dark" :content="item.guideType == 1 ? '强制排片指导' : '建议排片指导'" placement="bottom">
                            <div class="reference" v-if="!item.rangeNoCheck" :style="{color: item.guideType == 1 ? '#FC4040' : '#F5A623'}">{{item.movieDetailVoList.find(citem => citem.detailType != 'h').timeRatioLower + '-' + item.movieDetailVoList.find(citem => citem.detailType != 'h').timeRatioUpper}}%</div>
                        </el-tooltip>
                        <div class="reference" v-if="item.rangeNoCheck">- -</div>
                        <div class="my-data" :style="{color: item.isPerErr ? item.guideType == 1 ? '#FC4040' : '#F5A623' : '#3B74FF'}"><span v-if="item.isPerErr">!</span>{{item.myPer}}%</div>
                    </div>
                    <div class="data-detail" v-show="showIndex" v-if="!item.isAdvice">
                        <div class="reference">- -</div>
                        <div class="my-data" >{{item.myPer}}%</div>
                    </div>
                </li>
            </ul>

            <!-- <ul class="ban-content" v-show="!showIndex">
                <li v-for="(item, index) in adviceData" :key="index">
                    <div v-if="item.isAdvice" class="advice-div">指导<span class="advice-type" v-if="item.guideType == 1">(强制)</span><span class="advice-range">{{item.timeNumLower + '场-' + item.timeNumUpper + '场'}}</span></div>
                    <div class="reality-div"><span class="advice-film-name" :title="item.movieName">{{item.movieName}}</span><span class="my-range" :class="item.isNumErr ? 'err' : ''">{{item.myNum}}场</span></div>
                </li>
            </ul>
            <ul class="ban-content" v-show="showIndex">
                <li v-for="(item, index) in adviceData" :key="index">
                    <div v-if="item.isAdvice" class="advice-div">指导<span class="advice-type" v-if="item.guideType == 1">(强制)</span><span class="advice-range">{{item.timeRatioLower + '%-' + item.timeRatioUpper + '%'}}</span></div>
                    <div class="reality-div"><span class="advice-film-name" :title="item.movieName">{{item.movieName}}</span><span class="my-range" :class="item.isPerErr ? 'err' : ''">{{item.myPer + '%'}}</span></div>
                </li>
            </ul> -->
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            adviceData: {
                type: Array,
                required: true
            },
            showAdvice: {
                type: Boolean
            }
        },
        data() {
            return {
                showIndex: 1,

            }
        },
        methods: {
            changeDataShow(index) {
                this.showIndex = index
            },
            closeAdvice() {
                this.$emit('closeLeftTool', 'advice')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .plan-advice {
        padding: 10px;
        width: 177px;
        height: 40%;
        box-sizing: border-box;
        background: #F5F5F5;
        position: relative;
        .delete-ban-btn {
            color: grey;
            position: absolute;
            right: 10px;
            top: 5px;
            cursor: pointer;
            .iconfont {
                font-size: 10px;
            }
        }
        .title {
            color: #333333;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 12px;
        }
        .film-ban {
            height: calc(100% - 24px);
            overflow: hidden;
            .data-type {
                color: #333333;
                font-size: 12px;
                font-weight: 600;
                margin-bottom: 15px;
                height: 16px;
                line-height: 16px;
                font-size: 12px;
            }
            width: 100%;
            .select-show {
                margin: 0 6px;
                width: calc(100% - 12px);
                height: 24px;
                box-sizing: border-box;
                border-radius: 3px;
                overflow: hidden;
                text-align: center;
                border: 1px solid #3b74ff;
                font-size: 0;

                .active {
                    background: #3b74ff;
                    color: #ffffff;
                }

                div {
                    line-height: 24px;
                    color: #6591ff;
                    width: 50%;
                    height: 100%;
                    font-size: 12px;
                    display: inline-block;
                    cursor: pointer;
                }
            }
            .data-header {
                margin: 5px 0;
                width: 100%;
                height: 18px;
                line-height: 18px;
                font-size: 0;
                & > div {
                    width: 50%;
                    font-size: 12px;
                    display: inline-block;
                    height: 18px;
                    line-height: 18px;
                    text-align: center;
                    cursor: pointer;
                    &:nth-child(1) {
                        color: #FB4242;
                    }
                    &:nth-child(2) {
                        color: #3B74FF;
                    }
                }        
            }
            .ban-content {
                // height: 320px;
                height: calc(100% - 52px);
                width: 100%;
                overflow-y: auto;
                overflow-x: unset;

                li {
                    padding: 5px 0;
                    // margin-bottom: 10px;
                    color: #666666;
                    .film-name {
                        width: 130px;
                        height: 16px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        line-height: 6px;
                        margin-bottom: 5px;
                        div:nth-of-type(1) {
                            display: inline-block;
                            width: 8px;
                            height: 8px;
                            margin-right: 2px;
                        }
                        div:nth-of-type(2) {
                            display: inline-block;
                            width: 120px;
                            height: 16px;
                            line-height: 16px;
                            vertical-align: middle;
                        }
                        div {
                            font-size: 12px;
                        }
                    }

                    // .ban-right {
                    //     height: 18px;
                    //     float: right;
                    //     font-size: 12px;
                    //     line-height: 18px;
                    //     position: relative;
                    //     top: 2px;
                    // }
                    .data-detail {
                        font-size: 0;
                        padding-left: 12px;
                        div {
                            font-size: 12px;;
                            text-align: left;
                            height: 14px;
                            line-height: 14px;
                            display: inline-block;
                            letter-spacing: 0.5px;
                        }
                        .reference {
                            width: 50px;
                            margin-right: 28px;
                        }
                        .my-data {
                            color: #3B74FF;
                        }
                    }
                }

                li:nth-last-of-type(1) {
                    margin-bottom: unset;
                }
            }
        }
    }
</style>