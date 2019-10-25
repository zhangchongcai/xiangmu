<template>
  <div>
    <package-promotion-activity-copy :pageType="pageType" :innerId="innerId" />
  </div>
</template>

<script>
import packagePromotionActivityCopy from "./add-or-update"
export default {
  data () {
    return {
      pageType: "copy",//页面状态
      innerId: this.$route.query.id || null//入参
    }
  },
  components: {
    packagePromotionActivityCopy
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