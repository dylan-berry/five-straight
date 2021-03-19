<template>
  <div class="max-w-screen-sm mx-auto rounded bg-white p-5 my-5">
    <h2 class="text-xl">Choose game settings</h2>
    <form class="grid grid-cols-2 gap-4 mt-5" @submit="createGame">
      <label for="maxPlayers" class="text-right"># of Players</label>
      <div class="flex">
        <button
          type="button"
          class="bg-blue-600 text-white text-base w-7 rounded-l"
          @click="decMaxPlayers"
        >
          -
        </button>
        <div name="maxPlayers" class="border-t border-b py-1 px-3">
          {{ form.maxPlayers }}
        </div>
        <button
          type="button"
          class="bg-blue-600 text-white text-base w-7 rounded-r"
          @click="incMaxPlayers"
        >
          +
        </button>
      </div>

      <label for="maxTeams" class="text-right"># of Teams</label>
      <div class="flex">
        <button
          type="button"
          class="bg-blue-600 text-white text-base w-7 rounded-l"
          @click="decMaxTeams"
        >
          -
        </button>
        <div name="maxTeams" class="border-t border-b py-1 px-3">
          {{ form.maxTeams }}
        </div>
        <button
          type="button"
          class="bg-blue-600 text-white text-base w-7 rounded-r"
          @click="incMaxTeams"
        >
          +
        </button>
      </div>

      <p class="text-red-600 col-span-2" v-if="error">{{ error }}</p>

      <button type="submit" class="btn bg-blue-600 col-span-2 mx-auto">
        Create Game
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateGameMenu',
  emits: ['roomCreated'],
  data() {
    return {
      form: {
        maxPlayers: 4,
        maxTeams: 2,
        teams: [
          ['bg-teal-600', 'bg-orange-600'],
          ['bg-blue-600', 'bg-pink-600']
        ]
      },
      error: ''
    };
  },
  methods: {
    async createGame(e) {
      e.preventDefault();
      if (this.form.maxPlayers % this.form.maxTeams !== 0) {
        this.error = 'Players must divide into teams evenly';
      } else {
        this.error = '';

        const data = {
          maxPlayers: this.form.maxPlayers,
          maxTeams: this.form.maxTeams,
          teams: this.form.teams[
            Math.floor(Math.random() * this.form.teams.length)
          ],
          // Below this will be generated on the server is just here for testing purposes
          name: Math.ceil(Math.random() * 999),
          players: [],
          id: Math.ceil(Math.random() * 999),
          open: true,
          turn: 1,
          turnOwner: null
        };

        try {
          await fetch('http://localhost:3000/rooms', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
          this.$emit('roomCreated');
        } catch (error) {
          console.log('[ERROR]', error.message);
        }
      }
    },
    decMaxPlayers() {
      if (this.form.maxPlayers > 2) this.form.maxPlayers--;
    },
    decMaxTeams() {
      if (this.form.maxTeams > 2) this.form.maxTeams--;
    },
    incMaxPlayers() {
      if (this.form.maxPlayers < 9) this.form.maxPlayers++;
    },
    incMaxTeams() {
      if (this.form.maxTeams < 4 && this.form.maxTeams < this.form.maxPlayers)
        this.form.maxTeams++;
    }
  }
};
</script>