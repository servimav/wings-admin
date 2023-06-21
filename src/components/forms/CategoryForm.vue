<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import type { ShopCategory, ShopCategoryCreate } from '@servimav/wings-services'
import { useAppStore, useShopStore } from '@/stores'
import { useServices } from '@/services'
// Types
export interface Emits {
  (e: 'canceled'): void
  (e: 'created', store: ShopCategory): void
  (e: 'updated', store: ShopCategory): void
}
export interface Props {
  update?: number
}
// Components
const TextInput = defineAsyncComponent(() => import('@/components/forms/inputs/TextInput.vue'))
const SelectInput = defineAsyncComponent(() => import('@/components/forms/inputs/SelectInput.vue'))

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */
const $app = useAppStore()
const $emit = defineEmits<Emits>()
const $props = defineProps<Props>()
const $service = useServices()
const $store = useShopStore()
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */
const categories = computed<ShopCategory[]>(() => $store.categories)
const form = ref<ShopCategoryCreate>({
  name: '',
  image: undefined,
  parent_id: undefined
})
/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

/**
 * saveDataOnStore
 * @param category
 */
function saveDataOnStore(category: ShopCategory) {
  const categoryIndex = categories.value.findIndex((c) => c.id === category.id)
  // Update Store
  if (categoryIndex >= 0) {
    $store.categories[categoryIndex] = category
  }
  // save new element
  else {
    $store.categories.push(category)
  }
}
/**
 * getCategory
 * @param id
 */
async function getCategory(id: number) {
  $app.toggleLoading(true)
  try {
    const category = (await $service.shop.category.show(id)).data
    form.value = {
      name: category.name,
      parent_id: category.parent?.id
    }
  } catch (error) {
    $app.axiosError(error)
  }
  $app.toggleLoading(false)
}

/**
 * handle onSubmit event
 */
async function onSubmit() {
  $app.toggleLoading(true)
  try {
    // Check if is update request
    if ($props.update) {
      const updateResp = (await $service.shop.category.update($props.update, form.value)).data
      saveDataOnStore(updateResp)
      $emit('updated', updateResp)
    }
    // Is create reequest
    else {
      const createResp = (await $service.shop.category.create(form.value)).data
      saveDataOnStore(createResp)
      $emit('created', createResp)
    }
  } catch (error) {
    $app.axiosError(error)
  }
  $app.toggleLoading(false)
}

onBeforeMount(async () => {
  if ($props.update) {
    await getCategory($props.update)
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-2">
    <TextInput id="category_name" v-model="form.name" required label="Nombre" type="text" />

    <TextInput id="category_image" v-model="form.image" label="Imagen" type="text" />

    <SelectInput
      :options="categories.map((c) => ({ label: c.name, value: c.id }))"
      id="category_parent"
      v-model="form.parent_id"
      label="Pertenece A"
    />

    <div class="mt-4">
      <button class="btn-primary py-1" type="submit">Guardar</button>
      <button class="btn py-1" type="reset" @click="() => $emit('canceled')">Cancelar</button>
    </div>
  </form>
</template>
