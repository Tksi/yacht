<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { ref, toRaw } from 'vue';
import Dice from './components/Dice.vue';
import Msg from './components/Msg.vue';
import ScoreBoard from './components/ScoreBoard.vue';
import type { GameId, GameState, ReqMessage, ResMessage } from './types';
import { replacer, reviver } from '@/lib/jsonMap';

const gameId = new URL(location.href).searchParams.get('gameId') as GameId;

if (gameId === null) {
  location.href = `${location.origin}?${new URLSearchParams([
    ['gameId', `GAME-${uuidv4()}`],
  ]).toString()}`;
}

const ws = new WebSocket(import.meta.env.VITE_WS ?? 'ws://localhost:4567');

let gameState = ref<GameState>({});
let userName = localStorage.getItem('userName');

ws.addEventListener('open', () => {
  while (!userName) {
    userName = prompt('name?');
  }

  localStorage.setItem('userName', userName);
  const joinMessage: ReqMessage = {
    type: 'JOIN',
    gameId,
    userName,
  };
  ws.send(JSON.stringify(joinMessage));
});

ws.addEventListener('message', ({ data: JSONmessage }) => {
  try {
    const message = JSON.parse(JSONmessage, reviver) as ResMessage;
    console.log(message);

    switch (message.type) {
      case 'GAMESTATE': {
        gameState.value = message.body;

        break;
      }
    }
  } catch (err) {
    console.error(err);
  }
});

const start = () => {
  const userIds = [...gameState.value.userStates.keys()];
  gameState.value.publicState.turn =
    userIds[Math.trunc(Math.random() * userIds.length)];

  // スコア
  for (const [, userState] of gameState.value.userStates) {
    userState.state.score = new Array(6).fill(0);
  }

  // サイコロ
  gameState.value.publicState.state.diceArr = new Array(5)
    .fill(0)
    .map(() => Math.trunc(Math.random() * 6) + 1);
  gameState.value.publicState.state.holdArr = new Array(5).fill(false);
  gameState.value.publicState.state.diceRollCount = 1;

  gameState.value.publicState.state.message = 'click to hold';
  ws.send(
    JSON.stringify(
      {
        type: 'SEND',
        gameId,
        // @ts-ignore
        gameState: toRaw(gameState)._rawValue,
      },
      replacer
    )
  );
};

const diceHold = (e: MouseEvent): void => {
  const isMyTurn =
    gameState.value.userStates?.get(gameState.value.publicState.turn!)
      ?.userName === userName;
  if (!isMyTurn) return;

  if (e.target instanceof HTMLElement) {
    gameState.value.publicState.state.holdArr[e.target!.id] = true;
    ws.send(
      JSON.stringify(
        {
          type: 'SEND',
          gameId,
          // @ts-ignore
          gameState: toRaw(gameState)._rawValue,
        },
        replacer
      )
    );
  }
};

const diceRoll = (e: MouseEvent) => {
  const isMyTurn =
    gameState.value.userStates?.get(gameState.value.publicState.turn!)
      ?.userName === userName;
  if (!isMyTurn) return;

  for (let i = 0; i < gameState.value.publicState.state.diceArr.length; i++) {
    if (gameState.value.publicState.state.holdArr[i] === false) {
      gameState.value.publicState.state.diceArr[i] =
        Math.trunc(Math.random() * 6) + 1;
    }
  }

  gameState.value.publicState.state.diceRollCount++;
  ws.send(
    JSON.stringify(
      {
        type: 'SEND',
        gameId,
        // @ts-ignore
        gameState: toRaw(gameState)._rawValue,
      },
      replacer
    )
  );
};
</script>

<template>
  <Msg
    :isMyTurn="gameState.userStates?.get(gameState.publicState.turn!)?.userName ===
    userName"
    :message="gameState.publicState?.state.message"
    v-if="gameState.publicState?.turn !== null"
  />
  <Dice
    :diceArr="gameState.publicState?.state.diceArr"
    :holdArr="gameState.publicState?.state.holdArr"
    :diceRollCount="gameState.publicState?.state.diceRollCount"
    :isMyTurn="
      gameState.userStates?.get(gameState.publicState.turn!)?.userName ===
      userName
    "
    :diceHold="diceHold"
    :diceRoll="diceRoll"
  />
  <ScoreBoard
    :userStates="gameState.userStates"
    :turn="gameState.publicState?.turn"
  />
  <button
    @click="start"
    v-if="
      gameState.publicState?.turn === null && gameState.userStates?.size >= 2
    "
  >
    Start
  </button>
</template>
