<script setup lang="ts">
import type { StateUser } from '@/App.vue';
import type { UserId, UserStates } from '@/types';

const prop = defineProps<{
  userStates: UserStates<StateUser>;
  turnUserId: UserId | null;
  diceArr: number[];
  isMyTurn: boolean;
  turn: number;
  gameTurn: number;
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
          (num) => prop.diceArr.filter((v) => v === num).length >= 4
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
      const count = [...diceSet]
        .sort()
        .map((v, i) => v - i)
        .reduce<{ [key: string]: number }>(
          (a, b) => ({ ...a, [String(b)]: (a[String(b)] ?? 0) + 1 }),
          {}
        );

      if (Object.values(count).reduce((b, a) => Math.max(b, a)) >= 4) {
        return 15;
      }

      return 0;
    }

    case 'B.Str(30)': {
      if (
        sortedDiceArr.every((v, i) =>
          i === 0 ? true : v === sortedDiceArr[i - 1] + 1
        )
      ) {
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
      <th>{{ `Turn ${turn}/${gameTurn}` }}</th>
      <th
        v-for="[userId, userState] in userStates"
        :key="userId"
        :class="{ active: userId === turnUserId }"
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
            !userState.scoreFixed?.[i - 1] && turnUserId === userId && isMyTurn,
          fixed: userState.scoreFixed?.[i - 1],
        }"
      >
        {{
          turnUserId === userId && !userState.scoreFixed?.[i - 1]
            ? calcScore(i)
            : userState.score?.[i - 1]
        }}
      </th>
    </tr>
    <tr class="footer">
      <th>sum</th>
      <th v-for="[userId, userState] in userStates" :key="userId">
        {{ userState.score?.slice(0, 6).reduce((b, a) => b + a) }}
      </th>
    </tr>
    <tr class="header">
      <th>63+(35)</th>
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
            !userState.scoreFixed?.[i + 6] && turnUserId === userId && isMyTurn,
          fixed: userState.scoreFixed?.[i + 6],
        }"
      >
        {{
          turnUserId === userId && !userState.scoreFixed?.[i + 6]
            ? calcScore(roll[i - 1])
            : userState.score?.[i + 6]
        }}
      </th>
    </tr>

    <tr class="footer">
      <th>total</th>
      <th v-for="[userId, userState] in userStates" :key="userId">
        {{ userState.score?.reduce((b: any, a: any) => b + a) }}
      </th>
    </tr>
  </table>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Slabo+27px&display=swap');
.scoreBoard {
  font-family: 'Slabo 27px', serif;
  box-shadow: 10px 10px 1px rgb(184, 184, 185);
}

.fixable {
  box-shadow: inset 0 0 10px orange;
}
.active {
  background-color: orange;
}

.fixed {
  background-color: rgb(218, 218, 218);
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
  background-color: white;
}
</style>
