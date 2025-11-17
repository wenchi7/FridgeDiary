<template>
  <div
    class="relative p-3 sm:pr-3 mt-2 m-4 sm:m-10 text-xl md:text-2xl lg:text-3xl transition-all duration-100 ease-in-out"
  >
    <h1 class="text-center text-sky-700 mb-10 tracking-widest text-2xl md:text-3xl lg:text-4xl">
      What's in my fridge ?
    </h1>
    <div v-if="isLoading" class="flex flex-col items-center gap-4 mt-10">
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

    <div v-else class="h-full">
      <ul v-if="ingredients.length > 0">
        <li
          v-for="ingredient in ingredients"
          :key="ingredient.id"
          class="relative sm:grid sm:grid-cols-[250px_auto] md:grid-cols-[375px_auto] lg:grid-cols-[500px_auto] flex flex-col border-b border-stone-700 my-2 transition-all ease-out duration-300"
        >
          <div class="mb-3 sm:mb-0">
            <span class="text-start block break-words sm:max-w-[27ch]"
              >。{{ ingredient.name }}</span
            >
          </div>

          <div class="px-3 mb-2 gap-5 flex justify-between sm:grid sm:grid-cols-2">
            <div class="flex gap-2 items-center">
              <span class="leading-none"
                >還有: {{ ingredient.quantity - ingredient.deducted }}
                <span class="whitespace-nowrap text-base md:text-2xl lg:text-3xl">{{
                  ingredient.unit
                }}</span>
              </span>
            </div>

            <div
              class="text-center mr-3 flex flex-col items-end leading-none transition-all duration-300"
              :class="{ 'sm:-translate-x-20': editingId === ingredient.id }"
            >
              <span class="whitespace-nowrap text-red-700">到期日</span>

              <span class="whitespace-nowrap text-red-700"> {{ ingredient.expiryDate }}</span>
            </div>
          </div>

          <div class="absolute right-5 sm:-right-8 top-0 sm:top-2">
            <div v-if="editingId !== ingredient.id">
              <button
                @click="startEditing(ingredient.id)"
                class="rounded-lg hover:bg-zinc-300 flex justify-center"
              >
                🔪
              </button>
            </div>

            <div v-else class="flex gap-1">
              <select v-model.number="ingredient.selectedDeduct" class="mr-2">
                <option v-for="q in getQuantityOptions(ingredient)" :key="q">{{ q }}</option>
              </select>
              <button
                @click="handleDeduct(ingredient.id)"
                class="rounded-lg hover:bg-zinc-300 flex justify-center items-center"
              >
                ✔
              </button>
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="flex justify-center mt-20">目前沒有任何食材喔！</div>
    </div>
  </div>
</template>

<script setup>
import { db } from '@/firebase/init'
import { useAuthStore } from '@/stores/authStore'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { ref, onMounted } from 'vue'

const authStore = useAuthStore()
const userId = authStore.user.id
const ingredients = ref([])
const editingId = ref(null)
const isLoading = ref(true)

const fetchStocksInfo = async () => {
  try {
    const ingredientRef = collection(db, `users/${userId}/stocks`)
    const ingredientQuery = query(ingredientRef, orderBy('name'), orderBy('createdAt'))
    const ingredientSnap = await getDocs(ingredientQuery)
    ingredients.value = ingredientSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      selectedDeduct: 0,
    }))
  } catch (error) {
    console.error('載入失敗', error)
  } finally {
    isLoading.value = false
  }
}

const getQuantityOptions = (ingredient) => {
  const remaining = getRemaining(ingredient)
  const options = [0, 0.25, 0.5, ...Array.from({ length: remaining }, (_, i) => i + 1)]
  return options
}

const startEditing = async (id) => {
  editingId.value = id
  const targetIng = ingredients.value.find((i) => i.id === id)
  if (targetIng) targetIng.selectedDeduct = 0
}

const getRemaining = (ingredient) => {
  return Math.max(ingredient.quantity - ingredient.deducted, 0)
}

const handleDeduct = async (id) => {
  const targetIng = ingredients.value.find((i) => i.id === id)
  if (!targetIng) return

  let deductAmount = Number(targetIng.selectedDeduct)

  if (deductAmount == 0) {
    editingId.value = null
    return
  }

  const remaining = getRemaining(targetIng)

  if (deductAmount > remaining) return

  const ingredientRef = doc(db, `users/${userId}/stocks/${id}`)
  await updateDoc(ingredientRef, {
    deducted: increment(deductAmount),
  })

  targetIng.deducted += deductAmount
  editingId.value = null

  if (getRemaining(targetIng) === 0) {
    alert(`${targetIng.name} 已用完！`)
    await deleteDoc(ingredientRef)
    ingredients.value = ingredients.value.filter((i) => i.id !== id)
  }
}

onMounted(() => fetchStocksInfo())
</script>
