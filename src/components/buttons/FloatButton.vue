<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const IconPlus = defineAsyncComponent(() => import('@/components/icons/PlusIcon.vue'))
</script>

<template>
  <div
    role="button"
    class="rounded-full fixed bottom-6 right-4 p-4 bg-primary-300 border-black hover:bg-primary-500 hover:shadow-lg text-black dark:text-white"
  >
    <IconPlus class="h-6 w-6" />
  </div>
</template>
