import couponSalesRoutes from './ticketSales';
const ccmRoutes = [
  {
    path: 'couponSales',
    meta: {
      title: '票券'
    },
    component: resolve => require(['../views/ticketSale.vue'], resolve),
    name: 'couponSales',
    redirect: 'couponSales/salesManagement',
    children: couponSalesRoutes
  }
];
export default ccmRoutes;
