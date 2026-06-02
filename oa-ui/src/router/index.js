import { createRouter, createWebHashHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/user',
    children: [
      {
        path: 'user',
        name: 'UserList',
        component: () => import('../views/user/UserList.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'department',
        name: 'DepartmentList',
        component: () => import('../views/department/DepartmentList.vue'),
        meta: { title: '部门管理' }
      },
      {
        path: 'position',
        name: 'PositionList',
        component: () => import('../views/position/PositionList.vue'),
        meta: { title: '岗位管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
