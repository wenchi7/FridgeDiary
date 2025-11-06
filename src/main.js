import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/index.css'
import App from './App.vue'
import router from './router'
import '@/assets/fonts/fonts.css'
import { useAuthStore } from './stores/authStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
const authStore = useAuthStore()
authStore
  .initAuth()
  .then(() => {
    app.use(router)
    app.mount('#app')
  })
  .catch((error) => {
    console.error('auth初始化失敗', error)
    app.use(router)
    app.mount('#app')
  })
