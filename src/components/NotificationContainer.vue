<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores'

const appStore = useAppStore()

const notifications = computed(() => appStore.notifications)
</script>

<template>
  <div class="space-y-2 p-4">
    <div
      v-for="(n, k) in notifications"
      :key="`notification-${k}`"
      :class="`rounded-lg p-4 text-white ${n.type === 'positive' ? 'bg-green-600' : 'bg-red-500'}`"
    >
      {{ n.message }}
    </div>
  </div>
</template>
