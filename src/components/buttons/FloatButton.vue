<script setup lang="ts">
export interface Emit {
  (e: 'update:modelValue', v: boolean): void
}
export interface Prop {
  modelValue: boolean
}

const $emit = defineEmits<Emit>()
defineProps<Prop>()
</script>

<template>
  <div class="fixed right-6 bottom-6 group">
    <div
      id="speed-dial-menu-default"
      class="flex flex-col items-center mb-4 space-y-2"
      :class="{ hidden: !modelValue }"
    >
      <slot />
    </div>
    <button
      type="button"
      @click.prevent="() => $emit('update:modelValue', !modelValue)"
      class="flex items-center justify-center text-white bg-primary-500 rounded-full w-14 h-14 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 focus:outline-none"
    >
      <svg
        aria-hidden="true"
        class="w-8 h-8 transition-transform"
        :class="{ 'group-hover:rotate-45': modelValue }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        ></path>
      </svg>
      <span class="sr-only">Open actions menu</span>
    </button>
  </div>
</template>
