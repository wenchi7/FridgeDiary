<template>
  <div class="flex justify-center">
    <form
      @submit.prevent="onSubmit"
      class="flex flex-col max-w-md w-full mx-auto justify-center mt-3 text-lg sm:text-2xl lg:text-3xl border-black border-4 rounded-3xl bg-yellow-50 p-3 transition-all duration-300 ease-in-out"
    >
      <div class="form-div">
        <label for="name">品項：</label>
        <input
          type="text"
          id="name"
          v-model="listform.name"
          placeholder="請輸入品項名稱"
          list="nameSuggestions"
          class="placeholder:px-2 px-2 w-2/3"
          maxlength="10"
          required
        />
      </div>
      <div class="form-div">
        <label for="quantity">數量：</label>
        <input
          type="number"
          id="quantity"
          v-model.number="listform.quantity"
          min="1"
          class="px-4 w-2/5"
          required
        />
        <select v-model="listform.unit" id="unit" class="text-xl ml-4" required>
          <option disabled value="">單位</option>
          <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
        </select>
      </div>

      <div class="form-div">
        <label class="" for="price">價格：</label>
        <input
          type="number"
          id="price"
          v-model.number="listform.price"
          min="0"
          class="px-4 w-2/5"
          required
        />
        <p class="ml-4">元</p>
      </div>
      <div class="form-div">
        <label class="w-24 sm:w-32 lg:w-44" for="date">有效期限：</label>
        <input type="date" id="date" v-model="listform.expiryDate" />
        <p class="text-lg ml-3">選填</p>
      </div>
      <div class="flex justify-between">
        <p class="text-red-600 text-lg">（ 填寫有效期限即期時提醒 ）</p>

        <button type="submit" class="border border-black bg-red-500 rounded-xl text-center w-16">
          加入
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['addInfo'])
const listform = ref({
  name: '',
  quantity: 1,
  unit: '',
  price: 0,
  expiryDate: '',
})

const units = [
  '顆',
  '罐',
  '杯',
  '瓶',
  '袋',
  '卷',
  '隻',
  '盒',
  '組',
  '條',
  '包',
  '個',
  '碗',
  '塊',
  '毫升',
  '公克',
]
const onSubmit = () => {
  emit('addInfo', { ...listform.value, createdAt: Date.now() })
  listform.value = {
    name: '',
    quantity: 1,
    unit: '',
    price: 0,
    expiryDate: '',
  }
}
</script>

<style scoped lang="postcss">
.form-div {
  @apply flex items-center mb-1;
}
</style>
