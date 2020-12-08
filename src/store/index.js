import Vue from 'vue';
import Vuex from 'vuex';
import common from './common/index';
import weekly from './weekly/index';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    common,
    weekly,
  },
});