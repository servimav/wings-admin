<script setup lang="ts">
import { scrollTop } from '@/helpers'
import { ROUTE_NAME } from '@/router'
import { useServices } from '@/services'
import { useAppStore, useShopStore } from '@/stores'
import type { ShopOffer, ShopOfferFilter, ShopStore } from '@servimav/wings-services'
import { defineAsyncComponent, ref, onBeforeMount, onMounted, onBeforeUnmount, computed } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const BaseModal = defineAsyncComponent(() => import('@/components/modals/BaseModal.vue'))
const FloatButton = defineAsyncComponent(() => import('@/components/buttons/FloatButton.vue'))
const FloatButtonItem = defineAsyncComponent(
  () => import('@/components/buttons/FloatButtonItem.vue')
)
const IconPlus = defineAsyncComponent(() => import('@/components/icons/PlusIcon.vue'))
const IconSearch = defineAsyncComponent(() => import('@/components/icons/MangifyGlass.vue'))
const OfferForm = defineAsyncComponent(() => import('@/components/forms/OfferForm.vue'))
const OfferSkeleton = defineAsyncComponent(() => import('@/components/skeleton/OfferSkeleton.vue'))
const OfferWidget = defineAsyncComponent(() => import('@/components/widgets/OfferWidget.vue'))
const SearchForm = defineAsyncComponent(() => import('@/components/forms/SearchForm.vue'))

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */
const $app = useAppStore()
const $route = useRoute()
const $router = useRouter()
const $service = useServices()
const $shop = useShopStore()
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */
const filter = ref<ShopOfferFilter>()
const loading = computed(() => $app.loading)
const offers = ref<ShopOffer[]>([])
const offersCurrentPage = ref<number>()
const scrollHandler = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  const scrolled = window.scrollY
  if (scrollable - scrolled <= 1) {
    filterOffers()
  }
}
const showFloatMenu = ref(false)
const showFilterModal = ref(false)
const showNewOfferModal = ref(false)
const store = ref<ShopStore>()

/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

/**
 * filterOffers
 * @param params
 */
async function filterOffers() {
  if (loading.value) return
  $app.toggleLoading(true)
  try {
    console.log({ filter: filter.value })
    const resp = (
      await $service.shop.offer.filterAdvanced({
        ...filter.value,
        page: offersCurrentPage.value ? offersCurrentPage.value + 1 : undefined
      })
    ).data
    offersCurrentPage.value = resp.meta.current_page
    if (resp.data.length) {
      // if is first search overwrite offers
      offers.value.push(...resp.data)
    } else {
      // Stop event listner
      window.removeEventListener('scroll', scrollHandler)
    }
  } catch (error) {
    $app.axiosError(error)
    window.removeEventListener('scroll', scrollHandler)
  }
  $app.toggleLoading(false)
}

/**
 * getStore
 * @param id
 */
async function getStore(storeId?: number) {
  if (storeId) {
    try {
      const resp = (await $service.shop.store.show(storeId)).data
      // update store
      const index = $shop.stores.findIndex((s) => s.id === storeId)
      if (index >= 0) {
        $shop.stores[index] = resp
      }
      // set current store
      store.value = resp
    } catch (error) {
      $app.axiosError(error)
    }
  }
}
/**
 * goToOffer
 * @param offer
 */
function goToOffer(offer: ShopOffer) {
  $router.push({
    name: ROUTE_NAME.OFFER,
    params: {
      offerId: offer.id
    }
  })
}

/**
 * onSearchOffer
 * @param search
 */
async function onSearchOffer(search: ShopOfferFilter) {
  // Srcoll to Top
  scrollTop()
  // restart listener
  window.removeEventListener('scroll', scrollHandler)
  // close modal
  showFilterModal.value = false
  // init search params
  filter.value = search
  offersCurrentPage.value = undefined
  offers.value = []
  // replace route
  void $router.replace({
    name: ROUTE_NAME.OFFERS,
    query: { ...search }
  })
  // run query
  await Promise.all([getStore(filter.value?.store_id), filterOffers()])
  window.addEventListener('scroll', scrollHandler)
}

/**
 * -----------------------------------------
 *	Lifecycle
 * -----------------------------------------
 */
/**
 * onBeforeMount
 */
onBeforeMount(async () => {
  // get query from route
  const filterQuery: ShopOfferFilter = $route.query
  // Check if route is STORE_OFFERS or OFFERS
  const routeName = $route.name
  if (routeName === ROUTE_NAME.STORE_OFFERS) {
    const storeId = Number($route.params.storeId)
    filterQuery.store_id = storeId
  }

  // init search params
  filter.value = filterQuery
  offersCurrentPage.value = undefined
  offers.value = []

  await Promise.all([getStore(filter.value?.store_id), filterOffers()])
})

/**
 * onMounted
 */
onMounted(() => {
  scrollTop()
  // register scroll event listener
  window.addEventListener('scroll', scrollHandler)
})

/**
 * onBeforeUnmount
 */
onBeforeUnmount(() => {
  // unregister scroll listener
  window.removeEventListener('scroll', scrollHandler)
})

/**
 * onBeforeRouteUpdate
 */
onBeforeRouteUpdate(async ($to, $from, $next) => {
  // get query from route
  const filterQuery: ShopOfferFilter = $to.query
  // Check if route is STORE_OFFERS or OFFERS
  const routeName = $to.name
  if (routeName === ROUTE_NAME.STORE_OFFERS) {
    const storeId = Number($to.params.storeId)
    filterQuery.store_id = storeId
  }
  // Init search params
  filter.value = filterQuery
  offersCurrentPage.value = undefined
  offers.value = []

  await Promise.all([getStore(filter.value?.store_id), filterOffers()])

  $next($to)
})
</script>

<template>
  <section class="p-2">
    <!-- Offers Content -->
    <div class="grid grid-cols-2 gap-2" v-if="offers.length">
      <OfferWidget
        v-for="(offer, offerKey) in offers"
        :key="`offer-${offer.id}-${offerKey}`"
        :data="offer"
        @click="() => goToOffer(offer)"
      />

      <OfferSkeleton :repeat="4" v-if="loading" />
    </div>
    <!-- / Offers Content -->

    <!-- Loading -->
    <div class="grid grid-cols-2 gap-2" v-else-if="loading">
      <OfferSkeleton :repeat="8" />
    </div>
    <!-- / Loading -->

    <!-- No content -->
    <div class="flex items-center justify-center min-h-[32rem]" v-else>
      <div class="font-gray-700">No hay contenido</div>
    </div>
    <!-- / No content -->
  </section>

  <div class="fixed bottom-6 left-6 z-10">
    <FloatButton v-model="showFloatMenu">
      <FloatButtonItem
        @click="
          () => {
            showFloatMenu = false
            showNewOfferModal = true
          }
        "
        label="Nuevo"
        :icon="IconPlus"
        id="plus-float"
      />
      <FloatButtonItem
        @click="
          () => {
            showFloatMenu = false
            showFilterModal = true
          }
        "
        label="Buscar"
        :icon="IconSearch"
        id="search-float"
      />
    </FloatButton>
  </div>

  <!-- Search Modal -->
  <BaseModal v-if="showFilterModal" @close="() => (showFilterModal = false)">
    <div class="flex h-full w-full justify-center items-center">
      <div class="bg-white p-4 border rounded-xl overflow-y-auto z-30">
        <SearchForm
          :filter="filter"
          @close="() => (showFilterModal = false)"
          @search="onSearchOffer"
        />
      </div>
    </div>
  </BaseModal>
  <!-- / Search Modal -->

  <!-- New offer Modal -->
  <BaseModal v-if="showNewOfferModal" @close="() => (showNewOfferModal = false)">
    <div class="flex h-full w-full justify-center items-center">
      <div class="bg-white p-4 border rounded-xl overflow-y-auto z-30">
        <OfferForm
          @canceled="() => (showNewOfferModal = false)"
          @created="() => (showNewOfferModal = false)"
        />
      </div>
    </div>
  </BaseModal>
  <!-- / New offer Modal -->
</template>
