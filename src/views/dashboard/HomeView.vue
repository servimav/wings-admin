<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useServices } from '@/services'
import { useAppStore } from '@/stores'

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

/**
 * randomOffersRating
 */
async function randomOffersRating() {
  $app.toggleLoading(true)
  try {
    await api.get('/random-offers')
    $app.success('Orden modificado')
  } catch (error) {
    $app.axiosError(error)
  }
  $app.toggleLoading(false)
}

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
  <section class="space-y-2 p-2 text-slate-900">
    <div class="rounded-md border border-slate-200 bg-white p-4">
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

    <div class="rounded-md border border-slate-200 bg-white p-4">
      <h2 class="text-lg font-semibold">Opciones Rápidas</h2>

      <div class="mt-2">
        <button @click="randomOffersRating" class="btn-primary px-2 py-1.5">
          Ofertas Aleatorias
        </button>
      </div>
    </div>
  </section>
</template>
