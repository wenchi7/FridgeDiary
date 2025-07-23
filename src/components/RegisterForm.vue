<template>
  <div class="w-full h-screen bg-cover bg-center bg-no-repeat bg-svg">
    <div class="flex justify-center items-center h-screen">
      <div
        class="relative bg-red-300 w-1/2 md:w-1/3 min-h-1/2 rounded-xl transition-all duration-300 ease-in-out"
      >
        <span
          @click="cancelRegister"
          class="absolute top-5 right-5 flex justify-center items-center border border-black rounded-full w-8 h-8 font-bold text-xl cursor-pointer"
          >X</span
        >
        <form
          class="flex justify-center flex-col gap-10 mt-16 mb-10 mx-10"
          @submit.prevent="handleRegister"
        >
          <input
            v-model="userName"
            type="text"
            id="userName"
            name="userName"
            placeholder="Name"
            class="h-16 w-full p-4 bg-transparent border border-white placeholder:text-white placeholder:tracking-wider text-3xl rounded-sm focus:border-red-500 focus:outline-none focus:border-2"
            required
          />
          <input
            v-model="userEmail"
            type="email"
            id="userEmail"
            name="userEmail"
            placeholder="Email"
            class="h-16 w-full p-4 bg-transparent border border-white placeholder:text-white placeholder:tracking-wider text-3xl rounded-sm focus:border-red-500 focus:outline-none focus:border-2"
            required
          />
          <input
            v-model="userPassword"
            type="password"
            id="userPassword"
            name="userPassword"
            placeholder="Password"
            class="h-16 w-full p-4 bg-transparent border border-white placeholder:text-slate-100 placeholder:tracking-wider text-3xl rounded-sm focus:border-red-500 focus:outline-none focus:border-2"
            required
          />
          <button
            type="submit"
            class="bg-red-900 text-white h-12 font-chenyu text-3xl tracking-widest rounded-sm flex items-center justify-center cursor-pointer hover:bg-red-700"
          >
            註 冊
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { ref } from 'vue'
import { auth, db } from '@/firebase/init'
import { useRouter } from 'vue-router'
const userName = ref('')
const userEmail = ref('')
const userPassword = ref('')
const router = useRouter()
const cancelRegister = () => {
  router.push('/')
}
const handleRegister = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userEmail.value,
      userPassword.value,
    )
    const user = userCredential.user
    await updateProfile(user, { displayName: userName.value })
    await setDoc(doc(db, 'users', user.uid), {
      name: userName.value,
      email: userEmail.value,
      createdAt: serverTimestamp(),
    })
    alert('註冊成功！')
  } catch (error) {
    if (error.message === 'auth/email-already-in-use') {
      alert('此電子郵件已被註冊，請嘗試其他電子郵件或登入。')
    } else if (error.message === 'auth/weak-password') {
      alert('密碼太弱，請設定至少六個字元。')
    } else {
      alert(`註冊失敗: ${error.message}`)
    }
  }
}
</script>
<style scoped>
.bg-svg {
  background-image: url('@/assets/wave-haikei.svg');
}
</style>
