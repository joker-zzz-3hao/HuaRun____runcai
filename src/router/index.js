import Vue from 'vue';
import VueRouter from 'vue-router';
import consoleJs from './console';

Vue.use(VueRouter);

const routes = [...consoleJs];

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