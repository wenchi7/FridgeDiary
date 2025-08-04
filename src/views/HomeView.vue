<template>
  <main class="h-dvh w-full">
    <div class="flex flex-col h-full">
      <div class="w-full h-1/6 bg-MyColor-purple flex flex-col">
        <button
          @click="handleLogOut"
          class="flex w-full justify-end py-4 px-8 text-pink-800 text-2xl font-semibold hover:text-red-500 cursor-pointer"
        >
          登出
        </button>
        <!-- <div class="w-1/6 bg-slate-400 h-full"></div> -->
        <nav class="w-full mt-auto z-20 md:z-0">
          <button class="md:hidden m-4">
            <i class="text-2xl cursor-pointer" @click="handleNavOpen">i</i>
          </button>
          <ul
            class="flex flex-col md:flex-row justify-around px-2 text-2xl lg:text-3xl space-y-2 md:space-y-0 md:space-x-4"
            :class="{ hidden: !isOpen, block: isOpen, 'md:flex': true }"
          >
            <li class="nav-btn" @click="handleCloseMenu">
              <router-link to="/home">採買日記</router-link>
            </li>
            <li class="nav-btn" @click="handleCloseMenu">
              <router-link to="/home/fridge">我的冰箱</router-link>
            </li>
            <li class="nav-btn" @click="handleCloseMenu">
              <router-link to="/home/shortdated">即期警戒區</router-link>
            </li>
            <li class="nav-btn" @click="handleCloseMenu">
              <router-link to="/home/cookbook">想不到吃什麼</router-link>
            </li>
            <li class="nav-btn" @click="handleCloseMenu">
              <router-link to="/home/mycookbook">分享區</router-link>
            </li>
          </ul>
        </nav>
      </div>
      <div class="w-full bg-MyColor-yellow flex-1 z-10">
        <router-view></router-view>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue'

const isOpen = ref(false)
const handleNavOpen = () => {
  isOpen.value = !isOpen.value
}
const authStore = useAuthStore()
const handleLogOut = () => {
  authStore.logOut()
}
const handleCloseMenu = () => {
  setTimeout(() => {
    isOpen.value = false
  }, 500)
}
</script>

<style scoped lang="postcss">
.nav-btn {
  @apply py-1 px-3 bg-red-300 lg:py-2 lg:px-5 rounded-full md:rounded-b-none md:rounded-t-3xl cursor-pointer hover:text-3xl hover:text-red-600 transition-all duration-100 ease-in-out shadow-rt hover:shadow-rb;
}
</style>
