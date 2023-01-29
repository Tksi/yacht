<script setup lang="ts">
defineProps<{ isMyTurn: boolean; message: string }>();
</script>

<template>
  <div>{{ isMyTurn ? message : 'Stay' }}</div>
</template>

<style scoped></style>
