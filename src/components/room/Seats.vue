<template>
  <div class="mb-5">
    <form action="submit" class="mb-5" @submit.prevent="handleNameSubmit">
      <input
        type="text"
        class="border-b-2 mx-auto mr-2 py-1 px-2"
        placeholder="Enter name"
      />
      <button type="submit" class="btn btn-round bg-green-500">Submit</button>
    </form>

    <button
      class="btn btn-round m-1 bg-blue-500"
      v-for="index in room.maxPlayers"
      :key="index"
      @click="handleSitDown"
    >
      Sit Down
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleSitDown: function () {
      console.log('[DEBUG] Sitting down');
      // Add player to players array
      // Assign player to team
    },
    handleNameSubmit: function () {
      console.log('[DEBUG] Name submitted');
    },
  },
  props: ['room'],
};
</script>