<script setup lang="ts">
import type { UserId, UserStates } from '../types/index';
import type { StateUser } from '@/App.vue';

const prop = defineProps<{
  userStates: UserStates<StateUser>;
  turn: UserId | null;
  diceArr: number[];
  isMyTurn: boolean;
  fixScore: (e: MouseEvent, userId: UserId, fixed: boolean) => void;
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
    <tr v-for="i in 6" :key="i">
      <td>{{ i }}</td>
      <th
        v-for="[userId, userState] in userStates"
        :key="userId"
        @click="(e) => fixScore(e, userId, userState.scoreFixed?.[i - 1])"
        :class="{
          fixable:
            !userState.scoreFixed?.[i - 1] && turn === userId && isMyTurn,
          fixed: userState.scoreFixed?.[i - 1],
        }"
        :id="String(i - 1)"
      >
        {{
          turn === userId && !userState.scoreFixed?.[i - 1]
            ? calcScore(i)
            : userState.score?.[i - 1]
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
