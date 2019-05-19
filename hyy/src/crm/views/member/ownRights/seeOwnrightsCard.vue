<template>
  <div class="see-ownrights-card">
    <!-- 面包屑 -->
    <div class="crumbs-wrap">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>会员</el-breadcrumb-item>
        <el-breadcrumb-item>权益</el-breadcrumb-item>
        <el-breadcrumb-item>
          <router-link class="itemLink" :to="{path : '/ownRights/ownRightsList'}">自有权益库管理</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>权益查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <OwnershipDetail :equityID="equityID" @isShowOpen="showOpen"></OwnershipDetail>
    <div class="detail-btn-wrap" v-show="isShow">
      <el-button class="el-btn-custom" type="primary" @click="handleStarted">启用</el-button>
      <el-button class="el-btn-custom" @click="handleCancle">确定</el-button>
    </div>
  </div>
</template>
<script>
import OwnershipDetail from "../components/OwnershipDetail";
export default {
  name: "seeOwnrightsCard",
  data() {
    return {
      isShow: false,
      detailData: {},
      equityID: this.$route.query.equityId
    };
  },
  components: {
    OwnershipDetail
  },
  methods: {
    showOpen(str, detailData) {
      if (str == "ok") {
        this.isShow = true;
        this.detailData = detailData;
      }
    },
    handleStarted() {
      this.$confirm(`确定要启用 ${this.detailData.equityName} 吗？`, "提示", {
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
            .changeEquityCardStatus(data)
            .then(() => {
              this.$message({
                type: "success",
                message: "已启用!"
              });
              this.$router.push({ path: "/member/ownRights/ownRightsList" });
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
      this.$router.push({ path: "/member/ownRights/ownRightsList" });
    }
  }
};
</script>
<style lang="scss">
.see-ownrights-card {
  // 面包屑
  .crumbs-wrap {
    padding: 0 0 20px 0;
    a.itemLink {
      font-weight: normal;
      color: #666666;
      cursor: pointer;
    }
  }
  .detail-btn-wrap {
    width: 100%;
    text-align: center;
  }
}
</style>

