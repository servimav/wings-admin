<script setup lang="ts">
import { computed } from 'vue'
import type { ShopOrder } from '@servimav/wings-services'
import { CUP_PRICE, toCurrency } from '@/helpers'
import { useShopStore } from '@/stores'

interface Prop {
  order: ShopOrder
}

const $props = defineProps<Prop>()

const $shop = useShopStore()

const cupPrice = computed(() => {
  const cupCurrency = $shop.currencies.find((c) => c.code === 'CUP')
  return cupCurrency ? cupCurrency.price : CUP_PRICE
})

const totalPrice = computed(
  () =>
    Number($props.order.offers_price) +
    Number($props.order.delivery_price) +
    Number($props.order.service_price)
)
</script>

<template>
  <div class="rounded-md bg-white p-4 shadow-sm">
    <div class="flex justify-between">
      <b>Id: {{ order.id }}</b>
      <b>Total: {{ toCurrency(totalPrice * cupPrice) }}</b>
    </div>
    <div class="mt-2 text-sm">
      <ul class="list-none">
        <li>
          Envio: {{ toCurrency(order.delivery_price * cupPrice) }}
          {{ order.delivery_details.address }}
        </li>
      </ul>
    </div>

    <div class="mt-2 rounded-sm border border-slate-200 bg-slate-100 p-2 text-sm">
      <ul class="list-none">
        <li v-for="(item, itemKey) in order.items" :key="`item-${itemKey}-${item.id}-${order.id}`">
          {{ toCurrency(item.price * cupPrice) }} x{{ item.qty }} - {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
