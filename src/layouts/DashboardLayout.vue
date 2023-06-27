<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'
import DrawerLeft from '@/components/menus/DrawerLeft.vue'
import { useAppStore, useShopStore, useUserStore } from '@/stores'
import { initDropdowns } from 'flowbite'
// Components
const NavTop = defineAsyncComponent(() => import('@/components/menus/NavTop.vue'))
/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */
const $app = useAppStore()
const $shop = useShopStore()
const $user = useUserStore()

/**
 * -----------------------------------------
 *	Lifecycle
 * -----------------------------------------
 */
onBeforeMount(async () => {
  try {
    // Parallel requests
    Promise.all([$shop.getCategories(), $shop.getCurrencies(), $shop.getMyStores()])

    if ($user.auth_token) {
      await $user.geMe()
      // Init nav top dropdown
      setTimeout(() => {
        initDropdowns()
      }, 500)
    }
  } catch (error) {
    $app.axiosError(error)
  }
})
</script>

<template>
  <div class="relative min-h-screen text-slate-700">
    <NavTop />
    <DrawerLeft />
    <main>
      <RouterView />
    </main>
  </div>
</template>
