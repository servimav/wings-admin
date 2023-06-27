<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

export interface Emit {
  (e: 'click'): void
}
export interface Prop {
  icon: typeof IconPlus
  label: string
  id: string
}
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const IconPlus = defineAsyncComponent(() => import('@/components/icons/PlusIcon.vue'))
/**
 * -----------------------------------------
 *	composables
 * -----------------------------------------
 */
defineProps<Prop>()
const $emit = defineEmits<Emit>()
</script>

<template>
  <button
    type="button"
    @click.prevent="() => $emit('click')"
    :data-tooltip-target="`tooltip-${id}`"
    data-tooltip-placement="left"
    class="flex justify-center items-center w-[52px] h-[52px] text-primary-500 hover:text-white bg-white rounded-full border border-primary-300 shadow-sm hover:bg-primary-500 focus:ring-4 focus:ring-gray-700 focus:outline-none"
  >
    <component :is="icon" class="w-6 h-6" />
    <span class="sr-only">{{ label }}</span>
  </button>

  <div
    :id="`tooltip-${id}`"
    role="tooltip"
    class="absolute z-10 invisible inline-block w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
  >
    {{ label }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
</template>
