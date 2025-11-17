<template>
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

  <div v-else class="mx-10 sm:mx-16 mt-8 mb-16">
    <h1 class="text-center text-3xl">🎲 今日食譜抽籤</h1>

    <div v-if="!recipe" class="flex justify-center mt-7">
      <DrawCards @card-selected="handleCardSelected" />
    </div>

    <div v-else class="mt-10 text-xl md:text-2xl lg:text-3xl">
      <div class="flex flex-col sm:flex-row gap-10 mb-5 p-0 sm:p-4 items-center justify-start">
        <img v-if="recipe.image" :src="recipe.image" alt="recipe" class="w-72 h-auto" />
        <div>
          <h2 class="mb-5 font-semibold">{{ recipe.title }}</h2>
          <p v-if="recipe.servings">份量: {{ recipe.servings }}人</p>
          <p v-if="recipe.readyInMinutes">預計時間: {{ recipe.readyInMinutes }} min</p>
        </div>
      </div>

      <div class="flex flex-col gap-10 w-full p-0 sm:p-5">
        <div class="w-full border-b border-slate-800">
          <p class="mb-2">食材：</p>
          <ul class="grid grid-cols-1 sm:grid-cols-2 w-full mb-5">
            <li
              v-for="(ingredient, index) in recipe.extendedIngredients"
              :key="index"
              class="relative pl-6 py-1"
            >
              <span class="absolute left-0 top-0 scale-75">•</span>
              {{ ingredient.original }}
            </li>
          </ul>
        </div>

        <div>
          <p class="mb-2">步驟：</p>

          <ul class="list-decimal w-full pb-5 px-6">
            <li
              v-for="(step, index) in recipe.analyzedInstructions[0]?.steps"
              :key="index"
              class="pl-2 py-1"
            >
              {{ step.step }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DrawCards from '@/components/CookBookPage/DrawCards.vue'
import { db } from '@/firebase/init'
import { useAuthStore } from '@/stores/authStore'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { onMounted, ref } from 'vue'

const recipe = ref(null)
const authStore = useAuthStore()
const userId = authStore.user.id
const today = new Date().toISOString().split('T')[0]
const storageKey = `dailyRecipe-${userId}`
const isLoading = ref(true)

const checkDailyRecipe = async () => {
  const local = JSON.parse(localStorage.getItem(storageKey))
  if (local?.date === today) {
    recipe.value = local.recipe
    isLoading.value = false

    return
  } else {
    localStorage.removeItem(storageKey)
  }
  const docRef = doc(db, 'users', userId, 'dailyRecipe', 'current')
  const docSnap = await getDoc(docRef)

  if (docSnap.exists() && docSnap.data().date === today) {
    recipe.value = docSnap.data().recipe
    localStorage.setItem(storageKey, JSON.stringify({ date: today, recipe: recipe.value }))
  } else {
    recipe.value = null
  }
  isLoading.value = false
}

const handleCardSelected = async (id) => {
  const recipeRef = doc(db, 'dailyRecipes', id)
  const recipeSnap = await getDoc(recipeRef)
  if (!recipeSnap.exists()) return

  recipe.value = recipeSnap.data()

  const userDocRef = doc(db, `users/${userId}/dailyRecipe/current`)
  await setDoc(userDocRef, {
    recipe: recipe.value,
    date: today,
  })
  localStorage.setItem(storageKey, JSON.stringify({ date: today, recipe: recipe.value }))
}

onMounted(() => {
  checkDailyRecipe()
})
</script>
