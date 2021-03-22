<template>
  <div>
    <p v-for="log in logs" :key="log" class="italic">{{ log }}</p>
  </div>
</template>

<script>
export default {
  name: 'Chat',
  props: ['logs']
};
</script>