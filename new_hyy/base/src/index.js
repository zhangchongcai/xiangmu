import axios from './http/api';
import baseStore from './vuex/';
import baseRouter from './baseRouter';
import sysRoutes from 'baseSrc/router/';
import baseRegComponents from './util/baseRegComponents';
import cacheMixin from 'baseSrc/mixins/cacheMixin.js';
import baseInterface from 'baseSrc/http/interface.js';
import baseRouterView from './views/sysMange/link.vue';
import fixStepTool from './components/fix-step-tool/fix-step-tool.vue';
import fixStepToolMixin from './mixins/CTM/fixStepTool';

const Login = () =>
  import(/* webpackChunkName: "frame" */ './views/login/index.vue');
const Main = () => import(/* webpackChunkName: "frame" */ './views/Main.vue');
const Home = () => import(/* webpackChunkName: "frame" */ './views/Home.vue');
const App = () => import(/* webpackChunkName: "frame" */ './App.vue');
const singleCinema = () =>
  import(/* webpackChunkName: "frame" */ './dialogs/cinemaDialog/singleCinema');
const multiCinema2 = () =>
  import(/* webpackChunkName: "frame" */ './dialogs/cinemaDialog/multiCinema2');

export {
  baseInterface,
  cacheMixin,
  singleCinema,
  multiCinema2,
  App,
  Login,
  Main,
  Home,
  sysRoutes,
  axios,
  baseStore,
  baseRouter,
  baseRegComponents,
  baseRouterView,
  fixStepTool,
  fixStepToolMixin
};
