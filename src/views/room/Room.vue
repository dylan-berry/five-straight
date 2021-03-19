<template>
  <div>
    <h1 class="text-3xl my-5 text-center">Waiting for game to begin</h1>
    <Seats v-if="room" :room="room" />
    <Board v-if="room" :room="room" :hand="hand" />
    <Hand v-if="hand.length > 0" :room="room" :hand="hand" />
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
      hand: [],
      room: {}
    };
  },
  async mounted() {
    try {
      const res = await fetch(`http://localhost:3000/rooms/${this.id}`);
      this.room = await res.json();
      // TODO make sure pulling correct player, right now set to 'dylan'
      this.hand = this.room.players.find(
        player => player.username === 'dylan'
      ).hand;
    } catch (error) {
      console.log('[ERROR]', error.message);
    }
  }
};
</script>