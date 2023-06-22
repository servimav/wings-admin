<script setup lang="ts">
import { computed } from 'vue'
import type { ShopOffer } from '@servimav/wings-services'
import { CUP_PRICE, toCurrency, setDefaultImage } from '@/helpers'
import { useShopStore } from '@/stores'

export interface Props {
  data: ShopOffer
}

const $props = defineProps<Props>()
const $shop = useShopStore()

const cupPrice = computed(() => {
  const cupCurrency = $shop.currencies.find((c) => c.code === 'CUP')
  return cupCurrency ? cupCurrency.price : CUP_PRICE
})

const displayPrice = computed(() =>
  $props.data.discount_price
    ? toCurrency($props.data.discount_price * cupPrice.value)
    : toCurrency($props.data.sell_price * cupPrice.value)
)
</script>

<template>
  <div
    class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="p-2 bg-slate-100 relative">
      <img
        class="rounded-t-lg"
        :src="data.image ?? '/images/default.png'"
        :alt="data.name"
        :title="data.name"
        @error="setDefaultImage"
      />

      <div class="absolute bottom-1 right-1 z-10">
        <div
          class="rounded-full shadow-md border p-1 text-xs"
          :class="
            data.available
              ? 'bg-green-500 text-white border-green-300'
              : 'bg-slate-300 text-black border-slate-400'
          "
        ></div>
      </div>
    </div>
    <div class="p-2">
      <h5 class="text-sm text-gray-900 dark:text-white">{{ data.name }}</h5>
      <p class="font-bold text-gray-900 dark:text-white">
        {{ displayPrice }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.trim {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
