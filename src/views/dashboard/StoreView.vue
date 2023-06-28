<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ShopStore } from '@servimav/wings-services'
import { setDefaultImage } from '@/helpers'
import { useShopStore } from '@/stores'
import { ROUTE_NAME } from '@/router'
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const StoreForm = defineAsyncComponent(() => import('@/components/forms/StoreForm.vue'))

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */
const $route = useRoute()
const $router = useRouter()
const $shop = useShopStore()
/**
 * -----------------------------------------
 *	data
 * -----------------------------------------
 */
const showForm = ref(false)
const store = computed<ShopStore | undefined>(() => {
  const storeId = $route.params.storeId
  return $shop.stores.find((s) => s.id === Number(storeId))
})

/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */
/**
 * goToOffers
 */
function goToOffers() {
  void $router.push({
    name: ROUTE_NAME.STORE_OFFERS,
    params: {
      storeId: (store.value as ShopStore).id
    }
  })
}
/**
 * onEditStoreClick
 */
function onEditStoreClick() {
  showForm.value = true
}
/**
 * onStoreUpdated
 * @param update
 */
function onStoreUpdated(update: ShopStore) {
  const storeIndex = $shop.stores.findIndex((s) => s.id === update.id)
  if (storeIndex >= 0) {
    $shop.stores[storeIndex] = update
  }
  showForm.value = false
}
</script>

<template>
  <!-- Store Form -->
  <div v-if="showForm" class="rounded-md border p-4">
    <StoreForm :update="store" @updated="onStoreUpdated" />
  </div>
  <!-- / Store Form -->

  <section v-else-if="store" class="p-2">
    <!-- Image -->
    <div class="relative mt-2 rounded-md bg-slate-100 p-4">
      <img
        :src="store.image ?? '/images/default.png'"
        :alt="store.name"
        :title="store.name"
        @error="setDefaultImage"
      />

      <div class="absolute bottom-1 right-1 z-10">
        <div
          class="rounded-full border p-2 text-sm shadow-sm"
          :class="
            store.available
              ? 'border-green-300 bg-green-500 text-white'
              : 'border-slate-400 bg-slate-300 text-black'
          "
        >
          {{ store.available ? 'Abierta' : 'Cerrada' }}
        </div>
      </div>
    </div>
    <!-- / Image -->

    <div class="rounded-md border p-2">
      <div class="space-y-1">
        <h2 class="text-center text-xl font-bold">{{ store.name }}</h2>
        <p class="font-semibold" :class="store.available ? 'text-green-700' : 'text-slate-600'">
          {{ store.available ? 'Abierta' : 'Cerrada' }}
        </p>
        <p class="font-semibold">Descripción</p>
        <p class="text-justify text-sm">{{ store.description }}</p>
        <p class="font-semibold">Dirección</p>
        <p class="text-justify text-sm">{{ store.address }}</p>
      </div>
      <div class="mt-4">
        <button class="btn-primary px-2 py-1" @click="onEditStoreClick">Editar</button>
        <button class="btn border-primary-500 px-2 py-1 text-primary-500" @click="goToOffers">
          Ofertas
        </button>
      </div>
    </div>
  </section>
</template>
