<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/authStore'

const authStore = useAuthStore()
onMounted(() => {
  authStore.initAuth()
})
</script>

<template>
  <header class="font-chenyu">
    <router-view></router-view>
  </header>
</template>
