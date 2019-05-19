<template>
  <div class="app-container">
    <div class="content-wrap">
      <router-view></router-view>
      <!-- 首页入口 -->
    </div>
  </div>
</template>
<script>
export default {
  created(){
    this.$camList.goHome().then(response =>{
        this.$router.push({path:response.data})
     }) 
  }
};
</script>
