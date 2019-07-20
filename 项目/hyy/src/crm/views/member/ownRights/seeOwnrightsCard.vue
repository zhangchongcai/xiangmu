<template>
  <div class="see-ownrights-card">
    <OwnershipDetail :equityID="equityID" @isShowOpen="showOpen"></OwnershipDetail>
    <div class="detail-btn-wrap">
      <el-button class="_el-btn-custom" v-show="isShow" type="primary" @click="handleStarted">启用</el-button>
      <el-button class="_el-btn-custom" @click="handleCancle">关闭</el-button>
    </div>
    <!-- 启用、停用的dialog -->
    <el-dialog title="" :visible.sync="stopStartDialog" width="320px" :show-close="false" class="_member-tip-dialog-custom-style">
      <i class="iconfont icon-danchuang-tishi _member-tip-dialog-icon"></i>
      <span class="_member-tip-dialog-desc">确定要{{detailData.status == 'start'?'停用':'启用'}} {{detailData.equityName}} 吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSureChangeStatus" class="_el-btn-custom _member-add-edit-save-btn">确定</el-button>
        <el-button @click="stopStartDialog = false" class="_el-btn-custom _member-add-edit-save-btn">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import OwnershipDetail from "../components/OwnershipDetail";
export default {
  name: "seeOwnrightsCard",
  data() {
    return {
      stopStartDialog: false,
      detailData: {},
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
    handleSureChangeStatus() {
      this.stopStartDialog = false;
      var scope = this.detailData;
      let _this = this;
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
    },
    handleStarted() {
      this.stopStartDialog = true;
    },
    handleCancle() {
      this.$router.push({ path: "/member/ownRights/ownRightsList" });
    }
  }
};
</script>
<style lang="scss">
.see-ownrights-card {
  .detail-btn-wrap {
    width: 100%;
    text-align: center;
  }
}
</style>

