import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/home/Home.vue';
import Room from '../views/room/Room.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/room/:id',
    name: 'Room',
    component: Room,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
