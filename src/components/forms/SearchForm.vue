<script setup lang="ts">
export interface Emit {
  (e: 'update:modelValue', value?: string): void
  (e: 'search'): void
  (e: 'restart'): void
}
const $props = defineProps<{ modelValue?: string }>()

const $emit = defineEmits<Emit>()

function onInputChange(e: Event) {
  e.preventDefault()
  const target = e.target as HTMLInputElement
  $emit('update:modelValue', target.value)
}

function onSubmit() {
  if ($props.modelValue) $emit('search')
  else $emit('restart')
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="relative">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <svg
        aria-hidden="true"
        class="w-5 h-5 text-gray-500 dark:text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
    </div>
    <input
      type="search"
      id="default-search"
      :value="modelValue"
      @change="onInputChange"
      class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
      placeholder="Buscar..."
    />
    <button
      type="submit"
      class="text-white absolute right-2.5 bottom-2.5 bg-primary-500 hover:bg-primary-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-500 dark:hover:bg-primary-500 dark:focus:ring-primary-500"
    >
      Search
    </button>
  </form>
</template>
