import { onAuthStateChanged, signOut } from 'firebase/auth'
import { defineStore } from 'pinia'
import { auth } from '@/firebase/init'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthReady = ref(false)
  const router = useRouter()

  const initAuth = () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      console.log('auth change:', firebaseUser)
      if (firebaseUser) {
        user.value = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'user',
        }
      } else {
        user.value = null
      }
      isAuthReady.value = true
    })
  }

  const setUser = (userData) => {
    user.value = userData
    localStorage.setItem('loginUser', JSON.stringify(userData))
  }

  const logOut = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem('loginUser')
      user.value = null
      router.replace('/')
      console.log('登出了')
    } catch (error) {
      alert('登出失敗', error.message)
    }
  }

  watch(user, (newUser) => {
    if (newUser) {
      localStorage.setItem('loginUser', JSON.stringify(user.value))
    } else {
      localStorage.removeItem('loginUser')
    }
  })
  return { user, isAuthReady, initAuth, setUser, logOut }
})
