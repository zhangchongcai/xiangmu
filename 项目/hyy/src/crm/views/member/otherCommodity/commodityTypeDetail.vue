<template>
  <div class="creatCommodityType">
    <div class="equity-info">
      <div class="item-inner"><label class="lable-name">商品类型名称：</label>{{ruleForm.commodityTypeName}}</div>
      <div class="item-inner"><label class="lable-name">备注：</label> <span style="font-size:12px;width:300px"
          v-html="formateRemark(ruleForm.remark)">
        </span></div>
    </div>
    <div class="detail-btn-wrap">
      <el-button class="_el-btn-custom" @click="handleCancle">关闭</el-button>
    </div>
  </div>
</template>
<script>
import { formatRemark } from "../../../util/filterData.js";
export default {
  name: "creatCommodityType",
  data() {
    return {
      ruleForm: {
        commodityTypeName: "",
        remark: ""
      }
    };
  },
  methods: {
    formateRemark(value) {
      return formatRemark(value);
    },
    getDetail(id) {
      this.$crmList
        .diffCommodityDetail({
          id: id,
          tenantId: this.$store.state.loginUser.consumerId
        })
        .then(data => {
          this.ruleForm = data;
        });
    },
    // 取消
    handleCancle() {
      this.$router.push({ path: "/member/otherCommodity/commodityList" });
    }
  },
  created() {
    if (this.$route.query.typeId) {
      this.ruleForm.id = this.$route.query.typeId;
      this.getDetail(this.$route.query.typeId);
    }
  }
};
</script>
<style lang="scss">
.creatCommodityType {
  padding-top: 34px;
  .el-input {
    width: 360px;
  }
  .el-textarea {
    width: 360px;
  }
  .equity-info {
    padding: 0 15px;
  }
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
  }
  .detail-btn-wrap {
    width: 100%;
    margin: 40px 0 40px;
    text-align: center;
  }
}
</style>
