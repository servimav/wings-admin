<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import type { ShopOfferFilter } from '@servimav/wings-services'
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
  store_id: undefined
})
const stores = computed(() => $shop.stores)
/**
 * -----------------------------------------
 *	methods
 * -----------------------------------------
 */

/**
 * onSubmit
 */
function onSubmit() {
  if (!form.value.category_id) form.value.category_id = undefined
  if (!form.value.currency) form.value.currency = undefined
  if (!form.value.search) form.value.search = undefined
  if (!form.value.sort) form.value.sort = undefined
  if (!form.value.store_id) form.value.store_id = undefined

  $emit('search', form.value)
}

function reset() {
  form.value = {
    category_id: undefined,
    currency: undefined,
    search: undefined,
    sort: undefined,
    store_id: undefined
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

      <div class="space-y-2 mt-2">
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
      </div>

      <div class="mt-4">
        <button type="submit" class="btn-primary py-1 px-2.5">Buscar</button>
        <button type="reset" @click.prevent="reset" class="btn py-1 px-2.5">Reiniciar</button>
        <button type="reset" @click="() => $emit('close')" class="btn py-1 px-2.5">Cancelar</button>
      </div>
    </div>
  </form>
</template>
