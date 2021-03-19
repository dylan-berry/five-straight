<template>
  <div class="md:w-2/3 mx-auto">
    <div class="game-board-container">
      <div class="flex flex-wrap mx-auto w-full h-full absolute">
        <div
          class="flex w-1/10 justify-center items-center cursor-pointer bg-gray-300 border-2 border-white text-xl font-bold w-full"
          :class="space.team"
          v-for="space in room.board"
          :key="space.value"
          @click="placePeg(space)"
        >
          {{ space.value }}
        </div>
      </div>
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
        console.log(`[DEBUG] You can't play there`);
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