<template>
  <div class="mx-5">
    <div class="max-w-screen-lg mx-auto">
      <div id="room-info">
        <h1 v-if="room.gameState === 0" class="text-3xl my-5 text-center">
          Waiting for game to begin
        </h1>

        <h1 v-if="room.gameState === 2" class="text-3xl my-5 text-center">
          {{ room.winner.split('-')[1].toUpperCase() }} wins!
        </h1>

        <h2
          v-if="turnText && room.gameState !== 2"
          class="text-xl text-center my-5"
        >
          {{ turnText }}
        </h2>
      </div>

      <Seats
        id="seats"
        v-if="room.gameState === 0"
        :room="room"
        :sitting="sitting"
        @sit="sitDown"
      />

      <div v-if="mobile" class="mb-2 text-center italic">
        <p>{{ this.logs[this.logs.length - 1] }}</p>
      </div>

      <div class="md:grid md:grid-cols-3 gap-5">
        <div class="game-board-container relative col-span-2">
          <Board
            v-if="room"
            :room="room"
            :hand="hand"
            :turn="turn"
            @play="playPeg"
            @turn="updateTurn"
            @win="onWin"
          />
        </div>

        <div class="md:grid md:grid-rows-1/3 gap-5">
          <Hand
            :room="room"
            :hand="hand"
            :turn="turn"
            @draw="drawCard"
            @start="startGame"
            @restart="restartGame"
          />
          <Logs v-if="!mobile" :logs="logs" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Board from './Board.vue';
import Logs from './Logs.vue';
import Hand from './Hand.vue';
import Seats from './Seats.vue';

import { io } from 'socket.io-client';
let socket;

export default {
  name: 'Room',
  components: {
    Board,
    Hand,
    Logs,
    Seats
  },
  props: ['id'],
  data() {
    return {
      hand: [],
      logs: [],
      room: {},
      sitting: false,
      turn: false,
      turnText: null,
      mobile: false
    };
  },
  methods: {
    async readRoom(id) {
      try {
        const res = await fetch(`/rooms/${id}`);
        const data = await res.json();

        return data;
      } catch (error) {
        console.log(['[ERROR]', error.message]);
      }
    },
    async updateRoom(id, data) {
      try {
        await fetch(`/rooms/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      } catch (error) {
        console.log(['[ERROR]', error.message]);
      }
    },
    async archiveGame() {
      const data = {
        date: this.room.date,
        teams: this.room.teams,
        board: this.room.board,
        deck: this.room.deck,
        players: this.room.players,
        winner: this.room.winner
      };

      try {
        await fetch(`/archive`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      } catch (error) {
        console.log(['[ERROR]', error.message]);
      }
    },
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
        await this.updateRoom(this.room._id, {
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

        await this.updateRoom(this.room._id, {
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
        await this.updateRoom(this.room._id, {
          players: this.room.players,
          seats: this.room.seats
        });
        this.room = await this.readRoom(this.room._id);
        socket.emit('sit', this.room, localStorage.getItem('username'));
      } catch (error) {
        console.log('[ERROR]', error.message);
      }
    },
    async startGame() {
      this.room.winner = '';
      this.logs = [];
      this.room.teams = this.shuffleArray(this.room.teams);
      this.room.players = this.orderPlayers(this.sortPlayers());
      this.room.turnOwner = this.room.players[0].username;
      this.room.gameState = 1;
      await this.dealCards();

      try {
        this.updateRoom(this.room._id, {
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
        await this.updateRoom(this.room._id, {});
        this.room = await this.readRoom(this.room._id);

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

      await this.updateRoom(this.room._id, {
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
    },
    onWin(team) {
      this.room.gameState = 2;
      this.room.winner = team;
      this.archiveGame();
      socket.emit('win', this.room);
    }
  },
  async created() {
    this.mobile = window.innerWidth <= 768 ? true : false;
    window.addEventListener('resize', () => {
      this.mobile = window.innerWidth <= 768 ? true : false;
    });

    try {
      this.room = await this.readRoom(this.id);

      if (this.room.gameState === 1) {
        this.loadHand();
      }
    } catch (error) {
      console.log('[ERROR]', error.message);
    }

    if (this.room) {
      // Socket.IO
      socket = io();

      socket.on('connect', () => {
        localStorage.setItem('socketID', socket.id);
        socket.emit('join', this.room);
      });

      socket.on('play', (card, space, player, room) => {
        this.logs.push(`${player} played ${card} in ${space}`);
        this.room = room;
        this.checkTurn();
      });

      socket.on('draw', (room, username) => {
        this.logs.push(`${username} drew a card`);
        this.room = room;
        this.checkTurn();
      });

      socket.on('sit', (room, username) => {
        this.logs.push(`${username} has sat down`);
        this.room = room;
      });

      socket.on('stand', (room, username) => {
        this.logs.push(`${username} has stood up`);
        this.room = room;
      });

      socket.on('start', room => {
        this.logs = [];
        this.logs.push('Game started');
        this.room = room;
        this.loadHand();
        this.checkTurn();
      });

      socket.on('win', room => {
        this.room = room;
      });
    }
  },
  async unmounted() {
    try {
      if (this.sitting) {
        this.room.players = this.room.players.filter(
          player => player.username !== localStorage.getItem('username')
        );

        this.room.seats.forEach((seat, i) => {
          if (seat.text === localStorage.getItem('username')) {
            this.room.seats[i] = { text: 'Sit Down', team: seat.team };
          }
        });

        await this.updateRoom(this.room._id, {
          players: this.room.players,
          seats: this.room.seats
        });
      }

      socket.emit('leave', this.room, localStorage.getItem('username'));
    } catch (error) {
      console.log('[ERROR]', error.message);
    }
  }
};
</script>