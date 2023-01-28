<script setup lang="ts">
defineProps({
  number: Number,
});
</script>

<template>
  <span class="dice">
    <span>{{ number }} </span>
  </span>
</template>

<style scoped>
.dice {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 5rem;
  height: 5rem;
  border: 5px solid;
  font-size: 5rem;
  border-radius: 10%;
}
</style>
