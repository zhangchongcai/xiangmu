<template>
<section class="flex-base" v-bind:style="{width: width + 'px'}">
    <ul class="left flex-base">
        <li class="flex-base">
            <span>影厅总数：</span>
            <span>{{filmTips.roomNum}}</span>
        </li>
        <li class="flex-base">
            <span>座位总数：</span>
            <span>{{filmTips.seatCount}}</span>
        </li>
    </ul>
    <ul class="right flex-base">
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
                    text: '审批中',
                    class: 'going',
                },
                // {
                //     text: '已驳回',
                //     class: 'warn',
                // },
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
    justify-content: space-between;
    min-width: 1044px;
    color: #4A4A4A;

    .left {
        li {
            margin-right: 25px;

            span:nth-of-type(1) {}

            span:nth-of-type(2) {
                color: #3B74FF;
            }
        }
    }

    .right {
        li {
            margin-right: 20px;

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
