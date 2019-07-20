<template>
  <div class="merchant-detail-wrap">
    <!-- 详情部分 -->
    <div class="merchant-detail-content">
      <div class="item-inner"><label class="lable-name">商户ID：</label>{{detailData.merchantId?detailData.merchantId:'-'}}
      </div>
      <div class="item-inner"><label
          class="lable-name">商户编号：</label>{{detailData.merchantNum?detailData.merchantNum:'-'}}</div>
      <div class="item-inner"><label
          class="lable-name">商户名称：</label>{{detailData.merchantName?detailData.merchantName:'-'}}</div>
      <div class="item-inner"><label class="lable-name">商户状态：</label>{{detailData.status==0?'停售':'开售'}}</div>
      <div class="item-inner"><label class="lable-name">合同编号：</label>{{detailData.compactId?detailData.compactId:'-'}}
      </div>
      <div class="item-inner"><label class="lable-name">合作时间：</label>{{detailData.cooperationStart?`${detailData.cooperationStart}
        至 ${detailData.cooperationEnd}`:'-'}}</div>
      <div class="item-inner"><label class="lable-name">备注：</label>{{detailData.memo?detailData.memo:'-'}}</div>
    </div>
    <div class="detail-btn-wrap">
      <el-button class="_el-btn-custom" @click="handleBack">关闭</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "jointNameCardMerchantDetail",
  data() {
    return {
      detailData: {}
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    // 关闭
    handleBack() {
      this.$router.push({ path: "/member/jointNameCard/list" });
    },
    search() {
      let params = {
        merchantId: this.$route.query.merchantId,
        tenantId: this.$store.state.loginUser.consumerId
      };
      this.$crmList
        .getMerchantInfo(params)
        .then(data => {
          this.detailData = data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="scss">
.merchant-detail-wrap {
  .merchant-detail-content {
    .item-inner {
      display: flex;
      align-items: center;
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
  }
  .detail-btn-wrap {
    width: 100%;
    margin: 40px 0 40px;
    text-align: center;
  }
}
</style>


