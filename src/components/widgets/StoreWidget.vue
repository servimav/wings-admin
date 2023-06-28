<script setup lang="ts">
import { setDefaultImage } from '@/helpers'
import type { ShopStore } from '@servimav/wings-services'

export interface Props {
  data: ShopStore
}

defineProps<Props>()
</script>

<template>
  <div
    class="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="relative bg-slate-100 p-2">
      <img
        class="rounded-t-lg"
        :src="data.image ?? '/images/default.png'"
        :alt="data.name"
        :title="data.name"
        @error="setDefaultImage"
      />

      <div class="absolute bottom-1 right-1 z-10">
        <div
          class="rounded-full border p-1 text-xs shadow-md"
          :class="
            data.available
              ? 'border-green-300 bg-green-500 text-white'
              : 'border-slate-400 bg-slate-300 text-black'
          "
        >
          {{ data.available ? 'Abierto' : 'Cerrado' }}
        </div>
      </div>
    </div>
    <div class="p-2">
      <h5 class="text-sm text-gray-900 dark:text-white">{{ data.name }}</h5>
    </div>
  </div>
</template>
