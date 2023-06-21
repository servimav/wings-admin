<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useServices } from '@/services'
import { useAppStore } from '@/stores'
import { STOCK_TYPE, type ShopOffer } from '@servimav/wings-services'
import { scrollTop, toCurrency, setDefaultImage, CUP_PRICE } from '@/helpers'
import { initModals } from 'flowbite'
import { ROUTE_NAME } from '@/router'
/**
 * -----------------------------------------
 *	Components
 * -----------------------------------------
 */
const DeleteModal = defineAsyncComponent(() => import('@/components/modals/DeleteModal.vue'))
const OfferForm = defineAsyncComponent(() => import('@/components/forms/OfferForm.vue'))
const OfferSkeleton = defineAsyncComponent(() => import('@/components/skeleton/OfferSkeleton.vue'))

/**
 * -----------------------------------------
 *	Composables
 * -----------------------------------------
 */

const $app = useAppStore()
const $route = useRoute()
const $router = useRouter()
const $service = useServices()
/**
 * -----------------------------------------
 *	Data
 * -----------------------------------------
 */
const deleteModalId = 'offer-delete-modal'
const loading = computed(() => $app.loading)
const offer = ref<ShopOffer>()
const showOfferForm = ref(false)
const storeId = ref<number>()

/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

/**
 * load offer data from servers
 */
async function getOffer() {
  const offerId = Number($route.params.offerId)
  storeId.value = Number($route.params.storeId)

  if (offerId > 0) {
    $app.toggleLoading(true)
    try {
      const resp = await $service.shop.offer.show(offerId, {
        currency: 'USD'
      })
      offer.value = resp.data
    } catch (error) {
      $app.axiosError(error)
    }
    $app.toggleLoading(false)
  }
}

/**
 * Navigate to store
 */
function goToParentStore() {
  $router.push({
    name: ROUTE_NAME.STORE,
    params: {
      storeId: $route.params.storeId
    }
  })
}

/**
 * Handle Delete modal event
 */
async function onConfirmDelete() {
  if (offer.value) {
    $app.toggleLoading(true)
    try {
      await $service.shop.offer.remove(offer.value.id)
      goToParentStore()
    } catch (error) {
      $app.axiosError(error)
    }
    $app.toggleLoading(false)
  }
}

/**
 * Handle edit button onClick event
 */
function onEditButtonClick() {
  showOfferForm.value = true
}

/**
 * Handle Offer Form updated event
 * @param offer
 */
function onOfferUpdated(updatedOffer: ShopOffer) {
  offer.value = updatedOffer
  showOfferForm.value = false
  scrollTop()
}

onBeforeMount(async () => {
  await getOffer()
  if (offer.value) {
    setTimeout(() => {
      initModals()
    }, 500)
  } else {
    $app.error('No existe la oferta')
    goToParentStore()
  }
  scrollTop()
})
</script>

<template>
  <div class="p-2" v-if="storeId && offer">
    <!-- Offer Form -->
    <template v-if="showOfferForm">
      <OfferForm
        :store-id="storeId"
        :update="offer"
        @updated="onOfferUpdated"
        @canceled="() => (showOfferForm = false)"
      />
    </template>
    <!-- / Offer Form -->

    <!-- Loading -->
    <div v-else-if="loading">
      <OfferSkeleton :repeat="1" />
    </div>
    <!-- / Offer Form -->

    <!-- Offer Data -->
    <div v-else class="p-2">
      <!-- Actions -->
      <div class="flex flex-wrap justify-end">
        <button class="btn-primary py-1" @click="onEditButtonClick">Editar</button>
        <button
          class="btn-negative py-1"
          :data-modal-target="deleteModalId"
          :data-modal-toggle="deleteModalId"
        >
          Eliminar
        </button>
      </div>
      <!-- / Actions -->

      <div class="p-4 rounded-md bg-slate-100 mt-2 relative">
        <img
          :src="offer.image ?? '/images/default.png'"
          :alt="offer.name"
          :title="offer.name"
          @error="setDefaultImage"
        />

        <div class="absolute bottom-1 right-1 z-10">
          <div
            class="rounded-full shadow-sm border p-2 text-sm"
            :class="
              offer.available
                ? 'bg-green-500 text-white border-green-300'
                : 'bg-slate-300 text-black border-slate-400'
            "
          >
            {{ offer.available ? 'Disponible' : 'No disponible' }}
          </div>
        </div>
      </div>

      <h2 class="text-center text-xl mt-4 py-2 font-bold">{{ offer.name }}</h2>

      <div
        class="p-2 rounded-md border mt-4 shadow-sm"
        v-if="offer.categories && offer.categories.length"
      >
        <h3 class="text-lg font-semibold text-center">Categorías</h3>
        <div class="flex-wrap flex gap-2 mt-2">
          <div
            v-for="(category, catKey) in offer.categories"
            :key="`category-${catKey}`"
            class="px-2 py-1 text-sm rounded-full border bg-slate-100"
          >
            {{ category.name }}
          </div>
        </div>
      </div>

      <div class="p-2 rounded-md border mt-2 shadow-sm" v-if="offer.description">
        <h3 class="text-lg font-semibold text-center">Descripción</h3>
        <p class="text-justify">
          {{ offer.description }}
        </p>
      </div>

      <div
        class="p-2 rounded-md border mt-2 shadow-sm"
        v-if="offer.attributes && offer.attributes.length"
      >
        <h3 class="text-lg font-semibold text-center">Atributos</h3>
        <ul class="space-y-2">
          <li v-for="(attr, attrKey) in offer.attributes" :key="`attr-${attrKey}`">
            {{ attr.key }}:
            <span class="font-semibold pl-2">{{ attr.value }}</span>
          </li>
        </ul>
      </div>

      <!-- Precios -->
      <div class="mt-2 p-2 border rounded-md shadow-sm">
        <h3 class="text-lg font-semibold text-center">Precios</h3>
        <ul class="space-y-2 mt-2">
          <li>
            Precio Producción:
            <span class="font-semibold">{{
              toCurrency((offer.production_price ?? 0) * CUP_PRICE)
            }}</span>
          </li>
          <li>
            Precio venta:
            <span class="font-semibold">{{ toCurrency(offer.sell_price * CUP_PRICE) }}</span>
          </li>
          <li>
            Precio Descuento:
            <span class="font-semibold">{{
              toCurrency((offer.discount_price ?? 0) * CUP_PRICE)
            }}</span>
          </li>
        </ul>
      </div>
      <!-- / Precios -->

      <!-- Inventario -->
      <div class="mt-2 p-2 border rounded-md shadow-sm">
        <h3 class="text-lg font-semibold text-center">Inventario</h3>
        <ul class="space-y-2 mt-2">
          <li>
            Inventario:
            <span class="font-semibold">{{ offer.stock_type }}</span>
          </li>
          <li v-if="offer.stock_type === STOCK_TYPE.LIMITED">
            Cantidad:
            <span class="font-semibold">{{ offer.stock_qty }}</span>
          </li>
        </ul>
      </div>
      <!-- / Inventario -->

      <!-- Extra -->
      <div class="mt-2 p-2 border rounded-md shadow-sm">
        <h3 class="text-lg font-semibold text-center">Extra</h3>
        <ul class="space-y-2 mt-2">
          <li v-if="offer.remote_url">
            Url Remota:
            <a class="font-semibold" :href="offer.remote_url" target="_blank">Acceder</a>
          </li>
          <li v-if="offer.min_delivery_days">
            Demora de Envío Mínima:
            <span class="font-semibold">{{ offer.min_delivery_days }} días</span>
          </li>
        </ul>
      </div>
      <!-- / Inventario -->
    </div>
  </div>

  <DeleteModal :id="deleteModalId" :offer="offer" @delete="onConfirmDelete" />
</template>
