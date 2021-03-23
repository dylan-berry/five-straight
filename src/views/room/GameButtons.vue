<template>
  <div class="text-center">
    <button
      v-if="room.gameState === 0"
      class="btn bg-blue-600"
      @click="$emit('start')"
      :disabled="room.players.length !== room.maxPlayers"
    >
      Start Game
    </button>
    <button
      v-if="room.gameState === 1"
      class="btn bg-blue-600"
      :disabled="hand.length === 3 || !turn"
      @click="$emit('draw')"
    >
      Draw Card
    </button>
    <button
      v-if="room.gameState === 2"
      class="btn bg-blue-600"
      @click="$emit('restart')"
    >
      Restart Game
    </button>
  </div>
</template>

<script>
export default {
  props: ['hand', 'room', 'turn'],
  emits: ['draw', 'start', 'restart']
};
</script>