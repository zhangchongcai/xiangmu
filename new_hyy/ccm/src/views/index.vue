<template>
  <section>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
      <!-- <Main /> -->
    </transition>
  </section>
</template>
<script>
// import mainCon from './Main'
export default {
  // components: {
  //     Main: mainCon
  // }
};
</script>
<style lang="scss">
</style>
