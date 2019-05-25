<template>
  <!-- 组件说明 
  1.equityID ：权益ID；必传字段；
  2.isShow: 控制右侧导航组件是否显示；非必传字段，默认为 true —— 右侧导航组件显示。
  -->
  <div class="owner-ship-detail">
    <!-- 内容区 - 折叠面板 -->
    <el-collapse v-model="activeNames"  class="owner-ship-detail-content">
      <!-- 权益信息 -->
      <el-collapse-item title="权益信息" name="1">
        <div class="equity-info">
          <div class="item-inner"><label class="lable-name">权益名称：</label>{{detailData.equityName | filterEmpty}}</div>
          <div class="item-inner"><label class="lable-name">权益类型：</label>{{detailData.equityTypeName | filterEmpty}}</div>
          <div class="item-inner" v-if="detailData.equityType == 'consumer_type'"><label class="lable-name">权益类别：</label>{{detailData.equityCategoryName
            | filterEmpty}}</div>
          <div class="item-inner"><label class="lable-name">权益说明：</label> <span style="font-size:12px" v-html="formateRemark(detailData.equityRemark)"> </span></div>
          <div class="item-inner-img"><label class="lable-name">icon：</label>
            <span v-if="detailData.logoPic" class="have-img">
              <img :src="detailData.logoPic" alt="icon">
            </span>
            <span v-else class="no-img">暂无图标</span>
          </div>
        </div>
      </el-collapse-item>
      <!-- 权益规则 -->
      <el-collapse-item :title="`权益规则-${detailData.equityCategoryName}`" name="2" v-if="detailData.equityType == 'consumer_type' && detailData.equityCategory">
        <div class="equity-rules">
          <!-- 影票折扣 -->
          <div v-if="detailData.equityCategory == 'movie'">
            <div class="ticket-discount" v-for="(item, index) of detailData.movieList" :key="index">
              <div class="item-inner"><label class="lable-name">适用影院：</label>{{item.cinemaList |
                filterCinemaList('cinemaName')}}</div>
              <div class="item-inner"><label class="lable-name">适用影厅：</label>{{item.hallList |
                filterCinemaList('hallName')}}</div>
              <div class="item-inner"><label class="lable-name">适用制式：</label>{{item.screenList |
                filterCinemaList('screenName')}}</div>
              <div class="item-inner"><label class="lable-name">放映星期：</label>{{item.weeks | formatWeeks}}</div>
              <div class="item-inner"><label class="lable-name">放映时段：</label>{{item.dayTimesJson?item.dayTimesJson:'-'}}</div>
              <div class="item-inner"><label class="lable-name">优惠方式：</label>{{item.ticketSaleType |
                formatTicketSaleType}}，{{item.ticketSaleData}}</div>
              <div class="item-inner" v-if="item.ticketLimitSaleType?true:false"><label class="lable-name">优惠限制：</label>{{item.ticketLimitSaleType
                | formatTicketLimitSaleType}}，每场优惠上限{{item.ticketLimitSaleData}}张</div>
              <div class="item-inner" v-else><label class="lable-name">优惠限制：</label>无</div>
              <div class="item-inner"><label class="lable-name">低于最低票价时：</label>{{item.lowPriceMark |
                formatLowPriceMark}}{{item.maxSubsidies}}</div>
            </div>
          </div>
          <!-- 卖品折扣 -->
          <div class="sales-discount" v-if="detailData.equityCategory == 'goods'">
            <div class="item-inner"><label class="lable-name">适用影院：</label>{{detailData.goods.cinemaList |
              filterCinemaList('cinemaName')}}</div>
            <div class="item-inner"><label class="lable-name">适用卖品：</label>{{detailData.goods.goodsList |
              filterCinemaList('goodsName')}}</div>
            <div class="item-inner"><label class="lable-name">优惠方式：</label>{{detailData.goods.goodsSaleType |
              formatGoodsSaleType}}，{{detailData.goods.goodsSaleData}}</div>
          </div>
          <!-- 生日赠券 -->
          <div class="birthday-coupons" v-if="detailData.equityCategory == 'birthday'">
            <div class="item-inner"><label class="lable-name">发送时间：</label>{{detailData.birthday | filterBirthday}}</div>
            <div class="gift-voucher-wrap">
              <!-- <div class="item-inner"><label class="lable-name">赠送券类型：</label>代金券 + 兑换码</div> -->
              <div v-if="detailData.birthday.voucherList && detailData.birthday.voucherList.length > 0">
                  <div class="cash-coupon-title">代金券</div>
                  <div class="item-inner" v-for="(item, index) of detailData.birthday.voucherList" :key="index"><label
                      class="lable-name">销售单号：</label>
                    <div style="width:140px" class="my12size">{{item.ticketNo}}</div><label class="lable-name">&emsp;&emsp;&emsp;张数：</label>{{item.num}}张
                  </div>
              </div>
              <div  v-if="detailData.birthday.cdkeyList && detailData.birthday.cdkeyList.length > 0">
                <div class="cash-coupon-title">兑换码</div>
                <div class="item-inner" v-for="(item, index) of detailData.birthday.cdkeyList" :key="index"><label class="lable-name">销售单号：</label>
                  <div style="width:140px" class="my12size">{{item.ticketNo}}</div><label class="lable-name">&emsp;&emsp;&emsp;张数：</label>{{item.num}}张
                </div>
              </div>
            </div>
          </div>
          <!-- 代金券 -->
          <div class="cash-coupon" v-if="detailData.equityCategory == 'voucher'">
            <div class="item-inner my12size" v-for="(item, index) of detailData.ticketList" :key="index">
              <label class="lable-name">销售单号：</label>
              <div style="width:140px" class="my12size">{{item.ticketNo}}</div><label class="lable-name">&emsp;&emsp;&emsp;张数：</label>
              <div style="width:55px;" class="my12size">{{item.totalNum}}张</div>&emsp;&emsp;&emsp;
              <label class="lable-name my12size" style="width:100px;">发放时间与张数：</label>
              <div class="my12size">每{{item.outOfTime | outOfTimeToChinese}}</div>{{item.num}}张
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div v-if="isShow" :class="detailData.equityType != 'consumer_type'?'scorll-right':''">
      <fixStepTool :stepData="stepData.stepList" class="_fixsteptool-member"></fixStepTool>
    </div>
  </div>
</template>
<script>
import FixStepTool from "../../../components/fix-step-tool/fix-step-tool";
import fixStepMixin from "../../../mixins/CRM/fixStepTool.js";
import {formatRemark} from '../../../util/filterData.js'
export default {
  name: "OwnershipDetail",
  data() {
    return {
      activeNames: ["1", "2"],
      detailData: {},
      stepData: {
        stepEl: ".el-collapse-item",
        stepList: [
          {
            name: "权益信息",
            isactive: false
          },
          {
            name: "权益规则-影票折扣",
            isactive: false
          }
        ]
      }
    };
  },
  created() {
    this.getDetail();
  },
  props: {
    equityID: {
      type: String,
      default: "",
      required: false
    },
    isShow: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  components: {
    fixStepTool: FixStepTool
  },
  mixins: [fixStepMixin],
  methods: {
    formateRemark(value){
      return formatRemark(value)
    },
    getDetail() {
      let params = { equityId: this.equityID, tenantId:  this.$store.state.loginUser.consumerId };
      this.$crmList
        .getOwnrightsInfo(params)
        .then(data => {
          this.detailData = data;
          if(data.equityCategoryName){
            this.stepData.stepList[1].name = `权益规则-${
              data.equityCategoryName
            }`;
          }
          // if (data.equityType != "consumer_type") {
          //   this.stepData.stepList = [
          //     {
          //       name: "权益信息",
          //       isactive: false
          //     }
          //   ];
          // } else {
          //   this.stepData.stepList[1].name = `权益规则-${
          //     data.equityCategoryName
          //   }`;
          // }
          //未启用显示
          if (data.status == "unstart") {
            this.$emit("isShowOpen", "ok", data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    equityID(ID) {
      this.getDetail(ID);
    }
  },
  filters: {
    outOfTimeToChinese:function(value){
      if(value == "year"){
        return "年"
      }else if(value == "month"){
        return "月"
      }else if(value == "week"){
        return "日"
      }else{
        return "-"
      }
    }
    ,
    //   过滤影院,影厅
    filterCinemaList: function(value, flag) {
      if (value.length) {
        return value
          .map(item => {
            return item[flag];
          })
          .join("、");
      } else {
        return "-";
      }
    },
    //   放映星期过滤器
    formatWeeks: function(value) {
      if (value) {
        let newWeeks = [];
        if (value.indexOf("1") != -1) {
          newWeeks.push("周一");
        }
        if (value.indexOf("2") != -1) {
          newWeeks.push("周二");
        }
        if (value.indexOf("3") != -1) {
          newWeeks.push("周三");
        }
        if (value.indexOf("4") != -1) {
          newWeeks.push("周四");
        }
        if (value.indexOf("5") != -1) {
          newWeeks.push("周五");
        }
        if (value.indexOf("6") != -1) {
          newWeeks.push("周六");
        }
        if (value.indexOf("7") != -1) {
          newWeeks.push("周日");
        }
        return newWeeks.join("、");
      } else {
        return "-";
      }
    },
    formatTicketLimitSaleType: function(value) {
      if (value == "perMemberDay") {
        return "每会员每日数量";
      } else if (value == "perMemberWeek") {
        return "每会员每周数量";
      } else if (value == "perMemberMonth") {
        return "每会员每月数量";
      }
    },
    formatTicketSaleType: function(value) {
      if (value == "subPrice") {
        return "零售价-N（元）";
      } else if (value == "discountPrice") {
        return "零售打折（%）";
      } else if (value == "fixPrice") {
        return "固定金额（元）";
      }
    },
    formatLowPriceMark: function(value) {
      if (value == "notAllowSale") {
        return "不允许出票";
      } else if (value == "cinemaPay") {
        return "影院补贴（元），";
      } else if (value == "clientPay") {
        return "用户补贴";
      }
    },
    formatGoodsSaleType: function(value) {
      if (value == "discountPrice") {
        return "零售打折（%）";
      } else if (value == "subPrice") {
        return "零售价（元）";
      }
    },
    filterBirthday: function(value) {
      if (value.issueType == "SAME_MONTH") {
        return "生日当月首日";
      } else {
        return `生日前${value.outOfTime}日`;
      }
    },
    // 空数据处理过滤器
    filterEmpty: value => {
      return value ? value : "-";
    }
  }
};
</script>
<style lang="scss">
.owner-ship-detail {
  overflow: hidden;
   .scorll-right .single-step:nth-of-type(2){
    display: none;
  }
  .is-not-show {
    display: none;
  }
  //   内容区
  .owner-ship-detail-content {
    border: 0;
    // 权益信息
    .equity-info {
      padding: 0 15px;
    }
    // 权益规则
    .equity-rules {
      .ticket-discount {
        width: 55%;
        padding: 0 15px 15px;
        border: 1px solid #f5f5f5;
        border-radius: 5px;
        margin-bottom: 15px;
      }
      .sales-discount {
        padding: 15px;
      }
      .birthday-coupons {
        padding: 15px;
        .gift-voucher-wrap {
          .cash-coupon-title {
            width: 260px;
            font-size: 12px;
            color: #333333;
            font-weight: bold;
            padding: 15px 0 0 0;
            border-bottom: 1px dashed #f5f5f5;
          }
        }
      }
    }
    .item-inner,
    .item-inner-img {
      display: flex;
      align-items: baseline;
      font-size: 12px;
      color: #666666;
      margin-top: 15px;
      .lable-name {
        width: 90px;
        display: inline-block;
        font-size: 12px;
        color: #666666;
        line-height: 1.3;
      }
    }
    .item-inner-img {
      align-items: flex-start;
      .have-img {
        display: inline-block;
        width: 148px;
        height: 148px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .no-img {
        display: inline-block;
        width: 148px;
        height: 148px;
        background: #f5f5f5;
        font-size: 12px;
        text-align: center;
        line-height: 148px;
      }
    }
  }
}
</style>


