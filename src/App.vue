<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores'
// Components
const NotificationContainer = defineAsyncComponent(
	() => import('@/components/NotificationContainer.vue')
)

const $user = useUserStore()

onBeforeMount(() => {
	$user.loadData()
})
</script>

<template>
	<Suspense>
		<RouterView />
	</Suspense>

	<NotificationContainer class="fixed z-50 bottom-0 right-0" />
</template>
