<template>
  <div>
    <user-defined-activity-copy :pageType="pageType" :innerId="innerId" :approvalResult="approvalResult" />
  </div>
</template>

<script>
import userDefinedActivityCopy from "./add-or-update"
export default {
  data () {
    return {
      pageType: "copy",//页面状态
      innerId: this.$route.query.id || null,//入参
      approvalResult: this.$route.query.approvalResult || "",//审批状态
    }
  },
  components: {
    userDefinedActivityCopy
  },
  created () {
    console.log("copy", this.$route.query.id)
  },
  methods: {

  },

}
</script>
<style lang="scss" scoped>
</style>