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
  <div class="group fixed bottom-6 right-6">
    <div
      id="speed-dial-menu-default"
      class="mb-4 flex flex-col items-center space-y-2"
      :class="{ hidden: !modelValue }"
    >
      <slot />
    </div>
    <button
      type="button"
      @click.prevent="() => $emit('update:modelValue', !modelValue)"
      class="flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300"
    >
      <DotsIcon
        class="h-8 w-8 transition-transform"
        :class="{ 'group-hover:rotate-90': modelValue }"
      />
      <span class="sr-only">Open actions menu</span>
    </button>
  </div>
</template>
