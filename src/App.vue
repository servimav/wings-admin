<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { RouterView } from 'vue-router'

const NotificationContainer = defineAsyncComponent(
  () => import('@/components/NotificationContainer.vue')
)
</script>

<template>
  <Suspense>
    <RouterView />
  </Suspense>

  <NotificationContainer class="fixed z-50 bottom-0 right-0" />
</template>
