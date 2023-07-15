<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { useAppStore, useShopStore } from '@/stores'
import { useRouter } from 'vue-router'
import { ROUTE_NAME } from '@/router'
// Components
const StoreForm = defineAsyncComponent(() => import('@/components/forms/StoreForm.vue'))
const StoreSkeleton = defineAsyncComponent(() => import('@/components/skeleton/OfferSkeleton.vue'))
const StoreWidget = defineAsyncComponent(() => import('@/components/widgets/StoreWidget.vue'))
/**
 * -----------------------------------------
 *	composables
 * -----------------------------------------
 */
const $app = useAppStore()
const $router = useRouter()
const $shop = useShopStore()
/**
 * -----------------------------------------
 *	data
 * -----------------------------------------
 */
const loading = computed(() => $app.loading)
const stores = computed(() => $shop.stores)
const showForm = ref(false)
/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

/**
 * goToStore
 * @param storeId
 */
function goToStore(storeId: number) {
  void $router.push({
    name: ROUTE_NAME.STORE,
    params: { storeId }
  })
}

/**
 * handle Store Form created event
 */
function onStoreCreated() {
  showForm.value = false
}

onBeforeMount(async () => {
  $app.toggleLoading(true)
  try {
    await $shop.getMyStores()
  } catch (error) {
    $app.axiosError(error)
  }
  $app.toggleLoading(false)
})
</script>

<template>
  <section class="p-2">
    <div v-if="showForm" class="rounded-md border p-4">
      <StoreForm @created="onStoreCreated" />
    </div>

    <div class="grid grid-cols-2 gap-2" v-else-if="stores && stores.length > 0">
      <StoreWidget
        v-for="(store, storekey) in stores"
        :key="`store-${store.id}-${storekey}`"
        :data="store"
        @click="() => goToStore(store.id)"
        class="cursor-pointer"
      />
    </div>

    <div class="grid grid-cols-2 gap-2" v-else-if="loading">
      <StoreSkeleton :repeat="8" />
    </div>

    <div v-else>No Hay datos</div>
  </section>
</template>
