<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount, ref } from 'vue'
import type { ShopOffer } from '@servimav/wings-services'
import { useServices } from '@/services'
// Components
const FloatButton = defineAsyncComponent(() => import('@/components/buttons/FloatButton.vue'))
const OfferForm = defineAsyncComponent(() => import('@/components/forms/OfferForm.vue'))
const OfferWidget = defineAsyncComponent(() => import('@/components/widgets/OfferWidget.vue'))
/**
 * -----------------------------------------
 *	composables
 * -----------------------------------------
 */
const $services = useServices()
/**
 * -----------------------------------------
 *	data
 * -----------------------------------------
 */
const offers = ref<ShopOffer[]>([])
const showForm = ref(false)
/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

function onClickFloatButton() {
  showForm.value = true
}

onBeforeMount(async () => {
  try {
    const resp = await $services.shop.offer.list()
    offers.value = resp.data.data
  } catch (error) {
    console.log({ error })
  }
})
</script>

<template>
  <div>
    <div v-if="showForm" class="p-4 border rounded-md">
      <OfferForm />
    </div>

    <div class="grid grid-cols-2 gap-2" v-else>
      <OfferWidget v-for="(offer, offerKey) in offers" :key="`offer-${offer.id}-${offerKey}`" />
    </div>
  </div>
  <FloatButton @click="onClickFloatButton" />
</template>
