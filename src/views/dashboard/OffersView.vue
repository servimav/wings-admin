<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount, ref } from 'vue'
import type { ShopOffer } from '@servimav/wings-services'
import { useServices } from '@/services'
// Components
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
    <div class="grid grid-cols-2 gap-2">
      <OfferWidget v-for="(offer, offerKey) in offers" :key="`offer-${offer.id}-${offerKey}`" />
    </div>
  </div>
</template>
