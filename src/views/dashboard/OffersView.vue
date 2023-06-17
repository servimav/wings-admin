<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { useAppStore, useShopStore } from '@/stores'
import { useRoute } from 'vue-router'
import type { ShopOffer } from '@servimav/wings-services'
// Components
const FloatButton = defineAsyncComponent(() => import('@/components/buttons/FloatButton.vue'))
const OfferForm = defineAsyncComponent(() => import('@/components/forms/OfferForm.vue'))
const OfferSkeleton = defineAsyncComponent(() => import('@/components/skeleton/OfferSkeleton.vue'))
const OfferWidget = defineAsyncComponent(() => import('@/components/widgets/OfferWidget.vue'))
/**
 * -----------------------------------------
 *	composables
 * -----------------------------------------
 */
const $app = useAppStore()
const $route = useRoute()
const $shop = useShopStore()
/**
 * -----------------------------------------
 *	data
 * -----------------------------------------
 */
const loading = computed(() => $app.loading)
const offers = computed<ShopOffer[] | undefined>(() => {
  if (storeId.value) {
    // Check if store exists
    const store = $shop.stores.find((s) => s.id === storeId.value)
    return store && store.offers ? store.offers : []
  }
  return []
})

const showForm = ref(false)
const storeId = ref<number>()
/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

/**
 * getOffers
 */
async function getOffers() {
  if ($route.params.storeId) {
    storeId.value = Number($route.params.storeId)
    $app.toggleLoading(true)
    try {
      await $shop.getStoreOffers(storeId.value)
    } catch (error) {
      $app.axiosError(error)
    }
    $app.toggleLoading(false)
  }
}

/**
 * onFormCompleted
 * @param status
 */
function onFormCompleted(status: boolean) {
  if (status) {
    showForm.value = false
    getOffers()
  }
}

/**
 * onClickFloatButton
 */
function onClickFloatButton() {
  showForm.value = true
}

onBeforeMount(async () => {
  await getOffers()
})
</script>

<template>
  <div>
    <div v-if="showForm" class="p-4 border rounded-md">
      <OfferForm @completed="onFormCompleted" :store-id="storeId" />
    </div>

    <div class="grid grid-cols-2 gap-2" v-else-if="offers && offers.length">
      <OfferWidget
        v-for="(offer, offerKey) in offers"
        :key="`offer-${offer.id}-${offerKey}`"
        :data="offer"
      />
    </div>

    <div v-else-if="loading">
      <div class="grid grid-cols-2 gap-2">
        <OfferSkeleton :repeat="8" />
      </div>
    </div>

    <div v-else>Sin Datos que mostrar</div>
  </div>
  <FloatButton @click="onClickFloatButton" />
</template>
