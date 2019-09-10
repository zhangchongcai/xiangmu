<template>
  <div class="layer">
    <div class="pageTitle">{{title}}</div>
    <div class="contentLayer">
      <router-view></router-view>
    </div>
    
  </div>
</template>

<script>
export default {
  data(){
    return{
      
    }
  },
  mounted(){
  },
  computed:{
    title(){
      return this.$route.meta.title;
    }
  },
  methods: {
    
    },
}
</script>

<style lang="scss" scoped>
.layer{
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.pageTitle{
  font-size: $font-size16;
  @include bg_color($background-color-theme);
  padding: 1.3vh 3vw;
  color:$font-color-white
}
.contentLayer{
  padding: 2vh 2vw 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>





  