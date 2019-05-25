<template>
  <div class="app-container">
    <div class="content-wrap">
       <!-- 亲，您没有权限访问哦 -->
      <router-view>
      </router-view>
      <!-- 首页入口 -->
    </div>
  </div>
</template>
<script>
import {goHome} from '../../http/interface'
export default {
  // created(){
  //   this.$camList.goHome().then(response =>{
  //       this.$router.push({path:response.data})
  //    }) 
  // },
  beforeRouteEnter(to,from,next){
    goHome().then(response =>{
        next((vm)=>{
          vm.$router.push({path:response.data});
        })
     }) 
  }
};
</script>
