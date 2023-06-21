<script setup lang="ts">
import { useAppStore, useShopStore } from '@/stores'
import { computed } from 'vue'
/**
 * -----------------------------------------
 *	Composable
 * -----------------------------------------
 */
const $app = useAppStore()
const $shop = useShopStore()
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const categories = computed(() => $shop.categories)
</script>

<template>
  <div class="p-2">
    <h2 class="text-2xl text-center">Categorias</h2>

    <div class="mt-4 rounded border p-2">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(category, categoryKey) in categories"
          :key="`category-${categoryKey}-${category.id}`"
          class="py-1 px-2 text-sm rounded-full border bg-slate-100 cursor-pointer hover:bg-primary-300 hover:text-white focus:ring-4 focus:ring-primary-300"
        >
          {{ category.name }}
        </div>
      </div>
    </div>
  </div>
</template>
