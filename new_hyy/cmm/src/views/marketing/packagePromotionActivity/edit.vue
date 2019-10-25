<template>
  <div>
    <package-promotion-activity-edit :pageType="pageType" :innerId="innerId" />
  </div>
</template>

<script>
import packagePromotionActivityEdit from "./add-or-update"
export default {
  data () {
    return {
      pageType: "edit",//页面状态
      innerId: this.$route.query.id || null,//入参
    }
  },
  components: {
    packagePromotionActivityEdit
  },
  created () {
    console.log("edit", this.$route.query.id)
  },
  methods: {

  },

}
</script>
<style lang="scss" scoped>
</style>