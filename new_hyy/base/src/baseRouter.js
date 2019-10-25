import Vue from 'vue';
import Router from 'vue-router';

// import { router } from "./index";

Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: []
});
// export default function initRouter(router) {
//   return new Router({
//     mode: "history",
//     base: process.env.BASE_URL,
//     routes: [...router]
//   });
// }
