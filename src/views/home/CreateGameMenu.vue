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
          {{ maxPlayers }}
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
          {{ maxTeams }}
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
      maxPlayers: 4,
      maxTeams: 2,
      teams: [
        ['bg-teal-600', 'bg-orange-600'],
        ['bg-blue-600', 'bg-pink-600', 'bg-yellow-400'],
        ['bg-red-600', 'bg-green-600', 'bg-yellow-400', 'bg-blue-600']
      ],
      error: ''
    };
  },
  methods: {
    async createGame(e) {
      e.preventDefault();
      if (this.maxPlayers % this.maxTeams !== 0) {
        this.error = 'Players must divide into teams evenly';
      } else {
        this.error = '';

        const teams = this.teams.find(team => team.length === this.maxTeams);

        const data = {
          maxPlayers: this.maxPlayers,
          maxTeams: this.maxTeams,
          name: '',
          teams
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
      if (this.maxPlayers > 2) this.maxPlayers--;
    },
    decMaxTeams() {
      if (this.maxTeams > 2) this.maxTeams--;
    },
    incMaxPlayers() {
      if (this.maxPlayers < 9) this.maxPlayers++;
    },
    incMaxTeams() {
      if (this.maxTeams < 4 && this.maxTeams < this.maxPlayers) this.maxTeams++;
    }
  }
};
</script>