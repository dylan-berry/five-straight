<template>
  <div class="container mx-auto">
    <h1 class="text-3xl my-5 text-center">Waiting for game to begin</h1>
    <Seats v-if="room" :room="room" @sit="sitDown" />
    <Board v-if="room" :room="room" :hand="hand" />
    <Hand :room="room" :hand="hand" />
    <Chat />
  </div>
</template>

<script>
import { io } from 'socket.io-client';

import Board from './Board.vue';
import Chat from './Chat.vue';
import Hand from './Hand.vue';
import Seats from './Seats.vue';

import { readRoom, updateRoom } from '../../shared.js';

const socket = io();

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
      room: {},
      sitting: false
    };
  },
  methods: {
    loadHand() {
      this.hand = this.room.players.find(
        player => player.username === localStorage.getItem('username')
      ).hand;
    },
    async sitDown() {
      this.sitting = true;

      try {
        await updateRoom(this.room._id, { players: this.room.players });
        socket.emit('sit', this.room, localStorage.getItem('username'));
      } catch (error) {
        console.log('[ERROR]', error.message);
      }
    }
  },
  async mounted() {
    try {
      this.room = await readRoom(this.id);

      if (this.room.gameState === 1) {
        loadHand();
      }
    } catch (error) {
      console.log('[ERROR]', error.message);
    }

    // Socket.IO
    socket.emit('join', this.room);
    localStorage.setItem('socketID', socket.id);

    socket.on('sit', (room, username) => {
      this.room = room;
      console.log(`[DEBUG] ${username} has sat down`);
    });

    socket.on('stand', (room, username) => {
      this.room = room;
      console.log(`[DEBUG] ${username} has stood up`);
    });
  },
  async unmounted() {
    try {
      if (this.sitting) {
        this.room.players = this.room.players.filter(
          player => player.username != localStorage.getItem('username')
        );

        await updateRoom(this.room._id, { players: this.room.players });
      }

      socket.emit('leave', this.room, localStorage.getItem('username'));
    } catch (error) {
      console.log('[ERROR]', error.message);
    }
  }
};
</script>