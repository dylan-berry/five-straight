<template>
  <GameButtons
    :hand="hand"
    :room="room"
    @drawCard="drawCard"
    @startGame="startGame"
  />
  <div class="flex my-5 w-1/2 mx-auto justify-around">
    <div
      class="flex h-150px w-100px border border-gray-300 rounded-lg font-bold text-3xl justify-center items-center"
      v-for="card in sortedHand"
      :key="card.value"
    >
      {{ card.value }}
    </div>
  </div>
</template>

<script>
import GameButtons from './GameButtons.vue';
import { updateRoom } from '../../shared.js';

export default {
  name: 'Hand',
  components: { GameButtons },
  props: ['hand', 'room'],
  emits: ['start'],
  methods: {
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
        deck: this.room.deck,
        players: this.room.players
      });
    },
    async drawCard() {
      localStorage.setItem('turn', false);

      const random = Math.floor(Math.random() * this.room.deck.length);
      const card = this.room.deck[random];
      this.hand.push(card);
      this.room.deck.splice(random, 1);

      await updateRoom(this.room._id, {
        deck: this.room.deck,
        players: this.room.players
      });
      // TODO end player turn
      // socket.emit('server:draw', player, room);
    },
    async startGame() {
      this.room.gameState === 1;
      await this.dealCards();
      // TODO set player 1 (whoever goes first)
      // TODO set turnOwner
      this.$emit('start');
    }
  },
  computed: {
    sortedHand() {
      return this.hand.sort((a, b) => a.value - b.value);
    }
  }
};
</script>
