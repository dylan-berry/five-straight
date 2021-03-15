<template>
  <div class="game-board flex flex-wrap mx-auto">
    <div
      class="cell flex w-1/10 justify-center items-center cursor-pointer bg-gray-300 border-2 border-gray-100 text-xl font-bold"
      v-for="space in board"
      :key="space.value"
      @click="handleSpaceClick(space)"
    >
      {{ space.value }}
    </div>
  </div>
</template>

<script>
import board from '../../assets/board.json';

export default {
  name: 'Board',
  components: {},
  props: {},
  data() {
    return {
      board,
    };
  },
  methods: {
    handleSpaceClick(space) {
      console.log(`[DEBUG] Space ${space.value} clicked`);
    },
  },
};
</script>