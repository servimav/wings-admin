<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'
import type { ShopOrder } from '@servimav/wings-services'
import { useServices } from '@/services'
import { useAppStore } from '@/stores'
/**
 * ------------------------------------------
 *	Componens
 * ------------------------------------------
 */
const OrderWidget = defineAsyncComponent(() => import('@/components/widgets/OrderWidget.vue'))
/**
 * ------------------------------------------
 *	Composable
 * ------------------------------------------
 */
const $app = useAppStore()
const $service = useServices()

/**
 * ------------------------------------------
 *	Data
 * ------------------------------------------
 */

const orders = ref<ShopOrder[]>([])

const page = ref<number>()

const scrollHandler = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  const scrolled = window.scrollY
  if (scrollable - scrolled <= 1) {
    getOrders()
  }
}

/**
 * ------------------------------------------
 *	Methods
 * ------------------------------------------
 */

/**
 * getOrders
 */
async function getOrders() {
  if ($app.loading) return

  $app.toggleLoading(true)
  try {
    const { data } = await $service.shop.order.list({
      page: page.value ? page.value + 1 : undefined
    })
    page.value = data.meta.current_page
    if (data.data.length) {
      // if is first search overwrite offers
      orders.value.push(...data.data)
    } else {
      // Stop event listner
      window.removeEventListener('scroll', scrollHandler)
    }
  } catch (error) {
    $app.axiosError(error)
    window.removeEventListener('scroll', scrollHandler)
  }
  $app.toggleLoading(false)
}

/**
 * ------------------------------------------
 *	Lifecycle
 * ------------------------------------------
 */

onBeforeMount(() => {
  orders.value = []
  getOrders()
})

onMounted(() => {
  window.addEventListener('scroll', scrollHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scrollHandler)
})
</script>

<template>
  <section id="orders-section">
    <div class="space-y-2 bg-slate-200 p-2">
      <OrderWidget
        v-for="(order, orderKey) in orders"
        :key="`order-${orderKey}-${order.id}`"
        :order="order"
      />
    </div>
  </section>
</template>
