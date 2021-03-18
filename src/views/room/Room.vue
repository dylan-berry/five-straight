<template>
  <div>
    <h1 class="text-3xl my-5 text-center">Waiting for game to begin</h1>
    <Seats :room="room" />
    <Board />
    <Hand />
    <Chat />
  </div>
</template>

<script>
import axios from 'axios';

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
    const res = await axios.get(`/rooms/${this.id}`);
    this.room = res.data;
    console.log(this.room);
  }
};
</script>