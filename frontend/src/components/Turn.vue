<script setup lang="ts">
defineProps<{
  turn: number;
  gameTurn: number;
}>();
</script>

<template>
  <h1>{{ `${turn}/${gameTurn}` }}</h1>
</template>
