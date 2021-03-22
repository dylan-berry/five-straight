<template>
  <div class="border rounded-lg p-5">
    <h2 class="text-xl mb-3">Game Log</h2>
    <div class="overflow-y-auto">
      <p v-for="log in logs" :key="log" class="italic">{{ log }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chat',
  props: ['logs']
};
</script>