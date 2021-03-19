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
      <span v-for="team in room.teams" :key="team">
        <button
          class="btn m-1"
          :class="team"
          v-for="index in room.maxPlayers / room.maxTeams"
          :key="index"
          @click="handleSitDown(team)"
        >
          Sit Down
        </button>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Seats',
  props: ['room'],
  data() {
    return {
      username: '',
      userExists: false
    };
  },
  methods: {
    async handleSitDown(team) {
      console.log(`[DEBUG] ${this.username} sat down on ${team}`);
      this.room.players.push({ username: this.username, team });

      try {
        await fetch(`http://localhost:3000/rooms/${this.room.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.room)
        });
        // TODO let everyone know player has sat down
        // socket.emit('server:sit', room, username, playerNum, socketID);
      } catch (error) {
        console.log('[ERROR]', error.message);
      }
    },
    handleNameSubmit() {
      console.log('[DEBUG] Name submitted');
      localStorage.setItem('username', this.username);
      this.userExists = true;
    }
  },
  mounted() {
    this.username = localStorage.getItem('username');
    this.userExists = !!localStorage.getItem('username');
  }
};
</script>