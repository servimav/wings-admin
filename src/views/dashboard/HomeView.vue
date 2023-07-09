<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useServices } from '@/services'
import { useAppStore } from '@/stores'

/**
 * ------------------------------------------
 *	Composables
 * ------------------------------------------
 */

const $app = useAppStore()
const $service = useServices()

/**
 * ------------------------------------------
 *	methods
 * ------------------------------------------
 */

/**
 * randomOffersRating
 */
async function randomOffersRating() {
  $app.toggleLoading(true)
  try {
    await $service.api.get('/random-offers')
    $app.success('Orden modificado')
  } catch (error) {
    $app.axiosError(error)
  }
  $app.toggleLoading(false)
}
</script>

<template>
  <section class="p-2 text-slate-900">
    <div class="rounded-md border border-slate-200 bg-white p-4">
      <h2 class="text-lg font-semibold">Opciones Rápidas</h2>

      <div class="mt-2">
        <button @click="randomOffersRating" class="btn-primary px-2.5 py-1.5">
          Re-Ordenar Ofertas
        </button>
      </div>
    </div>
  </section>
</template>
