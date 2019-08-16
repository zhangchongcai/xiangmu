const couponSalesRoutes = [{
    path: 'salesManagement',
    meta: {
        title: '票券销售申请单管理'
    },
    component: (resolve) => require(['../../views/coupon/salesManagement/index.vue'], resolve),
    name: 'salesManagement'
}, {
    path: 'createSales',
    meta: {
        title: '票券销售申请单管理'
    },
    component: (resolve) => require(['../../views/coupon/salesManagement/createSaleList.vue'], resolve),
    name: 'createSales'
}, {
    path: 'checkSaleList',
    meta: {
        title: '查看票券销售申请单管理'
    },
    component: (resolve) => require(['../../views/coupon/salesManagement/checkSaleList.vue'], resolve),
    name: 'checkSaleList'
}, {
    path: 'setRuleItem',
    meta: {
        title: '新建规则'
    },
    component: (resolve) => require(['../../views/coupon/salesManagement/setRuleItem.vue'], resolve),
    name: 'setRuleItem'
}, {
    path: 'checkRuleItem',
    meta: {
        title: '查看规则'
    },
    component: (resolve) => require(['../../views/coupon/salesManagement/checkRuleItem.vue'], resolve),
    name: 'checkRuleItem'
}, {
    path: 'typeManagement',
    meta: {
        title: '票券分类设置',
    },
    component: (resolve) => require(['../../views/coupon/typeManagement/index.vue'], resolve),
    name: 'typeManagement'
}, {
    path: 'addTicket',
    meta: {
        title: '新建票券分类'
    },
    name: 'addTicket',
    component: (resolve) => require(['../../views/coupon/typeManagement/ticketType.vue'], resolve),
},{
    path: 'editTicket',
    meta: {
        title: '编辑票券分类'
    },
    name: 'editTicket',
    component: (resolve) => require(['../../views/coupon/typeManagement/ticketType.vue'], resolve),
},{
    path: 'numberCreate',
    meta: {
        title: '票券编号预生成'
    },
    name: 'numberCreate',
    component: (resolve) => require(['../../views/coupon/numberCreate/index.vue'], resolve)
}, {
    path: 'addNumber',
    meta: {
        title: '新建预生成批次'
    },
    name: 'addNumber',
    component: (resolve) => require(['../../views/coupon/numberCreate/addNumber.vue'], resolve)
}, {
    path: 'serviceParamters',
    meta: {
        title: '票券业券参数'
    },
    name: 'serviceParamters',
    component: (resovle) => require(['../../views/coupon/serviceParamters/index.vue'], resovle)
}, {
    path: 'inventoryManagement',
    meta: {
        title: '票券原票库存管理'
    },
    name: 'inventoryManagement',
    component: (resolve) => require(['../../views/coupon/inventoryManagement/index.vue'], resolve),
}, {
    path: 'searchNumber',
    meta: {
        title: '票券编号查询'
    },
    name: 'searchNumber',
    component: (resolve) => require(['../../views/coupon/searchNumber/index.vue'], resolve)
}, {
    path: 'checkSearchNumber',
    meta: {
        title: '查看票券信息'
    },
    name: 'checkSearchNumber',
    component: (resolve) => require(['../../views/coupon/searchNumber/check.vue'], resolve)
}, {
    path: 'reissue',
    meta: {
        title: '票券补发'
    },
    name: 'reissue',
    component: (resolve) => require(['../../views/coupon/reissue/index.vue'], resolve)
}, {
    path: 'printManagement',
    meta: {
        title: '票券打印管理'
    },
    name: 'printManagement',
    component: (resolve) => require(['../../views/coupon/printManagement/index.vue'], resolve)
}, {
    path: 'templateManagement',
    meta: {
        title: '票券模板管理'
    },
    name: 'templateManagement',
    component: (resolve) => require(['../../views/coupon/templateManagement/index.vue'], resolve)
}, {
    path: 'couponTemplate',
    meta: {
        title: '新建票券模板管理'
    },
    name: 'couponTemplate',
    component: (resolve) => require(['ccm/views/coupon/templateManagement/couponTemplate.vue'], resolve)
}, {
    path: 'checkCouponTemplate',
    meta: {
        title: '查看票券模板'
    },
    name: 'checkCouponTemplate',
    component: (resolve) => require(['ccm/views/coupon/templateManagement/checkCouponTemplate.vue'], resolve)
}, {
    path: 'receivableManagement',
    meta: {
        title: '应收款管理'
    },
    name: 'receivableManagement',
    component: (resolve) => require(['ccm/views/coupon/receivableManagement'], resolve)
}, {
    path: 'creatReceivable',
    meta: {
        title: '应收款查看'
    },
    name: 'creatReceivable',
    component: (resolve) => require(['ccm/views/coupon/receivableManagement/create.vue'], resolve)
}]

export default couponSalesRoutes;