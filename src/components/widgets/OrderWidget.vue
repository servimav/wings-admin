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
      <ul class="space-y-2 rounded-md">
        <li>
          Cliente: <span class="font-semibold">{{ order.customer.name }}</span>
        </li>
        <li>
          Telefono: <span class="font-semibold">{{ order.customer.phone }}</span>
        </li>
        <li>
          Envio:
          {{ order.delivery_price > 0 ? toCurrency(order.delivery_price * cupPrice) : 'Gratis' }}
          {{ order.delivery_details.address }}
        </li>
      </ul>
    </div>

    <div class="mt-2 text-sm">
      <p>
        Pago:
        {{
          order.payment_type === 'TRANSFER_PARTIAL'
            ? toCurrency((totalPrice * cupPrice) / 2)
            : toCurrency(totalPrice * cupPrice)
        }}
      </p>
    </div>

    <div class="mt-2 rounded-sm border border-slate-200 bg-slate-100 p-2 text-sm">
      <ul class="list-none">
        <li v-for="(item, itemKey) in order.items" :key="`item-${itemKey}-${item.id}-${order.id}`">
          {{ toCurrency(item.price * cupPrice) }} x{{ item.qty }} - {{ item.name }}
          <span v-if="item.incomming" class="ml-1 font-semibold">Encargo</span>
        </li>
      </ul>
    </div>
  </div>
</template>
