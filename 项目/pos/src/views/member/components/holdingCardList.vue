<template>
  <div class="_member-card-list">
    <div class="member-card-list-title">{{title}}</div>
    <div class="member-card-list-content" v-if="memberCardList.length">
      <swiper :options="swiperOption" class="swiper-no-swiping">
        <swiper-slide v-for="(item, index) in memberCardList" :key="index">
          <div class="member-card-wrap">
            <template>
              <div class="member-card-item" :class="item.cardTypeCode == 'stored_card'?'stored_card':item.cardTypeCode =='equity_card'?'equity_card':'cobranded_card'">
                <div class="item-up">
                  <div class="card-type" :class="item.cardTypeCode == 'stored_card'?'stored_card_type':item.cardTypeCode =='equity_card'?'equity_card_type':'cobranded_card_type'">{{item.cardType}}</div>
                  <div class="card-info">
                    <div class="card-name" :class="item.cardTypeCode == 'stored_card'?'stored_card_name':item.cardTypeCode =='equity_card'?'equity_card_name':'cobranded_card_name'">{{item.cardProductName}}</div>
                    <div class="card-num">{{item.cardNo}}</div>
                    <div class="merchant-name">{{item.merchantName}}</div>
                  </div>
                </div>
                <div class="item-bottom">
                  <div class="card-status">状态：{{item.status | filterStatus}}</div>
                  <div class="card-desc" v-if="item.cardTypeCode == 'stored_card'">卡内余额：{{item.totalBalance}}元</div>
                  <div class="card-desc" v-if="item.cardTypeCode != 'stored_card'">{{item.startTime | filterDate}} -
                    {{item.endTime | filterDate}}</div>
                </div>
              </div>
              <el-radio @change="handleSelected" v-if="isSelected" v-model="selectedCard" :label="index">{{item.cardType}}</el-radio>
            </template>
          </div>

        </swiper-slide>
        <div v-show="memberCardList.length>3" class="swiper-button-prev" slot="button-prev"><i class="iconfont iconzuojiantouda"></i></div>
        <div v-show="memberCardList.length>3" class="swiper-button-next" slot="button-next"><i class="iconfont iconyoujiantouda"></i></div>
      </swiper>
    </div>
    <div v-else class="no-info">暂无{{title}}</div>
  </div>
</template>

<script>
import { formatDate } from "../util/formatDate.js";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  data() {
    return {
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 30,
        // slidesPerGroup: 3,
        loop: false,
        navigation: {
          nextEl: ".swiper-button-next", //自动隐藏
          prevEl: ".swiper-button-prev", //自动隐藏
          hiddenClass: "my-button-hidden" //某些情况下需要隐藏前进后退按钮时，可以设定一个自定义的类名。
        }
      },
      selectedCard: ""
    };
  },
  mounted() {
    if (this.memberCardList.length == 1) {
      this.selectedCard = 0;
      this.handleSelected(0);
    }
  },
  methods: {
    handleSelected(index) {
      this.$emit("selectedCard", this.memberCardList[index]);
    }
  },
  watch: {
    memberCardList: {
      //深度监听，可监听到对象、数组的变化
      handler(newV, oldV) {
        this.selectedCard = '';
        // do something, 可使用this
        if (this.memberCardList.length == 1) {
          this.selectedCard = 0;
          this.handleSelected(0);
        }
      },
      deep: true
    }
  },
  filters: {
    emptyShow(value) {
      if (value || value == 0) {
        return value;
      } else {
        return "-";
      }
    },
    filterCardType(value) {
      switch (value) {
        case "stored_card":
          return "储值卡";
          break;
        case "equity_card":
          return "权益卡";
          break;
        case "cobranded_card":
          return "联名卡";
          break;
        default:
          return "-";
          break;
      }
    },
    filterStatus(value) {
      switch (value) {
        case "normal":
          return "正常";
          break;
        case "frozen":
          return "冻结";
          break;
        case "cancel":
          return "注销";
          break;
        case "expire":
          return "过期";
          break;
        case "loss":
          return "挂失";
          break;
        default:
          return "-";
          break;
      }
    },
    filterDate(value) {
      if (value) {
        return new Date(value.replace(/-/g, "/")).formatDate("yyyy.MM.dd");
      } else {
        return "-";
      }
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  props: {
    memberCardList: {
      type: Array,
      default: [],
      required: true
    },
    title: {
      type: String,
      default: "可用会员卡",
      required: false
    },
    isSelected: {
      type: Boolean,
      default: false,
      required: false
    }
  }
};
</script>
<style lang="scss">
._member-card-list {
    margin-top:3vh;
  .member-card-list-title {
    font-size: $font-size14;
    color: #333;
    font-weight: bold;
  }
  .member-card-list-content {
    position: relative;
    .swiper-container {
      position: static;
      margin: 0;
      width: 96vw;
      .swiper-slide {
        margin-right: 0 !important;
      }
      .swiper-button-disabled {
        display: none;
      }
      .swiper-button-hidden {
        opacity: 0;
        display: none;
      }
      .swiper-button-prev {
        background: rgba(67,106,200,0.30);
        width: 2vw;
        height: 8vw;
        line-height: 8vw;
        text-align: center;
        // top: 36%;
        top: 4.5vw;
        left: 0;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        .iconzuojiantouda {
          color: #fff;
          // font-size: $font-size22;
        }
      }
      .swiper-button-next {
        background: rgba(67,106,200,0.30);
        width: 2vw;
        height: 8vw;
        line-height: 8vw;
        text-align: center;
        top: 4.5vw;
        right: 0;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        .iconyoujiantouda {
          color: #fff;
          // font-size: $font-size22;
        }
      }
    }
    display: flex;
    flex-wrap: wrap;
    padding: 15px 0 0;
    .member-card-wrap {
      text-align: center;
      // 储值卡
      .stored_card {
        background-image: linear-gradient(-180deg, #ffcd6c 3%, #ffbc39 97%);
      }
      // 权益卡
      .equity_card {
        background-image: linear-gradient(-180deg, #8cc6d6 3%, #b2e6f4 97%);
      }
      // 联名卡
      .cobranded_card {
        background-image: linear-gradient(-180deg, #5f89ef 3%, #91b5fc 97%);
      }
      .member-card-item {
        // width: 280px;
        // height: 100px;
        width: 27.3vw;
        height: 10vw;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin: 0 1vw 1vw 0;
        // background: #fedf32;
        border-radius: 0.65vh;
        .item-up {
          display: flex;
          justify-content: space-between;
          padding: 10px 10px 0;
          // box-sizing: border-box;
          // 储值卡
          .stored_card_type {
            text-shadow: 0 1px 2px #ffb119;
          }
          // 权益卡
          .equity_card_type {
            text-shadow: 0 1px 2px #8dc7d7;
          }
          // 联名卡
          .cobranded_card_type {
            text-shadow: 0 1px 2px #8dc7d7;
          }
          .card-type {
            // height: 60px;
            // line-height: 60px;
            font-size: 30px;
            height: 6.1vw;
            line-height: 6.1vw;
            // font-size: 2.93vw;
            font-weight: bold;
            color: #ffffff;
            letter-spacing: 0;
          }
          .card-info {
            // 储值卡
            .stored_card_name {
              color: #ffa900;
            }
            // 权益卡
            .equity_card_name {
              color: #8ec8d8;
            }
            // 联名卡
            .cobranded_card_name {
              color: #5f89ef;
            }
            .card-name {
              width: fit-content;
              // max-width: 140px;
              max-width: 13.7vw;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              background: #fff;
              border-radius: 9px;
              // font-size: 12px;
              font-size: $font-size12;
              float: right;
              padding: 1px 6px;
              // margin-bottom: 5px;
              margin-bottom: 0.51vw;
            }
            .card-num {
              // font-size: 12px;
              font-size: $font-size12;
              color: #ffffff;
              letter-spacing: 0;
              text-align: right;
              // margin-bottom: 5px;
              margin-bottom: 0.51vw;
            }
            .merchant-name {
              // font-size: 12px;
              font-size: $font-size12;
              color: #ffffff;
              letter-spacing: 0;
              float: right;
              width: fit-content;
              max-width: 13.7vw;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
        .item-bottom {
          display: flex;
          justify-content: space-between;
          padding: 0px 10px;
          // box-sizing: border-box;
          .card-status {
            // font-size: 12px;
            font-size: $font-size12;
            color: #ffffff;
          }
          .card-desc {
            // font-size: 12px;
            font-size: $font-size12;
            color: #ffffff;
          }
        }
      }
      // 储值卡
      .stored_card::after {
        background: #fcb429;
      }
      // 权益卡
      .equity_card::after {
        background: #81c5d8;
      }
      // 联名卡
      .cobranded_card::after {
        background: #5f89ef;
      }
      .member-card-item::after {
        content: "";
        position: relative;
        height: 1px;
        top: -3vw;
      }
    }
  }
  .no-info {
    text-align: center;
    color: #555;
    font-size: $font-size12;
  }
}
</style>
