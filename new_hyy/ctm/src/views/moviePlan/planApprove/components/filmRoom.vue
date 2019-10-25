<template>
  <section style="height: 100%">
    <div class="title">
      <div class="hall-title">影厅列表</div>
      <!--        <div>-->
      <!--            <i class="iconfont icon-neiye-piankushezhi"></i>-->
      <!--        </div>-->
    </div>
    <div class="content">
      <ul :style="{top: '-'+ scrollY + 'px', height: contentSize.height + 'px'}">
        <li class="room-item flex-base" v-for="(rooms_item,rooms_item_index) in rooms" :key="rooms_item_index" :data-index="rooms_item_index">
          <div>{{rooms_item.hall_name}}</div>
          <div>{{rooms_item.hall_type}} | {{rooms_item.seat_count}}座</div>
          <ul class="flex-base">
            <li>{{rooms_item.personTime}}人</li>
            <li>{{rooms_item.tolatMoney}}元</li>
            <li>{{rooms_item.occupancy}}%</li>
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
  data () {
    return {
      checkedHall: []

    };
  },
  methods: {
    selectRooms (e) {
      let element = e.target;
      let hasRoomItem = element.classList.value.indexOf('room-item');
      let index = element.dataset.index;
      while (hasRoomItem == -1) {
        element = element.parentElement;
        hasRoomItem = element.classList.value.indexOf('room-item');
        index = element.dataset.index;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
section {
  float: left;
  padding-bottom: 1rem;
  box-sizing: border-box;
  overflow: hidden;
  background: #fff;
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
    color: #3b74ff;
    line-height: 14px;
    cursor: pointer;
  }
}

.content {
  width: 128px;
  height: 100%;
  max-height: calc(100% - 30px) !important;
  position: relative;
  overflow: hidden;

  & > ul {
    width: 100%;
    position: absolute;
    min-height: 600px;
    .room-item:nth-of-type(2n-1) {
      background: #e6e6e6;
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
        width: 100%;
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
