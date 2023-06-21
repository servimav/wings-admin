<script setup lang="ts">
import { setDefaultImage } from '@/helpers'
import type { ShopStore } from '@servimav/wings-services'

export interface Props {
	data: ShopStore
}

defineProps<Props>()
</script>

<template>
	<div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
		<div class="p-2 bg-slate-100 relative">
			<img class="rounded-t-lg" :src="data.image ?? '/images/default.png'" :alt="data.name" :title="data.name"
				@error="setDefaultImage" />

			<div class="absolute bottom-1 right-1 z-10">
				<div class="rounded-full shadow-md border p-1 text-xs" :class="data.available
					? 'bg-green-500 text-white border-green-300'
					: 'bg-slate-300 text-black border-slate-400'
					">
					{{ data.available ? 'Abierto' : 'Cerrado' }}
				</div>
			</div>
		</div>
		<div class="p-2">
			<h5 class="text-sm text-gray-900 dark:text-white">{{ data.name }}</h5>
		</div>
	</div>
</template>
