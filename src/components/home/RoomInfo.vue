<template>
  <div class="rounded bg-white border m-3 py-5 px-10">
    <h3 class="text-xl">Room {{ room.name }}</h3>
    <p class="my-5">Players {{ room.players.length }}/{{ room.maxPlayers }}</p>
    <button
      class="btn-round bg-blue-600 text-sm block"
      @click="handleJoinGame(room._id)"
    >
      Join Game
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleJoinGame: function (id) {
      this.$emit('join', id);
    },
  },
  emits: ['join'],
  props: ['room'],
  components: {},
};
</script>