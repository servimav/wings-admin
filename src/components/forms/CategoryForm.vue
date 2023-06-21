<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount, ref } from 'vue'
import type { ShopCategory } from '@servimav/wings-services'
import { useAppStore, useShopStore } from '@/stores'
import { useServices } from '@/services'
// Types
export interface Emits {
  (e: 'canceled'): void
  (e: 'created', store: ShopCategory): void
  (e: 'updated', store: ShopCategory): void
}
export interface Props {
  update?: ShopCategory
}
// Components
const TextInput = defineAsyncComponent(() => import('@/components/forms/inputs/TextInput.vue'))

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
const form = ref<ShopCategory>({
  id: 0,
  name: ''
})

async function onSubmit() {
  $app.toggleLoading(true)
  try {
    // Check if is update
    if ($props.update) {
      const updateResp = await $service.shop.category.update($props.update.id, form.value)
    }
  } catch (error) {}
  $app.toggleLoading(false)
}

onBeforeMount(() => {
  if ($props.update) {
    form.value = {
      ...$props.update
    }
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <TextInput id="category_name" v-model="form.name" required label="Categoria" type="text" />

    <div class="mt-4">
      <button class="btn-primary" type="submit">Guardar</button>
      <button class="btn" type="reset" @click="() => $emit('canceled')">Cancelar</button>
    </div>
  </form>
</template>
