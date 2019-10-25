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

import { getOrgInfo } from '../../http/interface';
export default {
  data () {
    return {};
  },
  beforeRouteEnter (to, from, next) {
    getOrgInfo({ body: {} }).then(response => {
      if (response.data) {
        next(vm => {
          let type = response.data.orgType;
          if (type == 'group') {
            vm.$router.push('/analysis/group/home');
          } else if (type == 'city') {
            vm.$router.push('/analysis/area/home');
          } else if (type == 'cinema') {
            vm.$router.push('/analysis/cinema/home');
          }
        });
      }
    });
  }
};
</script>
