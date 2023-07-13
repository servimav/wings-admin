<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useServices } from '@/services'
import { useAppStore, useShopStore } from '@/stores'

interface Stats {
  offers: {
    counter: number
  }
  orders: {
    counter: number
    status_accepted: number
    status_created: number
    status_onprogress: number
  }
  stores: {
    counter: number
  }
  users: {
    counter: number
  }
}
/**
 * ------------------------------------------
 *	Composables
 * ------------------------------------------
 */

const { api } = useServices()
const $app = useAppStore()
const $shop = useShopStore()
/**
 * ------------------------------------------
 *	Data
 * ------------------------------------------
 */
const stats = ref<Stats>({
  offers: {
    counter: 0
  },
  orders: {
    counter: 0,
    status_accepted: 0,
    status_created: 0,
    status_onprogress: 0
  },
  stores: {
    counter: 0
  },
  users: {
    counter: 0
  }
})

onBeforeMount(async () => {
  try {
    const { data } = await api.get<Stats>('/app/admin')
    stats.value = data
  } catch (error) {
    $app.axiosError(error)
  }
})
</script>

<template>
  <section class="p-2">
    <h2 class="text-center text-2xl text-gray-700">Datos</h2>

    <div class="mt-2 border border-gray-200 p-4">
      <ul class="list-none space-y-2">
        <li>Usuarios: {{ stats.users.counter }}</li>
        <li>Tiendas: {{ stats.stores.counter }}</li>
        <li>Offertas: {{ stats.offers.counter }}</li>
        <li>Pedidos: {{ stats.orders.counter }}</li>
        <li>Pedidos Nuevos: {{ stats.orders.status_created }}</li>
        <li>Pedidos Pagados: {{ stats.orders.status_accepted }}</li>
        <li>Pedidos En progreso: {{ stats.orders.status_onprogress }}</li>
      </ul>
    </div>
  </section>
</template>
