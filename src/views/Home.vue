<template>
  <Room v-if="roomID" :roomID="roomID" />
  <div v-if="!roomID" class="container mx-auto text-center">
    <h1 class="text-3xl mt-5">Welcome to Five Straight!</h1>
    <h2 class="text-xl mb-5">Join or create a game below.</h2>
    <button
      v-if="rooms.length < 9"
      class="btn-round bg-blue-600 mb-5"
      @click="setupGame"
    >
      Create Game
    </button>

    <CreateGameMenu v-if="setup" @roomCreated="roomCreated" />

    <div class="flex flex-wrap justify-center">
      <RoomInfo
        v-for="room in rooms"
        :room="room"
        :key="room._id"
        @join="handleJoinGame"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';

import CreateGameMenu from '../components/home/CreateGameMenu.vue';
import Room from './Room.vue';
import RoomInfo from '../components/home/RoomInfo.vue';

export default {
  data() {
    return {
      roomID: '',
      rooms: [],
      setup: false,
    };
  },
  methods: {
    handleJoinGame: function (id) {
      console.log(`[DEBUG] Joining game ${id}`);
      this.roomID = id;
    },
    loadRooms: async function () {
      const res = await axios.get('/rooms');
      this.rooms = res.data;
    },
    roomCreated: async function () {
      this.setup = false;
      await this.loadRooms();
    },
    setupGame: function () {
      this.setup = true;
    },
  },
  props: [],
  components: {
    CreateGameMenu,
    Room,
    RoomInfo,
  },
  async mounted() {
    const res = await axios.get('/rooms');
    this.rooms = res.data;
  },
};
</script>