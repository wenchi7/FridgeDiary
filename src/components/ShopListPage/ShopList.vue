<template>
  <div v-if="isLoading" class="flex flex-col justify-center items-center text-2xl mt-12 gap-6">
    <svg
      class="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <p>載入中。。。</p>
  </div>
  <div
    v-else-if="lists.length === 0"
    class="h-full flex justify-center mt-14 text-xl md:text-2xl lg:text-3xl"
  >
    <p>。。。還沒有任何購買清單</p>
  </div>
  <div
    v-else
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-8 md:mx-16 mt-6 mb-32 gap-16"
  >
    <router-link
      v-for="list in lists"
      :key="list.id"
      :to="{ name: 'listview', params: { id: list.id } }"
      class="relative group border-0 border-stone-600 text-xl md:text-2xl lg:text-3xl bg-MyColor-pearl shadow-[30px_40px_25px_-20px_rgba(0,0,0,0.5)] h-96 p-6 mx-auto w-11/12 max-w-sm md:mx-0 md:w-auto md:max-w-none"
    >
      <ul class="mb-4">
        <li>
          <h2 class="text-center mb-3 truncate w-40 sm:w-56 mx-auto">{{ list.title }}</h2>
        </li>
        <li
          v-for="(ingredient, index) in list.ingredientsSummary.slice(0, 4)"
          :key="index"
          class="grid sm:grid-cols-[35px_auto] grid-cols-[35px_auto] border-b-2 border-black mb-2"
        >
          <span>{{ index + 1 }}</span>
          <p class="truncate">{{ ingredient }}</p>
        </li>
        <li>
          <span v-if="list.ingredientsSummary.length > 4"> ... </span>
          <p class="mt-4 text-start">共 {{ list.total }} 元</p>
        </li>
        <li>
          <p
            class="absolute bottom-4 right-4 text-xl text-end cursor-pointer group-hover:text-red-500"
          >
            ⭢ 看更多
          </p>
        </li>
      </ul>
    </router-link>
  </div>
</template>
<script setup>
import { orderBy, query, collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/init'
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const lists = ref([])
const authStore = useAuthStore()
const userId = authStore.user.id
const isLoading = ref(true)
const fetchLists = async () => {
  try {
    let q = query(collection(db, `users/${userId}/shoplists`), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)

    lists.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    isLoading.value = false
  } catch (error) {
    console.log(`發生錯誤，請重新送出${error.message}`)
    isLoading.value = false
  }
}
onMounted(() => {
  fetchLists()
})
</script>
