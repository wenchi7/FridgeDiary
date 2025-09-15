<template>
  <div>
    <div class="flex w-full justify-center">
      <form
        class="p-10 mt-2 sm:mt-10 text-xl md:text-2xl lg:text-3xl transition-all uration-100 ease-in-out w-full"
        @submit.prevent="handleAddShopList(listInfo)"
      >
        <div class="mb-4 flex items-center">
          <label for="title" class="w-2/12 min-w-16"> 標題：</label>
          <input
            :disabled="disableInputOnEdit"
            type="text"
            id="title"
            v-model="listInfo.title"
            class="flex-1 w-full sm:w-10/12 border border-stone-400 pl-2 disabled:bg-transparent disabled:border-transparent"
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
              class="border border-slate-800 rounded-xl px-2 bg-red-300 bg-opacity-90 hover:bg-red-400 hover:bg-opacity-80"
            >
              <span v-show="showAdd" class="text-red-600">x</span>
              新增品項
            </button>
          </div>

          <AddList v-show="showAdd" @addInfo="handleAddInfo" @close="handleClose" />

          <div v-if="isLoading" class="flex justify-center mt-10">
            <span>
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
          </div>
          <div
            class="p-1 mt-4 m-3 sm:m-10 text-xl md:text-2xl lg:text-3xl transition-all duration-100 ease-in-out"
          >
            <ul>
              <li
                v-for="(item, index) in items"
                :key="index"
                class="sm:grid sm:grid-cols-[280px_auto] lg:grid-cols-[400px_auto] flex flex-col border-b border-stone-700 mt-4"
              >
                <div class="flex flex-row sm:block items-center mb-3 sm:mb-0">
                  <span>{{ index + 1 }}.</span>

                  <span class="text-start ml-4">{{ item.name }}</span>
                </div>

                <div class="relative flex justify-between sm:flex px-2 mb-2">
                  <div class="flex w-full gap-4 sm:grid sm:grid-cols-2">
                    <span class="leading-none"
                      >{{ item.quantity }}
                      <span class="whitespace-nowrap text-base md:text-2xl lg:text-3xl">{{
                        item.unit
                      }}</span>
                    </span>
                    <span class="text-base md:text-2xl lg:text-3xl">{{ item.price }} 元</span>
                  </div>

                  <div class="leading-none text-center ml-3">
                    <span class="text-red-700">到期日</span>
                    <span class="whitespace-nowrap text-red-700"> {{ item.expiryDate }}</span>
                  </div>
                </div>
                <div class="absolute right-6 hover:text-red-500">
                  <button type="button" @click="handleCancelAdd(index)">X</button>
                </div>
              </li>
            </ul>

            <p class="mt-4 text-end">總共 {{ total }} 元</p>
            <div class="mt-20 w-full flex justify-between">
              <button
                @click="handleCancelEdit"
                v-if="listId"
                class="flex items-center gap-1 group disabled:text-slate-500"
              >
                <span
                  class="inline-block transition-transform group-hover:scale-125 text-red-500 mr-2"
                  >X</span
                >
                取消編輯
              </button>
              <button
                class="flex items-center gap-1 group disabled:text-slate-500"
                type="submit"
                :disabled="isSubmitting"
              >
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
import { ref, computed, onMounted } from 'vue'
import AddList from './AddListingredient.vue'
import { useAuthStore } from '@/stores/authStore'
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDocs,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import { db } from '@/firebase/init'
import { useRouter } from 'vue-router'
const showAdd = ref(false)
const items = ref([])
const isSubmitting = ref(false)
const isLoading = ref(true)
const router = useRouter()
const disableInputOnEdit = computed(() => !!props.id)
const total = computed(() => items.value.reduce((sum, item) => sum + Number(item.price || 0), 0))
const props = defineProps({ id: String })
const listInfo = ref({
  title: '',
})
const listId = props.id
const handleAddShopList = async () => {
  isSubmitting.value = true
  const authStore = useAuthStore()
  const userId = authStore.user.id

  if (props.id) {
    const shoplistRef = doc(db, `users/${userId}/shoplists/${listId}`)
    await updateDoc(shoplistRef, {
      total: total.value,
      updatedAt: serverTimestamp(),
      ingredientsSummary: items.value.map((item) => item.name),
    })
    const ingredientsRef = collection(db, `users/${userId}/shoplists/${listId}/ingredients`)
    const oldSnap = await getDocs(ingredientsRef)

    for (const ing of oldSnap.docs) await deleteDoc(ing.ref)
    for (const ingredient of items.value) await addDoc(ingredientsRef, ingredient)
  } else {
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
  }
  isSubmitting.value = false
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

const handleCancelEdit = () => {
  router.push({ name: 'listview', params: { id: listId } })
}

const handleCancelAdd = (index) => {
  const name = items.value[index].name || ''
  if (window.confirm(`確定要刪除${name}嗎？`)) {
    items.value.splice(index, 1)
  }
}

onMounted(async () => {
  if (props.id) {
    const authStore = useAuthStore()
    const userId = authStore.user.id
    const mainRef = doc(db, `users/${userId}/shoplists/${props.id}`)

    const mainSnap = await getDoc(mainRef)
    if (mainSnap.exists()) {
      listInfo.value.title = mainSnap.data().title
      const ingRef = collection(db, `users/${userId}/shoplists/${props.id}/ingredients`)
      const snap = await getDocs(ingRef)
      isLoading.value = false
      items.value = snap.docs.map((doc) => doc.data())
    }
  } else {
    isLoading.value = false
  }
})
</script>
