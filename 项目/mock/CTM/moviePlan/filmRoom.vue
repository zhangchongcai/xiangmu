<template>
<section>
    <div class="title flex-base">
        <div>影厅列表</div>
        <div>
            <i class="iconfont icon-neiye-piankushezhi"></i>
        </div>
    </div>
    <div class="content" v-bind:style="{height: contentSize.height + 'px'}">
        <ul v-bind:style="{top: '-'+ scrollY + 'px'}">
            <li class="room-item flex-base" v-for="(rooms_item,rooms_item_index) in rooms" v-bind:key="rooms_item_index" v-bind:data-index="rooms_item_index" @click="selectRooms">
                <div>{{rooms_item.hall_name}}</div>
                <div>{{rooms_item.hall_type_code}} | {{rooms_item.seat_count}}座</div>
                <ul class="flex-base">
                    <li>{{rooms_item.saleNum}}人</li>
                    <li>{{rooms_item.saleMoney}}元</li>
                    <li>{{rooms_item.seatPercent}}</li>
                </ul>
            </li>
        </ul>
    </div>
</section>
</template>

<script>
export default {
    props: {
        scrollY: {
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
                height: 0
            }
        }
    },
    data() {
        return {

        };
    },
    methods: {
        selectRooms(e) {
            let element = e.target;
            let hasRoomItem = element.classList.value.indexOf('room-item');
            let index = element.dataset.index;
            while (hasRoomItem == -1) {
                element = element.parentElement;
                hasRoomItem = element.classList.value.indexOf('room-item');
                index = element.dataset.index;
            }
            this.$emit('selectRoom', {
                index
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.title {
    width: 128px;
    height: 38px;

    div:nth-of-type(1) {
        font-size: 14px;
        color: #333333;
    }

    div:nth-of-type(2) {
        width: 14px;
        height: 14px;
        color: #3B74FF;
        line-height: 14px;
        cursor: pointer;
    }
}

.content {
    width: 128px;
    height: 640px;
    max-height: 640px;
    position: relative;
    overflow: hidden;

    &>ul {
        width: 100%;
        position: absolute;
        .room-item:nth-of-type(2n-1) {
            background: #E6E6E6;
        }
        .room-item {
            width: 100%;
            height: 80px;
            justify-content: center;
            align-items: flex-start;
            flex-direction: column;
            background: #f8f8f8;

            div:nth-of-type(1) {
                margin-left: 10px;
                font-size: 12px;
            }

            div:nth-of-type(2) {
                margin-left: 10px;
                font-size: 12px;
                margin-top: 7px;
                margin-bottom: 7px;
                color: #999999;
            }

            ul {
                margin-left: 10px;
                width: 90%;
                justify-content: space-between;

                li {
                    font-size: 12px;
                    color: #3b74ff;
                }
            }
        }
    }
}
</style>
