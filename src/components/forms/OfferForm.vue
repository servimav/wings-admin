<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import {
  type ShopOfferCreate,
  STOCK_TYPE,
  type ShopOffer,
  type KeyValue
} from '@servimav/wings-services'
import { useShopStore, useUserStore } from '@/stores'
import { useAppStore } from '@/stores'
import { useServices } from '@/services'
import { CUP_PRICE, toCurrency, roundX10 } from '@/helpers'
// Types
export interface Emits {
  (e: 'canceled'): void
  (e: 'created', offer: ShopOffer): void
  (e: 'updated', offer: ShopOffer): void
}
export interface Props {
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
const $user = useUserStore()
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const attributes = ref<string>()
const categories = computed(() => $shop.categories)

const cupPrice = computed(() => {
  const cupCurrency = $shop.currencies.find((c) => c.code === 'CUP')
  return cupCurrency ? cupCurrency.price : CUP_PRICE
})

const form = ref<ShopOfferCreate>({
  available: true,
  // data
  name: '',
  description: '',
  image: undefined,
  // prices
  sell_price: 0,
  discount_price: undefined,
  provider_price: undefined,
  inversion_price: undefined,
  // inventary
  stock_qty: undefined,
  stock_type: STOCK_TYPE.LIMITED,
  store_id: 0,
  remote_url: undefined,
  gallery: undefined,
  attributes: undefined,
  min_delivery_days: 14,
  categories: undefined,
  rating: undefined,
  views: undefined,
  weight: undefined
})

const isDeveloper = computed(() => $user.isDeveloper)

const convertCUP = ref<{ sell: number; discount: number }>({
  discount: 0,
  sell: 0
})

const stockOptions: { label: string; value: number | string }[] = $shop.stockType.map((type) => {
  if (type === STOCK_TYPE.INFINITY) return { label: 'Infinito', value: type }
  else if (type === STOCK_TYPE.LIMITED) return { label: 'Limitado', value: type }
  else if (type === STOCK_TYPE.INCOMMING) return { label: 'Encargo', value: type }
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

function onUpdateCupConvert(price: number | string, type: 'sell' | 'discount') {
  const priceRounded = roundX10(Number(price))
  if (type === 'sell') {
    convertCUP.value.sell = priceRounded
    // @ts-ignore
    form.value.sell_price = (priceRounded / cupPrice.value).toFixed(2)
  } else {
    convertCUP.value.discount = priceRounded
    // @ts-ignore
    form.value.discount_price = (priceRounded / cupPrice.value).toFixed(2)
  }
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
  } catch (error) {
    $app.axiosError(error)
  }
  $app.toggleLoading(false)
}

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
      ;(resp as KeyValue[]).push({
        key: key.trim(),
        value: value.trim()
      })
    })
  }
  return resp
}
/**
 * -----------------------------------------
 *	Lifecycle
 * -----------------------------------------
 */

onBeforeMount(async () => {
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
      ...$props.update,
      categories: updateCategories,
      store_id: $props.update.store?.id as number
    }

    convertCUP.value = {
      discount: roundX10(
        Number(
          form.value.discount_price && form.value.discount_price > 0
            ? form.value.discount_price * cupPrice.value
            : 0
        )
      ),
      sell: roundX10(Number(form.value.sell_price * cupPrice.value))
    }
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="bg-white">
    <!-- Datos Generales -->
    <div class="space-y-4 rounded-md border p-4">
      <h4 class="text-center text-lg">Datos Generales</h4>

      <SelectInput
        id="offer_store_id"
        label="Tienda"
        v-model="form.store_id"
        :options="stores.map((s) => ({ label: s.name, value: s.id }))"
      />

      <SelectMultiple
        id="offer_categories"
        label="Categorías"
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
        no-autocomplete
      />

      <TextInput
        id="offer_description"
        label="Descripción"
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
        no-autocomplete
      />
    </div>
    <!-- / Datos Generales -->

    <!-- Precios -->
    <div class="mt-2 space-y-4 rounded-md border p-4">
      <h4 class="text-center text-lg">Precios</h4>

      <TextInput
        id="offer_inversion_price"
        label="Precio Inversion"
        v-model="form.inversion_price"
        type="currency"
        :readonly="!isDeveloper"
      />
      {{ toCurrency((form.inversion_price ?? 0) * cupPrice, false) }} CUP

      <TextInput
        id="offer_provider_price"
        label="Precio Proveedor"
        v-model="form.provider_price"
        type="currency"
        :readonly="!isDeveloper"
      />
      {{ toCurrency((form.provider_price ?? 0) * cupPrice, false) }} CUP

      <TextInput
        id="offer_sell_price"
        label="Precio Venta (CUP)"
        :model-value="convertCUP.sell"
        @update:model-value="(v) => onUpdateCupConvert(v, 'sell')"
        type="currency"
        required
      />
      {{ form.sell_price ?? 0 }} USD &asymp; <b>{{ toCurrency(convertCUP.sell ?? 0) }}</b>

      <TextInput
        id="offer_discount_price"
        label="Precio Descuento (CUP)"
        :model-value="convertCUP.discount"
        @update:model-value="(v) => onUpdateCupConvert(v, 'discount')"
        type="currency"
      />
      {{ form.discount_price ?? 0 }} USD &asymp; <b>{{ toCurrency(convertCUP.discount ?? 0) }}</b>
    </div>
    <!-- / Precios -->

    <!-- Inventario -->
    <div class="mt-2 space-y-4 rounded-md border p-4">
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
    <div class="mt-2 space-y-4 rounded-md border p-4">
      <h4 class="text-center text-lg">Extra</h4>

      <TextInput
        id="offer_min_delivery_days"
        label="Entrega Mínima (Días)"
        v-model="form.min_delivery_days"
        type="number"
        :min="0"
      />

      <TextInput id="offer_views" label="Vistas" v-model="form.views" type="number" :min="0" />

      <TextInput
        id="offer_rating"
        label="Rating"
        v-model="form.rating"
        type="number"
        :min="0"
        :max="255"
      />

      <TextInput
        id="offer_wheight"
        label="Peso (Lbs)"
        v-model="form.weight"
        type="number"
        :step="0.01"
        :min="0"
        :max="255"
      />

      <TextInput
        id="offer_url"
        label="URL Remota"
        placeholder="https://shein.com/offer"
        v-model="form.remote_url"
        type="text"
        no-autocomplete
      />

      <TextInput
        id="offer_attributes"
        label="Atributos"
        v-model="attributes"
        type="textarea"
        :rows="5"
      />
    </div>
    <!-- / Extra -->

    <div class="sticky bottom-0 mt-4 bg-white p-2">
      <button class="btn-primary" type="submit">Guardar</button>
      <button class="btn" type="reset" @click="() => $emit('canceled')">Cancelar</button>
    </div>
  </form>
</template>
