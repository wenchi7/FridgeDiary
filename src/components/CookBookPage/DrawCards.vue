<template>
  <div class="flex justify-center items-start min-h-[70vh] bg-black overflow-visible">
    <div class="relative w-full flex justify-center items-center h-[400px]">
      <div
        v-for="(recipe, i) in recipes"
        :key="i"
        class="card cursor-pointer"
        :style="`--i: ${i - (recipes.length - 1) / 2};`"
        @click="selectCard(recipe.firestoreId)"
      >
        <img
          src="@/assets/vintage-paper-background.jpg"
          alt="card"
          class="w-full h-full object-cover rounded-sm border"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { db } from '@/firebase/init'
import { collection, getDocs } from 'firebase/firestore'
import { defineEmits, onMounted, ref } from 'vue'
const recipes = ref([])
const fetchRecipes = async () => {
  try {
    const recipesRef = collection(db, 'dailyRecipes')
    const recipesSnap = await getDocs(recipesRef)
    recipes.value = recipesSnap.docs.map((doc) => ({ firestoreId: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('無法抓取食譜資料：', error)
    recipes.value = []
  }
}

const emit = defineEmits(['card-selected'])

const selectCard = (id) => {
  emit('card-selected', id)
}

onMounted(fetchRecipes)
</script>

<style lang="postcss">
.card {
  @apply absolute  bg-white  shadow-xl rounded-sm flex justify-center items-center text-black text-sm border border-black transition-all ease-in-out duration-300;
  aspect-ratio: 2 / 3;
  max-width: 12rem;
  width: 20vw;
  transform: rotate(calc(var(--i) * 1deg)) translateX(calc(var(--i) * 2.5vw));
  transform-origin: bottom center;
}

.card:hover {
  transform: rotate(calc(var(--i) * 1deg)) translateX(calc(var(--i) * 2.5vw))
    translate(-10px, -20px);
}
</style>
