<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { type ShopStoreCreate } from '@servimav/wings-services'
import { useShopStore } from '@/stores'
import { useAppStore } from '@/stores'
import { useServices } from '@/services'
// Components
// const SelectInput = defineAsyncComponent(() => import('@/components/forms/inputs/SelectInput.vue'))
const TextInput = defineAsyncComponent(() => import('@/components/forms/inputs/TextInput.vue'))
const ToggleInput = defineAsyncComponent(() => import('@/components/forms/inputs/ToggleInput.vue'))

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */

const $app = useAppStore()
const $emit = defineEmits<{ (e: 'completed', status: boolean): void }>()
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
    const resp = await $service.shop.store.create(form.value)
    $shop.stores = [resp.data, ...$shop.stores]
    $app.success('Tienda guardada')
    $emit('completed', true)
  } catch (error) {
    $app.axiosError(error)
    $emit('completed', false)
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
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="space-y-4">
      <ToggleInput
        id="store_available"
        v-model="form.available"
        label="Disponible"
        color="primary"
      />

      <TextInput
        id="store_name"
        label="Nombre"
        placeholder="Mi Tienda"
        v-model="form.name"
        type="text"
        required
      />

      <TextInput
        id="store_description"
        label="Descripcion"
        placeholder="Tienda de ropas"
        v-model="form.description"
        type="textarea"
        :rows="5"
        required
      />

      <TextInput id="store_address" label="Direccion" v-model="form.address" type="text" required />

      <TextInput
        id="store_image"
        label="Imagen"
        placeholder="https://image.url/image.png"
        v-model="form.image"
        type="text"
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
        label="Telefono"
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
