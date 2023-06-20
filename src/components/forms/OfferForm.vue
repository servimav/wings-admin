<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import {
  type ShopOfferCreate,
  STOCK_TYPE,
  type ShopOffer,
  type KeyValue
} from '@servimav/wings-services'
import { useShopStore } from '@/stores'
import { useAppStore } from '@/stores'
import { useServices } from '@/services'
// Types
export interface Emits {
  (e: 'canceled'): void
  (e: 'created', store: ShopOffer): void
  (e: 'updated', store: ShopOffer): void
}
export interface Props {
  storeId: number
  update?: ShopOffer
}
// Components
const SelectInput = defineAsyncComponent(() => import('@/components/forms/inputs/SelectInput.vue'))
const SelectMultiple = defineAsyncComponent(
  () => import('@/components/forms/inputs/SelectMultiple.vue')
)
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

const attributes = ref<string>()
const categories = computed(() => $shop.categories)

const form = ref<ShopOfferCreate>({
  available: true,
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
  gallery: undefined,
  attributes: [],
  min_delivery_days: 7,
  categories: undefined
})

const stockOptions: { label: string; value: number | string }[] = $shop.stockType.map((type) => {
  if (type === STOCK_TYPE.INFINITY) return { label: 'Infinito', value: type }
  else if (type === STOCK_TYPE.LIMITED) return { label: 'Limitado', value: type }
  return {
    label: 'Sin Inventario',
    value: STOCK_TYPE.OUT
  }
})

const stores = computed(() => $shop.stores)
const updateId = ref<number>()

/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

/**
 * transformAttrs
 * @param keyValues
 */
function transformAttrs(keyValues?: KeyValue[]): string | KeyValue[] {
  let resp: string | KeyValue[] = ''
  if (keyValues) {
    resp = ''
    keyValues.forEach((attr) => {
      if (resp !== '') resp += '\n'
      resp += `${attr.key}:\t${attr.value}`
    })
  } else if (attributes.value) {
    resp = []

    attributes.value.split('\n').forEach((line) => {
      const formatedLine = line.replace(/\t/g, ' ')
      const [key, value] = formatedLine.split(': ')
      console.log({ key, value })
      ;(resp as KeyValue[]).push({
        key: key.trim(),
        value: value.trim()
      })
    })
  }
  return resp
}

/**
 * add fee to sellPrice
 * @param productionPrice
 */
function onSetProductionPrice(productionPrice: number | string) {
  form.value.production_price = productionPrice as number
  form.value.sell_price = 1.1 * (productionPrice as number)
}

/**
 * onSubmit
 */
async function onSubmit() {
  $app.toggleLoading(true)
  try {
    // Transform attrs
    if (attributes.value) form.value.attributes = transformAttrs() as KeyValue[]
    // Check if update
    if (updateId.value) {
      const updateResp = await $service.shop.offer.update(updateId.value, form.value)
      $emit('updated', updateResp.data)
    } else {
      const createResp = await $service.shop.offer.create(form.value)
      $emit('created', createResp.data)
    }
    $app.success('Producto guardado')
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
  // Set store from props
  if ($props.storeId) form.value.store_id = $props.storeId

  // List categories
  try {
    await $shop.getCategories()
  } catch (error) {
    $app.axiosError(error)
  }

  // Fill data if update props exists
  if ($props.update) {
    updateId.value = $props.update.id
    // fill categories
    const updateCategories: number[] = []
    $props.update.categories?.forEach((cat) => {
      updateCategories.push(cat.id)
    })
    // fill attributes
    attributes.value = transformAttrs($props.update.attributes) as string

    form.value = {
      available: $props.update.available,
      name: $props.update.name,
      sell_price: $props.update.sell_price,
      stock_qty: $props.update.stock_qty,
      stock_type: $props.update.stock_type,
      store_id: $props.storeId,
      description: $props.update.description,
      discount_price: $props.update.discount_price,
      gallery: $props.update.gallery,
      image: $props.update.image,
      production_price: $props.update.production_price,
      remote_url: $props.update.remote_url,
      attributes: $props.update.attributes,
      min_delivery_days: $props.update.min_delivery_days,
      categories: updateCategories
    }
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <!-- Datos Generales -->
    <div class="space-y-4 border rounded-md p-4">
      <h4 class="text-center text-lg">Datos Generales</h4>

      <SelectInput
        id="offer_store_id"
        label="Tienda"
        v-model="form.store_id"
        :options="stores.map((s) => ({ label: s.name, value: s.id }))"
      />

      <SelectMultiple
        id="offer_categories"
        label="Categorias"
        v-model="form.categories"
        :options="categories.map((c) => ({ label: c.name, value: c.id }))"
      />

      <ToggleInput
        id="offer_available"
        v-model="form.available"
        label="Disponible"
        color="primary"
      />

      <TextInput
        id="offer-name"
        label="Nombre"
        placeholder="Mi Oferta"
        v-model="form.name"
        type="text"
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
    </div>
    <!-- / Datos Generales -->

    <!-- Precios -->
    <div class="space-y-4 border rounded-md p-4 mt-2">
      <h4 class="text-center text-lg">Precios</h4>

      <TextInput
        id="offer_production_price"
        label="Precio Produccion"
        :model-value="form.production_price"
        @update:model-value="onSetProductionPrice"
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
    </div>
    <!-- / Precios -->

    <!-- Inventario -->
    <div class="space-y-4 border rounded-md p-4 mt-2">
      <h4 class="text-center text-lg">Inventario</h4>

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
    <!-- / Inventario -->

    <!-- Extra -->
    <div class="space-y-4 border rounded-md p-4 mt-2">
      <h4 class="text-center text-lg">Extra</h4>

      <TextInput
        id="offer_min_delivery_days"
        label="Entrega Minima (Dias)"
        v-model="form.min_delivery_days"
        type="number"
        :min="0"
        required
      />

      <TextInput
        id="offer_url"
        label="URL Remota"
        placeholder="https://shein.com/offer"
        v-model="form.remote_url"
        type="text"
      />

      <TextInput
        id="offer_attributes"
        label="Atributos"
        v-model="attributes"
        type="textarea"
        :rows="5"
        required
      />
    </div>
    <!-- / Extra -->

    <div class="mt-4">
      <button class="btn-primary" type="submit">Guardar</button>
      <button class="btn" type="reset" @click="() => $emit('canceled')">Cancelar</button>
    </div>
  </form>
</template>
