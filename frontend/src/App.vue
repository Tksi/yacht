<script setup lang="ts">
import Dice from '@/components/Dice.vue';
</script>

<template>
  <Dice :number="Math.trunc(Math.random() * 7)" />
</template>
