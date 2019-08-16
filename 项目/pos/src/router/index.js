import homeRoutes from './home'
import pagesRoutes from './page'
import memberRouters from './page/member'
let routes = [{   //一级路由  home  或者  page 
		path: '/',
		redirect: 'home',
		component: () => import('views'),
		children: [

			// 主 menu home 页 (外层带页面框架的页面)
			{
				path: 'home',
				name: 'homePage',
				meta: {
					keepAlive: true
				},
				component: () => import('views/common/layout/index'),
				children: homeRoutes //二级路由
			},

			// 内部页面 (UI 图对应的不带框架的页面)
			{
				path: 'page',
				component: () => import('views/common/page/Index'),
				children: pagesRoutes, //二级路由
			},
			//会员模块路由 （合并冲突采用来源）
			{
				path: 'member',
				redirect:"member/memberHome",
				component: () => import('views/member/index'),
				children: memberRouters //二级路由
			},
			{
				path: 'login',
				component: () => import('views/csmpos/login'),
				name:'login',
			}
		]
	},



];


export default routes;