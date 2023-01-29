<script setup lang="ts">
import type { UserId, UserStates } from '../types/index';

defineProps<{ userStates: UserStates; turn: UserId | null }>();
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
      <th v-for="[userId, userState] in userStates" :key="userId">
        {{ userState.state.score?.[0] }}
      </th>
    </tr>
    <tr>
      <td>2</td>
      <th v-for="[userId, userState] in userStates" :key="userId">
        {{ userState.state.score?.[1] }}
      </th>
    </tr>
    <tr>
      <td>3</td>
      <th v-for="[userId, userState] in userStates" :key="userId">
        {{ userState.state.score?.[2] }}
      </th>
    </tr>
    <tr>
      <td>4</td>
      <th v-for="[userId, userState] in userStates" :key="userId">
        {{ userState.state.score?.[3] }}
      </th>
    </tr>
    <tr>
      <td>5</td>
      <th v-for="[userId, userState] in userStates" :key="userId">
        {{ userState.state.score?.[4] }}
      </th>
    </tr>
    <tr>
      <td>6</td>
      <th v-for="[userId, userState] in userStates" :key="userId">
        {{ userState.state.score?.[5] }}
      </th>
    </tr>
    <tr>
      <td>sum&nbsp;</td>
      <th v-for="[userId, userState] in userStates" :key="userId">
        {{ userState.state.score?.reduce((b: any, a: any) => b + a) }}
      </th>
    </tr>
  </table>
</template>

<style scoped>
.active {
  background-color: yellow;
}
.header {
  border-bottom: 5px solid;
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
