<template>
  <div class="card-type-detail">
    <!-- 面包屑 -->
    <div class="crumbs-wrap">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>会员</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡</el-breadcrumb-item>
        <el-breadcrumb-item>
          <router-link class="itemLink" :to="{path : '/cardTypeManagement/list'}">会员卡政策管理</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>卡政策查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 内容区 - 折叠面板 -->
    <el-collapse v-model="activeNames" class="card-type-detail-content">
      <el-collapse-item title="基础设置" name="1">
        <div class="card-type-basic-info">
          <div class="basic-info-item item-left">
            <div class="item-inner"><label class="lable-name">卡政策名称：</label>{{detailData.cardName}}</div>
            <div class="item-inner"><label class="lable-name">卡类型：</label>{{detailData.cardTypeCode | showCardType}}</div>
            <div class="item-inner" v-if="detailData.cardTypeCode != 'cobranded_card'" style="display: flex;align-items: flex-start;"><label
                class="lable-name">卡样式：</label>
              <span v-if="detailData.picPath">
                <img :src="detailData.picPath" style="width:238px;height:113px;" alt="picPath">
              </span>
              <span v-else class="no-img">
                暂无卡样式
              </span>
            </div>
          </div>
          <div class="basic-info-item item-right">
            <div class="item-inner"><label class="lable-name">卡政策编号：</label>{{detailData.productNo | emptyShow}}</div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="开卡/充值设置" name="2">
        <div class="open-card-recharge-set" v-if="detailData.cardTypeCode == 'stored_card'">
          <div class="basic-info-item item-left">
            <div class="item-inner"><label class="lable-name">开卡必填：</label>{{detailData.mustFillName?detailData.mustFillName.split(',').join('、'):''}}</div>
            <div class="item-inner"><label class="lable-name">充值设置：</label>{{detailData.canChargeName}}</div>
            <div class="item-inner"><label class="lable-name">单充最小金额：</label>{{detailData.chargeMin}}元</div>
            <div class="item-inner"><label class="lable-name">开卡手续费：</label>{{detailData.openPrice}}元</div>
            <!-- <div class="item-inner"><label class="lable-name">换卡手续费：</label>{{detailData.replacePrice}}元</div> -->
            <div class="item-inner"><label class="lable-name">注销手续费：</label>{{detailData.backPrice}}元</div>
          </div>
          <div class="basic-info-item item-right">
            <div class="item-inner"><label class="lable-name">简单密码：</label>{{detailData.weakPasswordName}}</div>
            <div class="item-inner"><label class="lable-name">首充最小金额：</label>{{detailData.firstChargeMin}}元</div>
            <div class="item-inner"><label class="lable-name">单充最大金额：</label>{{detailData.chargeMax}}元</div>
            <div class="item-inner"><label class="lable-name">补卡手续费：</label>{{detailData.makeUpPrice}}元</div>
          </div>
          <div class="annual-fee-rule" v-if="detailData.annualFee">
            <div class="annual-fee-rule-title">年费规则</div>
            <div class="open-card-recharge-set" style="padding:0;">
              <div class="basic-info-item item-left">
                <div class="item-inner"><label class="lable-name">卡年费：</label>{{detailData.yearRule.price |
                  emptyShow}}元</div>
                <div class="item-inner"><label class="lable-name">开卡首年是否免年费：</label>{{detailData.yearRule.firstYearFee
                  | emptyShow |nianfei}}</div>
              </div>
              <div class="basic-info-item item-right">
                <div class="item-inner"><label class="lable-name">免年费机制：</label>{{detailData.yearRule.freeAnnualNum |
                  emptyShow
                  | nianFeiJiZhi(this)}}</div>
                <div class="item-inner"><label class="lable-name">扣年费时间：</label>{{detailData.yearRule.deductionsTime |
                  emptyShow
                  | nianFeiTime(this)}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="open-card-recharge-set" v-else-if="detailData.cardTypeCode == 'equity_card'">
          <div class="basic-info-item item-left">
            <div class="item-inner"><label class="lable-name">开卡必填：</label>{{detailData.mustFillName?detailData.mustFillName.split(',').join('、'):''}}</div>
            <div class="item-inner"><label class="lable-name">权益卡售价：</label>{{detailData.price | emptyShow}}元</div>
            <div class="item-inner"><label class="lable-name">免费支付：</label>{{detailData.freeConsumption |
              formatFreeConsumption}}</div>
            <div class="item-inner"><label class="lable-name">延期设置：</label>{{detailData.canDelay ==
              "can_delay"?'允许延期':'不允许延期'}}</div>
            <div class="item-inner" v-if="detailData.canDelay == 'can_delay'"><label class="lable-name">延期手续费：</label>{{detailData.delayPrice
              | emptyShow}}元</div>
          </div>
        </div>
        <div class="open-card-recharge-set" v-else-if="detailData.cardTypeCode == 'cobranded_card'">
          <div class="basic-info-item item-left">
            <div class="item-inner"><label class="lable-name">开卡必填：</label>{{detailData.mustFillName?detailData.mustFillName.split(',').join('、'):''}}</div>
            <div class="item-inner"><label class="lable-name">联名卡结算价：</label>{{detailData.settlementPrice}}元</div>
            <div class="item-inner" v-if="detailData.priceTag"><label class="lable-name">联名卡标价：</label>{{detailData.priceTag
              | emptyShow}}元</div>
            <div class="item-inner"><label class="lable-name">延期设置：</label>{{detailData.canDelay ==
              "can_delay"?'允许延期':'不允许延期'}}</div>
            <div class="item-inner" v-if="detailData.canDelay == 'can_delay'"><label class="lable-name">延期手续费：</label>{{detailData.delayPrice
              | emptyShow}}元</div>
          </div>
        </div>
        <!-- 卡使用须知 -->
        <div class="open-card-recharge-set">
          <div class="basic-info-item" style="width:100%">
            <div class="item-inner"><label class="lable-name">卡使用须知：</label><span style="font-size:12px;" v-html="formatRemark(detailData.remark)"></span></div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="会员卡规则" name="3">
        <div class="card-rule">
          <div class="basic-info-item item-left">
            <div v-if="detailData.cardTypeCode == 'stored_card'">
              <!-- 储蓄卡 -->
              <div class="item-inner"><label class="lable-name">可售渠道：</label>{{detailData.channelList |
                formatChannelList}}</div>
              <div class="item-inner"><label class="lable-name">当余额不足时：</label>{{detailData.withCashName | emptyShow}}</div>
              <!-- <div class="item-inner"><label class="lable-name">积分规则：</label>为普通消费的2倍</div> -->
            </div>
            <div v-else-if="detailData.cardTypeCode == 'equity_card'">
              <!-- 权益卡 -->
              <div class="item-inner"><label class="lable-name">可售渠道：</label>{{detailData.channelList |
                formatChannelList}}</div>
              <div class="item-inner"><label class="lable-name">有效期：</label>{{getworkTime(detailData)}}</div>
            </div>
            <div v-else-if="detailData.cardTypeCode == 'cobranded_card'">
              <!-- 联名卡 -->
              <div class="item-inner"><label class="lable-name">联名卡商户：</label>{{detailData.merchantList |
                merchantList}}</div>
              <div class="item-inner"><label class="lable-name">有效期：</label>{{getworkTime(detailData)}}</div>
            </div>

          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="会员卡权益" name="4">
        <div class="equity-item-wrap">
          <div class="equity-coupon-item" v-for="(item, index) of detailData.equityList" :key="index">
            <img src="../../../assets/image/white-dot.png" class="white-dot">
            <div class="coupon-item-type" :class="item.equityType == 'consumer_type'?'consumption-type-color':item.equityType == 'service_type'?'service-type-color':item.equityType == 'experience_type'?'experience-type-color':'identity-type-color'">
              {{item.equityTypeName}}
            </div>
            <div class="coupon-item-name" :class="item.equityType == 'consumer_type'?'consumption-name-color':item.equityType == 'service_type'?'service-name-color':item.equityType == 'experience_type'?'experience-name-color':'identity-name-color'">
              {{item.equityName}}
            </div>
            <span class="preview-btn" @click="handlePreviewEquity(item.equityId)">预览</span>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <fixStepTool :stepData="stepData.stepList" class="_fixsteptool-member"></fixStepTool>
    <div class="detail-btn-wrap" v-if="detailData.status == 'unstart'?true:false">
      <el-button class="el-btn-custom" type="primary" @click="handleStarted">启用</el-button>
      <el-button class="el-btn-custom" @click="handleCancle">确定</el-button>
    </div>
    <!-- 预览dialog -->
    <el-dialog title="权益预览" class="__equity-dialog" :visible.sync="previewDialog" width="892px">
      <OwnershipDetail :equityID="equityId" :isShow="false"></OwnershipDetail>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" size="medium" @click="previewDialog = false">确 定</el-button> -->
        <el-button size="medium" @click="previewDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import FixStepTool from "../../../components/fix-step-tool/fix-step-tool";
import fixStepMixin from "../../../mixins/CRM/fixStepTool.js";
import OwnershipDetail from "../components/OwnershipDetail";
import { formatRemark } from "../../../util/filterData.js";

export default {
  name: "CardTypeDetail",
  data() {
    return {
      equityId: "", //权益id
      previewDialog: false, // 预览权益dialog显示/隐藏
      activeNames: ["1", "2", "3", "4"],
      detailData: {},
      stepData: {
        stepE1: ".el-collapse-item",
        stepList: [
          {
            name: "基础信息",
            isactive: false
          },
          {
            name: "开卡/充值设置",
            isactive: false
          },
          {
            name: "会员卡规则",
            isactive: false
          },
          {
            name: "会员卡权益",
            isactive: false
          }
        ]
      }
    };
  },
  components: {
    fixStepTool: FixStepTool,
    OwnershipDetail
  },
  created() {
    this.getDetail();
  },
  mixins: [fixStepMixin],
  filters: {
    merchantList: function(arr) {
      return arr
        .map(item => {
          return item.merchantName;
        })
        .join(",");
    },
    nianFeiTime: function(value, that) {
      if (that.detailData.yearRule.deductionsType == "fixed_date") {
        return `固定日期 ${new Date(
          ("2019-" + value).replace(/-/g, "/")
        ).formatDate("MM-dd")}`;
      } else {
        return `开卡后${value}天`;
      }
    },
    nianFeiJiZhi: function(value, that) {
      if (that.detailData.yearRule.freeAnnualFee == "total_ticket") {
        return `累计购票${value}次`;
      } else {
        return `累计消费${value}元`;
      }
    },
    nianfei: function(value) {
      return value == 0 ? "否" : "是";
    },
    showCardType: function(value) {
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
    // 免密支付
    formatFreeConsumption(value) {
      if (value) {
        return "允许免密支付";
      } else {
        return "不允许免密支付";
      }
    },
    emptyShow: function(value) {
      if (value || value == 0) {
        return value;
      } else {
        return "-";
      }
    },
    formatChannelList: function(value) {
      if (!value) return;
      let newChannelList = value.map(item => {
        return item.channelName;
      });
      if (newChannelList.indexOf("全选") != -1) {
        newChannelList.splice(newChannelList.indexOf("全选"), 1);
      }
      return newChannelList.join("、");
    }
  },
  methods: {
    // 处理remark格式问题
    formatRemark(value) {
      return formatRemark(value);
    },
    // 预览权益
    handlePreviewEquity(id) {
      this.$set(this, "equityId", id);
      this.previewDialog = true;
    },
    //有效期类型
    getworkTime(detailData) {
      if (!(detailData.workTimeNum && detailData.workTimeType)) {
        return "-";
      }
      var time = "-";
      var str = detailData.workTimeNum;
      switch (detailData.workTimeType) {
        case "year":
          time = str + "年";
          break;
        case "month":
          time = str + "月";
          break;
        case "day":
          time = str + "日";
          break;

        default:
          break;
      }
      return time;
    },
    // 查看卡政策详情
    getDetail() {
      let params = {
        tenantId: this.$store.state.loginUser.consumerId, //租户id
        cardProductId: this.$route.query.cardProductId //卡类型id
      };
      this.$crmList
        .getCardTypeDetail(params)
        .then(data => {
          this.detailData = data;
        })
        .catch(err => console.log(err));
    },
    handleStarted() {
      this.$confirm(`确定要启用 ${this.detailData.cardName} 吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            status: "start",
            id: this.detailData.id, //会员卡id
            tenantId: this.$store.state.loginUser.consumerId //租户id
          };
          this.$crmList
            .changeCardTypeStatus(data)
            .then(() => {
              this.$message({
                type: "success",
                message: "已启用!"
              });
              this.$router.push({ path: "/member/cardTypeManagement/list" });
            })
            .catch(err => console.log(err));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消启用"
          });
        });
    },
    handleCancle() {
      this.$router.push({ path: "/member/cardTypeManagement/list" });
    }
  }
};
</script>
<style lang="scss">
.card-type-detail {
  width: 80%;
  .crumbs-wrap {
    padding: 0 0 20px 0;
    a.itemLink {
      font-weight: normal;
      color: #666666;
      cursor: pointer;
    }
  }
  .card-type-detail-content {
    border: 0;
    //   基础设置
    .card-type-basic-info,
    .open-card-recharge-set,
    .card-rule {
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .basic-info-item {
        display: flex;
        flex-direction: column;
        // justify-content: space-between;
        width: 50%;
        .item-inner {
          display: flex;
          align-items: baseline;
          font-size: 12px;
          color: #666666;
          margin-top: 15px;
          .lable-name {
            width: 100px;
            display: inline-block;
            font-size: 12px;
            color: #666666;
            line-height: 1.3;
          }
          .no-img {
            display: inline-block;
            width: 238px;
            height: 113px;
            background: #f5f5f5;
            font-size: 12px;
            text-align: center;
            line-height: 113px;
          }
        }
      }
      .annual-fee-rule {
        width: 100%;
        margin-top: 15px;
        .annual-fee-rule-title {
          font-size: 12px;
          font-weight: bold;
        }
      }
    }
    // 卡权益列表样式
    .equity-item-wrap {
      display: flex;
      flex-wrap: wrap;
      .equity-coupon-item {
        display: flex;
        position: relative;
        width: 289px;
        margin: 0 55px 25px 0;
        .icon-neiye-danchuangquxiao {
          cursor: pointer;
          font-size: 12px;
          color: #666;
          transform: scale(0.8);
          position: absolute;
          right: 16px;
          top: -4px;
        }
        .white-dot {
          position: absolute;
          height: 85px;
          left: 4px;
        }
        .coupon-item-type {
          font-family: MicrosoftYaHei;
          width: 48px;
          height: 76px;
          line-height: 1.4;
          padding: 11px 15px;
          box-sizing: border-box;
          text-align: center;
          letter-spacing: 0;
          font-size: 14px;
          color: #ffffff;
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
        .coupon-item-name {
          font-family: MicrosoftYaHei;
          width: 240px;
          height: 76px;
          padding: 0 15px;
          line-height: 76px;
          text-align: center;
          font-size: 14px;
          color: #333333;
          letter-spacing: 0;
          border-top-right-radius: 4px;
          border-bottom-left-radius: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .preview-btn {
          font-family: MicrosoftYaHei;
          font-size: 12px;
          color: #666666;
          letter-spacing: 0;
          cursor: pointer;
          position: absolute;
          bottom: 3px;
          right: 16px;
        }
        // 消费类颜色
        .consumption-type-color {
          background: #619bff;
        }
        .consumption-name-color {
          background: #f2f7ff;
        }
        // 服务类颜色
        .service-type-color {
          background: #c191e8;
        }
        .service-name-color {
          background: #f5eff9;
        }
        // 体验类颜色
        .experience-type-color {
          background: #fba07c;
        }
        .experience-name-color {
          background: #faf4f2;
        }
        // 身份类颜色
        .identity-type-color {
          background: #ff1e78;
        }
        .identity-name-color {
          background: #fff5f9;
        }
      }
    }
  }
  .detail-btn-wrap {
    width: 100%;
    margin: 0 0 40px;
    text-align: center;
  }
}
// 自有权益dialog样式
.__equity-dialog {
  .el-dialog__header {
    padding: 10px 20px;
  }
  .el-dialog__body {
    padding: 0px 20px;
  }
  .el-dialog__footer {
    text-align: center;
  }
}
</style>


