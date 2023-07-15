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
  $props.data.discount_price && $props.data.discount_price > 0
    ? toCurrency($props.data.discount_price * cupPrice.value)
    : toCurrency($props.data.sell_price * cupPrice.value)
)
</script>

<template>
  <div
    class="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="relative bg-slate-50 p-2">
      <img
        class="h-48 w-full rounded-lg object-cover object-center"
        :src="data.image ?? '/images/default.png'"
        :alt="data.name"
        :title="data.name"
        @error="setDefaultImage"
      />

      <div class="absolute bottom-1 right-1 z-10">
        <div
          class="rounded-full border p-1 text-xs shadow-md"
          :class="
            data.available
              ? 'border-green-300 bg-green-500 text-white'
              : 'border-slate-400 bg-slate-300 text-black'
          "
        ></div>
      </div>
    </div>
    <div class="p-2">
      <h5 class="text-sm text-gray-900 dark:text-white">(No.{{ data.id }}): {{ data.name }}</h5>
      <p class="font-bold text-gray-900 dark:text-white">
        {{ displayPrice }}
        <span class="ml-2">({{ data.views }} Vistas)</span>
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
