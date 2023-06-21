<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeMount, onMounted, ref } from 'vue'
import { initModals } from 'flowbite'
import { useAppStore, useShopStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import type { ShopOffer, ShopStore } from '@servimav/wings-services'
import { useServices } from '@/services'
import { ROUTE_NAME } from '@/router'
// Components
const DeleteModal = defineAsyncComponent(() => import('@/components/modals/DeleteModal.vue'))
const FloatButton = defineAsyncComponent(() => import('@/components/buttons/FloatButton.vue'))
const OfferForm = defineAsyncComponent(() => import('@/components/forms/OfferForm.vue'))
const OfferSkeleton = defineAsyncComponent(() => import('@/components/skeleton/OfferSkeleton.vue'))
const OfferWidget = defineAsyncComponent(() => import('@/components/widgets/OfferWidget.vue'))
const StoreForm = defineAsyncComponent(() => import('@/components/forms/StoreForm.vue'))

/**
 * -----------------------------------------
 *	composables
 * -----------------------------------------
 */
const $app = useAppStore()
const $route = useRoute()
const $router = useRouter()
const $service = useServices()
const $shop = useShopStore()
/**
 * -----------------------------------------
 *	data
 * -----------------------------------------
 */
const deleteModalId = 'store-delete-modal'
const loading = computed(() => $app.loading)
const offers = computed<ShopOffer[] | undefined>(() => {
	if (storeId.value) {
		// Check if store exists
		const store = $shop.stores.find((s) => s.id === storeId.value)
		return store && store.offers ? store.offers : []
	}
	return []
})

const showOfferForm = ref(false)
const showStoreForm = ref(false)

const store = computed(() => {
	if (storeId.value) {
		return $shop.stores.find((s) => s.id === storeId.value)
	}
	return undefined
})
const storeId = ref<number>()
/**
 * -----------------------------------------
 *	Methods
 * -----------------------------------------
 */

/**
 * Handle on edit store button click
 */
function onEditStoreClick() {
	showStoreForm.value = true
}

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
 * go to offer view
 * @param offerId
 */
function goToOffer(offerId: number) {
	$router.push({
		name: ROUTE_NAME.OFFER,
		params: {
			storeId: storeId.value,
			offerId
		}
	})
}

/**
 * Handle on OfferForm created event
 */
function onOfferCreated() {
	showOfferForm.value = false
	getOffers()
}

/**
 * onClickFloatButton
 */
function onClickFloatButton() {
	showOfferForm.value = true
}

/**
 * onStoreDelete
 */
async function onStoreDelete() {
	$app.toggleLoading(false)
	try {
		const resp = await $service.shop.store.remove(storeId.value as number)
		console.log({ deleteStore: resp.data })
		$app.success('Tienda eliminada')
		$router.push({ name: ROUTE_NAME.STORES })
	} catch (error) {
		$app.axiosError(error)
	}
	$app.toggleLoading(true)
}

/**
 * Handle when store form updated event is triggered
 * @param store
 */
function onStoreUpdated(store: ShopStore) {
	// Update store data in local stores
	const storeIndex = $shop.stores.findIndex((s) => s.id === store.id)

	if (storeIndex >= 0) {
		// create a copy of store offers
		const storeOffers = $shop.stores[storeIndex].offers
		// update store value
		$shop.stores[storeIndex] = store
		// Restore store offers
		$shop.stores[storeIndex].offers = storeOffers
	}
	// hide form
	showStoreForm.value = false
}

/**
 * -----------------------------------------
 *	Lifecycle
 * -----------------------------------------
 */

onBeforeMount(async () => {
	await getOffers()
})

onMounted(() => {
	setTimeout(() => {
		initModals()
	}, 1000)
})
</script>

<template>
	<div class="p-2">
		<!-- Offer Form -->
		<template v-if="showOfferForm && store">
			<OfferForm :store-id="store.id" @created="onOfferCreated" @canceled="onOfferCreated" />
		</template>
		<!-- / Offer Form -->

		<!-- Store Form -->
		<div v-else-if="showStoreForm" class="p-4 border rounded-md">
			<StoreForm :update="store" @updated="onStoreUpdated" />
		</div>
		<!-- / Store Form -->

		<!-- Store Data -->
		<template v-else-if="store">
			<section class="border rounded-md p-2">
				<div class="space-y-1">
					<h2 class="text-xl text-center font-bold">{{ store.name }}</h2>
					<p class="font-semibold" :class="store.available ? 'text-green-700' : 'text-slate-600'">
						{{ store.available ? 'Abierta' : 'Cerrada' }}
					</p>
					<p class="font-semibold">Descripcion</p>
					<p class="text-sm text-justify">{{ store.description }}</p>
					<p class="font-semibold">Dirección</p>
					<p class="text-sm text-justify">{{ store.address }}</p>
				</div>
				<div class="mt-4">
					<button class="btn-primary py-1 px-2" @click="onEditStoreClick">Editar</button>
					<button class="btn-negative py-1 px-2" :data-modal-target="deleteModalId" :data-modal-toggle="deleteModalId">
						Eliminar
					</button>
				</div>
			</section>

			<div v-if="offers && offers.length" class="mt-4">
				<h3 class="text-xl text-center">Productos</h3>

				<div class="mt-2 grid grid-cols-2 gap-2">
					<OfferWidget v-for="(offer, offerKey) in offers" :key="`offer-${offer.id}-${offerKey}`" :data="offer"
						@click="() => goToOffer(offer.id)" />
				</div>
			</div>
		</template>
		<!-- / Store Form -->

		<!-- Loading -->
		<div v-else-if="loading">
			<div class="grid grid-cols-2 gap-2">
				<OfferSkeleton :repeat="4" />
			</div>
		</div>
		<!-- / Loading -->

		<div v-else>Sin Datos que mostrar</div>
	</div>

	<FloatButton @click="onClickFloatButton" />
	<DeleteModal :id="deleteModalId" :store="store" @delete="onStoreDelete" />
</template>
