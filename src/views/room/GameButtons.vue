<template>
  <div class="mt-5 text-center">
    <button
      v-if="room.gameState === 0"
      class="btn bg-blue-600"
      @click="startGame"
      :disabled="room.players.length !== room.maxPlayers"
    >
      Start Game
    </button>
    <button
      v-if="room.gameState === 1"
      class="btn bg-blue-600"
      :disabled="hand.length === 3"
      @click="this.$emit('drawCard')"
    >
      Draw Card
    </button>
    <button
      v-if="room.gameState === 2"
      class="btn bg-blue-600"
      @click="restartGame"
    >
      Restart Game
    </button>
  </div>
</template>

<script>
export default {
  props: ['hand', 'room'],
  emits: ['drawCard'],
  methods: {
    startGame() {
      console.log('[DEBUG] Starting game');
      this.room.gameState === 1;
      // TODO Sync room with database
    },
    restartGame() {
      console.log('[DEBUG] Restarting game');
    }
  }
};
</script>