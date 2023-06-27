<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

export interface Emit {
  (e: 'update:modelValue', v: boolean): void
}
export interface Prop {
  modelValue: boolean
}
const DotsIcon = defineAsyncComponent(() => import('@/components/icons/HorizontalDots.vue'))

const $emit = defineEmits<Emit>()
defineProps<Prop>()
</script>

<template>
  <div class="fixed right-6 bottom-6 group">
    <div
      id="speed-dial-menu-default"
      class="flex flex-col items-center mb-4 space-y-2"
      :class="{ hidden: !modelValue }"
    >
      <slot />
    </div>
    <button
      type="button"
      @click.prevent="() => $emit('update:modelValue', !modelValue)"
      class="flex items-center justify-center text-white bg-primary-500 rounded-full w-14 h-14 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 focus:outline-none"
    >
      <DotsIcon
        class="w-8 h-8 transition-transform"
        :class="{ 'group-hover:rotate-90': modelValue }"
      />
      <span class="sr-only">Open actions menu</span>
    </button>
  </div>
</template>
