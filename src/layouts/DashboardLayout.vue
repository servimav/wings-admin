<script setup lang="ts">
import { RouterView } from 'vue-router'
import DrawerLeft from '@/components/menus/DrawerLeft.vue'
import NavTop from '@/components/menus/NavTop.vue'
</script>

<template>
  <div class="relative min-h-screen">
    <NavTop />
    <DrawerLeft />
    <div class="p-2">
      <RouterView />
    </div>
  </div>
</template>
