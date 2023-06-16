<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { type ShopOfferCreate, STOCK_TYPE } from '@servimav/wings-services'
import { useShopStore } from '@/stores'
import { useAppStore } from '@/stores'
import { useServices } from '@/services'
// Components
const SelectInput = defineAsyncComponent(() => import('@/components/forms/inputs/SelectInput.vue'))
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

const categories = computed(() => $shop.categories)
const stockOptions: { label: string; value: number | string }[] = $shop.stockType.map((type) => ({
  label: type,
  value: type
}))

const form = ref<ShopOfferCreate>({
  available: true,
  category_id: 0,
  currency: 'CUP',
  name: '',
  discount_price: undefined,
  sell_price: 0,
  production_price: 0,
  stock_qty: 1,
  stock_type: STOCK_TYPE.LIMITED,
  store_id: 0,
  description: '',
  image: '',
  remote_url: '',
  gallery: undefined
})
const stores = computed(() => $shop.stores)

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
    const resp = await $service.shop.offer.create(form.value)
    $shop.offers = [resp.data, ...$shop.offers]
    $app.success('Producto guardado')
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
      <SelectInput
        id="offer_store_id"
        label="Tienda"
        v-model="form.store_id"
        :options="stores.map((s) => ({ label: s.name, value: s.id }))"
      />

      <ToggleInput
        id="offer_available"
        v-model="form.available"
        label="Disponible"
        color="primary"
      />

      <TextInput
        id="offer-url"
        label="URL Remota"
        placeholder="https://shein.com/offer"
        v-model="form.remote_url"
        type="text"
      />

      <TextInput
        id="offer-name"
        label="Nombre"
        placeholder="Mi Oferta"
        v-model="form.name"
        type="text"
        required
      />

      <SelectInput
        id="offer_category_id"
        label="Categoria"
        v-model="form.category_id"
        :options="categories.map((cat) => ({ label: cat.name, value: cat.id }))"
        required
      />

      <TextInput
        id="offer_description"
        label="Descripcion"
        placeholder="Mi Oferta es muy bonita..."
        v-model="form.description"
        type="textarea"
        :rows="5"
        required
      />

      <TextInput
        id="offer_image"
        label="Imagen"
        placeholder="https://image.url/image.png"
        v-model="form.image"
        type="text"
      />

      <TextInput
        id="offer_production_price"
        label="Precio Produccion"
        v-model="form.production_price"
        type="currency"
        required
      />

      <TextInput
        id="offer_sell_price"
        label="Precio Venta"
        v-model="form.sell_price"
        type="currency"
        required
      />

      <TextInput
        id="offer_discount_price"
        label="Precio Descuento"
        v-model="form.discount_price"
        type="currency"
      />

      <SelectInput
        id="offer_stock_type"
        :options="stockOptions"
        label="Tipo de inventario"
        v-model="form.stock_type"
        required
      />
      <TextInput
        v-if="form.stock_type === STOCK_TYPE.LIMITED"
        v-model="form.stock_qty"
        type="number"
        id="offer_stock_qty"
        :min="0"
        label="Cantidad de inventario"
      />
    </div>
    <div class="mt-4">
      <button class="btn-primary">Guardar</button>
      <button class="btn">Cancelar</button>
    </div>
  </form>
</template>
