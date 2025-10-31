<template>
  <div class="m-10 text-xl md:text-2xl lg:text-3xl transition-all duration-100 ease-in-out">
    <h1 class="text-3xl flex justify-center mb-7">即期品區</h1>
    <ul class="">
      <li
        v-for="ingredient in expiredIngredients"
        :key="ingredient.id"
        class="relative sm:grid sm:grid-cols-[250px_auto] md:grid-cols-[375px_auto] lg:grid-cols-[500px_auto] flex flex-col border-b border-stone-700 my-2 transition-all ease-out duration-300 animate-bg-pulse"
      >
        <div class="mb-3 sm:mb-0">
          <span class="ml-3 sm:ml-0 text-start block break-words sm:max-w-[27ch]"
            >🚨{{ ingredient.name }}</span
          >
        </div>

        <div class="px-3 mb-2 gap-5 flex justify-between sm:grid sm:grid-cols-2">
          <div class="flex gap-2 items-center">
            <span class="text-red-500"
              >還有: {{ ingredient.quantity - ingredient.deducted }}
              <span class="whitespace-nowrap">{{ ingredient.unit }} </span>!!
            </span>
          </div>

          <div class="text-center mr-3 flex flex-col items-end transition-all duration-300">
            <span class="whitespace-nowrap text-red-00"> 已過期！</span>
          </div>
        </div>
        <div class="absolute right-5 sm:-right-8 top-0 sm:top-1">
          <button @click="throwIngredient(ingredient.id)" :disabled="ingredient.isThrowed">
            🗑️
          </button>
        </div>
      </li>

      <li
        v-for="ingredient in expiringIngredients"
        :key="ingredient.id"
        class="sm:grid sm:grid-cols-[250px_auto] md:grid-cols-[375px_auto] lg:grid-cols-[500px_auto] flex flex-col border-b border-stone-700 my-2 transition-all ease-out duration-300"
      >
        <div class="mb-3 sm:mb-0">
          <span class="text-start block break-words sm:max-w-[27ch]">⚠️{{ ingredient.name }}</span>
        </div>

        <div class="px-3 mb-2 gap-5 flex justify-between sm:grid sm:grid-cols-2">
          <div class="flex gap-2 items-center">
            <span class="text-red-500"
              >還有: {{ ingredient.quantity - ingredient.deducted }}
              <span class="whitespace-nowrap">{{ ingredient.unit }} </span>!!
            </span>
          </div>

          <div class="text-center mr-3 flex flex-col items-end transition-all duration-300">
            <span class="whitespace-nowrap text-red-500"> {{ ingredient.expiryDate }}!!</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { db } from '@/firebase/init'
import { useAuthStore } from '@/stores/authStore'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { computed, onMounted, ref } from 'vue'

const authStore = useAuthStore()
const userId = authStore.user.id
const ingredients = ref([])

const fetchIngShorted = async () => {
  const ingredientsRef = collection(db, `users/${userId}/stocks`)
  const ingredientSnap = await getDocs(ingredientsRef)
  ingredients.value = ingredientSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    isThrowed: false,
  }))
}

function getDaysToExpire(expiryDate) {
  if (!expiryDate) return Infinity
  const today = new Date()
  const expireDay = new Date(expiryDate)
  const diff = (expireDay - today) / (1000 * 60 * 60 * 24)
  return Math.ceil(diff)
}

const sortedIngredients = computed(() =>
  [...ingredients.value].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)),
)

const expiringIngredients = computed(() =>
  sortedIngredients.value.filter((ing) => {
    const daysLeft = getDaysToExpire(ing.expiryDate)
    return daysLeft <= 2 && daysLeft >= 0
  }),
)

const expiredIngredients = computed(() =>
  sortedIngredients.value.filter((ing) => getDaysToExpire(ing.expiryDate) < 0),
)

const throwIngredient = async (id) => {
  const ingredient = ingredients.value.find((i) => i.id === id)
  if (!window.confirm('確定要丟掉這個食材嗎？')) return
  try {
    ingredient.isThrowed = true
    const ingredientRef = doc(db, `users/${userId}/stocks/${id}`)
    await deleteDoc(ingredientRef)
    setTimeout(() => {
      ingredients.value = ingredients.value.filter((ing) => ing.id !== id)
    }, 2000)
    console.log('刪除成功')
  } catch (error) {
    console.error('刪除失敗', error)
    ingredient.isThrowed.value = false
  }
}

onMounted(() => {
  fetchIngShorted()
})
</script>
