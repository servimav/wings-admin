<script setup lang="ts">
export interface Props {
  modelValue?: string | number
  required?: boolean
  id: string
  label?: string
  options: Array<{ label: string; value: string | number }>
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
    <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
      label
    }}</label>
    <select
      :id="id"
      @change="onChange"
      :value="modelValue"
      :name="id"
      :required="required"
      class="bg-gray-50 border border-primary-300 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-primary-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
    >
      <option v-for="(option, key) in options" :key="`option-${key}`" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
