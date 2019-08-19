import workflowRoutes from './workflow'

let routes = [{
    path: '',
    redirect: 'workflow'
}, {
    path: '/workflow',
    meta: {
        title: '审批工作流'
    },
    component: (resolve) => require(['../views/index.vue'], resolve),
    name: '审批工作流',
    redirect: 'workflow/link',
    children: workflowRoutes
}]


export default routes;