<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { ALL_STATUS, readableStatus } from '@servimav/wings-services'
import type { ShopOrder, ShopOrderUpdate } from '@servimav/wings-services'
import { useAppStore } from '@/stores'
import { useServices } from '@/services'

// Types
export interface Emits {
  (e: 'canceled'): void
  (e: 'updated', order: ShopOrder): void
}
export interface Props {
  order: ShopOrder
}

export interface LabelValue {
  label: string
  value: string
}
// Components
const SelectInput = defineAsyncComponent(() => import('@/components/forms/inputs/SelectInput.vue'))
const TextInput = defineAsyncComponent(() => import('@/components/forms/inputs/TextInput.vue'))
/**
 * ------------------------------------------
 *	Composables
 * ------------------------------------------
 */
const $app = useAppStore()
const $emit = defineEmits<Emits>()
const $props = defineProps<Props>()
const $service = useServices()
/**
 * ------------------------------------------
 *	Data
 * ------------------------------------------
 */

const form = ref<ShopOrderUpdate>({
  currency: 'CUP',
  delivery_date: undefined,
  delivery_status: undefined
})

const loading = computed(() => $app.loading)

/**
 * ------------------------------------------
 *	Methods
 * ------------------------------------------
 */
/**
 * onSubmit
 */
async function onSubmit() {
  if (loading.value) return

  $app.toggleLoading(true)

  try {
    const { data } = await $service.shop.order.update($props.order.id, form.value)
    $emit('updated', data)
  } catch (error) {
    $app.axiosError(error)
  }
  $app.toggleLoading(false)
}

function convertDateFormat(input?: string) {
  if (input) {
    const date = new Date(input)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // JavaScript months are 0-based
    const year = date.getFullYear()
    return year + '-' + month + '-' + day
  }
}

onBeforeMount(() => {
  form.value = {
    currency: 'CUP',
    delivery_date: convertDateFormat($props.order.delivery_date),
    delivery_status: $props.order.delivery_status
  }

  console.log({
    form: form.value
  })
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="rounded-md bg-white p-4">
    <div class="space-y-4">
      <!-- Status -->
      <SelectInput
        v-model="form.delivery_status"
        :options="
          ALL_STATUS.map((status) => ({
            label: readableStatus(status),
            value: status
          }))
        "
        label="Estado"
        id="status-order"
      />
      <!-- / Status -->

      <!-- Delivery date -->
      <TextInput
        v-model="form.delivery_date"
        id="delivery-date"
        type="date"
        label="Fecha de Entrega"
      />
      <!-- / Delivery date -->
    </div>

    <div class="sticky bottom-0 mt-4">
      <button class="btn-primary px-2 py-1.5" type="submit">Guardar</button>
      <button class="btn px-2 py-1.5" type="reset" @click="() => $emit('canceled')">
        Cancelar
      </button>
    </div>
  </form>
</template>
