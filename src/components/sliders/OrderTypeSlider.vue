<script setup lang="ts">
import { STATUS } from '@servimav/wings-services'

interface Emit {
  (e: 'update:modelValue', v: STATUS): void
}

interface Prop {
  modelValue: STATUS
}

const $emit = defineEmits<Emit>()
defineProps<Prop>()

const allStatus: STATUS[] = [
  STATUS.CREATED, // created
  STATUS.ACCEPTED, // payed
  STATUS.ONPROGRESS, // onprogress
  // STATUS.CANCELED_BY_CLIENT,
  STATUS.CANCELED_BY_PROVIDER, // canceled
  STATUS.COMPLETED, // completed
  STATUS.UNKNOWN
]

function setActive(status: STATUS) {
  $emit('update:modelValue', status)
}

function statusLabel(status: STATUS) {
  switch (status) {
    case STATUS.CREATED:
      return 'Creado'
    case STATUS.ACCEPTED:
      return 'Pagado'
    case STATUS.ONPROGRESS:
      return 'Envio'
    case STATUS.COMPLETED:
      return 'Completado'
    case STATUS.UNKNOWN:
      return 'Desconocido'
    default:
      return 'Cancelado'
  }
}
</script>

<template>
  <div class="no-scrollbar flex items-center space-x-3 overflow-x-scroll px-3 py-2">
    <div
      v-for="(status, index) in allStatus"
      :key="`status-slider-${index}`"
      @click="() => setActive(status)"
      :class="[
        'cursor-pointer rounded-full px-3 py-2 text-center text-sm transition-colors',
        status === modelValue ? 'bg-primary text-white' : ''
      ]"
    >
      {{ statusLabel(status) }}
    </div>
  </div>
</template>

<style scoped>
ul::-webkit-scrollbar {
  display: none;
}
</style>
