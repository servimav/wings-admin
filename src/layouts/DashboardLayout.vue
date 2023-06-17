<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'
import DrawerLeft from '@/components/menus/DrawerLeft.vue'
import { useAppStore, useShopStore } from '@/stores'
// Components
const NavTop = defineAsyncComponent(() => import('@/components/menus/NavTop.vue'))
/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */
const $app = useAppStore()
const $shop = useShopStore()

/**
 * -----------------------------------------
 *	Lifecycle
 * -----------------------------------------
 */
onBeforeMount(async () => {
  try {
    await $shop.getMyStores()
  } catch (error) {
    $app.axiosError(error)
  }
})
</script>

<template>
  <div class="relative min-h-screen text-slate-700">
    <NavTop />
    <DrawerLeft />
    <div class="p-2">
      <RouterView />
    </div>
  </div>
</template>
