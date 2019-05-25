<template>
<section v-if="showBan">
    <div class="delete-ban-btn" v-on:click="closeFilmBan">
        <i class="iconfont icon-neiye-danchuangquxiao"></i>
    </div>
    <div class="film-ban flex-base" v-if="banData.filmsBan">
        <div class="title">排片参考</div>
        <div class="select-show flex-base">
            <div v-bind:class="{active:banShowNum}" v-on:click="changeBanShow">场次</div>
            <div v-bind:class="{active:!banShowNum}" v-on:click="changeBanShow">排片占比</div>
        </div>
        <ul class="ban-content">
            <li class="flex-base" v-for="(ban_item,ban_item_index) in banData.filmsBan" v-bind:key="ban_item_index">
                <div class="ban-left flex-base">
                    <div v-bind:style="{background: ban_item.color}"></div>
                    <div>{{ban_item.movieName}}</div>
                </div>
                <div class="ban-right">{{banShowNum ? ban_item.planNum + '场': ban_item.planPercent + '%'}}</div>
            </li>
        </ul>
    </div>
    <div class="line" v-if="banData.filmsBan"></div>
    <div class="film-ban flex-base">
        <div class="title">我的数据</div>
        <div class="select-show flex-base">
            <div v-bind:class="{active:myShowNum}" v-on:click="changeMyDataShow" data-type="planNum">场次</div>
            <div v-bind:class="{active:!myShowNum}" v-on:click="changeMyDataShow" data-type="planPercent">排片占比</div>
        </div>
        <ul class="ban-content">
            <li class="flex-base" v-for="(myData_item,myData_item_index) in banData.myBan" v-bind:key="myData_item_index">
                <div class="ban-left flex-base">
                    <div v-bind:style="{background: myData_item.color}"></div>
                    <div class="text-hide" :title="myData_item.movieName">{{myData_item.movieName}}</div>
                </div>
                <div class="ban-right">{{myShowNum ? myData_item.planNum + '场': myData_item.planPercent + '%'}}</div>
            </li>
        </ul>
    </div>
</section>
</template>

<script>
export default {
    props: {
        banData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            banShowNum: true,
            myShowNum: true,
            showBan: true
        };
    },
    mounted() {},
    methods: {
        changeBanShow() {
            this.banShowNum = !this.banShowNum;
        },
        changeMyDataShow(e) {
            let type = e.target.dataset.type;
            let isShowNum = false;
            if(type == 'planNum') {
                isShowNum = true;
            }
            this.myShowNum = isShowNum;
        },
        closeFilmBan() {
            this.showBan = false;
            this.$emit('closeFilmBan');
        },
        showFilmBan() {
            this.showBan = true;
        }
    }
};
</script>

<style lang="scss" scoped>
section {
    background: #F5F5F5;
    margin-right: 4px;
    position: relative;

    .delete-ban-btn {
        color: grey;
        position: absolute;
        right: 10px;
        top: 5px;
        cursor: pointer;
    }

    .film-ban {
        width: 154px;
        flex-direction: column;
        justify-content: flex-start;

        .title {
            align-self: flex-start;
            color: #333333;
            margin: 11px 0 13px 13px;
        }

        .select-show {
            width: 134px;
            height: 20px;
            border-radius: 3px;
            overflow: hidden;
            line-height: 20px;
            text-align: center;
            border: 1px solid #3b74ff;

            .active {
                background: #3b74ff;
                color: #ffffff;
            }

            div {
                color: #6591ff;
                width: 67px;
                height: 100%;
                font-size: 10px;
                cursor: pointer;
            }
        }

        .ban-content {
            margin-top: 10px;
            height: 190px;
            width: 134px;
            overflow-y: auto;
            overflow-x: unset;

            li {
                height: 18px;
                margin-bottom: 10px;
                justify-content: space-between;
                color: #666666;

                .ban-left {
                    div:nth-of-type(1) {
                        width: 9px;
                        height: 9px;
                        margin-right: 6px;
                    }
                    div:nth-of-type(2) {
                        width: 85px;
                    }
                    div {
                        font-size: 12px;
                    }
                }

                .ban-right {
                    font-size: 12px;
                }
            }

            li:nth-last-of-type(1) {
                margin-bottom: unset;
            }
        }
    }

    .line {
        width: 140px;
        height: 1px;
        background: #66666659;
        margin: 10px auto 0;
    }
}
</style>
