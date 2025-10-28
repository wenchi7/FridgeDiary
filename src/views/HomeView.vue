<template>
  <main class="h-dvh w-full">
    <div class="flex flex-col h-full">
      <div
        class="fixed top-0 left-0 w-full h-28 sm:h-32 z-30 bg-MyColor-purple flex flex-col flex-shrink-0"
      >
        <button
          @click="handleLogOut"
          class="absolute right-2 w-32 py-4 px-8 text-pink-800 text-2xl font-semibold hover:text-red-500 cursor-pointer"
        >
          登出
        </button>
        <nav class="relative mt-auto z-20 sm:z-0 w-full">
          <button class="sm:hidden m-4 absolute -top-14 left-2 z-30">
            <i class="text-2xl cursor-pointer" @click="toggleNavOpen">☰</i>
          </button>
          <ul
            class="absolute -top-2 sm:static sm:top-auto flex flex-col shadow-md sm:flex-row justify-around px-6 text-xl md:text-2xl lg:text-3xl space-y-2 sm:space-y-0 sm:space-x-4 mx-6 sm:mx-0 bg-slate-50/60 py-4 sm:py-0 sm:bg-transparent rounded-md"
            :class="{ hidden: !isOpen, block: isOpen, 'sm:flex': true }"
          >
            <li>
              <router-link to="/home" class="nav-btn" @click="handleCloseMenu"
                >採買日記</router-link
              >
            </li>
            <li>
              <router-link to="/home/fridge" class="nav-btn" @click="handleCloseMenu"
                >我的冰箱</router-link
              >
            </li>
            <li>
              <router-link to="/home/shortdated" class="nav-btn" @click="handleCloseMenu"
                >即期警戒區</router-link
              >
            </li>
            <li>
              <router-link to="/home/cookbook" class="nav-btn" @click="handleCloseMenu"
                >想不到吃什麼</router-link
              >
            </li>
            <!-- <li>
              <router-link
                to="/home/mycookbook"
                class="nav-btn"
                @click="handleCloseMenu"

                >新功能</router-link
              >
            </li> -->
          </ul>
        </nav>
      </div>
      <div class="pt-32 w-full bg-MyColor-yellow flex-1 z-10">
        <router-view></router-view>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue'

const isOpen = ref(false)
const toggleNavOpen = () => {
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
  @apply block pt-2 px-2 bg-red-300 md:pt-2 md:px-3 rounded-full sm:rounded-b-none sm:rounded-t-3xl cursor-pointer hover:scale-105  hover:text-red-700 transition-all duration-100 ease-in-out shadow-rt hover:shadow-rb hover:bg-red-200 text-center;
}
</style>
