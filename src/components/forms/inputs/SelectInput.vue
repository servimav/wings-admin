<script setup lang="ts">
export interface Props {
  modelValue?: string | number
  required?: boolean
  id: string
  label?: string
  options: Array<{ label: string; value: string | number }>
  placeholder?: string
}

defineProps<Props>()
const $emit = defineEmits<{ (e: 'update:modelValue', v: string | number): void }>()

function onChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  $emit('update:modelValue', value)
}
</script>

<template>
  <div>
    <label :for="id" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">{{
      label
    }}</label>
    <select
      :id="id"
      @change="onChange"
      :value="modelValue"
      :name="id"
      :required="required"
      :placeholder="placeholder"
      class="dark:border-primary-600 block w-full rounded-lg border border-primary-300 bg-gray-50 p-2.5 text-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
    >
      <option v-for="(option, key) in options" :key="`option-${key}`" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
