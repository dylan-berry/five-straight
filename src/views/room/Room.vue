<template>
  <div class="container mx-auto">
    <h1 v-if="room.gameState === 0" class="text-3xl my-5 text-center">
      Waiting for game to begin
    </h1>

    <h2 v-if="turnText" class="text-xl text-center my-5">
      {{ turnText }}
    </h2>

    <Seats v-if="room.gameState === 0" :room="room" @sit="sitDown" />
    <Board
      v-if="room"
      :room="room"
      :hand="hand"
      :turn="turn"
      @play="playPeg"
      @turn="updateTurn"
    />
    <Hand
      :room="room"
      :hand="hand"
      :turn="turn"
      @draw="drawCard"
      @start="startGame"
      @restart="restartGame"
    />
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
      sitting: false,
      turn: false,
      turnText: null
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
      this.updateTurnOwner();

      try {
        await updateRoom(this.room._id, {
          turn: this.room.turn,
          turnOwner: this.room.turnOwner,
          board: this.room.board,
          deck: this.room.deck,
          players: this.room.players
        });
        socket.emit('play', card, space, player, this.room);
      } catch (error) {
        console.log('[ERROR]', error.message);
      }
    },
    async drawCard() {
      if (this.turn) {
        this.turn = false;

        const random = Math.floor(Math.random() * this.room.deck.length);
        const card = this.room.deck[random];
        this.hand.push(card);
        this.room.deck.splice(random, 1);
        this.room.turn++;
        this.updateTurnOwner();

        await updateRoom(this.room._id, {
          turn: this.room.turn,
          turnOwner: this.room.turnOwner,
          deck: this.room.deck,
          players: this.room.players
        });

        socket.emit('draw', this.room, localStorage.getItem('username'));
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
    async startGame() {
      this.room.teams = this.shuffleArray(this.room.teams);
      this.room.players = this.orderPlayers(this.sortPlayers());
      this.room.turnOwner = this.room.players[0].username;
      this.room.gameState = 1;
      await this.dealCards();

      try {
        updateRoom(this.room._id, {
          turnOwner: this.room.turnOwner,
          players: this.room.players,
          gameState: this.room.gameState
        });
        socket.emit('start', this.room);
      } catch (error) {
        console.log('[ERROR]', error.message);
      }
    },
    async restartGame() {
      try {
        await updateRoom(this.room._id, {});
        this.room = await readRoom(this.room._id);

        this.startGame();
      } catch (error) {
        console.log('[ERROR]', error.message);
      }
    },
    async dealCards() {
      for (let i = 0; i < 3; i++) {
        for (let player of this.room.players) {
          const random = Math.floor(Math.random() * this.room.deck.length);
          const card = this.room.deck[random];
          player.hand.push(card);
          this.room.deck.splice(random, 1);
        }
      }

      await updateRoom(this.room._id, {
        gameState: this.room.gameState,
        deck: this.room.deck,
        players: this.room.players
      });
    },
    sortPlayers() {
      let sorted = [];
      for (let team of this.room.teams) {
        sorted = sorted.concat(
          this.room.players.filter(player => player.team === team)
        );
      }

      return sorted;
    },
    orderPlayers() {
      let ordered = [];
      for (let i = 0; i < this.room.maxPlayers / this.room.maxTeams; i++) {
        for (
          let j = i;
          j < this.room.maxPlayers;
          j += this.room.maxPlayers / this.room.maxTeams
        ) {
          ordered.push(this.room.players[j]);
        }
      }

      return ordered;
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    updateTurn() {
      this.turn = !this.turn;
    },
    updateTurnOwner() {
      for (let i = 0; i < this.room.players.length; i++) {
        if (this.room.players[i].username === this.room.turnOwner) {
          this.room.turnOwner =
            this.room.players.length === i + 1
              ? this.room.players[0].username
              : this.room.players[i + 1].username;
          break;
        }
      }
    },
    checkTurn() {
      if (this.room.turnOwner === localStorage.getItem('username')) {
        this.turnText = 'Your turn';
        this.turn = true;
      } else {
        this.turnText = `${this.room.turnOwner}'s turn`;
      }
    }
  },
  async created() {
    try {
      this.room = await readRoom(this.id);

      if (this.room.gameState === 1) {
        this.loadHand();
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
      this.checkTurn();
    });

    socket.on('draw', (room, username) => {
      console.log(`[DEBUG] ${username} drew a card`);
      this.room = room;
      this.checkTurn();
    });

    socket.on('sit', (room, username) => {
      console.log(`[DEBUG] ${username} has sat down`);
      this.room = room;
    });

    socket.on('stand', (room, username) => {
      console.log(`[DEBUG] ${username} has stood up`);
      this.room = room;
    });

    socket.on('start', room => {
      console.log('[DEBUG] Game started');
      this.room = room;
      this.loadHand();
      this.checkTurn();
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