<template>
  <div>
    <sales-activity-create :pageType="pageType" :innerId="innerId" />
  </div>
</template>

<script>
import salesActivityCreate from "./add-or-update"
export default {
  data () {
    return {
      pageType: "create",//页面状态
      innerId: null,//入参
    }
  },
  components: {
    salesActivityCreate
  },
  created () {

  },
  methods: {

  },

}
</script>
<style lang="scss" scoped>
</style>