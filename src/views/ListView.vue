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

  <div v-if="list">
    <button
      class="pt-5 pl-5 sm:pt-10 sm:pl-10 text-2xl text-red-500 cursor-pointer"
      @click="goToBack"
    >
      ↩ 返回
    </button>

    <div class="flex flex-col w-full mb-24">
      <h2 class="text-xl md:text-2xl lg:text-3xl text-center mt-6 mx-2">
        {{ list.title }}
      </h2>
      <span class="text-end mx-16 mt-4 text-lg md:text-xl lg:text-2xl">{{
        formatDate(list.createdAt)
      }}</span>

      <div
        class="relative p-5 mt-2 m-6 sm:m-10 text-xl md:text-2xl lg:text-3xl transition-all duration-100 ease-in-out"
      >
        <ul>
          <li
            v-for="(item, index) in list.ingredients"
            :key="index"
            class="sm:grid sm:grid-cols-[280px_auto] lg:grid-cols-[400px_auto] flex flex-col border-b border-stone-700 mt-4"
          >
            <div class="flex flex-row sm:block items-center mb-3 sm:mb-0">
              <span>{{ index + 1 }}.</span>

              <span class="text-center ml-4">{{ item.name }}</span>
            </div>

            <div class="flex justify-between sm:flex px-2 mb-2">
              <div class="flex w-full gap-4 sm:grid sm:grid-cols-2 sm:ml-2">
                <span class="leading-none"
                  >{{ item.quantity }}
                  <span class="whitespace-nowrap text-base md:text-2xl lg:text-3xl">{{
                    item.unit
                  }}</span>
                </span>
                <span class="text-base md:text-2xl lg:text-3xl">{{ item.price }}元</span>
              </div>
              <div class="leading-none text-center ml-3">
                <span class="text-red-700">到期日</span>

                <span class="whitespace-nowrap text-red-700"> {{ item.expiryDate }}</span>
              </div>
            </div>
          </li>
        </ul>

        <p class="mt-4 text-end">總金額：{{ list.total }} 元</p>
        <button
          class="absolute -bottom-12 left-5 text-xl md:text-2xl lg:text-3xl hover:scale-95 rounded-2xl px-1 group"
          @click="editList"
        >
          <span class="flex"
            ><p class="group-hover:rotate-12 mr-1">✏️</p>
            <p class="underline decoration-wavy decoration-red-500 underline-offset-4">修改</p>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { db } from '@/firebase/init'
import { useAuthStore } from '@/stores/authStore'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const list = ref(null)
const isLoading = ref(true)
const authStore = useAuthStore()
const userId = authStore.user.id
const route = useRoute()
const router = useRouter()
const listId = route.params.id

const fetchListInfo = async () => {
  const listRef = doc(db, `users/${userId}/shoplists/${listId}`)

  const listSnap = await getDoc(listRef)

  if (listSnap.exists()) {
    const listData = { id: listSnap.id, ...listSnap.data(), ingredients: [] }
    const ingredientsRef = collection(db, `users/${userId}/shoplists/${listId}/ingredients`)
    const ingredientsSnap = await getDocs(ingredientsRef)
    listData.ingredients = ingredientsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    list.value = listData
    isLoading.value = false
  }
}

const goToBack = () => {
  router.back()
}
const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }
  return date.toLocaleDateString('zh-TW', options)
}
const editList = async () => {
  router.push({ name: 'shoplist-edit', params: { id: listId } })
}

onMounted(() => fetchListInfo())
</script>
