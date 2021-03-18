<template>
  <div id="nav">
    <router-link :to="{ name: 'Home' }">Home</router-link>
  </div>

  <router-view />
</template>

<script>
import Home from './views/home/Home.vue';

export default {
  name: 'App',
  components: { Home }
};
</script>