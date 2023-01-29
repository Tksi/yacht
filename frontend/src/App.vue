<script setup lang="ts">
import { ref } from 'vue';
import Dice from './components/Dice.vue';
import ScoreBoard from './components/ScoreBoard.vue';
import type { GameState, ResMessage } from './types';

const ws = new WebSocket(import.meta.env.VITE_WS ?? 'ws://localhost:4567');

let gameState = ref<GameState>({});
ws.addEventListener('open', () => {
  ws.send(`{"type":"JOIN","userName":"foo","gameId":"GAME-hoge"}`);
});

ws.addEventListener('message', ({ data: JSONmessage }) => {
  try {
    const message = JSON.parse(JSONmessage) as ResMessage;
    console.log(message);

    switch (message.type) {
      case 'GAMESTATE': {
        message.body!.userStates = new Map(message.body!.userStates);
        gameState.value = message.body;

        break;
      }
    }
  } catch (err) {
    console.error(err);
  }
});
</script>

<template>
  <Dice :number="Math.trunc(Math.random() * 7)" />
  <ScoreBoard :userStates="gameState.userStates" />
</template>
