<template>
<div class="film-ban-container">
    <div class="delete-ban-btn" @click="closeFilmBan">
        <i class="iconfont icon-neiye-danchuangquxiao"></i>
    </div>
    <div class="title">竞对排片参考</div>
    <div style="height: calc(100% - 24px)">
        <div class="cur-vie" :title="banData.consultCinemaName">当前参考: {{banData.consultCinemaName}}</div>
        <div class="film-ban">
            <div class="data-type">全天</div>
            <div class="select-show">
                <div :class="{active: !allDayShowIndex}" @click="changeBanDataShow('allDay', 0)" data-type="planNum">场次</div>
                <div :class="{active: allDayShowIndex}" @click="changeBanDataShow('allDay', 1)" data-type="planPercent">排片占比</div>
            </div>
            <div class="data-header">
                <div class="data-title">参考</div>
                <div class="data-title">我的</div>
            </div>
            <ul class="ban-content">
                <li v-for="(item, index) in banData.myData" :key="index">
                    <div class="film-name">
                        <div :style="{background: item.color}"></div>
                        <div class="text-hide" :title="item.movieName">{{item.movieName}}</div>
                    </div>
                    <div class="data-detail" v-show="!allDayShowIndex">
                        <div class="reference">{{banData.consultData[index].scene}}场</div>
                        <div class="my-data">{{banData.myData[index].scene}}场</div>
                    </div>
                    <div class="data-detail" v-show="allDayShowIndex">
                        <div class="reference">{{banData.consultData[index].scenePer}}%</div>
                        <div class="my-data">{{banData.myData[index].scenePer}}%</div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="line"></div>
        <div class="film-ban">
            <div class="data-type">黄金时段</div>
            <div class="select-show">
                <div :class="{active: !globalShowIndex}" @click="changeBanDataShow('global', 0)" data-type="planNum">场次</div>
                <div :class="{active: globalShowIndex}" @click="changeBanDataShow('global', 1)" data-type="planPercent">排片占比</div>
            </div>
            <div class="data-header">
                <div class="data-title">参考</div>
                <div class="data-title">我的</div>
            </div>
            <ul class="ban-content" >
                <li v-for="(item, index) in banData.myData" :key="index">
                    <div class="film-name">
                        <div :style="{background: item.color}"></div>
                        <div class="text-hide" :title="item.movieName">{{item.movieName}}</div>
                    </div>
                    <div class="data-detail" v-show="!globalShowIndex">
                        <div class="reference">{{banData.consultData[index].goldScene}}场</div>
                        <div class="my-data">{{banData.myData[index].goldScene}}场</div>
                    </div>
                    <div class="data-detail" v-show="globalShowIndex">
                        <div class="reference">{{banData.consultData[index].goldScenePer}}%</div>
                        <div class="my-data">{{banData.myData[index].goldScenePer}}%</div>
                    </div>
                </li>
            </ul>

        </div>
    </div>
</div>
</template>

<script>
export default {
    props: {
        banData: {
            type: Object,
            required: true
        },
        showBan: {
            type: Boolean
        }
    },
    data() {
        return {
            allDayShowIndex: 1,
            globalShowIndex: 1
        };
    },
    mounted() {},
    methods: {
        changeBanShow() {
            this.banShowNum = !this.banShowNum
        },
        changeBanDataShow(type, index) {
           if (type == 'allDay') {
                this.allDayShowIndex = index
           } else {
                this.globalShowIndex = index
           }
        },
        closeFilmBan() {
            this.$emit('closeLeftTool', 'ban')
        }
    }
};
</script>

<style lang="scss" scoped>
.film-ban-container {
    padding: 10px;
    width: 177px;
    height: 60%;
    box-sizing: border-box;
    background: #F5F5F5;
    position: relative;
    // float: left;
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
        margin-bottom: 6px;
    }
    .film-ban {
        height: calc(50% - 15px);
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
                    color: #3B74FF;
                }
                &:nth-child(2) {
                    color: #FF501D;
                }
            }        
        }
        .ban-content {
            // height: 320px;
            height: calc(100% - 83px);
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
                        color: #3B74FF;
                        width: 78px;
                    }
                    .my-data {
                        color: #FF501D;
                    }
                }
            }

            li:nth-last-of-type(1) {
                margin-bottom: unset;
            }
        }
    }
    .cur-vie {
        color: #333;
        // font-weight: 600;
        height: 14px;
        line-height: 14px;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        margin-bottom: 6px;
    }
    
}
</style>
