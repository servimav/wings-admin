<script setup lang="ts">
import { computed } from 'vue'

export interface Props {
  modelValue?: string | number
  type:
    | 'text'
    | 'number'
    | 'email'
    | 'tel'
    | 'password'
    | 'textarea'
    | 'currency'
    | 'search'
    | 'date'
  required?: boolean
  id: string
  label?: string
  placeholder?: string
  rows?: number
  min?: number
  max?: number
  step?: number
  noAutocomplete?: boolean
  readonly?: boolean
}

const $props = defineProps<Props>()
const $emit = defineEmits<{ (e: 'update:modelValue', v: string | number): void }>()

const realType = computed(() => ($props.type === 'currency' ? 'number' : $props.type))
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
  let value = (event.target as HTMLInputElement).value
  if ($props.type === 'currency') value = Number(value).toFixed(2)
  if (validate(value)) $emit('update:modelValue', value)
}
</script>

<template>
  <div>
    <label
      :for="id"
      class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      v-if="label"
      >{{ label }}</label
    >

    <textarea
      v-if="type === 'textarea'"
      @change="onChange"
      :value="modelValue"
      :name="id"
      :id="id"
      :placeholder="placeholder"
      :rows="rows"
      :required="required"
      :readonly="readonly"
      class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
    ></textarea>

    <input
      v-else
      @change="onChange"
      :value="modelValue"
      :type="realType"
      :name="id"
      :id="id"
      :placeholder="placeholder"
      :autocomplete="noAutocomplete ? 'nofill' : undefined"
      class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
      :required="required"
      :min="min"
      :max="max"
      :step="type === 'currency' ? '0.01' : step"
    />
  </div>
</template>
