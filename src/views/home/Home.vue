<template>
  <div class="container mx-auto text-center">
    <h1 class="text-3xl mt-5">Welcome to Five Straight!</h1>
    <h2 class="text-xl mb-5">Join or create a game below.</h2>
    <button
      v-if="rooms.length < 15"
      class="btn bg-blue-600 mb-5"
      @click="setupGame"
    >
      Create Game
    </button>

    <CreateGameMenu v-if="setup" @roomCreated="roomCreated" />

    <div class="flex flex-wrap justify-center">
      <RoomInfo v-for="room of openRooms" :room="room" :key="room._id" />
    </div>

    <h2 v-if="closedRooms.length > 0" class="text-xl">In-progress games</h2>
    <div class="flex flex-wrap justify-center">
      <RoomInfo v-for="room of closedRooms" :room="room" :key="room._id" />
    </div>
  </div>
</template>

<script>
import CreateGameMenu from './CreateGameMenu.vue';
import RoomInfo from './RoomInfo.vue';

export default {
  name: 'Home',
  components: {
    CreateGameMenu,
    RoomInfo
  },
  data() {
    return {
      rooms: [],
      setup: false
    };
  },
  computed: {
    openRooms() {
      return this.rooms.filter(room => room.gameState === 0);
    },
    closedRooms() {
      return this.rooms.filter(room => room.gameState === 1);
    }
  },
  methods: {
    async loadRooms() {
      try {
        const res = await fetch('/rooms');
        this.rooms = await res.json();
      } catch (error) {
        console.log('[ERROR]', error.message);
      }
    },
    async roomCreated() {
      this.setup = false;
      await this.loadRooms();
    },
    setupGame() {
      this.setup = true;
    }
  },
  async created() {
    this.loadRooms();
  }
};
</script>