<template>
  <div>
    <h1 class="text-3xl my-5 text-center">Waiting for game to begin</h1>
    <Seats v-if="room" :room="room" />
    <Board v-if="room" :board="room.board" />
    <Hand />
    <Chat />
  </div>
</template>

<script>
import Board from './Board.vue';
import Chat from './Chat.vue';
import Hand from './Hand.vue';
import Seats from './Seats.vue';

export default {
  name: 'Room',
  components: {
    Board,
    Chat,
    Hand,
    Seats
  },
  props: ['id'],
  data() {
    return {
      room: {}
    };
  },
  async mounted() {
    try {
      const res = await fetch(`http://localhost:3000/rooms/${this.id}`);
      this.room = await res.json();
    } catch (error) {
      console.log('[ERROR]', error.message);
    }
  }
};
</script>