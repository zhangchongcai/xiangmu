<template>
  <div class="merchant-detail-wrap">
    <!-- 面包屑 -->
    <div class="crumbs-wrap">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>会员</el-breadcrumb-item>
        <el-breadcrumb-item>
          <router-link class="itemLink" :to="{path : '/jointNameCard/list'}">联名商户管理</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>联名商户详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 详情部分 -->
    <div class="merchant-detail-content">
      <div class="item-inner"><label class="lable-name">商户ID：</label>{{detailData.merchantId?detailData.merchantId:'-'}}</div>
      <div class="item-inner"><label class="lable-name">商户编号：</label>{{detailData.merchantNum?detailData.merchantNum:'-'}}</div>
      <div class="item-inner"><label class="lable-name">商户名称：</label>{{detailData.merchantName?detailData.merchantName:'-'}}</div>
      <div class="item-inner"><label class="lable-name">商户状态：</label>{{detailData.status==0?'停售':'开售'}}</div>
      <div class="item-inner"><label class="lable-name">合同编号：</label>{{detailData.compactId?detailData.compactId:'-'}}</div>
      <div class="item-inner"><label class="lable-name">合作时间：</label>{{detailData.cooperationStart?`${detailData.cooperationStart}
        至 ${detailData.cooperationEnd}`:'-'}}</div>
      <div class="item-inner"><label class="lable-name">备注：</label>{{detailData.memo?detailData.memo:'-'}}</div>
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
  // 面包屑
  .crumbs-wrap {
    padding: 0 0 20px 0;
    a.itemLink {
      font-weight: normal;
      color: #666666;
      cursor: pointer;
    }
  }
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
}
</style>


