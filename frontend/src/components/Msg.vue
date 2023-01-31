<script setup lang="ts">
defineProps<{ isMyTurn: boolean; message: string }>();
</script>

<template>
  <h1 id="msg">{{ isMyTurn ? message : 'stay' }}</h1>
</template>

<style scoped>
#msg {
  padding-top: 0.25rem;
}
</style>
