<template>
  <div>
    <div class="flex w-full justify-center">
      <form
        class="p-6 mt-2 sm:mt-10 text-xl md:text-2xl lg:text-3xl transition-all uration-100 ease-in-out w-full"
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
            placeholdder="請輸入清單標題  ex：8/8咖哩飯"
            required
          />
        </div>
        <div class="flex flex-col w-full">
          <div class="flex items-center">
            <label class="w-2/12 min-w-16">品項：</label>

            <button
              @click="showAddPage"
              type="button"
              :disabled="isSubmitting"
              class="border border-slate-800 rounded-xl px-2 bg-red-300 bg-opacity-90 hover:bg-red-400 hover:bg-opacity-80 disabled:text-slate-500"
            >
              <span v-show="showAdd" class="text-red-600">x</span>
              新增品項
            </button>
          </div>

          <AddListingredient v-show="showAdd" @addInfo="handleAddInfo" @close="handleClose" />

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
            class="p-2 mt-4 m-3 sm:m-6 text-xl md:text-2xl lg:text-3xl transition-all duration-100 ease-in-out"
          >
            <ul>
              <li
                v-for="(ingredient, index) in ingredients"
                :key="index"
                class="sm:grid sm:grid-cols-[240px_auto] lg:grid-cols-[350px_auto] flex flex-col border-b border-stone-700 mt-4"
              >
                <div class="flex items-start mb-3 sm:mb-0">
                  <span>{{ index + 1 }}.</span>

                  <span class="text-start ml-4 block break-words sm:max-w-[18ch]">{{
                    ingredient.name
                  }}</span>
                </div>

                <div class="relative px-3 mb-2 gap-5 flex justify-between sm:grid grid-cols-3">
                  <div class="flex gap-2 justify-center">
                    <div v-if="ingredients[index].isEditing">
                      <input
                        v-model="ingredients[index].quantity"
                        type="number"
                        min="0"
                        class="border rounded px-1 w-20"
                      />
                    </div>
                    <div v-else>
                      {{ ingredient.quantity }}
                    </div>

                    <span class="whitespace-nowrap"> {{ ingredient.unit }}</span>
                  </div>
                  <div class="flex justify-center">
                    <div v-if="ingredients[index].isEditing">
                      <input
                        v-model="ingredients[index].price"
                        type="number"
                        min="0"
                        class="border rounded px-1 w-20"
                      />
                      <p>元</p>
                    </div>
                    <div v-else class="flex gap-2">
                      {{ ingredient.price }}
                      <p>元</p>
                    </div>
                  </div>

                  <div class="text-center mr-3 flex flex-col items-center leading-none">
                    <span class="whitespace-nowrap text-red-700">到期日</span>
                    <span class="whitespace-nowrap text-red-700"> {{ ingredient.expiryDate }}</span>
                  </div>
                </div>
                <div class="absolute right-5 flex gap-5">
                  <div class="hover:text-red-600" v-if="props.id">
                    <button
                      type="button"
                      @click="toggleEditing(ingredient.id)"
                      :disabled="isSubmitting"
                      class="disabled:text-slate-500"
                    >
                      ✎
                    </button>
                  </div>

                  <div class="hover:text-red-600">
                    <button
                      type="button"
                      @click="handleCancelAdd(index)"
                      :disabled="isSubmitting"
                      class="disabled:text-slate-500"
                    >
                      X
                    </button>
                  </div>
                </div>
              </li>
            </ul>

            <p class="mt-4 text-end">總共 {{ total }} 元</p>
            <div class="mt-20 w-full flex justify-between">
              <button
                @click="handleCancelEdit"
                v-if="listId"
                :disabled="isSubmitting"
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
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { db } from '@/firebase/init'
import { useRouter } from 'vue-router'
import AddListingredient from './AddListingredient.vue'
const showAdd = ref(false)
const ingredients = ref([])
const isSubmitting = ref(false)
const isLoading = ref(true)

const router = useRouter()
const disableInputOnEdit = computed(() => !!props.id)
const total = computed(() =>
  ingredients.value.reduce((sum, ingredient) => sum + Number(ingredient.price || 0), 0),
)
const props = defineProps({ id: String })
const listInfo = ref({
  title: '',
})
const listId = props.id

const handleAddShopList = async () => {
  isSubmitting.value = true
  const authStore = useAuthStore()
  const userId = authStore.user.id
  const sortedItems = ingredients.value.sort((a, b) => a.createdAt - b.createdAt)

  if (props.id) {
    const shoplistRef = doc(db, `users/${userId}/shoplists/${listId}`)
    const stockRef = collection(db, `users/${userId}/stocks`)

    await updateDoc(shoplistRef, {
      updatedAt: serverTimestamp(),
      total: total.value,
      ingredientsSummary: sortedItems.map((ingredient) => ingredient.name),
    })
    const ingredientsRef = collection(db, `users/${userId}/shoplists/${listId}/ingredients`)

    const oldSnap = await getDocs(ingredientsRef)
    const oldIds = oldSnap.docs.map((doc) => doc.id)
    const newIds = ingredients.value
      .filter((ingredient) => ingredient.id)
      .map((ingredient) => ingredient.id)

    for (const id of oldIds) {
      if (!newIds.includes(id)) {
        const ingredientDocRef = doc(db, `users/${userId}/shoplists/${listId}/ingredients/${id}`)
        await deleteDoc(ingredientDocRef)

        const stockQuery = query(stockRef, where('shoplistIngredientId', '==', id))
        const stockSnap = await getDocs(stockQuery)
        for (const stockDoc of stockSnap.docs) {
          await deleteDoc(doc(db, `users/${userId}/stocks/${stockDoc.id}`))
        }
      }
    }

    for (const ingredient of ingredients.value) {
      if (ingredient.id) {
        const ingredientDocRef = doc(
          db,
          `users/${userId}/shoplists/${listId}/ingredients/${ingredient.id}`,
        )
        await updateDoc(ingredientDocRef, {
          quantity: ingredient.quantity,
          price: ingredient.price,
        })
        const stockQuery = query(stockRef, where('shoplistIngredientId', '==', ingredient.id))
        const stockSnap = await getDocs(stockQuery)
        for (const stockDoc of stockSnap.docs) {
          await updateDoc(doc(db, `users/${userId}/stocks/${stockDoc.id}`), {
            quantity: ingredient.quantity,
            price: ingredient.price,
          })
        }
      } else {
        const ingredientsRef = collection(db, `users/${userId}/shoplists/${listId}/ingredients`)
        const docRef = await addDoc(ingredientsRef, {
          ...ingredient,
          createdAt: ingredient.createdAt,
          deducted: ingredient.deducted ?? 0,
        })

        await addDoc(stockRef, {
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          price: ingredient.price,
          expiryDate: ingredient.expiryDate,
          deducted: ingredient.deducted ?? 0,
          createdAt: ingredient.createdAt,
          shoplistIngredientId: docRef.id,
        })
      }
    }
  } else {
    const shoplistRef = await addDoc(collection(db, `users/${userId}/shoplists`), {
      title: listInfo.value.title,
      createdAt: serverTimestamp(),
      total: total.value,
      ingredientsSummary: sortedItems.map((ingredient) => ingredient.name),
    })

    const shoplistId = shoplistRef.id
    const ingredientsRef = collection(db, `users/${userId}/shoplists/${shoplistId}/ingredients`)
    const stockRef = collection(db, `users/${userId}/stocks`)
    for (const ingredient of ingredients.value) {
      const docRef = await addDoc(ingredientsRef, {
        ...ingredient,
        createdAt: ingredient.createdAt,
        deducted: ingredient.deducted,
      })
      await addDoc(stockRef, {
        name: ingredient.name,
        quantity: ingredient.quantity,
        deducted: ingredient.deducted,
        unit: ingredient.unit,
        price: ingredient.price,
        expiryDate: ingredient.expiryDate,
        createdAt: ingredient.createdAt,
        shoplistIngredientId: docRef.id,
      })
    }

    listInfo.value.title = ''
    ingredients.value = []
  }
  isSubmitting.value = false
  router.push({ name: 'shoplist' })
}

const showAddPage = () => {
  showAdd.value = !showAdd.value
}

const handleAddInfo = (newItem) => {
  ingredients.value.push(newItem)
  showAdd.value = false
}

const handleClose = () => {
  showAdd.value = false
}

const handleCancelEdit = () => {
  router.push({ name: 'listview', params: { id: listId } })
}

const handleCancelAdd = (index) => {
  const name = ingredients.value[index].name || ''
  if (window.confirm(`確定要刪除${name}嗎？`)) {
    ingredients.value.splice(index, 1)
  }
}
const toggleEditing = (id) => {
  const ingredient = ingredients.value.find((i) => i.id === id)
  if (ingredient) {
    ingredient.isEditing = !ingredient.isEditing
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
      const ingQuery = query(ingRef, orderBy('createdAt', 'asc'))
      const snap = await getDocs(ingQuery)
      isLoading.value = false
      ingredients.value = snap.docs.map((doc) => ({ id: doc.id, ...doc.data(), isEditing: false }))
    }
  } else {
    isLoading.value = false
  }
})
</script>
