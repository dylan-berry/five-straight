<template>
  <div class="game-board flex flex-wrap mx-auto">
    <div
      class="flex w-1/10 justify-center items-center cursor-pointer bg-gray-300 border-2 border-gray-100 text-xl font-bold"
      :class="space.team"
      v-for="space in room.board"
      :key="space.value"
      @click="placePeg(space)"
    >
      {{ space.value }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Board',
  props: ['hand', 'room'],
  methods: {
    placePeg(space) {
      // TODO Check if player's turn
      const validMove = this.validMove(space);
      if (validMove) {
        console.log(`[DEBUG] ${validMove} placed in ${space.value}`);
        space.hasPeg = true;
        space.team = 'bg-teal-600';
        // TODO sync room info with server
        // socket.emit('server:play', space, player, room);
      }
    },
    validMove(space) {
      if (space.hasPeg) {
        console.log(`[DEBUG] Space ${space.value} already has peg`);
        return false;
      }

      const max = this.findMax(space.value, this.hand);
      if (max === -1) {
        console.log(`[DEBUG] Cards too high to play there`);
        return false;
      }

      return max;
    },
    findMax(value, hand) {
      let max = -1;
      for (let card of hand) {
        if (card.value > max && card.value <= value) {
          max = card.value;
        }
      }
      return max;
    }
  }
};
</script>