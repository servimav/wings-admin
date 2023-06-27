<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { useShopStore } from '@/stores'
import type { ShopCategory } from '@servimav/wings-services'
// Components
const CategoryForm = defineAsyncComponent(() => import('@/components/forms/CategoryForm.vue'))
/**
 * -----------------------------------------
 *	Composable
 * -----------------------------------------
 */
const $shop = useShopStore()
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */

const categories = computed(() => $shop.categories)
const selectedCategory = ref<ShopCategory>()
const showForm = ref(false)
/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

function onClickCategory(category: ShopCategory) {
  selectedCategory.value = category
  showForm.value = true
}
function onClickNewCategory() {
  selectedCategory.value = undefined
  showForm.value = true
}

function onCreatedCategory() {
  showForm.value = false
  selectedCategory.value = undefined
}

function onUpdatedCategory() {
  showForm.value = false
  selectedCategory.value = undefined
}
</script>

<template>
  <section class="p-2">
    <h2 class="text-2xl text-center">Categorías</h2>

    <div class="mt-4 rounded-md border p-4" v-if="showForm">
      <CategoryForm
        :update="selectedCategory?.id"
        @canceled="onCreatedCategory"
        @created="onCreatedCategory"
        @updated="onUpdatedCategory"
      />
    </div>

    <div class="mt-4 rounded border p-2" v-else>
      <div class="flex flex-wrap gap-2">
        <div
          @click="onClickNewCategory"
          class="py-1 px-2 text-sm rounded-full border bg-primary-100 cursor-pointer hover:bg-primary-300 hover:text-white focus:ring-4 focus:ring-primary-300"
        >
          Crear Nueva
        </div>
        <div
          v-for="(category, categoryKey) in categories"
          :key="`category-${categoryKey}-${category.id}`"
          @click="() => onClickCategory(category)"
          class="py-1 px-2 text-sm rounded-full border bg-slate-100 cursor-pointer hover:bg-primary-300 hover:text-white focus:ring-4 focus:ring-primary-300"
        >
          {{ category.name }}
        </div>
      </div>
    </div>
  </section>
</template>
