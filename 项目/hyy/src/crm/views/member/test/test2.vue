<template>
  <div>
    <crmCardTypeDialog @crmCardTypeDialogCallBack="handleCallback1" :reviewData="huixianData1" :dialogVisible.sync="dialogVisible1" />
    <crmCardPolicyDialog @crmCardPolicyDialogCallBack="handleCallback2" :reviewData="huixianData2" :dialogVisible.sync="dialogVisible2" />
    <crmMemberLevelDialog @crmMemberLevelDialogCallBack="handleCallback3" :reviewData="huixianData3" :dialogVisible.sync="dialogVisible3" />
    <el-button type="primary" @click="()=>{dialogVisible1=true}">会员卡类型</el-button>
    <el-button type="primary" @click="()=>{dialogVisible2=true}">会员卡政策</el-button>
    <el-button type="primary" @click="()=>{dialogVisible3=true}">会员等级</el-button>
  </div>
</template>
<script type="text/javascript">
import crmCardTypeDialog from "../../../dialogs/crmCardType";
import crmCardPolicyDialog from "../../../dialogs/crmCardPolicy";
import crmMemberLevelDialog from "../../../dialogs/crmMemberLevel";

export default {
  data() {
    return {
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      huixianData1: [],
      huixianData2: [],
      huixianData3: []
    };
  },
  methods: {
    handleCallback1(res) {
      this.huixianData1 = res.data;
    },
    handleCallback2(res) {
      this.huixianData2 = res.data;
    },
    handleCallback3(res) {
      this.huixianData3 = res.data;
    }
  },
  components: {
    crmCardTypeDialog,
    crmCardPolicyDialog,
    crmMemberLevelDialog
  },
  mounted() {}
};
</script>
<style lang="scss">
</style>