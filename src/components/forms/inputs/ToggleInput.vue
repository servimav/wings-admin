<script setup lang="ts">
export interface Props {
  modelValue: boolean
  color: string
  label: string
  id: string
}

const $props = defineProps<Props>()
const $emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

function onClick() {
  $emit('update:modelValue', !$props.modelValue)
}
</script>

<template>
  <label :for="id" class="relative inline-flex cursor-pointer items-center">
    <input
      :id="id"
      type="checkbox"
      value=""
      class="peer sr-only"
      @click="onClick"
      :checked="modelValue"
    />
    <div
      class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-primary-700"
    ></div>
    <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{{ label }}</span>
  </label>
</template>
