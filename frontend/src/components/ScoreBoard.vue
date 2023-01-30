<script setup lang="ts">
import type { UserId, UserStates } from '../types/index';
import type { StateUser } from '@/App.vue';

const prop = defineProps<{
  userStates: UserStates<StateUser>;
  turn: UserId | null;
  diceArr: number[];
  isMyTurn: boolean;
  fixScore: (e: MouseEvent, userId: UserId) => void;
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
      <!-- //BUG (e) => fixScore(e, userId)が毎回発火するので、自分のターンに相手のスコアをクリックでも反応する -->
      <th
        v-for="[userId, userState] in userStates"
        :key="userId"
        @click="(e) => fixScore(e, userId)"
        :class="{
          fixable: !userState.scoreFixed?.[0] && turn === userId && isMyTurn,
          fixed: userState.scoreFixed?.[0],
        }"
        id="0"
      >
        {{
          turn === userId && !userState.scoreFixed?.[0]
            ? calcScore(1)
            : userState.score?.[0]
        }}
      </th>
    </tr>
    <tr>
      <td>2</td>
      <th
        v-for="[userId, userState] in userStates"
        :key="userId"
        @click="(e) => fixScore(e, userId)"
        :class="{
          fixable: !userState.scoreFixed?.[1] && turn === userId && isMyTurn,
          fixed: userState.scoreFixed?.[1],
        }"
        id="1"
      >
        {{
          turn === userId && !userState.scoreFixed?.[1]
            ? calcScore(2)
            : userState.score?.[1]
        }}
      </th>
    </tr>
    <tr>
      <td>3</td>
      <th
        v-for="[userId, userState] in userStates"
        :key="userId"
        @click="(e) => fixScore(e, userId)"
        :class="{
          fixable: !userState.scoreFixed?.[2] && turn === userId && isMyTurn,
          fixed: userState.scoreFixed?.[2],
        }"
        id="2"
      >
        {{
          turn === userId && !userState.scoreFixed?.[2]
            ? calcScore(3)
            : userState.score?.[2]
        }}
      </th>
    </tr>
    <tr>
      <td>4</td>
      <th
        v-for="[userId, userState] in userStates"
        :key="userId"
        @click="(e) => fixScore(e, userId)"
        :class="{
          fixable: !userState.scoreFixed?.[3] && turn === userId && isMyTurn,
          fixed: userState.scoreFixed?.[3],
        }"
        id="3"
      >
        {{
          turn === userId && !userState.scoreFixed?.[3]
            ? calcScore(4)
            : userState.score?.[3]
        }}
      </th>
    </tr>
    <tr>
      <td>5</td>
      <th
        v-for="[userId, userState] in userStates"
        :key="userId"
        @click="(e) => fixScore(e, userId)"
        :class="{
          fixable: !userState.scoreFixed?.[4] && turn === userId && isMyTurn,
          fixed: userState.scoreFixed?.[4],
        }"
        id="4"
      >
        {{
          turn === userId && !userState.scoreFixed?.[4]
            ? calcScore(5)
            : userState.score?.[4]
        }}
      </th>
    </tr>
    <tr>
      <td>6</td>
      <th
        v-for="[userId, userState] in userStates"
        :key="userId"
        @click="(e) => fixScore(e, userId)"
        :class="{
          fixable: !userState.scoreFixed?.[5] && turn === userId && isMyTurn,
          fixed: userState.scoreFixed?.[5],
        }"
        id="5"
      >
        {{
          turn === userId && !userState.scoreFixed?.[5]
            ? calcScore(6)
            : userState.score?.[5]
        }}
      </th>
    </tr>
    <tr class="footer">
      <td>sum&nbsp;</td>
      <th v-for="[userId, userState] in userStates" :key="userId">
        {{ userState.score?.reduce((b: any, a: any) => b + a) }}
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
