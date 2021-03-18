<template>
  <div class="mb-5">
    <form
      action="submit"
      class="mb-5 text-center"
      @submit.prevent="handleNameSubmit"
    >
      <input
        type="text"
        class="border-b-2 mx-auto mr-2 py-1 px-2"
        placeholder="Enter name"
      />
      <button type="submit" class="btn btn-round bg-blue-600">Submit</button>
    </form>

    <div class="text-center">
      <span v-for="team in room.teams" :key="team">
        <button
          class="btn-round m-1"
          :class="team"
          v-for="index in room.maxPlayers / room.maxTeams"
          :key="index"
          @click="handleSitDown"
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
    return {};
  },
  methods: {
    handleSitDown() {
      console.log('[DEBUG] Sitting down');
      // Add player to players array
      // Assign player to team
    },
    handleNameSubmit() {
      console.log('[DEBUG] Name submitted');
    }
  }
};
</script>