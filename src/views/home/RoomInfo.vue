<template>
  <div class="rounded bg-white border m-3 py-5 px-10">
    <h3 class="text-xl">Room {{ room.name }}</h3>
    <p class="my-5">Players {{ room.players.length }}/{{ room.maxPlayers }}</p>
    <!-- TODO set id param in router-link to room._id -->
    <router-link
      :to="{ name: 'Room', params: { id: room.id } }"
      class="btn-round bg-blue-600 text-sm block"
    >
      Join Game
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'RoomInfo',
  props: ['room'],
  emits: ['join']
};
</script>