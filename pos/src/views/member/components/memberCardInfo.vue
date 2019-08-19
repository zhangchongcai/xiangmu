<template>
  <div class="_member-info">
    <div class="member-info-title" style="padding-left:0">{{title}}</div>
    <div class="member-info-content">
      <div class="content-item content-left">
        <div class="item-inner" v-if="memberCardInfo.cardNo"><label class="lable-name">会员卡号：</label>{{memberCardInfo.cardNo | emptyShow}}</div>
        <div class="item-inner" v-if="memberCardInfo.userName"><label class="lable-name">姓名：</label>
          <!-- <div class="nameWrap"> -->
          <el-tooltip effect="dark" :content="memberCardInfo.userName" placement="top-start">
            <span class="nameWrap" style="display:inline-block;">{{memberCardInfo.userName | emptyShow}}</span>
          </el-tooltip>
          <!-- </div> -->
        </div>
        <div class="item-inner" v-if="isSingleQuery && memberCardInfo.creditNum"><label class="lable-name">身份证号：</label>{{memberCardInfo.creditNum
          | emptyShow}}</div>
        <div class="item-inner" v-if="memberCardInfo.cinemaName"><label class="lable-name">开卡影城：</label>
          <el-tooltip effect="dark" :content="memberCardInfo.cinemaName" placement="top-start">
            <span class="nameWrap" style="display:inline-block;font-size: 1.25vw;">{{memberCardInfo.cinemaName | emptyShow}}</span>
          </el-tooltip>
        </div>
        <div class="item-inner" v-if="memberCardInfo.cardTypeCode!='stored_card' && memberCardInfo.cardTypeCode"><label class="lable-name">有效期：</label>{{(memberCardInfo.workTimeType || memberCardInfo.endTime)
          |
          filterWorkTime(this)}}</div>
        <div class="item-inner" v-if="(memberCardInfo.cardTypeCode =='stored_card' || memberCardInfo.cardTypeCode == 'gift_card') && memberCardInfo.cardTypeCode"><label class="lable-name">卡内余额：</label>{{memberCardInfo.totalBalance
          | emptyShow}}元<span class="balance-desc">（实收{{memberCardInfo.basicBalance |
            emptyShow}}元;赠送{{memberCardInfo.giveBalance |
            emptyShow}}元）</span></div>
      <!-- </div> -->
      <!-- <div class="content-item content-center"> -->
        <div class="item-inner" v-if="memberCardInfo.cardProductName"><label class="lable-name">卡政策：</label>
          <el-tooltip effect="dark" :content="memberCardInfo.cardProductName" placement="top-start">
            <span class="nameWrap" style="display:inline-block;">{{memberCardInfo.cardProductName | emptyShow}}</span>
          </el-tooltip>
          <!-- {{memberCardInfo.cardProductName | emptyShow}} -->
        </div>
        <div class="item-inner" v-if="memberCardInfo.gender"><label class="lable-name">性别：</label>{{memberCardInfo.gender | emptyShow}}</div>
        <div class="item-inner" v-if="isSingleQuery && memberCardInfo.email"><label class="lable-name">邮箱：</label>
          <el-tooltip effect="dark" :content="memberCardInfo.email" placement="top-start">
            <span class="nameWrap" style="display:inline-block">{{memberCardInfo.email | emptyShow}}</span>
          </el-tooltip>
        </div>
        <div class="item-inner" v-if="memberCardInfo.createTime"><label class="lable-name">开卡日期：</label>{{memberCardInfo.createTime | filterDate}}</div>
        <div class="item-inner" v-if="isSingleQuery && memberCardInfo.cinemaName"><label class="lable-name">适用影院：</label>
          <span v-if="!!$attrs.checkMovie" @click="toBindCinema" class='checkCinema' style="">查看</span>
          <el-tooltip effect="dark" :content="memberCardInfo.cinemaName" placement="top-start" v-else>
            <span class="nameWrap" style="display:inline-block;">{{memberCardInfo.cinemaName | emptyShow}}</span>
          </el-tooltip>
        </div>
      <!-- </div> -->
      <!-- <div class="content-item content-right"> -->
        <div class="item-inner" v-if="memberCardInfo.phoneNumber"><label class="lable-name">手机号码：</label>{{memberCardInfo.phoneNumber | emptyShow}}</div>
        <div class="item-inner" v-if="memberCardInfo.birthday"><label class="lable-name">生日：</label>{{memberCardInfo.birthday | filterDate}}</div>
        <div class="item-inner" v-if="memberCardInfo.cardTypeCode=='stored_card' && memberCardInfo.deductionsTime"><label class="lable-name">扣年费日期：</label>{{memberCardInfo.deductionsTime | filterDeductionsTime(memberCardInfo.deductionsType)}}</div>
        <div class="item-inner" v-if="memberCardInfo.status"><label class="lable-name">卡状态：</label>
        <span class="mainMsgStyle">{{memberCardInfo.status | filterStatus}}</span></div>
        <div class="item-inner" v-if="handleIsShow(isSingleQuery,memberCardInfo.status) && memberCardInfo.changeTime"><label class="lable-name">{{filterName(memberCardInfo.status)}}</label>{{memberCardInfo.changeTime
          |
          filterDate}}</div>
        <div class="item-inner" v-if="reasonIsShow(isSingleQuery,memberCardInfo.status) && memberCardInfo.frozenReason"><label class="lable-name">冻结原因：</label>
          <el-tooltip effect="dark" :content="memberCardInfo.frozenReason" placement="top-start">
            <span class="nameWrap" style="display:inline-block">{{memberCardInfo.frozenReason | emptyShow}}</span>
          </el-tooltip>
        </div>
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
  methods: {
    toBindCinema(){
      this.$router.push({name:'applyCinema',query:{phoneOrCard:this.memberCardInfo.cardNo,type:'card'}})
    },
    filterName(status) {
      switch (status) {
        case "frozen":
          return "冻结时间：";
          break;
        case "cancel":
          return "注销时间：";
          break;
        case "expire":
          return "过期时间：";
          break;
        case "loss":
          return "挂失时间：";
          break;
        default:
          return "-";
          break;
      }
    },
    handleIsShow(isSingleQuery, status) {
      if (status != "normal") {
        if (isSingleQuery) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    reasonIsShow(isSingleQuery, status) {
      if (status == "frozen") {
        if (isSingleQuery) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  },
  props: {
    memberCardInfo: {
      type: Object,
      default: {},
      required: true
    },
    title: {
      type: String,
      default: "会员卡信息",
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
    filterWorkTime(value, that) {
      let time = that.memberCardInfo.workTimeNum || that.memberCardInfo.endTime;
      if (value == "day") {
        return time ? time + "日" : "-";
      } else if (value == "month") {
        return time ? time.toString().indexOf('-') >= 0 ? time : time + "月" : "-";
      } else if (value == "year") {
        return time ? time + "年" : "-";
      } else {
        return "永久";
      }
    },
    filterSex(value) {
      var value = value.toLowerCase()
      if (value == "male") {
        return "男";
      } else if (value == "female") {
        return "女";
      } else {
        return "-";
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
    filterDeductionsTime(time, type) {
      if (time) {
        if (type == "dynamic_time") {
          return "开卡后" + time + "天";
        } else if (type == "fixed_date") {
          return "每年" + new Date(('2019-'+time).replace(/-/g, "/")).formatDate("MM-dd");
        }
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
    margin-bottom:2vh;
  .member-info-content {
    display: flex;
    // justify-content: space-between;
    flex-wrap: wrap;
    .content-left {
      width: 31vw;
    }
    .content-center {
      width: 32vw;
    }
    .content-right {
      width: 31vw;
    }
    .content-item {
      display: flex;
      flex-direction: row;
      flex-wrap:wrap;
      width:100%;
      // justify-content: space-between;
      .item-inner {
        // display: flex;
        // align-items: baseline;
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
        .item-detail {
          width: 23vw;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .nameWrap {
          font-size: $font-size12;
          width: 18vw;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: middle;
        }
      }
    }
  }
}
.checkCinema{
  color:#3B74FF;
  font-size:$font-size12;
  cursor: pointer;
}
.mainMsgStyle{
  font-size:$font-size12;
}
</style>
