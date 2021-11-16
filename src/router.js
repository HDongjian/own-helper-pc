import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)
let router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/',
          name: 'Default',
          meta: { intercept: true },
          component: () => import('./views/Default.vue')
        },
        {
          path: '/role-management',
          name: 'RoleManagement',
          meta: { intercept: true },
          component: () => import('./views/system/RoleManagement.vue')
        },
        {
          path: '/menu-management',
          name: 'MenuManagement',
          meta: { intercept: true },
          component: () => import('./views/system/MenuManagement.vue')
        },
        {
          path: '/user-management',
          name: 'UserManagement',
          meta: { intercept: true },
          component: () => import('./views/system/UserManagement.vue')
        },
        {
          path: '/icon-management',
          name: 'IconManagement',
          meta: { intercept: true },
          component: () => import('./views/system/IconManagement.vue')
        },
        {
          path: '/subject',
          name: 'Subject',
          meta: { intercept: true },
          component: () => import('./views/configure/Subject.vue')
        },
        {
          path: '/material',
          name: 'Material',
          meta: { intercept: true },
          component: () => import('./views/material/Material.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.intercept) {
    if (Vue.store.state.account && Vue.store.state.account.userId) {
      next()
    } else {
      router.push('/login')
    }
  } else {
    next()
  }
})

export default router
