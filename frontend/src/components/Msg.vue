<script setup lang="ts">
defineProps<{ isMyTurn: boolean; message: string }>();
</script>

<template>
  <div>{{ isMyTurn ? message : 'stay' }}</div>
</template>

<style scoped></style>
