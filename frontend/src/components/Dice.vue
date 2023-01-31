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
  <div>
    <span
      v-for="[index, number] in Object.entries(diceArr ?? [])"
      :key="index"
      class="dice"
      :class="{ holdable: isMyTurn, hold: holdArr[+index] ?? false }"
    >
      <span @click="diceHold" :id="index">{{ number }} </span>
    </span>
    <button v-if="isMyTurn && 3 - diceRollCount" @click="diceRoll" id="roll">
      🎲({{ 3 - diceRollCount }})
    </button>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');

#roll {
  position: absolute;
  top: 1rem;
  left: calc(50vw + 7rem);
  font-size: 1.5rem;
}
.dice {
  font-family: 'Lato', sans-serif;
  line-height: 4rem;
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
  background-color: white;
  box-shadow: 7px 7px 1px rgb(184, 184, 185);
}

.dice > span {
  width: 100%;
  height: 90%;
  text-align: center;
}

.holdable {
  border: 5px solid rgb(55, 88, 196);
}

.hold {
  background-color: rgb(218, 218, 218);
  transform: translate(5px, 5px);
  box-shadow: 0 0;
}
</style>
