<template>
  <div>
    <gift-points-activity-revise :pageType="pageType" :innerId="innerId" :activityState="activityState" />
  </div>
</template>

<script>
import giftPointsActivityRevise from "./add-or-update"
export default {
  data () {
    return {
      pageType: "revise",//页面状态
      innerId: this.$route.query.id || null,//入参
      activityState: this.$route.query.activityState || null//入参
    }
  },
  components: {
    giftPointsActivityRevise
  },
  created () {
    console.log("revise", this.$route.query.id)
  },
  methods: {

  },

}
</script>
<style lang="scss" scoped>
</style>