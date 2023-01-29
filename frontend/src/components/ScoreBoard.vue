<script setup lang="ts">
import type { UserStates } from '../types/index';

const props = defineProps<{ userStates: UserStates }>();
console.log(props.userStates);
</script>

<template>
  <h1>{{ userStates }}</h1>

  <table class="scoreBoard">
    <tr class="header">
      <th>Role</th>
      <th v-for="[userId, userState] in userStates" :key="userId">
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
      <td>sum</td>
      <th v-for="[userId, userState] in userStates" :key="userId">
        {{ userState.state.score?.reduce((b, a) => b + a) }}
      </th>
    </tr>
  </table>
</template>

<style scoped>
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
