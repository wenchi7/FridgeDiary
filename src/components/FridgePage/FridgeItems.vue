<template>
  <div
    class="relative p-3 sm:pr-3 mt-2 m-4 sm:m-10 text-xl md:text-2xl lg:text-3xl transition-all duration-100 ease-in-out"
  >
    <h1 class="text-center text-sky-700 mb-10 tracking-widest text-2xl md:text-3xl lg:text-4xl">
      What's in my fridge ?
    </h1>

    <ul>
      <li
        v-for="ingredient in ingredients"
        :key="ingredient.id"
        class="relative sm:grid sm:grid-cols-[250px_auto] lg:grid-cols-[500px_auto] flex flex-col border-b border-stone-700 mt-2"
      >
        <div class="mb-3 sm:mb-0">
          <span class="text-start block break-words sm:max-w-[27ch]">。{{ ingredient.name }}</span>
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

          <div class="text-center mr-3 flex flex-col items-start leading-none">
            <span class="whitespace-nowrap text-red-700">到期日</span>

            <span class="whitespace-nowrap text-red-700"> {{ ingredient.expiryDate }}</span>
          </div>
        </div>

        <div class="absolute right-5 sm:-right-8">
          <div v-if="editingId !== ingredient.id">
            <button
              @click="startEditing(ingredient.id)"
              class="rounded-lg hover:bg-zinc-300 flex justify-center items-center"
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

const fetchStocksInfo = async () => {
  const ingredientRef = collection(db, `users/${userId}/stocks`)
  const ingredientQuery = query(ingredientRef, orderBy('name'), orderBy('createdAt'))
  const ingredientSnap = await getDocs(ingredientQuery)
  ingredients.value = ingredientSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    selectedDeduct: 0,
  }))
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
