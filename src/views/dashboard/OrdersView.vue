<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'
import { STATUS, type ShopOrder } from '@servimav/wings-services'
import { useServices } from '@/services'
import { useAppStore } from '@/stores'
/**
 * ------------------------------------------
 *	Componens
 * ------------------------------------------
 */
const OrderStatusSlider = defineAsyncComponent(
  () => import('@/components/sliders/OrderTypeSlider.vue')
)
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

const status = ref<STATUS>(STATUS.CREATED)

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
    const { data } = await $service.shop.order.filter({
      page: page.value ? page.value + 1 : undefined,
      status: status.value
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
 * onSelectStatus
 * @param selected
 */
async function onSelectStatus(selected: STATUS) {
  orders.value = []
  page.value = undefined
  status.value = selected
  await getOrders()
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
    <div class="sticky top-14 bg-white pt-1">
      <OrderStatusSlider :model-value="status" @update:model-value="onSelectStatus" />
    </div>

    <div class="space-y-2 bg-slate-200 p-2" v-if="orders.length">
      <OrderWidget
        v-for="(order, orderKey) in orders"
        :key="`order-${orderKey}-${order.id}`"
        :order="order"
      />
    </div>
  </section>
</template>
