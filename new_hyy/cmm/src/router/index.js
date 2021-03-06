import marketingRoutes from './marketing';
const cmmRoutes = [
  // 营销
  {
    path: 'management',
    meta: {
      title: '营销'
    },
    component: resolve => require(['../views/marketing.vue'], resolve),
    name: '营销',
    redirect: 'management/movieTicketActivity',
    children: marketingRoutes
  }
];
export default cmmRoutes;
