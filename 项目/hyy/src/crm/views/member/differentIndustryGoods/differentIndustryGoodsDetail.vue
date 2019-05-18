<template>
  <div class="_different-industry-goods-detail">
    <el-collapse v-model="activeNames" class="card-type-detail-content">
      <el-collapse-item title="商品信息" name="1">
        <div class="card-type-basic-info">
          <div class="basic-info-item item-left">
            <div class="item-inner"><label class="lable-name">商家名称：</label>{{detailData.merchantName | emptyShow}}</div>
            <div class="item-inner"><label class="lable-name">合同编号：</label>{{detailData.pactNo | emptyShow}}</div>
            <div class="item-inner"><label class="lable-name">商品名称：</label>{{detailData.goodsName | emptyShow}}</div>
            <div class="item-inner"><label class="lable-name">商品类型：</label>{{detailData.goodsTypeName | emptyShow}}</div>
            <div class="item-inner"><label class="lable-name">商品说明：</label><span style="font-size:12px;" v-html="formatRemark(detailData.remark)"></span></div>
          </div>
          <div class="basic-info-item item-right">
            <div class="item-inner"><label class="lable-name">成本价：</label>{{detailData.costPrice | emptyShow}}</div>
            <div class="item-inner"><label class="lable-name">有效期：</label>{{detailData.validityType |
              formatValidityType(this)}}</div>
            <div class="item-inner"><label class="lable-name">核销方式：</label>{{detailData.writeOffWay |
              formatWriteOffWay}}</div>
            <div class="item-inner"><label class="lable-name">优惠券：</label>{{detailData.goodsTickets | sumTotalTickets}}
              张</div>
            <div class="item-inner" style="display: flex;align-items: flex-start;"><label
                class="lable-name">商品图片：</label>
              <span v-if="detailData.imgPath">
                <img :src="detailData.imgPath" style="width:238px;height:113px;" alt="imgPath">
              </span>
              <span v-else class="no-img">
                暂无商品图片
              </span>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="优惠券适用规则" name="2">
        <div class="open-card-recharge-set">
          <div class="basic-info-item item-left">
            <div class="item-inner"><label class="lable-name">可用时间：</label>{{detailData.diffGoodsRule.useTime |
              emptyShow}}</div>
            <div class="item-inner"><label class="lable-name">使用门店：</label>{{detailData.diffGoodsRule.applyStores |
              emptyShow}}</div>
            <div class="item-inner"><label class="lable-name">预约提示：</label>{{detailData.diffGoodsRule.appointmentReminder
              | emptyShow}}</div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="库存预警" name="3">
        <div class="card-rule">
          <div class="basic-info-item item-left">
            <div class="item-inner"><label class="lable-name">剩余库存：</label>{{detailData.diffGoodsWarning.warningNum |
              emptyShow}}</div>
            <div class="item-inner"><label class="lable-name">预警手机号：</label>{{detailData.diffGoodsWarning.warningMobileNums
              |
              emptyShow}}</div>
            <div class="item-inner"><label class="lable-name">预警邮箱地址：</label>{{detailData.diffGoodsWarning.warningEmail
              | emptyShow}}</div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <fixStepTool :stepData="stepData.stepList" class="_fixsteptool-member"></fixStepTool>
    <div class="detail-btn-wrap">
      <el-button  v-if="detailData.status == 'not_on'" class="el-btn-custom" type="primary" @click="handleStarted">上架</el-button>
      <el-button class="el-btn-custom" type="primary" @click="handleCancle">确定</el-button>
    </div>
  </div>
</template>
<script>
import FixStepTool from "../../../components/fix-step-tool/fix-step-tool";
import fixStepMixin from "../../../mixins/CRM/fixStepTool.js";
import { formatRemark } from "../../../util/filterData.js";
export default {
  name: "differentIndustryGoodsDetail",
  data() {
    return {
      equityId: "", //权益id
      previewDialog: false, // 预览权益dialog显示/隐藏
      activeNames: ["1", "2", "3"],
      detailData: {
        diffGoodsRule:{},
        diffGoodsWarning:{}
      },
      stepData: {
        stepEl: ".el-collapse-item",
        stepList: [
          {
            name: "商品信息",
            isactive: false
          },
          {
            name: "优惠券适用规则",
            isactive: false
          },
          {
            name: "库存预警",
            isactive: false
          }
        ]
      }
    };
  },
  components: {
    fixStepTool: FixStepTool
  },
  created() {
    this.getDetail();
  },
  methods: {
    //   获取详情
    getDetail() {
      this.$crmList
        .diffGoodsDetail({
          goodsId: this.$route.query.goodsId,
          tenantId: this.$store.state.loginUser.consumerId
        })
        .then(res => {
          this.detailData = res;
        })
        .catch(err => console.log(err));
    },
    // 处理remark格式问题
    formatRemark(value) {
      return formatRemark(value);
    },
    handleStarted() {
      this.$confirm(`确定要上架 ${this.detailData.goodsName} 吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            status: "has_been_on",
            id: this.detailData.id, //商品id
            tenantId: this.$store.state.loginUser.consumerId //租户id
          };
          this.$crmList
            .diffGoodsUpdateStatus(data)
            .then(() => {
              this.$message({
                type: "success",
                message: "已上架!"
              });
              this.$router.push({ path: "/member/differentIndustryGoods/list" });
            })
            .catch(err => console.log(err));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消上架"
          });
        });
    },
    handleCancle() {
      this.$router.push({ path: "/member/differentIndustryGoods/list" });
    }
  },
  mixins: [fixStepMixin],
  filters: {
    // 有效期
    formatValidityType(value, that) {
      if (value == "fixed_type") {
        return that.detailData.startTime + " 至 " + that.detailData.endTime;
      } else if (value == "dynamic_type") {
        return "有效期" + that.detailData.timeNum + "天";
      } else {
        return "-";
      }
    },
    // 核销方式
    formatWriteOffWay(value) {
      if (value == "ONLINE_ONLINE") {
        return "线上获取，线上消费";
      } else if (value == "ONLINE_OFFLINE") {
        return "线上获取，线下消费";
      } else {
        return "-";
      }
    },
    // 优惠券
    sumTotalTickets(value) {
      if (value) {
        var totalNum = 0;
        for (var i = 0; i < value.length; i++) {
          totalNum += parseInt(value[i].ticketNum);
        }
        return totalNum;
      } else {
        return "-";
      }
    },
    emptyShow: function(value) {
      if (value || value == 0) {
        return value;
      } else {
        return "-";
      }
    }
  }
};
</script>
<style lang="scss">
._different-industry-goods-detail {
  width: 80%;
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
            word-break: keep-all;
            flex-shrink: 0;
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
    }
  }
  .detail-btn-wrap {
    width: 100%;
    margin: 0 0 40px;
    text-align: center;
  }
}
</style>
