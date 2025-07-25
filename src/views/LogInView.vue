<template>
  <div class="w-full h-screen bg-cover bg-center bg-no-repeat bg-svg">
    <div class="flex justify-center items-center h-screen">
      <div
        class="bg-red-300 w-1/2 md:w-1/3 min-h-1/2 rounded-xl transition-all duration-300 ease-in-out shadow-slate-600 shadow-rb"
      >
        <div class="flex justify-center flex-col gap-10 my-10 mx-10">
          <div class="flex justify-center text-4xl font-semibold">冰箱日記</div>
          <LogIn />
          <router-link
            :to="{ name: 'register' }"
            class="bg-red-900 text-white h-12 font-chenyu text-3xl tracking-widest rounded-sm flex items-center justify-center cursor-pointer hover:bg-red-700"
            >註冊</router-link
          >
        </div>
      </div>
    </div>
  </div>
  <router-view></router-view>
</template>

<script setup>
import LogIn from '@/components/LogIn.vue'
</script>
<style scoped>
.bg-svg {
  background-image: url('@/assets/wave-haikei.svg');
}
</style>
