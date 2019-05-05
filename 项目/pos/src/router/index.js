import homeRoutes from './home'
import pagesRoutes from './page'
let routes = [{   //一级路由  home  或者  page 
		path: '/',
		redirect: 'home',
		component: () => import('views'),
		children: [

			// 主 menu home 页 (外层带页面框架的页面)
			{
				path: 'home',
				component: () => import('views/common/layout'),
				children: homeRoutes //二级路由
			},

			// 内部页面 (UI 图对应的不带框架的页面)
			{
				path: 'page',
				component: () => import('views/common/page'),
				children: pagesRoutes //二级路由
			},
			{
				path: 'login',
				component: () => import('views/csmpos/login')
			}
		]
	},



];


export default routes;