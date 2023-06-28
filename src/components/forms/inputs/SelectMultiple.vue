<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
// Types
export interface Emits {
  (e: 'update:modelValue', v: Array<string | number>): void
}
interface SelectOptions {
  label: string
  value: string | number
}
export interface Props {
  modelValue?: Array<string | number>
  required?: boolean
  id: string
  label?: string
  options: SelectOptions[]
}
// Components
const SelectInput = defineAsyncComponent(() => import('./SelectInput.vue'))
/**
 * -----------------------------------------
 *	composables
 * -----------------------------------------
 */
const $emits = defineEmits<Emits>()
const $props = defineProps<Props>()
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const availableOptions = computed<SelectOptions[]>(() => {
  const options: SelectOptions[] = $props.options

  return options
})

/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */
/**
 * onSelectUpdate
 * @param updateValue
 */
function onSelectUpdate(updateValue: string | number) {
  if ($props.modelValue) {
    const copy = $props.modelValue
    if (copy.includes(updateValue)) copy.splice(copy.indexOf(updateValue), 1)
    else copy.push(updateValue)
    $emits('update:modelValue', copy)
  }
}
</script>

<template>
  <div>
    <label :for="id" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">{{
      label
    }}</label>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(optionValue, optKey) in modelValue"
        :key="`value-${optKey}`"
        class="rounded-full border bg-slate-100 px-2 py-1 text-sm"
        :class="{ 'border-primary-500': optKey === 0 }"
        @click="() => onSelectUpdate(optionValue)"
      >
        {{
          options.find((opt) => opt.value == optionValue)
            ? options.find((opt) => opt.value == optionValue)?.label
            : 'Unkown'
        }}
      </div>
    </div>
    <SelectInput
      :id="id"
      :options="availableOptions"
      @update:model-value="onSelectUpdate"
      placeholder="Seleccione Categoria"
    />
  </div>
</template>
