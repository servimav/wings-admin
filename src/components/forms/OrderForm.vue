<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { STATUS, type ShopOrder, type ShopOrderUpdate } from '@servimav/wings-services'
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

const status: LabelValue[] = [
  {
    value: STATUS.CREATED,
    label: 'Creado'
  },
  {
    value: STATUS.ACCEPTED,
    label: 'Pagado'
  },
  {
    value: STATUS.CANCELED_BY_PROVIDER,
    label: 'Cancelado'
  },
  {
    value: STATUS.ONPROGRESS,
    label: 'En Camino'
  },
  {
    value: STATUS.COMPLETED,
    label: 'Completado'
  },
  {
    value: STATUS.UNKNOWN,
    label: 'Desconocido'
  }
]

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
  <form @submit.prevent="onSubmit">
    <div class="space-y-4 rounded-md border p-4">
      <SelectInput
        v-model="form.delivery_status"
        :options="status"
        label="Estado"
        id="status-order"
      />

      <TextInput
        v-model="form.delivery_date"
        id="delivery-date"
        type="date"
        label="Fecha de Entrega"
      />
    </div>

    <div class="sticky bottom-0 mt-4 bg-white p-2">
      <button class="btn-primary" type="submit">Guardar</button>
      <button class="btn" type="reset" @click="() => $emit('canceled')">Cancelar</button>
    </div>
  </form>
</template>
