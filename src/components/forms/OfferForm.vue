<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount, ref } from 'vue'
import type { ShopOfferCreate } from '@servimav/wings-services'
import { useServices } from '@/services'
// Components
const TextInput = defineAsyncComponent(() => import('@/components/forms/inputs/TextInput.vue'))

/**
 * -----------------------------------------
 *	Helpers
 * -----------------------------------------
 */

const $service = useServices()
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const form = ref<ShopOfferCreate>({
  available: true,
  category_id: 0,
  currency: 'CUP',
  name: '',
  sell_price: 0,
  production_price: 0,
  stock_qty: 0,
  stock_type: 'IN_STOCK',
  store_id: 0,
  description: '',
  image: '',
  remote_url: ''
})

/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

async function onSubmit() {
  console.log('onsubmit')
}

/**
 * -----------------------------------------
 *	Lifecycle
 * -----------------------------------------
 */

onBeforeMount(() => {})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="space-y-4">
      <TextInput
        id="offer-name"
        label="Nombre"
        placeholder="Mi Oferta"
        v-model="form.name"
        type="text"
      />

      <TextInput
        id="offer-description"
        label="Descripcion"
        placeholder="Mi Oferta es muy bonita..."
        v-model="form.description"
        type="textarea"
        :rows="5"
      />

      <TextInput
        id="offer-image"
        label="Imagen"
        placeholder="https://image.url/image.png"
        v-model="form.image"
        type="text"
      />

      <TextInput id="offer-price" label="Precio" v-model="form.production_price" type="currency" />
    </div>
    <div class="mt-4">
      <button class="btn-primary">Guardar</button>
      <button class="btn">Cancelar</button>
    </div>
  </form>
</template>
