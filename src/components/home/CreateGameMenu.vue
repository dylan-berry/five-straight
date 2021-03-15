<template>
  <div class="max-w-screen-sm mx-auto rounded bg-white p-5 my-5">
    <h2 class="text-xl">Choose game settings</h2>
    <form
      action="submit"
      class="grid grid-cols-2 gap-4 mt-5"
      @submit="createGame"
    >
      <label for="maxPlayers" class="text-right"># of Players</label>
      <div class="flex">
        <button
          type="button"
          class="material-icons bg-blue-600 text-white text-base w-7 rounded-l"
          @click="decMaxPlayers"
        >
          remove
        </button>
        <div name="maxPlayers" class="border-t border-b py-1 px-3">
          {{ form.maxPlayers }}
        </div>
        <button
          type="button"
          class="material-icons bg-blue-600 text-white text-base w-7 rounded-r"
          @click="incMaxPlayers"
        >
          add
        </button>
      </div>

      <label for="maxTeams" class="text-right"># of Teams</label>
      <div class="flex">
        <button
          type="button"
          class="material-icons bg-blue-600 text-white text-base w-7 rounded-l"
          @click="decMaxTeams"
        >
          remove
        </button>
        <div name="maxTeams" class="border-t border-b py-1 px-3">
          {{ form.maxTeams }}
        </div>
        <button
          type="button"
          class="material-icons bg-blue-600 text-white text-base w-7 rounded-r"
          @click="incMaxTeams"
        >
          add
        </button>
      </div>

      <p class="text-red-600 col-span-2" v-if="error">{{ error }}</p>

      <button type="submit" class="btn-round bg-blue-600 col-span-2 mx-auto">
        Create Game
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        maxPlayers: 4,
        maxTeams: 2,
        teams: ['teal', 'orange'],
      },
      error: '',
    };
  },
  methods: {
    createGame: async function (e) {
      e.preventDefault();
      if (this.form.maxPlayers % this.form.maxTeams !== 0) {
        this.error = 'Players must divide into teams evenly';
      } else {
        this.error = '';

        const data = {
          maxPlayers: this.form.maxPlayers,
          maxTeams: this.form.maxTeams,
          name: null,
          teams: this.form.teams,
        };

        const res = await axios.post('/rooms', data);
        this.$emit('roomCreated');
      }
    },
    decMaxPlayers: function () {
      if (this.form.maxPlayers > 2) this.form.maxPlayers--;
    },
    decMaxTeams: function () {
      if (this.form.maxTeams > 2) this.form.maxTeams--;
    },
    incMaxPlayers: function () {
      if (this.form.maxPlayers < 9) this.form.maxPlayers++;
    },
    incMaxTeams: function () {
      if (this.form.maxTeams < 4 && this.form.maxTeams < this.form.maxPlayers)
        this.form.maxTeams++;
    },
  },
  emits: ['room'],
  props: [],
  components: [],
};
</script>