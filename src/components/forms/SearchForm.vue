<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { STOCK_TYPE, type ShopOfferFilter } from '@servimav/wings-services'
import { useShopStore } from '@/stores'
/**
 * -----------------------------------------
 *	Types
 * -----------------------------------------
 */
export interface Emit {
  (e: 'search', v: ShopOfferFilter): void
  (e: 'close'): void
}

export interface Prop {
  filter?: ShopOfferFilter
}
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const SelectInput = defineAsyncComponent(() => import('@/components/forms/inputs/SelectInput.vue'))
const TextInput = defineAsyncComponent(() => import('@/components/forms/inputs/TextInput.vue'))
const ToggleInput = defineAsyncComponent(() => import('@/components/forms/inputs/ToggleInput.vue'))
/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */
const $emit = defineEmits<Emit>()
const $props = defineProps<Prop>()
const $shop = useShopStore()
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const categories = computed(() => $shop.categories)
const form = ref<ShopOfferFilter>({
  category_id: undefined,
  currency: 'CUP',
  search: undefined,
  sort: 'views',
  store_id: undefined,
  stock: undefined
})
const incomming = ref<boolean>(false)
const stores = computed(() => $shop.stores)
/**
 * -----------------------------------------
 *	methods
 * -----------------------------------------
 */
/**
 * onChangeIncomming
 * @param v
 */
function onChangeIncomming(v: boolean) {
  if (v) {
    form.value.stock = STOCK_TYPE.INCOMMING
    console.log('setForm', form.value.stock)
  } else form.value.stock === undefined

  incomming.value = v
}
/**
 * onSubmit
 */
function onSubmit() {
  if (!form.value.category_id) form.value.category_id = undefined
  if (!form.value.currency) form.value.currency = undefined
  if (!form.value.search) form.value.search = undefined
  if (!form.value.sort) form.value.sort = undefined
  if (!form.value.store_id) form.value.store_id = undefined
  if (!form.value.stock) form.value.stock = undefined

  $emit('search', form.value)
}

function reset() {
  form.value = {
    category_id: undefined,
    currency: undefined,
    search: undefined,
    sort: undefined,
    store_id: undefined,
    stock: undefined
  }
}

onBeforeMount(() => {
  // init form
  if ($props.filter) form.value = $props.filter
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="p-2">
      <div class="text-center text-lg text-gray-800">Filtrar</div>

      <div class="mt-2 space-y-2">
        <TextInput v-model="form.search" id="search_form" type="search" placeholder="Buscar" />

        <SelectInput
          v-model="form.store_id"
          id="search_store"
          label="Tienda"
          :options="stores.map((s) => ({ label: s.name, value: s.id }))"
        />

        <SelectInput
          v-model="form.category_id"
          id="search_category"
          label="Categoria"
          :options="categories.map((c) => ({ label: c.name, value: c.id }))"
        />

        <div class="flex justify-between gap-2">
          <ToggleInput
            :model-value="incomming"
            @update:model-value="onChangeIncomming"
            label="Encargos"
            id="encargos-form"
            color="primary"
          />
        </div>
      </div>

      <div class="mt-4">
        <button type="submit" class="btn-primary px-2.5 py-1">Buscar</button>
        <button type="reset" @click.prevent="reset" class="btn px-2.5 py-1">Reiniciar</button>
        <button type="reset" @click="() => $emit('close')" class="btn px-2.5 py-1">Cancelar</button>
      </div>
    </div>
  </form>
</template>
