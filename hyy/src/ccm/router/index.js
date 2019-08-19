import couponSalesRoutes from './ticketSales';

let routes = [{
    path: 'couponSales',
    meta: {
        title: '票券'
    },
    component: (resolve) => require(['../views/ticketSale.vue'], resolve),
    name: 'couponSales',
    redirect: 'couponSales/salesManagement',
    children: couponSalesRoutes
}]


export default routes;