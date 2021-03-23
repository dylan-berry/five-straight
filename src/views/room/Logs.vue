<template>
  <div class="row-span-2 border rounded-lg">
    <div class="m-5">
      <h2 class="text-xl">Game Log</h2>
    </div>
    <div class="mx-5 overflow-y-auto h-4/5">
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