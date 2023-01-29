<script setup lang="ts">
import type { UserId, UserStates } from '../types/index';

const prop = defineProps<{
  userStates: UserStates;
  turn: UserId | null;
  diceArr: number[];
  isMyTurn: boolean;
  fixScore: (e: MouseEvent) => void;
}>();

const calcScore = (base: number): number => {
  return prop.diceArr.filter((num) => num === base).length * base;
};
</script>

<template>
  <table class="scoreBoard">
    <tr class="header">
      <th></th>
      <th
        v-for="[userId, userState] in userStates"
        :key="userId"
        :class="{ active: userId === turn }"
      >
        {{ userState.userName }}
      </th>
    </tr>
    <tr>
      <td>1</td>
      <th
        v-for="[userId, userState] in userStates"
        :key="userId"
        @click="fixScore"
        :class="{
          fixable:
            !userState.state.scoreFixed?.[0] && turn === userId && isMyTurn,
          fixed: userState.state.scoreFixed?.[0],
        }"
        id="0"
      >
        {{
          turn === userId && !userState.state.scoreFixed?.[0]
            ? calcScore(1)
            : userState.state.score?.[0]
        }}
      </th>
    </tr>
    <tr>
      <td>2</td>
      <th
        v-for="[userId, userState] in userStates"
        :key="userId"
        @click="fixScore"
        :class="{
          fixable:
            !userState.state.scoreFixed?.[1] && turn === userId && isMyTurn,
          fixed: userState.state.scoreFixed?.[1],
        }"
        id="1"
      >
        {{
          turn === userId && !userState.state.scoreFixed?.[1]
            ? calcScore(2)
            : userState.state.score?.[1]
        }}
      </th>
    </tr>
    <tr>
      <td>3</td>
      <th
        v-for="[userId, userState] in userStates"
        :key="userId"
        @click="fixScore"
        :class="{
          fixable:
            !userState.state.scoreFixed?.[2] && turn === userId && isMyTurn,
          fixed: userState.state.scoreFixed?.[2],
        }"
        id="2"
      >
        {{
          turn === userId && !userState.state.scoreFixed?.[2]
            ? calcScore(3)
            : userState.state.score?.[2]
        }}
      </th>
    </tr>
    <tr>
      <td>4</td>
      <th
        v-for="[userId, userState] in userStates"
        :key="userId"
        @click="fixScore"
        :class="{
          fixable:
            !userState.state.scoreFixed?.[3] && turn === userId && isMyTurn,
          fixed: userState.state.scoreFixed?.[3],
        }"
        id="3"
      >
        {{
          turn === userId && !userState.state.scoreFixed?.[3]
            ? calcScore(4)
            : userState.state.score?.[3]
        }}
      </th>
    </tr>
    <tr>
      <td>5</td>
      <th
        v-for="[userId, userState] in userStates"
        :key="userId"
        @click="fixScore"
        :class="{
          fixable:
            !userState.state.scoreFixed?.[4] && turn === userId && isMyTurn,
          fixed: userState.state.scoreFixed?.[4],
        }"
        id="4"
      >
        {{
          turn === userId && !userState.state.scoreFixed?.[4]
            ? calcScore(5)
            : userState.state.score?.[4]
        }}
      </th>
    </tr>
    <tr>
      <td>6</td>
      <th
        v-for="[userId, userState] in userStates"
        :key="userId"
        @click="fixScore"
        :class="{
          fixable:
            !userState.state.scoreFixed?.[5] && turn === userId && isMyTurn,
          fixed: userState.state.scoreFixed?.[5],
        }"
        id="5"
      >
        {{
          turn === userId && !userState.state.scoreFixed?.[5]
            ? calcScore(6)
            : userState.state.score?.[5]
        }}
      </th>
    </tr>
    <tr class="footer">
      <td>sum&nbsp;</td>
      <th v-for="[userId, userState] in userStates" :key="userId">
        {{ userState.state.score?.reduce((b: any, a: any) => b + a) }}
      </th>
    </tr>
  </table>
</template>

<style scoped>
.fixable {
  box-shadow: inset 0 0 10px orange;
}
.active {
  background-color: orange;
}

.fixed {
  background-color: gray;
}
.header {
  border-bottom: 5px solid;
}

.footer {
  border-top: 5px solid;
}
</style>

<style>
table {
  border: 5px solid #333;
  border-collapse: collapse;
}

td,
th {
  border: 2px solid #333;
  font-size: 2rem;
}
</style>
