<script setup lang="ts">
import type { ShopStore } from '@servimav/wings-services'

export interface Props {
  data: ShopStore
}

defineProps<Props>()
</script>

<template>
  <div
    class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="p-2 bg-slate-100">
      <img class="rounded-t-lg" src="../../assets/logo.svg" alt="product image" />
    </div>
    <div class="p-2">
      <h5 class="text-sm text-gray-900 dark:text-white">{{ data.name }}</h5>
    </div>
  </div>
</template>
