<template>
  <div class="_member-card-list">
    <div class="member-card-list-title">{{title}}</div>
    <div class="member-card-list-content" v-if="memberCardList.length">
      <swiper :options="swiperOption" class="swiper-no-swiping">
        <swiper-slide v-for="(item, index) in memberCardList" :key="index">
          <div class="member-card-wrap">
            <template>
              <div class="member-card-item" :class="item.cardTypeCode == 'stored_card'?'stored_card':item.cardTypeCode =='equity_card'?'equity_card':'cobranded_card'" @click="handleSelected(index)">
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
    if (this.memberCardList.length) {
      this.selectedCard = 0;
      this.handleSelected(0);
    }
  },
  methods: {
    handleSelected(index) {
      this.selectedCard = index;
      this.$emit("selectedCard", this.memberCardList[index]);
    }
  },
  watch: {
    memberCardList: {
      //深度监听，可监听到对象、数组的变化
      handler(newV, oldV) {
        this.selectedCard = '';
        // do something, 可使用this
        if (this.memberCardList.length) {
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
  .member-card-list-title {
    font-size: $font-size14;
    color: #333;
    font-weight: bold;
  }
  .member-card-list-content {
    // position: relative;
    .swiper-container {
      position: relative;
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
        position:absolute;
        background: rgba(67,106,200,0.30);
        width: 2vw;
        height: 8vw;
        line-height: 8vw;
        text-align: center;
        top: 4.2vh;
        left: 0;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        .iconzuojiantouda {
          color: #fff;
        }
      }
      .swiper-button-next {
        position:absolute;
        background: rgba(67,106,200,0.30);
        width: 2vw;
        height: 8vw;
        line-height: 8vw;
        text-align: center;
        top: 4.2vh;
        right: 0;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        .iconyoujiantouda {
          color: #fff;
        }
      }
    }
    display: flex;
    flex-wrap: wrap;
    padding: 1vh 0 0;
  }
  .no-info {
    text-align: center;
    color: #555;
    font-size: $font-size12;
  }
}
</style>
