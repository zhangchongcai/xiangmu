<template>
  <div>
      <!-- 卖品概览入口 -->
       <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created(){
    this.$camList.goSaleHome().then(response =>{
       this.$router.push({path:response.data})
     }) 
  }
};
</script>
