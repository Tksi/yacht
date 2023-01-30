<script setup lang="ts">
import type { UserId, UserStates } from '../types/index';
import type { StateUser } from '@/App.vue';

const prop = defineProps<{
  userStates: UserStates<StateUser>;
  turn: UserId | null;
  diceArr: number[];
  isMyTurn: boolean;
  fixScore: (
    e: MouseEvent,
    userId: UserId,
    fixed: boolean,
    index: number
  ) => void;
}>();

const roll = [
  'Chance',
  '4Dice',
  'FullHouse',
  'S.Str(15)',
  'B.Str(30)',
  'Yacht(50)',
] as const;

const checkStraight = (arr: readonly number[]): boolean => {
  const sortedArr = [...arr].sort();

  return sortedArr.every((v, i) =>
    i === 0 ? true : v === sortedArr[i - 1] + 1
  );
};

const calcScore = (base: (typeof roll)[number] | number): number => {
  if (typeof base === 'number') {
    return prop.diceArr.filter((num) => num === base).length * base;
  }

  const diceSet = new Set(prop.diceArr);
  const sortedDiceArr = [...prop.diceArr].sort();

  switch (base) {
    case 'Chance': {
      return prop.diceArr.reduce((b, a) => b + a);
    }

    case '4Dice': {
      if (
        [...diceSet].some(
          (num) => prop.diceArr.filter((v) => v === num).length === 4
        )
      ) {
        return prop.diceArr.reduce((b, a) => b + a);
      }

      return 0;
    }

    case 'FullHouse': {
      if (
        diceSet.size === 2 &&
        [...diceSet].some(
          (num) => prop.diceArr.filter((v) => v === num).length === 3
        )
      ) {
        return prop.diceArr.reduce((b, a) => b + a);
      }

      return 0;
    }

    case 'S.Str(15)': {
      if (diceSet.size === 4 && checkStraight([...diceSet])) {
        return 15;
      }

      if (
        diceSet.size === 5 &&
        (checkStraight(sortedDiceArr.slice(0, 4)) ||
          checkStraight(sortedDiceArr.slice(1, 5)))
      ) {
        return 15;
      }

      return 0;
    }

    case 'B.Str(30)': {
      if (checkStraight(prop.diceArr)) {
        return 30;
      }

      return 0;
    }

    case 'Yacht(50)': {
      if (diceSet.size === 1) {
        return 50;
      }

      return 0;
    }
  }
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
        @click="
          (e) => fixScore(e, userId, userState.scoreFixed?.[i - 1], i - 1)
        "
        :class="{
          fixable:
            !userState.scoreFixed?.[i - 1] && turn === userId && isMyTurn,
          fixed: userState.scoreFixed?.[i - 1],
        }"
      >
        {{
          turn === userId && !userState.scoreFixed?.[i - 1]
            ? calcScore(i)
            : userState.score?.[i - 1]
        }}
      </th>
    </tr>
    <tr class="footer">
      <td>sum</td>
      <th v-for="[userId, userState] in userStates" :key="userId">
        {{ userState.score?.reduce((b, a) => b + a) }}
      </th>
    </tr>
    <tr class="header">
      <td>63↑(35)</td>
      <th v-for="[userId, userState] in userStates" :key="userId">
        {{ userState.score?.[6] }}
      </th>
    </tr>

    <tr v-for="i in 6" :key="i">
      <td>{{ roll[i - 1] }}</td>
      <th
        v-for="[userId, userState] in userStates"
        :key="userId"
        @click="
          (e) => fixScore(e, userId, userState.scoreFixed?.[i + 6], i + 6)
        "
        :class="{
          fixable:
            !userState.scoreFixed?.[i + 6] && turn === userId && isMyTurn,
          fixed: userState.scoreFixed?.[i + 6],
        }"
      >
        {{
          turn === userId && !userState.scoreFixed?.[i + 6]
            ? calcScore(roll[i - 1])
            : userState.score?.[i + 6]
        }}
      </th>
    </tr>

    <tr class="footer">
      <td>total</td>
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
