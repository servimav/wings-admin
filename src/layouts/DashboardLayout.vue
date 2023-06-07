<script setup lang="ts">
import { RouterView } from 'vue-router'
import DrawerLeft from '@/components/menus/DrawerLeft.vue'
import NavTop from '@/components/menus/NavTop.vue'
</script>

<template>
  <div>
    <NavTop />
    <DrawerLeft />
    <RouterView />
  </div>
</template>
