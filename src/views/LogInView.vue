<template>
  <div class="w-full h-screen bg-cover bg-center bg-no-repeat bg-svg">
    <div class="flex justify-center items-center h-screen">
      <form class="bg-red-300 w-1/3 h-1/2 rounded-xl">
        <div class="flex justify-center flex-col gap-10 my-16 mx-10">
          <input
            type="text"
            id="userName"
            name="userName"
            placeholder="UserName"
            class="h-16 w-full p-2 bg-transparent border border-white placeholder:text-white placeholder:tracking-widest"
            required
          />
          <input
            type="text"
            id="userPassword"
            name="userPassword"
            placeholder="UserPassword"
            class="h-16 w-full p-2 bg-transparent border border-white placeholder:text-white placeholder:tracking-widest"
            required
          />
          <input type="button" value="Log in" class="bg-red-900 text-white h-14" />
        </div>
      </form>
    </div>
  </div>
  <router-view></router-view>
</template>

<style scoped>
.bg-svg {
  background-image: url('@/assets/wave-haikei.svg');
}
</style>
