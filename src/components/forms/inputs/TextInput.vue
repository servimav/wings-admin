<script setup lang="ts">
export interface Props {
  modelValue: string | number
  type: 'text' | 'number' | 'email' | 'tel' | 'password'
  required?: boolean
  id: string
  label?: string
  placeholder?: string
}

defineProps<Props>()
const $emit = defineEmits<{ (e: 'update:modelValue', v: string | number): void }>()

/**
 * validate
 * @param val
 */
function validate(val: string | number) {
  return true
}

/**
 * onChange
 * @param event
 */
function onChange(event: Event) {
  const value = (event.target as HTMLInputElement).value
  if (validate(value)) $emit('update:modelValue', value)
}
</script>

<template>
  <div>
    <label
      :for="id"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      v-if="label"
      >{{ label }}</label
    >
    <input
      @change="onChange"
      :value="modelValue"
      :type="type"
      :name="id"
      :id="id"
      :placeholder="placeholder"
      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      :required="required"
    />
  </div>
</template>
