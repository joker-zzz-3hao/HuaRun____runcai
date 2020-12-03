import Vue from 'vue';
import Element from 'element-ui';
import animated from 'animate.css';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import { ElementTiptapPlugin } from 'element-tiptap';
import App from './App';
import router from './router';
import mixin from './mixin/global';
import store from './store/index';
import $ajax from './ajax/index';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/styles/public.css';
import 'swiper/swiper-bundle.css';
import directives from './directives/index';
// 全局组建注册
import crcloudTable from './components/crcloudTable';

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import 'element-tiptap/lib/index.css';

Vue.use(Element);
Vue.use(animated);
Vue.use(VueAwesomeSwiper);
Vue.component('crcloud-table', crcloudTable);

Vue.use(ElementTiptapPlugin, {
  lang: 'zh', // 见 i18n
  spellcheck: true, // 可被 editor 同名 prop 重写
});
// 按需引用echarts
const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/pie');

Vue.prototype.$echarts = echarts;
if (process.env.VUE_APP_PORTAL == 'https://talent.crcloud.com' || process.env.VUE_APP_PORTAL == 'https://cr-talent-uat.crcloud.com') {
  // eslint-disable-next-line func-names
  console.log = function () { };
}

// 引入全局axios实例$ajax
window.$ajax = $ajax;
// 注入自定义minxin
Vue.mixin(mixin);
// 注入自定义指令
directives(Vue);
window.$store = store;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#talent');