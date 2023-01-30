<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { ref, toRaw } from 'vue';
import Dice from './components/Dice.vue';
import Msg from './components/Msg.vue';
import ScoreBoard from './components/ScoreBoard.vue';
import type {
  GameId,
  GameState,
  ReqMessage,
  ResMessage,
  UserId,
} from './types';
import { replacer, reviver } from '@/lib/jsonMap';

export type StatePublic = {
  diceArr: number[];
  holdArr: boolean[];
  diceRollCount: number;
  turnCount: number;
  message: string;
};

export type StateUser = {
  score: number[];
  scoreFixed: boolean[];
};

const TURN = 6;

const gameId = new URL(location.href).searchParams.get('gameId') as GameId;
const setGameId = () =>
  (location.href = `${location.origin}?${new URLSearchParams([
    ['gameId', `GAME-${uuidv4()}`],
  ]).toString()}`);

if (gameId === null) {
  setGameId();
}

const ws = new WebSocket(import.meta.env.VITE_WS ?? 'ws://localhost:4567');

let gameState = ref<GameState<StatePublic, StateUser>>({});
let userName = localStorage.getItem('userName');
let myUserId: UserId;
const isMyTurn = () => gameState.value.publicState?.turnUserId === myUserId;

const send = () =>
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

ws.addEventListener('open', () => {
  while (!userName) {
    userName = prompt('name?');
  }

  localStorage.setItem('userName', userName);
  const joinMessage: ReqMessage<StatePublic, StateUser> = {
    type: 'JOIN',
    gameId,
    userName,
  };
  ws.send(JSON.stringify(joinMessage));
});

ws.addEventListener('message', ({ data: JSONmessage }) => {
  try {
    const message = JSON.parse(JSONmessage, reviver) as ResMessage<
      StatePublic,
      StateUser
    >;
    console.log(message);

    switch (message.type) {
      case 'USERID': {
        myUserId = message.body;

        break;
      }

      case 'GAMESTATE': {
        gameState.value = message.body;

        break;
      }
    }
  } catch (err) {
    console.error(err);
  }
});

const resetDice = () => {
  gameState.value.publicState.diceArr = new Array(5)
    .fill(0)
    .map(() => Math.trunc(Math.random() * TURN) + 1);
  gameState.value.publicState.holdArr = new Array(5).fill(false);
  gameState.value.publicState.diceRollCount = 1;
};

const start = () => {
  const userIds = [...gameState.value.userStates.keys()];

  // ターン
  gameState.value.publicState.turnUserId =
    userIds[Math.trunc(Math.random() * userIds.length)];
  gameState.value.publicState.turnCount = 0;

  // スコア
  for (const [, userState] of gameState.value.userStates) {
    userState.score = new Array(TURN).fill(0);
    userState.scoreFixed = new Array(TURN).fill(false);
  }

  // サイコロ
  resetDice();

  gameState.value.publicState.message = 'click to hold';
  send();
};

const diceHold = (e: MouseEvent): void => {
  if (!isMyTurn()) return;

  if (e.target instanceof HTMLElement) {
    gameState.value.publicState.holdArr[+e.target.id] = true;
    send();
  }
};

const diceRoll = () => {
  if (!isMyTurn()) return;

  for (let i = 0; i < gameState.value.publicState.diceArr.length; i++) {
    if (gameState.value.publicState.holdArr[i] === false) {
      gameState.value.publicState.diceArr[i] =
        Math.trunc(Math.random() * TURN) + 1;
    }
  }

  gameState.value.publicState.diceRollCount++;
  send();
};

const fixScore = (e: MouseEvent, userId: UserId, fixed: boolean): void => {
  if (!isMyTurn() || userId !== myUserId || fixed) return;

  if (e.target instanceof HTMLElement) {
    const scoreFixed = gameState.value.userStates?.get(
      gameState.value.publicState.turnUserId!
    )?.scoreFixed;
    const score = gameState.value.userStates?.get(
      gameState.value.publicState.turnUserId!
    )?.score;

    const diceArr = gameState.value.publicState?.diceArr;

    scoreFixed![+e.target.id] = true;
    score![+e.target.id] =
      // @ts-ignore
      diceArr.filter((v: number) => v === +e.target?.id + 1).length *
      (+e.target?.id + 1);
  }

  //[] 終了処理
  if (
    ++gameState.value.publicState.turnCount ===
    gameState.value.userStates.size * TURN
  ) {
    // [] メッセージ変更
    send();
    alert('END');
  } else {
    // next turn
    resetDice();
    gameState.value.publicState.turnUserId = nextUserId();
    send();
  }
};

const nextUserId = (): UserId => {
  const turn = gameState.value.publicState.turnUserId;
  const userIds = [...gameState.value.userStates.keys()];
  let index = userIds.findIndex((userId) => userId === turn);

  if (++index >= userIds.length) {
    index = 0;
  }

  return userIds[index];
};
</script>

<template>
  <Msg
    :isMyTurn="isMyTurn()"
    :message="gameState.publicState?.message"
    v-if="gameState.publicState?.turnUserId !== null"
  />
  <div v-else>
    <a>{{ gameId }}</a
    ><br />
    <h1>share URL or <a @click="setGameId" class="reload">make new Room</a></h1>
    <br />
  </div>

  <Dice
    :diceArr="gameState.publicState?.diceArr"
    :holdArr="gameState.publicState?.holdArr"
    :diceRollCount="gameState.publicState?.diceRollCount"
    :isMyTurn="isMyTurn()"
    :diceHold="diceHold"
    :diceRoll="diceRoll"
  />
  <ScoreBoard
    :userStates="gameState.userStates"
    :turn="gameState.publicState?.turnUserId"
    :diceArr="gameState.publicState?.diceArr"
    :fixScore="fixScore"
    :isMyTurn="isMyTurn()"
  />
  <button
    @click="start"
    v-if="
      gameState.publicState?.turnUserId === null &&
      gameState.userStates?.size >= 2
    "
  >
    Start
  </button>
</template>

<style scoped>
.reload {
  color: blue;
  text-decoration: underline;
}
</style>
