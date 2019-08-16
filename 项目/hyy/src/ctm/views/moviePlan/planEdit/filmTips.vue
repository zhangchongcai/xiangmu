<template>
    <section style="width: 100%">
        <ul class="left">
            <li class="flex-base">
                <span>影厅总数：</span>
                <span>{{filmTips.roomNum}}</span>
            </li>
            <li class="flex-base">
                <span>座位总数：</span>
                <span>{{filmTips.seatCount}}</span>
            </li>
        </ul>
        <ul class="right">
            <li class="flex-base" v-for="(statusItem,index) in statusArr" :key="index">
                <span>{{statusItem.text}}</span>
                <div class="triangle-relative" :class="statusItem.class"></div>
            </li>
        </ul>
    </section>
</template>

<script>
export default {
    props: {
        width: {
            type: Number,
            required: true
        },
        filmTips: {
            type: Object,
            required: true,
            default: {
                seatCount: 0,
                roomNum: 0
            }
        }
    },
    data() {
        return {
            statusArr: [
                {
                    text: '已审批',
                    class: 'success',
                },
                {
                    text: '待审批',
                    class: 'going',
                },
                {
                    text: '已驳回',
                    class: 'warn',
                },
                {
                    text: '已停售',
                    class: 'stop',
                },
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
span {
    font-size: 12px;
}

section {
    height: 32px;
    background: #F5F5F5;
    // min-width: 1044px;
    color: #4A4A4A;
    padding: 8px 12px;
    box-sizing: border-box;
    position: relative;
    z-index: 99;
    .left {
        float: left;
        padding-left: 10px;
        li {
            margin-right: 28px;
            float: left;
            height: 16px;
            line-height: 16px;
            span:nth-of-type(1) {}

            span:nth-of-type(2) {
                color: #3B74FF;
            }
        }
    }

    .right {
        float: right;
        li {
            margin-right: 28px;
            float: left;
            height: 16px;
            line-height: 16px;
            span {
                margin-right: 5px;
            }

            div {}
        }
    }

    ul {
        li:nth-last-of-type(1) {
            margin-right: unset;
        }
    }
}
</style>
