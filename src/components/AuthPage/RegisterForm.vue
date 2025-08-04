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
            :disabled="isLoading"
            type="submit"
            class="bg-red-900 disabled:bg-gray-500 text-white h-12 font-chenyu text-3xl tracking-widest rounded-sm flex items-center justify-center cursor-pointer hover:bg-red-700"
          >
            註 冊
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth'
import { ref } from 'vue'
import { auth } from '@/firebase/init'
import { useRouter } from 'vue-router'
const userName = ref('')
const userEmail = ref('')
const userPassword = ref('')
const router = useRouter()
const isLoading = ref(false)
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
    isLoading.value = true
    const user = userCredential.user
    await updateProfile(user, { displayName: userName.value })

    await sendEmailVerification(user)
    alert('驗證信已寄出！請至信箱完成驗證')
    alert('註冊成功！')
    isLoading.value = false
    router.push('/')
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      alert('此電子郵件已被註冊，請嘗試其他電子郵件或登入。')
    } else if (error.code === 'auth/weak-password') {
      alert('密碼請設定至少六個字元。')
    } else {
      alert('註冊失敗，請檢查是否為正確email。')
    }
    isLoading.value = false
  }
}
</script>
<style scoped>
.bg-svg {
  background-image: url('@/assets/wave-haikei.svg');
}
</style>
