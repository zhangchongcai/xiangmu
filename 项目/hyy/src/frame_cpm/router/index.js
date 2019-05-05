import sysRoutes from './sys'
import ctmRoutes from 'ctm/router/'
import cmmRoutes from 'cmm/router/'
import rptRoutes from 'rpt/router/'
import crmRoutes from 'crm/router/'
import ccmRoutes from 'ccm/router/'
import camRoutes from 'cam/router/'
import cimRoutes from 'cim/router/'
import csmRoutes from 'csm/router/'
const routerView = {template: '<router-view></router-view>'};
let routes = [{
        path: '/login',
        meta: {
            title: '登录'
        },
        component: (resolve) => require(['../views/login/index.vue'], resolve),
        name: '登录',
    }, {
        path: '/',
        meta: {
            title: '首页'
        },
        component: (resolve) => require(['../views/index.vue'], resolve),
        name: '首页',
        redirect: 'home',
        children: [
            // 首页
            {
                path: 'home',
                meta: {
                      title: '主页'
                    },
                component: (resolve) => require(['../views/Home.vue'], resolve),
                name: '主页'
            },
            // 基础平台系统路由
            {
                path: 'sys',
                meta: {
                    title: "系统管理"
                },
                component: (resolve) => require(['../views/sysMange/link.vue'], resolve),
                name: '系统管理',
                children: sysRoutes
            },
            // 票务系统路由
            {
                path: 'ticket',
                meta: {
                    title: "票务系统"
                },
                component: routerView,
                name: '票务系统',
                children: ctmRoutes
            },
            // 营销系统路由
            {
                path: 'marketing',
                meta: {
                    title: "营销系统"
                },
                component: (resolve) => require(['cmm/views/marketing.vue'], resolve),
                name: '营销系统',
                children: cmmRoutes
            },
            // 报表系统路由
            {
                path: 'report',
                meta: {
                    title: "报表系统"
                },
                component: (resolve) => require(['rpt/views/index.vue'], resolve),
                name: '报表系统',
                children: rptRoutes
            },
            // 会员系统路由
            {
                path: 'member',
                meta: {
                    title: "会员系统"
                },
                component: (resolve) => require(['crm/views/index.vue'], resolve),
                name: '会员系统',
                children: crmRoutes
            },
            // 票券系统路由
            {
                path: 'coupon',
                meta: {
                    title: "票券系统"
                },
                component: (resolve) => require(['ccm/views/index.vue'], resolve),
                name: '票券系统',
                children: ccmRoutes
            },
            // 经营决策系统路由
            {
                path: 'analysis',
                meta: {
                    title: "经营决策系统"
                },
                component: (resolve) => require(['cam/views/index.vue'], resolve),
                name: '经营决策系统',
                children: camRoutes
            },
             //卖品系统路由
             {
                path: 'retail',
                meta: {
                    title: "卖品系统"
                },
                component: routerView,
                name: '卖品系统',
                redirect:'retail/index',
                children: cimRoutes
            },
            //交易系统路由
            {
            path: 'trade',
            meta: {
                title: "交易系統"
            },
            component: routerView,
            name: '交易系統',
            redirect:'trade/index',
            children: csmRoutes
        },
        ],
    }

]


export default routes;
