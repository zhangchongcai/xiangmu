<template>
  <div>
      <!-- 会员概览入口 -->
       <router-view></router-view>
  </div>
</template>
<script>
import {getOrgInfo} from '../../http/interface'
export default {
  data() {
    return {};
  },
  beforeRouteEnter(to,from,next){
    getOrgInfo({body:{}}).then(response =>{
         if(response.data){
             next(vm=>{
                let type = response.data.orgType;
                if(type == 'group'){
                    vm.$router.push('/analysis/group/member/total')
                }else if(type == 'city'){
                    vm.$router.push('/analysis/area/member/total')
                }else if(type == 'cinema'){
                    vm.$router.push('/analysis/cinema/member/total')
                }
             })
        }
     }) 
  }
};
</script>
