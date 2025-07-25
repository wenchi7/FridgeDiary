import { createRouter, createWebHistory } from 'vue-router'
import LogInView from '@/views/LogInView.vue'
import { useAuthStore } from '@/stores/authStore'
import { watch } from 'vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LogInView,
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/components/RegisterForm.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthReady) {
    const stopWatch = watch(
      () => authStore.isAuthReady,
      (ready) => {
        if (ready) {
          stopWatch()
          proceed()
        }
      },
    )
  } else {
    proceed()
  }

  function proceed() {
    if (to.meta.requiresAuth && !authStore.user) {
      next({ name: 'login' })
    } else {
      next()
    }
  }
})

// router.beforeEach((to) => {
//   const authStore = useAuthStore()

//   if (to.meta.requiresAuth && !authStore.user) {
//     return { name: 'login' }
//   }
// })
export default router
