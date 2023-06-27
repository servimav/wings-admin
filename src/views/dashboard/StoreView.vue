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
  <div v-if="showForm" class="p-4 border rounded-md">
    <StoreForm :update="store" @updated="onStoreUpdated" />
  </div>
  <!-- / Store Form -->

  <section v-else-if="store" class="p-2">
    <!-- Image -->
    <div class="p-4 rounded-md bg-slate-100 mt-2 relative">
      <img
        :src="store.image ?? '/images/default.png'"
        :alt="store.name"
        :title="store.name"
        @error="setDefaultImage"
      />

      <div class="absolute bottom-1 right-1 z-10">
        <div
          class="rounded-full shadow-sm border p-2 text-sm"
          :class="
            store.available
              ? 'bg-green-500 text-white border-green-300'
              : 'bg-slate-300 text-black border-slate-400'
          "
        >
          {{ store.available ? 'Abierta' : 'Cerrada' }}
        </div>
      </div>
    </div>
    <!-- / Image -->

    <div class="border rounded-md p-2">
      <div class="space-y-1">
        <h2 class="text-xl text-center font-bold">{{ store.name }}</h2>
        <p class="font-semibold" :class="store.available ? 'text-green-700' : 'text-slate-600'">
          {{ store.available ? 'Abierta' : 'Cerrada' }}
        </p>
        <p class="font-semibold">Descripción</p>
        <p class="text-sm text-justify">{{ store.description }}</p>
        <p class="font-semibold">Dirección</p>
        <p class="text-sm text-justify">{{ store.address }}</p>
      </div>
      <div class="mt-4">
        <button class="btn-primary py-1 px-2" @click="onEditStoreClick">Editar</button>
        <button class="btn border-primary-500 text-primary-500 py-1 px-2" @click="goToOffers">
          Ofertas
        </button>
      </div>
    </div>
  </section>
</template>
