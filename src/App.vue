<template>
  <nav class="shadow p-3">
    <router-link :to="{ name: 'Home' }">Home</router-link>
  </nav>

  <router-view />
</template>

<script>
import Home from './views/home/Home.vue';

export default {
  name: 'App',
  components: { Home }
};
</script>