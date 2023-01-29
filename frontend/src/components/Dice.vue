<script setup lang="ts">
defineProps<{
  diceArr: number[];
  holdArr: boolean[];
  diceRollCount: number;
  isMyTurn: boolean;
  diceHold: (e: MouseEvent) => void;
  diceRoll: (e: MouseEvent) => void;
}>();
</script>

<template>
  <span
    v-for="[index, number] in Object.entries(diceArr ?? [])"
    :key="index"
    class="dice"
    :class="{ dotted: isMyTurn, hold: holdArr[+index] ?? false }"
  >
    <span @click="diceHold" :id="index">{{ number }} </span>
  </span>

  <button v-if="isMyTurn && 3 - diceRollCount" @click="diceRoll">
    Roll({{ 3 - diceRollCount }})
  </button>
</template>

<style scoped>
.dice {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  max-width: 5rem;
  max-height: 5rem;
  width: 15vw;
  height: 15vw;
  border: 5px solid;
  font-size: min(12vw, 4rem);
  border-radius: 10%;
  margin: 5px;
}

.dice > span {
  width: 100%;
  height: 90%;
  text-align: center;
}

.dotted {
  border: 5px dotted;
}

.hold {
  background-color: gray;
}
</style>
