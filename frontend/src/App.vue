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
} from '@/types';
import { isMyTurn } from '@/lib/isMyTurn';
import { replacer, reviver } from '@/lib/jsonMap';
import { shuffleArr } from '@/lib/shuffleArr';

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

const gameTurn = 12;
const diceNum = 5;
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
  gameState.value.publicState.diceArr = new Array(diceNum)
    .fill(0)
    .map(() => Math.trunc(Math.random() * 6) + 1);
  gameState.value.publicState.holdArr = new Array(diceNum).fill(false);
  gameState.value.publicState.diceRollCount = 1;
};

const start = () => {
  // ターン
  gameState.value.userStates = new Map(
    shuffleArr([...gameState.value.userStates])
  );
  gameState.value.publicState.turnUserId = [
    ...gameState.value.userStates,
  ][0][0];
  gameState.value.publicState.turnCount = 0;

  // スコア
  for (const [, userState] of gameState.value.userStates) {
    userState.score = new Array(gameTurn + 1).fill(0);
    userState.scoreFixed = new Array(gameTurn + 1).fill(false);
  }

  // サイコロ
  resetDice();

  gameState.value.publicState.message = 'click to hold';
  send();
};

const diceHold = (diceIndex: number): void => {
  if (isMyTurn({ gameState: gameState.value, myUserId })) {
    gameState.value.publicState.holdArr[diceIndex] = true;
    send();
  }
};

const diceRoll = () => {
  if (!isMyTurn({ gameState: gameState.value, myUserId })) return;

  for (let i = 0; i < gameState.value.publicState.diceArr.length; i++) {
    if (gameState.value.publicState.holdArr[i] === false) {
      gameState.value.publicState.diceArr[i] =
        Math.trunc(Math.random() * 6) + 1;
    }
  }

  gameState.value.publicState.diceRollCount++;
  send();
};

const fixScore = (
  e: MouseEvent,
  userId: UserId,
  fixed: boolean,
  index: number
): void => {
  if (
    !isMyTurn({ gameState: gameState.value, myUserId }) ||
    userId !== myUserId ||
    fixed
  ) {
    return;
  }

  const userState = gameState.value.userStates.get(
    gameState.value.publicState.turnUserId!
  )!;

  if (e.target instanceof HTMLElement) {
    const scoreFixed = userState.scoreFixed;
    const score = userState.score;

    scoreFixed![index] = true;
    score![index] = +e.target.textContent!;

    if (userState.score.slice(0, 6).reduce((b, a) => b + a) >= 63) {
      userState.score[6] = 35;
    }
  }

  // 終了処理
  if (
    gameState.value.publicState.turnCount + 1 ===
    gameState.value.userStates.size * gameTurn
  ) {
    gameState.value.publicState.turnUserId = null;
    send();
  } else {
    // next turn
    gameState.value.publicState.turnCount++;
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
  <div id="container">
    <Msg
      :isMyTurn="isMyTurn({ gameState: gameState, myUserId })"
      :message="gameState.publicState?.message"
      v-if="gameState.publicState?.turnUserId !== null"
    />
    <h1 v-else>
      share URL or <a @click="setGameId" class="reload">make new Room</a>
    </h1>

    <button
      @click="start"
      id="start"
      v-if="
        gameState.publicState?.turnUserId === null &&
        gameState.userStates?.size >= 2
      "
    >
      Start
    </button>
    <Dice
      :diceArr="gameState.publicState?.diceArr"
      :holdArr="gameState.publicState?.holdArr"
      :diceRollCount="gameState.publicState?.diceRollCount"
      :isMyTurn="isMyTurn({ gameState: gameState, myUserId })"
      :diceHold="diceHold"
      :diceRoll="diceRoll"
    />

    <ScoreBoard
      :userStates="gameState.userStates"
      :turnUserId="gameState.publicState?.turnUserId"
      :diceArr="gameState.publicState?.diceArr"
      :fixScore="fixScore"
      :isMyTurn="isMyTurn({ gameState: gameState, myUserId })"
      :turn="
        gameState.publicState?.turnCount === undefined
          ? 0
          : Math.trunc(
              gameState.publicState.turnCount / gameState.userStates.size
            ) + 1
      "
      :gameTurn="gameTurn"
    />
  </div>
</template>

<style scoped>
.reload {
  color: blue;
  text-decoration: underline;
}

#container {
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-wrap: wrap;
}

#container > * {
  margin: 7px;
}

#start {
  font-size: 2rem;
}
</style>
