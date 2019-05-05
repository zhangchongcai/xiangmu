<template>
<section>
    <div class="title">
        <div class="hall-title">影厅列表</div>
        <div>
            <i class="iconfont icon-neiye-piankushezhi"></i>
        </div>
    </div>
    <div class="content" :style="{height: contentSize.height + 'px'}">
        <ul :style="{top: '-'+ scrollY + 'px'}">
            <el-checkbox-group v-model="checkedHall" @change="handleCheckedHallsChange">
                <li class="room-item flex-base" v-for="(rooms_item,rooms_item_index) in rooms" :key="rooms_item_index" :data-index="rooms_item_index">
<!--                    <div>{{rooms_item.hall_name}}</div>-->
                    <el-checkbox @change="handleCurrentHall(rooms_item_index)" :disabled="rooms_item.isDisabled" :indeterminate="rooms_item.isIndeterminate" :label="rooms_item_index" :key="rooms_item.hall_name">{{rooms_item.hall_name}}</el-checkbox>
                    <div>{{rooms_item.hall_type}} | {{rooms_item.seat_count}}座</div>
                    <ul class="flex-base">
                        <li>{{rooms_item.saleNum}}人</li>
                        <li>{{rooms_item.saleMoney}}元</li>
                        <li>{{rooms_item.seatPercent}}</li>
                    </ul>
                </li>
            </el-checkbox-group>

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
        },
        mode: {
            type: Number,
            default: 1
        },
        hallOptions: {
            type: Array,
            required: true,
        },
        filteredHallOptions: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            checkedHall: [],

        };
    },
    mounted() {
        this.$eventHub.$on('updateCheckedHall', this.updateCheckedHall)
    },
    methods: {

        handleCurrentHall(index) {
            this.$emit('updateIsIndeterminateByIndex', index)
        },
        updateCheckedHall(val) {
            this.checkedHall = val
        },
        handleCheckedHallsChange(value) {
            let checkedCount = value.length
            this.$eventHub.$emit("handleCheckAll", checkedCount === this.filteredHallOptions.length, checkedCount > 0 && checkedCount < this.filteredHallOptions.length)
            this.$eventHub.$emit('selectRoomByHall', value)
        },
        handleCheckedHall(val) {
            this.checkedHall = val
        },
        selectRooms(e) {
            // if (!this.mode) return
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
section {
    float: left;
}
.title {
    width: 128px;
    height: 30px;
    box-sizing: border-box;
    padding-left: 10px;
    background-color: #f5f5f5;
    div:nth-of-type(1) {
        height: 30px;
        line-height: 30px;
        display: inline-block;
        font-size: 14px;
        color: #333333;
        font-weight: bold;
        margin-right: 10px;
    }

    div:nth-of-type(2) {
        height: 30px;
        line-height: 30px;
        display: inline-block;
        width: 14px;
        height: 14px;
        color: #3B74FF;
        line-height: 14px;
        cursor: pointer;
    }
}

.content {
    width: 128px;
    height: calc(100% - 30px);
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
            box-sizing: border-box;
            padding: 0 8px;
            justify-content: center;
            align-items: flex-start;
            flex-direction: column;
            background: #fff;

            div:nth-of-type(1) {
                font-size: 12px;
            }

            div:nth-of-type(2) {
                font-size: 12px;
                margin-top: 7px;
                margin-bottom: 7px;
                color: #999999;
            }

            ul {
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
