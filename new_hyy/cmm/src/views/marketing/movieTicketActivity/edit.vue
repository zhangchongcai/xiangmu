<template>
  <div>
    <movie-ticket-activity-edit :pageType="pageType" :innerId="innerId" />
  </div>
</template>

<script>
import movieTicketActivityEdit from "./add-or-update"
export default {
  data () {
    return {
      pageType: "edit",//页面状态
      innerId: this.$route.query.id || null,//入参
    }
  },
  components: {
    movieTicketActivityEdit
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