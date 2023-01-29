<script setup lang="ts">
import type { GameState } from '../types/index';

const userState: GameState['userStates'] = new Map([
  ['USER-hoge', { userName: 'hoge' }],
]);
</script>

<template>
  <table class="scoreBoard">
    <tr class="header">
      <th>Role</th>
    </tr>
    <tr>
      <td>1</td>
    </tr>
    <tr>
      <td>2</td>
    </tr>
    <tr>
      <td>3</td>
    </tr>
    <tr>
      <td>4</td>
    </tr>
    <tr>
      <td>5</td>
    </tr>
    <tr>
      <td>6</td>
    </tr>
    <tr>
      <td>sum</td>
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
