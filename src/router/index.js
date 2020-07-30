import Vue from 'vue';
import VueRouter from 'vue-router';
import loginJs from './login';
import consoleJs from './console';
import settingsJs from './settings';
import adminJs from './admin';
import demoJs from './demo';

Vue.use(VueRouter);
const routes = [...loginJs, ...consoleJs, ...settingsJs, ...adminJs, ...demoJs];

const router = new VueRouter({
  routes,
  base: process.env.BASE_URL,
});

router.beforeEach((to, from, next) => {
  // console.log(to);
  // console.log(from);
  // console.log(next);
  if (to && from) {
    next();
  }
});

export default router;