<template>
  <input
    type="text"
    id="userEmail"
    name="userEmail"
    placeholder="Email"
    class="h-16 w-full p-4 bg-transparent border border-white placeholder:text-white placeholder:tracking-wider text-3xl rounded-sm focus:border-red-500 focus:outline-none focus:border-2"
    required
  />
  <input
    type="text"
    id="userPassword"
    name="userPassword"
    placeholder="Password"
    class="h-16 w-full p-4 bg-transparent border border-white placeholder:text-slate-100 placeholder:tracking-wider text-3xl rounded-sm focus:border-red-500 focus:outline-none focus:border-2"
    required
  />
  <div class="flex flex-col gap-3">
    <input
      type="button"
      value="登   入"
      class="bg-red-900 text-white h-12 font-chenyu text-2xl tracking-widest rounded-sm cursor-pointer hover:bg-red-700"
    />
    <router-link
      :to="{ name: 'register' }"
      class="bg-red-900 text-white h-12 font-chenyu text-3xl tracking-widest rounded-sm flex items-center justify-center cursor-pointer hover:bg-red-700"
      >註 冊</router-link
    >
  </div>
</template>
<script setup></script>
