<script setup lang="ts">
import { toCurrency } from '@/helpers'
import { useServices } from '@/services'
import { onBeforeMount, ref } from 'vue'

interface Stats {
  count_offers: number
  qty_offers: number
  count_available: number
  inversion: number
  provider: number
  sales: number
  earn: number
}

const { api } = useServices()

const stats = ref<Stats>({
  count_available: 0,
  count_offers: 0,
  earn: 0,
  inversion: 0,
  provider: 0,
  qty_offers: 0,
  sales: 0
})

onBeforeMount(async () => {
  stats.value = (await api.get<Stats>('/app/admin')).data
})
</script>

<template>
  <section class="p-2">
    <h2 class="text-center text-2xl text-gray-700">Datos</h2>

    <div class="mt-2 border border-gray-200 p-2">
      <ul class="list-none space-y-2">
        <li>Ofertas: {{ stats.count_offers }}</li>
        <li>Ofertas Disponibles: {{ stats.count_available }}</li>
        <li>Inventario: {{ stats.qty_offers }}</li>
        <li>Inversion: {{ toCurrency(stats.inversion) }}</li>
        <li>Proveedor: {{ toCurrency(stats.provider) }}</li>
        <li>Ventas: {{ toCurrency(stats.sales) }}</li>
        <li>Ganancias: {{ toCurrency(stats.earn) }}</li>
        <li>Ganancias Proveedor: {{ toCurrency(stats.provider - stats.inversion) }}</li>
      </ul>
    </div>
  </section>
</template>
