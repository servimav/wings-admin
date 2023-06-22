<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { useAppStore, useShopStore } from '@/stores'
import { useRouter } from 'vue-router'
import { ROUTE_NAME } from '@/router'
// Components
const FloatButton = defineAsyncComponent(() => import('@/components/buttons/FloatButton.vue'))
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
 * goToStoreOffers
 * @param storeId
 */
function goToStoreOffers(storeId: number) {
  void $router.push({
    name: ROUTE_NAME.STORE_OFFERS,
    params: { storeId }
  })
}

/**
 * onClickFloatButton
 */
function onClickFloatButton() {
  showForm.value = true
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
  <div class="p-2">
    <div v-if="showForm" class="p-4 border rounded-md">
      <StoreForm @created="onStoreCreated" />
    </div>

    <div class="grid grid-cols-2 gap-2" v-else-if="stores && stores.length > 0">
      <StoreWidget
        v-for="(store, storekey) in stores"
        :key="`store-${store.id}-${storekey}`"
        :data="store"
        @click="() => goToStoreOffers(store.id)"
        class="cursor-pointer"
      />
    </div>

    <div class="grid grid-cols-2 gap-2" v-else-if="loading">
      <StoreSkeleton :repeat="8" />
    </div>

    <div v-else>No Hay datos</div>
  </div>
  <FloatButton @click="onClickFloatButton" v-if="!showForm" />
</template>
