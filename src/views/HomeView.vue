<script setup>
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const handleLogOut = () => {
  authStore.logOut()
}
</script>

<template>
  <main class="">
    <div class="h-dvh w-full">
      <div class="w-full h-1/6 bg-MyColor-purple"></div>
      <div class="w-full bg-MyColor-yellow h-full"></div>
      <button @click="handleLogOut">BYE</button>
    </div>
  </main>
</template>
