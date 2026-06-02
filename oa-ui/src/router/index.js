import { createRouter, createWebHashHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/user/master',
    children: [
      {
        path: 'user',
        redirect: '/user/master'
      },
      {
        path: 'user/master',
        name: 'UserList',
        component: () => import('../views/user/UserList.vue'),
        meta: { title: '员工主档' }
      },
      {
        path: 'user/practice',
        name: 'UserPractice',
        component: () => import('../views/user/UserList.vue'),
        meta: { title: '执业相关' }
      },
      {
        path: 'user/project',
        name: 'UserProject',
        component: () => import('../views/user/UserList.vue'),
        meta: { title: '项目经历' }
      },
      {
        path: 'user/education',
        name: 'UserEducation',
        component: () => import('../views/user/UserList.vue'),
        meta: { title: '学历信息' }
      },
      {
        path: 'user/emergency',
        name: 'UserEmergency',
        component: () => import('../views/user/UserList.vue'),
        meta: { title: '紧急联系人信息' }
      },
      {
        path: 'department',
        name: 'DepartmentList',
        component: () => import('../views/department/DepartmentList.vue'),
        meta: { title: '项目部管理' }
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
