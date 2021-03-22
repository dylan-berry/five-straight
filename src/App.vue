<template>
  <nav class="flex bg-white border-b p-3 justify-between content-center">
    <router-link class="text-xl text-gray-800 font-bold" :to="{ name: 'Home' }">
      five straight
    </router-link>
    <div class="cursor-pointer" @click="openSettings">Settings</div>
    <Settings
      v-if="settingsVisible"
      @close="closeSettings"
      @save="saveSettings"
    />
  </nav>

  <router-view />
</template>

<script>
import Home from './views/home/Home.vue';
import Settings from './components/Settings.vue';

export default {
  name: 'App',
  components: { Home, Settings },
  data() {
    return {
      settingsVisible: false
    };
  },
  methods: {
    openSettings() {
      console.log('[DEBUG] Settings opened');
      this.settingsVisible = true;
    },
    saveSettings() {
      console.log('[DEBUG] Settings saved');
      this.closeSettings();
    },
    closeSettings() {
      console.log('[DEBUG] Settings closed');
      this.settingsVisible = false;
    }
  }
};
</script>