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
    class="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-primary-300 bg-white text-primary-500 shadow-sm hover:bg-primary-500 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-700"
  >
    <component :is="icon" class="h-6 w-6" />
    <span class="sr-only">{{ label }}</span>
  </button>

  <div
    :id="`tooltip-${id}`"
    role="tooltip"
    class="tooltip invisible absolute z-10 inline-block w-auto rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
  >
    {{ label }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
</template>
