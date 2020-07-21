import Vue from 'vue';
import Element from 'element-ui';
import animated from 'animate.css';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import App from './App';
import router from './router';
import mixin from './mixin/global';
import CONST from './mixin/const';
import store from './store';
import $ajax from './ajax/index';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/styles/public.css';

Vue.use(Element);
Vue.use(animated);
Vue.use(VueAwesomeSwiper);

// 引入全局axios实例$ajax
window.$ajax = $ajax;
// 注入自定义minxin
Vue.mixin(mixin);

window.CONST = CONST;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#talent');