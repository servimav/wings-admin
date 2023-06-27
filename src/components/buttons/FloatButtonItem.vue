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
    class="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200 dark:border-gray-600 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
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
