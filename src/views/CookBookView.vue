<template>
  <div class="mx-16 my-16">
    <h1 class="text-center text-3xl">🎲 今日食譜抽籤</h1>

    <div v-if="!recipe" class="flex justify-center mt-7">
      <DrawCards @card-selected="handleCardSelected" />
    </div>

    <div v-else class="mt-10 text-lg md:text-2xl lg:text-3xl">
      <div class="flex flex-col sm:flex-row gap-10 mb-5 p-5 sm:p-4 items-center justify-start">
        <img v-if="recipe.image" :src="recipe.image" alt="recipe" class="w-72 h-auto" />
        <div>
          <h2 class="mb-5 font-semibold">{{ recipe.title }}</h2>
          <p v-if="recipe.servings">份量: {{ recipe.servings }}人</p>
          <p v-if="recipe.readyInMinutes">預計時間: {{ recipe.readyInMinutes }} min</p>
        </div>
      </div>

      <div class="flex flex-col gap-5 w-full">
        <div class="w-full border-b border-slate-800 p-5">
          <p class="mb-2">食材：</p>
          <ul class="grid grid-cols-2 w-full">
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
          <ul class="list-decimal w-full py-5 px-9">
            <p class="mb-2">步驟：</p>

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
import { doc, getDoc } from 'firebase/firestore'
import { ref } from 'vue'

const recipe = ref(null)

const handleCardSelected = async (id) => {
  console.log('卡片被點擊了！recipe.id:', id)
  const recipeRef = doc(db, 'dailyRecipes', id)
  const recipeSnap = await getDoc(recipeRef)
  if (recipeSnap.exists()) {
    recipe.value = recipeSnap.data()
    console.log('選取的食譜內容：', recipe.value)
  } else {
    console.warn('找不到該食譜資料')
  }
}
</script>
