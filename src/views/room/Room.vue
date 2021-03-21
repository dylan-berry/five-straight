<template>
  <div class="container mx-auto">
    <h1 class="text-3xl my-5 text-center">Waiting for game to begin</h1>
    <Seats v-if="room" :room="room" @sit="sitDown" />
    <Board v-if="room" :room="room" :hand="hand" @play="playPeg" />
    <Hand :room="room" :hand="hand" @start="startGame" />
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
    async playPeg(card, space, player) {
      this.hand = this.hand.filter(c => c.value !== card);
      this.room.turn++;

      try {
        await updateRoom(this.room._id, {
          turn: this.room.turn,
          board: this.room.board,
          deck: this.room.deck,
          players: this.room.players
        });
        socket.emit('play', card, space, player, this.room);
      } catch (error) {
        console.log('[ERROR]', error.message);
      }
    },
    async sitDown() {
      this.sitting = true;

      try {
        await updateRoom(this.room._id, { players: this.room.players });
        this.room = await readRoom(this.room._id);
        socket.emit('sit', this.room, localStorage.getItem('username'));
      } catch (error) {
        console.log('[ERROR]', error.message);
      }
    },
    startGame() {
      socket.emit('start', this.room);
    }
  },

  async created() {
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

    socket.on('play', (card, space, player, room) => {
      console.log(`[DEBUG] ${player} played ${card} in ${space}`);
      this.room = room;
    });

    socket.on('sit', (room, username) => {
      console.log(`[DEBUG] ${username} has sat down`);
      this.room = room;
    });

    socket.on('stand', (room, username) => {
      console.log(`[DEBUG] ${username} has stood up`);
      this.room = room;
    });

    socket.on('start', async room => {
      console.log('[DEBUG] Game started');
      this.room = room;
      this.loadHand();
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