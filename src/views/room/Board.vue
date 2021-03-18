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
export default {
  name: 'Board',
  props: ['board'],
  methods: {
    handleSpaceClick(space) {
      console.log(`[DEBUG] Space ${space.value} clicked`);
    }
  }
};
</script>