<script setup>

import NavComponent from "@/components/NavComponent.vue";
</script>

<template>
  <NavComponent></NavComponent>
  <RouterView :key="$router.path"/>
</template>

<style scoped>
</style>
