import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/view/Login.vue'),
    name: 'login'
  }, {
    path: '/home',
    component: () => import('@/view/Home.vue'),
    name: 'home',
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  console.log(to, from, "||||||", "路过");
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isLogin) {
    next('/login')
  } else {
    next();
  }
})


export default router