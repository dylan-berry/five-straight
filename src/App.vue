<template>
  <nav class="flex bg-white border-b p-3 justify-between content-center">
    <router-link class="text-xl font-bold" :to="{ name: 'Home' }"
      >five straight</router-link
    >
    <a href="#">Settings</a>
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