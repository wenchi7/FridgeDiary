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
      <span v-if="list.updatedAt" class="text-end mx-16 text-lg md:text-xl lg:text-2xl"
        >最後編輯 {{ formatDate(list.updatedAt) }}</span
      >

      <div
        class="relative p-5 mt-2 m-6 sm:m-10 text-xl md:text-2xl lg:text-3xl transition-all duration-100 ease-in-out"
      >
        <ul>
          <li
            v-for="(ingredient, index) in list.ingredients"
            :key="index"
            class="sm:grid sm:grid-cols-[240px_auto] lg:grid-cols-[350px_auto] flex flex-col border-b border-stone-700 mt-4"
          >
            <div class="flex items-start mb-3 sm:mb-0">
              <span>{{ index + 1 }}.</span>

              <span class="text-start ml-4 block break-words sm:max-w-[18ch]">{{
                ingredient.name
              }}</span>
            </div>

            <div class="relative px-3 mb-2 gap-5 flex justify-between sm:grid sm:grid-cols-3">
              <div class="flex gap-2 justify-center">
                <span class="leading-none"
                  >{{ ingredient.quantity }}
                  <span class="whitespace-nowrap text-base md:text-2xl lg:text-3xl">{{
                    ingredient.unit
                  }}</span>
                </span>
              </div>
              <div class="flex justify-center">
                <span class="text-base md:text-2xl lg:text-3xl">{{ ingredient.price }} 元</span>
              </div>
              <div class="text-center mr-3 flex flex-col items-center leading-none">
                <span class="whitespace-nowrap text-red-700">到期日</span>

                <span class="whitespace-nowrap text-red-700"> {{ ingredient.expiryDate }}</span>
              </div>
            </div>
          </li>
        </ul>

        <p class="mt-4 text-end">總金額：{{ list.total }} 元</p>
        <button
          :disabled="isDeleting"
          class="absolute -bottom-12 left-5 text-xl disabled:text-gray-400 md:text-2xl lg:text-3xl hover:scale-95 rounded-2xl px-1 group"
          @click="editList"
        >
          <span class="flex"
            ><p class="group-hover:rotate-12 mr-1">✏️</p>
            <p
              class="underline decoration-wavy decoration-red-500 underline-offset-4"
              :disabled="isDeleting"
            >
              修改
            </p>
          </span>
        </button>

        <button
          @click="handleCancelList"
          :disabled="isDeleting"
          class="absolute -bottom-12 right-5 text-red-500 disabled:text-gray-400"
        >
          <div class="flex items-center">
            <span v-if="isDeleting">
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
            </span>
            <p>刪除整筆</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { db } from '@/firebase/init'
import { useAuthStore } from '@/stores/authStore'
import {
  doc,
  getDoc,
  collection,
  getDocs,
  writeBatch,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const list = ref(null)
const isLoading = ref(true)
const authStore = useAuthStore()
const userId = authStore.user.id
const route = useRoute()
const router = useRouter()
const listId = route.params.id
const isDeleting = ref(false)

const fetchListInfo = async () => {
  const listRef = doc(db, `users/${userId}/shoplists/${listId}`)

  const listSnap = await getDoc(listRef)

  if (listSnap.exists()) {
    const listData = { id: listSnap.id, ...listSnap.data(), ingredients: [] }
    const ingredientsRef = collection(db, `users/${userId}/shoplists/${listId}/ingredients`)
    const ingredientsQuery = query(ingredientsRef, orderBy('createdAt', 'asc'))
    const ingredientsSnap = await getDocs(ingredientsQuery)
    listData.ingredients = ingredientsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    list.value = listData
    isLoading.value = false
  }
}

const goToBack = () => {
  router.push({ name: 'shoplist' })
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

const handleCancelList = async () => {
  if (!window.confirm('確定要刪除此筆清單嗎？')) return
  isDeleting.value = true

  const ingredientsRef = collection(db, `users/${userId}/shoplists/${listId}/ingredients`)
  try {
    const ingredientsSnap = await getDocs(ingredientsRef)
    const batch = writeBatch(db)
    ingredientsSnap.docs.forEach((docSnap) => {
      batch.delete(docSnap.ref)
    })

    const ingredientsStockRef = collection(db, `users/${userId}/stocks`)
    const relatedStockQuery = query(
      ingredientsStockRef,
      where(
        'shoplistIngredientId',
        'in',
        ingredientsSnap.docs.map((doc) => doc.id),
      ),
    )
    const relatedStockSnap = await getDocs(relatedStockQuery)
    relatedStockSnap.docs.forEach((docSnap) => {
      batch.delete(docSnap.ref)
    })

    const listRef = doc(db, `users/${userId}/shoplists/${listId}`)

    batch.delete(listRef)
    await batch.commit()
    alert('此清單已刪除成功')
    router.push({ name: 'shoplist' })
  } catch (error) {
    console.error('刪除失敗', error.message)
    alert(`刪除失敗請重新提交${error.message}`)
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => fetchListInfo())
</script>
