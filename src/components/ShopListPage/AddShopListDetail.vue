<template>
  <div>
    <div class="flex w-full justify-center">
      <form
        class="p-5 mt-4 sm:m-10 text-xl md:text-2xl lg:text-3xl transition-all uration-100 ease-in-out"
        @submit.prevent="handleAddShopList(listInfo)"
      >
        <div class="mb-4 flex items-center">
          <label for="title" class="w-2/12 min-w-16"> 標題：</label>
          <input
            type="text"
            id="title"
            v-model="listInfo.title"
            class="flex-1 w-full sm:w-10/12 border border-stone-400 pl-2"
            placeholder="請輸入清單標題  ex：8/8咖哩飯"
            required
          />
        </div>
        <div class="flex flex-col w-full">
          <div class="flex items-center">
            <label class="w-2/12 min-w-16">品項：</label>

            <button
              @click="showAddPage"
              type="button"
              class="border border-slate-800 rounded-xl px-2"
            >
              <span v-if="showAdd" class="text-red-600">x</span>
              新增品項
            </button>
          </div>

          <AddList v-if="showAdd" @addInfo="handleAddInfo" @close="handleClose" />
          <div class="relative mt-4 mb-10">
            <ul>
              <li
                v-for="(item, index) in items"
                :key="index"
                class="grid sm:grid-cols-[35px_150px_90px_95px_auto_35px] grid-cols-[35px_auto_80px_80px_20px] border-b border-stone-700 mt-4"
              >
                <span>{{ index + 1 }}.</span>
                <span class="text-start">{{ item.name }}</span>
                <span class="text-end">{{ item.quantity }} {{ item.unit }} </span>
                <span class="text-end">{{ item.price }}元</span>
                <span class="hidden sm:block w-52 text-end">到期日{{ item.expiryDate }}</span>
                <button type="button" @click="handleCancelAdd(index)" class="text-end">X</button>
              </li>
            </ul>
            <p class="mt-4 text-end">總共 {{ total }} 元</p>
            <div class="mt-20 w-full flex justify-end">
              <button class="flex items-center gap-1 group" type="submit">
                <span class="inline-block transition-transform group-hover:rotate-12">✏️</span>
                <span>完成</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AddList from './AddListingredient.vue'
import { useAuthStore } from '@/stores/authStore'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/init'
import { useRouter } from 'vue-router'
const showAdd = ref(false)
const items = ref([])
const total = computed(() => items.value.reduce((sum, item) => sum + Number(item.price || 0), 0))
const listInfo = ref({
  title: '',
})
const router = useRouter()
const handleAddShopList = async () => {
  const authStore = useAuthStore()
  const userId = authStore.user.id
  const shoplistRef = await addDoc(collection(db, `users/${userId}/shoplists`), {
    title: listInfo.value.title,
    createdAt: serverTimestamp(),
    total: total.value,
    ingredientsSummary: items.value.map((item) => item.name),
  })
  const shoplistId = shoplistRef.id
  const ingredientsRef = collection(db, `users/${userId}/shoplists/${shoplistId}/ingredients`)
  for (const ingredient of items.value) {
    await addDoc(ingredientsRef, ingredient)
  }
  listInfo.value.title = ''
  items.value = []
  router.push({ name: 'shoplist' })
}

const showAddPage = () => {
  showAdd.value = !showAdd.value
}
const handleAddInfo = (newItem) => {
  items.value.push(newItem)
  showAdd.value = false
}

const handleClose = () => {
  showAdd.value = false
}
const handleCancelAdd = (index) => {
  items.value.splice(index, 1)
}
</script>
