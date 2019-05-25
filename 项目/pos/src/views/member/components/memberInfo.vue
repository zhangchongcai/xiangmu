<template>
  <div class="_member-info">
    <div class="member-info-title">{{title}}</div>
    <div class="member-info-content">
      <div class="content-item content-left" > <!-- :style="{'width':isSingleQuery?'22vw':'31vw'}" -->
        <div class="item-inner" v-if="memberInfo.levelId"><label class="lable-name">手机号：</label>{{memberInfo.mobileNum | emptyShow}}</div>
        <div class="item-inner" v-if="memberInfo.levelName"><label class="lable-name">会员等级：</label>{{memberInfo.levelName | emptyShow}}</div>
        <div class="item-inner" v-if="isSingleQuery && memberInfo.email"><label class="lable-name">邮箱：</label>
          <el-tooltip effect="dark" :content="memberInfo.email" placement="top-start">
            <span class="nameWrap" style="display:inline-block">{{memberInfo.email | emptyShow}}</span>
          </el-tooltip>
        </div>
        <div class="item-inner" v-if="memberInfo.openDate"><label class="lable-name">注册日期：</label>{{memberInfo.openDate | filterDate}}</div>
      <!-- </div> -->
      <!-- <div class="content-item content-center"> -->
        <div class="item-inner" v-if="memberInfo.name"><label class="lable-name">姓名：</label>
          <el-tooltip effect="dark" :content="memberInfo.name" placement="top-start">
            <span class="nameWrap" style="display:inline-block">{{memberInfo.name | emptyShow}}</span>
          </el-tooltip>
        </div>
        <div class="item-inner" v-if="memberInfo.birthday"><label class="lable-name">生日：</label>{{memberInfo.birthday | filterDate}}</div>
        <div class="item-inner" v-if="memberInfo.basicAmount"><label class="lable-name">储值余额：</label>{{memberInfo.totalAmount | emptyShow}}元<span
            class="balance-desc">（实收{{memberInfo.basicAmount | emptyShow}}元;赠送{{memberInfo.giveAmount | emptyShow}}元）</span></div>
      <!-- </div> -->
      <!-- <div class="content-item content-right" :style="{'width':isSingleQuery?'22vw':'31vw'}"> -->
        <div class="item-inner" v-if="memberInfo.sex"><label class="lable-name">性别：</label>{{memberInfo.sex | filterSex}}</div>
        <div class="item-inner" v-if="isSingleQuery && memberInfo.creditNum"><label class="lable-name">身份证号：</label>{{memberInfo.creditNum |
          emptyShow}}</div>
        <div class="item-inner" v-if="memberInfo.channelId"><label class="lable-name">注册渠道：</label>{{memberInfo.channelId | emptyShow}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "../util/formatDate.js";
export default {
  data() {
    return {};
  },
  props: {
    memberInfo: {
      type: Object,
      default: {},
      required: true
    },
    title: {
      type: String,
      default: "会员信息",
      required: false
    },
    isSingleQuery: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  filters: {
    emptyShow: function(value) {
      if (value || (typeof value == "number" && value == 0)) {
        return value;
      } else {
        return "-";
      }
    },
    filterSex(value) {
      var value = value.toLowerCase();
      if (value == "male") {
        return "男";
      } else if (value == "female") {
        return "女";
      } else {
        return "-";
      }
    },
    filterDate(value) {
      if (value) {
        return new Date(value.replace(/-/g, "/")).formatDate("yyyy-MM-dd");
      } else {
        return "-";
      }
    }
  }
};
</script>
<style lang="scss">
._member-info {
  margin-bottom: 5vh;
  .member-info-title {
    font-size: $font-size14;
    color: #333;
    font-weight: bold;
  }
  .member-info-content {
    // display: flex;
    // justify-content: space-between;
    // flex-wrap: wrap;
    // .content-center {
    //   width: 32vw;
    // }
    .content-item {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width:100%;
      // justify-content: space-between;
      .item-inner {
        display: flex;
        align-items: baseline;
        width:30vw;
        font-size: $font-size13;
        color: #151515;
        margin-top: 2.6vh;
        .lable-name {
          display: inline-block;
          font-size: $font-size13;
          color: #666666;
          line-height: 1.3;
        }
        .balance-desc {
          color: #999999;
        }
        .nameWrap {
          font-size: $font-size12;
          width: 18vw;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align:middle;
        }
      }
    }
  }
}
</style>
