<template>
  <div>
      <!-- 卖品概览入口 -->
       <router-view></router-view>
  </div>
</template>
<script>
import {goSaleHome} from '../../http/interface'

export default {
  data() {
    return {};
  },
  beforeRouteEnter(to,from,next){
    goSaleHome().then(response =>{
        next((vm)=>{
          vm.$router.push({path:response.data});
        })
     }) 
  }
};
</script>
