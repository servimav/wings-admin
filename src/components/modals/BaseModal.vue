<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

export interface Emit {
  (e: 'close'): void
}

const $emit = defineEmits<Emit>()

onMounted(() => {
  const body = document.querySelector('body')
  if (body) {
    body.classList.add('overflow-hidden')
  }
})

onBeforeUnmount(() => {
  const body = document.querySelector('body')
  if (body) {
    body.classList.remove('overflow-hidden')
  }
})
</script>

<template>
  <div class="fixed top-0 z-20 h-screen w-screen overflow-hidden">
    <div
      @click="() => $emit('close')"
      class="absolute top-0 h-screen w-screen bg-gray-700 opacity-50"
    ></div>

    <div class="max-h-screen overflow-auto p-4">
      <slot />
    </div>
  </div>
</template>
