<script setup lang="ts">
import Dice from './components/Dice.vue';

const ws = new WebSocket(import.meta.env.VITE_WS ?? 'ws://localhost:4567');

ws.addEventListener('open', () => {
  ws.send(`{"type":"JOIN","userName":"foo","gameId":"GAME-hoge"}`);
});

ws.addEventListener('message', ({ data: JSONmessage }) => {
  console.log(JSON.parse(JSONmessage));
});
</script>

<template>
  <Dice :number="Math.trunc(Math.random() * 7)" />
</template>
