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
      component: () => import('@/components/AuthPage/RegisterForm.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'shoplist',
          component: () => import('@/views/ShopListView.vue'),
        },
        {
          path: 'createlist/:id',
          name: 'shoplist-edit',
          component: () => import('@/components/ShopListPage/AddShopListDetail.vue'),
          props: true,
        },
        {
          path: 'createlist',
          name: 'shoplist-create',
          component: () => import('@/components/ShopListPage/AddShopListDetail.vue'),
        },
        {
          path: 'addlist',
          name: 'shoplist-add',
          component: () => import('@/components/ShopListPage/AddListingredient.vue'),
        },
        { path: 'fridge', name: 'fridge', component: () => import('@/views/FridgePageView.vue') },
        {
          path: 'shortdated',
          name: 'shortdated',
          component: () => import('@/views/ShortDatedView.vue'),
        },
        { path: 'cookbook', name: 'cookbook', component: () => import('@/views/CookBookView.vue') },
        {
          path: 'mycookbook',
          name: 'mycookbook',
          component: () => import('@/views/MyCookBookView.vue'),
        },
        {
          path: 'listview/:id',
          name: 'listview',
          component: () => import('@/views/ListView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  const handleNavigation = () => {
    const isLoggedIn = !!authStore.user

    if (isLoggedIn && to.name === 'login') {
      next({ name: 'shoplist' })
    } else if (to.meta.requiresAuth && !authStore.user) {
      next({ name: 'login' })
    } else {
      next()
    }
  }

  if (!authStore.isAuthReady) {
    const stopWatch = watch(
      () => authStore.isAuthReady,
      (ready) => {
        if (ready) {
          stopWatch()
          handleNavigation()
        }
      },
    )
  } else {
    handleNavigation()
  }
})
export default router
