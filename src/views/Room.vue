<template>
  <div>
    <h1 class="text-3xl my-5">Waiting for game to begin</h1>
    <Seats :room="room" />
    <Board />
    <Hand />
    <Chat />
  </div>
</template>

<script>
import axios from 'axios';

import Board from '../components/room/Board.vue';
import Chat from '../components/room/Chat.vue';
import Hand from '../components/room/Hand.vue';
import Seats from '../components/room/Seats.vue';

export default {
  data() {
    return {
      room: {},
    };
  },
  props: ['roomID'],
  components: {
    Board,
    Chat,
    Hand,
    Seats,
  },
  async mounted() {
    const res = await axios.get(`/rooms/${roomID}`);
    this.room = res.data;
    console.log(this.room);
  },
};
</script>