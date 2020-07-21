import Vue from 'vue';
import VueRouter from 'vue-router';
import consoleJs from './console';

Vue.use(VueRouter);

const routes = [...consoleJs];

const router = new VueRouter({
  routes,
});

export default router;