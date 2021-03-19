<template>
  <GameButtons :hand="hand" :room="room" @drawCard="drawCard" />
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

export default {
  name: 'Hand',
  components: { GameButtons },
  props: ['hand', 'room'],
  methods: {
    drawCard() {
      const random = Math.floor(Math.random() * this.room.deck.length);
      const card = this.room.deck[random];
      this.hand.push(card);
      this.room.deck.splice(random, 1);
      // TODO sync room info with server
      // TODO end player turn
      // socket.emit('server:draw', player, room);
    }
  },
  computed: {
    sortedHand() {
      return this.hand.sort((a, b) => a.value - b.value);
    }
  }
};
</script>
