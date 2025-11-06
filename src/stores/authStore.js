import {
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { defineStore } from 'pinia'
import { auth, db } from '@/firebase/init'
import { ref } from 'vue'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthReady = ref(false)
  let unsubscribeAuth = null

  const setUser = (userData) => {
    user.value = userData
  }

  const initAuth = async () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'user',
          })
        } else {
          setUser(null)
        }
        if (!isAuthReady.value) {
          isAuthReady.value = true
          resolve(firebaseUser)
        }
      })
    })
  }

  const logIn = async (email, password) => {
    await setPersistence(auth, browserSessionPersistence)

    try {
      const userLogIn = await signInWithEmailAndPassword(auth, email, password)
      const user = userLogIn.user
      if (!user.emailVerified) {
        await signOut(auth)
        throw new Error('EMAIL_NOT_VERIFIED')
      }
      setUser({
        id: user.uid,
        email: user.email,
        displayName: user.displayName || 'user',
      })

      const userDocRef = doc(db, 'users', user.uid)
      const userDocSnap = await getDoc(userDocRef)

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          createdAt: serverTimestamp(),
        })
      }
      return user
    } catch (error) {
      console.error('登入失敗', error)
      throw error
    }
  }

  const logOut = async () => {
    try {
      await signOut(auth)
      unsubscribeAuth?.()
      user.value = null
      console.log('登出了')
      console.log(auth)
    } catch (error) {
      alert('登出失敗', error.message)
    }
  }

  return { user, isAuthReady, initAuth, logOut, logIn }
})
