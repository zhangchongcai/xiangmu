<template>
  <cinema-center :cinameCenterData="cinameCenterData"></cinema-center>
</template>

<script>
import CinemaCenter from '../cinemaCenter';
export default {
  components: {
    CinemaCenter
  },
  data () {
    return {
      cinameCenterData: []
    };
  },
  async created () {
    let res = await this.$rptList.getOldCinema();
    this.cinameCenterData = res.data;
  }
};
</script>

<style lang="scss" scoped>
</style>