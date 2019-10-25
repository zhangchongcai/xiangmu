import workflowRoutes from './workflow'
const cwfRoutes = [
  {
    path: '/workflow',
    meta: {
      title: '审批工作流'
    },
    component: resolve => require(['../views/index.vue'], resolve),
    name: '审批工作流',
    redirect: 'normalApproval',
    children: workflowRoutes
  }
]
export default cwfRoutes
