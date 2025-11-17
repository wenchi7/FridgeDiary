import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/index.css'
import App from './App.vue'
import router from './router'
import '@/assets/fonts/fonts.css'
import { useAuthStore } from './stores/authStore'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(router)

app.use(Toast, {
  position: 'top-center',
  theme: 'dark',
  timeout: 2000,
  closeOnClick: true,
  pauseOnHover: true,
  hideProgressBar: false,
})

app.mount('#app')

const authStore = useAuthStore()
authStore.initAuth().catch((error) => {
  console.error('auth初始化失敗', error)
})
