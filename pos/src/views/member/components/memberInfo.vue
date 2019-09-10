<template>
  <div class="_member-info">
    <div class="member-info-title" style="padding-left:0">{{title}}</div>
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
            <span class="nameWrap" style="display:inline-block;">{{memberInfo.name | emptyShow}}</span>
          </el-tooltip>
        </div>
        <div class="item-inner" v-if="memberInfo.birthday"><label class="lable-name">生日：</label>{{memberInfo.birthday | filterDate}}</div>
        <div class="item-inner" v-if="memberInfo.totalAmount"><label class="lable-name">储值余额：</label>{{memberInfo.totalAmount | emptyShow}}元<span
            class="balance-desc">（实收{{memberInfo.basicAmount | emptyShow}}元;赠送{{memberInfo.giveAmount | emptyShow}}元）</span></div>
      <!-- </div> -->
      <!-- <div class="content-item content-right" :style="{'width':isSingleQuery?'22vw':'31vw'}"> -->
        <div class="item-inner" v-if="memberInfo.sex"><label class="lable-name">性别：</label>{{memberInfo.sex | filterSex}}</div>
        <div class="item-inner" v-if="isSingleQuery && memberInfo.creditNum"><label class="lable-name">身份证号：</label>{{memberInfo.creditNum |
          emptyShow}}</div>
        <div class="item-inner" v-if="memberInfo.channelId"><label class="lable-name">注册渠道：</label>{{memberInfo.channelId | emptyShow}}</div>
        <div class="item-inner" v-if="memberInfo.scoreBalance"><label class="lable-name">积分余额：</label>{{memberInfo.scoreBalance | emptyShow}}</div>
      </div>
    </div>
    <div class="member_tag" v-if="memberInfo.labelVOS.length">
      <label style="padding:4px 0;font-size:1.04vw;min-width:6.3vw;">会员标签：</label>
      <div style="display:inline-block">
        <span class="detail_tag" 
              v-for="(item,index) in memberInfo.labelVOS" 
              v-show="item.posVisible === 1"
              :key="index"
              :style='{"borderColor":item.labelColor,"color":item.labelColor}'>{{item.labelName}}</span>
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
      if (value || (typeof value == "number" && value !== 0)) {
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
    margin-bottom:1vh;
  .member-info-content {
    .content-item {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width:100%;
      .item-inner {
        display: flex;
        align-items: baseline;
        width:30vw;
        font-size: $font-size12;
        color: #151515;
        margin-top: 1.5vh;
        .lable-name {
          display: inline-block;
          font-size: $font-size12;
          color: #666666;
          line-height: 1.3;
        }
        .balance-desc {
          color: #999999;
          font-size: $font-size12;
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
  .member_tag{
    display:flex;
    justify-content:flex-start;
    margin-top:1vh;
    color: #666666;
    .detail_tag{
      display:inline-block;
      padding:4px 8px;
      margin-right:10px;
      margin-bottom:1vh;
      border:1px solid #ddd;
      border-radius:16px;
      font-size:$font-size12;
    }
  }
}
</style>
