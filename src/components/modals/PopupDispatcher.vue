<script setup lang="ts">
export interface Props {
  id: string
}

defineProps<Props>()
</script>

<template>
  <button
    :data-modal-target="id"
    :data-modal-toggle="id"
    class="block rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    type="button"
  >
    Toggle modal
  </button>
</template>
