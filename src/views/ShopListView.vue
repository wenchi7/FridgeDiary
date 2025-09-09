<template>
  <div class="flex flex-col mt-4 w-full">
    <div class="flex justify-center">
      <button
        @click="createList"
        class="flex justify-center items-center font-medium text-gray-800 px-2 py-1 mx-auto bg-red-500 hover:bg-red-600 w-36 border border-black rounded-full mt-7 mb-4 text-2xl md:text-3xl"
      >
        新增明細
      </button>
    </div>
    <div>
      <ShopList />
    </div>
  </div>
</template>

<script setup lang="ts">
import ShopList from '@/components/ShopListPage/ShopList.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const createList = () => {
  router.push('/home/createlist')
}
</script>
