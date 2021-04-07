<template>
  <div class="flex flex-wrap mx-auto w-full h-full absolute">
    <div
      class="flex w-1/10 justify-center items-center cursor-pointer bg-gray-300 border-2 border-white text-xl font-bold w-full"
      :class="space.team"
      v-for="space of room.board"
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
  props: ['hand', 'room', 'turn'],
  emits: ['play', 'turn'],
  methods: {
    async readPlayer(roomID, socketID) {
      try {
        const res = await fetch(`/rooms/${roomID}`);
        const data = await res.json();

        const player = data.players.find(
          player => player.socketID === socketID
        );

        return player;
      } catch (error) {
        console.log(['[ERROR]', error.message]);
      }
    },
    async placePeg(space) {
      if (this.turn && this.room.gameState === 1) {
        this.$emit('turn');

        const player = await this.readPlayer(
          this.room._id,
          localStorage.getItem('socketID')
        );

        const validMove = this.validMove(space);

        if (validMove || validMove === 0) {
          space.hasPeg = true;
          space.team = player.team;
          this.$emit('play', validMove, space.value, player.username);

          if (this.isWinner(space.value)) {
            this.$emit('win', player.team);
          }
        } else {
          this.$emit('turn');
        }
      } else {
        console.log(`[DEBUG] It's not your turn`);
      }
    },
    validMove(space) {
      if (this.hand.length === 0) {
        console.log('[DEBUG] You have no cards');
        return false;
      }

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
    },
    countConsecutive(index, direction, count = 1) {
      const next = index + direction;

      if (this.room.board[next]) {
        if (this.room.board[next].team !== this.room.board[index].team) {
          return count;
        } else if (direction === 1 && next % 10 === 0) {
          // If checking to the right and next value is in the first column
          return count;
        } else if (direction === -1 && next % 10 === 9) {
          // If checking to the left and next value is in the last column
          return count;
        } else if (this.room.board[next].hasPeg) {
          count++;
          count = this.countConsecutive(next, direction, count);
        }
      }

      return count;
    },
    isWinner(value) {
      const index = this.room.board.findIndex(space => space.value === value);
      const directions = [1, 9, 10, 11];

      for (let direction of directions) {
        const one = this.countConsecutive(index, direction);
        const two = this.countConsecutive(index, direction * -1);
        if (one + two > 5) {
          return true;
        }
      }
      return false;
    }
  }
};
</script>