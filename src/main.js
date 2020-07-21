import Vue from 'vue';
import Element from 'element-ui';
import animated from 'animate.css';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import App from './App';
import router from './router';
import store from './store';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/styles/public.css';

Vue.use(Element);
Vue.use(animated);
Vue.use(VueAwesomeSwiper);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#talent');