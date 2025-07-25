<template>
  <form @submit.prevent="handleLogIn" class="flex justify-center flex-col gap-10">
    <input
      v-model="email"
      type="text"
      id="userEmail"
      name="userEmail"
      placeholder="Email"
      :class="{ 'input-error': isError }"
      class="h-16 w-full p-4 bg-transparent border border-white placeholder:text-white placeholder:tracking-wider text-3xl rounded-sm focus:border-red-500 focus:outline-none focus:border-2"
      required
    />
    <input
      v-model="password"
      type="password"
      id="userPassword"
      name="userPassword"
      placeholder="Password"
      :class="{ 'input-error': isError }"
      class="h-16 w-full p-4 bg-transparent border border-white placeholder:text-slate-100 placeholder:tracking-wider text-3xl rounded-sm focus:border-red-500 focus:outline-none focus:border-2"
      required
    />

    <div class="flex flex-col">
      <p v-if="isError" class="text-center text-red-600 text-xl mb-4">登入錯誤<br />請重新輸入！</p>
      <button
        type="submit"
        class="bg-red-900 text-white h-12 font-chenyu text-2xl tracking-widest rounded-sm cursor-pointer hover:bg-red-700"
      >
        登 入
      </button>
    </div>
  </form>
</template>
<script setup>
import { signInWithEmailAndPassword } from 'firebase/auth'
import { ref } from 'vue'
import { auth } from '@/firebase/init'
import { useRouter } from 'vue-router'
const email = ref('')
const password = ref('')
const router = useRouter()
const isError = ref(false)
const handleLogIn = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)

    router.push({ name: 'home' })

    isError.value = false
    password.value = ''
  } catch (error) {
    console.log('登入錯誤：', error.message)
    isError.value = true
    email.value = ''
    password.value = ''
    setTimeout(() => {
      isError.value = false
    }, 1000)
  }
}
</script>
<style scoped>
@keyframes shake {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-8px);
  }
  40% {
    transform: translateX(8px);
  }
  60% {
    transform: translateX(-8px);
  }
  80% {
    transform: translateX(8px);
  }
  100% {
    transform: translateX(0);
  }
}

.input-error {
  animation: shake 0.4s;
  border-color: red !important;
}
</style>
