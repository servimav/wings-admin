<script setup lang="ts">
import { ALL_STATUS, readableStatus, type STATUS } from '@servimav/wings-services'

interface Emit {
  (e: 'update:modelValue', v: STATUS): void
}

interface Prop {
  modelValue: STATUS
}

const $emit = defineEmits<Emit>()
defineProps<Prop>()

function setActive(status: STATUS) {
  $emit('update:modelValue', status)
}
</script>

<template>
  <div class="no-scrollbar flex items-center space-x-3 overflow-x-scroll px-3 py-1">
    <div
      v-for="(status, index) in ALL_STATUS"
      :key="`status-slider-${index}`"
      @click="() => setActive(status)"
      :class="[
        'cursor-pointer rounded-full px-3 py-2 text-center text-sm transition-colors',
        status === modelValue ? 'bg-primary text-white' : ''
      ]"
    >
      {{ readableStatus(status) }}
    </div>
  </div>
</template>

<style scoped>
ul::-webkit-scrollbar {
  display: none;
}
</style>
