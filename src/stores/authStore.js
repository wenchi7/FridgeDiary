import {
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signOut,
} from 'firebase/auth'
import { defineStore } from 'pinia'
import { auth } from '@/firebase/init'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthReady = ref(false)
  const router = useRouter()

  const setUser = (userData) => {
    user.value = userData
  }
  const initAuth = async () => {
    await setPersistence(auth, browserSessionPersistence)
    onAuthStateChanged(auth, (firebaseUser) => {
      console.log('auth change:', firebaseUser)
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'user',
        })
      } else {
        setUser(null)
      }
      isAuthReady.value = true
    })
  }

  const logOut = async () => {
    try {
      await signOut(auth)
      sessionStorage.removeItem('loginUser')
      user.value = null
      router.replace('/')
      console.log('登出了')
    } catch (error) {
      alert('登出失敗', error.message)
    }
  }

  return { user, isAuthReady, initAuth, logOut }
})
