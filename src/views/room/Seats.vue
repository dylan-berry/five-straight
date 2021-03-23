<template>
  <div class="mb-5">
    <form
      v-if="!userExists"
      action="submit"
      class="mb-5 text-center"
      @submit.prevent="handleNameSubmit"
    >
      <input
        v-model="username"
        type="text"
        class="border-b-2 mx-auto mr-2 py-1 px-2"
        placeholder="Enter name"
      />
      <button type="submit" class="btn bg-blue-600">Submit</button>
    </form>

    <h2 v-if="userExists" class="text-xl text-center mb-5">
      Welcome back, {{ username }}
    </h2>

    <!-- TODO update sit down button text when player sits -->
    <!-- TODO disable other sit down buttons -->
    <div class="text-center">
      <button
        class="btn m-1"
        :class="seat.team"
        v-for="(seat, index) in this.room.seats"
        :key="index"
        @click="handleSitDown(seat.team, index)"
        :disabled="!userExists || sitting || seat.text !== 'Sit Down'"
      >
        {{ this.room.seats[index].text }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Seats',
  props: ['room', 'sitting'],
  emits: ['sit'],
  data() {
    return {
      username: '',
      userExists: false
    };
  },
  methods: {
    async handleSitDown(team, index) {
      this.room.seats[index].text = this.username;

      this.room.players.push({
        username: this.username,
        team,
        socketID: localStorage.getItem('socketID')
      });

      this.$emit('sit');
    },
    handleNameSubmit() {
      console.log('[DEBUG] Name submitted');
      localStorage.setItem('username', this.username);
      this.userExists = true;
    }
  },
  created() {
    this.username = localStorage.getItem('username');
    this.userExists = !!localStorage.getItem('username');
  }
};
</script>