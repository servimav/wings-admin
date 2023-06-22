<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount, ref } from 'vue'
import type { ShopStore, ShopStoreCreate } from '@servimav/wings-services'
import { useShopStore } from '@/stores'
import { useAppStore } from '@/stores'
import { useServices } from '@/services'
// Types
export interface Emits {
  (e: 'created', store: ShopStore): void
  (e: 'updated', store: ShopStore): void
}
export interface Props {
  update?: ShopStore
}
// Components
const TextInput = defineAsyncComponent(() => import('@/components/forms/inputs/TextInput.vue'))
const ToggleInput = defineAsyncComponent(() => import('@/components/forms/inputs/ToggleInput.vue'))

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */

const $app = useAppStore()
const $emit = defineEmits<Emits>()
const $props = defineProps<Props>()
const $service = useServices()
const $shop = useShopStore()

/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const form = ref<ShopStoreCreate>({
  available: true,
  name: '',
  description: '',
  image: '',
  contact_url: undefined,
  location_id: 1,
  address: '',
  contact_email: undefined,
  contact_phone: undefined,
  coords: {
    latitude: 0,
    longitude: 0
  }
})

const updateId = ref<number>()

/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

/**
 * onSubmit
 */
async function onSubmit() {
  $app.toggleLoading(true)
  try {
    // Check if is update
    if (updateId.value) {
      const updateResp = await $service.shop.store.update(updateId.value, form.value)
      $emit('updated', updateResp.data)
    }
    // Create new store
    else {
      const createResp = await $service.shop.store.create(form.value)
      $shop.stores = [createResp.data, ...$shop.stores]
      $emit('created', createResp.data)
    }
    $app.success('Tienda guardada')
  } catch (error) {
    $app.axiosError(error)
  }
  $app.toggleLoading(false)
}

/**
 * -----------------------------------------
 *	Lifecycle
 * -----------------------------------------
 */

onBeforeMount(async () => {
  try {
    await $shop.getCategories()
  } catch (error) {
    $app.axiosError(error)
  }

  // preload if update  props
  if ($props.update) {
    updateId.value = $props.update.id
    form.value = {
      available: $props.update.available,
      location_id: $props.update.location.id,
      name: $props.update.name,
      address: $props.update.address,
      contact_email: $props.update.contact_email,
      contact_phone: $props.update.contact_phone,
      contact_url: $props.update.contact_url,
      coords: $props.update.coords,
      description: $props.update.description,
      image: $props.update.image
    }
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="space-y-4">
      <ToggleInput
        id="store_available"
        v-model="form.available"
        :label="form.available ? 'Abierta' : 'Cerrada'"
        color="primary"
      />

      <TextInput
        id="store_name"
        label="Nombre"
        placeholder="Mi Tienda"
        v-model="form.name"
        type="text"
        required
        no-autocomplete
      />

      <TextInput
        id="store_description"
        label="Descripción"
        placeholder="Tienda de ropas"
        v-model="form.description"
        type="textarea"
        :rows="5"
        required
      />

      <TextInput id="store_address" label="Dirección" v-model="form.address" type="text" required />

      <TextInput
        id="store_image"
        label="Imagen"
        placeholder="https://image.url/image.png"
        v-model="form.image"
        type="text"
        no-autocomplete
      />

      <TextInput
        id="store_contact_email"
        label="Email"
        placeholder="mitienda@email.com"
        v-model="form.contact_email"
        type="email"
      />

      <TextInput
        id="store_contact_phone"
        label="Teléfono"
        placeholder="53535353"
        v-model="form.contact_phone"
        type="tel"
      />

      <TextInput
        id="store_contact_url"
        label="URL Contacto"
        placeholder="https://wa.me/53535353"
        v-model="form.contact_url"
        type="text"
      />
    </div>
    <div class="mt-4">
      <button class="btn-primary">Guardar</button>
      <button class="btn">Cancelar</button>
    </div>
  </form>
</template>
