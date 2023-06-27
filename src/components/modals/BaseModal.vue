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
  <div class="fixed top-0 h-screen w-screen z-20 overflow-hidden">
    <div
      @click="() => $emit('close')"
      class="absolute top-0 h-screen w-screen bg-gray-700 opacity-50"
    ></div>

    <slot />
  </div>
</template>
